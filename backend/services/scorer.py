"""
Resume Scoring Service
Calculates comprehensive match scores between resumes and job descriptions.
"""

from typing import Dict, List, Optional
import re
import numpy as np

from services.embedder import Embedder


class ResumeScorer:
    """
    Deterministic scoring system for resume-JD matching.
    Combines semantic similarity with keyword analysis for accurate scoring.
    """
    
    def __init__(self, embedder: Optional[Embedder] = None):
        """
        Initialize the scorer.
        
        Args:
            embedder: Embedder instance for semantic similarity. Creates new one if not provided.
        """
        self.embedder = embedder or Embedder()
        
        # Scoring weights (must sum to 1.0)
        self.weights = {
            "skills_match": 0.35,
            "experience_relevance": 0.25,
            "keyword_coverage": 0.20,
            "role_alignment": 0.20
        }
    
    def calculate_score(self, resume_text: str, jd_text: str) -> Dict:
        """
        Calculate comprehensive matching score.
        
        Args:
            resume_text: Cleaned resume text
            jd_text: Cleaned job description text
            
        Returns:
            Dictionary with overall score and sub-scores
        """
        # Calculate individual component scores
        skills_match = self._calculate_skills_match(resume_text, jd_text)
        experience_relevance = self._calculate_experience_relevance(resume_text, jd_text)
        keyword_coverage = self._calculate_keyword_coverage(resume_text, jd_text)
        role_alignment = self._calculate_role_alignment(resume_text, jd_text)
        
        # Calculate weighted overall score
        overall_score = (
            skills_match * self.weights["skills_match"] +
            experience_relevance * self.weights["experience_relevance"] +
            keyword_coverage * self.weights["keyword_coverage"] +
            role_alignment * self.weights["role_alignment"]
        )
        
        return {
            "overall_score": round(overall_score, 1),
            "skills_match": round(skills_match, 1),
            "experience_relevance": round(experience_relevance, 1),
            "keyword_coverage": round(keyword_coverage, 1),
            "role_alignment": round(role_alignment, 1),
            "weights": self.weights
        }
    
    def _calculate_skills_match(self, resume: str, jd: str) -> float:
        """
        Calculate skills matching score using semantic similarity.
        
        Extracts skill-related sections and compares them semantically.
        """
        # Extract skills sections
        resume_skills = self._extract_skills_section(resume)
        jd_requirements = self._extract_requirements_section(jd)
        
        if not resume_skills or not jd_requirements:
            # Fall back to full text comparison
            similarity = self.embedder.similarity(resume, jd)
            return min(similarity * 100, 100)
        
        # Calculate semantic similarity between skills sections
        similarity = self.embedder.similarity(resume_skills, jd_requirements)
        
        # Scale to 0-100
        return min(similarity * 120, 100)  # Slight boost for section-specific comparison
    
    def _calculate_experience_relevance(self, resume: str, jd: str) -> float:
        """
        Calculate how relevant the candidate's experience is to the role.
        
        Uses semantic similarity on experience sections.
        """
        # Extract experience section from resume
        experience_section = self._extract_experience_section(resume)
        
        if not experience_section:
            experience_section = resume
        
        # Calculate similarity
        similarity = self.embedder.similarity(experience_section, jd)
        
        # Look for years of experience match
        resume_years = self._extract_years_experience(resume)
        jd_years = self._extract_required_years(jd)
        
        years_bonus = 0
        if resume_years and jd_years:
            if resume_years >= jd_years:
                years_bonus = 10
            elif resume_years >= jd_years * 0.7:
                years_bonus = 5
        
        return min((similarity * 100) + years_bonus, 100)
    
    def _calculate_keyword_coverage(self, resume: str, jd: str) -> float:
        """
        Calculate what percentage of important JD keywords appear in resume.
        """
        # Extract important keywords from JD
        jd_keywords = self._extract_important_keywords(jd)
        
        if not jd_keywords:
            return 50.0  # Neutral score if no keywords found
        
        # Check coverage
        resume_lower = resume.lower()
        matched = sum(1 for kw in jd_keywords if kw.lower() in resume_lower)
        
        coverage = (matched / len(jd_keywords)) * 100
        return min(coverage, 100)
    
    def _calculate_role_alignment(self, resume: str, jd: str) -> float:
        """
        Calculate how well the resume aligns with the target role.
        
        Considers job titles, responsibilities, and overall semantic match.
        """
        # Extract job title from JD
        jd_title = self._extract_job_title(jd)
        
        # Check if similar titles appear in resume
        title_match = 0
        if jd_title:
            title_words = set(jd_title.lower().split())
            resume_lower = resume.lower()
            matched_words = sum(1 for word in title_words if word in resume_lower)
            title_match = (matched_words / max(len(title_words), 1)) * 30
        
        # Calculate overall semantic alignment
        overall_similarity = self.embedder.similarity(resume, jd)
        
        return min((overall_similarity * 70) + title_match, 100)
    
    def _extract_skills_section(self, text: str) -> str:
        """Extract skills-related content from text."""
        patterns = [
            r"(?i)(?:skills|technical skills|core competencies|technologies|tools)[:\s]*([^•\n]+(?:[\n•][^•\n]+)*)",
            r"(?i)(?:proficient in|experienced with|expertise in)[:\s]*([^.\n]+)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        return ""
    
    def _extract_requirements_section(self, text: str) -> str:
        """Extract requirements from job description."""
        patterns = [
            r"(?i)(?:requirements|qualifications|must have|required skills)[:\s]*(.+?)(?=\n\n|responsibilities|benefits|$)",
            r"(?i)(?:you will need|we are looking for|ideal candidate)[:\s]*(.+?)(?=\n\n|$)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()
        
        return text  # Return full text if no section found
    
    def _extract_experience_section(self, text: str) -> str:
        """Extract experience section from resume."""
        patterns = [
            r"(?i)(?:experience|work history|employment)[:\s]*(.+?)(?=\n\n(?:education|skills|projects)|$)",
            r"(?i)(?:professional experience|career history)[:\s]*(.+?)(?=\n\n|$)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.DOTALL)
            if match:
                return match.group(1).strip()
        
        return ""
    
    def _extract_years_experience(self, text: str) -> Optional[int]:
        """Extract years of experience from resume."""
        patterns = [
            r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)",
            r"(?:experience|exp)[:\s]*(\d+)\+?\s*(?:years?|yrs?)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return int(match.group(1))
        
        return None
    
    def _extract_required_years(self, text: str) -> Optional[int]:
        """Extract required years from job description."""
        patterns = [
            r"(\d+)\+?\s*(?:years?|yrs?)\s*(?:of)?\s*(?:experience|exp)",
            r"(?:minimum|at least)\s*(\d+)\s*(?:years?|yrs?)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                return int(match.group(1))
        
        return None
    
    def _extract_important_keywords(self, text: str) -> List[str]:
        """Extract important keywords from job description."""
        # Common tech keywords and skills
        tech_patterns = [
            r"\b(Python|Java|JavaScript|TypeScript|React|Angular|Vue|Node\.?js)\b",
            r"\b(AWS|Azure|GCP|Docker|Kubernetes|K8s)\b",
            r"\b(SQL|NoSQL|MongoDB|PostgreSQL|MySQL|Redis)\b",
            r"\b(Machine Learning|ML|AI|Deep Learning|NLP|Computer Vision)\b",
            r"\b(REST|GraphQL|API|Microservices)\b",
            r"\b(Git|CI/CD|DevOps|Agile|Scrum)\b",
            r"\b(TensorFlow|PyTorch|Scikit-learn|Pandas|NumPy)\b",
        ]
        
        keywords = set()
        for pattern in tech_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            keywords.update(match.lower() for match in matches)
        
        # Also extract capitalized multi-word terms
        multi_word = re.findall(r"\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)\b", text)
        keywords.update(term.lower() for term in multi_word if len(term) > 5)
        
        return list(keywords)
    
    def _extract_job_title(self, text: str) -> Optional[str]:
        """Extract job title from job description."""
        patterns = [
            r"(?i)(?:job title|position|role)[:\s]*([^\n]+)",
            r"(?i)^([^\n]+(?:engineer|developer|manager|analyst|designer|scientist)[^\n]*)",
        ]
        
        for pattern in patterns:
            match = re.search(pattern, text)
            if match:
                return match.group(1).strip()
        
        # Try first line
        first_line = text.split("\n")[0].strip()
        if len(first_line) < 100:  # Reasonable title length
            return first_line
        
        return None
    
    def get_detailed_analysis(
        self,
        resume_text: str,
        jd_text: str
    ) -> Dict:
        """
        Get detailed scoring analysis with explanations.
        
        Returns:
            Dictionary with scores, matched keywords, and analysis details
        """
        scores = self.calculate_score(resume_text, jd_text)
        
        # Additional analysis
        jd_keywords = self._extract_important_keywords(jd_text)
        resume_lower = resume_text.lower()
        
        matched_keywords = [kw for kw in jd_keywords if kw.lower() in resume_lower]
        missing_keywords = [kw for kw in jd_keywords if kw.lower() not in resume_lower]
        
        return {
            **scores,
            "matched_keywords": matched_keywords,
            "missing_keywords": missing_keywords,
            "jd_years_required": self._extract_required_years(jd_text),
            "resume_years_stated": self._extract_years_experience(resume_text),
            "job_title_detected": self._extract_job_title(jd_text)
        }
