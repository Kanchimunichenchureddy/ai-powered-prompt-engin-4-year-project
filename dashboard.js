class Dashboard {
    constructor(user) {
        this.user = user;
        this.container = document.getElementById('dashboard-container');
        this.init();
    }

    async init() {
        if (!this.container) return;

        const response = await fetch('dashboard.html');
        const html = await response.text();
        this.container.innerHTML = html;

        this.loadUserStatistics();
        this.loadRecentProjects();
    }

    loadUserStatistics() {
        const stats = this.getUserStatsFromLocalStorage(this.user.id);
        
        const promptsCount = document.getElementById('prompts-count');
        if (promptsCount) promptsCount.textContent = stats.promptsCreated;

        const templatesCount = document.getElementById('templates-count');
        if (templatesCount) templatesCount.textContent = stats.templatesUsed;

        const successRate = document.getElementById('success-rate');
        if (successRate) successRate.textContent = `${stats.successRate}%`;
    }

    loadRecentProjects() {
        const recentProjects = this.getRecentProjectsFromLocalStorage(this.user.id);
        const recentProjectsContainer = document.getElementById('recent-projects');
        
        if (recentProjectsContainer) {
            if (recentProjects.length === 0) {
                recentProjectsContainer.innerHTML = `
                    <div class="text-blue-600 text-sm">
                        No recent projects yet. 
                        <button onclick="dashboard.createNewPrompt('ai-dev')" class="underline">Create your first prompt!</button>
                    </div>
                `;
            } else {
                recentProjectsContainer.innerHTML = recentProjects.map(project => `
                    <div class="bg-white rounded p-2 text-sm">
                        <div class="font-medium text-blue-800">${project.title}</div>
                        <div class="text-blue-600 text-xs">${project.mode} • ${project.date}</div>
                    </div>
                `).join('');
            }
        }
    }

    createNewPrompt(mode) {
        if (window.promptEngine && typeof window.promptEngine.selectMode === 'function') {
            const modeCard = document.querySelector(`.mode-card[data-mode="${mode}"]`);
            if (modeCard) {
                window.promptEngine.selectMode(modeCard);
            } else {
                window.promptEngine.currentMode = mode;
                window.promptEngine.updateInterfaceForMode();
            }
            
            const promptInput = document.getElementById('prompt-input');
            if (promptInput) {
                promptInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                promptInput.focus();
            }
        } else {
            window.location.href = `index.html?mode=${mode}`;
        }
    }

    showDetailedStats() {
        window.location.href = 'analytics.html';
    }

    getUserStatsFromLocalStorage(userId) {
        let stats = JSON.parse(localStorage.getItem(`user_stats_${userId}`));
        if (!stats) {
            stats = {
                promptsCreated: Math.floor(Math.random() * 50) + 10,
                templatesUsed: Math.floor(Math.random() * 15) + 3,
                successRate: Math.floor(Math.random() * 20) + 75,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem(`user_stats_${userId}`, JSON.stringify(stats));
        }
        return stats;
    }

    getRecentProjectsFromLocalStorage(userId) {
        let projects = JSON.parse(localStorage.getItem(`recent_projects_${userId}`));
        if (!projects) {
            projects = [
                { title: 'Customer Service Bot v2', mode: 'chatbot', date: '2 days ago' },
                { title: 'Q3 Sales Analysis', mode: 'data-analysis', date: '1 week ago' },
                { title: 'Image Generation Prompt', mode: 'image-gen', date: '3 days ago' },
                { title: 'AI Dev Helper Script', mode: 'ai-dev', date: '4 days ago' }
            ];
            localStorage.setItem(`recent_projects_${userId}`, JSON.stringify(projects));
        }
        return projects;
    }
}
