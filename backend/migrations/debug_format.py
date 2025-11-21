#!/usr/bin/env python3
"""
Debug the formatting function
"""

import sys
import os
import re
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from gemini_service import GeminiService

def test_format():
    service = GeminiService()
    
    # Sample text with the exact format from Gemini
    sample = """**📋 PROJECT OVERVIEW**

Some content here.

**🎯 REQUIREMENTS**

More content.

**Functional Requirements:**

Some requirements."""
    
    print("BEFORE FORMATTING:")
    print(repr(sample[:200]))
    print("\n" + "="*80 + "\n")
    
    formatted = service._format_output(sample)
    
    print("AFTER FORMATTING:")
    print(repr(formatted[:300]))
    print("\n" + "="*80 + "\n")
    
    print("VISUAL OUTPUT:")
    print(formatted)

if __name__ == "__main__":
    test_format()
