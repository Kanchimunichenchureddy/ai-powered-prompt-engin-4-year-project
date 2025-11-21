#!/usr/bin/env python3
"""
Extract full raw output to see what Gemini is generating
"""

import requests
import json

url = "http://127.0.0.1:8000/optimize"
payload = {
    "original_prompt": "Build a todo list API",
    "mode": "ai-dev"
}

try:
    response = requests.post(url, json=payload, timeout=60)
    if response.status_code == 200:
        data = response.json()
        output = data.get("optimized_prompt", "")
        
        # Save to file
        with open(r'C:\temp\raw_output_full.txt', 'w', encoding='utf-8') as f:
            f.write(output)
        
        print(f"✅ Output saved ({len(output)} chars)")
        
        # Show first 100 lines
        lines = output.split('\n')
        print(f"\nFIRST 30 LINES:")
        print("=" * 80)
        for i, line in enumerate(lines[:30], 1):
            print(f"{i:3d}: {line[:75]}")
        
except Exception as e:
    print(f"Error: {e}")
