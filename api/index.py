"""
Vercel Serverless Function - Minimal API
Standalone minimal API for Vercel deployment

IMPORTANT: This is a minimal API only. Full backend with AI features
must be deployed separately to Railway, Render, or Fly.io due to Vercel's
250MB serverless function size limit.

This API provides basic endpoints only - no AI agents, no heavy dependencies.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os

# Create minimal FastAPI app (no heavy imports)
app = FastAPI(
    title="Lendora AI API (Minimal Mode)",
    description="Minimal API for Vercel. Full backend with AI features available on Railway/Render.",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Minimal data models
class HealthResponse(BaseModel):
    status: str
    mode: str
    message: str

class StatsResponse(BaseModel):
    totalBalance: float
    activeLoans: int
    totalProfit: float
    agentStatus: str

# Minimal endpoints
@app.get("/", response_model=Dict[str, Any])
async def root():
    """Root endpoint - API information"""
    return {
        "message": "Lendora AI API",
        "status": "minimal_mode",
        "version": "2.0.0",
        "note": "This is a minimal API. Full backend with AI features must be deployed separately.",
        "recommendation": "Deploy full backend to Railway (railway.app) or Render (render.com) for AI features",
        "endpoints": {
            "health": "/health",
            "stats": "/api/dashboard/stats",
            "docs": "/docs"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        mode="minimal",
        message="API is running in minimal mode. Full backend required for AI features."
    )

@app.get("/api/dashboard/stats", response_model=StatsResponse)
async def get_stats():
    """Minimal stats endpoint (mock data)"""
    return StatsResponse(
        totalBalance=0.0,
        activeLoans=0,
        totalProfit=0.0,
        agentStatus="unavailable_minimal_mode"
    )

@app.get("/api/trades/history")
async def get_trades():
    """Minimal trades endpoint (empty)"""
    return []

@app.get("/api/agent/status")
async def agent_status():
    """Agent status endpoint"""
    return {
        "agents_initialized": False,
        "lenny_available": False,
        "luna_available": False,
        "masumi_available": False,
        "status": "unavailable",
        "message": "Full backend required for AI agents. Deploy to Railway or Render.",
        "mode": "minimal"
    }

# Export for Vercel
handler = app

