"""
Vercel Serverless Function Wrapper for FastAPI Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sys
import os

# Add backend to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.api.routes import router as api_router
from app.core.config import settings

# Create FastAPI application
app = FastAPI(
    title="CareerAI API",
    description="AI-Powered Career Assistant - Serverless on Vercel",
    version="1.0.0"
)

# Configure CORS for Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Vercel domains
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
        "message": "CareerAI API is running on Vercel",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "platform": "vercel"}

# Export for Vercel
handler = app
