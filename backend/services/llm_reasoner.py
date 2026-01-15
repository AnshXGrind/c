"""
LLM Reasoning Service
Handles AI-powered explanations and roadmap generation using Groq or OpenAI.
"""

import os
import json
from typing import Dict, List, Optional

import httpx


class LLMReasoner:
    """
    LLM-powered reasoning service for generating explanations and roadmaps.
    Supports Groq (default) and OpenAI as providers.
    """
    
    def __init__(self):
        """Initialize the LLM reasoner with API configuration."""
        self.provider = os.getenv("LLM_PROVIDER", "groq").lower()
        
        if self.provider == "groq":
            self.api_key = os.getenv("GROQ_API_KEY", "")
            self.api_url = "https://api.groq.com/openai/v1/chat/completions"
            self.model = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
        else:
            self.api_key = os.getenv("OPENAI_API_KEY", "")
            self.api_url = "https://api.openai.com/v1/chat/completions"
            self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
        
        self.timeout = 60.0
        
        # Load prompt templates
        self.prompts = self._load_prompts()
    
    def _load_prompts(self) -> Dict[str, str]:
        """Load prompt templates from files."""
        prompts = {}
        prompts_dir = os.path.join(os.path.dirname(__file__), "..", "prompts")
        
        prompt_files = {
            "rejection": "explain_rejection.txt",
            "roadmap": "learning_roadmap.txt"
        }
        
        for key, filename in prompt_files.items():
            filepath = os.path.join(prompts_dir, filename)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    prompts[key] = f.read()
            except FileNotFoundError:
                prompts[key] = self._get_default_prompt(key)
        
        return prompts
    
    def _get_default_prompt(self, prompt_type: str) -> str:
        """Return default prompt if file not found."""
        defaults = {
            "rejection": """Analyze why this resume might be rejected for the given job.

Resume Score: {score}
Skills Match: {skills_match}%
Experience Relevance: {experience_relevance}%
Keyword Coverage: {keyword_coverage}%
Role Alignment: {role_alignment}%

Missing Skills: {missing_skills}

Based ONLY on the factual data above, provide specific, actionable rejection reasons.
Do NOT fabricate or assume information not provided.

Output as JSON array of strings, each being a specific reason.""",

            "roadmap": """Create a 30-60-90 day learning roadmap for these missing skills: {missing_skills}

Target Role Context: {job_context}
Current Match Score: {score}%

Provide a structured learning plan with:
- Days 1-30: Foundation skills
- Days 31-60: Intermediate skills  
- Days 61-90: Advanced skills

For each skill, include ONLY free resources:
- Official documentation
- YouTube tutorials
- Free courses (Coursera audit, edX, freeCodeCamp)
- GitHub repositories

Output as JSON with this structure:
{{
  "days_1_30": [{{
    "skill": "skill name",
    "priority": "high/medium/low",
    "resources": [{{
      "name": "resource name",
      "url": "url",
      "type": "video/article/course/docs"
    }}],
    "estimated_hours": number
  }}],
  "days_31_60": [...],
  "days_61_90": [...]
}}"""
        }
        return defaults.get(prompt_type, "")
    
    async def _call_llm(self, messages: List[Dict], temperature: float = 0.3) -> str:
        """Make API call to LLM provider."""
        if not self.api_key:
            return self._fallback_response()
        
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": 2000
        }
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                response = await client.post(
                    self.api_url,
                    headers=headers,
                    json=payload
                )
                response.raise_for_status()
                
                data = response.json()
                return data["choices"][0]["message"]["content"]
            except Exception as e:
                print(f"LLM API error: {e}")
                return self._fallback_response()
    
    def _fallback_response(self) -> str:
        """Return fallback response when API is unavailable."""
        return json.dumps({
            "error": "LLM service unavailable",
            "message": "Please configure API keys for Groq or OpenAI"
        })
    
    async def explain_rejection(
        self,
        score_data: Dict,
        missing_skills: List[str],
        resume_text: str,
        jd_text: str
    ) -> List[str]:
        """
        Generate factual rejection explanations based on scoring data.
        
        Args:
            score_data: Scoring results from ResumeScorer
            missing_skills: List of missing skills
            resume_text: Cleaned resume text
            jd_text: Job description text
            
        Returns:
            List of specific rejection reasons
        """
        prompt = self.prompts["rejection"].format(
            score=score_data.get("overall_score", 0),
            skills_match=score_data.get("skills_match", 0),
            experience_relevance=score_data.get("experience_relevance", 0),
            keyword_coverage=score_data.get("keyword_coverage", 0),
            role_alignment=score_data.get("role_alignment", 0),
            missing_skills=", ".join(missing_skills) if missing_skills else "None detected"
        )
        
        system_message = """You are a professional HR analyst. Analyze resume-job matches factually.
CRITICAL RULES:
1. Only cite facts from the provided data
2. Never fabricate or assume information
3. Be specific and actionable
4. Output valid JSON only - an array of strings"""
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_llm(messages, temperature=0.2)
        
        try:
            # Parse JSON response
            reasons = json.loads(response)
            if isinstance(reasons, list):
                return reasons
            elif isinstance(reasons, dict) and "reasons" in reasons:
                return reasons["reasons"]
        except json.JSONDecodeError:
            # Extract bullet points if JSON parsing fails
            lines = response.split("\n")
            reasons = [
                line.strip().lstrip("•-*0123456789. ")
                for line in lines
                if line.strip() and len(line.strip()) > 10
            ]
            return reasons[:5] if reasons else self._generate_fallback_reasons(score_data, missing_skills)
        
        return self._generate_fallback_reasons(score_data, missing_skills)
    
    def _generate_fallback_reasons(
        self,
        score_data: Dict,
        missing_skills: List[str]
    ) -> List[str]:
        """Generate rejection reasons without LLM (fallback)."""
        reasons = []
        
        if score_data.get("skills_match", 100) < 50:
            reasons.append(
                f"Skills match is only {score_data['skills_match']}%. "
                "Key technical skills required for the role are not evident in the resume."
            )
        
        if score_data.get("experience_relevance", 100) < 50:
            reasons.append(
                f"Experience relevance is {score_data['experience_relevance']}%. "
                "Work history doesn't strongly align with the role requirements."
            )
        
        if score_data.get("keyword_coverage", 100) < 50:
            reasons.append(
                f"Keyword coverage is {score_data['keyword_coverage']}%. "
                "Resume doesn't include many of the key terms from the job description."
            )
        
        if missing_skills:
            top_missing = missing_skills[:3]
            reasons.append(
                f"Missing critical skills: {', '.join(top_missing)}"
            )
        
        if not reasons:
            reasons.append(
                f"Overall match score of {score_data.get('overall_score', 0)}% "
                "indicates the resume needs improvement for this role."
            )
        
        return reasons
    
    async def generate_roadmap(
        self,
        missing_skills: List[str],
        score_data: Dict,
        job_context: str
    ) -> Dict:
        """
        Generate a 30-60-90 day learning roadmap.
        
        Args:
            missing_skills: List of skills to learn
            score_data: Current scoring data
            job_context: Job description or role context
            
        Returns:
            Structured roadmap dictionary
        """
        if not missing_skills:
            return self._generate_empty_roadmap()
        
        prompt = self.prompts["roadmap"].format(
            missing_skills=", ".join(missing_skills),
            job_context=job_context[:500] if job_context else "Not specified",
            score=score_data.get("overall_score", 0)
        )
        
        system_message = """You are a career development expert and technical mentor.
Create actionable, realistic learning roadmaps.
CRITICAL RULES:
1. Only recommend FREE resources
2. Prioritize official documentation and reputable sources
3. Include realistic time estimates
4. Output valid JSON only"""
        
        messages = [
            {"role": "system", "content": system_message},
            {"role": "user", "content": prompt}
        ]
        
        response = await self._call_llm(messages, temperature=0.4)
        
        try:
            roadmap = json.loads(response)
            return self._validate_roadmap(roadmap)
        except json.JSONDecodeError:
            return self._generate_fallback_roadmap(missing_skills)
    
    def _validate_roadmap(self, roadmap: Dict) -> Dict:
        """Validate and clean roadmap structure."""
        required_keys = ["days_1_30", "days_31_60", "days_61_90"]
        
        validated = {}
        for key in required_keys:
            if key in roadmap:
                validated[key] = roadmap[key]
            else:
                validated[key] = []
        
        return validated
    
    def _generate_empty_roadmap(self) -> Dict:
        """Generate empty roadmap when no skills are missing."""
        return {
            "days_1_30": [],
            "days_31_60": [],
            "days_61_90": [],
            "message": "No missing skills detected. Focus on deepening existing expertise."
        }
    
    def _generate_fallback_roadmap(self, missing_skills: List[str]) -> Dict:
        """Generate basic roadmap without LLM."""
        roadmap = {
            "days_1_30": [],
            "days_31_60": [],
            "days_61_90": []
        }
        
        # Simple resource templates
        resource_templates = {
            "python": [
                {"name": "Python Official Tutorial", "url": "https://docs.python.org/3/tutorial/", "type": "docs"},
                {"name": "freeCodeCamp Python Course", "url": "https://www.youtube.com/watch?v=rfscVS0vtbw", "type": "video"}
            ],
            "javascript": [
                {"name": "MDN JavaScript Guide", "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide", "type": "docs"},
                {"name": "JavaScript.info", "url": "https://javascript.info/", "type": "article"}
            ],
            "react": [
                {"name": "React Official Docs", "url": "https://react.dev/learn", "type": "docs"},
                {"name": "React Course - freeCodeCamp", "url": "https://www.youtube.com/watch?v=bMknfKXIFA8", "type": "video"}
            ],
            "default": [
                {"name": "Search on YouTube", "url": "https://youtube.com", "type": "video"},
                {"name": "Search on freeCodeCamp", "url": "https://www.freecodecamp.org/", "type": "course"}
            ]
        }
        
        for i, skill in enumerate(missing_skills[:9]):  # Max 9 skills
            skill_lower = skill.lower()
            resources = resource_templates.get(skill_lower, resource_templates["default"])
            
            item = {
                "skill": skill,
                "priority": "high" if i < 3 else ("medium" if i < 6 else "low"),
                "resources": resources,
                "estimated_hours": 20 if i < 3 else 15
            }
            
            if i < 3:
                roadmap["days_1_30"].append(item)
            elif i < 6:
                roadmap["days_31_60"].append(item)
            else:
                roadmap["days_61_90"].append(item)
        
        return roadmap
