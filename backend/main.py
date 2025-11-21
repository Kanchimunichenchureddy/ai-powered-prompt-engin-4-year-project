from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import database
import models
import schemas
from gemini_service import GeminiService
from config import DEBUG
from datetime import datetime
import logging
import sys
import re

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(title="PromptEngine Backend", version="1.0.0", debug=DEBUG)

# CORS middleware
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include authentication router
from auth import auth_router
app.include_router(auth_router)

# Create tables on startup
@app.on_event("startup")
def startup():
    logger.info("=" * 60)
    logger.info("🚀 PromptEngine Backend Starting Up")
    logger.info("=" * 60)
    
    try:
        database.Base.metadata.create_all(bind=database.engine)
        logger.info("✓ Database tables created/verified")
        logger.info("✓ CORS enabled for frontend communication")
        logger.info("✓ Gemini service initialized")
        logger.info("")
        logger.info("📊 Backend Ready at: http://127.0.0.1:8000")
        logger.info("📖 API Docs at: http://127.0.0.1:8000/docs")
        logger.info("=" * 60)
    except Exception as e:
        logger.error(f"❌ Startup error: {e}")
        raise

# Initialize Gemini service
gemini_service = GeminiService()

# ==================== ENDPOINTS ====================

@app.get("/")
def read_root():
    return {"message": "PromptEngine Backend API", "version": "1.0.0"}

@app.post("/optimize", response_model=schemas.OptimizePromptResponse)
def optimize_prompt(request: schemas.OptimizePromptRequest, db: Session = Depends(database.get_db)):
    """
    Optimize a prompt using Gemini service
    """
    try:
        logger.info(f"📝 Optimize request received - Mode: {request.mode}")
        
        # Create prompt record
        prompt_record = models.Prompt(
            original=request.original_prompt,
            mode=request.mode
        )
        db.add(prompt_record)
        db.commit()
        db.refresh(prompt_record)
        
        # Optimize using Gemini
        options = {
            "include_tests": request.include_tests,
            "add_documentation": request.add_documentation,
            "performance_optimization": request.performance_optimization,
            "security_features": request.security_features
        }
        optimized_prompt = gemini_service.optimize_prompt_for_mode(request.original_prompt, request.mode, options)
        logger.info(f"✓ Prompt optimized successfully")
        
        # Update prompt record
        prompt_record.optimized = optimized_prompt
        db.commit()
        
        # Generate quality scores
        scores = gemini_service.generate_quality_scores(optimized_prompt)
        
        # Save quality scores
        quality_record = models.QualityScore(
            prompt_id=prompt_record.id,
            clarity=scores["clarity"],
            specificity=scores["specificity"],
            completeness=scores["completeness"],
            technical=scores["technical"],
            structure=scores["structure"],
            practicality=scores["practicality"],
            overall=scores["overall"]
        )
        db.add(quality_record)
        db.commit()
        
        # Calculate improvement
        original_scores = gemini_service.generate_quality_scores(request.original_prompt)
        improvement_percentage = round(((scores["overall"] - original_scores["overall"]) / original_scores["overall"] * 100) if original_scores["overall"] > 0 else 20, 2)
        
        # Save optimization history
        history_record = models.OptimizationHistory(
            prompt_id=prompt_record.id,
            original_prompt=request.original_prompt,
            optimized_prompt=optimized_prompt,
            mode=request.mode,
            model=gemini_service.model,
            improvement_percentage=improvement_percentage
        )
        db.add(history_record)
        db.commit()
        
        return schemas.OptimizePromptResponse(
            original_prompt=request.original_prompt,
            optimized_prompt=optimized_prompt,
            quality_scores=schemas.QualityScoreResponse(**scores),
            improvement_percentage=improvement_percentage,
            mode=request.mode,
            model=gemini_service.model
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error optimizing prompt: {str(e)}")

@app.post("/analyze", response_model=schemas.AnalyzePromptResponse)
def analyze_prompt(request: schemas.AnalyzePromptRequest, db: Session = Depends(database.get_db)):
    """
    Analyze a prompt for quality and characteristics
    """
    try:
        prompt = request.prompt
        words = len(prompt.split())
        sentences = len([s for s in prompt.split('.') if s.strip()])
        action_verbs = len([v for v in re.findall(r'\b(create|build|implement|design|develop|optimize|analyze|generate)\b', prompt, re.I)])
        
        # Detect elements
        elements = []
        if any(word in prompt.lower() for word in ['function', 'method']):
            elements.append('🔄 Function')
        if any(word in prompt.lower() for word in ['api', 'endpoint']):
            elements.append('🔌 API')
        if any(word in prompt.lower() for word in ['database', 'schema']):
            elements.append('🗄️ Database')
        if any(word in prompt.lower() for word in ['test', 'validate']):
            elements.append('🧪 Testing')
        if any(word in prompt.lower() for word in ['security', 'authenticate']):
            elements.append('🔒 Security')
        if any(word in prompt.lower() for word in ['performance', 'optimize']):
            elements.append('⚡ Performance')
        
        # Calculate readability
        avg_words_per_sentence = words / max(sentences, 1)
        readability = 'Complex' if avg_words_per_sentence > 20 else 'Moderate' if avg_words_per_sentence > 15 else 'Clear'
        
        # Generate scores
        scores = gemini_service.generate_quality_scores(prompt)
        
        return schemas.AnalyzePromptResponse(
            word_count=words,
            readability=readability,
            action_verbs=action_verbs,
            elements=elements,
            scores=schemas.QualityScoreResponse(**scores)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing prompt: {str(e)}")

@app.post("/quality-score", response_model=schemas.QualityScoreResponse)
def calculate_quality_score(request: schemas.AnalyzePromptRequest):
    """
    Calculate quality scores for a prompt
    """
    try:
        scores = gemini_service.generate_quality_scores(request.prompt)
        return schemas.QualityScoreResponse(**scores)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating quality score: {str(e)}")

@app.post("/assistant", response_model=schemas.AssistantMessageResponse)
def assistant_message(request: schemas.AssistantMessageRequest, db: Session = Depends(database.get_db)):
    """
    Get AI assistant response
    """
    try:
        # Generate response
        response_text = gemini_service.generate_assistant_response(request.user_message, request.prompt_context)
        
        # Save message
        message_record = models.AssistantMessage(
            user_message=request.user_message,
            assistant_response=response_text,
            prompt_context=request.prompt_context
        )
        db.add(message_record)
        db.commit()
        
        return schemas.AssistantMessageResponse(
            user_message=request.user_message,
            assistant_response=response_text,
            created_at=message_record.created_at
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

@app.post("/generate-image", response_model=schemas.ImageGenerateResponse)
def generate_image(request: schemas.ImageGenerateRequest):
    """Generate image prompt or metadata based on requested image mode"""
    try:
        result = gemini_service.generate_image(request.description, request.image_mode)
        return schemas.ImageGenerateResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error preparing image generation: {e}")
@app.post("/upload/keywords", response_model=schemas.UploadDocumentResponse)
def extract_keywords(
    filename: str,
    file_size: int,
    content_preview: str,
    db: Session = Depends(database.get_db)
):
    """
    Extract keywords from uploaded document
    """
    try:
        # Simple keyword extraction (split by common words)
        import re
        words = re.findall(r'\b[a-z]+\b', content_preview.lower())
        # Remove common words
        common_words = {'the', 'a', 'an', 'and', 'or', 'is', 'are', 'was', 'were', 'be', 'been', 'to', 'for', 'of', 'in', 'on', 'at', 'by', 'with'}
        keywords = [word for word in set(words) if word not in common_words and len(word) > 3][:15]
        
        # Save document record
        doc_record = models.UploadedDocument(
            filename=filename,
            file_size=file_size,
            extracted_keywords=keywords
        )
        db.add(doc_record)
        db.commit()
        
        return schemas.UploadDocumentResponse(
            filename=filename,
            file_size=file_size,
            extracted_keywords=keywords
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error extracting keywords: {str(e)}")

@app.get("/history")
def get_optimization_history(db: Session = Depends(database.get_db)):
    """
    Get optimization history
    """
    try:
        history = db.query(models.OptimizationHistory).order_by(models.OptimizationHistory.created_at.desc()).limit(50).all()
        return [
            {
                "id": h.id,
                "original_prompt": h.original_prompt,
                "optimized_prompt": h.optimized_prompt,
                "mode": h.mode,
                "model": h.model,
                "improvement_percentage": h.improvement_percentage,
                "created_at": h.created_at.isoformat() if h.created_at else None
            }
            for h in history
        ]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching history: {str(e)}")

@app.post("/set-mode")
def set_mode(request: dict):
    """Set the current working mode for the Gemini service"""
    try:
        mode = request.get('mode')
        config = request.get('config', {})
        
        if not mode:
            raise HTTPException(status_code=400, detail="Mode is required")
        
        # Log frontend configuration for reference
        if config:
            logger.info(f"📋 Frontend mode config received: {config.get('title', mode)}")
            logger.info(f"🎯 Frontend prompt structure: {config.get('promptFormat', {}).get('structure', 'N/A')}")
        
        result = gemini_service.set_mode(mode)
        
        if result["success"]:
            logger.info(f"✅ Mode successfully set to: {mode} with model: {result['model']}")
            return {
                "success": True,
                "message": f"Mode set to {mode}",
                "current_mode": result["mode"],
                "model": result["model"],
                "configuration": result["configuration"]
            }
        else:
            logger.error(f"❌ Failed to set mode: {result['error']}")
            raise HTTPException(status_code=400, detail=result["error"])
            
    except Exception as e:
        logger.exception("Error setting mode")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get-mode")
def get_current_mode():
    """Get the current working mode and configuration"""
    try:
        mode_info = gemini_service.get_current_mode()
        return mode_info
    except Exception as e:
        logger.exception("Error getting current mode")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/available-modes")
def get_available_modes():
    """Get all available modes with their configurations"""
    try:
        modes = gemini_service.get_available_modes()
        return {
            "modes": modes,
            "count": len(modes)
        }
    except Exception as e:
        logger.exception("Error getting available modes")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    """
    Health check endpoint
    """
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# ==================== MAIN ====================

if __name__ == "__main__":
    import uvicorn
    from config import HOST, PORT
    
    uvicorn.run(
        "main:app",
        host=HOST,
        port=PORT,
        reload=False
    )
