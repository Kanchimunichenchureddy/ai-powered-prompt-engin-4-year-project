"""
Database migration script to create new tables and add user tracking
Run this after updating models.py
"""
from database import engine, Base
import models
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def migrate_database():
    """Create all tables defined in models"""
    try:
        logger.info("Starting database migration...")
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        logger.info("✓ Database migration completed successfully")
        logger.info("✓ Created tables: users, user_activities")
        logger.info("✓ Updated tables: prompts, optimization_history, assistant_messages, uploaded_documents")
        
    except Exception as e:
        logger.error(f"❌ Migration failed: {e}")
        raise

if __name__ == "__main__":
    migrate_database()
