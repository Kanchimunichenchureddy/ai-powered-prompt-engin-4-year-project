from starlette.testclient import TestClient
from main import app
import json

client = TestClient(app)

payload = {
    "original_prompt": "build a rest api for user management",
    "mode": "ai-dev",
    "include_tests": True,
    "add_documentation": True,
    "performance_optimization": True,
    "security_features": True
}

print('Sending POST /optimize')
resp = client.post('/optimize', json=payload)
print('Status code:', resp.status_code)
try:
    data = resp.json()
    print('Response keys:', list(data.keys()))
    print('Mode:', data.get('mode'))
    print('Model:', data.get('model'))
    print('Optimized prompt length:', len(data.get('optimized_prompt','')))
    print('\nQuality scores:')
    print(json.dumps(data.get('quality_scores',{}), indent=2))
except Exception as e:
    print('Failed to parse JSON response:', e)
    print('Text response:')
    print(resp.text)
