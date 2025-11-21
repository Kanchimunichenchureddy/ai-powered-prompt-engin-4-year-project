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

print('Sending POST to', url)
resp = requests.post(url, json=payload, timeout=120)
print('Status code:', resp.status_code)
try:
    data = resp.json()
except Exception as e:
    print('Failed to decode JSON:', e)
    print('Response text (truncated):')
    print(resp.text[:2000])
    raise

opt = data.get('optimized_prompt', '')
print('Optimized prompt length:', len(opt))

# Check for key enhanced headings
headings = [
    'PROJECT OVERVIEW',
    'ARCHITECTURE & DESIGN',
    'IMPLEMENTATION',
    'TESTING & QA',
    'DEPLOYMENT & MONITORING',
    'COMMON PITFALLS',
    'OPTIMIZATION TIPS',
    'RESOURCES & REFERENCES'
]

found = {h: (h.lower() in opt.lower()) for h in headings}
print('\nHeading presence check:')
for h, v in found.items():
    print(f'  {h}:', '✓' if v else '✗')

# Print first 2000 characters preview
print('\n--- Preview (first 2000 chars) ---\n')
print(opt[:2000])

# Save to file for inspection
with open('verify_gemini_output_preview.txt', 'w', encoding='utf-8') as f:
    f.write(opt)

print('\nSaved full optimized prompt to verify_gemini_output_preview.txt')
