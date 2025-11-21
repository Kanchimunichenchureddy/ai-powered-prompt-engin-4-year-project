import google.generativeai as genai
from config import GEMINI_API_KEY, RAPTOR_MINI_ENABLED, RAPTOR_MODEL_NAME
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
        # If RAPTOR mini preview is enabled, override text model choices so
        # that all clients use the Raptor mini preview model by default.
        if RAPTOR_MINI_ENABLED:
            try:
                # Use provided RAPTOR model name (allows exact preview string)
                self.default_model = RAPTOR_MODEL_NAME
                for k in list(self.model_map.keys()):
                    # keep image-generation separate (image models handled below)
                    if k != 'image-generation':
                        self.model_map[k] = RAPTOR_MODEL_NAME
            except Exception:
                # if anything goes wrong, keep the original gemini mappings
                pass
        
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
                "Define clear persona with specific personality traits and expertise",
                "Specify domain knowledge and operational boundaries",
                "Set consistent tone and communication style throughout",
                "Design structured conversation flows with branching logic",
                "Implement memory rules for context and user preferences",
                "Include comprehensive restrictions and safety guidelines",
                "Create detailed system prompt for AI implementation",
                "Handle escalation protocols and handoff procedures",
                "Support multi-turn conversations with context awareness",
                "Include error handling and graceful failure management"
            ]
        elif mode == "data-analysis":
            constraints = [
                "Provide comprehensive dataset description with data types and characteristics",
                "Create detailed columns summary with analysis methods and preprocessing needs",
                "Define clear analysis objectives with key questions and success metrics",
                "State explicit assumptions about data quality, statistical methods, and business context",
                "Specify structured analysis tasks covering exploration, feature engineering, and modeling",
                "Detail systematic modeling steps from data preparation to validation",
                "Define comprehensive output formats including charts, tables, and actionable insights",
                "Include statistical rigor with hypothesis testing and confidence intervals",
                "Provide business context and practical implementation guidance",
                "Document methodology, limitations, and reproducibility requirements"
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
        
        # If this is AI Development mode, use structured 9-point optimization
        if mode == "ai-dev":
            return self._optimize_dev_mode(original_prompt, options)
        
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
    
    def _auto_detect_mode(self, prompt: str) -> str:
        """Auto-detect the appropriate mode based on prompt content"""
        prompt_lower = prompt.lower()
        
        # Image generation keywords
        image_keywords = ['image', 'picture', 'photo', 'visual', 'design', 'artwork', 'illustration', 
                         'drawing', 'render', 'graphic', 'logo', 'icon', 'banner', 'poster']
        
        # Development keywords
        dev_keywords = ['code', 'function', 'class', 'method', 'api', 'database', 'algorithm',
                       'programming', 'develop', 'implement', 'build', 'create app', 'software']
        
        # Count keyword matches
        image_score = sum(1 for keyword in image_keywords if keyword in prompt_lower)
        dev_score = sum(1 for keyword in dev_keywords if keyword in prompt_lower)
        
        # Return mode with highest score, defaulting to ai-dev
        if image_score > dev_score and image_score > 0:
            return 'image-generation'
        elif dev_score > 0:
            return 'ai-dev'
        else:
            return 'ai-dev'
    
    def _optimize_image_mode(self, prompt: str, options: dict) -> str:
        """
        Specialized optimization for image generation mode using structured 10-point format
        Outputs optimized prompts in the required image generation structure
        """
        try:
            if GEMINI_API_KEY:
                image_template = f"""IMAGE GENERATION SPECIALIST

ORIGINAL REQUEST: {prompt}

GENERATE AN OPTIMIZED IMAGE GENERATION PROMPT using this EXACT 10-POINT STRUCTURE:

**IMPORTANT**: Your output should be a complete, optimized prompt that follows this format precisely. No persona, no task, no abstract - only image-specific format.

---

**OPTIMIZED PROMPT OUTPUT:**

**1. Image Title**
[Generate a clear, descriptive title that captures the essence of the image]

**2. Scene Description**
[Provide a detailed description of the overall scene, setting, and context]

**3. Subject Details**
[Specify the main subjects, their appearance, poses, expressions, and characteristics]

**4. Environment & Lighting**
[Detail the environment, atmosphere, lighting conditions, time of day, weather]

**5. Art Style**
[Define the artistic style, medium, technique, and visual approach]

**6. Camera Settings (FOV, angle)**
[Specify camera perspective, field of view, angle, depth of field, focal length]

**7. Composition & Mood**
[Describe the composition, framing, visual balance, and emotional mood]

**8. Negative Prompts**
[List what should NOT be included in the image]

**9. Aspect Ratio**
[Specify the recommended aspect ratio (e.g., 16:9, 4:3, 1:1, 3:4)]

**10. Final Image Prompt (one-line LLM-ready)**
[Provide a concise, single-line prompt ready for AI image generation models]

---

CRITICAL: Output the complete optimized prompt above following the exact 10-point structure. This will be the actual prompt used for image generation."""

                model = genai.GenerativeModel(self.model_map.get('image-generation', self.default_model))
                response = model.generate_content(image_template)
                return self._format_structured_image_output(response.text.strip())
                
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.exception("Gemini API error in structured image mode optimization")
        
        # Fallback to structured image generation format
        return self._structured_image_fallback(prompt, options)
    
    def _format_structured_image_output(self, text: str) -> str:
        """Format the structured image output with enhanced visual formatting"""
        import re
        
        # Enhance section headers with visual separators
        text = re.sub(
            r'\*\*(\d+\. [^*]+)\*\*',
            lambda m: f'\n{"="*80}\n🖼️ {m.group(1)}\n{"="*80}\n',
            text
        )
        
        # Format bullet points with image-specific icons
        bullet_replacements = {
            '• Subject': '🎭 Subject',
            '• Scene': '🏞️ Scene',
            '• Environment': '🌍 Environment',
            '• Lighting': '💡 Lighting',
            '• Style': '🎨 Style',
            '• Camera': '📸 Camera',
            '• Composition': '📐 Composition',
            '• Mood': '😊 Mood',
            '• Aspect': '📏 Aspect',
            '• Color': '🎨 Color',
            '• Texture': '🖼️ Texture',
            '• Angle': '📐 Angle',
            '• Focus': '🔍 Focus',
            '• Detail': '✨ Detail',
            '• Background': '🌅 Background',
            '• Foreground': '👁️ Foreground'
        }
        
        for old, new in bullet_replacements.items():
            text = text.replace(old, new)
        
        # Add header and footer
        header = f"""
{'='*80}
🎨 IMAGE GENERATION MODE - STRUCTURED PROMPT SPECIFICATION
{'='*80}
"""
        
        footer = f"""
{'='*80}
✨ STRUCTURED IMAGE PROMPT COMPLETE
{'='*80}
📸 This optimized prompt follows the 10-point image generation structure
🎯 Ready for use with AI image generation models
⚡ Includes comprehensive visual specifications
{'='*80}
"""
        
        return header + text + footer
    
    def _structured_image_fallback(self, prompt: str, options: dict) -> str:
        """Fallback for structured image generation mode with 10-point format"""
        return f"""
{'='*80}
🎨 IMAGE GENERATION MODE - STRUCTURED PROMPT SPECIFICATION
{'='*80}

🖼️ **1. Image Title**
{'='*80}
{prompt.split('.')[0].strip().title() if '.' in prompt else prompt[:50].strip().title()}

🖼️ **2. Scene Description**
{'='*80}
The image depicts the scene described in: {prompt}
A carefully composed visual narrative that captures the essence of the request with attention to detail and artistic quality.

🖼️ **3. Subject Details**
{'='*80}
🎭 Main subjects: Primary focus elements extracted from the request
🎭 Appearance: Detailed physical characteristics and styling
🎭 Pose/Expression: Natural positioning and emotional expression
🎭 Characteristics: Unique features and distinguishing elements

🖼️ **4. Environment & Lighting**
{'='*80}
🌍 Environment: Contextual setting and background elements
💡 Lighting: Natural or artificial light sources and quality
🌅 Time of day: Appropriate temporal setting
🌤️ Atmosphere: Weather conditions and environmental mood

🖼️ **5. Art Style**
{'='*80}
🎨 Style: Professional digital art with modern aesthetic
🖌️ Medium: High-quality digital rendering
✨ Technique: Photorealistic with artistic enhancement
🎯 Approach: Contemporary visual storytelling

🖼️ **6. Camera Settings (FOV, angle)**
{'='*80}
📸 Field of View: Standard to wide-angle perspective
📐 Camera Angle: Eye-level or slightly elevated
🔍 Depth of Field: Appropriate focus range for subject emphasis
📏 Focal Length: Optimized for subject and scene requirements

🖼️ **7. Composition & Mood**
{'='*80}
📐 Composition: Balanced framing following rule of thirds
🎯 Visual Balance: Harmonious element distribution
😊 Emotional Mood: Tone appropriate to the subject matter
✨ Visual Impact: Engaging and aesthetically pleasing

🖼️ **8. Negative Prompts**
{'='*80}
❌ Avoid: Blurry, low quality, distorted proportions
❌ Exclude: Inappropriate content, watermarks, text overlays
❌ Remove: Cluttered composition, poor lighting

🖼️ **9. Aspect Ratio**
{'='*80}
📏 Recommended: 16:9 (landscape) or 4:3 (standard)
📐 Alternative: 1:1 (square) or 3:4 (portrait) based on composition needs

🖼️ **10. Final Image Prompt (one-line LLM-ready)**
{'='*80}
🚀 Optimized Prompt: {prompt.lower().replace('.', ', ')}, professional digital art, high quality, detailed, well-lit, perfect composition, 8k resolution

{'='*80}
✨ STRUCTURED IMAGE PROMPT COMPLETE
{'='*80}
📸 This optimized prompt follows the 10-point image generation structure
🎯 Ready for use with AI image generation models  
⚡ Includes comprehensive visual specifications
{'='*80}
"""
    def _optimize_dev_mode(self, prompt: str, options: dict) -> str:
        """
        Specialized optimization for development mode using structured 9-point format
        Outputs optimized prompts in the required AI development structure
        """
        try:
            if GEMINI_API_KEY:
                dev_template = f"""EXPERT SOFTWARE ARCHITECT & AI DEVELOPMENT SPECIALIST

ORIGINAL REQUEST: {prompt}

GENERATE AN OPTIMIZED AI DEVELOPMENT PROMPT using this EXACT 9-POINT STRUCTURE:

**IMPORTANT**: Your output should be a complete, optimized prompt that follows this format precisely. Do not just analyze - CREATE the actual prompt that will be used.

---

**OPTIMIZED PROMPT OUTPUT:**

**1. Project Title**
[Generate a clear, professional project title that captures the essence of the request]

**2. High-Level Description**  
[Provide a comprehensive 2-3 paragraph description of what needs to be built, including the problem it solves, target users, and main value proposition]

**3. Architecture Requirements**
[Specify the system architecture needs including:]
• Scalability requirements (expected users, traffic)
• Performance requirements (response times, throughput)
• Security requirements (authentication, data protection)
• Integration requirements (external APIs, services)
• Platform requirements (web, mobile, desktop, cloud)

**4. Tech Stack Recommendation**
[Recommend specific technologies with justification:]
• Frontend: [Framework/library with version]
• Backend: [Language, framework, database]
• Infrastructure: [Cloud platform, containerization]
• Development tools: [IDE, version control, CI/CD]
• Testing frameworks: [Unit, integration, E2E testing tools]

**5. API Structure**
[Define the API architecture:]
• RESTful endpoints with HTTP methods
• Request/response data formats
• Authentication mechanisms
• Rate limiting and security measures
• API versioning strategy
• Documentation standards (OpenAPI/Swagger)

**6. Data Models**
[Specify the data structure:]
• Entity definitions with attributes
• Relationships between entities
• Database schema design
• Data validation rules
• Index strategies for performance
• Data migration considerations

**7. User Roles**
[Define user types and permissions:]
• Role hierarchy and access levels
• Permission matrices
• Authentication requirements per role
• User journey flows
• Admin capabilities and restrictions

**8. Expected Output (code, design, APIs)**
[Clearly specify deliverables:]
• Code structure and organization
• Design specifications (UI/UX wireframes)
• API documentation and examples
• Database setup scripts
• Configuration files
• Deployment instructions

**9. Test Instructions**
[Provide comprehensive testing approach:]
• Unit testing strategy and coverage targets
• Integration testing scenarios
• End-to-end testing workflows
• Performance testing benchmarks
• Security testing requirements
• Manual testing checklists

---

CRITICAL: Output the complete optimized prompt above, not just bullet points or analysis. This will be the actual prompt used for AI development assistance."""

                model = genai.GenerativeModel(self.model_map.get('ai-dev', self.default_model))
                response = model.generate_content(dev_template)
                return self._format_structured_dev_output(response.text.strip())
                
        except Exception as e:
            logger = logging.getLogger(__name__)
            logger.exception("Gemini API error in structured dev mode optimization")
        
        # Fallback to structured development format
        return self._structured_dev_fallback(prompt, options)
    
    def _format_structured_dev_output(self, text: str) -> str:
        """Format the structured development output with enhanced visual formatting"""
        import re
        
        # Enhance section headers with visual separators
        text = re.sub(
            r'\*\*(\d+\. [^*]+)\*\*',
            lambda m: f'\n{"="*80}\n🔹 {m.group(1)}\n{"="*80}\n',
            text
        )
        
        # Format bullet points with development-specific icons
        bullet_replacements = {
            '• Scalability': '📈 Scalability',
            '• Performance': '⚡ Performance', 
            '• Security': '🔒 Security',
            '• Integration': '🔗 Integration',
            '• Platform': '🖥️ Platform',
            '• Frontend': '🎨 Frontend',
            '• Backend': '⚙️ Backend',
            '• Infrastructure': '☁️ Infrastructure',
            '• Development': '🛠️ Development',
            '• Testing': '🧪 Testing',
            '• RESTful': '🌐 RESTful',
            '• Request': '📤 Request',
            '• Authentication': '🔐 Authentication',
            '• Rate limiting': '⏱️ Rate limiting',
            '• API versioning': '📊 API versioning',
            '• Documentation': '📚 Documentation',
            '• Entity': '📋 Entity',
            '• Relationships': '🔗 Relationships',
            '• Database': '💾 Database',
            '• Data validation': '✅ Data validation',
            '• Index': '🗂️ Index',
            '• Data migration': '🔄 Data migration',
            '• Role': '👥 Role',
            '• Permission': '🎫 Permission',
            '• User journey': '🗺️ User journey',
            '• Admin': '👨‍💼 Admin',
            '• Code': '💻 Code',
            '• Design': '🎨 Design',
            '• Configuration': '⚙️ Configuration',
            '• Deployment': '🚀 Deployment',
            '• Unit testing': '🧩 Unit testing',
            '• Integration testing': '🔗 Integration testing',
            '• End-to-end': '🎯 End-to-end',
            '• Performance testing': '📊 Performance testing',
            '• Security testing': '🔍 Security testing',
            '• Manual testing': '📝 Manual testing'
        }
        
        for old, new in bullet_replacements.items():
            text = text.replace(old, new)
        
        # Add header and footer
        header = f"""
{'='*80}
🚀 AI DEVELOPMENT MODE - STRUCTURED PROJECT SPECIFICATION
{'='*80}
"""
        
        footer = f"""
{'='*80}
✨ STRUCTURED DEVELOPMENT PROMPT COMPLETE
{'='*80}
📋 This optimized prompt follows the 9-point AI development structure
🎯 Ready for use with AI development assistants
⚡ Includes comprehensive technical specifications
{'='*80}
"""
        
        return header + text + footer
    
    def _structured_dev_fallback(self, prompt: str, options: dict) -> str:
        """Fallback for structured development mode with 9-point format"""
        return f"""
{'='*80}
🚀 AI DEVELOPMENT MODE - STRUCTURED PROJECT SPECIFICATION
{'='*80}

🔹 **1. Project Title**
{'='*80}
{prompt.split('.')[0].strip().title() if '.' in prompt else prompt[:50].strip().title()} Development Project

🔹 **2. High-Level Description**
{'='*80}
This project involves developing a solution based on the following requirements: {prompt}

The system should be designed with modern software development best practices, focusing on scalability, maintainability, and user experience. The solution will address specific business needs while ensuring robust performance and security standards.

🔹 **3. Architecture Requirements**
{'='*80}
📈 Scalability requirements: Support for concurrent users and future growth
⚡ Performance requirements: Fast response times and efficient resource usage  
🔒 Security requirements: Authentication, authorization, and data protection
🔗 Integration requirements: API compatibility and third-party service integration
🖥️ Platform requirements: Cross-platform compatibility and deployment flexibility

🔹 **4. Tech Stack Recommendation**
{'='*80}
🎨 Frontend: Modern JavaScript framework (React/Vue.js/Angular)
⚙️ Backend: Node.js/Python/Java with RESTful API architecture
💾 Database: PostgreSQL/MongoDB based on data structure needs
☁️ Infrastructure: Cloud platform (AWS/Azure/GCP) with containerization
🛠️ Development tools: Git version control, automated CI/CD pipeline
🧪 Testing frameworks: Jest, Cypress, or equivalent for comprehensive testing

🔹 **5. API Structure**
{'='*80}
🌐 RESTful endpoints with standard HTTP methods (GET, POST, PUT, DELETE)
📤 JSON request/response format with consistent data structures
🔐 JWT-based authentication with role-based access control
⏱️ Rate limiting and throttling for API security and performance
📊 API versioning strategy for backward compatibility
📚 OpenAPI/Swagger documentation for developer reference

🔹 **6. Data Models**
{'='*80}
📋 Entity definitions with clear attribute specifications
🔗 Normalized database relationships with foreign key constraints
💾 Optimized database schema design for performance
✅ Data validation rules and input sanitization
🗂️ Strategic indexing for query performance optimization
🔄 Database migration strategy for schema changes

🔹 **7. User Roles**
{'='*80}
👥 Role hierarchy: Admin, User, Guest with appropriate access levels
🎫 Permission matrix defining what each role can access and modify
🔐 Authentication requirements varying by role and sensitivity
🗺️ User journey mapping for optimal experience design
👨‍💼 Administrative capabilities for system management and monitoring

🔹 **8. Expected Output (code, design, APIs)**
{'='*80}
💻 Clean, well-documented code following industry standards
🎨 UI/UX design specifications with wireframes and prototypes
📚 Comprehensive API documentation with usage examples
💾 Database setup scripts and seed data for development
⚙️ Configuration files for different environments (dev, staging, prod)
🚀 Detailed deployment instructions and infrastructure setup guide

🔹 **9. Test Instructions**
{'='*80}
🧩 Unit testing: 80%+ code coverage with comprehensive test suites
🔗 Integration testing: API endpoint testing and database interaction validation
🎯 End-to-end testing: Complete user workflow automation and validation
📊 Performance testing: Load testing and stress testing benchmarks
🔍 Security testing: Vulnerability assessment and penetration testing
📝 Manual testing: User acceptance testing checklists and procedures

{'='*80}
✨ STRUCTURED DEVELOPMENT PROMPT COMPLETE
{'='*80}
📋 This optimized prompt follows the 9-point AI development structure
🎯 Ready for use with AI development assistants  
⚡ Includes comprehensive technical specifications
{'='*80}
"""
    
    # OLD METHOD REMOVED - Now using _optimize_dev_mode() with 9-point structure
    
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
    
