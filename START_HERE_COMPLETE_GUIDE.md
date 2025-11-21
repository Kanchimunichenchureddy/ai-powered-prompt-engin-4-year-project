# 🚀 **COMPLETE PROMPTENGINE STARTUP GUIDE**
## **From Start to End - Everything Working**

---

## **📋 STEP 1: PROJECT OVERVIEW**

### **What is PromptEngine?**
- ✅ **AI-Powered Prompt Optimization Platform**
- ✅ **Frontend**: HTML/CSS/JavaScript (User Interface)
- ✅ **Backend**: Python/FastAPI (API Server)
- ✅ **Database**: MySQL (Data Storage)
- ✅ **AI Service**: Google Gemini (Prompt Optimization)
- ✅ **Authentication**: JWT Tokens (User Login)

### **Complete File Structure:**
```
PromptEngine/
├── 📁 FRONTEND FILES
│   ├── index.html              # Main homepage
│   ├── index-with-css.html     # Working version with embedded CSS
│   ├── auth.html               # Login/Register page
│   ├── templates.html          # Template library
│   ├── analytics.html          # Analytics dashboard
│   ├── history.html            # Optimization history
│   ├── main.js                 # Main JavaScript
│   ├── auth.js                 # Authentication logic
│   ├── templates.js            # Template management
│   ├── analytics.js            # Analytics functionality
│   └── history.js              # History management
│
├── 📁 BACKEND FILES
│   ├── main.py                 # Main FastAPI server
│   ├── auth.py                 # Authentication endpoints
│   ├── models.py               # Database models
│   ├── database.py             # Database connection
│   ├── gemini_service.py       # AI optimization service
│   ├── schemas.py              # Data validation
│   ├── config.py               # Configuration
│   ├── requirements.txt        # Python dependencies
│   └── .env                    # Environment variables
│
└── 📁 RESOURCES
    └── images/                 # UI images and assets
```

---

## **🔧 STEP 2: SETUP REQUIREMENTS**

### **System Requirements:**
- ✅ **Python 3.8+** (for backend)
- ✅ **Web Browser** (Chrome, Firefox, Edge)
- ✅ **Internet Connection** (for AI service)
- ✅ **Text Editor** (VS Code recommended)

### **Check Python Installation:**
```bash
python --version
# Should show: Python 3.8+ 
```

### **Check Required Ports:**
- ✅ **Port 8000**: Backend API server
- ✅ **Port 8080**: Frontend web server
- ✅ **Port 3306**: MySQL database (if using local)

---

## **⚙️ STEP 3: BACKEND SETUP (API SERVER)**

### **3.1 Install Python Dependencies:**
```bash
cd backend
pip install -r requirements.txt
```

### **3.2 Required Python Packages:**
```
fastapi==0.104.1          # Web framework
uvicorn==0.24.0           # ASGI server
pydantic==2.5.0           # Data validation
google-generativeai==0.3.2 # Gemini AI
sqlalchemy==2.0.23        # Database ORM
pymysql==1.1.0            # MySQL connector
python-jose[cryptography]==3.3.0  # JWT tokens
passlib==4.1.2            # Password hashing
bcrypt==4.1.2             # Password encryption
email-validator==2.1.0    # Email validation
python-multipart==0.0.6   # File uploads
python-dotenv==1.0.0      # Environment variables
```

### **3.3 Configure Environment Variables:**
```bash
# Create .env file in backend/ directory
GEMINI_API_KEY=your_gemini_api_key_here
JWT_SECRET_KEY=your_jwt_secret_key_here
DATABASE_URL=mysql://user:password@localhost/promptengine
```

### **3.4 Start Backend Server:**
```bash
cd backend
python main.py
```

### **3.5 Verify Backend is Running:**
- ✅ **Health Check**: http://127.0.0.1:8000/health
- ✅ **API Documentation**: http://127.0.0.1:8000/docs
- ✅ **Console Output**: Should show "Uvicorn running on http://127.0.0.1:8000"

---

## **🌐 STEP 4: FRONTEND SETUP (WEB SERVER)**

### **4.1 Start Frontend Server:**
```bash
# From project root directory
python -m http.server 8080
```

### **4.2 Verify Frontend is Running:**
- ✅ **Server Output**: Should show "Serving HTTP on 0.0.0.0 port 8080"
- ✅ **Test URL**: http://127.0.0.1:8080

### **4.3 Frontend Pages Available:**
- ✅ **Main App**: http://127.0.0.1:8080/index-with-css.html
- ✅ **Login**: http://127.0.0.1:8080/auth.html
- ✅ **Templates**: http://127.0.0.1:8080/templates.html
- ✅ **Analytics**: http://127.0.0.1:8080/analytics.html
- ✅ **History**: http://127.0.0.1:8080/history.html

---

## **🔗 STEP 5: VERIFY CONNECTIONS**

### **5.1 Backend API Connection Test:**
```bash
# Test health endpoint
curl http://127.0.0.1:8000/health

# Expected Response: {"status": "healthy"}
```

### **5.2 Frontend-Backend Communication Test:**
```javascript
// Open browser console and run:
fetch('http://127.0.0.1:8000/health')
  .then(response => response.json())
  .then(data => console.log('Backend connected:', data))
  .catch(error => console.error('Backend connection failed:', error));
```

### **5.3 Database Connection Test:**
```bash
# Check database tables
cd backend
python -c "from database import create_tables; create_tables(); print('Database connected!')"
```

---

## **🧪 STEP 6: COMPLETE SYSTEM TEST**

### **6.1 Test Authentication Flow:**
1. **Go to**: http://127.0.0.1:8080/auth.html
2. **Register**: Create new account
3. **Login**: Use demo account: `user@demo.com` / `demo123`
4. **Verify**: Should redirect to main page with user profile

### **6.2 Test Prompt Optimization:**
1. **Go to**: http://127.0.0.1:8080/index-with-css.html
2. **Login**: If not already logged in
3. **Enter prompt**: "Create a todo app"
4. **Optimize**: Click optimize button
5. **Verify**: Should get comprehensive optimization result

### **6.3 Test Template System:**
1. **Go to**: http://127.0.0.1:8080/templates.html
2. **Browse**: Available templates
3. **Select**: Click "Use Template"
4. **Verify**: Should redirect to main page with template loaded

---

## **📊 STEP 7: VERIFY ALL FEATURES WORKING**

### **✅ Authentication System:**
- ✅ **Registration**: New account creation
- ✅ **Login**: User authentication
- ✅ **Session**: Persistent login
- ✅ **Logout**: Clean session termination
- ✅ **Profile**: User info display

### **✅ Prompt Optimization:**
- ✅ **Analysis**: Real-time quality scoring
- ✅ **Optimization**: AI-powered enhancement
- ✅ **Comparison**: Before/after visual comparison
- ✅ **History**: Optimization tracking
- ✅ **Export**: Copy, download, share functions

### **✅ Template System:**
- ✅ **Browse**: Professional template library
- ✅ **Preview**: Template content preview
- ✅ **Integration**: One-click template loading
- ✅ **Customization**: Template editing capabilities

### **✅ Analytics Dashboard:**
- ✅ **Metrics**: User statistics and KPIs
- ✅ **Charts**: Interactive data visualization
- ✅ **Progress**: Optimization progress tracking
- ✅ **Export**: Data export functionality

---

## **🚨 STEP 8: TROUBLESHOOTING COMMON ISSUES**

### **Issue 1: Backend Not Starting**
```bash
# Check Python version
python --version

# Install dependencies again
pip install -r requirements.txt

# Check port availability
netstat -an | findstr :8000
```

### **Issue 2: Frontend CSS Not Loading**
- ✅ **Solution**: Use `index-with-css.html` (embedded CSS)
- ✅ **Test**: http://127.0.0.1:8080/css-test.html

### **Issue 3: Authentication Not Working**
```bash
# Check backend logs
# Verify .env file exists
# Test auth endpoints directly
```

### **Issue 4: Database Connection Failed**
```bash
# Check MySQL service
# Verify database credentials
# Run database setup script
```

---

## **🎯 STEP 9: PRODUCTION CHECKLIST**

### **Before Going Live:**
- ✅ **Environment Variables**: Set production values
- ✅ **Database**: Setup production database
- ✅ **Security**: Change default JWT secret
- ✅ **CORS**: Configure allowed origins
- ✅ **SSL**: Enable HTTPS
- ✅ **Monitoring**: Setup logging and monitoring

---

## **🎉 STEP 10: SUCCESS VERIFICATION**

### **Complete System Working When You See:**
1. ✅ **Backend Console**: "Uvicorn running on http://127.0.0.1:8000"
2. ✅ **Frontend Console**: "Serving HTTP on 0.0.0.0 port 8080"
3. ✅ **Health Check**: http://127.0.0.1:8000/health returns {"status": "healthy"}
4. ✅ **Main Page**: http://127.0.0.1:8080/index-with-css.html shows full styling
5. ✅ **Login Works**: Can register/login and see user profile
6. ✅ **Optimization Works**: Can optimize prompts and see results
7. ✅ **Templates Work**: Can browse and use templates
8. ✅ **Analytics Work**: Can view charts and statistics

### **Final Test Workflow:**
1. **Start Backend** → **Start Frontend** → **Open Browser**
2. **Register Account** → **Login** → **Optimize Prompt**
3. **Use Template** → **View Analytics** → **Check History**
4. **Logout** → **Login Again** → **Verify Persistence**

**When all steps complete successfully, your PromptEngine is fully operational!** 🚀

---

## **📞 QUICK REFERENCE**

### **Startup Commands:**
```bash
# Terminal 1: Start Backend
cd backend && python main.py

# Terminal 2: Start Frontend  
python -m http.server 8080

# Terminal 3: Open Browser
start http://127.0.0.1:8080/index-with-css.html
```

### **Key URLs:**
- **Main App**: http://127.0.0.1:8080/index-with-css.html
- **Login**: http://127.0.0.1:8080/auth.html
- **API Docs**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

### **Demo Accounts:**
- **Admin**: admin@promptengine.com / admin123
- **User**: user@demo.com / demo123
- **Test**: test@test.com / test123