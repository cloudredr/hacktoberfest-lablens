from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging

from app.core.config import settings
from app.api.routes import health, terminology, extract, explain, chat, medications

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("lablens")

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="LabLens — AI-Powered Medical Report Explainer. Educational lab report terminology tool with verified MedlinePlus grounding."
)

# CORS setup for frontend development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routes under /api
app.include_router(health.router, prefix="/api")
app.include_router(terminology.router, prefix="/api")
app.include_router(extract.router, prefix="/api")
app.include_router(explain.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(medications.router, prefix="/api")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Catches unhandled errors gracefully without exposing sensitive server stack traces.
    """
    logger.error(f"Unhandled error processing {request.method} {request.url}: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal processing error",
            "message": "An unexpected error occurred. Please verify your report data and try again."
        }
    )

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "purpose": "Educational medical laboratory report terminology explainer",
        "documentation": "/docs"
    }

