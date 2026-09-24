import urllib.parse
from typing import List, Dict, Any, Optional
from app.models.schemas import LearningResourceItem, LearningResourceType
from app.services.embedding_service import embedding_service

# Curated High-Yield Static Catalog of Verified Learning Resources
SKILLS_CATALOG_DATA: Dict[str, List[Dict[str, Any]]] = {
    "Docker": [
        {
            "title": "Official Docker 'Get Started' Documentation & Tutorial",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://docs.docker.com/get-started/",
            "platform": "Docker Official Docs",
            "estimatedHours": 3.0,
            "isFree": True
        },
        {
            "title": "Docker Tutorial for Beginners (FreeCodeCamp)",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=fqMOX6JJhGo",
            "platform": "YouTube - FreeCodeCamp",
            "estimatedHours": 3.5,
            "isFree": True
        },
        {
            "title": "Docker & Kubernetes: The Practical Guide",
            "type": LearningResourceType.COURSE,
            "url": "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/",
            "platform": "Udemy",
            "estimatedHours": 12.0,
            "isFree": False
        }
    ],
    "FastAPI": [
        {
            "title": "FastAPI Official Interactive Tutorial & User Guide",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://fastapi.tiangolo.com/tutorial/",
            "platform": "Tiangolo FastAPI Docs",
            "estimatedHours": 4.0,
            "isFree": True
        },
        {
            "title": "FastAPI Full Course - Python Web Development",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=0sOvCWFmrtA",
            "platform": "YouTube - freeCodeCamp",
            "estimatedHours": 5.0,
            "isFree": True
        },
        {
            "title": "Build REST APIs with FastAPI and Python",
            "type": LearningResourceType.COURSE,
            "url": "https://www.coursera.org/learn/fastapi",
            "platform": "Coursera",
            "estimatedHours": 8.0,
            "isFree": False
        }
    ],
    "Kubernetes": [
        {
            "title": "Kubernetes Basics & Interactive Tutorials",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://kubernetes.io/docs/tutorials/kubernetes-basics/",
            "platform": "Kubernetes Official",
            "estimatedHours": 5.0,
            "isFree": True
        },
        {
            "title": "Kubernetes Course for Beginners - TechWorld with Nana",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=X48VuDVv0do",
            "platform": "YouTube - TechWorld with Nana",
            "estimatedHours": 4.0,
            "isFree": True
        }
    ],
    "Amazon Web Services (AWS)": [
        {
            "title": "AWS Cloud Practitioner & Serverless Essentials",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://aws.amazon.com/getting-started/",
            "platform": "AWS Skill Builder",
            "estimatedHours": 6.0,
            "isFree": True
        },
        {
            "title": "AWS Certified Solutions Architect Associate (FreeCodeCamp)",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=Ia-UEYYR44s",
            "platform": "YouTube - freeCodeCamp",
            "estimatedHours": 10.0,
            "isFree": True
        }
    ],
    "PyTorch": [
        {
            "title": "Deep Learning with PyTorch: A 60 Minute Blitz",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://pytorch.org/tutorials/beginner/deep_learning_60min_blitz.html",
            "platform": "PyTorch.org",
            "estimatedHours": 2.5,
            "isFree": True
        },
        {
            "title": "PyTorch for Deep Learning Bootcamp (freeCodeCamp)",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=V_xro1bcAuA",
            "platform": "YouTube - Daniel Bourke",
            "estimatedHours": 8.0,
            "isFree": True
        }
    ],
    "Retrieval Augmented Generation": [
        {
            "title": "RAG Concepts & Architecture Handbook",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://python.langchain.com/docs/use_cases/question_answering/",
            "platform": "LangChain & LlamaIndex Docs",
            "estimatedHours": 4.0,
            "isFree": True
        },
        {
            "title": "Build Production-Ready RAG Applications from Scratch",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=tcqEUSNCn8I",
            "platform": "YouTube - AI Engineering",
            "estimatedHours": 3.0,
            "isFree": True
        }
    ],
    "SQL": [
        {
            "title": "PostgreSQL Official Tutorial & Window Functions",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://www.postgresql.org/docs/current/tutorial.html",
            "platform": "PostgreSQL Docs",
            "estimatedHours": 4.0,
            "isFree": True
        },
        {
            "title": "SQL Practice and Advanced Query Challenges",
            "type": LearningResourceType.PRACTICE,
            "url": "https://leetcode.com/problemset/database/",
            "platform": "LeetCode Database",
            "estimatedHours": 6.0,
            "isFree": True
        }
    ],
    "System Design": [
        {
            "title": "System Design Primer by Donne Martin",
            "type": LearningResourceType.DOCUMENTATION,
            "url": "https://github.com/donnemartin/system-design-primer",
            "platform": "GitHub Open Source",
            "estimatedHours": 8.0,
            "isFree": True
        },
        {
            "title": "System Design Interview Crash Course - ByteByteGo",
            "type": LearningResourceType.YOUTUBE,
            "url": "https://www.youtube.com/watch?v=i53Gi_K3o7I",
            "platform": "YouTube - ByteByteGo",
            "estimatedHours": 4.0,
            "isFree": True
        }
    ]
}

class ResourceMatcher:
    def get_resources_for_skill(self, raw_skill: str) -> List[LearningResourceItem]:
        """Looks up high quality curated resources or generates high-confidence structured queries."""
        normalized = embedding_service.normalize_skill(raw_skill)
        
        # Check direct lookup
        if normalized in SKILLS_CATALOG_DATA:
            return [LearningResourceItem(**item) for item in SKILLS_CATALOG_DATA[normalized]]

        # Check partial match
        for skill_key, items in SKILLS_CATALOG_DATA.items():
            if skill_key.lower() in normalized.lower() or normalized.lower() in skill_key.lower():
                return [LearningResourceItem(**item) for item in items]

        # Dynamic fallback generation with real search / docs URLs (never fake broken links)
        query = urllib.parse.quote(f"{normalized} tutorial for developers")
        yt_query = urllib.parse.quote(f"{normalized} crash course")
        
        return [
            LearningResourceItem(
                title=f"{normalized} Official Documentation & Getting Started",
                type=LearningResourceType.DOCUMENTATION,
                url=f"https://www.google.com/search?q={query}+official+documentation",
                platform="Official Documentation",
                estimatedHours=4.0,
                isFree=True
            ),
            LearningResourceItem(
                title=f"{normalized} Practical Video Crash Course",
                type=LearningResourceType.YOUTUBE,
                url=f"https://www.youtube.com/results?search_query={yt_query}",
                platform="YouTube Tech Channels",
                estimatedHours=3.5,
                isFree=True
            )
        ]

resource_matcher = ResourceMatcher()
