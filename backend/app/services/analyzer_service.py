"""
Resume Analyzer Service
"""

from typing import Optional, List, Dict, Any
import logging

from app.models.schemas import (
    ResumeAnalysisResponse,
    SectionFeedback,
    Improvement,
    SampleResume,
    ImpactLevel,
    SectionIcon,
)
from app.ml.analyzer import ResumeAnalyzer
from app.ml.parser import ResumeParser
from app.ml.keywords import KeywordExtractor, ROLE_KEYWORDS

logger = logging.getLogger(__name__)


class AnalyzerService:
    """Service for analyzing resumes"""
    
    def __init__(self, analyzer: Optional[ResumeAnalyzer] = None):
        self.analyzer = analyzer
        self.parser = ResumeParser()
        self.keyword_extractor = KeywordExtractor()
    
    async def analyze(
        self,
        content: bytes,
        extension: str,
        job_role: str
    ) -> ResumeAnalysisResponse:
        """
        Analyze a resume and return comprehensive feedback.
        """
        # Parse resume text
        text = self.parser.parse(content, extension)
        
        if not text or len(text.strip()) < 50:
            return self._get_error_response("Could not extract text from resume")
        
        # Extract sections
        sections = self.parser.extract_sections(text)
        
        # Get required keywords for role
        required_keywords = ROLE_KEYWORDS.get(job_role, ROLE_KEYWORDS["sde"])
        
        # Extract keywords from resume
        found_keywords = self.keyword_extractor.extract_skills(text)
        missing_keywords = [
            kw for kw in required_keywords 
            if kw.lower() not in [fk.lower() for fk in found_keywords]
        ][:10]
        
        # Calculate scores
        ats_score = self._calculate_ats_score(text, sections)
        keyword_score = self._calculate_keyword_score(found_keywords, required_keywords)
        format_score = self._calculate_format_score(text, sections)
        content_score = self._calculate_content_score(sections)
        
        overall_score = int(
            (ats_score * 0.3) +
            (keyword_score * 0.3) +
            (format_score * 0.2) +
            (content_score * 0.2)
        )
        
        # Generate section feedback
        section_feedback = self._generate_section_feedback(sections, text)
        
        # Generate improvements
        improvements = self._generate_improvements(
            sections, found_keywords, missing_keywords, overall_score
        )
        
        # Generate verdict
        verdict = self._generate_verdict(overall_score)
        
        return ResumeAnalysisResponse(
            overallScore=overall_score,
            atsScore=ats_score,
            keywordScore=keyword_score,
            formatScore=format_score,
            contentScore=content_score,
            verdictSummary=verdict,
            sectionFeedback=section_feedback,
            keywordsFound=found_keywords[:15],
            keywordsMissing=missing_keywords,
            priorityImprovements=improvements,
        )
    
    def _calculate_ats_score(self, text: str, sections: Dict) -> int:
        """Calculate ATS compatibility score"""
        score = 50  # Base score
        
        # Check for key sections
        if sections.get("contact"):
            score += 10
        if sections.get("experience"):
            score += 15
        if sections.get("skills"):
            score += 10
        if sections.get("education"):
            score += 10
        
        # Check formatting
        if len(text) > 300:
            score += 5
        
        return min(score, 100)
    
    def _calculate_keyword_score(
        self, found: List[str], required: List[str]
    ) -> int:
        """Calculate keyword match score"""
        if not required:
            return 50
        
        found_lower = [k.lower() for k in found]
        matched = sum(1 for kw in required if kw.lower() in found_lower)
        
        return min(int((matched / len(required)) * 100), 100)
    
    def _calculate_format_score(self, text: str, sections: Dict) -> int:
        """Calculate formatting score"""
        score = 60  # Base score
        
        # Check text length (not too short, not too long)
        word_count = len(text.split())
        if 200 <= word_count <= 800:
            score += 20
        elif word_count > 100:
            score += 10
        
        # Check section organization
        if len(sections) >= 3:
            score += 20
        
        return min(score, 100)
    
    def _calculate_content_score(self, sections: Dict) -> int:
        """Calculate content quality score"""
        score = 50
        
        # Check experience section
        exp = sections.get("experience", "")
        if len(exp) > 100:
            score += 15
        if any(word in exp.lower() for word in ["achieved", "improved", "developed", "led", "managed"]):
            score += 10
        
        # Check skills section
        skills = sections.get("skills", "")
        if len(skills) > 50:
            score += 15
        
        # Check for quantifiable achievements
        import re
        numbers = re.findall(r'\d+%|\d+\+|\$\d+', sections.get("experience", ""))
        if numbers:
            score += 10
        
        return min(score, 100)
    
    def _generate_section_feedback(
        self, sections: Dict, text: str
    ) -> List[SectionFeedback]:
        """Generate feedback for each resume section"""
        feedback = []
        
        # Experience feedback
        exp_text = sections.get("experience", "")
        exp_score = 70
        exp_strengths = []
        exp_improvements = []
        
        if exp_text:
            if len(exp_text) > 200:
                exp_strengths.append("Comprehensive work history")
                exp_score += 10
            if any(v in exp_text.lower() for v in ["developed", "built", "created", "implemented"]):
                exp_strengths.append("Good use of action verbs")
                exp_score += 5
        else:
            exp_score = 40
            exp_improvements.append("Add detailed work experience")
        
        import re
        if not re.findall(r'\d+%|\d+\+', exp_text):
            exp_improvements.append("Add quantifiable achievements (numbers, percentages)")
        else:
            exp_strengths.append("Includes quantified achievements")
            exp_score += 10
        
        if not exp_strengths:
            exp_strengths.append("Experience section present")
        if not exp_improvements:
            exp_improvements.append("Continue highlighting impact")
        
        feedback.append(SectionFeedback(
            name="Experience",
            icon=SectionIcon.EXPERIENCE,
            score=min(exp_score, 100),
            summary="Work experience section analysis",
            strengths=exp_strengths[:3],
            improvements=exp_improvements[:3],
        ))
        
        # Skills feedback
        skills_text = sections.get("skills", "")
        skills_score = 65
        skills_strengths = []
        skills_improvements = []
        
        if skills_text:
            skill_count = len(skills_text.split(","))
            if skill_count > 5:
                skills_strengths.append("Good variety of skills listed")
                skills_score += 15
            skills_strengths.append("Skills section present")
        else:
            skills_score = 40
            skills_improvements.append("Add a dedicated skills section")
        
        skills_improvements.append("Consider adding proficiency levels")
        
        feedback.append(SectionFeedback(
            name="Skills",
            icon=SectionIcon.SKILLS,
            score=min(skills_score, 100),
            summary="Technical and soft skills analysis",
            strengths=skills_strengths if skills_strengths else ["Basic skills mentioned"],
            improvements=skills_improvements[:3],
        ))
        
        # Education feedback
        edu_text = sections.get("education", "")
        edu_score = 75
        edu_strengths = ["Education section present"] if edu_text else []
        edu_improvements = []
        
        if edu_text:
            if "bachelor" in edu_text.lower() or "master" in edu_text.lower() or "degree" in edu_text.lower():
                edu_strengths.append("Degree information included")
                edu_score += 10
        else:
            edu_score = 50
            edu_improvements.append("Add education background")
        
        edu_improvements.append("Consider adding relevant coursework")
        
        feedback.append(SectionFeedback(
            name="Education",
            icon=SectionIcon.EDUCATION,
            score=min(edu_score, 100),
            summary="Educational background analysis",
            strengths=edu_strengths if edu_strengths else ["Section can be improved"],
            improvements=edu_improvements[:3],
        ))
        
        # Projects feedback
        projects_text = sections.get("projects", "")
        projects_score = 60
        projects_strengths = []
        projects_improvements = []
        
        if projects_text:
            projects_strengths.append("Projects section included")
            if "github" in projects_text.lower() or "http" in projects_text.lower():
                projects_strengths.append("Links to projects provided")
                projects_score += 20
        else:
            projects_improvements.append("Add a projects section")
            projects_score = 40
        
        projects_improvements.append("Add more technical details to projects")
        
        feedback.append(SectionFeedback(
            name="Projects",
            icon=SectionIcon.PROJECTS,
            score=min(projects_score, 100),
            summary="Personal and professional projects analysis",
            strengths=projects_strengths if projects_strengths else ["Consider adding projects"],
            improvements=projects_improvements[:3],
        ))
        
        return feedback
    
    def _generate_improvements(
        self,
        sections: Dict,
        found_keywords: List[str],
        missing_keywords: List[str],
        score: int
    ) -> List[Improvement]:
        """Generate prioritized improvements"""
        improvements = []
        
        if missing_keywords:
            improvements.append(Improvement(
                title="Add Missing Critical Keywords",
                description=f"Include {', '.join(missing_keywords[:3])} in your resume to match job requirements.",
                impact=ImpactLevel.HIGH,
            ))
        
        exp = sections.get("experience", "")
        import re
        if not re.findall(r'\d+%|\d+\+|\$\d+', exp):
            improvements.append(Improvement(
                title="Quantify Your Achievements",
                description="Add specific numbers and percentages to your accomplishments (e.g., 'Improved load time by 40%').",
                impact=ImpactLevel.HIGH,
            ))
        
        if not sections.get("projects"):
            improvements.append(Improvement(
                title="Add Projects Section",
                description="Include personal or professional projects with technical details and links.",
                impact=ImpactLevel.MEDIUM,
            ))
        
        if score < 80:
            improvements.append(Improvement(
                title="Optimize Summary Section",
                description="Add a compelling professional summary highlighting your key strengths.",
                impact=ImpactLevel.MEDIUM,
            ))
        
        improvements.append(Improvement(
            title="Add Certifications",
            description="Consider relevant certifications to stand out from other candidates.",
            impact=ImpactLevel.LOW,
        ))
        
        return improvements[:5]
    
    def _generate_verdict(self, score: int) -> str:
        """Generate verdict summary"""
        if score >= 80:
            return "Your resume is well-optimized and ready for recruiters. Minor improvements could help you stand out even more."
        elif score >= 60:
            return "Your resume is good but needs some improvements. Focus on the highlighted areas to increase your chances."
        elif score >= 40:
            return "Your resume needs significant improvement. Address the critical issues to avoid automatic rejections."
        else:
            return "Your resume has major issues that will likely lead to rejection. Please review and address all recommendations."
    
    def _get_error_response(self, message: str) -> ResumeAnalysisResponse:
        """Return error response"""
        return ResumeAnalysisResponse(
            overallScore=0,
            atsScore=0,
            keywordScore=0,
            formatScore=0,
            contentScore=0,
            verdictSummary=message,
            sectionFeedback=[],
            keywordsFound=[],
            keywordsMissing=[],
            priorityImprovements=[],
        )
    
    def get_sample_resumes(self, job_role: str) -> List[SampleResume]:
        """Get sample resumes for a job role"""
        samples = {
            "sde": [
                SampleResume(
                    id="1",
                    name="Alex Thompson",
                    role="Senior Software Engineer",
                    company="Google",
                    score=95,
                    highlights=[
                        "Clear quantified achievements",
                        "Perfect keyword optimization",
                        "Excellent project showcase",
                    ],
                    pdfUrl="#",
                ),
                SampleResume(
                    id="2",
                    name="Sarah Chen",
                    role="Software Engineer",
                    company="Meta",
                    score=92,
                    highlights=[
                        "Strong technical skills section",
                        "Great use of action verbs",
                        "Impactful summary statement",
                    ],
                    pdfUrl="#",
                ),
                SampleResume(
                    id="3",
                    name="Michael Park",
                    role="Full Stack Developer",
                    company="Amazon",
                    score=90,
                    highlights=[
                        "Excellent project descriptions",
                        "Well-organized layout",
                        "Relevant certifications",
                    ],
                    pdfUrl="#",
                ),
            ],
        }
        
        return samples.get(job_role, samples["sde"])
    
    async def generate_cover_letter(
        self,
        content: bytes,
        extension: str,
        job_description: str,
        company_name: str
    ) -> str:
        """Generate a personalized cover letter"""
        text = self.parser.parse(content, extension)
        skills = self.keyword_extractor.extract_skills(text)
        
        # Basic template-based generation (can be enhanced with LLM)
        cover_letter = f"""Dear Hiring Manager,

I am writing to express my strong interest in the position at {company_name}. With my background in {', '.join(skills[:3])} and proven track record of delivering results, I am confident in my ability to contribute to your team.

Throughout my career, I have developed expertise in {', '.join(skills[:5])}. I am particularly excited about this opportunity because it aligns with my professional goals and allows me to leverage my skills in a meaningful way.

I would welcome the opportunity to discuss how my experience and skills can benefit {company_name}. Thank you for considering my application.

Best regards,
[Your Name]
"""
        
        return cover_letter
