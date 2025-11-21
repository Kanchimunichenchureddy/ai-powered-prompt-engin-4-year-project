#!/bin/bash
# PromptEngine Backend Startup Script for macOS/Linux

echo "============================================================"
echo "PromptEngine Backend Setup and Run"
echo "============================================================"
echo ""

# Change to backend directory
cd "$(dirname "$0")/backend"

if [ ! -f ".env" ]; then
    echo "[1] Creating .env file from template..."
    cp .env.example .env
    echo ""
    echo "IMPORTANT: Update the following in .env:"
    echo "  - DATABASE_URL (MySQL connection string)"
    echo "  - GEMINI_API_KEY (from Google AI Studio)"
    echo ""
fi

echo "[2] Installing Python dependencies..."
python3 -m pip install -r requirements.txt > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo "[3] Backend ready to start"
echo ""
echo "============================================================"
echo "Starting FastAPI Backend..."
echo "============================================================"
echo ""
echo "Backend will start on: http://127.0.0.1:8000"
echo "API Docs: http://127.0.0.1:8000/docs"
echo ""

python3 main.py
