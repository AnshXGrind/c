"""
CareerAI Backend - FastAPI Application
AI-Powered Career Assistant ML Service
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api.routes import router as api_router
from app.core.config import settings
from app.ml.analyzer import ResumeAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global analyzer instance
analyzer = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifecycle manager"""
    global analyzer
    logger.info("Starting up CareerAI Backend...")
    
    # Initialize ML models
    try:
        analyzer = ResumeAnalyzer()
        logger.info("ML models loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load ML models: {e}")
        analyzer = None
    
    # Store analyzer in app state
    app.state.analyzer = analyzer
    
    yield
    
    # Cleanup
    logger.info("Shutting down CareerAI Backend...")


# Create FastAPI application
app = FastAPI(
    title="CareerAI API",
    description="AI-Powered Career Assistant - Resume Analysis, Skills Gap Detection, and Career Roadmap Generation",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "CareerAI API is running",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "ml_models": "loaded" if analyzer else "not loaded",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
