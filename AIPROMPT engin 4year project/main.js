// PromptEngine - Enhanced Main JavaScript Functionality

// API Client Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';

const apiClient = {
    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'API error');
            }
            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    },
    async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`);
            if (!response.ok) throw new Error('API error');
            return await response.json();
        } catch (error) {
            console.error(`API Error: ${endpoint}`, error);
            throw error;
        }
    }
};

class PromptEngine {
    constructor() {
        this.currentMode = 'ai-dev';
        this.currentScores = {
            clarity: 0,
            specificity: 0,
            creativity: 0,
            technical: 0
        };
        this.optimizationHistory = [];
        this.assistantMessages = [];
        this.promptAnalysis = {};
        this.improvementSuggestions = [];
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeAnimations();
        this.setupNeuralBackground();
        this.initializeTypedText();
        this.setupScrollAnimations();
        this.initializeEnhancedFeatures();
    }
    
    setupEventListeners() {
        // Mode selection
        document.querySelectorAll('.mode-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectMode(e.target.closest('.mode-card')));
        });
        
        // File upload
        const fileInput = document.getElementById('file-input');
        const uploadArea = document.getElementById('upload-area');
        
        fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        
        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.processFile(files[0]);
            }
        });
        
        // Prompt input
        const promptInput = document.getElementById('prompt-input');
        promptInput.addEventListener('input', () => {
            this.updateWordCount();
            this.analyzePromptQuality();
            this.generateImprovementSuggestions();
        });
        
        // Optimization buttons
        document.getElementById('optimize-btn').addEventListener('click', () => this.optimizePrompt());
        document.getElementById('compare-btn').addEventListener('click', () => this.showComparison());

        // AI Assistant
        document.getElementById('assistant-send').addEventListener('click', () => this.sendAssistantMessage());
        document.getElementById('assistant-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAssistantMessage();
            }
        });

        // Model comparison tabs
        document.querySelectorAll('.model-tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.selectModel(e.target.dataset.model));
        });
    }
    
    initializeEnhancedFeatures() {
        // Add real-time prompt analysis
        this.createPromptAnalysisPanel();
        
        // Add improvement suggestions
        this.createImprovementSuggestions();
        
        // Add advanced optimization options
        this.createAdvancedOptions();
    }
    
    createPromptAnalysisPanel() {
        const analysisPanel = document.createElement('div');
        analysisPanel.id = 'prompt-analysis';
        analysisPanel.className = 'bg-white rounded-xl p-6 mt-6 fade-in hidden';
        analysisPanel.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Prompt Analysis</h3>
            <div class="grid grid-cols-2 gap-4 text-sm">
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Word Count:</span>
                    <span id="analysis-word-count" class="font-medium">0</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Readability:</span>
                    <span id="analysis-readability" class="font-medium">-</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Action Verbs:</span>
                    <span id="analysis-verbs" class="font-medium">0</span>
                </div>
                <div class="flex items-center justify-between">
                    <span class="text-gray-600">Specificity:</span>
                    <span id="analysis-specificity" class="font-medium">-</span>
                </div>
            </div>
            <div class="mt-4">
                <div class="text-sm font-medium text-gray-700 mb-2">Detected Elements:</div>
                <div id="detected-elements" class="flex flex-wrap gap-2"></div>
            </div>
        `;
        
        document.getElementById('optimizer').appendChild(analysisPanel);
    }
    
    createImprovementSuggestions() {
        const suggestionsPanel = document.createElement('div');
        suggestionsPanel.id = 'improvement-suggestions';
        suggestionsPanel.className = 'bg-white rounded-xl p-6 mt-6 fade-in hidden';
        suggestionsPanel.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Improvement Suggestions</h3>
            <div id="suggestions-list" class="space-y-3"></div>
        `;
        
        document.getElementById('optimizer').appendChild(suggestionsPanel);
    }
    
    createAdvancedOptions() {
        const advancedPanel = document.createElement('div');
        advancedPanel.id = 'advanced-options';
        advancedPanel.className = 'bg-white rounded-xl p-6 mt-6 fade-in hidden';
        advancedPanel.innerHTML = `
            <h3 class="text-lg font-semibold text-gray-800 mb-4">Advanced Optimization Options</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="include-tests" class="rounded">
                    <label for="include-tests" class="text-sm text-gray-700">Include unit tests</label>
                </div>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="add-documentation" class="rounded">
                    <label for="add-documentation" class="text-sm text-gray-700">Add comprehensive documentation</label>
                </div>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="performance-optimization" class="rounded">
                    <label for="performance-optimization" class="text-sm text-gray-700">Include performance optimizations</label>
                </div>
                <div class="flex items-center space-x-3">
                    <input type="checkbox" id="security-features" class="rounded">
                    <label for="security-features" class="text-sm text-gray-700">Add security best practices</label>
                </div>
            </div>
        `;
        
        document.getElementById('optimizer').appendChild(advancedPanel);
    }
    
    initializeAnimations() {
        // Fade in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        document.querySelectorAll('.fade-in').forEach(el => {
            observer.observe(el);
        });
        
        // Animate mode cards on load
        anime({
            targets: '.mode-card',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuart'
        });
    }
    
    setupNeuralBackground() {
        // P5.js neural network background
        new p5((p) => {
            let nodes = [];
            let connections = [];
            
            p.setup = () => {
                const canvas = p.createCanvas(p.windowWidth, p.windowHeight);
                canvas.parent('neural-bg');
                
                // Create nodes
                for (let i = 0; i < 50; i++) {
                    nodes.push({
                        x: p.random(p.width),
                        y: p.random(p.height),
                        vx: p.random(-0.5, 0.5),
                        vy: p.random(-0.5, 0.5),
                        size: p.random(2, 4)
                    });
                }
            };
            
            p.draw = () => {
                p.clear();
                
                // Update and draw nodes
                nodes.forEach(node => {
                    node.x += node.vx;
                    node.y += node.vy;
                    
                    // Wrap around edges
                    if (node.x < 0) node.x = p.width;
                    if (node.x > p.width) node.x = 0;
                    if (node.y < 0) node.y = p.height;
                    if (node.y > p.height) node.y = 0;
                    
                    // Draw node
                    p.fill(193, 122, 91, 100);
                    p.noStroke();
                    p.ellipse(node.x, node.y, node.size);
                });
                
                // Draw connections
                p.stroke(74, 155, 142, 30);
                p.strokeWeight(1);
                
                for (let i = 0; i < nodes.length; i++) {
                    for (let j = i + 1; j < nodes.length; j++) {
                        const dist = p.dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                        if (dist < 100) {
                            const alpha = p.map(dist, 0, 100, 50, 0);
                            p.stroke(74, 155, 142, alpha);
                            p.line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
                        }
                    }
                }
            };
            
            p.windowResized = () => {
                p.resizeCanvas(p.windowWidth, p.windowHeight);
            };
        });
    }
    
    initializeTypedText() {
        new Typed('#typed-title', {
            strings: [
                'PromptEngine',
                'AI Optimization',
                'Prompt Mastery',
                'AI Excellence'
            ],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
    
    setupScrollAnimations() {
        // Smooth scroll to optimizer
        window.scrollToOptimizer = () => {
            document.getElementById('optimizer').scrollIntoView({
                behavior: 'smooth'
            });
        };
    }
    
    selectMode(card) {
        // Remove active class from all cards
        document.querySelectorAll('.mode-card').forEach(c => c.classList.remove('active'));
        
        // Add active class to selected card
        card.classList.add('active');
        
        // Update current mode
        this.currentMode = card.dataset.mode;
        
        // Animate selection
        anime({
            targets: card,
            scale: [1, 1.05, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        // Update interface based on mode
        this.updateInterfaceForMode();
    }
    
    updateInterfaceForMode() {
        const promptInput = document.getElementById('prompt-input');
        const placeholders = {
            'ai-dev': 'Example: Create a Python function that implements bubble sort with detailed comments and error handling...',
            'image-gen': 'Example: A serene landscape with mountains, lake reflection, golden hour lighting, in the style of Monet...',
            'chatbot': 'Example: You are a helpful customer service agent for a tech company. Be friendly but professional...',
            'data-analysis': 'Example: Analyze the sales data to identify trends, outliers, and provide actionable insights...'
        };
        
        promptInput.placeholder = placeholders[this.currentMode] || 'Enter your prompt here...';
        
        // Show mode-specific suggestions
        this.showModeSuggestions();
        
        // Update advanced options based on mode
        this.updateAdvancedOptions();
    }
    
    updateAdvancedOptions() {
        const advancedPanel = document.getElementById('advanced-options');
        if (advancedPanel) {
            const options = {
                'ai-dev': ['include-tests', 'add-documentation', 'performance-optimization', 'security-features'],
                'image-gen': ['style-consistency', 'quality-settings', 'composition-rules', 'color-palette'],
                'chatbot': ['personality-consistency', 'context-awareness', 'emotional-intelligence', 'multi-turn-capability'],
                'data-analysis': ['statistical-validity', 'visualization-quality', 'insight-depth', 'recommendation-actionability']
            };
            
            // Show/hide relevant options based on mode
            const checkboxes = advancedPanel.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.checked = false; // Reset all checkboxes
            });
            
            advancedPanel.classList.remove('hidden');
        }
    }
    
    showModeSuggestions() {
        const suggestions = {
            'ai-dev': [
                'Add specific programming language requirements',
                'Include error handling specifications',
                'Specify performance constraints',
                'Mention coding style preferences'
            ],
            'image-gen': [
                'Include lighting and atmosphere details',
                'Specify artistic style or medium',
                'Add composition and framing instructions',
                'Mention color palette preferences'
            ],
            'chatbot': [
                'Define personality traits and tone',
                'Specify knowledge boundaries',
                'Include conversation examples',
                'Add safety and ethical guidelines'
            ],
            'data-analysis': [
                'Specify data format and structure',
                'Include statistical methods to use',
                'Define key metrics to analyze',
                'Mention visualization requirements'
            ]
        };
        
        // Show suggestions in AI assistant
        const modeSuggestions = suggestions[this.currentMode] || [];
        if (modeSuggestions.length > 0) {
            this.addAssistantMessage(`💡 ${modeSuggestions[0]}`, 'suggestion');
        }
    }
    
    handleFileUpload(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }
    
    processFile(file) {
        const uploadInfo = document.getElementById('upload-info');
        const filenameEl = document.getElementById('upload-filename');
        const filesizeEl = document.getElementById('upload-filesize');
        const progressEl = document.getElementById('upload-progress');
        const uploadArea = document.getElementById('upload-area');

        // Basic validation
        const maxBytes = 5 * 1024 * 1024; // 5 MB
        const allowed = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (file.size > maxBytes) {
            this.addAssistantMessage('⚠️ File too large (max 5MB). Try a smaller document.', 'warning');
            return;
        }
        if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|txt|docx)$/i)) {
            this.addAssistantMessage('⚠️ Unsupported file type. Use PDF, DOCX, or TXT.', 'warning');
            return;
        }

        // Show file info / progress UI
        if (uploadInfo && filenameEl && filesizeEl && progressEl) {
            uploadInfo.classList.remove('hidden');
            filenameEl.textContent = file.name;
            filesizeEl.textContent = `${(file.size/1024/1024).toFixed(2)} MB`;
            progressEl.style.width = '0%';
        } else {
            // Fallback: minimal loading text
            uploadArea.innerHTML = `<div class="flex items-center justify-center space-x-3"><div class="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div><span class="text-gray-600">Processing ${file.name}...</span></div>`;
        }

        // Provide cancel/remove handler
        const cancelBtn = document.getElementById('upload-cancel');
        const resetUpload = () => {
            if (uploadInfo) uploadInfo.classList.add('hidden');
            if (progressEl) progressEl.style.width = '0%';
            document.getElementById('file-input').value = '';
        };
        if (cancelBtn) {
            cancelBtn.onclick = () => {
                resetUpload();
                this.addAssistantMessage('Upload cancelled.', 'info');
            };
        }

        // Simulate upload/progress then extract keywords
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.floor(Math.random() * 15) + 10; // increment
            if (progress > 100) progress = 100;
            if (progressEl) progressEl.style.width = `${progress}%`;
            if (progress >= 100) {
                clearInterval(interval);
                // Small delay to let UI settle
                setTimeout(() => this.extractKeywordsFromFile(file), 600);
            }
        }, 250);
    }
    
    extractKeywordsFromFile(file) {
        // Simulate keyword extraction
        const mockKeywords = [
            'authentication', 'CRUD', 'dashboard', 'user management',
            'database', 'API integration', 'security', 'scalability'
        ];
        
        // Show extracted keywords
        const keywordsContainer = document.getElementById('keywords-container');
        const keywordsDiv = document.getElementById('keywords');
        
        keywordsDiv.innerHTML = mockKeywords.map(keyword => `
            <span class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm cursor-pointer hover:bg-teal-200 transition-colors" onclick="promptEngine.addKeywordToPrompt('${keyword}')">
                ${keyword}
            </span>
        `).join('');
        
        keywordsContainer.classList.remove('hidden');
        
        // Update upload area
        const uploadArea = document.getElementById('upload-area');
        uploadArea.innerHTML = `
            <div class="text-center">
                <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">File Processed Successfully</h3>
                <p class="text-gray-600 mb-3">Found ${mockKeywords.length} relevant keywords</p>
                <button onclick="document.getElementById('file-input').click()" class="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    Upload Another File
                </button>
            </div>
        `;
        
        // Add assistant message
        this.addAssistantMessage(`📄 I've analyzed your document and extracted ${mockKeywords.length} key terms. Click on any keyword to add it to your prompt!`, 'info');
    }
    
    addKeywordToPrompt(keyword) {
        const promptInput = document.getElementById('prompt-input');
        const currentValue = promptInput.value;
        const newValue = currentValue ? `${currentValue} ${keyword}` : keyword;
        promptInput.value = newValue;
        
        this.updateWordCount();
        this.analyzePromptQuality();
        this.generateImprovementSuggestions();
        
        // Animate the addition
        anime({
            targets: promptInput,
            backgroundColor: ['rgba(74, 155, 142, 0.1)', 'rgba(255, 255, 255, 0.95)'],
            duration: 500,
            easing: 'easeOutQuart'
        });
    }
    
    updateWordCount() {
        const promptInput = document.getElementById('prompt-input');
        const wordCount = promptInput.value.trim().split(/\s+/).filter(word => word.length > 0).length;
        document.getElementById('word-count').textContent = wordCount;
        
        // Update analysis panel
        const analysisPanel = document.getElementById('prompt-analysis');
        if (analysisPanel && !analysisPanel.classList.contains('hidden')) {
            document.getElementById('analysis-word-count').textContent = wordCount;
        }
    }
    
    analyzePromptQuality() {
        const prompt = document.getElementById('prompt-input').value;
        
        if (prompt.length < 10) {
            this.updateQualityScores({ clarity: 0, specificity: 0, creativity: 0, technical: 0 });
            return;
        }
        
        // Call backend API for analysis
        apiClient.post('/analyze', { prompt })
            .then(response => {
                // Update quality scores
                const scores = {
                    clarity: response.scores.clarity,
                    specificity: response.scores.specificity,
                    creativity: response.scores.creativity,
                    technical: response.scores.technical
                };
                this.updateQualityScores(scores);
                
                // Update prompt analysis panel
                const analysis = {
                    wordCount: response.word_count,
                    readability: response.readability,
                    actionVerbs: response.action_verbs,
                    elements: response.elements,
                    scores: scores
                };
                this.updatePromptAnalysis(analysis);
                
                // Show analysis panel
                const analysisPanel = document.getElementById('prompt-analysis');
                if (analysisPanel) {
                    analysisPanel.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.warn('API analysis failed, using fallback');
                // Fallback to client-side analysis
                const analysis = this.performDetailedAnalysis(prompt);
                this.updateQualityScores(analysis.scores);
                this.updatePromptAnalysis(analysis);
            });
    }
    
    performDetailedAnalysis(prompt) {
        // Detailed prompt analysis
        const wordCount = prompt.trim().split(/\s+/).filter(word => word.length > 0).length;
        const sentences = prompt.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const actionVerbs = (prompt.match(/\b(create|build|implement|design|develop|optimize|analyze|generate)\b/gi) || []).length;
        const specificTerms = (prompt.match(/\b(specific|detailed|comprehensive|professional|optimized|efficient)\b/gi) || []).length;
        
        // Calculate readability (simplified)
        const avgWordsPerSentence = wordCount / Math.max(sentences, 1);
        const readability = avgWordsPerSentence > 20 ? 'Complex' : avgWordsPerSentence > 15 ? 'Moderate' : 'Clear';
        
        // Detect elements
        const elements = [];
        if (prompt.toLowerCase().includes('function') || prompt.toLowerCase().includes('method')) elements.push('🔄 Function');
        if (prompt.toLowerCase().includes('api') || prompt.toLowerCase().includes('endpoint')) elements.push('🔌 API');
        if (prompt.toLowerCase().includes('database') || prompt.toLowerCase().includes('schema')) elements.push('🗄️ Database');
        if (prompt.toLowerCase().includes('test') || prompt.toLowerCase().includes('validate')) elements.push('🧪 Testing');
        if (prompt.toLowerCase().includes('security') || prompt.toLowerCase().includes('authenticate')) elements.push('🔒 Security');
        if (prompt.toLowerCase().includes('performance') || prompt.toLowerCase().includes('optimize')) elements.push('⚡ Performance');
        
        return {
            scores: {
                clarity: Math.min(10, (actionVerbs * 2) + (wordCount / 10)),
                specificity: Math.min(10, specificTerms * 2 + (wordCount / 15)),
                creativity: Math.min(10, Math.random() * 3 + 6),
                technical: Math.min(10, elements.length * 1.5 + (wordCount / 20))
            },
            wordCount,
            readability,
            actionVerbs,
            elements
        };
    }
    
    updatePromptAnalysis(analysis) {
        document.getElementById('analysis-word-count').textContent = analysis.wordCount;
        document.getElementById('analysis-readability').textContent = analysis.readability;
        document.getElementById('analysis-verbs').textContent = analysis.actionVerbs;
        document.getElementById('analysis-specificity').textContent = analysis.elements.length > 0 ? 'High' : 'Low';
        
        const elementsContainer = document.getElementById('detected-elements');
        elementsContainer.innerHTML = analysis.elements.map(element => 
            `<span class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">${element}</span>`
        ).join('');
    }
    
    generateImprovementSuggestions() {
        const prompt = document.getElementById('prompt-input').value;
        const suggestions = this.analyzePromptForImprovements(prompt);
        
        if (suggestions.length > 0) {
            this.displayImprovementSuggestions(suggestions);
        }
    }
    
    analyzePromptForImprovements(prompt) {
        const suggestions = [];
        
        // Check for action verbs
        const actionVerbs = (prompt.match(/\b(create|build|implement|design|develop|optimize|analyze|generate)\b/gi) || []);
        if (actionVerbs.length < 2) {
            suggestions.push({
                type: 'clarity',
                message: 'Add more action verbs like "create", "implement", "design" to make instructions clearer',
                priority: 'high'
            });
        }
        
        // Check for specificity
        const vagueTerms = (prompt.match(/\b(some|various|certain|appropriate|suitable)\b/gi) || []);
        if (vagueTerms.length > 0) {
            suggestions.push({
                type: 'specificity',
                message: 'Replace vague terms with specific requirements',
                priority: 'medium'
            });
        }
        
        // Check for technical details
        if (!prompt.toLowerCase().includes('error') && !prompt.toLowerCase().includes('handle')) {
            suggestions.push({
                type: 'technical',
                message: 'Consider adding error handling requirements',
                priority: 'high'
            });
        }
        
        // Check for performance considerations
        if (!prompt.toLowerCase().includes('performance') && !prompt.toLowerCase().includes('optimize')) {
            suggestions.push({
                type: 'technical',
                message: 'Add performance requirements or optimization goals',
                priority: 'medium'
            });
        }
        
        return suggestions;
    }
    
    displayImprovementSuggestions(suggestions) {
        const suggestionsPanel = document.getElementById('improvement-suggestions');
        const suggestionsList = document.getElementById('suggestions-list');
        
        suggestionsList.innerHTML = suggestions.map(suggestion => `
            <div class="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div class="w-2 h-2 rounded-full mt-2 ${suggestion.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'}"></div>
                <div class="flex-1">
                    <div class="text-sm font-medium text-gray-800 capitalize">${suggestion.type} Improvement</div>
                    <div class="text-sm text-gray-600">${suggestion.message}</div>
                    <button class="text-xs text-orange-600 hover:text-orange-700 mt-1" onclick="promptEngine.applySuggestion('${suggestion.message}')">
                        Apply Suggestion
                    </button>
                </div>
            </div>
        `).join('');
        
        suggestionsPanel.classList.remove('hidden');
    }
    
    applySuggestion(suggestion) {
        const promptInput = document.getElementById('prompt-input');
        let currentValue = promptInput.value;
        
        // Apply the suggestion based on the message
        if (suggestion.includes('action verbs')) {
            currentValue += ' Create, implement, and design the solution with clear steps.';
        } else if (suggestion.includes('error handling')) {
            currentValue += ' Include comprehensive error handling and validation.';
        } else if (suggestion.includes('performance')) {
            currentValue += ' Optimize for performance and scalability.';
        }
        
        promptInput.value = currentValue;
        this.updateWordCount();
        this.analyzePromptQuality();
        this.generateImprovementSuggestions();
        
        this.addAssistantMessage('✅ Applied improvement suggestion!', 'success');
    }
    
    updateQualityScores(scores) {
        this.currentScores = scores;
        
        // Update individual score bars
        Object.keys(scores).forEach(metric => {
            const score = Math.round(scores[metric]);
            const percentage = (score / 10) * 100;
            
            const bar = document.getElementById(`${metric}-bar`);
            const scoreDisplay = document.getElementById(`${metric}-score`);
            
            anime({
                targets: bar,
                width: `${percentage}%`,
                duration: 800,
                easing: 'easeOutQuart'
            });
            
            anime({
                targets: scoreDisplay,
                innerHTML: [parseInt(scoreDisplay.textContent), score],
                duration: 800,
                round: 1,
                easing: 'easeOutQuart'
            });
        });
        
        // Update overall score
        const overall = Math.round((scores.clarity + scores.specificity + scores.creativity + scores.technical) / 4);
        const overallDisplay = document.getElementById('overall-score');
        
        anime({
            targets: overallDisplay,
            innerHTML: [parseInt(overallDisplay.textContent), overall],
            duration: 800,
            round: 1,
            easing: 'easeOutQuart'
        });
    }
    
    optimizePrompt() {
        const promptInput = document.getElementById('prompt-input');
        const originalPrompt = promptInput.value.trim();
        
        if (originalPrompt.length < 10) {
            this.addAssistantMessage('Please enter a prompt with at least 10 characters to optimize.', 'warning');
            return;
        }
        
        // Show loading state
        const optimizeBtn = document.getElementById('optimize-btn');
        const originalText = optimizeBtn.textContent;
        optimizeBtn.textContent = 'Optimizing...';
        optimizeBtn.disabled = true;
        
        // Call backend API
        const payload = {
            original_prompt: originalPrompt,
            mode: this.currentMode,
            include_tests: document.getElementById('include-tests')?.checked || false,
            add_documentation: document.getElementById('add-documentation')?.checked || false,
            performance_optimization: document.getElementById('performance-optimization')?.checked || false,
            security_features: document.getElementById('security-features')?.checked || false
        };
        
        apiClient.post('/optimize', payload)
            .then(response => {
                // Update comparison panel
                document.getElementById('original-prompt').textContent = response.original_prompt;
                document.getElementById('optimized-prompt').textContent = response.optimized_prompt;
                
                // Show comparison panel
                const comparisonPanel = document.getElementById('comparison-panel');
                comparisonPanel.classList.remove('hidden');
                
                // Animate panel appearance
                anime({
                    targets: comparisonPanel,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 600,
                    easing: 'easeOutQuart'
                });
                
                // Update improvement percentage
                document.getElementById('improvement-percentage').textContent = `${response.improvement_percentage}%`;
                
                // Update quality scores
                this.currentScores = {
                    clarity: response.quality_scores.clarity,
                    specificity: response.quality_scores.specificity,
                    creativity: response.quality_scores.creativity,
                    technical: response.quality_scores.technical
                };
                this.updateQualityScores(this.currentScores);
                
                // Reset button
                optimizeBtn.textContent = originalText;
                optimizeBtn.disabled = false;
                
                // Add to history
                this.optimizationHistory.push({
                    original: response.original_prompt,
                    optimized: response.optimized_prompt,
                    mode: this.currentMode,
                    scores: this.currentScores,
                    timestamp: new Date()
                });
                
                // Add assistant message
                this.addAssistantMessage(`✨ I've optimized your prompt! The new version is ${response.improvement_percentage}% more effective. Check the comparison panel below.`, 'success');
                
                // Scroll to comparison
                comparisonPanel.scrollIntoView({ behavior: 'smooth' });
            })
            .catch(error => {
                this.addAssistantMessage(`⚠️ Optimization failed: ${error.message}. Using fallback optimization.`, 'warning');
                
                // Fallback to client-side optimization
                const optimizedPrompt = this.generateOptimizedPrompt(originalPrompt);
                
                document.getElementById('original-prompt').textContent = originalPrompt;
                document.getElementById('optimized-prompt').textContent = optimizedPrompt;
                
                const comparisonPanel = document.getElementById('comparison-panel');
                comparisonPanel.classList.remove('hidden');
                
                const improvement = Math.round(Math.random() * 30 + 20);
                document.getElementById('improvement-percentage').textContent = `${improvement}%`;
                
                optimizeBtn.textContent = originalText;
                optimizeBtn.disabled = false;
                
                comparisonPanel.scrollIntoView({ behavior: 'smooth' });
            });
    }
    
    generateOptimizedPrompt(original) {
        // Get advanced options
        const includeTests = document.getElementById('include-tests')?.checked;
        const addDocumentation = document.getElementById('add-documentation')?.checked;
        const performanceOptimization = document.getElementById('performance-optimization')?.checked;
        const securityFeatures = document.getElementById('security-features')?.checked;
        
        // Simulate prompt optimization based on mode and options
        let baseOptimization = '';
        
        switch (this.currentMode) {
            case 'ai-dev':
                baseOptimization = `Please create a comprehensive solution for the following technical requirement: ${original}. Include detailed implementation steps`;
                if (includeTests) baseOptimization += ', comprehensive unit tests';
                if (addDocumentation) baseOptimization += ', complete documentation with examples';
                if (performanceOptimization) baseOptimization += ', performance optimizations and scalability considerations';
                if (securityFeatures) baseOptimization += ', security best practices and input validation';
                baseOptimization += '. Make it production-ready with proper error handling and logging.';
                break;
                
            case 'image-gen':
                baseOptimization = `Create a stunning visual artwork with the following specifications: ${original}. Use professional lighting techniques`;
                baseOptimization += ', artistic composition principles, and high-quality rendering. Include specific details about atmosphere, mood, and visual style.';
                break;
                
            case 'chatbot':
                baseOptimization = `You are an intelligent AI assistant. Your task is to: ${original}. Please maintain a consistent personality`;
                baseOptimization += ', provide helpful and accurate responses, and engage in natural conversation. Be empathetic and professional.';
                break;
                
            case 'data-analysis':
                baseOptimization = `Conduct a thorough data analysis for: ${original}. Use appropriate statistical methods`;
                baseOptimization += ', create meaningful visualizations, and provide actionable insights. Include data validation steps and explain your methodology clearly.';
                break;
                
            default:
                baseOptimization = original;
        }
        
        return baseOptimization;
    }
    
    showExampleDocument() {
        // Simulate example document processing
        const exampleContent = {
            title: "Student Management System Specification",
            keywords: ["authentication", "user management", "dashboard", "CRUD operations", "database", "API integration", "role-based access", "reporting"],
            summary: "A comprehensive student management system with user authentication, role-based access control, and administrative dashboard."
        };
        
        // Show example processing
        const uploadArea = document.getElementById('upload-area');
        uploadArea.innerHTML = `
            <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
                <p class="text-gray-600 mb-4">Processing example document...</p>
                <div class="bg-blue-50 rounded-lg p-4 text-left">
                    <h4 class="font-medium text-blue-900 mb-2">Example: ${exampleContent.title}</h4>
                    <p class="text-sm text-blue-700 mb-3">${exampleContent.summary}</p>
                    <div class="text-xs text-blue-600">
                        <strong>Extracted Keywords:</strong> ${exampleContent.keywords.join(', ')}
                    </div>
                </div>
            </div>
        `;
        
        // Simulate processing delay
        setTimeout(() => {
            this.showProcessedKeywords(exampleContent.keywords, 'example-document.pdf');
        }, 2000);
    }
    
    showProcessedKeywords(keywords, filename) {
        // Show extracted keywords
        const keywordsContainer = document.getElementById('keywords-container');
        const keywordsDiv = document.getElementById('keywords');
        
        keywordsDiv.innerHTML = keywords.map(keyword => `
            <span class="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm cursor-pointer hover:bg-teal-200 transition-colors animate-pulse" onclick="promptEngine.addKeywordToPrompt('${keyword}')">
                ${keyword}
            </span>
        `).join('');
        
        keywordsContainer.classList.remove('hidden');
        
        // Update upload area with success message
        const uploadArea = document.getElementById('upload-area');
        uploadArea.innerHTML = `
            <div class="text-center">
                <svg class="w-12 h-12 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 class="text-lg font-semibold text-gray-800 mb-2">Example Document Processed!</h3>
                <p class="text-gray-600 mb-3">Found ${keywords.length} relevant keywords from "${filename}"</p>
                <div class="bg-green-50 rounded-lg p-4 mb-4">
                    <p class="text-sm text-green-700 mb-2">
                        <strong>💡 Pro Tip:</strong> Click on any keyword above to automatically add it to your prompt!
                    </p>
                </div>
                <button onclick="document.getElementById('file-input').click()" class="text-orange-600 hover:text-orange-700 text-sm font-medium">
                    Upload Your Own Document
                </button>
            </div>
        `;
        
        // Add assistant message
        this.addAssistantMessage(`📄 I've processed the example document and found ${keywords.length} key terms! Try clicking on the keywords above to add them to your prompt.`, 'info');
        
        // Animate keywords appearance
        anime({
            targets: '#keywords span',
            scale: [0, 1],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 500,
            easing: 'easeOutQuart'
        });
    }
    
    showComparison() {
        const comparisonPanel = document.getElementById('comparison-panel');
        if (comparisonPanel.classList.contains('hidden')) {
            this.addAssistantMessage('Optimize a prompt first to see the comparison panel!', 'info');
        } else {
            comparisonPanel.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    selectModel(model) {
        // Update active tab
        document.querySelectorAll('.model-tab').forEach(tab => {
            tab.classList.remove('bg-orange-100', 'text-orange-700');
            tab.classList.add('text-gray-600', 'hover:bg-gray-100');
        });
        
        const activeTab = document.querySelector(`[data-model="${model}"]`);
        activeTab.classList.add('bg-orange-100', 'text-orange-700');
        activeTab.classList.remove('text-gray-600', 'hover:bg-gray-100');
        
        // Simulate different model outputs
        this.updateModelComparison(model);
    }
    
    updateModelComparison(model) {
        const optimizedPrompt = document.getElementById('optimized-prompt').textContent;
        if (!optimizedPrompt) return;
        const modelVariations = {
            'gpt-4': optimizedPrompt,
            'claude': optimizedPrompt.replace(/comprehensive/g, 'detailed').replace(/stunning/g, 'elegant'),
            'gemini': optimizedPrompt.replace(/comprehensive/g, 'complete').replace(/stunning/g, 'impressive')
        };

        document.getElementById('optimized-prompt').textContent = modelVariations[model] || optimizedPrompt;
    }
    
    sendAssistantMessage() {
        const input = document.getElementById('assistant-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addAssistantMessage(message, 'user');
        input.value = '';
        
        // Call backend API for assistant response
        const payload = {
            user_message: message,
            prompt_context: this.currentMode
        };
        
        apiClient.post('/assistant', payload)
            .then(response => {
                this.addAssistantMessage(response.assistant_response, 'ai');
            })
            .catch(error => {
                console.warn('API assistant failed, using fallback');
                // Fallback to client-side response
                setTimeout(() => {
                    const response = this.generateAssistantResponse(message);
                    this.addAssistantMessage(response, 'ai');
                }, 500);
            });
    }
    
    addAssistantMessage(message, type = 'ai') {
        const messagesContainer = document.getElementById('assistant-messages');
        if (!messagesContainer) {
            // If assistant UI was removed, fallback to console and return
            console.log('[assistant]', type, message);
            return;
        }
        const messageDiv = document.createElement('div');
        
        const className = type === 'user' ? 'text-right text-blue-600' : 
                         type === 'suggestion' ? 'text-orange-600 italic' :
                         type === 'success' ? 'text-green-600' :
                         type === 'warning' ? 'text-red-600' :
                         type === 'info' ? 'text-teal-600' : 'text-gray-600';
        
        messageDiv.className = `text-sm ${className}`;
        messageDiv.textContent = message;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Animate message appearance
        anime({
            targets: messageDiv,
            opacity: [0, 1],
            translateY: [10, 0],
            duration: 300,
            easing: 'easeOutQuart'
        });
    }

    
    
    generateAssistantResponse(message) {
        const responses = [
            "That's a great question! Let me explain how prompt optimization works...",
            "I can help you improve that prompt by adding more specific details and context.",
            "Based on your current mode, I'd recommend focusing on technical specifications.",
            "Have you considered adding examples or constraints to make the prompt more precise?",
            "The quality scores are calculated based on linguistic analysis and prompt engineering best practices.",
            "You can improve the clarity score by using more specific action verbs and clear instructions.",
            "Try using the PREP framework: Purpose, Role, Examples, Parameters for better results.",
            "Consider adding performance requirements or optimization goals to your prompt.",
            "For full-stack applications, include details about frontend, backend, and database requirements."
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }
}

// Initialize the application
const promptEngine = new PromptEngine();

// Global functions for HTML onclick handlers
function scrollToOptimizer() {
    promptEngine.scrollToOptimizer();
}

// Add showExampleDocument to global scope
window.promptEngine = promptEngine;