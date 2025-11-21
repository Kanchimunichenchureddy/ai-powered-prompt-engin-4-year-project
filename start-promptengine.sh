#!/bin/bash

echo ""
echo "========================================"
echo "   PROMPTENGINE COMPLETE STARTUP"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed or not in PATH"
    echo "Please install Python 3.8+ and try again"
    exit 1
fi

echo "✅ Python detected: $(python3 --version)"
echo ""
echo "📋 Starting PromptEngine Complete System..."
echo ""

# Step 1: Check if backend dependencies are installed
echo "🔧 Checking backend dependencies..."
cd backend

if ! pip3 show fastapi &> /dev/null; then
    echo "⚠️  Installing backend dependencies..."
    pip3 install -r requirements.txt
else
    echo "✅ Backend dependencies are installed"
fi

# Step 2: Start Backend Server
echo ""
echo "🚀 Starting Backend Server (Port 8000)..."
gnome-terminal --title="PromptEngine Backend" -- bash -c "python3 main.py; exec bash" &

# Wait for backend to start
echo "⏳ Waiting for backend to initialize..."
sleep 5

# Step 3: Test backend connection
echo "🔍 Testing backend connection..."
if curl -s http://127.0.0.1:8000/health > /dev/null; then
    echo "✅ Backend is running"
else
    echo "⚠️  Backend may still be starting..."
fi

# Step 4: Start Frontend Server
cd ..
echo ""
echo "🌐 Starting Frontend Server (Port 8080)..."
gnome-terminal --title="PromptEngine Frontend" -- bash -c "python3 -m http.server 8080; exec bash" &

# Wait for frontend to start
echo "⏳ Waiting for frontend to initialize..."
sleep 3

# Step 5: Open browser with main application
echo ""
echo "🎉 Opening PromptEngine in your browser..."
sleep 2

if command -v xdg-open &> /dev/null; then
    xdg-open http://127.0.0.1:8080/index-with-css.html
elif command -v open &> /dev/null; then
    open http://127.0.0.1:8080/index-with-css.html
else
    echo "Please open http://127.0.0.1:8080/index-with-css.html in your browser"
fi

echo ""
echo "========================================"
echo "   PROMPTENGINE STARTUP COMPLETE!"
echo "========================================"
echo ""
echo "🔗 Your PromptEngine URLs:"
echo "   Main App: http://127.0.0.1:8080/index-with-css.html"
echo "   Login:    http://127.0.0.1:8080/auth.html"
echo "   API Docs: http://127.0.0.1:8000/docs"
echo ""
echo "👤 Demo Accounts:"
echo "   Email: user@demo.com  Password: demo123"
echo "   Email: admin@promptengine.com  Password: admin123"
echo ""
echo "📋 Instructions:"
echo "   1. Login with demo account or register new account"
echo "   2. Start optimizing prompts"
echo "   3. Use templates to save time"
echo "   4. View analytics and history"
echo ""
echo "⚠️  Keep both terminal windows open to keep servers running"
echo "   Press Ctrl+C in each terminal when done using PromptEngine"
echo ""