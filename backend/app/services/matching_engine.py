import uuid
import time
import asyncio
import logging
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional, Callable
from app.models.schemas import (
    FullAnalysisResult, SkillAnalysisItem, RequirementItem,
    ScoreBreakdown, SkillStatus, ImportanceLevel, EvidenceLevel,
    ResumeSuggestionItem, ProjectGapItem, RoadmapStepItem
)
from app.config import settings
from app.services.embedding_service import embedding_service
from app.services.evidence_engine import evidence_engine
from app.services.gap_engine import gap_engine
from app.services.roadmap_engine import roadmap_engine

logger = logging.getLogger("careergap.matching_engine")

class MatchingEngine:
    def calculate_transparent_score(
        self,
        skill_matrix: List[SkillAnalysisItem]
    ) -> Tuple[float, ScoreBreakdown]:
        """
        Calculates score transparently based on:
        - 40% Critical requirements
        - 30% High-priority requirements
        - 20% Medium requirements
        - 10% Evidence strength
        """
        crit_items = [s for s in skill_matrix if s.importance == ImportanceLevel.CRITICAL]
        high_items = [s for s in skill_matrix if s.importance == ImportanceLevel.HIGH]
        med_items = [s for s in skill_matrix if s.importance in [ImportanceLevel.MEDIUM, ImportanceLevel.OPTIONAL]]

        def score_group(items: List[SkillAnalysisItem], max_points: float) -> float:
            if not items:
                return max_points
            total = 0.0
            for it in items:
                if it.status == SkillStatus.MATCHED:
                    total += 1.0
                elif it.status == SkillStatus.WEAK:
                    total += 0.5
            return round((total / len(items)) * max_points, 1)

        crit_score = score_group(crit_items, 40.0)
        high_score = score_group(high_items, 30.0)
        med_score = score_group(med_items, 20.0)

        matched_or_weak = [s for s in skill_matrix if s.status != SkillStatus.MISSING]
        if not matched_or_weak:
            ev_score = 0.0
        else:
            strong_count = sum(1 for s in matched_or_weak if s.evidenceLevel == EvidenceLevel.STRONG)
            mod_count = sum(1 for s in matched_or_weak if s.evidenceLevel == EvidenceLevel.MODERATE)
            weak_count = sum(1 for s in matched_or_weak if s.evidenceLevel == EvidenceLevel.WEAK)
            ev_score = round(((strong_count * 1.0 + mod_count * 0.7 + weak_count * 0.3) / len(matched_or_weak)) * 10.0, 1)

        total = round(min(100.0, crit_score + high_score + med_score + ev_score), 1)

        breakdown = ScoreBreakdown(
            criticalSkills=crit_score,
            criticalMax=40.0,
            highPriority=high_score,
            highMax=30.0,
            mediumPriority=med_score,
            mediumMax=20.0,
            evidenceStrength=ev_score,
            evidenceMax=10.0,
            totalScore=total
        )
        return total, breakdown

    async def analyze(
        self,
        resume_text: str,
        detected_skills: List[str],
        job_requirements: List[RequirementItem],
        job_title: str,
        job_company: str,
        resume_id: str = None,
        job_id: str = None,
        progress_callback: Optional[Callable[[str, str, int, int], Any]] = None
    ) -> FullAnalysisResult:
        """
        Executes end-to-end explainable matching, evidence checking, gap detection, and roadmap building
        with granular stage callbacks and timing diagnostics.
        """
        t_start = time.perf_counter()

        if progress_callback:
            await progress_callback("comparing_skills", "Comparing candidate skills with target requirements...", 3, 5)

        t_matching_start = time.perf_counter()
        skill_matrix: List[SkillAnalysisItem] = []
        lower_resume = resume_text.lower()
        
        # Match each requirement against candidate skills and resume text
        for req in job_requirements:
            req_text = req.requirement
            req_skill = embedding_service.normalize_skill(req_text.split(" in ")[-1] if " in " in req_text else req_text.split()[-1])
            if len(req_skill) < 2:
                req_skill = req_text[:25]

            best_sim = 0.0
            for cand_skill in detected_skills:
                sim = embedding_service.calculate_skill_similarity(cand_skill, req_skill)
                if sim > best_sim:
                    best_sim = sim

            if req_skill.lower() in lower_resume and best_sim < 0.8:
                best_sim = 0.85

            ev_level, evidence_snippet, ev_rec = evidence_engine.evaluate_evidence(req_skill, resume_text)

            if best_sim >= 0.75:
                if ev_level in [EvidenceLevel.STRONG, EvidenceLevel.MODERATE] or best_sim >= 0.85:
                    status = SkillStatus.MATCHED
                    why = "Required in the job description and verified with evidence in your resume."
                else:
                    status = SkillStatus.WEAK
                    why = "Mentioned in your profile, but lacks extensive practical context or project demonstrations."
                req.matched = True
                req.evidence = evidence_snippet
            else:
                status = SkillStatus.MISSING
                why = "Explicitly required in the job description but not demonstrated in your profile."
                req.matched = False
                req.evidence = None

            skill_matrix.append(SkillAnalysisItem(
                skill=req_skill,
                status=status,
                importance=req.importance,
                evidenceLevel=ev_level,
                confidence="High" if best_sim > 0.8 else "Medium",
                matchedResumeText=evidence_snippet,
                whyItMatters=why,
                recommendation=ev_rec,
                category=req.category
            ))

        # Sort matrix: Critical/High missing first, then weak, then matched
        def sort_key(s: SkillAnalysisItem):
            status_order = {SkillStatus.MISSING: 0, SkillStatus.WEAK: 1, SkillStatus.MATCHED: 2}
            imp_order = {ImportanceLevel.CRITICAL: 0, ImportanceLevel.HIGH: 1, ImportanceLevel.MEDIUM: 2, ImportanceLevel.OPTIONAL: 3}
            return (status_order[s.status], imp_order[s.importance])

        skill_matrix.sort(key=sort_key)
        total_score, breakdown = self.calculate_transparent_score(skill_matrix)

        t_matching_elapsed = round(time.perf_counter() - t_matching_start, 3)
        logger.info(f"Semantic matching & scoring completed in {t_matching_elapsed}s")

        if progress_callback:
            await progress_callback("checking_evidence", "Verifying evidence strength, metrics, and citations...", 4, 5)

        matched_skills = [s.skill for s in skill_matrix if s.status == SkillStatus.MATCHED]
        missing_skills = [s.skill for s in skill_matrix if s.status == SkillStatus.MISSING]
        weak_skills = [s.skill for s in skill_matrix if s.status == SkillStatus.WEAK]
        crit_count = sum(1 for s in skill_matrix if s.importance == ImportanceLevel.CRITICAL)

        if progress_callback:
            await progress_callback("generating_roadmap", "Generating project proposals and roadmap milestones...", 5, 5)

        t_gen_start = time.perf_counter()
        
        # Parallelize project gap generation and roadmap synthesis
        project_gaps_task = asyncio.create_task(gap_engine.generate_projects_with_ai(missing_skills, job_title))
        roadmap = roadmap_engine.generate_roadmap_steps(missing_skills, weak_skills, job_title)
        project_gaps = await project_gaps_task
        
        t_gen_elapsed = round(time.perf_counter() - t_gen_start, 3)
        logger.info(f"Project proposals & roadmap completed in {t_gen_elapsed}s")

        # Resume Suggestions
        resume_suggestions = []
        for item in skill_matrix:
            if item.status == SkillStatus.WEAK and item.matchedResumeText:
                resume_suggestions.append(ResumeSuggestionItem(
                    originalText=item.matchedResumeText,
                    improvedText=f"Engineered and deployed an optimized {item.skill} module, enhancing data processing efficiency and system reliability.",
                    reason=f"Quantifies hands-on implementation of {item.skill} with action verbs and outcomes.",
                    targetedSkill=item.skill
                ))
        if not resume_suggestions and missing_skills:
            resume_suggestions.append(ResumeSuggestionItem(
                originalText="General software development tasks.",
                improvedText=f"Designed and built a full-stack service incorporating {missing_skills[0]}, following modern engineering practices and unit test coverage.",
                reason=f"Highlights practical experience in {missing_skills[0]} for this target position.",
                targetedSkill=missing_skills[0]
            ))

        analysis_id = str(uuid.uuid4())
        summary_para = f"Your profile demonstrates strong alignment with {len(matched_skills)} key requirements for the {job_title} role at {job_company}. Closing {len(missing_skills)} missing skills and elevating {len(weak_skills)} weak evidence areas via the recommended roadmap will raise your readiness from {total_score}% to 90%+."

        t_total = round(time.perf_counter() - t_start, 3)
        logger.info(f"Full analysis pipeline finished in {t_total}s (ID: {analysis_id})")

        return FullAnalysisResult(
            id=analysis_id,
            userId="user_default",
            resumeId=resume_id,
            jobId=job_id,
            jobTitle=job_title,
            jobCompany=job_company,
            readinessScore=total_score,
            scoreBreakdown=breakdown,
            matchedCount=len(matched_skills),
            missingCount=len(missing_skills),
            weakEvidenceCount=len(weak_skills),
            criticalRequirementsCount=crit_count,
            skillsMatrix=skill_matrix,
            requirements=job_requirements,
            projectGaps=project_gaps,
            roadmap=roadmap,
            resumeSuggestions=resume_suggestions,
            topStrengths=(matched_skills if matched_skills else weak_skills)[:5],
            primaryGaps=missing_skills[:5],
            summaryParagraph=summary_para,
            isShareable=False,
            shareToken=None,
            createdAt=datetime.utcnow().isoformat()
        )

matching_engine = MatchingEngine()
