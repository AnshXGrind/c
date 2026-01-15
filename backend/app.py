"""
AI Resume & Career Intelligence System - Main Application
Production-ready FastAPI backend for resume analysis and career guidance.
"""

import os
import tempfile
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, UploadFile, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from services.resume_parser import ResumeParser
from services.embedder import Embedder
from services.scorer import ResumeScorer
from services.llm_reasoner import LLMReasoner
from utils.skill_extractor import SkillExtractor
from utils.text_cleaner import TextCleaner


# Global instances (initialized on startup)
embedder: Optional[Embedder] = None
scorer: Optional[ResumeScorer] = None
llm_reasoner: Optional[LLMReasoner] = None
skill_extractor: Optional[SkillExtractor] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize services on startup and cleanup on shutdown."""
    global embedder, scorer, llm_reasoner, skill_extractor
    
    print("🚀 Initializing AI services...")
    embedder = Embedder()
    scorer = ResumeScorer(embedder)
    llm_reasoner = LLMReasoner()
    skill_extractor = SkillExtractor()
    print("✅ All services initialized successfully!")
    
    yield
    
    print("🔄 Shutting down services...")


app = FastAPI(
    title="AI Resume & Career Intelligence System",
    description="Production-ready API for resume scoring, skill gap analysis, and career roadmap generation",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://*.vercel.app",
        os.getenv("FRONTEND_URL", ""),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "service": "AI Resume & Career Intelligence System",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "services": {
            "embedder": embedder is not None,
            "scorer": scorer is not None,
            "llm_reasoner": llm_reasoner is not None,
            "skill_extractor": skill_extractor is not None
        }
    }


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    job_description: str = Form(..., description="Job description text")
):
    """
    Analyze a resume against a job description.
    
    Returns comprehensive analysis including:
    - Overall score (0-100)
    - Sub-scores for different aspects
    - Rejection reasons (if score < 70)
    - Missing skills
    - Personalized learning roadmap
    """
    # Validate file type
    allowed_extensions = [".pdf", ".docx", ".doc"]
    file_ext = os.path.splitext(resume.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            content = await resume.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Parse resume
        parser = ResumeParser()
        resume_text = parser.extract_text(tmp_path)
        
        # Clean texts
        cleaner = TextCleaner()
        clean_resume = cleaner.clean(resume_text)
        clean_jd = cleaner.clean(job_description)
        
        if not clean_resume.strip():
            raise HTTPException(
                status_code=400,
                detail="Could not extract text from resume. Please ensure the file is not corrupted."
            )
        
        # Calculate scores
        score_result = scorer.calculate_score(clean_resume, clean_jd)
        
        # Extract skills
        jd_skills = skill_extractor.extract_from_jd(clean_jd)
        resume_skills = skill_extractor.extract_from_resume(clean_resume)
        missing_skills = skill_extractor.find_missing_skills(resume_skills, jd_skills)
        
        # Generate explanations and roadmap using LLM
        rejection_reasons = []
        if score_result["overall_score"] < 70:
            rejection_reasons = await llm_reasoner.explain_rejection(
                score_result,
                missing_skills,
                clean_resume,
                clean_jd
            )
        
        learning_roadmap = await llm_reasoner.generate_roadmap(
            missing_skills,
            score_result,
            clean_jd
        )
        
        # Cleanup temp file
        os.unlink(tmp_path)
        
        return JSONResponse(content={
            "success": True,
            "data": {
                "score": score_result["overall_score"],
                "sub_scores": {
                    "skills_match": score_result["skills_match"],
                    "experience_relevance": score_result["experience_relevance"],
                    "keyword_coverage": score_result["keyword_coverage"],
                    "role_alignment": score_result["role_alignment"]
                },
                "rejection_reasons": rejection_reasons,
                "missing_skills": missing_skills,
                "present_skills": resume_skills,
                "required_skills": jd_skills,
                "learning_roadmap": learning_roadmap
            }
        })
        
    except HTTPException:
        raise
    except Exception as e:
        # Cleanup temp file on error
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.post("/extract-text")
async def extract_text(
    file: UploadFile = File(..., description="Resume file (PDF or DOCX)")
):
    """Extract text from a resume file."""
    allowed_extensions = [".pdf", ".docx", ".doc"]
    file_ext = os.path.splitext(file.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"
        )
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            content = await file.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        parser = ResumeParser()
        text = parser.extract_text(tmp_path)
        
        cleaner = TextCleaner()
        clean_text = cleaner.clean(text)
        
        os.unlink(tmp_path)
        
        return {"success": True, "text": clean_text}
        
    except Exception as e:
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/skills-gap")
async def analyze_skills_gap(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):
    """Analyze skills gap between resume and job description."""
    allowed_extensions = [".pdf", ".docx", ".doc"]
    file_ext = os.path.splitext(resume.filename)[1].lower()
    
    if file_ext not in allowed_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            content = await resume.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        parser = ResumeParser()
        resume_text = parser.extract_text(tmp_path)
        
        cleaner = TextCleaner()
        clean_resume = cleaner.clean(resume_text)
        clean_jd = cleaner.clean(job_description)
        
        jd_skills = skill_extractor.extract_from_jd(clean_jd)
        resume_skills = skill_extractor.extract_from_resume(clean_resume)
        missing_skills = skill_extractor.find_missing_skills(resume_skills, jd_skills)
        
        os.unlink(tmp_path)
        
        return {
            "success": True,
            "data": {
                "required_skills": jd_skills,
                "present_skills": resume_skills,
                "missing_skills": missing_skills,
                "match_percentage": round(
                    (len(resume_skills) / max(len(jd_skills), 1)) * 100, 1
                )
            }
        }
        
    except Exception as e:
        if 'tmp_path' in locals():
            try:
                os.unlink(tmp_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/roadmap")
async def generate_roadmap(
    missing_skills: list[str] = Form(...),
    target_role: str = Form(...)
):
    """Generate a personalized learning roadmap."""
    try:
        roadmap = await llm_reasoner.generate_roadmap(
            missing_skills,
            {"overall_score": 0},  # Placeholder score data
            target_role
        )
        
        return {"success": True, "data": roadmap}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=os.getenv("ENV", "development") == "development"
    )
