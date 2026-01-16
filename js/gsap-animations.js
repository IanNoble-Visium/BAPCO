/* ============================================
   BAPCO TruContext Dashboard - GSAP Animations
   Video transitions, scroll effects, and advanced animations
   ============================================ */

class GSAPAnimations {
    constructor() {
        this.scrollTriggers = [];
        this.timelines = {};
        this.isInitialized = false;
    }

    // Initialize GSAP
    init() {
        if (this.isInitialized) return;
        this.isInitialized = true;

        // Register plugins
        gsap.registerPlugin(ScrollTrigger);

        // Set defaults
        gsap.defaults({
            ease: 'power3.out',
            duration: 1
        });

        this.setupScrollAnimations();
        this.setupVideoTransitions();
        this.setupParallaxEffects();
        this.setupTextAnimations();
        this.setupSectionTransitions();
    }

    // Scroll-triggered animations
    setupScrollAnimations() {
        // Fade in elements on scroll
        gsap.utils.toArray('.gsap-fade-in').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                duration: 0.8
            });
        });

        // Scale up elements
        gsap.utils.toArray('.gsap-scale-up').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                scale: 0.8,
                opacity: 0,
                duration: 0.6
            });
        });

        // Slide in from left
        gsap.utils.toArray('.gsap-slide-left').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: -100,
                opacity: 0,
                duration: 0.8
            });
        });

        // Slide in from right
        gsap.utils.toArray('.gsap-slide-right').forEach(element => {
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                x: 100,
                opacity: 0,
                duration: 0.8
            });
        });

        // Stagger children
        gsap.utils.toArray('.gsap-stagger-children').forEach(container => {
            gsap.from(container.children, {
                scrollTrigger: {
                    trigger: container,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 30,
                stagger: 0.1,
                duration: 0.6
            });
        });
    }

    // Video background transitions
    setupVideoTransitions() {
        const videoContainer = document.querySelector('.video-background');
        if (!videoContainer) return;

        // Video fade in on load
        const video = videoContainer.querySelector('video');
        if (video) {
            gsap.set(video, { opacity: 0 });
            
            video.addEventListener('canplay', () => {
                gsap.to(video, {
                    opacity: 0.3,
                    duration: 2,
                    ease: 'power2.out'
                });
            });

            // Parallax effect on scroll
            gsap.to(video, {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100,
                scale: 1.1,
                opacity: 0
            });
        }

        // Video overlay gradient animation
        const overlay = videoContainer.querySelector('.video-overlay');
        if (overlay) {
            gsap.to(overlay, {
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                },
                opacity: 1
            });
        }
    }

    // Parallax effects
    setupParallaxEffects() {
        // Hero content parallax
        gsap.to('.hero-content', {
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            y: -100,
            opacity: 0
        });

        // Background elements parallax
        gsap.utils.toArray('.parallax-bg').forEach(element => {
            const speed = element.dataset.speed || 0.5;
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                y: 100 * speed
            });
        });

        // Floating elements
        gsap.utils.toArray('.floating').forEach(element => {
            gsap.to(element, {
                y: 20,
                duration: 2,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        });
    }

    // Text animations
    setupTextAnimations() {
        // Split text animation
        gsap.utils.toArray('.split-text').forEach(element => {
            const text = element.textContent;
            element.innerHTML = text.split('').map(char => 
                `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');

            gsap.from(element.querySelectorAll('.char'), {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                rotateX: -90,
                stagger: 0.02,
                duration: 0.5
            });
        });

        // Typewriter effect
        gsap.utils.toArray('.typewriter').forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            gsap.to(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none none'
                },
                duration: text.length * 0.05,
                text: text,
                ease: 'none'
            });
        });

        // Counter animation
        gsap.utils.toArray('.counter').forEach(element => {
            const endValue = parseFloat(element.dataset.value || element.textContent);
            
            gsap.from(element, {
                scrollTrigger: {
                    trigger: element,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                textContent: 0,
                duration: 2,
                ease: 'power1.out',
                snap: { textContent: 1 },
                onUpdate: function() {
                    element.textContent = Math.round(this.targets()[0].textContent).toLocaleString();
                }
            });
        });
    }

    // Section transitions
    setupSectionTransitions() {
        // Pin sections
        gsap.utils.toArray('.pin-section').forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top top',
                end: '+=100%',
                pin: true,
                pinSpacing: true
            });
        });

        // Section reveal
        gsap.utils.toArray('.reveal-section').forEach(section => {
            const content = section.querySelector('.section-content');
            
            gsap.from(content, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 60%',
                    end: 'top 20%',
                    scrub: 1
                },
                y: 100,
                opacity: 0,
                scale: 0.9
            });
        });

        // Horizontal scroll sections
        const horizontalSections = document.querySelectorAll('.horizontal-scroll');
        horizontalSections.forEach(section => {
            const container = section.querySelector('.horizontal-container');
            if (!container) return;

            const scrollWidth = container.scrollWidth - section.offsetWidth;

            gsap.to(container, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top top',
                    end: `+=${scrollWidth}`,
                    scrub: 1,
                    pin: true
                },
                x: -scrollWidth,
                ease: 'none'
            });
        });
    }

    // Page transition animations
    pageEnter() {
        const tl = gsap.timeline();
        
        tl.from('.page-wrapper', {
            opacity: 0,
            duration: 0.5
        })
        .from('.main-content', {
            y: 50,
            opacity: 0,
            duration: 0.6
        }, '-=0.3')
        .from('.sidebar', {
            x: -50,
            opacity: 0,
            duration: 0.5
        }, '-=0.4');

        return tl;
    }

    pageLeave() {
        const tl = gsap.timeline();
        
        tl.to('.main-content', {
            y: -30,
            opacity: 0,
            duration: 0.4
        })
        .to('.page-wrapper', {
            opacity: 0,
            duration: 0.3
        }, '-=0.2');

        return tl;
    }

    // Dashboard specific animations
    animateDashboardEntry() {
        const tl = gsap.timeline();

        // Sidebar animation
        tl.from('.sidebar', {
            x: -100,
            opacity: 0,
            duration: 0.6
        })
        // Header animation
        .from('.dashboard-header', {
            y: -50,
            opacity: 0,
            duration: 0.5
        }, '-=0.3')
        // KPI cards stagger
        .from('.kpi-card', {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5
        }, '-=0.2')
        // Chart cards stagger
        .from('.chart-card', {
            scale: 0.9,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5
        }, '-=0.3');

        return tl;
    }

    // Alert notification animation
    showAlert(element) {
        gsap.fromTo(element, 
            {
                x: 100,
                opacity: 0,
                scale: 0.8
            },
            {
                x: 0,
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            }
        );
    }

    hideAlert(element) {
        return gsap.to(element, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in'
        });
    }

    // Modal animations
    openModal(modal) {
        const tl = gsap.timeline();
        
        tl.fromTo(modal, 
            { display: 'none', opacity: 0 },
            { display: 'flex', opacity: 1, duration: 0.3 }
        )
        .fromTo(modal.querySelector('.modal-content'),
            { scale: 0.8, y: 50 },
            { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' },
            '-=0.1'
        );

        return tl;
    }

    closeModal(modal) {
        const tl = gsap.timeline();
        
        tl.to(modal.querySelector('.modal-content'), {
            scale: 0.8,
            y: 50,
            duration: 0.3,
            ease: 'power2.in'
        })
        .to(modal, {
            opacity: 0,
            duration: 0.2,
            onComplete: () => modal.style.display = 'none'
        }, '-=0.1');

        return tl;
    }

    // Loading animation
    showLoading(container) {
        const loader = document.createElement('div');
        loader.className = 'gsap-loader';
        loader.innerHTML = `
            <div class="loader-spinner"></div>
            <div class="loader-text">Loading...</div>
        `;
        container.appendChild(loader);

        gsap.fromTo(loader, 
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
        );

        gsap.to(loader.querySelector('.loader-spinner'), {
            rotation: 360,
            duration: 1,
            ease: 'none',
            repeat: -1
        });

        return loader;
    }

    hideLoading(loader) {
        return gsap.to(loader, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => loader.remove()
        });
    }

    // Progress animation
    animateProgress(element, value) {
        gsap.to(element, {
            width: `${value}%`,
            duration: 1,
            ease: 'power2.out'
        });
    }

    // Gauge animation
    animateGauge(element, value, max) {
        const rotation = (value / max) * 270 - 135;
        gsap.to(element, {
            rotation: rotation,
            duration: 1.5,
            ease: 'elastic.out(1, 0.5)'
        });
    }

    // Data update animation
    animateDataUpdate(element) {
        gsap.fromTo(element,
            { backgroundColor: 'rgba(0, 212, 255, 0.3)' },
            { 
                backgroundColor: 'transparent',
                duration: 1,
                ease: 'power2.out'
            }
        );
    }

    // Pulse effect
    pulse(element, color = '#00d4ff') {
        gsap.fromTo(element,
            { boxShadow: `0 0 0 0 ${color}` },
            {
                boxShadow: `0 0 0 20px transparent`,
                duration: 1,
                ease: 'power2.out'
            }
        );
    }

    // Magnetic button effect
    setupMagneticButtons() {
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.3,
                    ease: 'power2.out'
                });
            });

            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.5,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // Cursor follower
    setupCursorFollower() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        gsap.set(cursor, { xPercent: -50, yPercent: -50 });

        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3,
                ease: 'power2.out'
            });
        });

        // Scale up on interactive elements
        document.querySelectorAll('a, button, .interactive').forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, { scale: 2, duration: 0.3 });
            });
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, { scale: 1, duration: 0.3 });
            });
        });
    }

    // Cleanup
    destroy() {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        Object.values(this.timelines).forEach(tl => tl.kill());
    }
}

// Export
window.GSAPAnimations = new GSAPAnimations();
