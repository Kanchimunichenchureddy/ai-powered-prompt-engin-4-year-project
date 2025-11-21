#!/usr/bin/env python3
"""
Direct test of formatting without API
"""

import sys
import os
import re

# Simulate the _format_output function
def _format_output(text: str) -> str:
    """
    Post-process output to add visual separators
    """
    result = text
    
    # Replace bold section headers
    result = re.sub(
        r'\*\*([🎯📋🏗️📝💻🧪🚀📊⚠️💡🛠️])\s*([^*]+)\*\*',
        lambda m: f'\n{"="*80}\n{m.group(1)} {m.group(2).strip()}\n{"="*80}\n',
        result
    )
    
    # Add visual separators for subheadings
    result = re.sub(
        r'\*\*([A-Za-z-]{5,30} Requirements?:?)\*\*',
        lambda m: f'\n\n--- {m.group(1)} ---\n',
        result
    )
    
    # Add spacing before lists
    result = re.sub(r'\n(\d+\.)', r'\n\n\1', result)
    
    # Add footer
    if '='*80 in result:
        result = result.rstrip() + f'\n\n{"="*80}\n✨ END OF GUIDE\n{"="*80}\n'
    
    return result

# Test with actual format from Gemini
test_text = """Here's your optimized prompt:

**📋 PROJECT OVERVIEW**

Build a REST API for user management

**🎯 REQUIREMENTS & OBJECTIVES**

**Functional Requirements:**

- Users can register
- Users can login

**📝 IMPLEMENTATION GUIDE**

1. Set up environment
2. Create database"""

print("BEFORE:")
print(test_text)
print("\n" + "=" * 80 + "\n")

formatted = _format_output(test_text)
print("AFTER:")
print(formatted)
print("\n" + "=" * 80 + "\n")

# Count separators
sep_count = formatted.count('='*80)
print(f"✅ Separators found: {sep_count}")
