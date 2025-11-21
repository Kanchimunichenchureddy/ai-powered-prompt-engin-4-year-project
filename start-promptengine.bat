@echo off
echo.
echo ========================================
echo    PROMPTENGINE COMPLETE STARTUP
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

echo ✅ Python detected: 
python --version

echo.
echo 📋 Starting PromptEngine Complete System...
echo.

REM Step 1: Check if backend dependencies are installed
echo 🔧 Checking backend dependencies...
cd backend
pip show fastapi >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Installing backend dependencies...
    pip install -r requirements.txt
) else (
    echo ✅ Backend dependencies are installed
)

REM Step 2: Start Backend Server
echo.
echo 🚀 Starting Backend Server (Port 8000)...
start "PromptEngine Backend" cmd /k "python main.py"

REM Wait for backend to start
echo ⏳ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Step 3: Test backend connection
echo 🔍 Testing backend connection...
powershell -Command "try { Invoke-WebRequest -Uri 'http://127.0.0.1:8000/health' -TimeoutSec 5 | Out-Null; Write-Host '✅ Backend is running' } catch { Write-Host '⚠️  Backend may still be starting...' }"

REM Step 4: Start Frontend Server
cd ..
echo.
echo 🌐 Starting Frontend Server (Port 8080)...
start "PromptEngine Frontend" cmd /k "python -m http.server 8080"

REM Wait for frontend to start
echo ⏳ Waiting for frontend to initialize...
timeout /t 3 /nobreak >nul

REM Step 5: Open browser with main application
echo.
echo 🎉 Opening PromptEngine in your browser...
timeout /t 2 /nobreak >nul
start http://127.0.0.1:8080/index-with-css.html

echo.
echo ========================================
echo    PROMPTENGINE STARTUP COMPLETE!
echo ========================================
echo.
echo 🔗 Your PromptEngine URLs:
echo    Main App: http://127.0.0.1:8080/index-with-css.html
echo    Login:    http://127.0.0.1:8080/auth.html
echo    API Docs: http://127.0.0.1:8000/docs
echo.
echo 👤 Demo Accounts:
echo    Email: user@demo.com  Password: demo123
echo    Email: admin@promptengine.com  Password: admin123
echo.
echo 📋 Instructions:
echo    1. Login with demo account or register new account
echo    2. Start optimizing prompts
echo    3. Use templates to save time
echo    4. View analytics and history
echo.
echo ⚠️  Keep both terminal windows open to keep servers running
echo    Close this window when done using PromptEngine
echo.
pause