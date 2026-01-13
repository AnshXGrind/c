"""
API Routes
"""

from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Request
from fastapi.responses import StreamingResponse
from typing import Optional
import io

from app.models.schemas import (
    ResumeAnalysisResponse,
    SkillsGapResponse,
    SampleResumesResponse,
    JobMarketResponse,
    CareerReportRequest,
)
from app.services.analyzer_service import AnalyzerService
from app.services.skills_service import SkillsService
from app.services.market_service import MarketService
from app.services.report_service import ReportService

router = APIRouter()


@router.post("/analyze", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    request: Request,
    file: UploadFile = File(...),
    job_role: str = Form(...),
):
    """
    Analyze a resume and return comprehensive feedback.
    
    - **file**: Resume file (PDF or DOCX)
    - **job_role**: Target job role for analysis
    """
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    extension = "." + file.filename.split(".")[-1].lower()
    if extension not in [".pdf", ".docx"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload PDF or DOCX."
        )
    
    # Read file content
    content = await file.read()
    
    if len(content) > 10 * 1024 * 1024:  # 10MB limit
        raise HTTPException(
            status_code=400,
            detail="File too large. Maximum size is 10MB."
        )
    
    # Get analyzer from app state
    analyzer = getattr(request.app.state, 'analyzer', None)
    
    # Analyze resume
    service = AnalyzerService(analyzer)
    result = await service.analyze(content, extension, job_role)
    
    return result


@router.post("/skills-gap", response_model=SkillsGapResponse)
async def analyze_skills_gap(
    request: Request,
    file: UploadFile = File(...),
    job_role: str = Form(...),
):
    """
    Analyze skills gap and generate learning roadmap.
    
    - **file**: Resume file (PDF or DOCX)
    - **job_role**: Target job role
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    extension = "." + file.filename.split(".")[-1].lower()
    content = await file.read()
    
    analyzer = getattr(request.app.state, 'analyzer', None)
    service = SkillsService(analyzer)
    result = await service.analyze_gap(content, extension, job_role)
    
    return result


@router.get("/samples/{job_role}", response_model=SampleResumesResponse)
async def get_sample_resumes(job_role: str):
    """
    Get recruiter-approved sample resumes for a job role.
    
    - **job_role**: Target job role
    """
    service = AnalyzerService(None)
    samples = service.get_sample_resumes(job_role)
    return {"samples": samples}


@router.get("/market/{job_role}", response_model=JobMarketResponse)
async def get_job_market_data(job_role: str):
    """
    Get job market intelligence for a role.
    
    - **job_role**: Target job role
    """
    service = MarketService()
    data = service.get_market_data(job_role)
    return data


@router.post("/report")
async def generate_career_report(data: CareerReportRequest):
    """
    Generate a comprehensive PDF career report.
    """
    service = ReportService()
    pdf_buffer = await service.generate_report(data.analysis, data.skills_gap)
    
    return StreamingResponse(
        io.BytesIO(pdf_buffer),
        media_type="application/pdf",
        headers={
            "Content-Disposition": "attachment; filename=career_report.pdf"
        }
    )


@router.post("/cover-letter")
async def generate_cover_letter(
    request: Request,
    file: UploadFile = File(...),
    job_description: str = Form(...),
    company_name: str = Form(...),
):
    """
    Generate a personalized cover letter based on resume and job description.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    extension = "." + file.filename.split(".")[-1].lower()
    content = await file.read()
    
    analyzer = getattr(request.app.state, 'analyzer', None)
    service = AnalyzerService(analyzer)
    cover_letter = await service.generate_cover_letter(
        content, extension, job_description, company_name
    )
    
    return {"cover_letter": cover_letter}
