import uuid
import logging
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.models.schemas import InterviewQuestionItem, InterviewSessionModel
from app.services.gemini_service import gemini_service

logger = logging.getLogger("careergap.interview_engine")

class InterviewEngine:
    def get_template_questions(self, role_title: str, matched_skills: List[str], gap_skills: List[str]) -> List[InterviewQuestionItem]:
        """Generates realistic fallback interview questions based on strengths and gaps."""
        questions = []
        q_num = 1
        
        strength_1 = matched_skills[0] if matched_skills else "Python"
        strength_2 = matched_skills[1] if len(matched_skills) > 1 else "Machine Learning"
        gap_1 = gap_skills[0] if gap_skills else "Docker"
        gap_2 = gap_skills[1] if len(gap_skills) > 1 else "System Design"

        # 1. Technical Strength Deep-Dive
        questions.append(InterviewQuestionItem(
            id=str(uuid.uuid4())[:8],
            questionNumber=q_num,
            question=f"In your recent projects utilizing {strength_1}, how did you handle performance bottlenecks, memory management, or scalability challenges?",
            category="Technical Strength (Deep Dive)",
            targetedSkill=strength_1,
            expectedKeyPoints=[
                f"Concrete profiling or benchmarking tools used in {strength_1}",
                "Specific optimization technique (e.g. vectorization, caching, indexing)",
                "Measurable latency, throughput, or memory reduction results"
            ]
        ))
        q_num += 1

        # 2. Technical Strength Architecture
        questions.append(InterviewQuestionItem(
            id=str(uuid.uuid4())[:8],
            questionNumber=q_num,
            question=f"Explain how you structured your {strength_2} workflow or pipeline from raw data ingestion to production inference or delivery.",
            category="Technical Strength (Pipeline & Architecture)",
            targetedSkill=strength_2,
            expectedKeyPoints=[
                "Data validation and schema guarantees",
                "Model training or processing modularity",
                "Monitoring and error fallback mechanisms"
            ]
        ))
        q_num += 1

        # 3. Gap Skill Check (Foundational / Practical)
        questions.append(InterviewQuestionItem(
            id=str(uuid.uuid4())[:8],
            questionNumber=q_num,
            question=f"For a production service requiring {gap_1}, what are the essential principles and containerization/isolation best practices you would follow?",
            category="Technical Gap (Core Check)",
            targetedSkill=gap_1,
            expectedKeyPoints=[
                f"Core mental model and concepts of {gap_1}",
                "Multi-stage builds, minimal base images, and secret isolation",
                "Networking and volume persistence management"
            ]
        ))
        q_num += 1

        # 4. Gap Skill Architecture Check
        questions.append(InterviewQuestionItem(
            id=str(uuid.uuid4())[:8],
            questionNumber=q_num,
            question=f"How would you integrate and test {gap_2} in an agile development workflow without introducing deployment downtime or regression?",
            category="Technical Gap (Integration & Reliability)",
            targetedSkill=gap_2,
            expectedKeyPoints=[
                "Gradual rollout / canary strategies",
                "Automated CI health checks and regression testing",
                "Clear rollback protocols"
            ]
        ))
        q_num += 1

        # 5. Behavioral Project Ownership
        questions.append(InterviewQuestionItem(
            id=str(uuid.uuid4())[:8],
            questionNumber=q_num,
            question=f"Describe a situation where a project or technical requirement for {role_title} was ambiguous. How did you clarify requirements and deliver on time?",
            category="Behavioral (Ownership & Communication)",
            targetedSkill="Communication & Ownership",
            expectedKeyPoints=[
                "Proactive stakeholder communication",
                "Breaking complex tasks into incremental milestones",
                "Delivering MVP on schedule and iterating"
            ]
        ))
        q_num += 1

        # 6. System Design / Seniority Check
        questions.append(InterviewQuestionItem(
            id=str(uuid.uuid4())[:8],
            questionNumber=q_num,
            question=f"How would you design a highly available, low-latency API endpoint tailored for the {role_title} domain that serves 10,000 requests per second?",
            category="System Design",
            targetedSkill="System Architecture",
            expectedKeyPoints=[
                "Load balancing and horizontal scaling",
                "Caching layer (Redis / Memcached)",
                "Database indexing and connection pooling"
            ]
        ))

        return questions

    async def generate_interview_session(self, analysis_id: str, role_title: str, matched_skills: List[str], gap_skills: List[str]) -> InterviewSessionModel:
        """Generates a complete mock interview session."""
        session_id = str(uuid.uuid4())
        questions = self.get_template_questions(role_title, matched_skills, gap_skills)
        
        return InterviewSessionModel(
            id=session_id,
            userId="user_default",
            analysisId=analysis_id,
            roleTitle=role_title,
            questions=questions,
            overallReadinessSignal="Ready for Practice",
            completedQuestionsCount=0,
            createdAt=datetime.utcnow().isoformat()
        )

    async def evaluate_answer(self, question: InterviewQuestionItem, user_answer: str) -> Dict[str, Any]:
        """Evaluates candidate typed answer against rubric (Relevance, Depth, Clarity 1-5)."""
        prompt = f"""
        Evaluate this candidate's interview answer for the role question below:
        
        Question: "{question.question}"
        Category: "{question.category}"
        Targeted Skill: "{question.targetedSkill}"
        Expected Points: {question.expectedKeyPoints}
        
        Candidate's Answer:
        \"\"\"{user_answer}\"\"\"
        
        Score the answer from 1 to 5 on:
        - relevance (1-5): Did they directly answer the prompt?
        - depth (1-5): Did they provide concrete technical details, trade-offs, or numbers?
        - clarity (1-5): Is the communication crisp, structured, and professional?
        
        Provide constructive feedback and a brief example snippet demonstrating how to level up the answer.
        
        Return JSON format:
        {{
          "scoreRelevance": 4,
          "scoreDepth": 3,
          "scoreClarity": 4,
          "totalScore": 3.7,
          "aiFeedback": "Clear explanation of the concept, but mentioning specific profiling tools and quantitative impact would increase depth.",
          "betterAnswerSnippet": "In my previous project, we profiled memory using memory-profiler and replaced nested loops with vector operations, reducing execution latency from 850ms to 120ms."
        }}
        """
        result = await gemini_service.generate_json(prompt, "You are a senior tech interviewer evaluating candidates with a standard rubric.")
        if result and "scoreRelevance" in result:
            return result

        # Heuristic fallback evaluation
        words = len(user_answer.split())
        rel = 4 if words > 15 else 2
        depth = 4 if words > 60 else (3 if words > 25 else 2)
        clarity = 4 if words > 20 else 3
        avg = round((rel + depth + clarity) / 3.0, 1)

        return {
            "scoreRelevance": rel,
            "scoreDepth": depth,
            "scoreClarity": clarity,
            "totalScore": avg,
            "aiFeedback": f"Good initial answer covering {question.targetedSkill}. To make it stand out to interviewers, cite a specific project example, mention metrics (e.g. latency/cost), and discuss technical trade-offs.",
            "betterAnswerSnippet": f"When implementing {question.targetedSkill}, I follow a test-driven approach with automated CI validation, ensuring resilient error recovery and measurable performance standards."
        }

interview_engine = InterviewEngine()
