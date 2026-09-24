import uuid
import logging
from typing import List, Dict, Any
from app.models.schemas import RoadmapStepItem
from app.services.embedding_service import embedding_service
from app.services.resource_matcher import resource_matcher
from app.services.gemini_service import gemini_service

logger = logging.getLogger("careergap.roadmap_engine")

class RoadmapEngine:
    def generate_roadmap_steps(self, missing_skills: List[str], weak_skills: List[str], target_role: str) -> List[RoadmapStepItem]:
        """
        Builds a sequential, milestone-driven career roadmap connecting gaps to verified resources and tasks.
        """
        steps: List[RoadmapStepItem] = []
        step_counter = 1

        all_skills_to_address = []
        for s in missing_skills:
            if s not in all_skills_to_address:
                all_skills_to_address.append((s, "Missing"))
        for s in weak_skills:
            if s not in [item[0] for item in all_skills_to_address]:
                all_skills_to_address.append((s, "Weak"))

        if not all_skills_to_address:
            all_skills_to_address = [("System Design", "Missing"), ("Cloud Deployment", "Weak")]

        # For each target skill gap, generate tailored learning & practical implementation steps
        for skill_name, status in all_skills_to_address[:4]:
            normalized = embedding_service.normalize_skill(skill_name)
            resources = resource_matcher.get_resources_for_skill(normalized)

            if status == "Missing":
                # Step A: Foundations
                steps.append(RoadmapStepItem(
                    id=str(uuid.uuid4())[:8],
                    stepNumber=step_counter,
                    skill=normalized,
                    title=f"Master Core Foundations of {normalized}",
                    reason=f"{normalized} is explicitly required for {target_role} but missing in your current profile.",
                    learningObjective=f"Understand key concepts, core CLI/APIs, and best practices for {normalized}.",
                    recommendedResources=resources,
                    practicalTask=f"Complete official tutorials and build a minimal standalone hello-world demo in {normalized}.",
                    estimatedHours=6.0,
                    isCompleted=False,
                    expectedImprovement=f"{normalized} → Basic Understanding"
                ))
                step_counter += 1

                # Step B: Hands-on implementation
                steps.append(RoadmapStepItem(
                    id=str(uuid.uuid4())[:8],
                    stepNumber=step_counter,
                    skill=normalized,
                    title=f"Build & Integrate a Practical Project with {normalized}",
                    reason=f"Demonstrate applied production proficiency in {normalized} rather than theoretical knowledge.",
                    learningObjective=f"Implement an end-to-end service or feature utilizing {normalized} alongside your existing strengths.",
                    recommendedResources=resources,
                    practicalTask=f"Integrate {normalized} into a real-world repository with error handling, logging, and unit tests.",
                    estimatedHours=10.0,
                    isCompleted=False,
                    expectedImprovement=f"{normalized} → Strong Evidence"
                ))
                step_counter += 1

            else:
                # Weak evidence improvement step
                steps.append(RoadmapStepItem(
                    id=str(uuid.uuid4())[:8],
                    stepNumber=step_counter,
                    skill=normalized,
                    title=f"Strengthen Proof & Measurable Impact for {normalized}",
                    reason=f"Your resume mentions {normalized}, but lacks metrics, architecture context, or production outcomes.",
                    learningObjective=f"Elevate your {normalized} evidence from a listed keyword to verified hands-on demonstration.",
                    recommendedResources=resources,
                    practicalTask=f"Add latency benchmarks, throughput metrics, or architectural scaling details to your {normalized} projects.",
                    estimatedHours=4.0,
                    isCompleted=False,
                    expectedImprovement=f"{normalized}: Weak Evidence → Strong Evidence"
                ))
                step_counter += 1

        # Final Capstone step: Resume and portfolio update
        steps.append(RoadmapStepItem(
            id=str(uuid.uuid4())[:8],
            stepNumber=step_counter,
            skill="Resume & Portfolio",
            title="Update Resume & Re-verify Readiness",
            reason="Translate your newly built projects and skills into high-impact, ATS-optimized resume bullet points.",
            learningObjective="Showcase verified project results with STAR format (Situation, Task, Action, Result).",
            recommendedResources=resource_matcher.get_resources_for_skill("System Design"),
            practicalTask="Update resume with quantified bullets and re-run CareerGap AI analysis to verify 90%+ readiness score.",
            estimatedHours=2.0,
            isCompleted=False,
            expectedImprovement="Overall Readiness Score → 90%+ Job Ready"
        ))

        return steps

roadmap_engine = RoadmapEngine()
