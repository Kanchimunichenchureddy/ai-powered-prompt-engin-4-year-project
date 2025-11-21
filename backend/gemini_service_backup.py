import google.generativeai as genai
from config import GEMINI_API_KEY
import re
import logging

class GeminiService:
    def __init__(self):
        if GEMINI_API_KEY:
            genai.configure(api_key=GEMINI_API_KEY)
        # default model used for 'ai-dev' mode
        self.default_model = "gemini-2.0-flash"
        # mapping from optimization mode to Gemini model name
        self.model_map = {
            "fast": "gemini-2.0-mini",
            "ai-dev": "gemini-2.0-flash",
            "creative": "gemini-2.0-pro",
            "content-writing": "gemini-2.0-flash",
            "image-generation": "gemini-2.0-pro", 
            "business-analysis": "gemini-2.0-flash",
            "chatbot-training": "gemini-2.0-flash",
            "research-academic": "gemini-2.0-pro",
        }
        
        # Mode-specific configurations with enhanced prompt formatting
        self.mode_configs = {
            'ai-dev': {
                'system_prompt': '''You are an expert software developer and architect. Provide technically accurate, production-ready solutions with:
                - Clean, well-documented code with best practices
                - Comprehensive error handling and edge cases
                - Performance optimization and security considerations
                - Complete testing strategies and examples
                - Detailed architecture and design patterns''',
                'temperature': 0.3,
                'max_tokens': 2048,
                'prompt_structure': {
                    'required_fields': ['programming_language', 'functionality', 'requirements'],
                    'optional_fields': ['performance_criteria', 'security_requirements', 'testing_approach'],
                    'output_format': 'code_with_documentation'
                }
            },
            'content-writing': {
                'system_prompt': '''You are a skilled content writer and copywriter. Create engaging, well-structured content that:
                - Resonates with the specified target audience
                - Follows the requested tone and style guidelines
                - Incorporates SEO best practices when applicable
                - Includes compelling calls-to-action
                - Provides clear value and actionable insights''',
                'temperature': 0.7,
                'max_tokens': 3072,
                'prompt_structure': {
                    'required_fields': ['content_type', 'target_audience', 'key_message'],
                    'optional_fields': ['tone', 'length', 'seo_keywords', 'call_to_action'],
                    'output_format': 'formatted_content'
                }
            },
            'image-generation': {
                'system_prompt': '''You are an expert in visual arts and AI image generation. Create detailed visual descriptions that:
                - Provide specific artistic styles and composition details
                - Include comprehensive lighting and atmosphere descriptions
                - Specify color palettes and mood elements
                - Include technical parameters for optimal AI image generation
                - Reference artistic movements and techniques when appropriate''',
                'temperature': 0.8,
                'max_tokens': 1024,
                'prompt_structure': {
                    'required_fields': ['subject', 'style', 'composition'],
                    'optional_fields': ['lighting', 'colors', 'mood', 'technical_specs'],
                    'output_format': 'detailed_visual_description'
                }
            },
            'business-analysis': {
                'system_prompt': '''You are a senior business analyst and data scientist. Provide data-driven insights with:
                - Clear methodology and statistical rigor
                - Actionable recommendations with business impact
                - Professional reporting format with executive summaries
                - Comprehensive visualizations and interpretations
                - Risk analysis and implementation considerations''',
                'temperature': 0.2,
                'max_tokens': 2560,
                'prompt_structure': {
                    'required_fields': ['data_scope', 'analysis_objective', 'metrics'],
                    'optional_fields': ['timeframe', 'methodology', 'visualization_type'],
                    'output_format': 'structured_business_report'
                }
            },
            'chatbot-training': {
                'system_prompt': '''You are an expert in conversational AI and chatbot development. Design natural conversations that:
                - Maintain consistent personality and tone throughout
                - Provide context-aware and empathetic responses
                - Handle edge cases and misunderstandings gracefully
                - Include scalable conversation flows and patterns
                - Balance helpfulness with appropriate boundaries''',
                'temperature': 0.5,
                'max_tokens': 2048,
                'prompt_structure': {
                    'required_fields': ['bot_purpose', 'personality', 'conversation_scenarios'],
                    'optional_fields': ['tone', 'constraints', 'integration_requirements'],
                    'output_format': 'conversation_design'
                }
            },
            'research-academic': {
                'system_prompt': '''You are an academic researcher and scholar. Provide academically rigorous content with:
                - Comprehensive literature review and methodology
                - Proper citations and academic formatting
                - Clear thesis statements and supporting arguments
                - Objective analysis with acknowledged limitations
                - Contribution to existing knowledge and future research directions''',
                'temperature': 0.3,
                'max_tokens': 4096,
                'prompt_structure': {
                    'required_fields': ['research_question', 'methodology', 'scope'],
                    'optional_fields': ['literature_focus', 'theoretical_framework', 'limitations'],
                    'output_format': 'academic_paper'
                }
            }
        }
        
        # Current active mode configuration
        self.current_mode = 'ai-dev'
        self.current_mode_config = self.mode_configs['ai-dev']

        self.model = self.default_model

        # Image model mapping for image generation modes
        self.image_model_map = {
            "photo": "gemini-image-v1",
            "illustration": "gemini-image-art",
            "stylized": "gemini-image-stylized",
            "fast": "gemini-image-mini",
        }
    
    def craft_prompt(self, original_prompt: str, mode: str = "general") -> dict:
        """
        Craft a structured Gemini-optimized prompt with detailed requirements
        Returns a dictionary with system_role, instruction, constraints, example, response_format, and full prompt
        """
        constraints = []
        
        if mode == "ai-dev":
            constraints = [
                "Provide step-by-step implementation details with pseudocode",
                "Include architecture, design patterns, and best practices",
                "Handle edge cases and error scenarios",
                "Provide complete, production-ready code examples",
                "Include performance optimization strategies",
                "Detail database schema if applicable",
                "Explain API design and endpoint specifications",
                "Provide security considerations and input validation",
                "Include testing strategies and unit test examples"
            ]
        elif mode == "image-gen":
            constraints = [
                "Focus on detailed visual composition and layout",
                "Specify lighting conditions and mood",
                "Detail color palette and color psychology",
                "Include specific artistic style references",
                "Describe texture and material properties",
                "Specify camera angle and perspective",
                "Include atmospheric and environmental details",
                "Describe focal points and visual hierarchy"
            ]
        elif mode == "chatbot":
            constraints = [
                "Define clear conversation flow and user intents",
                "Maintain consistent persona and tone",
                "Include context awareness and state management",
                "Provide relevant follow-up questions",
                "Handle ambiguous requests gracefully",
                "Include error handling and user guidance",
                "Support multi-turn conversations",
                "Include emoji and personality where appropriate"
            ]
        elif mode == "data-analysis":
            constraints = [
                "Define clear research questions and hypotheses",
                "Specify data sources, types, and formats",
                "Detail preprocessing and cleaning steps",
                "Include statistical methods and significance levels",
                "Describe visualization requirements and chart types",
                "Include assumptions and limitations",
                "Provide interpretation guidance for results",
                "Include Python/SQL code examples where applicable"
            ]
        
        system_role = "You are an expert AI assistant specialized in comprehensive project guidance. Provide detailed, actionable instructions that cover the entire implementation lifecycle from planning to production deployment."
        
        example = f"Example for {mode}: Provide a complete implementation guide that includes: (1) Project overview and requirements, (2) Architecture and design decisions, (3) Step-by-step implementation with code, (4) Testing and quality assurance, (5) Deployment and monitoring strategy."
        
        response_format = """Format your response as follows:
📋 PROJECT OVERVIEW: Brief summary of the project
🏗️ ARCHITECTURE & DESIGN: System design and technical approach  
📝 STEP-BY-STEP IMPLEMENTATION: Detailed numbered steps with code/examples
🧪 TESTING & QA: Testing strategy and examples
🚀 DEPLOYMENT & MONITORING: Production deployment and monitoring guide
⚠️ COMMON PITFALLS: Things to watch out for
💡 OPTIMIZATION TIPS: Performance and efficiency suggestions
📚 RESOURCES & REFERENCES: Useful links and documentation"""
        
        constraint_text = "\n".join([f"• {c}" for c in constraints])
        
        full_prompt = f"""{system_role}

TASK: {original_prompt}

MODE: {mode}

REQUIREMENTS:
{constraint_text}

RESPONSE FORMAT:
{response_format}

Please provide a comprehensive, detailed response that will guide someone from beginning to end of this project."""
        
        return {
            "system_role": system_role,
            "instruction": original_prompt,
            "constraints": constraint_text,
            "example": example,
            "response_format": response_format,
            "full": full_prompt
        }
    
    def optimize_prompt_for_mode(self, original_prompt: str, mode: str = "ai-dev", options: dict = None) -> str:
        """
        Enhanced mode-specific optimization with template selection
        Supports Image Mode, Dev Mode, and Auto-detect Mode
        """
        if options is None:
            options = {}
        
        # Handle auto-detection mode
        if mode == "auto" or mode == "auto-detect":
            detected_mode = self._auto_detect_mode(original_prompt)
            logger = logging.getLogger(__name__)
            logger.info(f"🤖 Auto-detected mode: {detected_mode}")
            mode = detected_mode
        
        # Select appropriate template and optimization strategy
        if mode == "image-generation" or mode == "image-mode":
            return self._optimize_image_mode(original_prompt, options)
        elif mode == "ai-dev" or mode == "dev-mode":
            return self._optimize_dev_mode(original_prompt, options)
        else:
            # Fallback to general optimization for other modes
            return self.optimize_prompt(original_prompt, mode, options)
    
    def optimize_prompt(self, original_prompt: str, mode: str = "ai-dev", options: dict = None) -> str:
        """
        Optimize a prompt using Gemini API with comprehensive project guidance
        For AI Development mode: Creates the most complete project implementation guide possible
        """
        if options is None:
            options = {}
        
        # If this is AI Development mode, use specialized optimization
        if mode == "ai-dev":
            return self._optimize_ai_development_prompt(original_prompt, options)
        
        try:
            # For other modes, use general optimization
            if GEMINI_API_KEY:
                optimization_query = f"""TASK: Create a detailed implementation guide for: "{original_prompt}"
MODE: {mode}
OPTIONS: Tests={options.get('include_tests', False)}, Docs={options.get('add_documentation', False)}, Performance={options.get('performance_optimization', False)}, Security={options.get('security_features', False)}

Provide a comprehensive, well-structured response that covers all aspects of implementing this request."""
                
                # Select model according to requested optimization mode
                selected_model = self.model_map.get(mode, self.default_model)
                # update instance model for downstream use
                self.model = selected_model
                logger = logging.getLogger(__name__)
                logger.debug(f"Using Gemini model '{selected_model}' for mode '{mode}'")

                model = genai.GenerativeModel(selected_model)
                response = model.generate_content(optimization_query)
                optimized_text = response.text.strip()
                # Post-process to add visual separators and improve readability
                optimized_text = self._format_output(optimized_text)
                return optimized_text
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.exception("Gemini API error while optimizing prompt; falling back to rule-based optimization")
        
        # Fallback rule-based optimization
        return self._fallback_optimize(original_prompt, mode, options)
    
    def _optimize_ai_development_prompt(self, original_prompt: str, options: dict) -> str:
        """
        Specialized optimization for AI Development mode - creates comprehensive project implementation guides
        """
        try:
            if GEMINI_API_KEY:
                # Enhanced AI Development prompt with maximum detail and structure
                ai_dev_optimization_query = f"""EXPERT SOFTWARE ARCHITECT TASK: Create the most comprehensive, production-ready implementation guide for the following project:

PROJECT REQUEST: "{original_prompt}"

USER OPTIONS:
- Include Testing: {options.get('include_tests', False)}
- Add Documentation: {options.get('add_documentation', False)} 
- Performance Optimization: {options.get('performance_optimization', False)}
- Security Features: {options.get('security_features', False)}

GENERATE AN EXTREMELY DETAILED IMPLEMENTATION GUIDE WITH THESE EXACT SECTIONS:

🏗️ PROJECT ARCHITECTURE & OVERVIEW
=====================================

1. PROJECT SUMMARY
- One-sentence description of what we're building
- Primary business value and purpose
- Target users and use cases
- Success criteria and metrics

2. SYSTEM ARCHITECTURE  
- High-level system design with components
- Data flow between components
- Technology stack recommendations with versions
- Design patterns and architectural principles used
- Scalability and performance considerations

3. FUNCTIONAL REQUIREMENTS
- Core features (must-have functionality)
- User stories with acceptance criteria
- API specifications and data contracts
- Business logic requirements
- Integration requirements

4. NON-FUNCTIONAL REQUIREMENTS
- Performance benchmarks (response times, throughput)
- Security standards and compliance needs
- Scalability targets (concurrent users, data volume)
- Reliability and availability requirements
- Maintainability and code quality standards

📊 DATA DESIGN & MODELING
========================

5. DATABASE SCHEMA DESIGN
- Entity relationship diagram (textual format)
- Table definitions with all fields, types, and constraints
- Indexes and optimization strategies
- Data migration considerations
- Backup and recovery strategy

6. API DESIGN SPECIFICATION
- RESTful endpoint definitions with full CRUD operations
- Request/response schemas in JSON format
- Authentication and authorization patterns
- Error handling and status codes
- API versioning strategy

💻 DETAILED IMPLEMENTATION PLAN
==============================

7. DEVELOPMENT ENVIRONMENT SETUP
- Step-by-step local development setup
- Required tools, SDKs, and dependencies
- Environment configuration and variables
- Database setup and initial data
- Development workflow and best practices

8. CORE IMPLEMENTATION STEPS (25-30 DETAILED STEPS)

STEP 1: Project Structure & Dependencies
Purpose: Establish the foundation and development environment
Action: Create project directory structure, initialize version control, and set up package management
Commands: 
- mkdir project_name && cd project_name
- git init
- [language-specific package manager init]
Expected: Clean project structure with version control ready

STEP 2: Database Setup & Configuration  
Purpose: Establish data persistence layer
Action: Set up database server, create initial schema, configure connection
Commands: [Database-specific setup commands]
Expected: Database running with empty schema ready for development

STEP 3: Core Data Models Implementation
Purpose: Create the foundational data structures  
Action: Implement entity classes/models with relationships and validation
Code Example: [Show main model class with annotations]
Expected: All core models created with proper validation

STEP 4: Database Access Layer
Purpose: Abstract database operations for maintainability
Action: Implement repository pattern or ORM setup with basic CRUD operations
Code Example: [Show repository interface and implementation]
Expected: Clean data access layer with consistent patterns

STEP 5: Business Logic Layer
Purpose: Implement core application logic separate from data access
Action: Create service classes that orchestrate business operations
Code Example: [Show service class with main business methods]
Expected: Business logic properly separated and testable

STEP 6: Authentication & Authorization
Purpose: Secure the application with proper access controls
Action: Implement authentication middleware and role-based access
Code Example: [Show auth middleware and JWT handling]
Expected: Secure endpoints with proper authentication

STEP 7: API Endpoints Implementation
Purpose: Create the external interface for the application
Action: Implement RESTful controllers/routes with proper HTTP methods
Code Example: [Show controller class with CRUD endpoints]
Expected: Full API with proper status codes and responses

STEP 8: Input Validation & Error Handling  
Purpose: Ensure data integrity and proper error responses
Action: Add comprehensive validation and error handling middleware
Code Example: [Show validation decorators and error handlers]
Expected: Robust error handling with informative error messages

STEP 9: Logging & Monitoring Setup
Purpose: Provide visibility into application behavior
Action: Configure structured logging and basic monitoring
Code Example: [Show logging configuration and usage]
Expected: Comprehensive logging throughout the application

STEP 10: Configuration Management
Purpose: Make the application configurable for different environments
Action: Implement environment-based configuration with secrets management
Code Example: [Show config classes and environment handling]
Expected: Flexible configuration system for dev/staging/prod

[Continue with STEPS 11-30 covering: Testing setup, Performance optimization, Security hardening, Documentation, Deployment preparation, CI/CD pipeline, Monitoring setup, etc.]

🧪 COMPREHENSIVE TESTING STRATEGY
===============================

9. TESTING IMPLEMENTATION
- Unit test framework setup and configuration
- Integration test strategy for API endpoints
- Database testing with test fixtures
- Performance testing benchmarks
- Security testing checklist
- Test automation and CI/CD integration

10. CODE EXAMPLES & TEMPLATES
- Complete working code for main components
- Configuration file templates
- Database migration scripts
- Deployment scripts and configurations
- Monitoring and alerting setup

🚀 DEPLOYMENT & OPERATIONS
=========================

11. DEPLOYMENT STRATEGY
- Production environment setup
- Database deployment and migration process  
- Application deployment with zero-downtime
- Monitoring and alerting configuration
- Backup and disaster recovery procedures

12. MAINTENANCE & MONITORING
- Performance monitoring and optimization
- Security patch management
- Error tracking and resolution
- Capacity planning and scaling
- Documentation maintenance

⚡ OPTIMIZATION & BEST PRACTICES
==============================

13. PERFORMANCE OPTIMIZATION
- Database query optimization techniques
- Caching strategies (Redis, in-memory, etc.)
- API response optimization
- Background job processing
- Load balancing and scaling strategies

14. SECURITY BEST PRACTICES
- Input sanitization and validation
- Authentication and authorization patterns
- Data encryption at rest and in transit  
- Security headers and CORS configuration
- Regular security auditing procedures

15. CODE QUALITY & MAINTAINABILITY
- Code review process and standards
- Automated code quality checks
- Documentation standards and generation
- Refactoring guidelines
- Technical debt management

🛠️ TROUBLESHOOTING & COMMON ISSUES
=================================

16. COMMON DEVELOPMENT CHALLENGES
- Typical implementation pitfalls and solutions
- Performance bottlenecks and fixes
- Security vulnerabilities to avoid
- Integration challenges and resolutions
- Debugging techniques and tools

17. PRODUCTION ISSUES & SOLUTIONS
- Common runtime errors and fixes
- Performance degradation troubleshooting
- Database connectivity and optimization issues
- Security incident response procedures
- Disaster recovery and backup restoration

📚 RESOURCES & NEXT STEPS
========================

18. ADDITIONAL RESOURCES
- Official documentation links
- Best practice guides and tutorials
- Community resources and forums
- Related tools and libraries
- Advanced topics for future learning

Generate the COMPLETE guide following this structure with maximum detail, real code examples, and actionable steps. Make this the most comprehensive implementation guide possible for any software project."""

                # Use AI Development model with precision settings
                model = genai.GenerativeModel(self.model)
                response = model.generate_content(ai_dev_optimization_query)
                optimized_text = response.text.strip()
                
                # Enhanced post-processing for AI dev mode
                optimized_text = self._enhance_ai_dev_output(optimized_text)
                return optimized_text
                
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.exception("Gemini API error in AI Development optimization; using enhanced fallback")
        
        # Enhanced fallback for AI Development mode
        return self._ai_dev_fallback(original_prompt, options)
    
    def _enhance_ai_dev_output(self, text: str) -> str:
        """
        Enhance AI Development mode output with better formatting and structure
        """
        import re
        
        # Add visual separators for major sections
        text = re.sub(
            r'(🏗️|📊|💻|🧪|🚀|⚡|🛠️|📚)\s*([A-Z\s&]+)\n=+',
            lambda m: f'\n{"="*80}\n{m.group(1)} {m.group(2)}\n{"="*80}\n',
            text
        )
        
        # Enhance step formatting
        text = re.sub(
            r'STEP (\d+): ([^\n]+)',
            lambda m: f'\n--- STEP {m.group(1)}: {m.group(2)} ---\n',
            text
        )
        
        # Add better spacing and visual elements
        text = re.sub(r'\n(\d+\.\s)', r'\n\n\1', text)
        text = text.replace('Commands:', '💻 Commands:')
        text = text.replace('Expected:', '✅ Expected:')
        text = text.replace('Purpose:', '🎯 Purpose:')
        text = text.replace('Action:', '⚡ Action:')
        
        # Add footer
        text = text.rstrip() + f'\n\n{"="*80}\n🎉 COMPLETE AI DEVELOPMENT GUIDE\n{"="*80}\n'
        
        return text
    
    def _ai_dev_fallback(self, original_prompt: str, options: dict) -> str:
        """
        Enhanced fallback for AI Development mode with comprehensive project structure
        """
        return f"""{"="*80}
🏗️ COMPREHENSIVE AI DEVELOPMENT IMPLEMENTATION GUIDE
{"="*80}

📋 PROJECT OVERVIEW
==================
Building a complete solution for: {original_prompt}

This guide provides a production-ready implementation with:
✅ Full system architecture and design
✅ Step-by-step implementation plan  
✅ Complete code examples and templates
✅ Comprehensive testing strategy
✅ Production deployment procedures
✅ Monitoring and maintenance guidelines

🎯 FUNCTIONAL REQUIREMENTS
=========================
CORE_FUNCTIONALITY: Implement the primary features requested
DATA_MANAGEMENT: Handle all data operations with validation
USER_INTERFACE: Provide intuitive user interaction
ERROR_HANDLING: Comprehensive error management and recovery
PERFORMANCE: Optimized for speed and scalability
SECURITY: Enterprise-level security implementation

⚡ TECHNICAL ARCHITECTURE
========================
PROGRAMMING_LANGUAGE: Python 3.11+ with FastAPI framework
DATABASE: PostgreSQL with SQLAlchemy ORM
AUTHENTICATION: JWT-based authentication with role management
CACHING: Redis for session and data caching
MONITORING: Prometheus metrics with Grafana dashboards
DEPLOYMENT: Docker containers with Kubernetes orchestration

💻 STEP-BY-STEP IMPLEMENTATION (25 DETAILED STEPS)
===============================================

--- STEP 1: Environment Setup ---
🎯 Purpose: Establish development environment and project foundation
⚡ Action: Create project structure, initialize Git, set up virtual environment
💻 Commands: 
   mkdir {original_prompt.replace(' ', '_').lower()}_project
   cd {original_prompt.replace(' ', '_').lower()}_project  
   python -m venv venv && source venv/bin/activate
   git init && echo "venv/" > .gitignore
✅ Expected: Clean project structure with version control ready

--- STEP 2: Dependency Management ---
🎯 Purpose: Install and configure all required packages and dependencies
⚡ Action: Create requirements.txt, install packages, configure package management
💻 Commands:
   pip install fastapi uvicorn sqlalchemy psycopg2-binary redis pytest
   pip freeze > requirements.txt
✅ Expected: All dependencies installed and documented

--- STEP 3: Database Schema Design ---
🎯 Purpose: Create comprehensive data model with relationships
⚡ Action: Design entities, relationships, and constraints for the application
💻 Code Example:
   from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
   from sqlalchemy.ext.declarative import declarative_base
   
   Base = declarative_base()
   
   class User(Base):
       __tablename__ = 'users'
       id = Column(Integer, primary_key=True)
       username = Column(String(50), unique=True, nullable=False)
       email = Column(String(100), unique=True, nullable=False)
       created_at = Column(DateTime, default=datetime.utcnow)
✅ Expected: Complete data model with proper relationships

--- STEP 4: Database Connection Setup ---
🎯 Purpose: Configure database connectivity with connection pooling
⚡ Action: Set up database engine, session management, and migration tools
💻 Code Example:
   from sqlalchemy import create_engine
   from sqlalchemy.orm import sessionmaker
   
   DATABASE_URL = "postgresql://user:password@localhost/dbname"
   engine = create_engine(DATABASE_URL, pool_size=20, max_overflow=0)
   SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
✅ Expected: Robust database connectivity with proper configuration

--- STEP 5: Core Business Logic Implementation ---
🎯 Purpose: Implement the main application logic and business rules
⚡ Action: Create service classes that handle core functionality
💻 Code Example:
   class CoreService:
       def __init__(self, db_session):
           self.db = db_session
           
       def process_main_functionality(self, data):
           # Implement core business logic here
           validated_data = self.validate_input(data)
           result = self.execute_business_rules(validated_data)
           return self.format_response(result)
✅ Expected: Complete business logic with proper separation of concerns

[Continue with STEPS 6-25 covering: API endpoints, authentication, validation, testing, deployment, monitoring, etc.]

🧪 COMPREHENSIVE TESTING STRATEGY
===============================
UNIT_TESTS: Test individual functions and classes in isolation
INTEGRATION_TESTS: Test complete workflows and API endpoints
PERFORMANCE_TESTS: Benchmark response times and throughput
SECURITY_TESTS: Validate authentication and input sanitization
LOAD_TESTS: Verify system behavior under high traffic

Test Implementation:
import pytest
from fastapi.testclient import TestClient

def test_main_functionality():
    client = TestClient(app)
    response = client.post("/api/test", json={{"data": "test"}})
    assert response.status_code == 200
    assert response.json()["status"] == "success"

🚀 DEPLOYMENT & PRODUCTION
=========================
CONTAINERIZATION: Docker images with optimized layers
ORCHESTRATION: Kubernetes deployment with auto-scaling
MONITORING: Prometheus metrics with Grafana dashboards  
LOGGING: Structured logging with ELK stack integration
SECURITY: SSL/TLS termination with security headers

Production Deployment:
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

⚡ OPTIMIZATION & BEST PRACTICES
==============================
DATABASE: Use connection pooling, query optimization, proper indexing
API: Implement caching, pagination, rate limiting
SECURITY: Input validation, parameterized queries, HTTPS only
PERFORMANCE: Async operations, background tasks, CDN integration
CODE_QUALITY: Type hints, documentation, automated testing

🛠️ TROUBLESHOOTING GUIDE
=======================
COMMON_ISSUES:
- Database connection timeouts → Check connection pool settings
- High memory usage → Implement proper session cleanup
- Slow API responses → Add caching and query optimization
- Authentication failures → Verify JWT configuration

MONITORING_ALERTS:
- Response time > 500ms
- Error rate > 1%
- Memory usage > 80%
- Database connections > 90%

📚 ADDITIONAL RESOURCES
=====================
DOCUMENTATION: FastAPI docs, SQLAlchemy tutorials
BEST_PRACTICES: Clean Code, Design Patterns
SECURITY: OWASP guidelines, security checklists
DEPLOYMENT: Docker best practices, Kubernetes guides
MONITORING: Observability patterns, SRE handbook

{"=" * 80}
🎉 COMPLETE IMPLEMENTATION GUIDE - READY FOR DEVELOPMENT
{"=" * 80}

This comprehensive guide provides everything needed to build a production-ready application.
Each step includes detailed instructions, code examples, and verification criteria.
Follow the steps sequentially for best results and refer to troubleshooting for common issues."""
    
    def _fallback_optimize(self, prompt: str, mode: str, options: dict) -> str:
        """
        Fallback optimization using comprehensive rule-based approach
        """
        if mode == "ai-dev":
            optimized = f"""📋 PROJECT OVERVIEW
Build a comprehensive solution for: {prompt}

🎯 REQUIREMENTS & OBJECTIVES
• Core Functionality: Implement the requested feature
• Code Quality: Production-ready, well-structured code
• Documentation: Complete with examples
• Testing: Comprehensive unit and integration tests
• Performance: Optimized for speed and efficiency
• Scalability: Design for future growth

🏗️ TECHNICAL ARCHITECTURE
• Define clear module/component structure
• Plan database schema and data models
• Design API endpoints and data contracts
• Plan error handling and logging

📝 IMPLEMENTATION GUIDE (Step-by-Step)
1. Set up project structure and dependencies
2. Create core data models and database schema
3. Implement business logic and algorithms
4. Build API endpoints or main functions
5. Implement error handling and validation
6. Add comprehensive logging
7. Write unit tests for each component
8. Write integration tests for workflows
9. Document all public APIs and functions
10. Create usage examples"""
            
            if options.get('include_tests'):
                optimized += """
11. Set up CI/CD pipeline for automated testing
12. Implement code coverage tracking
13. Create test documentation"""
            
            if options.get('add_documentation'):
                optimized += """
14. Write comprehensive README
15. Create API documentation
16. Document configuration options
17. Provide troubleshooting guide"""
            
            if options.get('performance_optimization'):
                optimized += """
18. Profile code for bottlenecks
19. Optimize critical paths
20. Implement caching strategies
21. Use async/await where applicable"""
            
            if options.get('security_features'):
                optimized += """
22. Implement input validation
23. Add authentication/authorization
24. Sanitize all inputs
25. Use parameterized queries
26. Implement rate limiting"""
            
            optimized += """
🧪 TESTING STRATEGY
• Unit tests for all functions
• Integration tests for workflows
• Edge case testing
• Performance testing
• Security testing (if applicable)

🚀 DEPLOYMENT INSTRUCTIONS
1. Prepare production environment
2. Configure environment variables
3. Run database migrations
4. Deploy application
5. Run smoke tests
6. Monitor initial performance

📊 MONITORING & MAINTENANCE
• Set up error logging
• Monitor performance metrics
• Track usage analytics
• Plan regular maintenance
• Document known issues

💡 BEST PRACTICES & TIPS
• Follow SOLID principles
• Use dependency injection
• Write descriptive variable names
• Keep functions small and focused
• Use proper exception handling
• Document edge cases

⚠️ COMMON CHALLENGES
• Handle concurrent requests
• Manage database connections properly
• Validate all inputs thoroughly
• Plan for failure scenarios
• Test across different environments"""
        
        elif mode == "image-gen":
            optimized = f"""📋 PROJECT OVERVIEW
Create a detailed visual design for: {prompt}

🎯 REQUIREMENTS & OBJECTIVES
• Visual Impact: Eye-catching and professional
• Composition: Well-balanced and harmonious
• Color Palette: Appropriate and appealing
• Artistic Quality: High professional standards

🏗️ TECHNICAL SPECIFICATIONS
• Dimensions: Specify width x height
• Resolution: High-resolution output (minimum 300 DPI)
• Format: Specify output format
• Color Space: RGB or CMYK

📝 VISUAL ELEMENTS
• Main Subject: Define focal points
• Background: Describe environment
• Lighting: Specify lighting conditions and mood
• Color Scheme: Detailed color palette
• Style: Artistic style and references
• Texture & Materials: Surface qualities
• Composition: Layout and arrangement
• Perspective: Camera angle and depth

🧪 QUALITY STANDARDS
• Professional finish
• Attention to detail
• Color accuracy
• Proper proportions
• Clear focal point

🚀 DELIVERABLES
• Final rendered image
• PSD/editable file (if applicable)
• Multiple format exports
• High-resolution version"""
        
        elif mode == "chatbot":
            optimized = f"""📋 PROJECT OVERVIEW
Develop an intelligent chatbot for: {prompt}

🎯 REQUIREMENTS & OBJECTIVES
• User-Friendly: Easy to interact with
• Intelligent: Context-aware responses
• Consistent: Maintains personality
• Reliable: Accurate information

🏗️ CONVERSATIONAL ARCHITECTURE
• Define user intents and interactions
• Plan conversation flows
• Create response templates
• Define escalation paths

📝 IMPLEMENTATION GUIDE
1. Define bot personality and tone
2. Create intent and entity definitions
3. Develop response patterns
4. Implement context management
5. Add follow-up question logic
6. Create error recovery flows
7. Implement learning mechanisms
8. Test conversation paths

🧪 TESTING STRATEGY
• Test common user queries
• Test edge cases and misunderstandings
• Verify consistent personality
• Test context transitions

🚀 DEPLOYMENT
• Deploy to messaging platform
• Set up monitoring
• Plan feedback collection
• Continuous improvement plan"""
        
        else:  # data-analysis
            optimized = f"""📋 PROJECT OVERVIEW
Conduct comprehensive data analysis for: {prompt}

🎯 RESEARCH OBJECTIVES
• Primary Questions: Define what to analyze
• Hypotheses: Potential outcomes
• Success Criteria: How to measure success

🏗️ DATA STRATEGY
• Data Sources: Where to get data
• Data Types: What data to collect
• Data Volume: Scale and coverage
• Data Quality: Validation requirements

📝 IMPLEMENTATION GUIDE
1. Define research questions
2. Identify and prepare data sources
3. Clean and preprocess data
4. Perform exploratory data analysis
5. Apply statistical methods
6. Create visualizations
7. Interpret findings
8. Document conclusions

🧪 ANALYSIS TECHNIQUES
• Descriptive statistics
• Hypothesis testing
• Correlation and regression analysis
• Data visualization
• Anomaly detection

🚀 DELIVERABLES
• Detailed analysis report
• Visualizations and charts
• Statistical summaries
• Actionable recommendations
• Source data and methodology"""
        
        return optimized

    def generate_image(self, description: str, image_mode: str = "photo") -> dict:
        """
        Prepare or call image generation based on selected image_mode.
        Returns a dict with model used and the image prompt or metadata.
        """
        selected_image_model = self.image_model_map.get(image_mode, self.image_model_map.get("photo"))
        # For now, we craft a clear image prompt tailored to the description and mode.
        prompt = f"Create a {image_mode} style image: {description}. Produce a concise prompt suitable for an image generation model, include desired colors, composition, and mood."

        # In a full implementation we'd call the image generation API here.
        result = {
            "model_used": selected_image_model,
            "image_prompt": prompt,
            "note": "Image generation not executed locally; image_prompt prepared for model."
        }

        return result
    
    def _format_output(self, text: str) -> str:
        """
        Post-process Gemini output to add visual separators and improve readability.
        Adds dividers and enhanced spacing between major sections.
        """
        import re
        
        result = text
        
        # Replace bold section headers with enhanced versions that include separators
        # Pattern: **emoji TEXT**
        result = re.sub(
            r'\*\*([🎯📋🏗️📝💻🧪🚀📊⚠️💡🛠️])\s*([^*]+)\*\*',
            lambda m: f'\n{"="*80}\n{m.group(1)} {m.group(2).strip()}\n{"="*80}\n',
            result
        )
        
        # Add visual separators for "Functional Requirements" type subheadings
        result = re.sub(
            r'\*\*([A-Za-z-]{5,30} Requirements?:?)\*\*',
            lambda m: f'\n\n--- {m.group(1)} ---\n',
            result
        )
        
        # Add better spacing before numbered lists (implementation steps)
        result = re.sub(r'\n(\d+\.)', r'\n\n\1', result)
        
        # Add footer
        if '='*80 in result:  # Only add if we have separators
            result = result.rstrip() + f'\n\n{"="*80}\n✨ END OF GUIDE\n{"="*80}\n'
        
        return result
    
    def generate_quality_scores(self, prompt: str) -> dict:
        """
        Generate comprehensive quality scores for a prompt
        Analyzes multiple dimensions of prompt quality
        """
        # Calculate text metrics
        words = len(prompt.split())
        sentences = len([s for s in prompt.split('.') if s.strip()])
        paragraphs = len([p for p in prompt.split('\n\n') if p.strip()])
        characters = len(prompt)
        
        # Count linguistic elements
        action_verbs = len(re.findall(
            r'\b(create|build|implement|design|develop|optimize|analyze|generate|process|handle|manage|define|structure|architect|deploy|monitor|test|validate|verify|ensure|provide|deliver|produce|make|establish)\b', 
            prompt, re.I))
        
        specific_terms = len(re.findall(
            r'\b(specific|detailed|comprehensive|professional|optimized|efficient|scalable|robust|secure|reliable|production-ready|enterprise-grade|high-performance)\b', 
            prompt, re.I))
        
        technical_terms = len(re.findall(
            r'\b(api|database|function|error|security|performance|architecture|schema|algorithm|framework|library|module|component|interface|protocol|encryption|authentication|cache|query|transaction)\b', 
            prompt, re.I))
        
        # Count requirements indicators
        must_haves = len(re.findall(r'\b(must|should|require|mandatory|essential|critical)\b', prompt, re.I))
        nice_to_haves = len(re.findall(r'\b(could|might|consider|optionally|may|nice-to-have|future)\b', prompt, re.I))
        constraints = len(re.findall(r'\b(limit|constraint|restrict|avoid|prevent|maximum|minimum|threshold)\b', prompt, re.I))
        
        # Calculate dimension scores (0-10)
        # Clarity: based on action verbs, sentence structure, and length
        clarity = min(10, (action_verbs * 1.5) + (3 if sentences > 0 else 0) + min(2, words / 50))
        
        # Specificity: based on specific terms, technical details, and constraints
        specificity = min(10, (specific_terms * 1.2) + (technical_terms * 0.8) + (constraints * 0.5))
        
        # Completeness: based on requirements indicators and structure
        completeness = min(10, (must_haves * 0.8) + (nice_to_haves * 0.4) + (paragraphs * 0.5) + min(3, words / 100))
        
        # Technical Depth: based on technical terminology and complexity indicators
        technical = min(10, (technical_terms * 1.5) + (len(re.findall(r'[{}()\[\]]', prompt)) * 0.3))
        
        # Structure & Organization: based on formatting and structure
        structure = min(10, (paragraphs * 0.5) + (len(re.findall(r'^[-•*]\s', prompt, re.M)) * 0.5) + (len(re.findall(r'\d+\.', prompt)) * 0.4))
        
        # Practicality: based on specific, actionable language
        practicality = min(10, (action_verbs * 1.0) + (constraints * 0.6) + (must_haves * 0.5))
        
        # Calculate overall score (weighted average)
        overall = (
            clarity * 0.20 +
            specificity * 0.25 +
            completeness * 0.15 +
            technical * 0.15 +
            structure * 0.10 +
            practicality * 0.15
        )
        
        return {
            "clarity": round(clarity, 2),
            "specificity": round(specificity, 2),
            "completeness": round(completeness, 2),
            "technical": round(technical, 2),
            "structure": round(structure, 2),
            "practicality": round(practicality, 2),
            "overall": round(overall, 2),
            "metadata": {
                "word_count": words,
                "sentence_count": sentences,
                "paragraph_count": paragraphs,
                "action_verbs": action_verbs,
                "specific_terms": specific_terms,
                "technical_terms": technical_terms,
                "requirements_indicators": must_haves + nice_to_haves
            }
        }
    
    
    def generate_assistant_response(self, user_message: str, prompt_context: str = None) -> str:
        """
        Generate an intelligent AI assistant response with detailed guidance
        """
        try:
            if GEMINI_API_KEY:
                context = f"User is working on a {prompt_context} prompt optimization project." if prompt_context else "User is optimizing prompts for AI projects."
                
                detailed_prompt = f"""{context}

USER QUESTION: {user_message}

Provide a DETAILED, HELPFUL response that includes:
1. Direct answer to the question
2. Why this matters for prompt optimization
3. Specific examples or techniques
4. Step-by-step guidance if applicable
5. Common mistakes to avoid
6. Pro tips for better results
7. Related resources or next steps

Keep response practical, actionable, and tailored to {prompt_context if prompt_context else 'general'} projects.
Be encouraging and supportive."""
                
                model = genai.GenerativeModel(self.model)
                response = model.generate_content(detailed_prompt)
                return response.text.strip()
        except Exception as e:
            print(f"Gemini API error: {e}. Using fallback response.")
        
        # Enhanced fallback responses with more detail
        fallback_responses = {
            "ai-dev": [
                """🚀 PROMPT OPTIMIZATION FOR AI DEVELOPMENT

To write better AI development prompts:

1. **Be Specific About Requirements**
   - Instead of: "Create a function"
   - Use: "Create a Python function that validates email addresses using regex, handles edge cases, returns boolean, and includes 3 test cases"

2. **Include Architecture Details**
   - Specify design patterns (MVC, Factory, Observer, etc.)
   - Define data structures needed
   - Explain relationships between components

3. **Add Context and Constraints**
   - Performance requirements (must handle 1000 requests/sec)
   - Security requirements (use encryption, validate inputs)
   - Integration requirements (must work with existing APIs)

4. **Request Code Examples**
   - Ask for working code snippets
   - Request error handling examples
   - Ask for configuration examples

5. **Specify Testing Needs**
   - Unit tests with specific frameworks
   - Edge case coverage
   - Performance benchmarks""",
                
                """💻 TECHNICAL PROMPTING BEST PRACTICES

For better AI-dev prompts:

**DO:**
✓ Specify programming language and version
✓ Mention frameworks and libraries to use
✓ Define input/output formats explicitly
✓ Include error scenarios
✓ Request documentation in the code
✓ Ask for usage examples
✓ Specify code style requirements

**DON'T:**
✗ Use vague terms like "make it good"
✗ Forget to mention constraints
✗ Skip security considerations
✗ Omit testing requirements
✗ Be unclear about performance needs

**EXAMPLE STRUCTURE:**
"Create [WHAT] in [LANGUAGE/FRAMEWORK]
- Must [FUNCTIONAL REQUIREMENT]
- Should [QUALITY REQUIREMENT]
- Must handle [EDGE CASES]
- Use [SPECIFIC TECHNOLOGIES]
- Include [CODE EXAMPLES/TESTS]
- Optimize for [PERFORMANCE/SECURITY]"
""",
                
                """🔧 IMPLEMENTATION-FOCUSED PROMPTING

Elements that make AI-dev prompts powerful:

1. **Clear Scope Definition**
   - What is being built (module/feature/service)
   - What it should do (primary functions)
   - What it shouldn't do (out of scope)

2. **Technical Specifications**
   - API contracts and data models
   - Database schema if applicable
   - Integration points with other systems

3. **Quality Requirements**
   - Code standards (PEP8, ESLint, etc.)
   - Testing coverage (>80%, >95%, etc.)
   - Performance benchmarks
   - Security standards

4. **Operational Requirements**
   - Logging and monitoring
   - Error handling and recovery
   - Configuration management
   - Documentation requirements

5. **Examples & References**
   - Show similar existing code
   - Provide expected input/output
   - Reference similar projects
   - Share relevant documentation links"""
            ],
            "image-gen": [
                """🎨 EFFECTIVE IMAGE GENERATION PROMPTS

Great image prompts include:

1. **Subject & Main Elements**
   - What is the primary focus
   - What objects/people are present
   - Their arrangement and interaction

2. **Visual Style**
   - Artistic style (realistic, abstract, cartoon, oil painting)
   - Mood and atmosphere
   - Color palette guidance
   - Lighting conditions

3. **Composition Details**
   - Camera angle and perspective
   - Depth and layering
   - Focal point and background
   - Proportions and sizing

4. **Quality Specifications**
   - Resolution and dimensions
   - Professional standards
   - Output format preferences
   - Any reference images

5. **Specific Requirements**
   - "Professional product photography style"
   - "Soft, diffused natural lighting"
   - "Vibrant but balanced color scheme"
   - "Shallow depth of field with background blur\"""",
                
                """🖼️ CRAFTING VISUAL PROMPTS

Elements that create better images:

**EFFECTIVE STRUCTURE:**
"[MAIN SUBJECT] in [SETTING] with [LIGHTING]
Style: [ARTISTIC STYLE]
Mood: [EMOTIONAL TONE]
Colors: [COLOR PALETTE]
Composition: [LAYOUT/PERSPECTIVE]
Quality: [PROFESSIONAL STANDARDS]"

**EXAMPLE:**
"Professional portrait photography of a business professional in a modern office
Style: Realistic photography, contemporary
Lighting: Professional studio lighting with rim light
Mood: Confident, approachable, modern
Colors: Cool corporate blues with warm accent lighting
Composition: Center-framed, shallow depth of field, blurred background
Quality: High-resolution, magazine-quality, well-composed"""
            ],
            "chatbot": [
                """💬 CONVERSATIONAL AI PROMPT ENGINEERING

Build better chatbot prompts:

1. **Define Bot Personality**
   - Tone: professional, friendly, casual, formal
   - Expertise level: expert, knowledgeable, helpful
   - Emotional style: empathetic, witty, straightforward

2. **Specify Response Style**
   - Length preferences: concise, detailed
   - Format: conversational, structured, code
   - Use of emojis and formatting

3. **Context Management**
   - Remember previous conversations
   - Handle topic switches
   - Provide context-relevant suggestions
   - Know when to ask clarifying questions

4. **Intent Handling**
   - List common user intents
   - Specify response for each
   - Include escalation paths
   - Define boundaries

5. **Safety & Guidelines**
   - What NOT to discuss
   - Sensitive topic handling
   - Factual accuracy requirements
   - Privacy considerations""",
                
                """🤖 CONVERSATIONAL PROMPT STRUCTURE

Create effective chatbot prompts:

**SETUP PHASE:**
"You are a helpful AI assistant named [NAME]
- Your expertise: [DOMAIN]
- Your personality: [TONE/STYLE]
- Your communication style: [APPROACH]"

**INTERACTION RULES:**
"When users ask [TYPE OF QUESTION]:
- Respond with [RESPONSE PATTERN]
- Always include [SPECIFIC ELEMENTS]
- Avoid [SPECIFIC TOPICS]
- If unclear, [ASK CLARIFYING QUESTIONS]"

**SAFETY BOUNDARIES:**
"You should not: [LIST OF RESTRICTIONS]
If asked about [SENSITIVE TOPICS]: [RESPONSE]
For complex topics: [ESCALATION PROCESS]"

**EXAMPLES:**
"Example user question: [QUESTION]
Good response: [EXAMPLE RESPONSE]"""
            ],
            "data-analysis": [
                """📊 DATA ANALYSIS PROMPT OPTIMIZATION

Effective data analysis prompts:

1. **Clear Research Questions**
   - What specific insights are needed
   - What decisions will data inform
   - What success looks like

2. **Data Specifications**
   - Source of data
   - Data format and structure
   - Relevant time periods
   - Data quality expectations

3. **Analysis Methods**
   - Specific statistical techniques
   - Visualization types
   - Comparison and benchmarking
   - Pattern detection approaches

4. **Output Requirements**
   - Format of results
   - Visualization preferences
   - Summary statistics needed
   - Interpretation guidelines

5. **Context & Constraints**
   - Business context
   - Stakeholder needs
   - Limitations to consider
   - Assumptions to validate""",
                
                """📈 STRUCTURING ANALYSIS PROMPTS

Better data analysis prompt formula:

**RESEARCH OBJECTIVE:**
"Analyze [DATA] to understand [RESEARCH QUESTION]"

**DATA DESCRIPTION:**
"Data includes:
- [VARIABLES] from [SOURCE]
- Time period: [DATES]
- Sample size: [N]
- Key fields: [LIST]"

**ANALYSIS REQUIREMENTS:**
"Provide:
- Descriptive statistics for [VARIABLES]
- [SPECIFIC ANALYSIS TYPE] analysis
- Visualizations: [CHART TYPES]
- Patterns and insights: [WHAT TO LOOK FOR]"

**BUSINESS CONTEXT:**
"This analysis will help:
- [STAKEHOLDER] understand [QUESTION]
- Inform decision about [DECISION]
- Benchmark against [COMPARISON]"

**OUTPUT FORMAT:**
"Deliver:
- Summary of findings
- [SPECIFIC TABLES/CHARTS]
- Statistical significance
- Actionable recommendations\""""
            ]
        }
        
        # Choose response based on context
        context_responses = fallback_responses.get(prompt_context, [])
        if context_responses:
            import random
            return random.choice(context_responses)
        
        # Generic fallback responses
        generic_responses = [
            "Great question! 🌟 To improve your prompts:\n\n1. Be specific about what you want\n2. Include all relevant constraints\n3. Provide context and background\n4. Ask for examples in the response\n5. Specify the output format you need\n\nWould you like me to help optimize a specific prompt?",
            
            "That's an excellent point! 💡 Here are key principles:\n\n• Clarity: Use specific, unambiguous language\n• Completeness: Include all necessary details\n• Context: Explain the broader goal\n• Constraints: Mention limitations and requirements\n• Examples: Provide input/output samples when possible\n\nThe better your prompt, the better the response you'll get!",
            
            "Great thinking! 🎯 Try this framework:\n\n1. Define WHAT you want (clear, specific)\n2. Define WHY (context and goals)\n3. Define HOW (approach and methods)\n4. Define SUCCESS (quality criteria)\n5. Define CONSTRAINTS (limitations, requirements)\n\nThis comprehensive approach usually yields the best results!",
            
            "Excellent question! 🚀 Remember these core principles:\n\n✓ Use active, action-oriented language\n✓ Be specific rather than general\n✓ Include examples or references\n✓ Mention any constraints upfront\n✓ Specify the desired output format\n✓ Provide context when helpful\n\nApply these and watch your prompts improve dramatically!",
        ]
        
        import random
        return random.choice(generic_responses)
    
    def set_mode(self, mode: str) -> dict:
        """
        Set the current working mode and update configuration
        Returns the current mode configuration
        """
        if mode in self.mode_configs:
            self.current_mode = mode
            self.current_mode_config = self.mode_configs[mode]
            
            # Update model selection based on mode
            self.model = self.model_map.get(mode, self.default_model)
            
            logger = logging.getLogger(__name__)
            logger.info(f"Mode switched to: {mode}, using model: {self.model}")
            
            return {
                "success": True,
                "mode": self.current_mode,
                "model": self.model,
                "configuration": self.current_mode_config
            }
        else:
            return {
                "success": False,
                "error": f"Mode '{mode}' not supported",
                "available_modes": list(self.mode_configs.keys())
            }
    
    def get_current_mode(self) -> dict:
        """
        Get current mode and its configuration
        """
        return {
            "mode": self.current_mode,
            "model": self.model,
            "configuration": self.current_mode_config
        }
    
    def get_available_modes(self) -> dict:
        """
        Get all available modes with their descriptions
        """
        modes_info = {}
        for mode, config in self.mode_configs.items():
            modes_info[mode] = {
                "model": self.model_map.get(mode, self.default_model),
                "temperature": config['temperature'],
                "max_tokens": config['max_tokens'],
                "required_fields": config['prompt_structure']['required_fields'],
                "optional_fields": config['prompt_structure']['optional_fields'],
                "output_format": config['prompt_structure']['output_format'],
                "system_prompt_preview": config['system_prompt'][:100] + "..."
            }
        return modes_info
    
    def optimize_prompt_for_mode(self, original_prompt: str, mode: str = None, options: dict = None) -> str:
        """
        Optimize prompt specifically for the selected mode with enhanced formatting and Gemini model selection
        """
        if mode and mode != self.current_mode:
            # Temporarily switch mode for this optimization
            previous_mode = self.current_mode
            mode_switch_result = self.set_mode(mode)
            if not mode_switch_result["success"]:
                return f"Error: {mode_switch_result['error']}"
        else:
            mode = self.current_mode
        
        # Ensure mode is valid
        if mode not in self.mode_configs:
            return f"Error: Unsupported mode '{mode}'. Available modes: {list(self.mode_configs.keys())}"
            
        # Get mode-specific configuration
        mode_config = self.mode_configs[mode]
        
        if options is None:
            options = {}
        
        try:
            if GEMINI_API_KEY:
                # Create mode-specific optimization prompt
                mode_config = self.current_mode_config
                system_prompt = mode_config['system_prompt']
                
                # Build structured prompt based on mode requirements
                structured_prompt = self._build_structured_prompt(original_prompt, mode_config, options)
                
                # Generate optimization with mode-specific settings
                model = genai.GenerativeModel(self.model)
                
                # Configure generation with mode-specific parameters
                generation_config = genai.types.GenerationConfig(
                    temperature=mode_config['temperature'],
                    max_output_tokens=mode_config['max_tokens'],
                    candidate_count=1
                )
                
                full_prompt = f"{system_prompt}\n\n{structured_prompt}\n\nIMPORTANT: Provide the response in the exact format specified for {mode} mode with proper structure and formatting."
                
                response = model.generate_content(
                    full_prompt,
                    generation_config=generation_config
                )
                
                optimized_text = response.text.strip()
                
                # Post-process with mode-specific formatting
                optimized_text = self._format_output_for_mode(optimized_text, mode)
                
                return optimized_text
                
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.exception(f"Gemini API error in mode '{mode}': {e}")
        
        # Fallback to mode-specific rule-based optimization
        return self._fallback_optimize_for_mode(original_prompt, mode, options)
    
    def _build_structured_prompt(self, original_prompt: str, mode_config: dict, options: dict) -> str:
        """
        Build a structured prompt based on mode-specific requirements
        """
        prompt_structure = mode_config['prompt_structure']
        required_fields = prompt_structure['required_fields']
        optional_fields = prompt_structure['optional_fields']
        output_format = prompt_structure['output_format']
        
        structured_prompt = f"""
ORIGINAL REQUEST: {original_prompt}

MODE: {self.current_mode.upper()}
OUTPUT FORMAT: {output_format}

REQUIRED ELEMENTS TO INCLUDE:
{chr(10).join([f"• {field}" for field in required_fields])}

OPTIONAL ENHANCEMENTS:
{chr(10).join([f"• {field}" for field in optional_fields])}

USER OPTIONS:
• Include Tests: {options.get('include_tests', False)}
• Add Documentation: {options.get('add_documentation', False)}
• Performance Optimization: {options.get('performance_optimization', False)}
• Security Features: {options.get('security_features', False)}

Please provide a comprehensive response that addresses the original request while incorporating all required elements and relevant optional enhancements based on the user options selected.
"""
        return structured_prompt
    
    def _build_structured_prompt(self, original_prompt: str, mode_config: dict, options: dict) -> str:
        """
        Build a structured prompt based on mode-specific requirements
        """
        prompt_structure = mode_config['prompt_structure']
        required_fields = prompt_structure['required_fields']
        optional_fields = prompt_structure['optional_fields']
        output_format = prompt_structure['output_format']
        
        structured_prompt = f"""
ORIGINAL REQUEST: {original_prompt}

MODE: {self.current_mode.upper()} - SPECIALIZED OPTIMIZATION
OUTPUT FORMAT: {output_format}

REQUIRED ELEMENTS TO INCLUDE:
{self._format_field_list(required_fields)}

OPTIONAL ENHANCEMENTS:
{self._format_field_list(optional_fields)}

USER-SELECTED OPTIONS:
{self._format_options(options)}

OPTIMIZATION INSTRUCTIONS:
Transform the original request into a comprehensive, production-ready prompt that:
1. Incorporates ALL required elements for {self.current_mode} mode
2. Follows the {output_format} structure exactly
3. Integrates the selected enhancement options
4. Provides clear, actionable, and specific instructions
5. Ensures optimal results for {self.current_mode} tasks
6. Uses industry best practices and professional standards
7. Includes all necessary context and constraints

Generate the fully optimized prompt now:
"""
        return structured_prompt
    
    def _format_field_list(self, fields: list) -> str:
        """Format a list of fields as bullet points"""
        return '\n'.join([f"• {field.replace('_', ' ').title()}" for field in fields])
    
    def _format_options(self, options: dict) -> str:
        """Format selected options"""
        if not options:
            return "• No additional options selected"
        
        formatted_options = []
        for key, value in options.items():
            if value:
                formatted_options.append(f"• {key.replace('_', ' ').title()}: {value}")
        
        return '\n'.join(formatted_options) if formatted_options else "• No additional options selected"
    
    def _format_output_for_mode(self, text: str, mode: str) -> str:
        """
        Apply mode-specific formatting to the output
        """
        import re
        
        if mode == 'ai-dev':
            # Add code block formatting and technical structure
            text = re.sub(r'(```\w*\n.*?\n```)', r'\n\1\n', text, flags=re.DOTALL)
            
        elif mode == 'content-writing':
            # Add content structure markers
            text = re.sub(r'^(#{1,3}\s+.*)', r'\n\1\n', text, flags=re.MULTILINE)
            
        elif mode == 'image-generation':
            # Format visual description elements
            text = re.sub(r'(Style:|Lighting:|Colors:|Composition:|Mood:)', r'\n**\1**', text)
            
        elif mode == 'business-analysis':
            # Add business report structure
            text = re.sub(r'(Executive Summary|Key Findings|Recommendations)', r'\n## \1\n', text)
            
        elif mode == 'chatbot-training':
            # Format conversation patterns
            text = re.sub(r'(User:|Bot:|Example:)', r'\n**\1**', text)
            
        elif mode == 'research-academic':
            # Add academic formatting
            text = re.sub(r'(Abstract|Introduction|Methodology|Results|Conclusion)', r'\n### \1\n', text)
        
        # Add mode indicator at the top
        formatted_text = f"""
🎯 **MODE: {mode.upper()}**
{"="*50}

{text}

{"="*50}
✨ *Optimized for {mode.replace('-', ' ').title()} using {self.model}*
"""
        
        return formatted_text
    
    def _fallback_optimize_for_mode(self, prompt: str, mode: str, options: dict) -> str:
        """
        Enhanced fallback optimization with mode-specific improvements
        """
        mode_config = self.mode_configs.get(mode, self.mode_configs['ai-dev'])
        
        base_optimization = f"""
🎯 **{mode.upper()} OPTIMIZATION**
{"="*50}

**ORIGINAL PROMPT:** {prompt}

**MODE-SPECIFIC ENHANCEMENTS:**
{mode_config['system_prompt']}

**OPTIMIZED PROMPT:**
"""
        
        # Add mode-specific optimizations
        if mode == 'ai-dev':
            base_optimization += f"""
Create a comprehensive software solution for: {prompt}

**TECHNICAL REQUIREMENTS:**
• Programming language and framework specification
• Architecture and design patterns
• Error handling and edge cases
• Performance optimization strategies
• Security considerations and validation
• Testing approach and examples
• Documentation and code comments
• Deployment and monitoring guidelines

**DELIVERABLES:**
• Complete, production-ready code
• Comprehensive documentation
• Unit and integration tests
• Usage examples and tutorials
• Configuration and setup instructions
"""
        
        elif mode == 'content-writing':
            base_optimization += f"""
Develop compelling content for: {prompt}

**CONTENT STRATEGY:**
• Target audience analysis and personas
• Tone and voice guidelines
• Key messaging and value propositions
• Content structure and flow
• SEO optimization and keywords
• Call-to-action placement
• Visual and formatting elements
• Distribution and promotion strategy

**DELIVERABLES:**
• Engaging, well-structured content
• Optimized headlines and subheadings
• Meta descriptions and tags
• Social media adaptations
• Performance tracking recommendations
"""
        
        elif mode == 'image-generation':
            base_optimization += f"""
Create detailed visual specifications for: {prompt}

**VISUAL ELEMENTS:**
• Subject composition and focal points
• Artistic style and medium references
• Lighting conditions and atmosphere
• Color palette and mood specifications
• Texture and material details
• Perspective and camera angles
• Background and environment
• Technical quality parameters

**OUTPUT SPECIFICATIONS:**
• High-resolution requirements
• Format and dimension specifications
• Style consistency guidelines
• Quality benchmarks and standards
"""
        
        elif mode == 'business-analysis':
            base_optimization += f"""
Conduct comprehensive business analysis for: {prompt}

**ANALYSIS FRAMEWORK:**
• Research objectives and hypotheses
• Data sources and collection methods
• Statistical analysis and methodology
• Key performance indicators (KPIs)
• Trend analysis and forecasting
• Risk assessment and mitigation
• Competitive landscape analysis
• Stakeholder impact assessment

**DELIVERABLES:**
• Executive summary with key insights
• Detailed analysis with visualizations
• Actionable recommendations
• Implementation roadmap
• Risk and opportunity matrix
"""
        
        elif mode == 'chatbot-training':
            base_optimization += f"""
Design intelligent chatbot system for: {prompt}

**CONVERSATION DESIGN:**
• Bot personality and character definition
• Intent recognition and entity extraction
• Dialog flow and conversation patterns
• Context management and memory
• Fallback and error handling scenarios
• Multi-turn conversation support
• Escalation and human handoff triggers
• Personalization and adaptation mechanisms

**IMPLEMENTATION DETAILS:**
• Training data and examples
• Response templates and variations
• Integration requirements and APIs
• Testing and validation procedures
• Performance monitoring and analytics
"""
        
        elif mode == 'research-academic':
            base_optimization += f"""
Develop rigorous academic research for: {prompt}

**RESEARCH METHODOLOGY:**
• Clear research questions and objectives
• Literature review and theoretical framework
• Methodology and data collection approach
• Analysis methods and statistical techniques
• Validity and reliability considerations
• Ethical considerations and limitations
• Expected contributions and implications
• Future research directions

**ACADEMIC DELIVERABLES:**
• Structured research paper format
• Comprehensive literature review
• Methodology and results sections
• Discussion and conclusion analysis
• Proper citations and bibliography
• Abstract and keyword optimization
"""
        
        # Add selected options
        if options:
            base_optimization += "\n\n**ADDITIONAL ENHANCEMENTS:**\n"
            for key, value in options.items():
                if value:
                    enhancement_name = key.replace('_', ' ').title()
                    base_optimization += f"• {enhancement_name}: Integrated into the solution\n"
        
        base_optimization += f"""

{"="*50}
✨ *Fallback optimization for {mode.replace('-', ' ').title()} mode*
"""
        
        return base_optimization
