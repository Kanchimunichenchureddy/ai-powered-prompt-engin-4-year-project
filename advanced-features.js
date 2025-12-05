// Advanced Prompt Engineering Features Handler
// Handles Chain-of-Thought, Expert Persona, and Few-Shot Learning toggles
// NOW WITH AUTHENTICATION-BASED VISIBILITY

document.addEventListener('DOMContentLoaded', function () {
    // Wait a moment for auth manager to initialize
    setTimeout(() => {
        initializeAdvancedFeatures();
    }, 500);
});

function setCheckboxesDisabledState(disabled) {
    const cotCheckbox = document.getElementById('use-chain-of-thought');
    const personaCheckbox = document.getElementById('use-expert-persona');
    const fewShotCheckbox = document.getElementById('show-few-shot-examples');

    if (cotCheckbox) cotCheckbox.disabled = disabled;
    if (personaCheckbox) personaCheckbox.disabled = disabled;
    if (fewShotCheckbox) fewShotCheckbox.disabled = disabled;
}

function initializeAdvancedFeatures() {
    const advancedPanel = document.querySelector('#advanced-options');

    if (!advancedPanel) {
        console.warn('Advanced features panel not found');
        return;
    }

    // Check authentication status
    const isAuthenticated = window.authManager?.isAuthenticated || false;

    console.log('🔐 Auth status:', isAuthenticated);
    console.log('📍 Advanced Panel:', advancedPanel ? 'Found' : 'Not found');

    if (isAuthenticated) {
        // Show panel - User is signed in
        advancedPanel.classList.remove('hidden');
        console.log('✅ User authenticated - Showing Advanced Prompt Engineering features');
        setupAuthenticatedFeatures();
        setCheckboxesDisabledState(false); // Enable checkboxes
    } else {
        // Hide panel - User not signed in
        advancedPanel.classList.add('hidden');
        console.log('🔒 User not authenticated - Hiding Advanced Prompt Engineering features');
        setCheckboxesDisabledState(true); // Disable checkboxes
    }
}

function setupAuthenticatedFeatures() {
    console.log('✅ User authenticated - Enabling advanced features');

    // Update header with PRO badge
    const header = document.querySelector('#advanced-options').closest('.mt-6.p-4');
    if (header) {
        const headerTitle = header.querySelector('h4');
        if (headerTitle && !headerTitle.querySelector('.pro-badge')) {
            headerTitle.innerHTML = `
                <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Advanced Prompt Engineering
                <span class="pro-badge ml-2 px-2 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs rounded-full font-semibold">⭐ PRO</span>
            `;
        }
    }

    // Enable toggle functionality
    const toggleAdvancedBtn = document.getElementById('toggle-advanced');
    const advancedOptions = document.getElementById('advanced-options');
    const toggleText = document.getElementById('toggle-text');

    if (toggleAdvancedBtn && advancedOptions) {
        toggleAdvancedBtn.addEventListener('click', function () {
            const isHidden = advancedOptions.classList.contains('hidden');

            if (isHidden) {
                advancedOptions.classList.remove('hidden');
                toggleText.textContent = 'Hide Options';
            } else {
                advancedOptions.classList.add('hidden');
                toggleText.textContent = 'Show Options';
            }
        });
    }

    // Get checkbox elements
    const cotCheckbox = document.getElementById('use-chain-of-thought');
    const personaCheckbox = document.getElementById('use-expert-persona');
    const fewShotCheckbox = document.getElementById('show-few-shot-examples');

    // Store advanced options state
    window.promptEngineeringOptions = {
        use_chain_of_thought: false,
        use_expert_persona: false,
        show_few_shot_examples: false
    };

    // Update options when checkboxes change
    if (cotCheckbox) {
        // cotCheckbox.disabled = false; // This line is now handled by setCheckboxesDisabledState
        cotCheckbox.addEventListener('change', function () {
            window.promptEngineeringOptions.use_chain_of_thought = this.checked;
            console.log('Chain-of-Thought:', this.checked);
        });
    }

    if (personaCheckbox) {
        // personaCheckbox.disabled = false; // This line is now handled by setCheckboxesDisabledState
        personaCheckbox.addEventListener('change', function () {
            window.promptEngineeringOptions.use_expert_persona = this.checked;
            console.log('Expert Persona:', this.checked);
        });
    }

    if (fewShotCheckbox) {
        // fewShotCheckbox.disabled = false; // This line is now handled by setCheckboxesDisabledState
        fewShotCheckbox.addEventListener('change', function () {
            window.promptEngineeringOptions.show_few_shot_examples = this.checked;
            console.log('Few-Shot Examples:', this.checked);

            if (this.checked) {
                showFewShotExamples();
            } else {
                hideFewShotExamples();
            }
        });
    }
}


// Update the updateQualityScoresEnhanced function to handle new metrics
window.updateQualityScoresEnhanced = function (scores) {
    // Original metrics
    const metrics = ['clarity', 'specificity', 'creativity', 'technical'];

    metrics.forEach(metric => {
        const scoreEl = document.getElementById(`${metric}-score`);
        const barEl = document.getElementById(`${metric}-bar`);

        if (scoreEl && barEl && scores[metric] !== undefined) {
            scoreEl.textContent = scores[metric].toFixed(1);
            barEl.style.width = `${(scores[metric] / 10) * 100}%`;
        }
    });

    // NEW: Enhanced metrics
    const newMetrics = [
        'context_richness',
        'constraint_clarity',
        'output_specification'
    ];

    newMetrics.forEach(metric => {
        const scoreEl = document.getElementById(`${metric.replace('_', '-')}-score`);
        const barEl = document.getElementById(`${metric.replace('_', '-')}-bar`);

        if (scoreEl && barEl && scores[metric] !== undefined) {
            scoreEl.textContent = scores[metric].toFixed(1);
            barEl.style.width = `${(scores[metric] / 10) * 100}%`;
        }
    });

    // Overall score
    const overallScoreEl = document.getElementById('overall-score');
    if (overallScoreEl && scores.overall !== undefined) {
        overallScoreEl.textContent = scores.overall.toFixed(1);
    }

    const overallBarEl = document.getElementById('overall-bar');
    if (overallBarEl && scores.overall !== undefined) {
        overallBarEl.style.width = `${(scores.overall / 10) * 100}%`;
    }
};

// Few-Shot Examples Display Functions
function showFewShotExamples() {
    let examplesPanel = document.getElementById('few-shot-examples-panel');

    if (!examplesPanel) {
        examplesPanel = createFewShotPanel();
        const comparisonPanel = document.querySelector('.comparison-panel');
        if (comparisonPanel) {
            comparisonPanel.parentNode.insertBefore(examplesPanel, comparisonPanel);
        }
    } else {
        examplesPanel.classList.remove('hidden');
    }

    const currentMode = document.querySelector('.mode-card.active')?.dataset.mode || 'ai-dev';
    fetchFewShotExamples(currentMode);
}

function hideFewShotExamples() {
    const examplesPanel = document.getElementById('few-shot-examples-panel');
    if (examplesPanel) {
        examplesPanel.classList.add('hidden');
    }
}

function createFewShotPanel() {
    const panel = document.createElement('div');
    panel.id = 'few-shot-examples-panel';
    panel.className = 'bg-white rounded-xl p-6 mb-6';
    panel.innerHTML = `
        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span class="text-2xl mr-2">📚</span>
            Few-Shot Learning Examples
        </h3>
        <div id="few-shot-examples-content" class="space-y-4">
            <div class="text-center text-gray-500">Loading examples...</div>
        </div>
    `;
    return panel;
}

function fetchFewShotExamples(mode) {
    const content = document.getElementById('few-shot-examples-content');
    if (content) {
        content.innerHTML = `
            <div class="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p class="text-sm text-blue-800">
                    <strong>💡 Tip:</strong> Few-shot examples for <strong>${mode}</strong> mode
                    show you how to transform basic prompts into professional ones.
                </p>
            </div>
            <div class="text-sm text-gray-600">
                <p>Example transformations will be displayed here based on backend integration.</p>
                <p class="mt-2">Check <code>PROMPT_ENGINEERING_FEATURES.md</code> for documentation.</p>
            </div>
        `;
    }
}

// Export for use in main.js
window.PromptEngineeringFeatures = {
    getOptions: function () {
        return window.promptEngineeringOptions || {};
    },
    isLocked: function () {
        return !(window.authManager?.isAuthenticated || false);
    }
};

console.log('✅ Advanced Prompt Engineering Features loaded with authentication control');
