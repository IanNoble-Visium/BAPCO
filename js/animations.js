/* ============================================
   BAPCO TruContext Dashboard - Animations Module
   Advanced animations using anime.js and GSAP
   ============================================ */

const Animations = {
    // Store animation instances
    instances: {},
    
    // Initialize all animations
    init() {
        this.initParticleEffects();
        this.initMagneticButtons();
        this.initTextSplitting();
        this.initHoverEffects();
        this.initScrollAnimations();
        this.initDataFlowAnimations();
        this.initPulseEffects();
    },
    
    /* ============================================
       PARTICLE EFFECTS
       ============================================ */
    initParticleEffects() {
        // Create floating particles in hero section
        const heroCanvas = document.getElementById('heroCanvas');
        if (!heroCanvas) return;
        
        const ctx = heroCanvas.getContext('2d');
        heroCanvas.width = window.innerWidth;
        heroCanvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 100;
        
        // Particle class
        class Particle {
            constructor() {
                this.reset();
            }
            
            reset() {
                this.x = Math.random() * heroCanvas.width;
                this.y = Math.random() * heroCanvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.2;
                this.color = Math.random() > 0.5 ? '0, 212, 255' : '91, 45, 140';
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                // Wrap around edges
                if (this.x < 0) this.x = heroCanvas.width;
                if (this.x > heroCanvas.width) this.x = 0;
                if (this.y < 0) this.y = heroCanvas.height;
                if (this.y > heroCanvas.height) this.y = 0;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
                
                // Glow effect
                ctx.shadowColor = `rgba(${this.color}, 0.5)`;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        // Create particles
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Draw connections between nearby particles
        function drawConnections() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
        
        // Animation loop
        function animate() {
            ctx.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
            
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            drawConnections();
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Handle resize
        window.addEventListener('resize', () => {
            heroCanvas.width = window.innerWidth;
            heroCanvas.height = window.innerHeight;
        });
    },
    
    /* ============================================
       MAGNETIC BUTTONS
       ============================================ */
    initMagneticButtons() {
        const buttons = document.querySelectorAll('.magnetic-btn, .control-btn, .nav-link');
        
        buttons.forEach(btn => {
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
    },
    
    /* ============================================
       TEXT SPLITTING & ANIMATIONS
       ============================================ */
    initTextSplitting() {
        // Split text into characters for animation
        document.querySelectorAll('.split-text').forEach(el => {
            const text = el.textContent;
            el.innerHTML = text.split('').map(char => 
                `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`
            ).join('');
        });
        
        // Animate split text on scroll
        document.querySelectorAll('.split-text').forEach(el => {
            gsap.from(el.querySelectorAll('.char'), {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 50,
                rotateX: -90,
                stagger: 0.02,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
        });
    },
    
    /* ============================================
       HOVER EFFECTS
       ============================================ */
    initHoverEffects() {
        // Card hover effects
        document.querySelectorAll('.chart-card, .kpi-card, .section-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                anime({
                    targets: card,
                    scale: 1.02,
                    boxShadow: '0 20px 60px rgba(0, 212, 255, 0.15)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
                
                // Animate inner elements
                anime({
                    targets: card.querySelectorAll('.chart-header h4, .kpi-value'),
                    color: '#00d4ff',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
            
            card.addEventListener('mouseleave', () => {
                anime({
                    targets: card,
                    scale: 1,
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
                
                anime({
                    targets: card.querySelectorAll('.chart-header h4, .kpi-value'),
                    color: '#ffffff',
                    duration: 300,
                    easing: 'easeOutQuad'
                });
            });
        });
        
        // Button ripple effect
        document.querySelectorAll('.btn, .control-btn, .range-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = `${x}px`;
                ripple.style.top = `${y}px`;
                btn.appendChild(ripple);
                
                anime({
                    targets: ripple,
                    scale: [0, 4],
                    opacity: [0.5, 0],
                    duration: 600,
                    easing: 'easeOutQuad',
                    complete: () => ripple.remove()
                });
            });
        });
    },
    
    /* ============================================
       SCROLL ANIMATIONS
       ============================================ */
    initScrollAnimations() {
        // Parallax scrolling
        gsap.utils.toArray('.parallax').forEach(el => {
            const speed = el.dataset.speed || 0.5;
            
            gsap.to(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                },
                y: (i, target) => -ScrollTrigger.maxScroll(window) * speed,
                ease: 'none'
            });
        });
        
        // Reveal animations
        gsap.utils.toArray('.reveal').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 60,
                duration: 0.8,
                ease: 'power3.out'
            });
        });
        
        // Staggered grid animations
        gsap.utils.toArray('.stagger-grid').forEach(grid => {
            gsap.from(grid.children, {
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse'
                },
                opacity: 0,
                y: 40,
                scale: 0.95,
                stagger: {
                    amount: 0.5,
                    grid: 'auto',
                    from: 'start'
                },
                duration: 0.6,
                ease: 'back.out(1.5)'
            });
        });
    },
    
    /* ============================================
       DATA FLOW ANIMATIONS
       ============================================ */
    initDataFlowAnimations() {
        // Animate data flow lines
        document.querySelectorAll('.data-flow-line').forEach(line => {
            anime({
                targets: line,
                strokeDashoffset: [anime.setDashoffset, 0],
                easing: 'easeInOutSine',
                duration: 2000,
                loop: true,
                direction: 'alternate'
            });
        });
        
        // Animate progress bars
        document.querySelectorAll('.progress-bar').forEach(bar => {
            const progress = getComputedStyle(bar).getPropertyValue('--progress');
            
            gsap.fromTo(bar, 
                { width: '0%' },
                {
                    width: progress,
                    duration: 1.5,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
        
        // Animate bar fills
        document.querySelectorAll('.bar-fill').forEach(bar => {
            const fill = getComputedStyle(bar).getPropertyValue('--fill');
            
            gsap.fromTo(bar,
                { width: '0%' },
                {
                    width: fill,
                    duration: 1.2,
                    ease: 'power2.out',
                    scrollTrigger: {
                        trigger: bar,
                        start: 'top 90%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    },
    
    /* ============================================
       PULSE EFFECTS
       ============================================ */
    initPulseEffects() {
        // Status dots pulse
        anime({
            targets: '.status-dot, .live-dot',
            scale: [1, 1.3, 1],
            opacity: [1, 0.7, 1],
            easing: 'easeInOutSine',
            duration: 1500,
            loop: true
        });
        
        // Alert badges pulse
        anime({
            targets: '.alert-count, .nav-badge',
            scale: [1, 1.1, 1],
            easing: 'easeInOutSine',
            duration: 1000,
            loop: true
        });
        
        // AI indicator pulse
        anime({
            targets: '.ai-pulse',
            scale: [1, 1.5],
            opacity: [0.8, 0],
            easing: 'easeOutQuad',
            duration: 1500,
            loop: true
        });
    },
    
    /* ============================================
       COUNTER ANIMATIONS
       ============================================ */
    animateCounter(element, start, end, duration = 2000, suffix = '') {
        const obj = { value: start };
        
        anime({
            targets: obj,
            value: end,
            round: end % 1 === 0 ? 1 : 10,
            easing: 'easeOutExpo',
            duration: duration,
            update: () => {
                element.textContent = obj.value.toLocaleString() + suffix;
            }
        });
    },
    
    /* ============================================
       GAUGE ANIMATIONS
       ============================================ */
    animateGauge(canvasId, value, maxValue, color) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 15;
        
        let currentValue = 0;
        
        anime({
            targets: { val: 0 },
            val: value,
            easing: 'easeOutExpo',
            duration: 2000,
            update: (anim) => {
                currentValue = anim.animations[0].currentValue;
                drawGaugeFrame(ctx, centerX, centerY, radius, currentValue, maxValue, color);
            }
        });
    },
    
    /* ============================================
       CHART ENTRY ANIMATIONS
       ============================================ */
    animateChartEntry(chart) {
        if (!chart) return;
        
        // Animate chart data from zero
        const originalData = chart.data.datasets.map(ds => [...ds.data]);
        
        chart.data.datasets.forEach(ds => {
            ds.data = ds.data.map(() => 0);
        });
        chart.update('none');
        
        anime({
            targets: { progress: 0 },
            progress: 1,
            easing: 'easeOutExpo',
            duration: 1500,
            update: (anim) => {
                const progress = anim.animations[0].currentValue;
                chart.data.datasets.forEach((ds, i) => {
                    ds.data = originalData[i].map(val => val * progress);
                });
                chart.update('none');
            }
        });
    },
    
    /* ============================================
       NOTIFICATION ANIMATIONS
       ============================================ */
    showNotification(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${this.getToastIcon(type)}</div>
            <div class="toast-message">${message}</div>
            <button class="toast-close">×</button>
        `;
        
        container.appendChild(toast);
        
        // Entry animation
        anime({
            targets: toast,
            translateX: [100, 0],
            opacity: [0, 1],
            easing: 'easeOutElastic(1, 0.8)',
            duration: 800
        });
        
        // Progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'toast-progress';
        toast.appendChild(progressBar);
        
        anime({
            targets: progressBar,
            width: ['100%', '0%'],
            easing: 'linear',
            duration: 5000
        });
        
        // Auto dismiss
        setTimeout(() => this.dismissNotification(toast), 5000);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => {
            this.dismissNotification(toast);
        });
    },
    
    dismissNotification(toast) {
        anime({
            targets: toast,
            translateX: 100,
            opacity: 0,
            easing: 'easeInQuad',
            duration: 300,
            complete: () => toast.remove()
        });
    },
    
    getToastIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌',
            critical: '🚨'
        };
        return icons[type] || icons.info;
    },
    
    /* ============================================
       PAGE TRANSITION ANIMATIONS
       ============================================ */
    pageTransitionOut(element) {
        return anime({
            targets: element,
            opacity: [1, 0],
            translateY: [0, -30],
            easing: 'easeInQuad',
            duration: 400
        }).finished;
    },
    
    pageTransitionIn(element) {
        return anime({
            targets: element,
            opacity: [0, 1],
            translateY: [30, 0],
            easing: 'easeOutQuad',
            duration: 500
        }).finished;
    },
    
    /* ============================================
       MORPHING ANIMATIONS
       ============================================ */
    morphShape(element, fromPath, toPath, duration = 1000) {
        anime({
            targets: element,
            d: [
                { value: fromPath },
                { value: toPath }
            ],
            easing: 'easeInOutQuad',
            duration: duration,
            loop: true,
            direction: 'alternate'
        });
    },
    
    /* ============================================
       PHYSICS-BASED ANIMATIONS
       ============================================ */
    springAnimation(element, properties) {
        return anime({
            targets: element,
            ...properties,
            easing: 'spring(1, 80, 10, 0)',
            duration: 1000
        });
    },
    
    bounceAnimation(element) {
        return anime({
            targets: element,
            translateY: [0, -20, 0],
            easing: 'easeOutBounce',
            duration: 800
        });
    },
    
    elasticScale(element, scale = 1.1) {
        return anime({
            targets: element,
            scale: [1, scale, 1],
            easing: 'easeOutElastic(1, 0.5)',
            duration: 1000
        });
    },
    
    /* ============================================
       UTILITY FUNCTIONS
       ============================================ */
    staggerAnimation(elements, properties, staggerDelay = 100) {
        return anime({
            targets: elements,
            ...properties,
            delay: anime.stagger(staggerDelay),
            easing: 'easeOutQuad'
        });
    },
    
    typewriter(element, text, speed = 50) {
        element.textContent = '';
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        };
        
        type();
    },
    
    glitchEffect(element, duration = 500) {
        const originalText = element.textContent;
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        
        let iterations = 0;
        const maxIterations = duration / 50;
        
        const interval = setInterval(() => {
            element.textContent = originalText
                .split('')
                .map((char, index) => {
                    if (index < iterations) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');
            
            iterations += 1 / 3;
            
            if (iterations >= originalText.length) {
                clearInterval(interval);
                element.textContent = originalText;
            }
        }, 50);
    }
};

// Helper function for gauge drawing
function drawGaugeFrame(ctx, cx, cy, radius, value, maxValue, color) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Background arc
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.75, Math.PI * 2.25, false);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Value arc
    const progress = value / maxValue;
    const endAngle = Math.PI * 0.75 + (Math.PI * 1.5 * progress);
    
    ctx.beginPath();
    ctx.arc(cx, cy, radius, Math.PI * 0.75, endAngle, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    
    // Glow
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    Animations.init();
});

// Export
window.Animations = Animations;
