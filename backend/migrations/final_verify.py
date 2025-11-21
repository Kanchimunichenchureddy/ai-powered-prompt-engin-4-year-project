import requests

url = "http://127.0.0.1:8000/optimize"
payload = {
    "original_prompt": "build a rest api for user management",
    "mode": "ai-dev",
    "include_tests": True,
    "add_documentation": True,
    "performance_optimization": True,
    "security_features": True
}

print('Testing final optimized Gemini prompt...\n')
resp = requests.post(url, json=payload, timeout=120)
data = resp.json()
opt = data.get('optimized_prompt', '')

print(f'✅ Response: {len(opt)} characters\n')

# Check for actual STEP markers
step_count = opt.count('STEP ')
print(f'📋 Found {step_count} STEP markers in response')

# Check for our headers
headers_check = [
    'PROJECT OVERVIEW',
    'REQUIREMENTS',
    'ARCHITECTURE',
    'STEP-BY-STEP IMPLEMENTATION',
    'CODE EXAMPLES',
    'TESTING',
    'DEPLOYMENT',
    'MONITORING',
    'PITFALLS',
    'RESOURCES'
]

print('\n📍 Section Headers Found:')
for h in headers_check:
    found = h.lower() in opt.lower()
    print(f'  {"✓" if found else "✗"} {h}')

# Extract first 3 steps if they exist
if 'STEP 1' in opt:
    print('\n🎯 First 3 STEPS Preview:\n')
    lines = opt.split('\n')
    in_step = False
    step_num = 0
    current_step = []
    
    for line in lines:
        if 'STEP ' in line and ('STEP 1' in line or 'STEP 2' in line or 'STEP 3' in line):
            if current_step:
                print('\n'.join(current_step))
                print('-' * 60)
            in_step = True
            current_step = [line]
            step_num += 1
        elif in_step:
            if 'STEP ' in line and step_num < 3:
                current_step = [line]
            elif step_num < 3:
                current_step.append(line)
                if len(current_step) > 10:  # Limit lines per step
                    print('\n'.join(current_step[:10]))
                    print('-' * 60)
                    in_step = False
                    current_step = []
                    step_num += 1
else:
    print('\n⚠️ No STEP markers found - showing first 2000 chars:\n')
    print(opt[:2000])

print('\n\n✅ Full output saved to: verify_gemini_output_preview.txt')
