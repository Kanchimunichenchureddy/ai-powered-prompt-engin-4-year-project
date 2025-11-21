// Templates Page JavaScript - Full Functionality
class TemplatesManager {
    constructor() {
        this.templates = [];
        this.currentFilter = 'all';
        this.searchQuery = '';
        this.init();
    }

    init() {
        this.loadTemplates();
        this.setupEventListeners();
        this.setupAnimations();
        this.setupSearch();
        this.setupFilters();
    }

    loadTemplates() {
        // Load all template data
        this.templates = [
            {
                id: 'ecommerce-platform',
                category: 'ai-dev',
                title: 'E-Commerce Platform (Complete)',
                description: 'Full e-commerce solution with payment, inventory, user management, and admin dashboard.',
                keywords: ['ecommerce', 'shopping', 'payment', 'inventory', 'admin'],
                uses: 5800,
                rating: 4.9,
                readTime: 12,
                timeSaved: '8-10 hours',
                template: `Build a comprehensive e-commerce platform with the following complete specifications:

**Core E-Commerce Features:**
- Product catalog with categories, search, and filtering
- Shopping cart with persistent sessions and guest checkout
- User registration, login, and profile management
- Payment processing with Stripe/PayPal integration
- Order management and tracking system
- Inventory management with stock alerts
- Admin dashboard for complete store management

**Technical Architecture:**
- Frontend: React/Next.js with TypeScript
- Backend: Node.js/Express with JWT authentication
- Database: PostgreSQL with Redis for sessions/cache
- Payment: Stripe API integration
- File Storage: AWS S3 for product images
- Email: SendGrid for order confirmations

**Database Schema Design:**
- Users table (id, email, password_hash, profile_data)
- Products table (id, name, description, price, stock, category_id, images)
- Categories table (id, name, slug, parent_id)
- Orders table (id, user_id, total, status, shipping_address)
- Order_items table (order_id, product_id, quantity, price)
- Shopping_cart table (user_id, product_id, quantity, created_at)

**API Endpoints Required:**
- POST /api/auth/register - User registration
- POST /api/auth/login - User authentication
- GET /api/products - Product listing with pagination
- GET /api/products/:id - Single product details
- POST /api/cart/add - Add item to cart
- POST /api/orders/create - Place new order
- POST /api/payments/process - Process payment
- GET /api/admin/dashboard - Admin analytics

**Security Implementation:**
- JWT tokens for authentication
- Password hashing with bcrypt
- Input validation and sanitization
- Rate limiting for API endpoints
- HTTPS enforcement
- SQL injection prevention

**Performance Optimization:**
- Database indexing for search queries
- Redis caching for frequent data
- Image optimization and CDN
- Code splitting and lazy loading
- Database connection pooling

Please provide complete implementation with step-by-step code examples, deployment instructions, and testing strategies.`
            },
            {
                id: 'react-dashboard',
                category: 'ai-dev',
                title: 'React Admin Dashboard',
                description: 'Modern React admin dashboard with charts, tables, forms, and responsive design.',
                keywords: ['react', 'dashboard', 'admin', 'charts', 'responsive'],
                uses: 3900,
                rating: 4.8,
                readTime: 8,
                timeSaved: '6-8 hours',
                template: `Create a professional React admin dashboard with the following specifications:

**Dashboard Components:**
- Responsive sidebar navigation with collapsible menu
- Top header with user profile, notifications, and search
- Dashboard overview with KPI cards and statistics
- Interactive charts (Line, Bar, Pie, Doughnut) using Chart.js
- Data tables with sorting, filtering, and pagination
- Form components with validation and error handling
- Modal dialogs for create/edit operations
- File upload with drag-and-drop functionality

**Technical Stack:**
- React 18 with TypeScript
- Material-UI or Tailwind CSS for styling
- React Router for navigation
- Chart.js or Recharts for data visualization
- React Hook Form for form management
- Axios for API calls
- Context API or Redux for state management

**Page Structure:**
- Dashboard Overview (/dashboard)
- User Management (/users)
- Product Management (/products) 
- Analytics & Reports (/analytics)
- Settings (/settings)
- Profile Management (/profile)

**Key Features:**
- Dark/Light theme toggle
- Responsive design for mobile/tablet/desktop
- Real-time data updates
- Export functionality (PDF, Excel)
- Advanced filtering and search
- Drag-and-drop components
- Notifications and alerts system
- Role-based access control

**Component Architecture:**
- Layout components (Sidebar, Header, Footer)
- Chart components (LineChart, BarChart, PieChart)
- Table components with advanced features
- Form components with validation
- Modal and dialog components
- Loading and error state components

Please provide complete React components, styling, routing setup, and integration examples.`
            },
            {
                id: 'rest-api-nodejs',
                category: 'ai-dev',  
                title: 'Node.js REST API (Production Ready)',
                description: 'Complete Node.js REST API with authentication, validation, testing, and deployment.',
                keywords: ['nodejs', 'api', 'rest', 'express', 'authentication'],
                uses: 4600,
                rating: 4.7,
                readTime: 10,
                timeSaved: '7-9 hours',
                template: `Build a production-ready Node.js REST API with the following complete specifications:

**Core API Features:**
- JWT-based authentication system
- User registration and login
- Password reset with email verification
- Role-based access control (Admin, User, Moderator)
- CRUD operations for main resources
- File upload handling with validation
- Email sending functionality
- Comprehensive error handling

**Technical Stack:**
- Node.js with Express.js framework
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Nodemailer for email sending
- Joi for input validation
- Jest for testing

**Project Structure:**
```
src/
├── controllers/     # Route handlers
├── models/         # Database models
├── middleware/     # Custom middleware
├── routes/         # Route definitions
├── utils/          # Helper functions
├── config/         # Configuration files
├── tests/          # Test files
└── app.js          # Main application file
```

**API Endpoints:**
- POST /api/auth/register - User registration
- POST /api/auth/login - User login  
- POST /api/auth/forgot-password - Password reset request
- POST /api/auth/reset-password - Reset password
- GET /api/auth/me - Get current user
- PUT /api/auth/update-profile - Update user profile
- POST /api/upload - File upload
- GET /api/users - Get all users (Admin only)
- DELETE /api/users/:id - Delete user (Admin only)

**Security Features:**
- Password hashing and salting
- JWT token expiration and refresh
- Rate limiting for login attempts
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- Environment variable protection

**Error Handling:**
- Global error handling middleware
- Custom error classes
- Validation error formatting
- Database error handling
- 404 not found handler
- Development vs production error responses

**Testing Strategy:**
- Unit tests for utility functions
- Integration tests for API endpoints
- Authentication and authorization tests
- Database operation tests
- File upload tests

Please provide complete code implementation, middleware setup, testing examples, and deployment configuration.`
            },
            {
                id: 'sales-data-analyzer',
                category: 'data-analysis',
                title: 'Sales Performance Analytics',
                description: 'Complete sales data analysis with trends, forecasting, and actionable insights.',
                keywords: ['sales', 'analytics', 'forecasting', 'KPI', 'revenue'],
                uses: 3400,
                rating: 4.8,
                readTime: 9,
                timeSaved: '5-7 hours',
                template: `Perform comprehensive sales performance analytics on the provided dataset with the following specifications:

**Data Analysis Requirements:**
- Sales trend analysis over time (daily, weekly, monthly, quarterly, yearly)
- Revenue forecasting for next 6 months using historical data
- Customer segmentation analysis (RFM - Recency, Frequency, Monetary)
- Product performance ranking and profitability analysis
- Geographic sales distribution and regional performance
- Seasonal pattern identification and impact assessment
- Sales funnel analysis and conversion rate optimization

**Key Performance Indicators (KPIs):**
- Total revenue and growth rate
- Average order value (AOV) trends
- Customer lifetime value (CLV)
- Customer acquisition cost (CAC)
- Monthly recurring revenue (MRR) for subscriptions
- Sales conversion rates by channel
- Top performing products and categories
- Regional sales performance metrics

**Statistical Methods:**
- Time series analysis with ARIMA/Prophet forecasting
- Cohort analysis for customer retention
- Correlation analysis between variables
- A/B testing analysis for marketing campaigns
- Statistical significance testing
- Outlier detection and anomaly analysis
- Regression analysis for sales drivers

**Data Processing Steps:**
1. Data cleaning and validation
2. Missing value treatment
3. Date standardization and parsing
4. Customer and product data normalization
5. Geographic data geocoding
6. Sales channel categorization

**Visualization Requirements:**
- Interactive dashboard with key metrics
- Revenue trend line charts with forecasting
- Customer segmentation scatter plots
- Geographic heat maps for regional analysis
- Product performance bar charts
- Seasonal decomposition plots
- Correlation heatmaps

**Business Insights Deliverables:**
- Executive summary with key findings
- Growth opportunities identification
- Underperforming area recommendations
- Customer retention strategies
- Product optimization suggestions
- Pricing strategy recommendations
- Marketing channel optimization

**Technical Implementation:**
- Python with pandas, numpy, scikit-learn
- Visualization with matplotlib, seaborn, plotly
- Statistical analysis with scipy, statsmodels
- Forecasting with Prophet or ARIMA
- Dashboard creation with Streamlit or Dash

Please provide complete analysis code, visualizations, statistical interpretations, and actionable business recommendations.`
            },
            {
                id: 'customer-insights',
                category: 'data-analysis',
                title: 'Customer Behavior Analytics',
                description: 'Deep customer analysis with segmentation, journey mapping, and retention strategies.',
                keywords: ['customer', 'behavior', 'segmentation', 'retention', 'churn'],
                uses: 2800,
                rating: 4.7,
                readTime: 8,
                timeSaved: '4-6 hours',
                template: `Conduct comprehensive customer behavior analytics with the following detailed analysis:

**Customer Segmentation Analysis:**
- RFM analysis (Recency, Frequency, Monetary value)
- Behavioral segmentation based on usage patterns
- Demographic and psychographic profiling
- K-means clustering for customer groups
- Segment-specific characteristics and preferences
- Custom scoring models for segment prioritization

**Customer Journey Mapping:**
- Touchpoint analysis across all channels
- Conversion funnel optimization opportunities
- Path analysis from awareness to purchase
- Drop-off point identification and solutions
- Cross-channel behavior tracking
- Customer experience pain point analysis

**Churn Prediction & Prevention:**
- Machine learning models for churn prediction
- Early warning indicators identification
- Risk scoring for existing customers
- Retention strategy recommendations
- Win-back campaign targeting
- Customer health score development

**Lifetime Value Analysis:**
- CLV calculation and modeling
- Predictive CLV using machine learning
- Segment-based value optimization
- Investment allocation recommendations
- Profitability analysis by customer tier
- Value-based marketing strategies

**Analytical Techniques:**
- Cohort analysis for retention tracking
- Survival analysis for churn modeling
- Association rule mining for cross-selling
- Sequential pattern mining for journey analysis
- Sentiment analysis from customer feedback
- Time series analysis for behavior trends

**Data Sources Integration:**
- Transaction data analysis
- Website/app interaction tracking
- Customer support ticket analysis
- Survey and feedback data
- Social media sentiment
- Email and marketing engagement

**Deliverables Required:**
- Customer persona development
- Segmentation strategy recommendations
- Retention improvement roadmap
- Personalization opportunities
- Revenue optimization strategies
- Customer experience enhancement plan

Please provide complete analytical framework, machine learning models, visualization dashboards, and strategic recommendations for customer optimization.`
            },
            {
                id: 'modern-website-ui',
                category: 'image-gen',
                title: 'Modern Website UI Design',
                description: 'Professional website interface with modern aesthetics, responsive layout, and user experience focus.',
                keywords: ['website', 'UI', 'modern', 'responsive', 'UX'],
                uses: 4100,
                rating: 4.9,
                readTime: 7,
                timeSaved: '4-5 hours',
                template: `Design a modern, professional website interface with the following comprehensive specifications:

**Visual Design Style:**
- Clean, minimalist aesthetic with contemporary typography
- Color scheme: Primary #2563EB (blue), Secondary #10B981 (green), Accent #F59E0B (amber)
- White space optimization for readability and focus
- Subtle shadows and gradients for depth
- Consistent visual hierarchy and information architecture

**Layout Structure:**
- Fixed header with transparent background on scroll
- Hero section with compelling value proposition
- Feature sections with icon-text combinations
- Testimonials/social proof section
- Call-to-action sections strategically placed
- Footer with comprehensive links and contact info

**Typography & Content:**
- Primary font: Inter or Poppins for headings
- Secondary font: System fonts for body text
- Font sizes: 48px headlines, 20px subheadings, 16px body
- Line height: 1.6 for optimal readability
- Color contrast: WCAG 2.1 AA compliance

**Interactive Elements:**
- Smooth hover animations on buttons and links
- Progressive disclosure for complex information
- Loading states and micro-interactions
- Form validation with real-time feedback
- Smooth scrolling between sections
- Mobile-first responsive animations

**Component Design:**
- Primary buttons with gradient backgrounds
- Card components with subtle shadows
- Navigation menu with clean dropdown functionality
- Search bar with autocomplete styling
- Modal dialogs with backdrop blur
- Progress indicators and loading spinners

**Responsive Breakpoints:**
- Mobile: 320px - 768px (single column layout)
- Tablet: 768px - 1024px (two-column hybrid)
- Desktop: 1024px+ (multi-column with sidebar)
- Large screens: 1440px+ (contained max-width)

**Accessibility Features:**
- High contrast color ratios (4.5:1 minimum)
- Keyboard navigation support
- Screen reader friendly markup
- Focus indicators on interactive elements
- Alt text for all images
- Semantic HTML structure

**Performance Considerations:**
- Optimized image formats (WebP with fallbacks)
- Minimal CSS and JavaScript footprint
- Critical CSS inlined for above-fold content
- Lazy loading for below-fold images
- Progressive enhancement approach

**User Experience Elements:**
- Clear navigation with breadcrumbs
- Search functionality with filters
- Social sharing buttons
- Newsletter signup forms
- Contact forms with validation
- FAQ sections with accordions

**Technical Specifications:**
- 1440px design canvas width
- 72 DPI for web optimization
- SVG icons for crisp scalability
- CSS Grid and Flexbox for layouts
- Modern browser compatibility (IE11+)

Design for conversion optimization, user engagement, and professional credibility. Include both desktop and mobile versions with consistent branding and user experience.`
            },
            {
                id: 'api-development',
                category: 'ai-dev',
                title: 'RESTful API Development',
                description: 'Professional API design with authentication, validation, documentation, and testing.',
                keywords: ['API', 'REST', 'backend', 'authentication'],
                uses: 3500,
                rating: 4.7,
                readTime: 6,
                timeSaved: '5-7 hours',
                template: `Design and implement a robust RESTful API with the following requirements:

**API Architecture:**
- RESTful design principles and resource modeling
- Consistent URL structure and naming conventions
- Proper HTTP status codes and error responses
- Versioning strategy for backward compatibility

**Authentication & Security:**
- JWT-based authentication system
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting and API security headers
- CORS configuration for cross-origin requests

**Data Management:**
- Database integration with ORM/ODM
- Data validation and schema enforcement
- Efficient querying and pagination
- Transaction management for complex operations

**Documentation & Testing:**
- Comprehensive API documentation (OpenAPI/Swagger)
- Unit tests for all endpoints
- Integration tests for complete workflows
- Postman collection or similar API testing tools

**Performance & Monitoring:**
- Caching strategies for frequently accessed data
- Database query optimization
- Logging and monitoring implementation
- Error tracking and performance metrics

Provide complete implementation with code examples, best practices, and deployment guidelines.`
            },
            {
                id: 'modern-dashboard',
                category: 'image-gen',
                title: 'Modern Dashboard Interface',
                description: 'Clean, professional dashboard design with data visualization and responsive layout.',
                keywords: ['dashboard', 'UI design', 'data visualization', 'modern'],
                uses: 2800,
                rating: 4.9,
                readTime: 5,
                template: `Create a modern, professional dashboard interface with the following design specifications:

**Visual Design:**
- Clean, minimalist aesthetic with plenty of white space
- Corporate color scheme: Primary #1E40AF (blue), Accent #F97316 (orange)
- Typography: Sans-serif fonts (Inter, Roboto) for readability
- Consistent spacing using 8px grid system
- Professional shadows and subtle gradients

**Layout & Structure:**
- Responsive grid layout (12-column system)
- Fixed sidebar navigation with collapsible menu
- Main content area with flexible widget arrangement
- Top navigation bar with user profile and notifications
- Breadcrumb navigation for deep pages

**Data Visualization:**
- Interactive line charts showing trends over time
- Bar charts for comparative data analysis
- Pie charts for category breakdowns
- KPI cards with animated numbers and icons
- Real-time data updates with smooth transitions

**Interactive Elements:**
- Hover states with subtle animations
- Dropdown menus with smooth transitions
- Modal dialogs for detailed views
- Drag-and-drop widget customization
- Search functionality with auto-complete

**Technical Specifications:**
- 1920x1080 resolution optimized
- Mobile-responsive breakpoints
- Accessibility compliance (WCAG 2.1)
- High contrast ratios for readability
- Vector-based icons and graphics

Design for user experience, data clarity, and professional presentation suitable for executive and management use.`
            },
            {
                id: 'ai-sales-assistant',
                category: 'chatbot',
                title: 'AI Sales Assistant',
                description: 'Intelligent sales chatbot that qualifies leads, handles objections, and drives conversions.',
                keywords: ['sales', 'lead qualification', 'conversion', 'objection handling'],
                uses: 3200,
                rating: 4.8,
                readTime: 8,
                timeSaved: '6-8 hours',
                template: `You are an expert AI sales assistant for [COMPANY_NAME]. Your mission is to qualify leads, address concerns, and guide prospects through the sales funnel with a consultative approach.

**Core Sales Responsibilities:**
- Engage prospects with value-focused conversations
- Qualify leads using BANT criteria (Budget, Authority, Need, Timeline)
- Present product benefits tailored to specific pain points
- Handle objections with empathy and evidence-based responses
- Schedule demos and consultations with sales team
- Follow up on inquiries and maintain relationship momentum

**Sales Methodology:**
- Discovery questions to understand prospect needs
- Pain point identification and solution mapping
- Value proposition presentation with ROI focus
- Social proof and case study sharing
- Objection handling with structured responses
- Trial close techniques and urgency creation

**Lead Qualification Framework:**
- Budget assessment: "What's your current investment in [CATEGORY]?"
- Authority verification: "Who else would be involved in this decision?"
- Need identification: "What challenges are you facing with [CURRENT_SOLUTION]?"
- Timeline establishment: "When are you looking to implement a solution?"
- Competition mapping: "What other options are you considering?"

**Objection Handling Scripts:**
- Price objection: Focus on ROI and long-term value
- Timing objection: Create urgency with limited offers
- Authority objection: Request introduction to decision maker
- Feature objection: Redirect to core benefits and outcomes
- Competition objection: Differentiate with unique value props

**Conversation Flow:**
1. Warm greeting and rapport building
2. Discovery questions and need assessment
3. Solution presentation tailored to needs
4. Objection handling and concern resolution
5. Clear next steps and commitment securing
6. Follow-up scheduling and contact information

**Communication Style:**
- Professional yet conversational tone
- Consultative rather than pushy approach
- Question-led discovery process
- Benefit-focused language over features
- Urgency creation without pressure tactics
- Personalized responses based on industry/role

**Integration Capabilities:**
- CRM data sync for lead tracking
- Calendar integration for demo scheduling
- Email automation for follow-up sequences
- Analytics tracking for conversion optimization
- Handoff protocols to human sales reps
- Lead scoring and prioritization

**Performance Metrics:**
- Lead qualification rate
- Demo scheduling conversion
- Objection resolution success
- Follow-up engagement rates
- Sales pipeline contribution
- Customer satisfaction scores

Engage prospects authentically, provide genuine value, and guide them naturally toward becoming customers while maintaining [COMPANY_NAME]'s professional reputation.`
            },
            {
                id: 'customer-service-bot',
                category: 'chatbot',
                title: 'Customer Support Specialist',
                description: 'Professional customer service chatbot with empathy, problem-solving skills, and brand consistency.',
                keywords: ['customer service', 'support', 'empathy', 'professional'],
                uses: 2800,
                rating: 4.6,
                readTime: 6,
                timeSaved: '4-6 hours',
                template: `You are a professional customer service representative for [COMPANY_NAME]. Your role is to provide exceptional customer support while maintaining the company's brand voice and values.

**Personality & Tone:**
- Professional yet friendly and approachable
- Empathetic and understanding of customer frustrations
- Patient and willing to explain complex concepts clearly
- Solution-oriented with a positive attitude
- Culturally sensitive and inclusive

**Core Responsibilities:**
- Listen actively to customer concerns and questions
- Provide accurate information about products/services
- Troubleshoot common issues with step-by-step guidance
- Process requests for refunds, exchanges, or account changes
- Escalate complex issues to appropriate specialists

**Communication Guidelines:**
- Use the customer's name when known
- Acknowledge their concerns before providing solutions
- Explain processes clearly without technical jargon
- Offer multiple solutions when possible
- Follow up to ensure satisfaction

**Knowledge Areas:**
- Complete product/service catalog and features
- Company policies (return, refund, warranty)
- Common troubleshooting procedures
- Account management and billing processes
- Integration with other departments and specialists

**Escalation Protocol:**
- Recognize when issues exceed your capabilities
- Transfer to technical support for complex technical issues
- Involve supervisors for policy exceptions or complaints
- Document interactions for future reference

**Brand Voice:**
- Maintain [COMPANY_NAME]'s brand personality
- Use approved language and avoid prohibited terms
- Align responses with company values and mission
- Ensure consistency across all customer interactions

Always prioritize customer satisfaction while protecting company interests. Be helpful, honest, and professional in every interaction.`
            },
            {
                id: 'business-analyst',
                category: 'data-analysis',
                title: 'Business Intelligence Analysis',
                description: 'Comprehensive business analysis framework with KPIs, insights, and strategic recommendations.',
                keywords: ['business intelligence', 'KPIs', 'analytics', 'strategy'],
                uses: 1900,
                rating: 4.8,
                readTime: 7,
                template: `Conduct a comprehensive business intelligence analysis with the following framework:

**Data Assessment:**
- Evaluate data sources for quality, completeness, and reliability
- Identify key metrics and KPIs relevant to business objectives
- Assess data collection methods and potential biases
- Determine appropriate analysis timeframes and segmentation

**Strategic Analysis:**
- Market trends and competitive landscape evaluation
- Customer behavior patterns and segmentation analysis
- Product/service performance metrics and profitability
- Operational efficiency and cost structure analysis

**Statistical Methods:**
- Descriptive statistics for baseline understanding
- Correlation analysis to identify relationships
- Trend analysis with time series forecasting
- Cohort analysis for customer lifecycle insights
- A/B testing for performance optimization

**Visualization Strategy:**
- Executive dashboard with key performance indicators
- Trend charts showing performance over time
- Comparative analysis with benchmark data
- Geographic and demographic breakdowns
- Interactive filters for detailed exploration

**Insights & Recommendations:**
- Identify top 3-5 strategic opportunities
- Quantify potential impact and resource requirements
- Provide actionable next steps with timelines
- Risk assessment and mitigation strategies
- Success metrics and monitoring plan

**Deliverables:**
- Executive summary with key findings
- Detailed analytical report with methodology
- Interactive dashboard for ongoing monitoring
- Implementation roadmap with priorities
- Training materials for stakeholder teams

Focus on translating data into strategic business value with clear, actionable insights that drive decision-making and improve performance.`
            }
        ];
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('template-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterTemplates();
            });
        }

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.updateFilterButtons();
                this.filterTemplates();
            });
        });

        // Template usage tracking
        this.setupUsageTracking();
    }

    setupUsageTracking() {
        // Track template usage and update analytics
        document.addEventListener('click', (e) => {
            if (e.target.matches('.use-template-btn')) {
                const templateId = e.target.dataset.templateId;
                this.trackTemplateUsage(templateId);
            }
        });
    }

    trackTemplateUsage(templateId) {
        // Update usage analytics
        const template = this.templates.find(t => t.id === templateId);
        if (template) {
            template.uses++;
            // Send to analytics
            this.sendAnalytics('template_used', {
                templateId: templateId,
                category: template.category,
                timestamp: new Date().toISOString()
            });
        }
    }

    setupAnimations() {
        // Animate templates on load
        anime({
            targets: '.template-card',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuart'
        });
    }

    setupSearch() {
        // Enhanced search with highlighting
        const searchInput = document.getElementById('template-search');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });
        }
    }

    setupFilters() {
        this.updateFilterButtons();
        this.filterTemplates();
    }

    updateFilterButtons() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            if (btn.dataset.filter === this.currentFilter) {
                btn.classList.add('bg-orange-500', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');
            } else {
                btn.classList.remove('bg-orange-500', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            }
        });
    }

    renderEnhancedTemplates() {
        const container = document.getElementById('templates-container');
        if (!container) return;
        
        const templatesHTML = this.templates.map(template => this.createTemplateCard(template)).join('');
        container.innerHTML = templatesHTML;
        
        // Animate cards
        anime({
            targets: '.template-card',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(150),
            duration: 600,
            easing: 'easeOutQuart'
        });
    }
    
    createTemplateCard(template) {
        const modeColors = {
            'ai-dev': 'bg-blue-100 text-blue-800 border-blue-200',
            'data-analysis': 'bg-green-100 text-green-800 border-green-200', 
            'image-gen': 'bg-purple-100 text-purple-800 border-purple-200',
            'chatbot': 'bg-orange-100 text-orange-800 border-orange-200'
        };

        const modeIcons = {
            'ai-dev': '💻',
            'data-analysis': '📊',
            'image-gen': '🎨',
            'chatbot': '🤖'
        };

        const timeSaved = template.timeSaved || '3-5 hours';

        return `
            <div class="template-card bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-xl transition-all duration-300 overflow-hidden" 
                 data-category="${template.category}" 
                 data-keywords="${template.keywords.join(' ').toLowerCase()}"
                 data-id="${template.id}">
                
                <!-- Header with Time Saved Badge -->
                <div class="p-6 border-b border-gray-100">
                    <div class="flex items-start justify-between mb-4">
                        <div class="flex items-center space-x-3">
                            <span class="text-3xl">${modeIcons[template.category]}</span>
                            <div>
                                <h3 class="text-lg font-bold text-gray-800 mb-1">${template.title}</h3>
                                <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${modeColors[template.category]}">
                                    ${template.category.toUpperCase().replace('-', ' ')}
                                </span>
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                                ⚡ SAVES ${timeSaved.toUpperCase()}
                            </div>
                            <div class="text-sm text-gray-500">
                                ⭐ ${template.rating} • 📊 ${template.uses.toLocaleString()} uses
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600 text-sm leading-relaxed">${template.description}</p>
                </div>

                <!-- Template Preview -->
                <div class="p-6 bg-gray-50">
                    <div class="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                            <span class="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                            Template Preview (${template.template.length} characters)
                        </h4>
                        <div class="text-sm text-gray-600 line-clamp-4 font-mono bg-blue-50 p-3 rounded border">
                            ${template.template.substring(0, 200)}...
                        </div>
                    </div>
                </div>

                <!-- Keywords -->
                <div class="px-6 pb-4">
                    <div class="flex flex-wrap gap-2">
                        ${template.keywords.map(keyword => 
                            `<span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">${keyword}</span>`
                        ).join('')}
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="p-6 pt-0 space-y-3">
                    <!-- Primary Action -->
                    <button onclick="instantUseTemplate('${template.id}')" 
                            class="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        <span>⚡ INSTANT USE - COPY & OPTIMIZE</span>
                    </button>
                    
                    <!-- Secondary Actions -->
                    <div class="grid grid-cols-2 gap-2">
                        <button onclick="previewTemplate('${template.id}')" 
                                class="flex items-center justify-center space-x-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-2 px-4 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <span>Preview</span>
                        </button>
                        <button onclick="copyTemplate('${template.id}')" 
                                class="flex items-center justify-center space-x-2 bg-green-100 hover:bg-green-200 text-green-700 font-medium py-2 px-4 rounded-lg transition-colors">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                            </svg>
                            <span>Copy</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    filterTemplates() {
        const cards = document.querySelectorAll('.template-card');
        cards.forEach(card => {
            const category = card.dataset.category;
            const keywords = card.dataset.keywords?.toLowerCase() || '';
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            
            const matchesFilter = this.currentFilter === 'all' || category === this.currentFilter;
            const matchesSearch = !this.searchQuery || 
                                  keywords.includes(this.searchQuery) || 
                                  title.includes(this.searchQuery);
            
            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                anime({
                    targets: card,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    duration: 300
                });
            } else {
                card.style.display = 'none';
            }
        });
    }

    sendAnalytics(event, data) {
        // Send analytics data to backend
        fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event: event,
                data: data,
                timestamp: new Date().toISOString()
            })
        }).catch(console.error);
    }
}

// Template usage functions
function useTemplate(templateId) {
    const templatesManager = window.templatesManager;
    const template = templatesManager.templates.find(t => t.id === templateId);
    
    if (template) {
        // Show loading animation
        showTemplateLoadingAnimation(templateId);
        
        // Store template in session storage with timestamp
        const templateData = {
            ...template,
            selectedAt: new Date().toISOString(),
            fromPage: 'templates'
        };
        sessionStorage.setItem('selectedTemplate', JSON.stringify(templateData));
        
        // Track usage for analytics
        templatesManager.trackTemplateUsage(templateId);
        
        // Instant redirect with smooth transition
        setTimeout(() => {
            window.location.href = `index.html?template=${templateId}&action=paste`;
        }, 500);
    }
}

function showTemplateLoadingAnimation(templateId) {
    // Create loading overlay
    const loadingOverlay = document.createElement('div');
    loadingOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingOverlay.innerHTML = `
        <div class="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Loading Template</h3>
            <p class="text-gray-600">Converting template to your prompt optimizer...</p>
            <div class="mt-4 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div class="bg-gradient-to-r from-orange-500 to-teal-500 h-full animate-pulse"></div>
            </div>
        </div>
    `;
    
    document.body.appendChild(loadingOverlay);
    
    // Animate loading overlay
    anime({
        targets: loadingOverlay,
        opacity: [0, 1],
        duration: 300
    });
}

function previewTemplate(templateId) {
    const templatesManager = window.templatesManager;
    const template = templatesManager.templates.find(t => t.id === templateId);
    
    if (template) {
        // Create preview modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-xl max-w-4xl max-h-[90vh] overflow-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold text-gray-800">${template.title}</h2>
                        <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <p class="text-gray-600 mt-2">${template.description}</p>
                    <div class="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                        <span>📊 ${template.uses} uses</span>
                        <span>⭐ ${template.rating}</span>
                        <span>⏱️ ${template.readTime} min read</span>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-lg font-semibold mb-4">Template Preview:</h3>
                    <div class="bg-gray-50 rounded-lg p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">${template.template}</div>
                    <div class="flex gap-3 mt-6">
                        <button onclick="useTemplate('${templateId}')" class="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                            Use This Template
                        </button>
                        <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Animate modal appearance
        anime({
            targets: modal,
            opacity: [0, 1],
            duration: 300
        });
        
        anime({
            targets: modal.querySelector('.bg-white'),
            scale: [0.9, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }
}

// Enhanced template functions for instant copy/paste
function instantUseTemplate(templateId) {
    const templatesManager = window.templatesManager;
    const template = templatesManager.templates.find(t => t.id === templateId);
    
    if (template) {
        // Show instant feedback
        showInstantCopyFeedback(templateId);
        
        // Store template data with enhanced metadata
        const templateData = {
            ...template,
            selectedAt: new Date().toISOString(),
            fromPage: 'templates',
            action: 'instant_use'
        };
        sessionStorage.setItem('selectedTemplate', JSON.stringify(templateData));
        
        // Track usage analytics
        templatesManager.trackTemplateUsage(templateId);
        
        // Instant redirect with enhanced parameters
        setTimeout(() => {
            window.location.href = `index.html?template=${templateId}&action=instant_paste&source=templates`;
        }, 800);
    }
}

function copyTemplate(templateId) {
    const templatesManager = window.templatesManager;
    const template = templatesManager.templates.find(t => t.id === templateId);
    
    if (template) {
        // Copy template content to clipboard
        navigator.clipboard.writeText(template.template).then(() => {
            showCopySuccessNotification(template.title);
            templatesManager.trackTemplateUsage(templateId, 'copy');
        }).catch(() => {
            showCopyErrorNotification();
        });
    }
}

function showInstantCopyFeedback(templateId) {
    const templateCard = document.querySelector(`[data-id="${templateId}"]`);
    if (templateCard) {
        const button = templateCard.querySelector('button[onclick*="instantUseTemplate"]');
        
        // Update button to show progress
        const originalHTML = button.innerHTML;
        button.innerHTML = `
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>CONVERTING & PASTING...</span>
        `;
        button.disabled = true;
        
        // Add pulsing effect to entire card
        templateCard.classList.add('animate-pulse', 'ring-4', 'ring-orange-300');
    }
}

function showCopySuccessNotification(templateTitle) {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <div class="font-semibold">Template Copied!</div>
                <div class="text-sm opacity-90">${templateTitle}</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function showCopyErrorNotification() {
    const notification = document.createElement('div');
    notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg z-50';
    notification.innerHTML = `
        <div class="flex items-center space-x-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
                <div class="font-semibold">Copy Failed</div>
                <div class="text-sm opacity-90">Please copy manually</div>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.templatesManager = new TemplatesManager();
    
    // Check if user came from template selection
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('template');
    if (templateId) {
        setTimeout(() => previewTemplate(templateId), 500);
    }
    
    // Render enhanced template cards
    window.templatesManager.renderEnhancedTemplates();
});