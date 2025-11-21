// Enhanced Mode Selection System for PromptEngine
class ModeSelector {
    constructor() {
        this.selectedMode = null;
        this.modeConfigurations = {
            'ai-dev': {
                title: '🚀 AI Development',
                description: 'Code generation, debugging, and software development',
                icon: '💻',
                color: 'from-blue-500 to-purple-600',
                promptFormat: {
                    structure: 'Technical Specification',
                    requirements: [
                        'Programming language specification',
                        'Functional requirements',
                        'Error handling requirements',
                        'Performance criteria',
                        'Code quality standards'
                    ],
                    examples: [
                        'Create a Python REST API with authentication',
                        'Build a React component with TypeScript',
                        'Implement database schema with migrations'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.3,
                    maxTokens: 2048,
                    systemPrompt: 'You are an expert software developer. Provide clean, well-documented, production-ready code with best practices.'
                }
            },
            'content-writing': {
                title: '✍️ Content Writing',
                description: 'Blog posts, articles, and creative writing',
                icon: '📝',
                color: 'from-green-500 to-teal-600',
                promptFormat: {
                    structure: 'Content Brief',
                    requirements: [
                        'Target audience definition',
                        'Tone and style preferences',
                        'Content length and format',
                        'Key messages and objectives',
                        'SEO keywords (if applicable)'
                    ],
                    examples: [
                        'Write a technical blog post about AI trends',
                        'Create engaging social media content',
                        'Draft a professional email campaign'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.7,
                    maxTokens: 3072,
                    systemPrompt: 'You are a skilled content writer. Create engaging, well-structured content that resonates with the target audience.'
                }
            },
            'image-generation': {
                title: '🎨 Image Generation',
                description: 'AI art, graphics, and visual content creation',
                icon: '🖼️',
                color: 'from-pink-500 to-rose-600',
                promptFormat: {
                    structure: 'Visual Description',
                    requirements: [
                        'Subject and composition',
                        'Artistic style and medium',
                        'Lighting and atmosphere',
                        'Color palette preferences',
                        'Technical specifications'
                    ],
                    examples: [
                        'A serene mountain landscape at golden hour',
                        'Futuristic cityscape in cyberpunk style',
                        'Portrait in Renaissance painting style'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.8,
                    maxTokens: 1024,
                    systemPrompt: 'You are an expert in visual arts and image generation. Provide detailed, artistic descriptions optimized for AI image generation.'
                }
            },
            'business-analysis': {
                title: '📊 Business Analysis',
                description: 'Data analysis, reports, and business insights',
                icon: '📈',
                color: 'from-orange-500 to-red-600',
                promptFormat: {
                    structure: 'Analysis Framework',
                    requirements: [
                        'Data sources and scope',
                        'Analysis objectives',
                        'Key metrics and KPIs',
                        'Reporting format',
                        'Actionable recommendations'
                    ],
                    examples: [
                        'Analyze quarterly sales performance',
                        'Create market trend analysis',
                        'Generate customer segmentation report'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.2,
                    maxTokens: 2560,
                    systemPrompt: 'You are a business analyst expert. Provide data-driven insights with clear recommendations and professional reporting.'
                }
            },
            'chatbot-training': {
                title: '🤖 Chatbot Training',
                description: 'Conversational AI and chatbot development',
                icon: '💬',
                color: 'from-indigo-500 to-blue-600',
                promptFormat: {
                    structure: 'Conversation Design',
                    requirements: [
                        'Bot personality and tone',
                        'Conversation scenarios',
                        'Response patterns',
                        'Error handling flows',
                        'Integration requirements'
                    ],
                    examples: [
                        'Customer service chatbot for e-commerce',
                        'Educational assistant for online learning',
                        'Healthcare support bot with empathy'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.5,
                    maxTokens: 2048,
                    systemPrompt: 'You are a conversational AI expert. Design natural, helpful chatbot interactions with appropriate personality and context awareness.'
                }
            },
            'auto-detect': {
                title: '🤖 Auto-Detect Mode',
                description: 'AI automatically detects the best mode for your prompt',
                icon: '🧠',
                color: 'from-gradient-to-r from-purple-400 via-pink-500 to-red-500',
                promptFormat: {
                    structure: 'Smart Detection',
                    requirements: [
                        'Clear description of your goal',
                        'Specific context or domain',
                        'Expected output type',
                        'Any special requirements'
                    ],
                    examples: [
                        'I need help building a login system',
                        'Create a logo for my startup',
                        'Analyze our sales data trends',
                        'Write content for our website'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.4,
                    maxTokens: 2048,
                    systemPrompt: 'You are an AI assistant that can automatically detect the best approach for any request and provide specialized assistance.'
                }
            },
            'research-academic': {
                title: '🔬 Research & Academic',
                description: 'Scientific research, academic papers, and analysis',
                icon: '📚',
                color: 'from-purple-500 to-indigo-600',
                promptFormat: {
                    structure: 'Research Framework',
                    requirements: [
                        'Research question or hypothesis',
                        'Methodology and approach',
                        'Literature review scope',
                        'Data requirements',
                        'Citation and formatting standards'
                    ],
                    examples: [
                        'Literature review on machine learning ethics',
                        'Research proposal for climate change study',
                        'Academic paper on quantum computing advances'
                    ]
                },
                geminiSettings: {
                    model: 'gemini-1.5-pro',
                    temperature: 0.3,
                    maxTokens: 4096,
                    systemPrompt: 'You are an academic researcher and writer. Provide scholarly, well-researched content with proper citations and academic rigor.'
                }
            }
        };
        this.init();
    }

    init() {
        this.createModeSelectionInterface();
        this.setupEventListeners();
    }

    createModeSelectionInterface() {
        // Create mode selection modal
        const modalHTML = `
            <div id="mode-selection-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 transition-opacity duration-300">
                <div class="bg-white rounded-2xl p-8 max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-bold text-gray-800 mb-2">Choose Your Working Mode</h2>
                        <p class="text-gray-600">Select the mode that best fits your task to get optimized prompt formatting and AI assistance</p>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        ${this.generateModeCards()}
                    </div>
                    
                    <div id="mode-preview" class="hidden bg-gray-50 rounded-xl p-6 mb-6">
                        <h3 class="text-xl font-semibold mb-4">Mode Preview</h3>
                        <div id="mode-preview-content"></div>
                    </div>
                    
                    <div class="flex justify-between items-center">
                        <button id="mode-help-btn" class="text-gray-600 hover:text-gray-800 text-sm">
                            📖 Learn more about modes
                        </button>
                        <div class="space-x-4">
                            <button id="mode-cancel-btn" class="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium">
                                Cancel
                            </button>
                            <button id="mode-confirm-btn" class="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
                                Continue with Selected Mode
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    generateModeCards() {
        return Object.entries(this.modeConfigurations).map(([key, config]) => `
            <div class="mode-selection-card group cursor-pointer transform transition-all duration-300 hover:scale-105" data-mode="${key}">
                <div class="bg-gradient-to-br ${config.color} p-6 rounded-xl text-white h-full relative overflow-hidden">
                    <div class="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
                    <div class="relative z-10">
                        <div class="text-4xl mb-3">${config.icon}</div>
                        <h3 class="text-xl font-bold mb-2">${config.title}</h3>
                        <p class="text-sm opacity-90 mb-4">${config.description}</p>
                        <div class="text-xs opacity-80">
                            <div class="flex items-center mb-1">
                                <span class="w-2 h-2 bg-white rounded-full mr-2"></span>
                                ${config.promptFormat.requirements.length} optimized requirements
                            </div>
                            <div class="flex items-center">
                                <span class="w-2 h-2 bg-white rounded-full mr-2"></span>
                                AI model: ${config.geminiSettings.model}
                            </div>
                        </div>
                    </div>
                    <div class="absolute bottom-0 left-0 w-full h-1 bg-white bg-opacity-30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                </div>
            </div>
        `).join('');
    }

    setupEventListeners() {
        // Mode card selection
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.mode-selection-card');
            if (card) {
                this.selectModeCard(card);
            }
        });

        // Confirm button
        document.getElementById('mode-confirm-btn').addEventListener('click', () => {
            this.confirmModeSelection();
        });

        // Cancel button
        document.getElementById('mode-cancel-btn').addEventListener('click', () => {
            this.hideModeSelection();
        });

        // Help button
        document.getElementById('mode-help-btn').addEventListener('click', () => {
            this.showModeHelp();
        });

        // Close modal on outside click
        document.getElementById('mode-selection-modal').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.hideModeSelection();
            }
        });
    }

    selectModeCard(card) {
        // Remove active state from all cards
        document.querySelectorAll('.mode-selection-card').forEach(c => {
            c.classList.remove('ring-4', 'ring-white', 'ring-opacity-50');
        });

        // Add active state to selected card
        card.classList.add('ring-4', 'ring-white', 'ring-opacity-50');

        // Update selected mode
        this.selectedMode = card.dataset.mode;

        // Show preview
        this.showModePreview(this.selectedMode);

        // Enable confirm button
        document.getElementById('mode-confirm-btn').disabled = false;
    }

    showModePreview(modeKey) {
        const config = this.modeConfigurations[modeKey];
        const previewContent = document.getElementById('mode-preview-content');

        previewContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">🎯 Prompt Structure: ${config.promptFormat.structure}</h4>
                    <ul class="space-y-2 mb-4">
                        ${config.promptFormat.requirements.map(req => `
                            <li class="flex items-start space-x-2">
                                <span class="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></span>
                                <span class="text-sm text-gray-700">${req}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-800 mb-3">💡 Example Prompts</h4>
                    <div class="space-y-3">
                        ${config.promptFormat.examples.map(example => `
                            <div class="bg-white p-3 rounded-lg border border-gray-200">
                                <p class="text-sm text-gray-600">"${example}"</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-6 bg-blue-50 rounded-lg p-4">
                <h4 class="font-semibold text-blue-800 mb-2">🤖 AI Configuration</h4>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span class="text-blue-600 font-medium">Model:</span>
                        <span class="text-blue-800">${config.geminiSettings.model}</span>
                    </div>
                    <div>
                        <span class="text-blue-600 font-medium">Creativity:</span>
                        <span class="text-blue-800">${config.geminiSettings.temperature}</span>
                    </div>
                    <div>
                        <span class="text-blue-600 font-medium">Max Length:</span>
                        <span class="text-blue-800">${config.geminiSettings.maxTokens}</span>
                    </div>
                    <div>
                        <span class="text-blue-600 font-medium">Optimization:</span>
                        <span class="text-blue-800">Enhanced</span>
                    </div>
                </div>
                <p class="text-xs text-blue-700 mt-2">${config.geminiSettings.systemPrompt}</p>
            </div>
        `;

        document.getElementById('mode-preview').classList.remove('hidden');
    }

    confirmModeSelection() {
        if (!this.selectedMode) return;

        const config = this.modeConfigurations[this.selectedMode];
        
        // Store selected mode in session
        sessionStorage.setItem('promptengine_mode', this.selectedMode);
        sessionStorage.setItem('promptengine_mode_config', JSON.stringify(config));

        // Update the main interface
        this.updateMainInterface(config);

        // Hide mode selection
        this.hideModeSelection();

        // Show welcome message for selected mode
        this.showModeWelcome(config);

        // Update backend mode configuration
        this.updateBackendMode();
    }

    updateMainInterface(config) {
        // Update page title and description
        const heroTitle = document.querySelector('.hero h1');
        if (heroTitle) {
            heroTitle.innerHTML = `${config.icon} ${config.title}<br><span class="text-orange-400">PromptEngine</span>`;
        }

        // Update prompt input placeholder
        const promptInput = document.getElementById('prompt-input');
        if (promptInput) {
            promptInput.placeholder = `${config.promptFormat.structure}: ${config.promptFormat.examples[0]}`;
        }

        // Show mode-specific UI elements
        this.showModeSpecificUI(config);

        // Update global mode reference
        if (window.promptEngine) {
            window.promptEngine.currentMode = this.selectedMode;
        }
    }

    showModeSpecificUI(config) {
        // Create mode indicator
        const modeIndicator = document.createElement('div');
        modeIndicator.id = 'mode-indicator';
        modeIndicator.className = 'fixed top-20 left-6 bg-white rounded-xl shadow-lg p-4 z-40 border border-gray-200';
        modeIndicator.innerHTML = `
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gradient-to-br ${config.color} rounded-lg flex items-center justify-center text-white text-xl">
                    ${config.icon}
                </div>
                <div>
                    <div class="font-semibold text-gray-800 text-sm">${config.title}</div>
                    <div class="text-xs text-gray-600">${config.description}</div>
                    <button onclick="modeSelector.showModeSelection()" class="text-xs text-orange-600 hover:text-orange-700 mt-1">
                        Change Mode
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modeIndicator);

        // Create mode-specific prompt helper
        this.createPromptHelper(config);
    }

    createPromptHelper(config) {
        const helperHTML = `
            <div id="prompt-helper" class="bg-white rounded-xl p-6 mt-6 border border-gray-200">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">📋 ${config.promptFormat.structure} Guide</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Required Elements:</h4>
                        <div class="space-y-2">
                            ${config.promptFormat.requirements.map((req, index) => `
                                <div class="flex items-center space-x-2">
                                    <input type="checkbox" id="req-${index}" class="rounded text-orange-600">
                                    <label for="req-${index}" class="text-sm text-gray-600 cursor-pointer">${req}</label>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-700 mb-3">Quick Templates:</h4>
                        <div class="space-y-2">
                            ${config.promptFormat.examples.map((example, index) => `
                                <button class="w-full text-left p-2 bg-gray-50 hover:bg-gray-100 rounded text-xs text-gray-700 transition-colors" onclick="modeSelector.useTemplate('${example.replace(/'/g, "\\'")}')">
                                    Template ${index + 1}: ${example.substring(0, 40)}...
                                </button>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        const optimizerSection = document.getElementById('optimizer');
        if (optimizerSection) {
            optimizerSection.insertAdjacentHTML('afterbegin', helperHTML);
        }
    }

    useTemplate(template) {
        const promptInput = document.getElementById('prompt-input');
        if (promptInput) {
            promptInput.value = template;
            promptInput.focus();
            
            // Trigger analysis if available
            if (window.promptEngine) {
                window.promptEngine.updateWordCount();
                window.promptEngine.analyzePromptQuality();
            }
        }
    }

    async updateBackendMode() {
        try {
            await fetch(`${API_BASE_URL}/set-mode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: this.selectedMode,
                    config: this.modeConfigurations[this.selectedMode]
                })
            });
        } catch (error) {
            console.warn('Failed to update backend mode:', error);
        }
    }

    showModeWelcome(config) {
        const welcomeToast = document.createElement('div');
        welcomeToast.className = 'fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg z-50 max-w-md transform translate-y-full transition-transform duration-300';
        welcomeToast.innerHTML = `
            <div class="flex items-start space-x-3">
                <div class="text-2xl">${config.icon}</div>
                <div class="flex-1">
                    <div class="font-semibold">Mode Selected: ${config.title}</div>
                    <div class="text-sm text-green-100 mt-1">${config.description}</div>
                    <div class="text-xs text-green-200 mt-2">✨ Your prompts will now be optimized for this specific use case</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" class="text-green-200 hover:text-white">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        document.body.appendChild(welcomeToast);

        setTimeout(() => welcomeToast.style.transform = 'translateY(0)', 100);
        setTimeout(() => {
            welcomeToast.style.transform = 'translateY(full)';
            setTimeout(() => welcomeToast.remove(), 300);
        }, 5000);
    }

    showModeSelection() {
        document.getElementById('mode-selection-modal').style.display = 'flex';
        setTimeout(() => {
            document.getElementById('mode-selection-modal').style.opacity = '1';
        }, 10);
    }

    hideModeSelection() {
        const modal = document.getElementById('mode-selection-modal');
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    showModeHelp() {
        alert('Mode Help:\n\n• AI Development: Best for code generation, debugging, and technical tasks\n• Content Writing: Optimized for blogs, articles, and creative content\n• Image Generation: Perfect for AI art and visual creation prompts\n• Business Analysis: Ideal for data analysis and business insights\n• Chatbot Training: Specialized for conversational AI development\n• Research & Academic: Designed for scholarly and research work');
    }

    // Check if user should see mode selection on page load
    checkModeOnLoad() {
        const storedMode = sessionStorage.getItem('promptengine_mode');
        
        if (!storedMode) {
            // Show mode selection for new sessions
            setTimeout(() => this.showModeSelection(), 1000);
        } else {
            // Restore previous mode
            this.selectedMode = storedMode;
            const config = JSON.parse(sessionStorage.getItem('promptengine_mode_config'));
            this.updateMainInterface(config);
            this.showModeSpecificUI(config);
        }
    }

    getCurrentMode() {
        return this.selectedMode;
    }

    getModeConfiguration() {
        return this.selectedMode ? this.modeConfigurations[this.selectedMode] : null;
    }
}

// Initialize mode selector
const modeSelector = new ModeSelector();

// Check mode on page load
document.addEventListener('DOMContentLoaded', () => {
    modeSelector.checkModeOnLoad();
});

// Make globally available
window.modeSelector = modeSelector;