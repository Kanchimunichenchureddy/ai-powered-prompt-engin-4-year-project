@echo off
REM PromptEngine Backend Startup Script for Windows PowerShell

echo ============================================================
echo PromptEngine Backend Setup and Run
echo ============================================================
echo.

REM Change to backend directory
cd /d "%~dp0backend"

if not exist ".env" (
    echo [1] Creating .env file from template...
    copy .env.example .env
    echo. 
    echo IMPORTANT: Update the following in .env:
    echo   - DATABASE_URL (MySQL connection string)
    echo   - GEMINI_API_KEY (from Google AI Studio)
    echo.
)

echo [2] Installing Python dependencies...
python -m pip install -r requirements.txt > nul 2>&1
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)

echo [3] Checking MySQL connection...
REM This is a basic check - assumes MySQL is running locally

echo.
echo ============================================================
echo Starting FastAPI Backend...
echo ============================================================
echo.
echo Backend will start on: http://127.0.0.1:8000
echo API Docs: http://127.0.0.1:8000/docs
echo.

python main.py

pause
