"""
Resume Parser Module
Extracts text from PDF and DOCX files
"""

import re
from io import BytesIO
from typing import Dict, List, Optional
from pathlib import Path


class ResumeParser:
    """Parser for extracting text and structure from resume files"""
    
    def __init__(self):
        self.supported_formats = [".pdf", ".docx", ".doc", ".txt"]
    
    def parse(self, file_content: bytes, filename: str) -> Dict:
        """
        Parse resume file and extract structured data
        
        Args:
            file_content: Raw bytes of the file
            filename: Original filename with extension
            
        Returns:
            Dictionary with extracted text and sections
        """
        ext = Path(filename).suffix.lower()
        
        if ext == ".pdf":
            text = self._parse_pdf(file_content)
        elif ext in [".docx", ".doc"]:
            text = self._parse_docx(file_content)
        elif ext == ".txt":
            text = file_content.decode("utf-8", errors="ignore")
        else:
            raise ValueError(f"Unsupported file format: {ext}")
        
        return {
            "raw_text": text,
            "sections": self._extract_sections(text),
            "contact": self._extract_contact(text),
            "skills": self._extract_skills(text),
            "experience": self._extract_experience(text),
            "education": self._extract_education(text),
        }
    
    def _parse_pdf(self, content: bytes) -> str:
        """Extract text from PDF file"""
        try:
            import PyPDF2
            
            reader = PyPDF2.PdfReader(BytesIO(content))
            text = ""
            for page in reader.pages:
                text += page.extract_text() + "\n"
            return text.strip()
        except Exception as e:
            # Fallback for when PyPDF2 fails
            return self._basic_text_extraction(content)
    
    def _parse_docx(self, content: bytes) -> str:
        """Extract text from DOCX file"""
        try:
            from docx import Document
            
            doc = Document(BytesIO(content))
            paragraphs = [p.text for p in doc.paragraphs]
            return "\n".join(paragraphs).strip()
        except Exception as e:
            return self._basic_text_extraction(content)
    
    def _basic_text_extraction(self, content: bytes) -> str:
        """Basic text extraction fallback"""
        try:
            return content.decode("utf-8", errors="ignore")
        except:
            return ""
    
    def _extract_sections(self, text: str) -> Dict[str, str]:
        """Extract resume sections based on common headers"""
        sections = {}
        
        section_patterns = {
            "summary": r"(?:summary|profile|objective|about)\s*:?\s*(.*?)(?=\n(?:experience|education|skills|projects|$))",
            "experience": r"(?:experience|work\s*history|employment)\s*:?\s*(.*?)(?=\n(?:education|skills|projects|certifications|$))",
            "education": r"(?:education|academic|qualifications)\s*:?\s*(.*?)(?=\n(?:skills|projects|certifications|$))",
            "skills": r"(?:skills|technical\s*skills|competencies)\s*:?\s*(.*?)(?=\n(?:projects|certifications|achievements|$))",
            "projects": r"(?:projects|portfolio)\s*:?\s*(.*?)(?=\n(?:certifications|achievements|$))",
            "certifications": r"(?:certifications?|licenses?)\s*:?\s*(.*?)(?=\n(?:achievements|$))",
        }
        
        text_lower = text.lower()
        
        for section_name, pattern in section_patterns.items():
            match = re.search(pattern, text_lower, re.DOTALL | re.IGNORECASE)
            if match:
                sections[section_name] = match.group(1).strip()
        
        return sections
    
    def _extract_contact(self, text: str) -> Dict[str, Optional[str]]:
        """Extract contact information"""
        contact = {
            "email": None,
            "phone": None,
            "linkedin": None,
            "github": None,
            "location": None,
        }
        
        # Email
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        if email_match:
            contact["email"] = email_match.group()
        
        # Phone
        phone_match = re.search(
            r"(?:\+1\s?)?(?:\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}",
            text
        )
        if phone_match:
            contact["phone"] = phone_match.group()
        
        # LinkedIn
        linkedin_match = re.search(
            r"(?:linkedin\.com/in/|linkedin:\s*)([a-zA-Z0-9_-]+)",
            text,
            re.IGNORECASE
        )
        if linkedin_match:
            contact["linkedin"] = linkedin_match.group(1)
        
        # GitHub
        github_match = re.search(
            r"(?:github\.com/|github:\s*)([a-zA-Z0-9_-]+)",
            text,
            re.IGNORECASE
        )
        if github_match:
            contact["github"] = github_match.group(1)
        
        return contact
    
    def _extract_skills(self, text: str) -> List[str]:
        """Extract skills from resume text"""
        # Common technical skills to look for
        skill_patterns = [
            # Programming languages
            r"\b(python|javascript|typescript|java|c\+\+|c#|go|rust|ruby|php|swift|kotlin)\b",
            # Frameworks
            r"\b(react|angular|vue|next\.?js|node\.?js|express|django|flask|fastapi|spring|rails)\b",
            # Databases
            r"\b(sql|postgresql|mysql|mongodb|redis|elasticsearch|dynamodb|firebase)\b",
            # Cloud/DevOps
            r"\b(aws|azure|gcp|docker|kubernetes|terraform|jenkins|ci/cd|linux)\b",
            # Tools
            r"\b(git|github|gitlab|jira|figma|postman|vscode)\b",
            # Data/ML
            r"\b(machine\s*learning|deep\s*learning|tensorflow|pytorch|pandas|numpy|scikit-learn)\b",
        ]
        
        skills = set()
        text_lower = text.lower()
        
        for pattern in skill_patterns:
            matches = re.findall(pattern, text_lower)
            skills.update(match.strip() for match in matches)
        
        return list(skills)
    
    def _extract_experience(self, text: str) -> List[Dict]:
        """Extract work experience entries"""
        experience = []
        
        # Look for common experience patterns
        # This is a simplified extraction - production would use more sophisticated NLP
        experience_section = self._extract_sections(text).get("experience", "")
        
        if experience_section:
            # Split by common delimiters (dates, bullet points, etc.)
            entries = re.split(r"\n(?=\d{4}|•|–|-)", experience_section)
            
            for entry in entries[:5]:  # Limit to 5 entries
                if len(entry.strip()) > 20:
                    experience.append({
                        "raw": entry.strip()[:500],
                        "has_metrics": bool(re.search(r"\d+%|\$\d+|\d+\s*(?:users|customers|projects)", entry)),
                    })
        
        return experience
    
    def _extract_education(self, text: str) -> List[Dict]:
        """Extract education entries"""
        education = []
        
        education_section = self._extract_sections(text).get("education", "")
        
        # Look for degree patterns
        degree_patterns = [
            r"(bachelor|master|phd|ph\.d|b\.s\.?|m\.s\.?|b\.a\.?|m\.a\.?|mba)",
            r"(computer science|engineering|mathematics|business|economics|physics)",
        ]
        
        if education_section:
            for pattern in degree_patterns:
                matches = re.findall(pattern, education_section, re.IGNORECASE)
                for match in matches:
                    education.append({"type": match.lower()})
        
        return education
    
    def get_word_count(self, text: str) -> int:
        """Get word count of text"""
        return len(text.split())
    
    def has_required_sections(self, sections: Dict[str, str]) -> Dict[str, bool]:
        """Check which required sections are present"""
        required = ["summary", "experience", "education", "skills"]
        return {
            section: section in sections and len(sections[section]) > 20
            for section in required
        }
