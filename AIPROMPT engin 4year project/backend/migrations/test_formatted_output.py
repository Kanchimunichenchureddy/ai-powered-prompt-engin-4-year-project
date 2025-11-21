#!/usr/bin/env python3
"""
Test the formatted output with visual separators
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from gemini_service import GeminiService

def test_formatted_output():
    """Test that sections are visually separated"""
    print("Testing Gemini output with visual separators...\n")
    
    service = GeminiService()
    
    # Use a sample prompt
    prompt = "Create a REST API for User Management"
    
    try:
        optimized = service.optimize_prompt(prompt)
        
        print(f"✅ Response: {len(optimized)} characters\n")
        
        # Check for visual separators
        separators = optimized.count('='*80)
        sections = optimized.count('PROJECT OVERVIEW') + optimized.count('REQUIREMENTS') + optimized.count('ARCHITECTURE') + optimized.count('IMPLEMENTATION') + optimized.count('TESTING') + optimized.count('DEPLOYMENT') + optimized.count('MONITORING')
        
        print(f"📊 Visual Separators Found: {separators}")
        print(f"📋 Section Headers Found: {sections}\n")
        
        # Show first 3000 characters to see the formatting
        print("=" * 80)
        print("PREVIEW OF FORMATTED OUTPUT (First 3000 characters):")
        print("=" * 80)
        print(optimized[:3000])
        print("\n" + "=" * 80)
        print("OUTPUT FORMATTING CHECK:")
        print("=" * 80)
        
        # Check for key formatting elements
        checks = {
            'Equal sign separators': '='*80 in optimized,
            'Emoji use': any(emoji in optimized for emoji in ['📋', '✅', '⚡', '🛠️', '🏗️', '💾', '🔌', '📝', '💻', '🧪', '🚀', '📊']),
            'Blank line spacing': '\n\n' in optimized,
            'Clear section breaks': optimized.count('\n\n' + '='*80) > 0,
        }
        
        for check_name, result in checks.items():
            status = "✅" if result else "❌"
            print(f"{status} {check_name}: {result}")
        
        print(f"\n✅ Total output size: {len(optimized)} characters")
        print("✅ Formatted output test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_formatted_output()
