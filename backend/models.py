from sqlalchemy import Column, Integer, String, Text, Float, DateTime, JSON, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(50), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="user")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    prompts = relationship("Prompt", back_populates="user")
    activities = relationship("UserActivity", back_populates="user")
    optimization_history = relationship("OptimizationHistory", back_populates="user")
    assistant_messages = relationship("AssistantMessage", back_populates="user")

class Prompt(Base):
    __tablename__ = "prompts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)  # Nullable for migration
    original = Column(Text, nullable=False)
    optimized = Column(Text, nullable=True)
    mode = Column(String(50), default="ai-dev")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="prompts")

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
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)  # Nullable for migration
    prompt_id = Column(Integer, nullable=False)
    original_prompt = Column(Text, nullable=False)
    optimized_prompt = Column(Text, nullable=False)
    mode = Column(String(50))
    model = Column(String(50), default="gemini")
    improvement_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="optimization_history")

class UploadedDocument(Base):
    __tablename__ = "uploaded_documents"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)  # Nullable for migration
    filename = Column(String(255), nullable=False)
    file_size = Column(Integer)
    extracted_keywords = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AssistantMessage(Base):
    __tablename__ = "assistant_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=True)  # Nullable for migration
    user_message = Column(Text, nullable=False)
    assistant_response = Column(Text, nullable=True)
    prompt_context = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="assistant_messages")

class UserActivity(Base):
    __tablename__ = "user_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(50), ForeignKey("users.id"), nullable=False)
    activity_type = Column(String(50), nullable=False)  # 'prompt_optimize', 'chat', 'analyze', etc.
    activity_data = Column(JSON, nullable=True)  # Store activity-specific data
    meta_data = Column(JSON, nullable=True)  # mode, model, improvement, etc. (renamed from metadata)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="activities")
