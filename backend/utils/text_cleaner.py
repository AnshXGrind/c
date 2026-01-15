"""
Text Cleaner Utility
Handles text normalization and cleaning for resumes and job descriptions.
"""

import re
import unicodedata
from typing import Optional


class TextCleaner:
    """
    Text cleaning and normalization utility for resume processing.
    Handles various formatting issues and standardizes text for analysis.
    """
    
    def __init__(self):
        """Initialize text cleaner with default settings."""
        # Common replacements for normalization
        self.unicode_replacements = {
            '\u2018': "'",  # Left single quote
            '\u2019': "'",  # Right single quote
            '\u201c': '"',  # Left double quote
            '\u201d': '"',  # Right double quote
            '\u2013': '-',  # En dash
            '\u2014': '-',  # Em dash
            '\u2026': '...',  # Ellipsis
            '\u00a0': ' ',  # Non-breaking space
            '\u200b': '',   # Zero-width space
            '\u00ad': '',   # Soft hyphen
            '\ufeff': '',   # BOM
        }
    
    def clean(self, text: str) -> str:
        """
        Full cleaning pipeline for text.
        
        Args:
            text: Raw text to clean
            
        Returns:
            Cleaned and normalized text
        """
        if not text:
            return ""
        
        # Apply cleaning steps in order
        text = self._normalize_unicode(text)
        text = self._remove_control_chars(text)
        text = self._fix_whitespace(text)
        text = self._normalize_bullets(text)
        text = self._fix_line_breaks(text)
        text = self._remove_excess_newlines(text)
        
        return text.strip()
    
    def clean_for_embedding(self, text: str) -> str:
        """
        Clean text specifically for embedding generation.
        More aggressive cleaning for better semantic matching.
        
        Args:
            text: Text to clean
            
        Returns:
            Cleaned text optimized for embeddings
        """
        text = self.clean(text)
        
        # Remove URLs
        text = re.sub(r'https?://\S+', '', text)
        text = re.sub(r'www\.\S+', '', text)
        
        # Remove email addresses
        text = re.sub(r'\S+@\S+\.\S+', '', text)
        
        # Remove phone numbers
        text = re.sub(r'\+?[\d\s\-\(\)]{10,}', '', text)
        
        # Remove common resume header patterns
        text = re.sub(r'^[A-Z][A-Z\s]+(?:\n|$)', '', text, flags=re.MULTILINE)
        
        # Collapse multiple spaces
        text = re.sub(r' +', ' ', text)
        
        return text.strip()
    
    def _normalize_unicode(self, text: str) -> str:
        """Normalize Unicode characters."""
        # Replace known problematic characters
        for old, new in self.unicode_replacements.items():
            text = text.replace(old, new)
        
        # Normalize to NFC form
        text = unicodedata.normalize('NFC', text)
        
        return text
    
    def _remove_control_chars(self, text: str) -> str:
        """Remove control characters except newlines and tabs."""
        result = []
        for char in text:
            if char in '\n\r\t' or not unicodedata.category(char).startswith('C'):
                result.append(char)
        return ''.join(result)
    
    def _fix_whitespace(self, text: str) -> str:
        """Fix whitespace issues."""
        # Replace tabs with spaces
        text = text.replace('\t', '    ')
        
        # Remove trailing whitespace from lines
        lines = [line.rstrip() for line in text.split('\n')]
        text = '\n'.join(lines)
        
        # Collapse multiple spaces (but preserve indentation)
        text = re.sub(r'(?<! ) +', ' ', text)
        
        return text
    
    def _normalize_bullets(self, text: str) -> str:
        """Normalize various bullet point styles."""
        bullet_chars = ['•', '●', '○', '■', '□', '▪', '▫', '►', '▸', '‣', '⁃', '◆', '◇', '★', '☆']
        
        for bullet in bullet_chars:
            text = text.replace(bullet, '•')
        
        # Also normalize common text bullets
        text = re.sub(r'^[\-\*\+]\s', '• ', text, flags=re.MULTILINE)
        
        return text
    
    def _fix_line_breaks(self, text: str) -> str:
        """Fix line break issues."""
        # Normalize different line endings
        text = text.replace('\r\n', '\n')
        text = text.replace('\r', '\n')
        
        # Fix broken sentences (line break in middle of sentence)
        # Only join if the previous line doesn't end with punctuation
        lines = text.split('\n')
        result = []
        
        for i, line in enumerate(lines):
            stripped = line.strip()
            if not stripped:
                result.append('')
                continue
            
            # Check if this should be joined with previous line
            if result and result[-1] and not result[-1].rstrip().endswith(('.', '!', '?', ':', ';', '•')):
                # Check if current line starts with lowercase
                if stripped and stripped[0].islower():
                    result[-1] = result[-1].rstrip() + ' ' + stripped
                    continue
            
            result.append(line)
        
        return '\n'.join(result)
    
    def _remove_excess_newlines(self, text: str) -> str:
        """Remove excessive blank lines."""
        # Replace 3+ consecutive newlines with 2
        text = re.sub(r'\n{3,}', '\n\n', text)
        return text
    
    def extract_contact_info(self, text: str) -> dict:
        """
        Extract contact information from resume text.
        
        Args:
            text: Resume text
            
        Returns:
            Dictionary with extracted contact info
        """
        info = {
            "email": None,
            "phone": None,
            "linkedin": None,
            "github": None
        }
        
        # Email
        email_match = re.search(r'\b[\w\.-]+@[\w\.-]+\.\w{2,}\b', text)
        if email_match:
            info["email"] = email_match.group()
        
        # Phone
        phone_match = re.search(r'\+?[\d\s\-\(\)]{10,15}', text)
        if phone_match:
            info["phone"] = phone_match.group().strip()
        
        # LinkedIn
        linkedin_match = re.search(r'linkedin\.com/in/[\w\-]+', text, re.IGNORECASE)
        if linkedin_match:
            info["linkedin"] = linkedin_match.group()
        
        # GitHub
        github_match = re.search(r'github\.com/[\w\-]+', text, re.IGNORECASE)
        if github_match:
            info["github"] = github_match.group()
        
        return info
    
    def split_into_sections(self, text: str) -> dict:
        """
        Split resume into logical sections.
        
        Args:
            text: Resume text
            
        Returns:
            Dictionary mapping section names to content
        """
        sections = {}
        
        section_headers = [
            r'(?i)^(summary|objective|profile)\s*:?\s*$',
            r'(?i)^(education|academic)\s*:?\s*$',
            r'(?i)^(experience|work\s*experience|employment|work\s*history)\s*:?\s*$',
            r'(?i)^(skills|technical\s*skills|core\s*competencies)\s*:?\s*$',
            r'(?i)^(projects|personal\s*projects|portfolio)\s*:?\s*$',
            r'(?i)^(certifications?|certificates?|licenses?)\s*:?\s*$',
            r'(?i)^(awards?|achievements?|honors?)\s*:?\s*$',
            r'(?i)^(publications?|papers?)\s*:?\s*$',
            r'(?i)^(languages?)\s*:?\s*$',
            r'(?i)^(interests?|hobbies?)\s*:?\s*$',
        ]
        
        lines = text.split('\n')
        current_section = "header"
        sections[current_section] = []
        
        for line in lines:
            stripped = line.strip()
            
            # Check if line is a section header
            is_header = False
            for pattern in section_headers:
                if re.match(pattern, stripped):
                    match = re.match(pattern, stripped)
                    section_name = match.group(1).lower().replace(' ', '_')
                    current_section = section_name
                    if current_section not in sections:
                        sections[current_section] = []
                    is_header = True
                    break
            
            if not is_header:
                sections[current_section].append(line)
        
        # Join lines and clean
        return {k: '\n'.join(v).strip() for k, v in sections.items() if v}
