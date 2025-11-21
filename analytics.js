// Analytics Page JavaScript - Full Functionality
class AnalyticsManager {
    constructor() {
        this.analyticsData = {};
        this.charts = {};
        this.timeRange = '7d';
        this.init();
    }

    init() {
        this.loadAnalyticsData();
        this.setupEventListeners();
        this.initializeCharts();
        this.setupRealTimeUpdates();
    }

    loadAnalyticsData() {
        // Load analytics data from backend or generate mock data
        this.analyticsData = {
            overview: {
                totalOptimizations: 1247,
                totalUsers: 342,
                averageImprovement: 687,
                successRate: 98.5,
                totalTemplatesUsed: 89,
                activeUsers: 156
            },
            optimizationTrends: this.generateOptimizationTrends(),
            modePopularity: {
                'ai-dev': 42,
                'data-analysis': 28,
                'image-gen': 18,
                'chatbot': 12
            },
            improvementDistribution: this.generateImprovementDistribution(),
            templateUsage: this.generateTemplateUsage(),
            userEngagement: this.generateUserEngagement(),
            performanceMetrics: {
                averageResponseTime: 2.3,
                apiSuccessRate: 99.2,
                systemUptime: 99.8,
                errorRate: 0.2
            }
        };
    }

    generateOptimizationTrends() {
        const days = 30;
        const data = [];
        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            data.push({
                date: date.toISOString().split('T')[0],
                optimizations: Math.floor(Math.random() * 50) + 20 + (i < 7 ? 20 : 0),
                users: Math.floor(Math.random() * 30) + 10 + (i < 7 ? 15 : 0),
                templates: Math.floor(Math.random() * 10) + 5
            });
        }
        return data;
    }

    generateImprovementDistribution() {
        return [
            { range: '0-100%', count: 15, color: '#ef4444' },
            { range: '100-300%', count: 45, color: '#f97316' },
            { range: '300-500%', count: 120, color: '#eab308' },
            { range: '500-700%', count: 180, color: '#22c55e' },
            { range: '700-900%', count: 95, color: '#06b6d4' },
            { range: '900%+', count: 25, color: '#8b5cf6' }
        ];
    }

    generateTemplateUsage() {
        return [
            { name: 'Full-Stack Web App', uses: 456, category: 'ai-dev' },
            { name: 'API Development', uses: 234, category: 'ai-dev' },
            { name: 'Customer Service Bot', uses: 189, category: 'chatbot' },
            { name: 'Business Analysis', uses: 167, category: 'data-analysis' },
            { name: 'Dashboard Design', uses: 145, category: 'image-gen' }
        ];
    }

    generateUserEngagement() {
        return {
            dailyActiveUsers: Array.from({length: 7}, (_, i) => ({
                day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
                users: Math.floor(Math.random() * 100) + 50
            })),
            sessionDuration: {
                average: 8.5,
                distribution: [
                    { duration: '0-2 min', percentage: 15 },
                    { duration: '2-5 min', percentage: 25 },
                    { duration: '5-10 min', percentage: 35 },
                    { duration: '10-20 min', percentage: 20 },
                    { duration: '20+ min', percentage: 5 }
                ]
            }
        };
    }

    setupEventListeners() {
        // Time range selector
        document.querySelectorAll('.time-range-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.timeRange = e.target.dataset.range;
                this.updateTimeRangeButtons();
                this.updateChartsForTimeRange();
            });
        });

        // Export functionality
        document.getElementById('export-btn')?.addEventListener('click', () => {
            this.exportAnalytics();
        });

        // Refresh data
        document.getElementById('refresh-btn')?.addEventListener('click', () => {
            this.refreshData();
        });

        // Filter controls
        document.querySelectorAll('.filter-option').forEach(option => {
            option.addEventListener('change', () => {
                this.updateFilters();
            });
        });
    }

    initializeCharts() {
        this.createOverviewKPIs();
        this.createOptimizationTrendsChart();
        this.createModePopularityChart();
        this.createImprovementDistributionChart();
        this.createTemplateUsageChart();
        this.createUserEngagementChart();
        this.createPerformanceMetrics();
    }

    createOverviewKPIs() {
        const overview = this.analyticsData.overview;
        
        // Update KPI cards with animations
        this.animateCounter('total-optimizations', overview.totalOptimizations);
        this.animateCounter('total-users', overview.totalUsers);
        this.animateCounter('average-improvement', overview.averageImprovement, '%');
        this.animateCounter('success-rate', overview.successRate, '%');
    }

    animateCounter(elementId, targetValue, suffix = '') {
        const element = document.getElementById(elementId);
        if (!element) return;

        anime({
            targets: { value: 0 },
            value: targetValue,
            round: 1,
            duration: 2000,
            easing: 'easeOutQuart',
            update: (anim) => {
                element.textContent = Math.round(anim.animatables[0].target.value) + suffix;
            }
        });
    }

    createOptimizationTrendsChart() {
        const ctx = document.getElementById('trends-chart')?.getContext('2d');
        if (!ctx) return;

        const data = this.analyticsData.optimizationTrends;
        
        this.charts.trends = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => new Date(d.date).toLocaleDateString()),
                datasets: [
                    {
                        label: 'Optimizations',
                        data: data.map(d => d.optimizations),
                        borderColor: '#f97316',
                        backgroundColor: 'rgba(249, 115, 22, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Active Users',
                        data: data.map(d => d.users),
                        borderColor: '#06b6d4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: 'white',
                        bodyColor: 'white'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createModePopularityChart() {
        const ctx = document.getElementById('mode-chart')?.getContext('2d');
        if (!ctx) return;

        const data = this.analyticsData.modePopularity;
        
        this.charts.modes = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['AI Development', 'Data Analysis', 'Image Generation', 'Chatbot'],
                datasets: [{
                    data: Object.values(data),
                    backgroundColor: [
                        '#f97316',
                        '#06b6d4',
                        '#22c55e',
                        '#8b5cf6'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const percentage = Math.round((context.parsed / Object.values(data).reduce((a, b) => a + b, 0)) * 100);
                                return `${context.label}: ${percentage}%`;
                            }
                        }
                    }
                },
                cutout: '60%'
            }
        });
    }

    createImprovementDistributionChart() {
        const ctx = document.getElementById('improvement-chart')?.getContext('2d');
        if (!ctx) return;

        const data = this.analyticsData.improvementDistribution;
        
        this.charts.improvement = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.range),
                datasets: [{
                    label: 'Number of Optimizations',
                    data: data.map(d => d.count),
                    backgroundColor: data.map(d => d.color),
                    borderRadius: 8,
                    borderSkipped: false
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        callbacks: {
                            label: function(context) {
                                return `${context.parsed.y} optimizations`;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createTemplateUsageChart() {
        const ctx = document.getElementById('template-chart')?.getContext('2d');
        if (!ctx) return;

        const data = this.analyticsData.templateUsage;
        
        this.charts.templates = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: data.map(d => d.name),
                datasets: [{
                    label: 'Usage Count',
                    data: data.map(d => d.uses),
                    backgroundColor: [
                        '#f97316',
                        '#06b6d4',
                        '#22c55e',
                        '#8b5cf6',
                        '#ef4444'
                    ],
                    borderRadius: 6
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createUserEngagementChart() {
        const ctx = document.getElementById('engagement-chart')?.getContext('2d');
        if (!ctx) return;

        const data = this.analyticsData.userEngagement.dailyActiveUsers;
        
        this.charts.engagement = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(d => d.day),
                datasets: [{
                    label: 'Daily Active Users',
                    data: data.map(d => d.users),
                    borderColor: '#22c55e',
                    backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#22c55e',
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0, 0, 0, 0.1)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    createPerformanceMetrics() {
        const metrics = this.analyticsData.performanceMetrics;
        
        // Update performance indicators
        this.updatePerformanceIndicator('response-time', metrics.averageResponseTime, 's');
        this.updatePerformanceIndicator('api-success', metrics.apiSuccessRate, '%');
        this.updatePerformanceIndicator('system-uptime', metrics.systemUptime, '%');
        this.updatePerformanceIndicator('error-rate', metrics.errorRate, '%');
    }

    updatePerformanceIndicator(id, value, suffix) {
        const element = document.getElementById(id);
        if (element) {
            anime({
                targets: { val: 0 },
                val: value,
                duration: 1500,
                round: suffix === 's' ? 10 : 10,
                easing: 'easeOutQuart',
                update: (anim) => {
                    element.textContent = anim.animatables[0].target.val.toFixed(suffix === 's' ? 1 : 1) + suffix;
                }
            });
        }
    }

    updateTimeRangeButtons() {
        document.querySelectorAll('.time-range-btn').forEach(btn => {
            if (btn.dataset.range === this.timeRange) {
                btn.classList.add('bg-orange-500', 'text-white');
                btn.classList.remove('bg-gray-100', 'text-gray-700');
            } else {
                btn.classList.remove('bg-orange-500', 'text-white');
                btn.classList.add('bg-gray-100', 'text-gray-700');
            }
        });
    }

    updateChartsForTimeRange() {
        // Update charts based on selected time range
        this.loadAnalyticsData(); // Reload with new time range
        
        // Update each chart
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.update) {
                chart.update();
            }
        });
        
        // Update KPIs
        this.createOverviewKPIs();
    }

    updateFilters() {
        // Get selected filters
        const filters = Array.from(document.querySelectorAll('.filter-option:checked'))
            .map(option => option.value);
        
        // Apply filters to charts and data
        this.applyFilters(filters);
    }

    applyFilters(filters) {
        // Filter analytics data and update charts
        // Applying filters
        // Implementation would filter the data and refresh charts
    }

    exportAnalytics() {
        // Export analytics data as CSV/PDF
        const data = this.analyticsData;
        const csvContent = this.convertToCSV(data);
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Analytics exported successfully!', 'success');
    }

    convertToCSV(data) {
        // Convert analytics data to CSV format
        let csv = 'Metric,Value\n';
        csv += `Total Optimizations,${data.overview.totalOptimizations}\n`;
        csv += `Total Users,${data.overview.totalUsers}\n`;
        csv += `Average Improvement,${data.overview.averageImprovement}%\n`;
        csv += `Success Rate,${data.overview.successRate}%\n`;
        return csv;
    }

    refreshData() {
        this.showNotification('Refreshing analytics data...', 'info');
        
        // Simulate API call
        setTimeout(() => {
            this.loadAnalyticsData();
            this.updateChartsForTimeRange();
            this.showNotification('Analytics data updated!', 'success');
        }, 1000);
    }

    setupRealTimeUpdates() {
        // Set up real-time data updates
        setInterval(() => {
            this.updateRealTimeMetrics();
        }, 30000); // Update every 30 seconds
    }

    updateRealTimeMetrics() {
        // Simulate real-time metric updates
        const overview = this.analyticsData.overview;
        overview.totalOptimizations += Math.floor(Math.random() * 3);
        overview.activeUsers = Math.floor(Math.random() * 20) + 140;
        
        // Update KPIs with new values
        this.animateCounter('total-optimizations', overview.totalOptimizations);
        this.animateCounter('active-users', overview.activeUsers);
    }

    showNotification(message, type) {
        // Show notification to user
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

// Initialize analytics when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.analyticsManager = new AnalyticsManager();
});