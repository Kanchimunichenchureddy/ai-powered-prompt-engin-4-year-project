from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List, Dict, Any

class PromptBase(BaseModel):
    original: str
    mode: str = "ai-dev"

class PromptCreate(PromptBase):
    pass

class PromptResponse(PromptBase):
    id: int
    optimized: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class QualityScoreResponse(BaseModel):
    clarity: float
    specificity: float
    completeness: float
    technical: float
    structure: float
    practicality: float
    overall: float

class OptimizePromptRequest(BaseModel):
    original_prompt: str
    mode: str = "ai-dev"
    include_tests: bool = False
    add_documentation: bool = False
    performance_optimization: bool = False
    security_features: bool = False

class OptimizePromptResponse(BaseModel):
    original_prompt: str
    optimized_prompt: str
    quality_scores: QualityScoreResponse
    improvement_percentage: float
    mode: str
    model: str = "gemini"

class AnalyzePromptRequest(BaseModel):
    prompt: str

class AnalyzePromptResponse(BaseModel):
    word_count: int
    readability: str
    action_verbs: int
    elements: List[str]
    scores: QualityScoreResponse

class AssistantMessageRequest(BaseModel):
    user_message: str
    prompt_context: Optional[str] = None

class AssistantMessageResponse(BaseModel):
    user_message: str
    assistant_response: str
    created_at: datetime

class UploadDocumentResponse(BaseModel):
    filename: str
    file_size: int
    extracted_keywords: List[str]


class ImageGenerateRequest(BaseModel):
    description: str
    image_mode: str = "photo"  # e.g., photo, illustration, stylized, fast


class ImageGenerateResponse(BaseModel):
    model_used: str
    image_prompt: str
    note: Optional[str] = None
