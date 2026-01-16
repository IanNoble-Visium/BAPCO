/* ============================================
   BAPCO TruContext Dashboard - Main Application
   Entry point and orchestration
   ============================================ */

// Global State
const AppState = {
    currentPage: 'landing',
    isLoading: true,
    theme: 'dark',
    realTimeEnabled: true,
    updateInterval: null,
    charts: {},
    scenes: {}
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initNavigation();
    initDateTime();
    initPageTransitions();
    initRealTimeUpdates();
    initInteractivity();
    
    // Start loading sequence
    setTimeout(() => {
        hidePreloader();
        initAnimations();
    }, 2500);
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
    const progressBar = document.querySelector('.loader-progress-bar');
    const loaderText = document.querySelector('.loader-text');
    
    const loadingSteps = [
        { progress: 20, text: 'Loading 3D Assets...' },
        { progress: 40, text: 'Connecting to SCADA...' },
        { progress: 60, text: 'Fetching Real-time Data...' },
        { progress: 80, text: 'Initializing AI Analytics...' },
        { progress: 100, text: 'Ready!' }
    ];
    
    let currentStep = 0;
    
    const updateProgress = () => {
        if (currentStep < loadingSteps.length) {
            const step = loadingSteps[currentStep];
            
            gsap.to(progressBar, {
                width: `${step.progress}%`,
                duration: 0.5,
                ease: 'power2.out'
            });
            
            if (loaderText) {
                loaderText.textContent = step.text;
            }
            
            currentStep++;
            setTimeout(updateProgress, 500);
        }
    };
    
    updateProgress();
    
    // Particle animation in preloader
    initPreloaderParticles();
}

function initPreloaderParticles() {
    const container = document.getElementById('preloaderParticles');
    if (!container) return;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        container.appendChild(particle);
        
        gsap.to(particle, {
            y: -100 - Math.random() * 200,
            x: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 2 + Math.random() * 2,
            repeat: -1,
            ease: 'power1.out'
        });
    }
}

function hidePreloader() {
    const preloader = document.getElementById('preloader');
    if (!preloader) return;
    
    gsap.to(preloader, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
            preloader.style.display = 'none';
            AppState.isLoading = false;
            
            // Trigger landing page animations
            animateLandingPage();
        }
    });
}

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetPage = link.dataset.page;
            navigateToPage(targetPage);
        });
        
        // Hover effects
        link.addEventListener('mouseenter', () => {
            anime({
                targets: link,
                scale: 1.05,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
        
        link.addEventListener('mouseleave', () => {
            anime({
                targets: link,
                scale: 1,
                duration: 200,
                easing: 'easeOutQuad'
            });
        });
    });
}

function navigateToPage(pageName) {
    if (AppState.currentPage === pageName) return;
    
    const currentSection = document.querySelector('.page-section.active');
    const targetSection = document.getElementById(pageName);
    
    if (!targetSection) return;
    
    // Update nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageName);
    });
    
    // Page transition
    gsap.timeline()
        .to(currentSection, {
            opacity: 0,
            y: -30,
            duration: 0.4,
            ease: 'power2.in',
            onComplete: () => {
                currentSection.classList.remove('active');
            }
        })
        .set(targetSection, { display: 'block', opacity: 0, y: 30 })
        .add(() => {
            targetSection.classList.add('active');
            AppState.currentPage = pageName;
            initPageContent(pageName);
        })
        .to(targetSection, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
}

function initPageContent(pageName) {
    switch(pageName) {
        case 'landing':
            animateLandingPage();
            break;
        case 'facility':
            initFacilityPage();
            break;
        case 'process':
            initProcessPage();
            break;
        case 'equipment':
            initEquipmentPage();
            break;
        case 'safety':
            initSafetyPage();
            break;
        case 'cyber':
            initCyberPage();
            break;
    }
}

/* ============================================
   DATE/TIME
   ============================================ */
function initDateTime() {
    const updateDateTime = () => {
        const now = new Date();
        const dateTimeEl = document.getElementById('navDateTime');
        
        if (dateTimeEl) {
            const options = { 
                weekday: 'short', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            dateTimeEl.textContent = now.toLocaleDateString('en-US', options);
        }
    };
    
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

/* ============================================
   PAGE TRANSITIONS (Barba.js style)
   ============================================ */
function initPageTransitions() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                e.preventDefault();
                navigateToPage(targetId);
            }
        });
    });
}

/* ============================================
   REAL-TIME UPDATES
   ============================================ */
function initRealTimeUpdates() {
    if (!AppState.realTimeEnabled) return;
    
    // Update every 5 seconds
    AppState.updateInterval = setInterval(() => {
        updateRealTimeData();
    }, 5000);
    
    // Initial update
    updateRealTimeData();
}

function updateRealTimeData() {
    // Update KPIs with animation
    const kpis = {
        production: { value: 372450 + Math.floor(Math.random() * 5000 - 2500), trend: '+3.2%' },
        efficiency: { value: (94.7 + Math.random() * 0.5 - 0.25).toFixed(1), trend: '+1.8%' },
        energy: { value: 3420 + Math.floor(Math.random() * 100 - 50), trend: '-2.1%' },
        water: { value: 12450 + Math.floor(Math.random() * 200 - 100), trend: '-5.4%' }
    };
    
    // Animate KPI updates
    Object.entries(kpis).forEach(([key, data]) => {
        const el = document.getElementById(`kpi${key.charAt(0).toUpperCase() + key.slice(1)}`);
        if (el) {
            animateValue(el, parseFloat(el.textContent.replace(/,/g, '')) || 0, data.value, 1000);
        }
    });
    
    // Update charts if they exist
    if (AppState.charts.temperature) {
        updateChartData(AppState.charts.temperature);
    }
    if (AppState.charts.pressure) {
        updateChartData(AppState.charts.pressure);
    }
}

function animateValue(element, start, end, duration) {
    const startTime = performance.now();
    const isDecimal = String(end).includes('.');
    
    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
        
        const current = start + (end - start) * easeProgress;
        
        if (isDecimal) {
            element.textContent = current.toFixed(1) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };
    
    requestAnimationFrame(update);
}

function updateChartData(chart) {
    if (!chart || !chart.data) return;
    
    chart.data.datasets.forEach(dataset => {
        dataset.data.shift();
        dataset.data.push(dataset.data[dataset.data.length - 1] + (Math.random() * 10 - 5));
    });
    
    chart.update('none');
}

/* ============================================
   INTERACTIVITY
   ============================================ */
function initInteractivity() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            const parent = btn.closest('.sidebar-content') || btn.closest('.facility-sidebar');
            
            // Update buttons
            btn.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Update content
            if (parent) {
                parent.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const targetContent = document.getElementById(`${tabId}Tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    
                    // Animate in
                    gsap.from(targetContent, {
                        opacity: 0,
                        y: 20,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }
            }
        });
    });
    
    // Control buttons
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.querySelectorAll('.control-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const view = btn.dataset.view;
            if (view && AppState.scenes.facility) {
                switchFacilityView(view);
            }
        });
    });
    
    // Range buttons
    document.querySelectorAll('.range-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.parentElement.querySelectorAll('.range-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const range = btn.dataset.range;
            updateChartsTimeRange(range);
        });
    });
    
    // Viewport controls
    initViewportControls();
    
    // Section cards hover
    document.querySelectorAll('.section-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                scale: 1.02,
                boxShadow: '0 10px 40px rgba(0, 212, 255, 0.2)',
                duration: 0.3
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                scale: 1,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
                duration: 0.3
            });
        });
    });
}

function initViewportControls() {
    const zoomIn = document.getElementById('zoomIn');
    const zoomOut = document.getElementById('zoomOut');
    const resetView = document.getElementById('resetView');
    const toggleRotate = document.getElementById('toggleRotate');
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            if (AppState.scenes.facility) {
                AppState.scenes.facility.camera.position.z *= 0.9;
            }
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            if (AppState.scenes.facility) {
                AppState.scenes.facility.camera.position.z *= 1.1;
            }
        });
    }
    
    if (resetView) {
        resetView.addEventListener('click', () => {
            if (AppState.scenes.facility) {
                gsap.to(AppState.scenes.facility.camera.position, {
                    x: 0,
                    y: 5,
                    z: 10,
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }
        });
    }
    
    if (toggleRotate) {
        toggleRotate.addEventListener('click', () => {
            toggleRotate.classList.toggle('active');
            if (AppState.scenes.facility) {
                AppState.scenes.facility.autoRotate = !AppState.scenes.facility.autoRotate;
            }
        });
    }
}

/* ============================================
   PAGE-SPECIFIC INITIALIZATIONS
   ============================================ */

// Landing Page
function animateLandingPage() {
    // Hero text animation
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroBadge = document.querySelector('.hero-badge');
    const heroStats = document.querySelectorAll('.stat-card');
    
    const tl = gsap.timeline();
    
    if (heroBadge) {
        tl.from(heroBadge, {
            opacity: 0,
            y: -30,
            duration: 0.6,
            ease: 'power2.out'
        });
    }
    
    if (heroTitle) {
        tl.from('.title-line', {
            opacity: 0,
            y: 50,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.3');
    }
    
    if (heroSubtitle) {
        tl.from(heroSubtitle, {
            opacity: 0,
            y: 20,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4');
    }
    
    if (heroStats.length) {
        tl.from(heroStats, {
            opacity: 0,
            y: 30,
            scale: 0.9,
            stagger: 0.1,
            duration: 0.5,
            ease: 'back.out(1.5)'
        }, '-=0.2');
        
        // Animate stat values
        heroStats.forEach(stat => {
            const valueEl = stat.querySelector('.stat-value');
            if (valueEl) {
                const targetValue = parseFloat(valueEl.dataset.count);
                animateValue(valueEl, 0, targetValue, 2000);
            }
        });
    }
    
    // Initialize hero 3D scene
    if (typeof ThreeScenes !== 'undefined') {
        ThreeScenes.initHeroRefinery('hero3DRefinery');
    }
    
    // Scroll indicator animation
    gsap.to('.scroll-wheel', {
        y: 8,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'power1.inOut'
    });
}

// Facility Page
function initFacilityPage() {
    // Initialize 3D facility view
    if (typeof ThreeScenes !== 'undefined') {
        ThreeScenes.initFacility3D('facility3DCanvas');
    }
    
    // Populate activity list
    populateActivityList();
    
    // Animate section cards
    gsap.from('.section-card', {
        opacity: 0,
        x: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out'
    });
}

function populateActivityList() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = MockData.activities || [
        { type: 'maintenance', title: 'Replace East room pipe', time: '2 hours ago', status: 'completed' },
        { type: 'alert', title: 'Replace boiler 021', time: '4 hours ago', status: 'in-progress' },
        { type: 'update', title: 'Upgrade Temperature Sensor', time: '6 hours ago', status: 'scheduled' },
        { type: 'maintenance', title: 'Install Gas tanks', time: '8 hours ago', status: 'completed' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item ${activity.type}">
            <div class="activity-icon">${getActivityIcon(activity.type)}</div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
            <div class="activity-status ${activity.status}">${activity.status}</div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    const icons = {
        maintenance: '🔧',
        alert: '⚠️',
        update: '📊',
        safety: '🛡️'
    };
    return icons[type] || '📌';
}

// Process Page
function initProcessPage() {
    // Initialize charts
    if (typeof DashboardCharts !== 'undefined') {
        DashboardCharts.initProcessCharts();
    }
    
    // Initialize tower visualization
    if (typeof ThreeScenes !== 'undefined') {
        ThreeScenes.initTower('towerCanvas');
    }
    
    // Initialize gauges
    initGauges();
    
    // Animate KPI cards
    gsap.from('.kpi-card', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.5)'
    });
}

function initGauges() {
    const gaugeConfigs = [
        { id: 'gauge1', value: 425, max: 600, label: '°C', color: '#ff6b6b' },
        { id: 'gauge2', value: 2.4, max: 5, label: 'Bar', color: '#4ecdc4' },
        { id: 'gauge3', value: 9375, max: 12000, label: 'BPH', color: '#45b7d1' },
        { id: 'gauge4', value: 3.2, max: 5, label: ':1', color: '#96ceb4' },
        { id: 'gauge5', value: 45, max: 80, label: 'T/H', color: '#ffeaa7' }
    ];
    
    gaugeConfigs.forEach(config => {
        drawGauge(config);
    });
}

function drawGauge(config) {
    const canvas = document.getElementById(config.id);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Value arc
    const progress = config.value / config.max;
    const endAngle = Math.PI * 0.75 + (Math.PI * 1.5 * progress);
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle, false);
    
    // Gradient
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop(0, config.color);
    gradient.addColorStop(1, adjustColor(config.color, 30));
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Glow effect
    ctx.shadowColor = config.color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
}

function adjustColor(color, amount) {
    const hex = color.replace('#', '');
    const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + amount);
    const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + amount);
    const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + amount);
    return `rgb(${r}, ${g}, ${b})`;
}

// Equipment Page
function initEquipmentPage() {
    // Initialize 3D equipment viewer
    if (typeof ThreeScenes !== 'undefined') {
        ThreeScenes.initEquipment3D('equipmentCanvas');
    }
    
    // Initialize health charts
    if (typeof DashboardCharts !== 'undefined') {
        DashboardCharts.initEquipmentCharts();
    }
    
    // Populate prediction list
    populatePredictionList();
    
    // Populate asset table
    populateAssetTable();
    
    // Animate overview cards
    gsap.from('.overview-card', {
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        duration: 0.5,
        ease: 'back.out(1.7)'
    });
}

function populatePredictionList() {
    const predictionList = document.getElementById('predictionList');
    if (!predictionList) return;
    
    const predictions = MockData.predictions || [
        { asset: 'ESP-003', issue: 'Bearing Failure', probability: 87, timeframe: '48-72 hrs', severity: 'critical' },
        { asset: 'TRB-002', issue: 'Blade Erosion', probability: 78, timeframe: '5-7 days', severity: 'critical' },
        { asset: 'VLV-002', issue: 'Seat Wear', probability: 65, timeframe: '2-3 weeks', severity: 'warning' },
        { asset: 'CMP-003', issue: 'Vibration Anomaly', probability: 72, timeframe: '1-2 weeks', severity: 'warning' }
    ];
    
    predictionList.innerHTML = predictions.map(pred => `
        <div class="prediction-item ${pred.severity}">
            <div class="prediction-header">
                <span class="prediction-asset">${pred.asset}</span>
                <span class="prediction-probability">${pred.probability}%</span>
            </div>
            <div class="prediction-issue">${pred.issue}</div>
            <div class="prediction-timeframe">Expected: ${pred.timeframe}</div>
            <div class="prediction-actions">
                <button class="action-btn">Schedule</button>
                <button class="action-btn secondary">Details</button>
            </div>
        </div>
    `).join('');
}

function populateAssetTable() {
    const tableBody = document.getElementById('assetTableBody');
    if (!tableBody) return;
    
    const assets = MockData.assets || [
        { id: 'ESP-003', name: 'ESP Pump Assembly', type: 'Pump', location: 'Well A-14', health: 45, rul: 720, status: 'critical' },
        { id: 'TRB-002', name: 'Gas Turbine', type: 'Turbine', location: 'Power Gen', health: 62, rul: 1440, status: 'warning' },
        { id: 'CMP-003', name: 'Compressor Unit', type: 'Compressor', location: 'FCC', health: 78, rul: 2880, status: 'warning' },
        { id: 'HEX-015', name: 'Heat Exchanger', type: 'Exchanger', location: 'CDU-1', health: 92, rul: 8760, status: 'healthy' },
        { id: 'PMP-042', name: 'Transfer Pump', type: 'Pump', location: 'Tank Farm', health: 88, rul: 5040, status: 'healthy' }
    ];
    
    tableBody.innerHTML = assets.map(asset => `
        <tr class="${asset.status}">
            <td>${asset.id}</td>
            <td>${asset.name}</td>
            <td>${asset.type}</td>
            <td>${asset.location}</td>
            <td>
                <div class="health-bar">
                    <div class="health-fill ${asset.status}" style="width: ${asset.health}%"></div>
                </div>
                <span class="health-value">${asset.health}%</span>
            </td>
            <td>${asset.rul.toLocaleString()}</td>
            <td><span class="status-badge ${asset.status}">${asset.status}</span></td>
            <td>
                <button class="table-btn">View</button>
                <button class="table-btn">Schedule</button>
            </td>
        </tr>
    `).join('');
}

// Safety Page
function initSafetyPage() {
    // Initialize emissions chart
    if (typeof DashboardCharts !== 'undefined') {
        DashboardCharts.initSafetyCharts();
    }
    
    // Initialize personnel map
    if (typeof ThreeScenes !== 'undefined') {
        ThreeScenes.initPersonnelMap('personnelMap');
    }
    
    // Populate safety alerts
    populateSafetyAlerts();
    
    // Animate KPI rings
    animateSafetyRings();
}

function populateSafetyAlerts() {
    const alertsList = document.getElementById('safetyAlertsList');
    if (!alertsList) return;
    
    const alerts = MockData.safetyAlerts || [
        { type: 'critical', title: 'H2S Detected - RHCU Area', detail: '8 ppm detected', time: '15 min ago' },
        { type: 'warning', title: 'High Temperature Alert', detail: 'Furnace F-101', time: '45 min ago' },
        { type: 'warning', title: 'Confined Space Entry', detail: 'Tank T-102 inspection', time: '2 hrs ago' },
        { type: 'info', title: 'Safety Drill Scheduled', detail: 'Zone B Emergency Response', time: '4 hrs ago' }
    ];
    
    alertsList.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-icon">${getAlertIcon(alert.type)}</div>
            <div class="alert-content">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-detail">${alert.detail}</div>
            </div>
            <div class="alert-time">${alert.time}</div>
        </div>
    `).join('');
}

function getAlertIcon(type) {
    const icons = {
        critical: '🚨',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || '📌';
}

function animateSafetyRings() {
    document.querySelectorAll('.ring-progress').forEach(ring => {
        const progress = parseFloat(getComputedStyle(ring).getPropertyValue('--progress'));
        const circumference = 2 * Math.PI * 45;
        const offset = circumference * (1 - progress);
        
        gsap.fromTo(ring, 
            { strokeDashoffset: circumference },
            { strokeDashoffset: offset, duration: 1.5, ease: 'power2.out' }
        );
    });
}

// Cyber Page
function initCyberPage() {
    // Initialize network topology
    if (typeof ThreeScenes !== 'undefined') {
        ThreeScenes.initNetworkTopology('networkCanvas');
    }
    
    // Initialize anomaly chart
    if (typeof DashboardCharts !== 'undefined') {
        DashboardCharts.initCyberCharts();
    }
    
    // Populate threat feed
    populateThreatFeed();
    
    // Populate audit log
    populateAuditLog();
    
    // Populate incident timeline
    populateIncidentTimeline();
    
    // Animate security score
    animateSecurityScore();
}

function populateThreatFeed() {
    const threatFeed = document.getElementById('threatFeed');
    if (!threatFeed) return;
    
    const threats = MockData.threats || [
        { type: 'blocked', source: '185.234.xx.xx', attack: 'Port Scan', time: '5 min ago' },
        { type: 'blocked', source: '91.142.xx.xx', attack: 'Brute Force', time: '12 min ago' },
        { type: 'detected', source: 'Internal', attack: 'Anomalous Traffic', time: '25 min ago' },
        { type: 'blocked', source: 'USB Device', attack: 'Malware Signature', time: '45 min ago' }
    ];
    
    threatFeed.innerHTML = threats.map(threat => `
        <div class="threat-item ${threat.type}">
            <div class="threat-status">${threat.type === 'blocked' ? '🛡️' : '⚠️'}</div>
            <div class="threat-content">
                <div class="threat-attack">${threat.attack}</div>
                <div class="threat-source">${threat.source}</div>
            </div>
            <div class="threat-time">${threat.time}</div>
        </div>
    `).join('');
}

function populateAuditLog() {
    const auditBody = document.getElementById('auditTableBody');
    if (!auditBody) return;
    
    const logs = MockData.auditLogs || [
        { time: '14:45:22', user: 'admin_ops', action: 'Config Change', resource: 'PLC-2201', status: 'success' },
        { time: '14:32:18', user: 'sys_monitor', action: 'Read Access', resource: 'Historian DB', status: 'success' },
        { time: '14:28:05', user: 'unknown', action: 'Login Attempt', resource: 'SCADA Server', status: 'denied' },
        { time: '14:15:33', user: 'eng_ahmed', action: 'Setpoint Change', resource: 'CDU-1 Controller', status: 'success' },
        { time: '14:02:47', user: 'maint_team', action: 'Download', resource: 'Equipment Logs', status: 'success' }
    ];
    
    auditBody.innerHTML = logs.map(log => `
        <tr class="${log.status === 'denied' ? 'warning' : ''}">
            <td>${log.time}</td>
            <td>${log.user}</td>
            <td>${log.action}</td>
            <td>${log.resource}</td>
            <td><span class="status-badge ${log.status}">${log.status}</span></td>
        </tr>
    `).join('');
}

function populateIncidentTimeline() {
    const timeline = document.getElementById('incidentTimeline');
    if (!timeline) return;
    
    const incidents = MockData.incidents || [
        { time: '14:45', type: 'blocked', title: 'Port Scan Blocked' },
        { time: '12:30', type: 'detected', title: 'Anomalous Traffic Detected' },
        { time: '10:15', type: 'resolved', title: 'Malware Quarantined' },
        { time: '08:00', type: 'info', title: 'System Update Applied' }
    ];
    
    timeline.innerHTML = incidents.map(incident => `
        <div class="timeline-item ${incident.type}">
            <div class="timeline-marker"></div>
            <div class="timeline-content">
                <div class="timeline-time">${incident.time}</div>
                <div class="timeline-title">${incident.title}</div>
            </div>
        </div>
    `).join('');
}

function animateSecurityScore() {
    const scoreValue = document.querySelector('.score-value');
    if (scoreValue) {
        animateValue(scoreValue, 0, 87, 2000);
    }
}

/* ============================================
   ANIMATIONS
   ============================================ */
function initAnimations() {
    // Initialize scroll-triggered animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Fade in elements on scroll
    gsap.utils.toArray('.chart-card').forEach(card => {
        gsap.from(card, {
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            },
            opacity: 0,
            y: 30,
            duration: 0.6,
            ease: 'power2.out'
        });
    });
    
    // Parallax effect on hero
    gsap.to('.video-background', {
        scrollTrigger: {
            trigger: '.landing-section',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        },
        y: 100,
        opacity: 0.5
    });
}

/* ============================================
   UTILITY FUNCTIONS
   ============================================ */
function switchFacilityView(view) {
    // Update 3D scene based on view mode
    console.log('Switching to view:', view);
}

function updateChartsTimeRange(range) {
    // Update all charts with new time range
    console.log('Updating time range to:', range);
}

// Toast notifications
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon">${getToastIcon(type)}</div>
        <div class="toast-message">${message}</div>
        <button class="toast-close">×</button>
    `;
    
    container.appendChild(toast);
    
    // Animate in
    gsap.from(toast, {
        x: 100,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.out'
    });
    
    // Auto remove
    setTimeout(() => {
        gsap.to(toast, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            onComplete: () => toast.remove()
        });
    }, 5000);
    
    // Close button
    toast.querySelector('.toast-close').addEventListener('click', () => {
        gsap.to(toast, {
            x: 100,
            opacity: 0,
            duration: 0.3,
            onComplete: () => toast.remove()
        });
    });
}

function getToastIcon(type) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    return icons[type] || icons.info;
}

// Export for global access
window.AppState = AppState;
window.showToast = showToast;
window.navigateToPage = navigateToPage;
