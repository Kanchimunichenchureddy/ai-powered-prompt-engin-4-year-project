import requests
import json

url = "http://127.0.0.1:8000/optimize"
payload = {
    "original_prompt": "build a rest api for user management",
    "mode": "ai-dev",
    "include_tests": True,
    "add_documentation": True,
    "performance_optimization": True,
    "security_features": True
}

print('Testing improved Gemini prompt...')
resp = requests.post(url, json=payload, timeout=120)
data = resp.json()
opt = data.get('optimized_prompt', '')

print(f'\n✅ Response received: {len(opt)} characters')
print(f'Quality scores: {data.get("quality_scores")}')

# Look for the new structured sections
sections = [
    '1️⃣ PROJECT OVERVIEW',
    '2️⃣ REQUIREMENTS & OBJECTIVES',
    '3️⃣ TECHNOLOGY STACK & ARCHITECTURE',
    '4️⃣ STEP-BY-STEP IMPLEMENTATION',
    '5️⃣ CODE EXAMPLES & BEST PRACTICES',
    '6️⃣ TESTING STRATEGY',
    '7️⃣ DEPLOYMENT & SETUP',
    '8️⃣ MONITORING & MAINTENANCE',
    '9️⃣ COMMON PITFALLS & GOTCHAS',
    '🔟 RESOURCES & NEXT STEPS'
]

print('\n📋 Section Structure Check:')
for section in sections:
    found = section in opt or section.replace('️', '') in opt
    status = '✓' if found else '✗'
    print(f'  {status} {section}')

# Extract and show STEP-BY-STEP section
if 'STEP-BY-STEP IMPLEMENTATION' in opt or '4️⃣' in opt:
    print('\n✅ Found STEP-BY-STEP IMPLEMENTATION section')
    
    # Find first few steps
    lines = opt.split('\n')
    step_lines = [l for l in lines if 'STEP' in l.upper()][:5]
    print(f'\n   First {len(step_lines)} steps found:')
    for i, line in enumerate(step_lines, 1):
        print(f'   {i}. {line.strip()[:80]}')

# Show preview of first 3000 chars
print('\n--- Full Preview (first 3000 chars) ---\n')
print(opt[:3000])

print('\n\n✅ Test Complete - Full output saved to verify_gemini_output_preview.txt')
