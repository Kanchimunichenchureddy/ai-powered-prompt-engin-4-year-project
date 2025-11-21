#!/usr/bin/env python3
"""
Inspect the raw Gemini output to understand its format
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from gemini_service import GeminiService

def inspect_output():
    """Inspect raw Gemini output structure"""
    service = GeminiService()
    prompt = "Create a REST API for User Management"
    
    try:
        # Get raw response before formatting
        from google import generativeai as genai
        genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
        
        optimization_query = f"""..."""  # Will get from service
        model = genai.GenerativeModel(service.model)
        
        # Call without formatting
        response = model.generate_content(service._craft_prompt(prompt, 'ai-dev'))
        raw_text = response.text.strip()
        
        print("=" * 80)
        print("RAW OUTPUT STRUCTURE ANALYSIS")
        print("=" * 80)
        print(f"\nTotal characters: {len(raw_text)}\n")
        
        # Find all headers
        import re
        headers = re.findall(r'^#+.*$', raw_text, re.MULTILINE)
        print(f"Headers found ({len(headers)}):")
        for i, header in enumerate(headers[:15], 1):
            print(f"  {i}. {header[:70]}")
        
        print(f"\n\nFirst 1500 chars:")
        print("=" * 80)
        print(raw_text[:1500])
        print("\n" + "=" * 80)
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    inspect_output()
