/* ============================================
   BAPCO TruContext Dashboard - Anime.js Animations
   Physics-based animations and micro-interactions
   ============================================ */

class AnimeAnimations {
    constructor() {
        this.animations = {};
        this.isInitialized = false;
    }

    // Initialize all animations
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Wait for DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
        } else {
            this.setupAnimations();
        }
    }

    setupAnimations() {
        this.animateHeroElements();
        this.animateKPICards();
        this.animateNavigation();
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.animateDataFlows();
        this.animateAlerts();
    }

    // Hero section animations
    animateHeroElements() {
        // Hero title entrance
        anime({
            targets: '.hero-content h1',
            opacity: [0, 1],
            translateY: [50, 0],
            duration: 1200,
            easing: 'easeOutExpo',
            delay: 300
        });

        // Hero subtitle
        anime({
            targets: '.hero-content p',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 1000,
            easing: 'easeOutExpo',
            delay: 600
        });

        // Hero buttons
        anime({
            targets: '.hero-buttons .btn',
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(150, { start: 900 })
        });

        // Stats counter animation
        anime({
            targets: '.hero-stats .stat-value',
            innerHTML: function(el) {
                return [0, el.getAttribute('data-value') || el.innerHTML];
            },
            round: 1,
            duration: 2000,
            easing: 'easeInOutExpo',
            delay: anime.stagger(200, { start: 1200 })
        });

        // Floating animation for hero visual
        anime({
            targets: '.hero-visual',
            translateY: [-10, 10],
            duration: 3000,
            easing: 'easeInOutSine',
            direction: 'alternate',
            loop: true
        });
    }

    // KPI Cards entrance animation
    animateKPICards() {
        const kpiCards = document.querySelectorAll('.kpi-card');
        
        anime({
            targets: kpiCards,
            opacity: [0, 1],
            translateY: [40, 0],
            scale: [0.9, 1],
            duration: 800,
            easing: 'easeOutExpo',
            delay: anime.stagger(100)
        });

        // Animate KPI values with counting effect
        kpiCards.forEach(card => {
            const valueEl = card.querySelector('.kpi-value');
            if (valueEl) {
                const finalValue = parseFloat(valueEl.textContent.replace(/,/g, ''));
                if (!isNaN(finalValue)) {
                    anime({
                        targets: valueEl,
                        innerHTML: [0, finalValue],
                        round: finalValue > 1000 ? 1 : 10,
                        duration: 2000,
                        easing: 'easeOutExpo',
                        delay: 500
                    });
                }
            }
        });

        // Pulse animation for trend indicators
        anime({
            targets: '.kpi-trend',
            scale: [1, 1.1, 1],
            duration: 1500,
            easing: 'easeInOutQuad',
            loop: true,
            delay: anime.stagger(200)
        });
    }

    // Navigation animations
    animateNavigation() {
        // Nav items entrance
        anime({
            targets: '.nav-item',
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(50)
        });

        // Active indicator animation
        const updateActiveIndicator = () => {
            const activeItem = document.querySelector('.nav-item.active');
            if (activeItem) {
                anime({
                    targets: '.nav-indicator',
                    top: activeItem.offsetTop,
                    height: activeItem.offsetHeight,
                    duration: 400,
                    easing: 'easeOutExpo'
                });
            }
        };

        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', () => {
                document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                updateActiveIndicator();
            });
        });
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    
                    if (el.classList.contains('chart-card')) {
                        this.animateChartCard(el);
                    } else if (el.classList.contains('data-table')) {
                        this.animateTable(el);
                    } else if (el.classList.contains('alert-item')) {
                        this.animateAlertItem(el);
                    } else if (el.classList.contains('section-title')) {
                        this.animateSectionTitle(el);
                    } else {
                        // Default fade in
                        anime({
                            targets: el,
                            opacity: [0, 1],
                            translateY: [30, 0],
                            duration: 800,
                            easing: 'easeOutExpo'
                        });
                    }
                    
                    observer.unobserve(el);
                }
            });
        }, observerOptions);

        // Observe elements
        document.querySelectorAll('.chart-card, .data-table, .alert-item, .section-title, .animate-on-scroll').forEach(el => {
            el.style.opacity = '0';
            observer.observe(el);
        });
    }

    // Chart card animation
    animateChartCard(el) {
        anime({
            targets: el,
            opacity: [0, 1],
            translateY: [50, 0],
            scale: [0.95, 1],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // Animate chart header
        anime({
            targets: el.querySelector('.chart-header'),
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: 200
        });
    }

    // Table animation
    animateTable(el) {
        anime({
            targets: el,
            opacity: [0, 1],
            duration: 600,
            easing: 'easeOutExpo'
        });

        // Animate rows
        anime({
            targets: el.querySelectorAll('tr'),
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 500,
            easing: 'easeOutExpo',
            delay: anime.stagger(50, { start: 200 })
        });
    }

    // Alert item animation
    animateAlertItem(el) {
        anime({
            targets: el,
            opacity: [0, 1],
            translateX: [-30, 0],
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    // Section title animation
    animateSectionTitle(el) {
        anime({
            targets: el,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 800,
            easing: 'easeOutExpo'
        });

        // Animate underline
        anime({
            targets: el.querySelector('::after'),
            scaleX: [0, 1],
            duration: 600,
            easing: 'easeOutExpo',
            delay: 300
        });
    }

    // Hover effects
    setupHoverEffects() {
        // Card hover effect
        document.querySelectorAll('.chart-card, .kpi-card, .alert-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    translateY: -5,
                    boxShadow: '0 20px 40px rgba(0, 212, 255, 0.15)',
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            });

            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    translateY: 0,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            });
        });

        // Button hover effect
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                anime({
                    targets: btn,
                    scale: 1.05,
                    duration: 200,
                    easing: 'easeOutExpo'
                });
            });

            btn.addEventListener('mouseleave', () => {
                anime({
                    targets: btn,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutExpo'
                });
            });
        });

        // Table row hover
        document.querySelectorAll('.data-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                anime({
                    targets: row,
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    duration: 200,
                    easing: 'easeOutExpo'
                });
            });

            row.addEventListener('mouseleave', () => {
                anime({
                    targets: row,
                    backgroundColor: 'transparent',
                    duration: 200,
                    easing: 'easeOutExpo'
                });
            });
        });
    }

    // Data flow animations
    animateDataFlows() {
        // Animate flow indicators
        anime({
            targets: '.flow-indicator',
            translateX: ['-100%', '100%'],
            duration: 2000,
            easing: 'linear',
            loop: true
        });

        // Animate data points
        anime({
            targets: '.data-point',
            scale: [1, 1.5, 1],
            opacity: [1, 0.5, 1],
            duration: 1500,
            easing: 'easeInOutSine',
            loop: true,
            delay: anime.stagger(200)
        });

        // Animate connection lines
        anime({
            targets: '.connection-line',
            strokeDashoffset: [anime.setDashoffset, 0],
            duration: 2000,
            easing: 'easeInOutSine',
            loop: true
        });
    }

    // Alert animations
    animateAlerts() {
        // Pulse animation for critical alerts
        anime({
            targets: '.alert-critical',
            boxShadow: [
                '0 0 0 0 rgba(255, 71, 87, 0.4)',
                '0 0 0 10px rgba(255, 71, 87, 0)',
            ],
            duration: 1500,
            easing: 'easeOutSine',
            loop: true
        });

        // Warning pulse
        anime({
            targets: '.alert-warning',
            boxShadow: [
                '0 0 0 0 rgba(255, 217, 61, 0.3)',
                '0 0 0 8px rgba(255, 217, 61, 0)',
            ],
            duration: 2000,
            easing: 'easeOutSine',
            loop: true
        });
    }

    // Page transition animation
    pageTransitionOut(callback) {
        anime({
            targets: '.page-content',
            opacity: [1, 0],
            translateY: [0, -30],
            duration: 400,
            easing: 'easeInExpo',
            complete: callback
        });
    }

    pageTransitionIn() {
        anime({
            targets: '.page-content',
            opacity: [0, 1],
            translateY: [30, 0],
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    // Gauge animation
    animateGauge(gaugeId, value, max) {
        const percentage = (value / max) * 100;
        const gaugeEl = document.querySelector(`#${gaugeId} .gauge-fill`);
        
        if (gaugeEl) {
            anime({
                targets: gaugeEl,
                strokeDashoffset: [anime.setDashoffset, anime.setDashoffset * (1 - percentage / 100)],
                duration: 1500,
                easing: 'easeOutExpo'
            });
        }
    }

    // Counter animation
    animateCounter(element, endValue, duration = 2000) {
        anime({
            targets: element,
            innerHTML: [0, endValue],
            round: endValue > 100 ? 1 : 10,
            duration: duration,
            easing: 'easeOutExpo'
        });
    }

    // Progress bar animation
    animateProgressBar(element, percentage) {
        anime({
            targets: element,
            width: `${percentage}%`,
            duration: 1000,
            easing: 'easeOutExpo'
        });
    }

    // Stagger animation for lists
    animateList(selector) {
        anime({
            targets: selector,
            opacity: [0, 1],
            translateX: [-20, 0],
            duration: 600,
            easing: 'easeOutExpo',
            delay: anime.stagger(80)
        });
    }

    // Ripple effect
    createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        
        ripple.className = 'ripple';
        ripple.style.left = `${event.clientX - rect.left}px`;
        ripple.style.top = `${event.clientY - rect.top}px`;
        
        button.appendChild(ripple);
        
        anime({
            targets: ripple,
            scale: [0, 4],
            opacity: [0.5, 0],
            duration: 600,
            easing: 'easeOutExpo',
            complete: () => ripple.remove()
        });
    }

    // Shake animation for errors
    shakeElement(element) {
        anime({
            targets: element,
            translateX: [-10, 10, -10, 10, -5, 5, 0],
            duration: 500,
            easing: 'easeInOutSine'
        });
    }

    // Success animation
    successAnimation(element) {
        anime({
            targets: element,
            scale: [1, 1.1, 1],
            backgroundColor: ['rgba(0, 255, 136, 0)', 'rgba(0, 255, 136, 0.2)', 'rgba(0, 255, 136, 0)'],
            duration: 600,
            easing: 'easeOutExpo'
        });
    }

    // Loading spinner animation
    startLoadingSpinner(element) {
        return anime({
            targets: element,
            rotate: 360,
            duration: 1000,
            easing: 'linear',
            loop: true
        });
    }

    // Morphing shape animation
    morphShape(element, pathData) {
        anime({
            targets: element,
            d: pathData,
            duration: 800,
            easing: 'easeInOutQuad'
        });
    }

    // Particle burst effect
    particleBurst(x, y, container) {
        const particles = [];
        const colors = ['#00d4ff', '#5b2d8c', '#00ff88', '#ffd93d'];
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${x}px;
                top: ${y}px;
                pointer-events: none;
            `;
            container.appendChild(particle);
            particles.push(particle);
        }

        anime({
            targets: particles,
            translateX: () => anime.random(-100, 100),
            translateY: () => anime.random(-100, 100),
            scale: [1, 0],
            opacity: [1, 0],
            duration: 1000,
            easing: 'easeOutExpo',
            complete: () => particles.forEach(p => p.remove())
        });
    }

    // Timeline for complex sequences
    createTimeline() {
        return anime.timeline({
            easing: 'easeOutExpo',
            duration: 750
        });
    }

    // Destroy all animations
    destroy() {
        Object.values(this.animations).forEach(anim => {
            if (anim && anim.pause) anim.pause();
        });
        this.animations = {};
    }
}

// Export
window.AnimeAnimations = new AnimeAnimations();
