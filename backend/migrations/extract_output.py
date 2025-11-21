#!/usr/bin/env python3
"""
Extract actual output from API for inspection
"""

import requests
import json

url = "http://127.0.0.1:8000/optimize"
payload = {
    "original_prompt": "Create a REST API",
    "mode": "ai-dev"
}

try:
    response = requests.post(url, json=payload, timeout=60)
    if response.status_code == 200:
        data = response.json()
        output = data.get("optimized_prompt", "")
        
        # Save to file
        with open('raw_output.txt', 'w', encoding='utf-8') as f:
            f.write(output)
        
        print(f"✅ Output saved to raw_output.txt ({len(output)} chars)")
        
        # Show preview with markers
        lines = output.split('\n')
        print("\n📄 LINE STRUCTURE (first 50 lines):\n")
        for i, line in enumerate(lines[:50], 1):
            if line.strip():
                marker = ""
                if line.startswith('#'):
                    marker = " <-- HEADER"
                elif line.startswith('*'):
                    marker = " <-- BULLET"
                elif line.startswith('**'):
                    marker = " <-- BOLD"
                print(f"{i:3d}: {line[:70]}{marker}")
        
except Exception as e:
    print(f"Error: {e}")
