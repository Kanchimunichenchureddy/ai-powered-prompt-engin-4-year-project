import sys
import traceback
from gemini_service import GeminiService
from database import SessionLocal
from models import Prompt, QualityScore
import logging

logging.basicConfig(level=logging.DEBUG)

try:
    print("=" * 60)
    print("Testing Gemini service...")
    print("=" * 60)
    
    service = GeminiService()
    result = service.optimize_prompt('build a rest api for user management', 'ai-dev', {
        'include_tests': True, 
        'add_documentation': True,
        'performance_optimization': True,
        'security_features': True
    })
    
    print(f"\n✓ Success! Got {len(result)} characters")
    print("\nFirst 1000 characters:")
    print(result[:1000])
    
    # Test quality scores
    print("\n" + "=" * 60)
    print("Testing quality scores generation...")
    print("=" * 60)
    scores = service.generate_quality_scores(result)
    print(f"\nScores: {scores}")
    
except Exception as e:
    print(f"\n✗ Error: {e}")
    traceback.print_exc()
