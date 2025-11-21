// History Page JavaScript - Full Functionality
class HistoryManager {
    constructor() {
        this.historyData = [];
        this.filteredData = [];
        this.currentFilter = 'all';
        this.sortBy = 'date';
        this.sortOrder = 'desc';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    init() {
        this.loadHistoryData();
        this.setupEventListeners();
        this.setupFilters();
        this.setupPagination();
        this.renderHistory();
        this.setupSearch();
    }

    loadHistoryData() {
        // Load from localStorage and backend
        const localHistory = JSON.parse(localStorage.getItem('optimizationHistory') || '[]');
        
        // Mock additional history data for demonstration
        const mockHistory = [
            {
                id: 1,
                original_prompt: "Create a web application",
                optimized_prompt: "Create a comprehensive web application with modern frontend using React...",
                mode: "ai-dev",
                improvement_percentage: 845.2,
                quality_scores: { clarity: 10, specificity: 10, completeness: 10, technical: 10 },
                timestamp: new Date('2024-01-15T10:30:00').toISOString(),
                word_count_before: 4,
                word_count_after: 2847,
                sections_generated: 12,
                status: 'completed'
            },
            {
                id: 2,
                original_prompt: "Analyze sales data trends",
                optimized_prompt: "Conduct comprehensive sales data analysis including trend identification...",
                mode: "data-analysis",
                improvement_percentage: 723.4,
                quality_scores: { clarity: 9.8, specificity: 9.5, completeness: 9.9, technical: 9.7 },
                timestamp: new Date('2024-01-14T15:45:00').toISOString(),
                word_count_before: 4,
                word_count_after: 2156,
                sections_generated: 12,
                status: 'completed'
            },
            {
                id: 3,
                original_prompt: "Design a modern dashboard",
                optimized_prompt: "Create a modern, professional dashboard interface with clean aesthetics...",
                mode: "image-gen",
                improvement_percentage: 692.1,
                quality_scores: { clarity: 9.6, specificity: 9.8, completeness: 9.4, technical: 9.2 },
                timestamp: new Date('2024-01-14T09:20:00').toISOString(),
                word_count_before: 5,
                word_count_after: 1987,
                sections_generated: 12,
                status: 'completed'
            },
            {
                id: 4,
                original_prompt: "Build customer service bot",
                optimized_prompt: "Develop a sophisticated customer service chatbot with natural language processing...",
                mode: "chatbot",
                improvement_percentage: 567.8,
                quality_scores: { clarity: 9.3, specificity: 9.1, completeness: 9.6, technical: 9.0 },
                timestamp: new Date('2024-01-13T14:15:00').toISOString(),
                word_count_before: 4,
                word_count_after: 1764,
                sections_generated: 12,
                status: 'completed'
            },
            {
                id: 5,
                original_prompt: "Simple todo app",
                optimized_prompt: "Build a comprehensive todo application with user authentication...",
                mode: "ai-dev",
                improvement_percentage: 912.5,
                quality_scores: { clarity: 10, specificity: 9.9, completeness: 10, technical: 9.8 },
                timestamp: new Date('2024-01-12T11:30:00').toISOString(),
                word_count_before: 3,
                word_count_after: 2345,
                sections_generated: 12,
                status: 'completed'
            }
        ];

        this.historyData = [...localHistory, ...mockHistory];
        this.filteredData = [...this.historyData];
        this.updateStatistics();
    }

    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.updateFilterButtons();
                this.applyFilters();
            });
        });

        // Sort dropdown
        const sortSelect = document.getElementById('sort-select');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                this.sortBy = sortBy;
                this.sortOrder = sortOrder;
                this.applySorting();
            });
        }

        // Export button
        document.getElementById('export-history')?.addEventListener('click', () => {
            this.exportHistory();
        });

        // Clear history button
        document.getElementById('clear-history')?.addEventListener('click', () => {
            this.clearHistory();
        });

        // Items per page selector
        document.getElementById('items-per-page')?.addEventListener('change', (e) => {
            this.itemsPerPage = parseInt(e.target.value);
            this.currentPage = 1;
            this.renderHistory();
            this.updatePagination();
        });
    }

    setupFilters() {
        this.updateFilterButtons();
        this.applyFilters();
    }

    setupPagination() {
        this.updatePagination();
    }

    setupSearch() {
        const searchInput = document.getElementById('history-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.searchQuery = e.target.value.toLowerCase();
                    this.applyFilters();
                }, 300);
            });
        }
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

    applyFilters() {
        let filtered = [...this.historyData];

        // Apply mode filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(item => item.mode === this.currentFilter);
        }

        // Apply search filter
        if (this.searchQuery) {
            filtered = filtered.filter(item => 
                item.original_prompt.toLowerCase().includes(this.searchQuery) ||
                item.optimized_prompt.toLowerCase().includes(this.searchQuery) ||
                item.mode.toLowerCase().includes(this.searchQuery)
            );
        }

        this.filteredData = filtered;
        this.applySorting();
    }

    applySorting() {
        this.filteredData.sort((a, b) => {
            let aValue, bValue;

            switch (this.sortBy) {
                case 'date':
                    aValue = new Date(a.timestamp);
                    bValue = new Date(b.timestamp);
                    break;
                case 'improvement':
                    aValue = a.improvement_percentage;
                    bValue = b.improvement_percentage;
                    break;
                case 'mode':
                    aValue = a.mode;
                    bValue = b.mode;
                    break;
                default:
                    aValue = new Date(a.timestamp);
                    bValue = new Date(b.timestamp);
            }

            if (this.sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

        this.currentPage = 1;
        this.renderHistory();
        this.updatePagination();
    }

    renderHistory() {
        const container = document.getElementById('history-container');
        if (!container) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        if (pageData.length === 0) {
            container.innerHTML = `
                <div class="text-center py-12">
                    <svg class="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-700 mb-2">No optimization history found</h3>
                    <p class="text-gray-500">Try adjusting your filters or start creating optimizations.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pageData.map(item => this.createHistoryCard(item)).join('');

        // Animate cards
        anime({
            targets: '.history-card',
            translateY: [30, 0],
            opacity: [0, 1],
            delay: anime.stagger(100),
            duration: 600,
            easing: 'easeOutQuart'
        });
    }

    createHistoryCard(item) {
        const date = new Date(item.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const modeColors = {
            'ai-dev': 'bg-blue-100 text-blue-800',
            'data-analysis': 'bg-green-100 text-green-800',
            'image-gen': 'bg-purple-100 text-purple-800',
            'chatbot': 'bg-orange-100 text-orange-800'
        };

        const modeIcons = {
            'ai-dev': '💻',
            'data-analysis': '📊',
            'image-gen': '🎨',
            'chatbot': '🤖'
        };

        return `
            <div class="history-card bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 cursor-pointer" data-id="${item.id}">
                <div class="flex items-start justify-between mb-4">
                    <div class="flex items-center space-x-3">
                        <span class="text-2xl">${modeIcons[item.mode]}</span>
                        <div>
                            <span class="inline-block px-3 py-1 text-xs font-medium rounded-full ${modeColors[item.mode]}">
                                ${item.mode.toUpperCase().replace('-', ' ')}
                            </span>
                            <p class="text-sm text-gray-500 mt-1">${date}</p>
                        </div>
                    </div>
                    <div class="flex items-center space-x-2">
                        <span class="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                            +${item.improvement_percentage}%
                        </span>
                        <div class="relative">
                            <button class="text-gray-400 hover:text-gray-600" onclick="showHistoryActions(${item.id}, event)">
                                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <!-- Original Prompt -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-semibold text-gray-700 flex items-center">
                            <span class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                            Original (${item.word_count_before} words)
                        </h4>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p class="text-sm text-gray-700 line-clamp-3">${item.original_prompt}</p>
                        </div>
                    </div>

                    <!-- Optimized Prompt Preview -->
                    <div class="space-y-2">
                        <h4 class="text-sm font-semibold text-gray-700 flex items-center">
                            <span class="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                            Optimized (${item.word_count_after} words, ${item.sections_generated} sections)
                        </h4>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                            <p class="text-sm text-gray-700 line-clamp-3">${item.optimized_prompt.substring(0, 150)}...</p>
                        </div>
                    </div>
                </div>

                <!-- Quality Metrics -->
                <div class="mt-4 pt-4 border-t border-gray-100">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div class="space-y-1">
                            <div class="text-xs text-gray-500">Clarity</div>
                            <div class="font-semibold text-blue-600">${item.quality_scores.clarity}/10</div>
                        </div>
                        <div class="space-y-1">
                            <div class="text-xs text-gray-500">Specificity</div>
                            <div class="font-semibold text-green-600">${item.quality_scores.specificity}/10</div>
                        </div>
                        <div class="space-y-1">
                            <div class="text-xs text-gray-500">Completeness</div>
                            <div class="font-semibold text-purple-600">${item.quality_scores.completeness}/10</div>
                        </div>
                        <div class="space-y-1">
                            <div class="text-xs text-gray-500">Technical</div>
                            <div class="font-semibold text-orange-600">${item.quality_scores.technical}/10</div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button onclick="viewFullHistory(${item.id})" class="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors">
                        View Full
                    </button>
                    <button onclick="reusePrompt(${item.id})" class="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors">
                        Reuse
                    </button>
                    <button onclick="copyOptimized(${item.id})" class="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors">
                        Copy
                    </button>
                    <button onclick="shareHistory(${item.id})" class="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors">
                        Share
                    </button>
                </div>
            </div>
        `;
    }

    updatePagination() {
        const totalItems = this.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.itemsPerPage);
        
        const paginationContainer = document.getElementById('pagination-container');
        if (!paginationContainer) return;

        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHTML = `
            <div class="flex items-center justify-between">
                <div class="text-sm text-gray-700">
                    Showing ${(this.currentPage - 1) * this.itemsPerPage + 1} to ${Math.min(this.currentPage * this.itemsPerPage, totalItems)} of ${totalItems} results
                </div>
                <div class="flex space-x-1">
        `;

        // Previous button
        paginationHTML += `
            <button onclick="historyManager.changePage(${this.currentPage - 1})" 
                    ${this.currentPage === 1 ? 'disabled' : ''} 
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
            </button>
        `;

        // Page numbers
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationHTML += `
                <button onclick="historyManager.changePage(${i})" 
                        class="px-3 py-1 text-sm rounded ${i === this.currentPage ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}">
                    ${i}
                </button>
            `;
        }

        // Next button
        paginationHTML += `
            <button onclick="historyManager.changePage(${this.currentPage + 1})" 
                    ${this.currentPage === totalPages ? 'disabled' : ''} 
                    class="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
            </button>
        `;

        paginationHTML += '</div></div>';
        paginationContainer.innerHTML = paginationHTML;
    }

    changePage(page) {
        const totalPages = Math.ceil(this.filteredData.length / this.itemsPerPage);
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.renderHistory();
            this.updatePagination();
        }
    }

    updateStatistics() {
        const stats = {
            total: this.historyData.length,
            avgImprovement: this.historyData.reduce((sum, item) => sum + item.improvement_percentage, 0) / this.historyData.length || 0,
            totalWordsBefore: this.historyData.reduce((sum, item) => sum + item.word_count_before, 0),
            totalWordsAfter: this.historyData.reduce((sum, item) => sum + item.word_count_after, 0)
        };

        // Update statistics display
        document.getElementById('total-optimizations')?.textContent = stats.total;
        document.getElementById('avg-improvement')?.textContent = `${Math.round(stats.avgImprovement)}%`;
        document.getElementById('total-words-generated')?.textContent = (stats.totalWordsAfter - stats.totalWordsBefore).toLocaleString();
    }

    exportHistory() {
        const csvContent = this.convertHistoryToCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimization-history-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('History exported successfully!', 'success');
    }

    convertHistoryToCSV() {
        const headers = ['Date', 'Mode', 'Original Prompt', 'Improvement %', 'Clarity', 'Specificity', 'Completeness', 'Technical'];
        let csv = headers.join(',') + '\n';
        
        this.filteredData.forEach(item => {
            const row = [
                new Date(item.timestamp).toLocaleDateString(),
                item.mode,
                `"${item.original_prompt.replace(/"/g, '""')}"`,
                item.improvement_percentage,
                item.quality_scores.clarity,
                item.quality_scores.specificity,
                item.quality_scores.completeness,
                item.quality_scores.technical
            ];
            csv += row.join(',') + '\n';
        });
        
        return csv;
    }

    clearHistory() {
        if (confirm('Are you sure you want to clear all optimization history? This action cannot be undone.')) {
            this.historyData = [];
            this.filteredData = [];
            localStorage.removeItem('optimizationHistory');
            this.renderHistory();
            this.updateStatistics();
            this.updatePagination();
            this.showNotification('History cleared successfully!', 'success');
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'success' ? 'bg-green-500' : 
            type === 'warning' ? 'bg-yellow-500' : 
            'bg-blue-500'
        } text-white`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        anime({
            targets: notification,
            translateX: [400, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuart'
        });
        
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, 400],
                opacity: [1, 0],
                duration: 300,
                complete: () => notification.remove()
            });
        }, 3000);
    }
}

// Global functions for history actions
function viewFullHistory(id) {
    const item = window.historyManager.historyData.find(h => h.id === id);
    if (!item) return;
    
    // Create full view modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-6xl max-h-[90vh] overflow-auto">
            <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold text-gray-800">Optimization Details</h2>
                    <button onclick="this.closest('.fixed').remove()" class="text-gray-500 hover:text-gray-700">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="p-6">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <h3 class="text-lg font-semibold text-red-700 mb-4">Original Prompt</h3>
                        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                            <p class="text-gray-700 whitespace-pre-wrap">${item.original_prompt}</p>
                        </div>
                    </div>
                    <div>
                        <h3 class="text-lg font-semibold text-green-700 mb-4">Optimized Prompt</h3>
                        <div class="bg-green-50 border border-green-200 rounded-lg p-4 max-h-96 overflow-y-auto">
                            <p class="text-gray-700 whitespace-pre-wrap">${item.optimized_prompt}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function reusePrompt(id) {
    const item = window.historyManager.historyData.find(h => h.id === id);
    if (!item) return;
    
    // Store prompt for reuse and redirect
    sessionStorage.setItem('reusePrompt', JSON.stringify({
        prompt: item.original_prompt,
        mode: item.mode
    }));
    
    window.location.href = 'index.html?reuse=true';
}

function copyOptimized(id) {
    const item = window.historyManager.historyData.find(h => h.id === id);
    if (!item) return;
    
    navigator.clipboard.writeText(item.optimized_prompt).then(() => {
        window.historyManager.showNotification('Optimized prompt copied to clipboard!', 'success');
    }).catch(() => {
        window.historyManager.showNotification('Could not copy to clipboard', 'warning');
    });
}

function shareHistory(id) {
    const item = window.historyManager.historyData.find(h => h.id === id);
    if (!item) return;
    
    const shareText = `🚀 I optimized my AI prompt and got ${item.improvement_percentage}% improvement!\n\nOriginal: "${item.original_prompt}"\n\nTry PromptEngine: ${window.location.origin}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'PromptEngine Optimization Results',
            text: shareText
        });
    } else if (navigator.clipboard) {
        navigator.clipboard.writeText(shareText).then(() => {
            window.historyManager.showNotification('Share text copied to clipboard!', 'success');
        });
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.historyManager = new HistoryManager();
});