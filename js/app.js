/* ============================================
   BAPCO TruContext Dashboard - Main Application
   Entry point and initialization
   ============================================ */

class BAPCODashboard {
    constructor() {
        this.isInitialized = false;
        this.realTimeInterval = null;
        this.currentTheme = 'dark';
    }

    // Initialize the application
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        console.log('🚀 BAPCO TruContext Dashboard Initializing...');

        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        // Initialize components in order
        this.initializeNavigation();
        this.initializeAnimations();
        this.initializeCharts();
        this.initializeThreeScenes();
        this.initializeRealTimeUpdates();
        this.initializeEventListeners();
        this.initializeTooltips();
        this.initializeModals();
        this.initializeNotifications();

        // Start the landing page experience
        this.startLandingExperience();

        console.log('✅ BAPCO TruContext Dashboard Ready');
    }

    // Initialize navigation
    initializeNavigation() {
        // Internal SPA navigation
        if (window.InternalNavigation) {
            window.InternalNavigation.init();
        }

        // Mobile menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        // Close sidebar on outside click (mobile)
        document.addEventListener('click', (e) => {
            if (sidebar && !sidebar.contains(e.target) && !menuToggle?.contains(e.target)) {
                sidebar.classList.remove('open');
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
                sidebar?.classList.remove('open');
            }
        });
    }

    // Initialize animations
    initializeAnimations() {
        // Anime.js animations
        if (window.AnimeAnimations) {
            window.AnimeAnimations.init();
        }

        // GSAP animations
        if (window.GSAPAnimations) {
            window.GSAPAnimations.init();
        }
    }

    // Initialize charts
    initializeCharts() {
        if (window.DashboardCharts) {
            // Charts will be initialized per-page by navigation
            console.log('📊 Chart system ready');
        }
    }

    // Initialize Three.js scenes
    initializeThreeScenes() {
        if (window.ThreeScenes) {
            // Initialize hero background
            window.ThreeScenes.initHeroCanvas('heroCanvas');
            console.log('🎮 3D scenes ready');
        }
    }

    // Initialize real-time data updates
    initializeRealTimeUpdates() {
        // Update data every 5 seconds
        this.realTimeInterval = setInterval(() => {
            this.updateRealTimeData();
        }, 5000);

        // Initial update
        this.updateRealTimeData();
    }

    // Update real-time data
    updateRealTimeData() {
        if (!window.MockData) return;

        // Simulate data changes
        const data = window.simulateRealTimeData();

        // Update KPI displays
        this.updateKPIDisplays(data.kpis);

        // Update status indicators
        this.updateStatusIndicators(data.units);

        // Update alerts
        this.updateAlerts(data.safetyAlerts);

        // Flash updated elements
        document.querySelectorAll('.real-time-value').forEach(el => {
            el.classList.add('updated');
            setTimeout(() => el.classList.remove('updated'), 1000);
        });
    }

    // Update KPI displays
    updateKPIDisplays(kpis) {
        Object.entries(kpis).forEach(([key, kpi]) => {
            const valueEl = document.querySelector(`[data-kpi="${key}"] .kpi-value`);
            const trendEl = document.querySelector(`[data-kpi="${key}"] .kpi-trend`);

            if (valueEl) {
                const formattedValue = kpi.value.toLocaleString();
                if (valueEl.textContent !== formattedValue) {
                    valueEl.textContent = formattedValue;
                    valueEl.classList.add('updated');
                    setTimeout(() => valueEl.classList.remove('updated'), 500);
                }
            }

            if (trendEl) {
                const trendClass = kpi.trend >= 0 ? 'positive' : 'negative';
                const trendIcon = kpi.trend >= 0 ? '↑' : '↓';
                trendEl.className = `kpi-trend ${trendClass}`;
                trendEl.textContent = `${trendIcon} ${Math.abs(kpi.trend).toFixed(1)}%`;
            }
        });
    }

    // Update status indicators
    updateStatusIndicators(units) {
        units.forEach(unit => {
            const statusEl = document.querySelector(`[data-unit="${unit.id}"] .status-indicator`);
            if (statusEl) {
                statusEl.className = `status-indicator ${unit.status}`;
            }
        });
    }

    // Update alerts
    updateAlerts(alerts) {
        const alertContainer = document.querySelector('.alerts-container');
        if (!alertContainer) return;

        // Check for new critical alerts
        const criticalAlerts = alerts.filter(a => a.severity === 'critical');
        if (criticalAlerts.length > 0) {
            this.showNotification(criticalAlerts[0].title, 'critical');
        }
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Enter dashboard button
        const enterBtn = document.querySelector('.enter-dashboard-btn');
        if (enterBtn) {
            enterBtn.addEventListener('click', () => {
                this.enterDashboard();
            });
        }

        // Explore button
        const exploreBtn = document.querySelector('.explore-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                this.scrollToSection('.features-section');
            });
        }

        // Theme toggle
        const themeToggle = document.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Fullscreen toggle
        const fullscreenBtn = document.querySelector('.fullscreen-btn');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
            });
        }

        // Alert dismiss buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('alert-dismiss')) {
                this.dismissAlert(e.target.closest('.alert-item'));
            }
        });

        // Card expand buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('expand-btn')) {
                this.expandCard(e.target.closest('.chart-card'));
            }
        });

        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
    }

    // Initialize tooltips
    initializeTooltips() {
        document.querySelectorAll('[data-tooltip]').forEach(el => {
            el.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.tooltip);
            });
            el.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    // Show tooltip
    showTooltip(target, text) {
        let tooltip = document.querySelector('.tooltip');
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            document.body.appendChild(tooltip);
        }

        tooltip.textContent = text;
        tooltip.classList.add('visible');

        const rect = target.getBoundingClientRect();
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = `${rect.top - 10}px`;
    }

    // Hide tooltip
    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.classList.remove('visible');
        }
    }

    // Initialize modals
    initializeModals() {
        // Modal triggers
        document.querySelectorAll('[data-modal]').forEach(trigger => {
            trigger.addEventListener('click', () => {
                this.openModal(trigger.dataset.modal);
            });
        });

        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => {
                this.closeModal(btn.closest('.modal'));
            });
        });

        // Close on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });
    }

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal && window.GSAPAnimations) {
            window.GSAPAnimations.openModal(modal);
        }
    }

    // Close modal
    closeModal(modal) {
        if (modal && window.GSAPAnimations) {
            window.GSAPAnimations.closeModal(modal);
        }
    }

    // Close all modals
    closeAllModals() {
        document.querySelectorAll('.modal.open').forEach(modal => {
            this.closeModal(modal);
        });
    }

    // Initialize notifications
    initializeNotifications() {
        // Create notification container
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    // Show notification
    showNotification(message, type = 'info', duration = 5000) {
        const container = document.querySelector('.notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${this.getNotificationIcon(type)}</div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">×</button>
        `;

        container.appendChild(notification);

        // Animate in
        if (window.GSAPAnimations) {
            window.GSAPAnimations.showAlert(notification);
        }

        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            this.dismissNotification(notification);
        });

        // Auto dismiss
        if (duration > 0) {
            setTimeout(() => {
                this.dismissNotification(notification);
            }, duration);
        }
    }

    // Get notification icon
    getNotificationIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            critical: '🚨',
            error: '❌'
        };
        return icons[type] || icons.info;
    }

    // Dismiss notification
    dismissNotification(notification) {
        if (window.GSAPAnimations) {
            window.GSAPAnimations.hideAlert(notification).then(() => {
                notification.remove();
            });
        } else {
            notification.remove();
        }
    }

    // Start landing page experience
    startLandingExperience() {
        const landingPage = document.querySelector('.landing-page');
        if (!landingPage) return;

        // Animate hero elements
        if (window.AnimeAnimations) {
            window.AnimeAnimations.animateHeroElements();
        }

        // Start particle animation
        if (window.ThreeScenes) {
            window.ThreeScenes.initHeroScene('heroScene');
        }
    }

    // Enter dashboard
    enterDashboard() {
        const landingPage = document.querySelector('.landing-page');
        const dashboardPage = document.querySelector('.dashboard-page');

        if (!landingPage || !dashboardPage) return;

        // Transition animation
        gsap.to(landingPage, {
            opacity: 0,
            y: -50,
            duration: 0.5,
            ease: 'power2.in',
            onComplete: () => {
                landingPage.style.display = 'none';
                dashboardPage.style.display = 'flex';
                
                gsap.fromTo(dashboardPage,
                    { opacity: 0 },
                    { opacity: 1, duration: 0.5 }
                );

                // Initialize dashboard
                if (window.GSAPAnimations) {
                    window.GSAPAnimations.animateDashboardEntry();
                }

                // Initialize first page
                if (window.InternalNavigation) {
                    window.InternalNavigation.showPage('overview');
                }
            }
        });
    }

    // Scroll to section
    scrollToSection(selector) {
        const section = document.querySelector(selector);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Toggle theme
    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = this.currentTheme;
        localStorage.setItem('theme', this.currentTheme);
    }

    // Toggle fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Dismiss alert
    dismissAlert(alertEl) {
        if (!alertEl) return;

        gsap.to(alertEl, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            onComplete: () => alertEl.remove()
        });
    }

    // Expand card
    expandCard(card) {
        if (!card) return;

        card.classList.toggle('expanded');
        
        if (card.classList.contains('expanded')) {
            gsap.to(card, {
                position: 'fixed',
                top: '5%',
                left: '5%',
                width: '90%',
                height: '90%',
                zIndex: 1000,
                duration: 0.4,
                ease: 'power2.out'
            });
        } else {
            gsap.to(card, {
                position: 'relative',
                top: 'auto',
                left: 'auto',
                width: '100%',
                height: 'auto',
                zIndex: 1,
                duration: 0.4,
                ease: 'power2.out'
            });
        }
    }

    // Handle resize
    handleResize() {
        // Update Three.js scenes
        if (window.ThreeScenes) {
            Object.keys(window.ThreeScenes.scenes).forEach(key => {
                const canvas = document.querySelector(`#${key}Canvas, #${key}Scene`);
                if (canvas) {
                    window.ThreeScenes.handleResize(key, canvas);
                }
            });
        }

        // Update charts
        if (window.DashboardCharts) {
            Object.values(window.DashboardCharts.charts).forEach(chart => {
                if (chart && chart.resize) chart.resize();
            });
        }
    }

    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Cleanup
    destroy() {
        if (this.realTimeInterval) {
            clearInterval(this.realTimeInterval);
        }

        if (window.ThreeScenes) {
            Object.keys(window.ThreeScenes.scenes).forEach(key => {
                window.ThreeScenes.dispose(key);
            });
        }

        if (window.GSAPAnimations) {
            window.GSAPAnimations.destroy();
        }
    }
}

// Initialize application
const app = new BAPCODashboard();
app.init();

// Export for external access
window.BAPCODashboard = app;
