import math
import re
from typing import List, Dict, Any, Tuple

# Comprehensive Skill Normalization Taxonomy
SKILL_TAXONOMY_ALIASES: Dict[str, str] = {
    "js": "JavaScript",
    "ts": "TypeScript",
    "py": "Python",
    "python3": "Python",
    "golang": "Go",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "mongo": "MongoDB",
    "mongodb": "MongoDB",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "dl": "Deep Learning",
    "deep learning": "Deep Learning",
    "nlp": "Natural Language Processing",
    "cv": "Computer Vision",
    "rag": "Retrieval Augmented Generation",
    "retrieval augmented generation": "Retrieval Augmented Generation",
    "llm": "Large Language Models",
    "llms": "Large Language Models",
    "genai": "Generative AI",
    "generative ai": "Generative AI",
    "fastapi": "FastAPI",
    "docker": "Docker",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "aws": "Amazon Web Services (AWS)",
    "gcp": "Google Cloud Platform (GCP)",
    "azure": "Microsoft Azure",
    "rest api": "RESTful APIs",
    "restful api": "RESTful APIs",
    "rest apis": "RESTful APIs",
    "graphql": "GraphQL",
    "ci/cd": "CI/CD Pipelines",
    "cicd": "CI/CD Pipelines",
    "tf": "TensorFlow",
    "tensorflow": "TensorFlow",
    "pytorch": "PyTorch",
    "torch": "PyTorch",
    "scikit-learn": "Scikit-Learn",
    "sklearn": "Scikit-Learn",
    "spark": "Apache Spark",
    "pyspark": "PySpark",
    "kafka": "Apache Kafka",
    "redis": "Redis",
    "sql": "SQL",
    "nosql": "NoSQL",
    "react": "React",
    "reactjs": "React",
    "vue": "Vue.js",
    "angular": "Angular",
    "nextjs": "Next.js",
    "node": "Node.js",
    "nodejs": "Node.js",
    "express": "Express.js",
    "django": "Django",
    "flask": "Flask",
    "linux": "Linux",
    "git": "Git",
    "system design": "System Design",
    "microservices": "Microservices Architecture",
    "data structures": "Data Structures & Algorithms"
}

# Skill Domain Relatedness Matrix for Semantic Proximity
RELATED_SKILL_CLUSTERS = [
    {"Python", "FastAPI", "Flask", "Django", "PyTorch", "TensorFlow", "Scikit-Learn", "Pandas", "NumPy", "Machine Learning"},
    {"Docker", "Kubernetes", "CI/CD Pipelines", "Linux", "Amazon Web Services (AWS)", "Google Cloud Platform (GCP)", "Microservices Architecture"},
    {"SQL", "PostgreSQL", "MySQL", "NoSQL", "MongoDB", "Redis", "Apache Spark"},
    {"Machine Learning", "Deep Learning", "Natural Language Processing", "Computer Vision", "Large Language Models", "Retrieval Augmented Generation", "Generative AI", "PyTorch"},
    {"JavaScript", "TypeScript", "React", "Next.js", "Node.js", "Vue.js", "GraphQL", "RESTful APIs"},
    {"RESTful APIs", "FastAPI", "GraphQL", "Microservices Architecture", "Node.js", "Express.js", "Django"}
]

class EmbeddingService:
    """
    Embedding and semantic similarity abstraction service.
    Can use SentenceTransformers, Gemini Embedding API, or vector cosine fallback.
    """
    def __init__(self):
        self.taxonomy = SKILL_TAXONOMY_ALIASES

    def normalize_skill(self, raw_skill: str) -> str:
        """
        Normalizes aliases (e.g. 'js' -> 'JavaScript', 'postgres' -> 'PostgreSQL').
        """
        if not raw_skill:
            return ""
        cleaned = re.sub(r'[^\w\s\-\/\+]', '', raw_skill.strip()).lower()
        if cleaned in self.taxonomy:
            return self.taxonomy[cleaned]
        for alias, canonical in self.taxonomy.items():
            if alias == cleaned or f" {alias} " in f" {cleaned} ":
                return canonical
        # Return title-cased if unknown
        return raw_skill.strip().title()

    def get_token_vector(self, text: str) -> Dict[str, float]:
        """Simple TF token vector representation for semantic vector cosine calculation."""
        words = re.findall(r'\b\w+\b', text.lower())
        vec: Dict[str, float] = {}
        for w in words:
            vec[w] = vec.get(w, 0.0) + 1.0
        norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
        return {k: v / norm for k, v in vec.items()}

    def cosine_similarity(self, vec1: Dict[str, float], vec2: Dict[str, float]) -> float:
        """Calculates cosine similarity between two unit vectors."""
        common = set(vec1.keys()).intersection(set(vec2.keys()))
        dot = sum(vec1[k] * vec2[k] for k in common)
        return max(0.0, min(1.0, dot))

    def calculate_skill_similarity(self, candidate_skill: str, requirement_skill: str) -> float:
        """
        Calculates semantic match similarity between a candidate skill and a required skill (0.0 to 1.0).
        Takes into account canonical normalization, sub-string matching, and domain cluster relatedness.
        """
        norm_cand = self.normalize_skill(candidate_skill).lower()
        norm_req = self.normalize_skill(requirement_skill).lower()

        if norm_cand == norm_req:
            return 1.0

        if norm_cand in norm_req or norm_req in norm_cand:
            return 0.88

        # Check cluster relatedness
        for cluster in RELATED_SKILL_CLUSTERS:
            lower_cluster = {s.lower() for s in cluster}
            if norm_cand in lower_cluster and norm_req in lower_cluster:
                return 0.72

        # Check token cosine similarity
        v1 = self.get_token_vector(norm_cand)
        v2 = self.get_token_vector(norm_req)
        cos = self.cosine_similarity(v1, v2)
        return cos

embedding_service = EmbeddingService()
