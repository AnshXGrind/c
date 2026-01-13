"""
Skills Gap Analysis Service
"""

from typing import Optional, List, Dict
import logging

from app.models.schemas import (
    SkillsGapResponse,
    SkillGap,
    Roadmap,
    RoadmapItem,
    LearningResource,
    ImportanceLevel,
    ResourceType,
)
from app.ml.analyzer import ResumeAnalyzer
from app.ml.parser import ResumeParser
from app.ml.keywords import KeywordExtractor, ROLE_KEYWORDS, SKILL_CATEGORIES

logger = logging.getLogger(__name__)


LEARNING_RESOURCES = {
    "TypeScript": [
        LearningResource(
            title="TypeScript Full Course for Beginners",
            type=ResourceType.VIDEO,
            provider="YouTube - freeCodeCamp",
            url="https://youtube.com/watch?v=gp5H0Vw39yw",
            duration="5h",
            isFree=True,
        ),
        LearningResource(
            title="Understanding TypeScript",
            type=ResourceType.COURSE,
            provider="Udemy",
            url="https://udemy.com/course/understanding-typescript/",
            duration="15h",
            isFree=False,
        ),
    ],
    "AWS": [
        LearningResource(
            title="AWS Certified Developer - Associate",
            type=ResourceType.CERTIFICATION,
            provider="AWS",
            url="https://aws.amazon.com/certification/certified-developer-associate/",
            duration="40h",
            isFree=False,
        ),
        LearningResource(
            title="AWS Fundamentals",
            type=ResourceType.COURSE,
            provider="Coursera",
            url="https://coursera.org/specializations/aws-fundamentals",
            duration="16h",
            isFree=True,
        ),
    ],
    "Docker": [
        LearningResource(
            title="Docker Tutorial for Beginners",
            type=ResourceType.VIDEO,
            provider="YouTube - TechWorld with Nana",
            url="https://youtube.com/watch?v=3c-iBn73dDE",
            duration="3h",
            isFree=True,
        ),
        LearningResource(
            title="Docker Mastery",
            type=ResourceType.COURSE,
            provider="Udemy",
            url="https://udemy.com/course/docker-mastery/",
            duration="20h",
            isFree=False,
        ),
    ],
    "System Design": [
        LearningResource(
            title="System Design Primer",
            type=ResourceType.COURSE,
            provider="GitHub",
            url="https://github.com/donnemartin/system-design-primer",
            duration="40h",
            isFree=True,
        ),
        LearningResource(
            title="Grokking System Design Interview",
            type=ResourceType.COURSE,
            provider="Educative",
            url="https://educative.io/courses/grokking-the-system-design-interview",
            duration="20h",
            isFree=False,
        ),
    ],
    "Kubernetes": [
        LearningResource(
            title="Kubernetes Tutorial for Beginners",
            type=ResourceType.VIDEO,
            provider="YouTube",
            url="https://youtube.com/watch?v=X48VuDVv0do",
            duration="4h",
            isFree=True,
        ),
        LearningResource(
            title="Certified Kubernetes Administrator (CKA)",
            type=ResourceType.CERTIFICATION,
            provider="CNCF",
            url="https://www.cncf.io/certification/cka/",
            duration="60h",
            isFree=False,
        ),
    ],
}


class SkillsService:
    """Service for skills gap analysis"""
    
    def __init__(self, analyzer: Optional[ResumeAnalyzer] = None):
        self.analyzer = analyzer
        self.parser = ResumeParser()
        self.keyword_extractor = KeywordExtractor()
    
    async def analyze_gap(
        self,
        content: bytes,
        extension: str,
        job_role: str
    ) -> SkillsGapResponse:
        """Analyze skills gap and generate roadmap"""
        
        # Parse resume
        text = self.parser.parse(content, extension)
        
        # Extract current skills
        current_skills = self.keyword_extractor.extract_skills(text)
        
        # Get required skills for role
        required_skills = ROLE_KEYWORDS.get(job_role, ROLE_KEYWORDS["sde"])
        
        # Calculate skill gaps
        missing_skills = []
        weak_skills = []
        high_roi_skills = []
        
        current_skills_lower = [s.lower() for s in current_skills]
        
        for skill in required_skills:
            if skill.lower() not in current_skills_lower:
                # Determine importance
                importance = self._get_skill_importance(skill, job_role)
                category = self._get_skill_category(skill)
                
                skill_gap = SkillGap(
                    name=skill,
                    currentLevel=0,
                    requiredLevel=80,
                    importance=importance,
                    category=category,
                )
                
                missing_skills.append(skill_gap)
                
                if importance == ImportanceLevel.CRITICAL:
                    high_roi_skills.append(skill_gap)
        
        # Add some weak skills (skills present but need improvement)
        for skill in current_skills[:3]:
            category = self._get_skill_category(skill)
            weak_skills.append(SkillGap(
                name=skill,
                currentLevel=50,
                requiredLevel=80,
                importance=ImportanceLevel.IMPORTANT,
                category=category,
            ))
        
        # Generate roadmap
        roadmap = self._generate_roadmap(missing_skills, high_roi_skills)
        
        return SkillsGapResponse(
            currentSkills=current_skills,
            missingSkills=missing_skills[:8],
            weakSkills=weak_skills[:4],
            highRoiSkills=high_roi_skills[:5],
            roadmap=roadmap,
        )
    
    def _get_skill_importance(self, skill: str, job_role: str) -> ImportanceLevel:
        """Determine skill importance for a role"""
        critical_skills = {
            "sde": ["Python", "JavaScript", "TypeScript", "AWS", "System Design"],
            "frontend": ["React", "TypeScript", "CSS", "JavaScript", "Next.js"],
            "backend": ["Node.js", "Python", "SQL", "AWS", "Docker"],
            "devops": ["Docker", "Kubernetes", "AWS", "CI/CD", "Terraform"],
            "ml-engineer": ["Python", "TensorFlow", "PyTorch", "SQL", "AWS"],
        }
        
        role_critical = critical_skills.get(job_role, critical_skills["sde"])
        
        if skill in role_critical:
            return ImportanceLevel.CRITICAL
        elif any(c in skill.lower() for c in ["cloud", "api", "database"]):
            return ImportanceLevel.IMPORTANT
        else:
            return ImportanceLevel.NICE_TO_HAVE
    
    def _get_skill_category(self, skill: str) -> str:
        """Get category for a skill"""
        for category, skills in SKILL_CATEGORIES.items():
            if skill in skills:
                return category
        return "Other"
    
    def _generate_roadmap(
        self,
        missing_skills: List[SkillGap],
        high_roi_skills: List[SkillGap]
    ) -> Roadmap:
        """Generate a 90-day learning roadmap"""
        
        # Phase 1: Foundation (Days 1-30)
        phase1_skills = [s for s in missing_skills if s.importance == ImportanceLevel.CRITICAL][:2]
        phase1 = [
            RoadmapItem(
                day="Days 1-30",
                title="Foundation Building",
                description="Focus on critical skills that form the foundation of your target role",
                skills=[s.name for s in phase1_skills],
                resources=self._get_resources_for_skills([s.name for s in phase1_skills]),
            )
        ]
        
        # Phase 2: Growth (Days 31-60)
        phase2_skills = [s for s in missing_skills if s.importance == ImportanceLevel.IMPORTANT][:2]
        phase2 = [
            RoadmapItem(
                day="Days 31-60",
                title="Skill Expansion",
                description="Build on your foundation with important complementary skills",
                skills=[s.name for s in phase2_skills],
                resources=self._get_resources_for_skills([s.name for s in phase2_skills]),
            )
        ]
        
        # Phase 3: Mastery (Days 61-90)
        phase3 = [
            RoadmapItem(
                day="Days 61-90",
                title="Project Building & Mastery",
                description="Apply your skills to real projects and prepare for interviews",
                skills=["Portfolio Projects", "System Design", "Interview Prep"],
                resources=[
                    LearningResource(
                        title="Build a Full-Stack Application",
                        type=ResourceType.PROJECT,
                        provider="Self-guided",
                        url="#",
                        duration="30h",
                        isFree=True,
                    ),
                    LearningResource(
                        title="LeetCode Premium",
                        type=ResourceType.COURSE,
                        provider="LeetCode",
                        url="https://leetcode.com/",
                        duration="Ongoing",
                        isFree=False,
                    ),
                ],
            )
        ]
        
        return Roadmap(phase1=phase1, phase2=phase2, phase3=phase3)
    
    def _get_resources_for_skills(self, skills: List[str]) -> List[LearningResource]:
        """Get learning resources for given skills"""
        resources = []
        for skill in skills:
            if skill in LEARNING_RESOURCES:
                resources.extend(LEARNING_RESOURCES[skill][:2])
        
        if not resources:
            # Default resources
            resources = [
                LearningResource(
                    title=f"Learn {skills[0] if skills else 'Programming'}",
                    type=ResourceType.COURSE,
                    provider="Various",
                    url="#",
                    duration="10h",
                    isFree=True,
                )
            ]
        
        return resources[:4]
