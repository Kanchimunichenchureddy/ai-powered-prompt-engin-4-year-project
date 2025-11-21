#!/usr/bin/env python3
"""
End-to-end test of the formatted Gemini output via HTTP API
"""

import requests
import json

def test_api_with_formatting():
    """Test the /optimize endpoint with formatted output"""
    
    print("Testing /optimize endpoint with formatted output...\n")
    
    url = "http://127.0.0.1:8000/optimize"
    payload = {
        "original_prompt": "Create a REST API for User Management",
        "mode": "ai-dev",
        "include_tests": True,
        "add_documentation": True,
        "performance_optimization": True,
        "security_features": True
    }
    
    try:
        print(f"🚀 Sending POST request to {url}")
        print(f"📝 Payload: {json.dumps(payload, indent=2)}\n")
        
        response = requests.post(url, json=payload, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            optimized_prompt = data.get("optimized_prompt", "")
            
            print(f"✅ Response Status: {response.status_code}")
            print(f"✅ Response Size: {len(optimized_prompt)} characters\n")
            
            # Check formatting
            section_markers = optimized_prompt.count('SECTION')
            separator_count = len([line for line in optimized_prompt.split('\n') if line.startswith('='*15)])
            emoji_count = len([c for c in optimized_prompt if c in '📋✅⚡🛠️🏗️💾🔌📝💻🧪🚀📊✨🎯'])
            
            print(f"📊 FORMATTING METRICS:")
            print(f"  • Section markers (SECTION N): {section_markers}")
            print(f"  • Separator lines (==...==): {separator_count}")
            print(f"  • Emoji section markers: {emoji_count}")
            print(f"  • Total response: {len(optimized_prompt)} chars\n")
            
            # Show preview
            print("=" * 80)
            print("FORMATTED OUTPUT PREVIEW (First 2000 characters):")
            print("=" * 80)
            print(optimized_prompt[:2000])
            print("\n" + "=" * 80)
            
            # Quality scores
            quality_scores = data.get("quality_scores", {})
            print(f"📈 QUALITY SCORES:")
            for dimension, score in quality_scores.items():
                print(f"  • {dimension}: {score}/10")
            
            print(f"\n✅ Test completed successfully!")
            
        else:
            print(f"❌ Error: Status {response.status_code}")
            print(f"Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure backend is running on port 8000")
        print("   Run: python main.py")
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_api_with_formatting()
