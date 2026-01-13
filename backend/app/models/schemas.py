"""
Pydantic Schemas for API
"""

from pydantic import BaseModel
from typing import List, Optional, Literal
from enum import Enum


class ImpactLevel(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"


class ImportanceLevel(str, Enum):
    CRITICAL = "critical"
    IMPORTANT = "important"
    NICE_TO_HAVE = "nice-to-have"


class SectionIcon(str, Enum):
    EXPERIENCE = "experience"
    SKILLS = "skills"
    EDUCATION = "education"
    PROJECTS = "projects"


class ResourceType(str, Enum):
    VIDEO = "video"
    COURSE = "course"
    CERTIFICATION = "certification"
    PROJECT = "project"


class DemandTrend(str, Enum):
    INCREASING = "increasing"
    STABLE = "stable"
    DECREASING = "decreasing"


# Resume Analysis Schemas
class SectionFeedback(BaseModel):
    name: str
    icon: SectionIcon
    score: int
    summary: str
    strengths: List[str]
    improvements: List[str]


class Improvement(BaseModel):
    title: str
    description: str
    impact: ImpactLevel


class ResumeAnalysisResponse(BaseModel):
    overallScore: int
    atsScore: int
    keywordScore: int
    formatScore: int
    contentScore: int
    verdictSummary: str
    sectionFeedback: List[SectionFeedback]
    keywordsFound: List[str]
    keywordsMissing: List[str]
    priorityImprovements: List[Improvement]


# Skills Gap Schemas
class SkillGap(BaseModel):
    name: str
    currentLevel: int
    requiredLevel: int
    importance: ImportanceLevel
    category: str


class LearningResource(BaseModel):
    title: str
    type: ResourceType
    provider: str
    url: str
    duration: str
    isFree: bool


class RoadmapItem(BaseModel):
    day: str
    title: str
    description: str
    skills: List[str]
    resources: List[LearningResource]


class Roadmap(BaseModel):
    phase1: List[RoadmapItem]
    phase2: List[RoadmapItem]
    phase3: List[RoadmapItem]


class SkillsGapResponse(BaseModel):
    currentSkills: List[str]
    missingSkills: List[SkillGap]
    weakSkills: List[SkillGap]
    highRoiSkills: List[SkillGap]
    roadmap: Roadmap


# Sample Resumes Schemas
class SampleResume(BaseModel):
    id: str
    name: str
    role: str
    company: str
    score: int
    highlights: List[str]
    pdfUrl: str


class SampleResumesResponse(BaseModel):
    samples: List[SampleResume]


# Job Market Schemas
class SkillDemand(BaseModel):
    name: str
    demand: int


class SalaryRange(BaseModel):
    min: int
    max: int
    currency: str = "USD"


class JobMarketResponse(BaseModel):
    role: str
    demandTrend: DemandTrend
    averageSalary: SalaryRange
    topSkills: List[SkillDemand]
    topCompanies: List[str]
    jobCount: int


# Report Schemas
class CareerReportRequest(BaseModel):
    analysis: ResumeAnalysisResponse
    skills_gap: Optional[SkillsGapResponse] = None


# Cover Letter Schemas
class CoverLetterResponse(BaseModel):
    cover_letter: str
