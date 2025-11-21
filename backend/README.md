# PromptEngine Backend API

FastAPI backend for PromptEngine with MySQL database integration, Gemini AI service, and real-time prompt optimization.

## Quick Start

### 1. Prerequisites
- Python 3.8+
- MySQL 5.7+ or MariaDB
- Google Generative AI API key (optional for full Gemini integration)

### 2. Setup

```bash
cd backend

# Run setup script
python setup.py

# Or manual setup:
# - Copy .env.example to .env
# - Update DATABASE_URL and GEMINI_API_KEY in .env
# - Create MySQL database:
#   mysql -u root -p
#   CREATE DATABASE promptengine_db;
#   EXIT;
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Run Backend

```bash
python main.py
```

Backend will start on `http://127.0.0.1:8000`

### 5. API Documentation

Access Swagger UI: `http://127.0.0.1:8000/docs`
or ReDoc: `http://127.0.0.1:8000/redoc`

## API Endpoints

### Prompt Optimization
- `POST /optimize` - Optimize a prompt with Gemini
- `POST /analyze` - Analyze prompt quality and characteristics
- `POST /quality-score` - Calculate quality scores

### AI Assistant
- `POST /assistant` - Get AI assistant response to questions

### Document Upload
- `POST /upload/keywords` - Extract keywords from document

### History & Utilities
- `GET /history` - Get optimization history
- `GET /health` - Health check endpoint

## Database Schema

Tables:
- `prompts` - Original and optimized prompts
- `quality_scores` - Quality metrics for prompts
- `optimization_history` - History of all optimizations
- `uploaded_documents` - Document upload records
- `assistant_messages` - AI assistant conversation history

## Configuration

Edit `.env` file:
```
DATABASE_URL=mysql+pymysql://user:password@localhost:3306/promptengine_db
GEMINI_API_KEY=your_api_key_here
HOST=127.0.0.1
PORT=8000
DEBUG=True

# (Optional) Enable Raptor mini preview for all text clients
# Set `RAPTOR_MINI_ENABLED=True` and optionally `RAPTOR_MODEL_NAME=raptor-mini-preview`
# in your `.env` to route text requests to a Raptor mini preview model.
```

## Features

✓ Real-time prompt optimization with Gemini AI
✓ Automatic quality scoring (clarity, specificity, creativity, technical)
✓ Mode-specific optimization (AI Dev, Image Gen, Chatbot, Data Analysis)
✓ AI Assistant with context awareness
✓ Document keyword extraction
✓ Full optimization history and tracking
✓ MySQL persistence
✓ CORS enabled for frontend integration
✓ Auto API documentation with Swagger/ReDoc

## Frontend Integration

The frontend (`../main.js` and `../index.html`) will connect to this backend using API calls:

```javascript
// Example frontend API call
fetch('http://127.0.0.1:8000/optimize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    original_prompt: "Your prompt here",
    mode: "ai-dev",
    include_tests: true
  })
}).then(r => r.json()).then(data => console.log(data));
```

## Troubleshooting

### MySQL Connection Error
- Ensure MySQL is running
- Check DATABASE_URL in .env
- Verify database exists: `SHOW DATABASES;`

### Gemini API Error
- Verify GEMINI_API_KEY is set in .env
- Get API key from: https://aistudio.google.com/

### Port Already in Use
- Change PORT in .env
- Or kill existing process: `lsof -ti:8000 | xargs kill -9`

## Development

Run with auto-reload:
```bash
python main.py  # DEBUG=True in .env enables reload
```

Check logs for debugging:
```bash
# On Windows PowerShell
Get-Content app.log -Tail 20 -Wait
```
