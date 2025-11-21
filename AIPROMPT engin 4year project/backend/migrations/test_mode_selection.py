#!/usr/bin/env python3
"""
Test mode->model selection by calling /optimize with various modes.
This script checks the API returns successfully and logs that the backend used the model.
Note: The backend logs the selected model; since we can't access backend logs here reliably,
we'll verify the optimized_prompt contains the SECTION headers and that response is OK.
"""
import requests

MODES = ["fast", "ai-dev", "creative", "unknown"]
URL = "http://127.0.0.1:8000/optimize"

for mode in MODES:
    payload = {
        "original_prompt": f"Create a REST API for user management - mode test {mode}",
        "mode": mode,
        "include_tests": False,
        "add_documentation": False,
        "performance_optimization": False,
        "security_features": False
    }
    print(f"\n--- Testing mode: {mode} ---")
    try:
        r = requests.post(URL, json=payload, timeout=60)
        print(f"Status: {r.status_code}")
        if r.status_code == 200:
            data = r.json()
            optimized = data.get('optimized_prompt', '')
            # Basic checks
            has_sections = 'SECTION 1' in optimized or 'PROJECT OVERVIEW' in optimized
            print(f"Has sections: {has_sections}, Length: {len(optimized)}")
        else:
            print(f"Response: {r.text}")
    except Exception as e:
        print(f"Error calling API: {e}")
