# PromptEngine Backend Startup Script for Windows PowerShell

Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  PromptEngine Backend Server" -ForegroundColor Green
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Check if in correct directory
if (-not (Test-Path ".\main.py")) {
    Write-Host "ERROR: main.py not found!" -ForegroundColor Red
    Write-Host "Please run this script from the backend folder" -ForegroundColor Yellow
    exit 1
}

Write-Host "📋 Starting backend server..." -ForegroundColor Yellow
Write-Host ""

# Run the backend
python main.py

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Server stopped" -ForegroundColor Red
Write-Host "=====================================================" -ForegroundColor Cyan
