# Full-Stack Web Application Development Prompt
## Complete Guide to Building Modern Web Applications

### 🎯 **Master Prompt for Full-Stack Development**

**Copy and customize this template for any full-stack web application project:**

```
You are an expert full-stack developer with 10+ years of experience building scalable, production-ready web applications. You specialize in modern frameworks, best practices, and clean code architecture.

**Project Overview:**
Create a [APPLICATION TYPE] web application with [KEY FEATURES]. The application should be scalable, secure, and user-friendly.

**Technical Stack Requirements:**

**Frontend:**
- Framework: [React/Vue/Angular] with TypeScript
- State Management: [Redux/Vuex/MobX]
- Styling: [Tailwind CSS/Material-UI/Bootstrap]
- Routing: [React Router/Vue Router]
- HTTP Client: [Axios/Fetch API]
- Testing: [Jest/Cypress/React Testing Library]

**Backend:**
- Runtime: [Node.js/Python/Java]
- Framework: [Express.js/Django/Spring Boot]
- Database: [PostgreSQL/MongoDB/MySQL]
- ORM: [Prisma/Sequelize/Mongoose]
- Authentication: [JWT/OAuth 2.0]
- Validation: [Joi/Yup/Custom validators]

**Infrastructure:**
- Containerization: Docker
- Cloud Provider: [AWS/Azure/GCP]
- CI/CD: [GitHub Actions/GitLab CI]
- Monitoring: [Sentry/DataDog]

**Core Features to Implement:**
1. User Authentication & Authorization
   - Registration and login with email verification
   - Password reset functionality
   - Role-based access control (RBAC)
   - Session management

2. Database Design & ORM
   - Proper database schema design
   - Migration scripts
   - Seed data for development
   - Database indexing for performance

3. API Development
   - RESTful API design
   - Input validation and sanitization
   - Error handling and logging
   - API documentation (Swagger/OpenAPI)

4. Frontend Development
   - Responsive design for mobile and desktop
   - Component-based architecture
   - State management
   - Form handling and validation

5. Security Implementation
   - HTTPS enforcement
   - Input validation on both client and server
   - SQL injection prevention
   - XSS protection
   - Rate limiting
   - CORS configuration

6. Performance Optimization
   - Code splitting and lazy loading
   - Image optimization
   - Caching strategies
   - Database query optimization
   - CDN integration

7. Testing Strategy
   - Unit tests for individual components
   - Integration tests for API endpoints
   - End-to-end tests for user workflows
   - Load testing for performance

8. Deployment & DevOps
   - Docker containerization
   - Environment-based configuration
   - Automated deployment pipeline
   - Health checks and monitoring
   - Backup and disaster recovery

**Code Quality Standards:**
- Follow ESLint and Prettier configuration
- Write comprehensive unit tests (minimum 80% coverage)
- Use meaningful variable and function names
- Implement proper error handling
- Follow SOLID principles
- Document all API endpoints

**Performance Requirements:**
- Page load time under 3 seconds
- API response time under 200ms
- Support for 1000+ concurrent users
- Mobile-first responsive design

**Security Requirements:**
- Implement OWASP Top 10 security measures
- Use parameterized queries
- Implement proper authentication and authorization
- Regular security audits and updates

**Development Phases:**
Phase 1: Project setup and database design
Phase 2: User authentication and basic API
Phase 3: Core feature implementation
Phase 4: Testing and optimization
Phase 5: Deployment and monitoring

**Deliverables:**
1. Complete source code with proper folder structure
2. Database schema and migration files
3. API documentation
4. Deployment instructions
5. User manual
6. Testing documentation

Please provide the implementation following these specifications exactly, including all code files, configurations, and documentation.
```

---

## 🛠 **Step-by-Step Implementation Guide**

### **Phase 1: Project Setup (Week 1)**

#### 1.1 Initialize Project Structure
```bash
# Create project directory
mkdir my-fullstack-app
cd my-fullstack-app

# Initialize Git repository
git init

# Create folder structure
mkdir -p {client,server,docs,scripts}
mkdir -p client/{src,public,tests}
mkdir -p server/{src,tests,config}
```

#### 1.2 Setup Backend
```bash
# Navigate to server directory
cd server

# Initialize Node.js project
npm init -y

# Install dependencies
npm install express cors helmet morgan dotenv bcryptjs jsonwebtoken
npm install -D nodemon jest supertest @types/node typescript

# Create basic Express server
# See detailed server setup below
```

#### 1.3 Setup Frontend
```bash
# Navigate back to project root
cd ..

# Create React app with TypeScript
npx create-react-app client --template typescript

# Install additional dependencies
cd client
npm install axios react-router-dom @reduxjs/toolkit react-redux
npm install -D tailwindcss @tailwindcss/forms

# Setup Tailwind CSS
npx tailwindcss init -p
```

#### 1.4 Database Setup
```bash
# Install PostgreSQL
# Create database
createdb myapp_db

# Install Prisma
npm install prisma @prisma/client
npx prisma init
```

---

### **Phase 2: Database Design (Week 1-2)**

#### 2.1 Create Database Schema
```prisma
// server/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  posts     Post[]
  
  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  
  @@map("posts")
}

enum Role {
  USER
  ADMIN
}
```

#### 2.2 Create Migration
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

### **Phase 3: Backend Development (Week 2-4)**

#### 3.1 Express Server Setup
```javascript
// server/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/posts', require('./routes/posts'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
```

#### 3.2 Authentication Routes
```javascript
// server/src/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

// Register
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').isLength({ min: 1 }).trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, name } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').exists()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
```

---

### **Phase 4: Frontend Development (Week 4-6)**

#### 4.1 React Component Structure
```jsx
// client/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
```

#### 4.2 Redux Store Setup
```javascript
// client/src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import postReducer from './slices/postSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

#### 4.3 Authentication Slice
```javascript
// client/src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/authAPI';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    const response = await authAPI.login(credentials);
    localStorage.setItem('token', response.token);
    return response;
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { email: string; password: string; name: string }) => {
    const response = await authAPI.register(userData);
    localStorage.setItem('token', response.token);
    return response;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
```

---

### **Phase 5: Testing (Week 6-7)**

#### 5.1 Unit Tests
```javascript
// server/src/tests/auth.test.js
const request = require('supertest');
const app = require('../app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

describe('Authentication', () => {
  beforeAll(async () => {
    // Setup test database
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.user.email).toBe(userData.email);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'password123',
        name: 'Test User'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(response.status).toBe(400);
    });
  });
});
```

#### 5.2 Integration Tests
```javascript
// client/src/tests/Login.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../store';
import Login from '../pages/Login';
import { authAPI } from '../api/authAPI';

jest.mock('../api/authAPI');

describe('Login Component', () => {
  beforeEach(() => {
    render(
      <Provider store={store}>
        <Login />
      </Provider>
    );
  });

  test('renders login form', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('submits form with valid credentials', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };

    (authAPI.login as jest.Mock).mockResolvedValue(mockResponse);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });
});
```

---

### **Phase 6: Deployment (Week 7-8)**

#### 6.1 Docker Configuration
```dockerfile
# server/Dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["node", "src/app.js"]
```

```dockerfile
# client/Dockerfile
FROM node:16-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 6.2 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: myapp_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  server:
    build: ./server
    environment:
      DATABASE_URL: postgresql://postgres:password@postgres:5432/myapp_db
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    ports:
      - "5000:5000"
    depends_on:
      - postgres

  client:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - server

volumes:
  postgres_data:
```

#### 6.3 CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy Application

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: |
          cd server && npm ci
          cd ../client && npm ci
      
      - name: Run tests
        run: |
          cd server && npm test
          cd ../client && npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to production
        run: |
          # Add deployment commands here
          echo "Deploying to production..."
```

---

## 📋 **Project Checklist**

### **Setup & Configuration**
- [ ] Initialize Git repository
- [ ] Setup project folder structure
- [ ] Configure development environment
- [ ] Setup database and ORM
- [ ] Configure linting and formatting

### **Backend Development**
- [ ] Setup Express server
- [ ] Implement authentication system
- [ ] Create database models
- [ ] Build RESTful API endpoints
- [ ] Add input validation
- [ ] Implement error handling
- [ ] Add security middleware
- [ ] Create API documentation

### **Frontend Development**
- [ ] Setup React application
- [ ] Configure routing
- [ ] Implement state management
- [ ] Create reusable components
- [ ] Build user interface
- [ ] Add form handling
- [ ] Implement responsive design
- [ ] Add error handling

### **Testing**
- [ ] Write unit tests for backend
- [ ] Write unit tests for frontend
- [ ] Create integration tests
- [ ] Setup end-to-end tests
- [ ] Achieve 80%+ test coverage

### **Deployment**
- [ ] Create Docker configuration
- [ ] Setup CI/CD pipeline
- [ ] Configure production environment
- [ ] Deploy to cloud provider
- [ ] Setup monitoring and logging

### **Documentation**
- [ ] Write API documentation
- [ ] Create user manual
- [ ] Write deployment guide
- [ ] Document troubleshooting steps

---

## 🔧 **Common Customizations**

### **For E-commerce Applications:**
- Add shopping cart functionality
- Implement payment processing (Stripe/PayPal)
- Add inventory management
- Include order tracking
- Add product reviews and ratings

### **For Social Media Applications:**
- Add real-time messaging
- Implement news feed
- Add user profiles and following
- Include media uploads
- Add notifications system

### **For SaaS Applications:**
- Add subscription management
- Implement multi-tenancy
- Add usage analytics
- Include billing and invoicing
- Add team collaboration features

### **For Content Management:**
- Add rich text editor
- Implement media library
- Add content versioning
- Include SEO optimization
- Add content scheduling

---

## 📚 **Additional Resources**

### **Learning Resources:**
- [React Documentation](https://reactjs.org/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### **Tools and Services:**
- **Database:** PostgreSQL, MongoDB, MySQL
- **Authentication:** Auth0, Firebase Auth, AWS Cognito
- **Cloud Providers:** AWS, Google Cloud, Azure
- **Monitoring:** Sentry, DataDog, New Relic
- **CI/CD:** GitHub Actions, GitLab CI, Jenkins

---

## 🎉 **Success Metrics**

### **Performance Goals:**
- Page load time: < 3 seconds
- API response time: < 200ms
- Test coverage: > 80%
- Mobile responsiveness: 100%

### **Quality Standards:**
- Zero critical security vulnerabilities
- Clean, maintainable code
- Comprehensive documentation
- Proper error handling

### **User Experience:**
- Intuitive navigation
- Responsive design
- Fast performance
- Accessible interface

---

## 🚀 **Next Steps**

1. **Customize the prompt** for your specific application needs
2. **Follow the implementation phases** step by step
3. **Test thoroughly** at each stage
4. **Deploy to production** with proper monitoring
5. **Maintain and update** regularly

Remember: This is a comprehensive template that you should adapt based on your specific requirements, timeline, and technical constraints. Start with the core features and gradually add complexity as needed.

**Happy coding! 🎉**