/* ============================================
   BAPCO TruContext Dashboard - Barba.js Transitions
   Smooth page transitions and SPA-like experience
   ============================================ */

class BarbaTransitions {
    constructor() {
        this.isInitialized = false;
        this.currentPage = 'overview';
    }

    // Initialize Barba.js
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Initialize Barba
        barba.init({
            debug: false,
            preventRunning: true,
            transitions: [
                this.getDefaultTransition(),
                this.getFadeTransition(),
                this.getSlideTransition(),
                this.getClipTransition()
            ],
            views: [
                this.getOverviewView(),
                this.getProcessView(),
                this.getEquipmentView(),
                this.getSafetyView(),
                this.getCyberView()
            ]
        });

        // Setup hooks
        this.setupHooks();
    }

    // Default transition
    getDefaultTransition() {
        return {
            name: 'default-transition',
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    y: -30,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            },
            enter(data) {
                gsap.set(data.next.container, { opacity: 0, y: 30 });
                return gsap.to(data.next.container, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        };
    }

    // Fade transition
    getFadeTransition() {
        return {
            name: 'fade',
            from: { custom: ({ trigger }) => trigger.dataset && trigger.dataset.transition === 'fade' },
            leave(data) {
                return gsap.to(data.current.container, {
                    opacity: 0,
                    duration: 0.3
                });
            },
            enter(data) {
                gsap.set(data.next.container, { opacity: 0 });
                return gsap.to(data.next.container, {
                    opacity: 1,
                    duration: 0.4
                });
            }
        };
    }

    // Slide transition
    getSlideTransition() {
        return {
            name: 'slide',
            from: { custom: ({ trigger }) => trigger.dataset && trigger.dataset.transition === 'slide' },
            leave(data) {
                const direction = data.trigger.dataset.direction || 'left';
                const xValue = direction === 'left' ? -100 : 100;
                
                return gsap.to(data.current.container, {
                    x: xValue,
                    opacity: 0,
                    duration: 0.4,
                    ease: 'power2.in'
                });
            },
            enter(data) {
                const direction = data.trigger.dataset.direction || 'left';
                const xValue = direction === 'left' ? 100 : -100;
                
                gsap.set(data.next.container, { x: xValue, opacity: 0 });
                return gsap.to(data.next.container, {
                    x: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            }
        };
    }

    // Clip/reveal transition
    getClipTransition() {
        return {
            name: 'clip',
            from: { custom: ({ trigger }) => trigger.dataset && trigger.dataset.transition === 'clip' },
            leave(data) {
                return gsap.to(data.current.container, {
                    clipPath: 'inset(0 100% 0 0)',
                    duration: 0.5,
                    ease: 'power3.in'
                });
            },
            enter(data) {
                gsap.set(data.next.container, { clipPath: 'inset(0 0 0 100%)' });
                return gsap.to(data.next.container, {
                    clipPath: 'inset(0 0 0 0)',
                    duration: 0.6,
                    ease: 'power3.out'
                });
            }
        };
    }

    // Overview page view
    getOverviewView() {
        return {
            namespace: 'overview',
            beforeEnter() {
                console.log('Entering Overview');
            },
            afterEnter() {
                // Initialize overview-specific components
                if (window.DashboardCharts) {
                    window.DashboardCharts.initKPICharts();
                }
                if (window.ThreeScenes) {
                    window.ThreeScenes.initFacilityScene('facilityCanvas');
                }
                if (window.AnimeAnimations) {
                    window.AnimeAnimations.animateKPICards();
                }
            }
        };
    }

    // Process monitoring view
    getProcessView() {
        return {
            namespace: 'process',
            beforeEnter() {
                console.log('Entering Process Monitoring');
            },
            afterEnter() {
                if (window.DashboardCharts) {
                    window.DashboardCharts.initTemperatureChart();
                    window.DashboardCharts.initPressureChart();
                    window.DashboardCharts.initFlowChart();
                    window.DashboardCharts.initYieldChart();
                    window.DashboardCharts.initGauges();
                    window.DashboardCharts.initTowerCanvas();
                }
            }
        };
    }

    // Equipment health view
    getEquipmentView() {
        return {
            namespace: 'equipment',
            beforeEnter() {
                console.log('Entering Equipment Health');
            },
            afterEnter() {
                if (window.ThreeScenes) {
                    window.ThreeScenes.initEquipmentScene('equipmentCanvas');
                }
                if (window.DashboardCharts) {
                    window.DashboardCharts.initVibrationChart();
                    window.DashboardCharts.initMotorChart();
                    window.DashboardCharts.initBearingChart();
                    window.DashboardCharts.initRULChart();
                }
            }
        };
    }

    // Safety view
    getSafetyView() {
        return {
            namespace: 'safety',
            beforeEnter() {
                console.log('Entering Safety Dashboard');
            },
            afterEnter() {
                if (window.DashboardCharts) {
                    window.DashboardCharts.initEmissionsChart();
                    window.DashboardCharts.initPersonnelMap();
                }
            }
        };
    }

    // Cyber security view
    getCyberView() {
        return {
            namespace: 'cyber',
            beforeEnter() {
                console.log('Entering Cyber Security');
            },
            afterEnter() {
                if (window.DashboardCharts) {
                    window.DashboardCharts.initAnomalyChart();
                    window.DashboardCharts.initNetworkCanvas();
                }
            }
        };
    }

    // Setup hooks
    setupHooks() {
        // Before leave hook
        barba.hooks.beforeLeave((data) => {
            // Cleanup current page
            this.cleanupPage(data.current.namespace);
            
            // Show loading indicator
            this.showPageLoader();
        });

        // After leave hook
        barba.hooks.afterLeave((data) => {
            // Scroll to top
            window.scrollTo(0, 0);
        });

        // Before enter hook
        barba.hooks.beforeEnter((data) => {
            // Update navigation
            this.updateNavigation(data.next.namespace);
        });

        // After enter hook
        barba.hooks.after((data) => {
            // Hide loading indicator
            this.hidePageLoader();
            
            // Reinitialize animations
            if (window.AnimeAnimations) {
                window.AnimeAnimations.setupScrollAnimations();
                window.AnimeAnimations.setupHoverEffects();
            }
            
            if (window.GSAPAnimations) {
                window.GSAPAnimations.setupScrollAnimations();
            }

            // Update current page
            this.currentPage = data.next.namespace;
        });
    }

    // Cleanup page resources
    cleanupPage(namespace) {
        // Destroy charts
        if (window.DashboardCharts) {
            Object.values(window.DashboardCharts.charts).forEach(chart => {
                if (chart && chart.destroy) chart.destroy();
            });
            window.DashboardCharts.charts = {};
        }

        // Cleanup Three.js scenes
        if (window.ThreeScenes) {
            window.ThreeScenes.dispose(namespace);
        }

        // Kill GSAP ScrollTriggers
        if (window.ScrollTrigger) {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        }
    }

    // Update navigation active state
    updateNavigation(namespace) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.page === namespace) {
                item.classList.add('active');
            }
        });
    }

    // Show page loader
    showPageLoader() {
        let loader = document.querySelector('.page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">Loading...</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        
        gsap.to(loader, {
            opacity: 1,
            visibility: 'visible',
            duration: 0.2
        });
    }

    // Hide page loader
    hidePageLoader() {
        const loader = document.querySelector('.page-loader');
        if (loader) {
            gsap.to(loader, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    loader.style.visibility = 'hidden';
                }
            });
        }
    }

    // Navigate to page programmatically
    navigateTo(url, transition = 'default') {
        barba.go(url, {
            trigger: {
                dataset: { transition }
            }
        });
    }

    // Prefetch page
    prefetch(url) {
        barba.prefetch(url);
    }
}

// Export
window.BarbaTransitions = new BarbaTransitions();

/* ============================================
   Internal Page Navigation (SPA-like)
   For single-page dashboard navigation
   ============================================ */

class InternalNavigation {
    constructor() {
        this.pages = {};
        this.currentPage = 'overview';
        this.transitionDuration = 500;
    }

    init() {
        // Cache page elements
        document.querySelectorAll('[data-page]').forEach(page => {
            this.pages[page.dataset.page] = page;
        });

        // Setup navigation clicks
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.dataset.target || item.dataset.page;
                if (targetPage && targetPage !== this.currentPage) {
                    this.navigateTo(targetPage);
                }
            });
        });

        // Show initial page
        this.showPage(this.currentPage, false);
    }

    navigateTo(pageId) {
        if (!this.pages[pageId]) return;

        const currentPageEl = this.pages[this.currentPage];
        const nextPageEl = this.pages[pageId];

        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.toggle('active', item.dataset.target === pageId || item.dataset.page === pageId);
        });

        // Transition out current page
        gsap.to(currentPageEl, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                currentPageEl.classList.remove('active');
                currentPageEl.style.display = 'none';

                // Transition in next page
                nextPageEl.style.display = 'block';
                nextPageEl.classList.add('active');
                
                gsap.fromTo(nextPageEl, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.4,
                        ease: 'power2.out',
                        onComplete: () => {
                            this.onPageEnter(pageId);
                        }
                    }
                );
            }
        });

        this.currentPage = pageId;
    }

    showPage(pageId, animate = true) {
        Object.entries(this.pages).forEach(([id, el]) => {
            if (id === pageId) {
                el.style.display = 'block';
                el.classList.add('active');
                if (animate) {
                    gsap.fromTo(el,
                        { opacity: 0, y: 20 },
                        { opacity: 1, y: 0, duration: 0.4 }
                    );
                }
            } else {
                el.style.display = 'none';
                el.classList.remove('active');
            }
        });

        this.currentPage = pageId;
        this.onPageEnter(pageId);
    }

    onPageEnter(pageId) {
        // Initialize page-specific components
        switch (pageId) {
            case 'overview':
                if (window.DashboardCharts) {
                    window.DashboardCharts.initKPICharts();
                }
                if (window.ThreeScenes) {
                    window.ThreeScenes.initFacilityScene('facilityCanvas');
                }
                break;

            case 'process':
                if (window.DashboardCharts) {
                    window.DashboardCharts.initTemperatureChart();
                    window.DashboardCharts.initPressureChart();
                    window.DashboardCharts.initFlowChart();
                    window.DashboardCharts.initYieldChart();
                    window.DashboardCharts.initGauges();
                    window.DashboardCharts.initTowerCanvas();
                }
                break;

            case 'equipment':
                if (window.ThreeScenes) {
                    window.ThreeScenes.initEquipmentScene('equipmentCanvas');
                }
                if (window.DashboardCharts) {
                    window.DashboardCharts.initVibrationChart();
                    window.DashboardCharts.initMotorChart();
                    window.DashboardCharts.initBearingChart();
                    window.DashboardCharts.initRULChart();
                }
                break;

            case 'safety':
                if (window.DashboardCharts) {
                    window.DashboardCharts.initEmissionsChart();
                    window.DashboardCharts.initPersonnelMap();
                }
                break;

            case 'cyber':
                if (window.DashboardCharts) {
                    window.DashboardCharts.initAnomalyChart();
                    window.DashboardCharts.initNetworkCanvas();
                }
                break;
        }

        // Reinitialize animations
        if (window.AnimeAnimations) {
            window.AnimeAnimations.setupScrollAnimations();
        }
    }
}

// Export
window.InternalNavigation = new InternalNavigation();
