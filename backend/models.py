from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON
from datetime import datetime
from database import Base

class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    original = Column(Text, nullable=False)
    optimized = Column(Text, nullable=True)
    mode = Column(String(50), default="ai-dev")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class QualityScore(Base):
    __tablename__ = "quality_scores"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, nullable=False)
    clarity = Column(Float, default=0.0)
    specificity = Column(Float, default=0.0)
    completeness = Column(Float, default=0.0)
    technical = Column(Float, default=0.0)
    structure = Column(Float, default=0.0)
    practicality = Column(Float, default=0.0)
    overall = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class OptimizationHistory(Base):
    __tablename__ = "optimization_history"
    
    id = Column(Integer, primary_key=True, index=True)
    prompt_id = Column(Integer, nullable=False)
    original_prompt = Column(Text, nullable=False)
    optimized_prompt = Column(Text, nullable=False)
    mode = Column(String(50))
    model = Column(String(50), default="gemini")
    improvement_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer)
    extracted_keywords = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AssistantMessage(Base):
    __tablename__ = "assistant_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text, nullable=False)
    assistant_response = Column(Text, nullable=True)
    prompt_context = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
