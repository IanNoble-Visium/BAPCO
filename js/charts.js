/* ============================================
   BAPCO TruContext Dashboard - Charts
   Chart.js Visualizations
   ============================================ */

class DashboardCharts {
    constructor() {
        this.charts = {};
        this.chartDefaults();
    }

    // Set Chart.js defaults
    chartDefaults() {
        Chart.defaults.color = 'rgba(255, 255, 255, 0.7)';
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
        Chart.defaults.font.family = "'Inter', sans-serif";
    }

    // Common gradient creation
    createGradient(ctx, colorStart, colorEnd, height = 200) {
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, colorStart);
        gradient.addColorStop(1, colorEnd);
        return gradient;
    }

    // Initialize KPI sparkline charts
    initKPICharts() {
        const kpiConfigs = [
            { id: 'kpiProductionChart', data: MockData.kpis.production.history, color: '#00d4ff' },
            { id: 'kpiEfficiencyChart', data: MockData.kpis.efficiency.history, color: '#00ff88' },
            { id: 'kpiEnergyChart', data: MockData.kpis.energy.history, color: '#ffd93d' },
            { id: 'kpiWaterChart', data: MockData.kpis.water.history, color: '#4d96ff' }
        ];

        kpiConfigs.forEach(config => {
            const canvas = document.getElementById(config.id);
            if (!canvas) return;

            const ctx = canvas.getContext('2d');
            const gradient = this.createGradient(ctx, config.color + '40', config.color + '00', 60);

            this.charts[config.id] = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array(config.data.length).fill(''),
                    datasets: [{
                        data: config.data,
                        borderColor: config.color,
                        backgroundColor: gradient,
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { display: false }
                    },
                    interaction: { enabled: false }
                }
            });
        });
    }

    // Initialize Temperature Chart
    initTemperatureChart() {
        const canvas = document.getElementById('temperatureChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.processData.temperature;

        this.charts.temperature = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(ds => ({
                    label: ds.label,
                    data: ds.data,
                    borderColor: ds.color,
                    backgroundColor: ds.color + '20',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.3,
                    pointRadius: 0,
                    pointHoverRadius: 5
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 15 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { maxTicksLimit: 8 }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: '°C' }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                }
            }
        });
    }

    // Initialize Pressure Chart
    initPressureChart() {
        const canvas = document.getElementById('pressureChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.processData.pressure;

        this.charts.pressure = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(ds => ({
                    label: ds.label,
                    data: ds.data,
                    borderColor: ds.color,
                    backgroundColor: ds.color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 15 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { maxTicksLimit: 8 }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: 'Bar' }
                    }
                }
            }
        });
    }

    // Initialize Flow Chart
    initFlowChart() {
        const canvas = document.getElementById('flowChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.processData.flow;

        this.charts.flow = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: data.datasets.map(ds => ({
                    label: ds.label,
                    data: ds.data,
                    borderColor: ds.color,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    tension: 0.3,
                    pointRadius: 0
                }))
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 15 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        ticks: { maxTicksLimit: 8 }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: 'BPH' }
                    }
                }
            }
        });
    }

    // Initialize Yield Chart (Doughnut)
    initYieldChart() {
        const canvas = document.getElementById('yieldChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.processData.yield;

        this.charts.yield = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.data,
                    backgroundColor: data.colors,
                    borderColor: '#0a0e17',
                    borderWidth: 3,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: {
                    legend: {
                        position: 'right',
                        labels: { boxWidth: 12, padding: 10 }
                    }
                }
            }
        });
    }

    // Initialize Gauge Charts
    initGauges() {
        const gaugeConfigs = [
            { id: 'gauge1', value: 425, max: 500, label: 'Reactor Temp', unit: '°C', color: '#ff6b6b' },
            { id: 'gauge2', value: 2.4, max: 4, label: 'Column Pressure', unit: 'Bar', color: '#4d96ff' },
            { id: 'gauge3', value: 9375, max: 10000, label: 'Feed Rate', unit: 'BPH', color: '#00ff88' },
            { id: 'gauge4', value: 3.2, max: 5, label: 'Reflux Ratio', unit: ':1', color: '#ffd93d' },
            { id: 'gauge5', value: 45, max: 60, label: 'Steam Flow', unit: 'T/H', color: '#9d4edd' }
        ];

        gaugeConfigs.forEach(config => {
            this.createGauge(config);
        });
    }

    // Create individual gauge
    createGauge(config) {
        const canvas = document.getElementById(config.id);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const percentage = (config.value / config.max) * 100;

        this.charts[config.id] = new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: [config.color, 'rgba(255,255,255,0.05)'],
                    borderWidth: 0,
                    circumference: 270,
                    rotation: 225
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '80%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }

    // Initialize Vibration Chart
    initVibrationChart() {
        const canvas = document.getElementById('vibrationChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.vibrationData;

        this.charts.vibration = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Current',
                        data: data.current,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Normal',
                        data: data.normal,
                        borderColor: '#00ff88',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Threshold',
                        data: data.threshold,
                        borderColor: '#ffd93d',
                        borderWidth: 2,
                        borderDash: [10, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: 'mm/s', font: { size: 10 } }
                    }
                }
            }
        });
    }

    // Initialize Motor Current Chart
    initMotorChart() {
        const canvas = document.getElementById('motorChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.motorData;

        this.charts.motor = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Phase A',
                        data: data.phaseA,
                        borderColor: '#ff6b6b',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Phase B',
                        data: data.phaseB,
                        borderColor: '#ffd93d',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Phase C',
                        data: data.phaseC,
                        borderColor: '#4d96ff',
                        borderWidth: 2,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: 'Amps', font: { size: 10 } }
                    }
                }
            }
        });
    }

    // Initialize Bearing Temperature Chart
    initBearingChart() {
        const canvas = document.getElementById('bearingChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.bearingData;

        this.charts.bearing = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Drive End',
                        data: data.de,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Non-Drive End',
                        data: data.nde,
                        borderColor: '#4d96ff',
                        backgroundColor: 'rgba(77, 150, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.3,
                        pointRadius: 0
                    },
                    {
                        label: 'Alarm',
                        data: data.threshold,
                        borderColor: '#ffd93d',
                        borderWidth: 2,
                        borderDash: [10, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: '°C', font: { size: 10 } }
                    }
                }
            }
        });
    }

    // Initialize RUL Chart
    initRULChart() {
        const canvas = document.getElementById('rulChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.rulData;

        this.charts.rul = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Predicted RUL',
                        data: data.predicted,
                        backgroundColor: 'rgba(0, 212, 255, 0.6)',
                        borderColor: '#00d4ff',
                        borderWidth: 1
                    },
                    {
                        label: 'Actual',
                        data: data.actual,
                        backgroundColor: 'rgba(0, 255, 136, 0.6)',
                        borderColor: '#00ff88',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
                    }
                },
                scales: {
                    x: {
                        grid: { display: false }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: 'Hours', font: { size: 10 } }
                    }
                }
            }
        });
    }

    // Initialize Emissions Chart
    initEmissionsChart() {
        const canvas = document.getElementById('emissionsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.emissions.history;

        this.charts.emissions = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.months,
                datasets: [
                    {
                        label: 'NOx',
                        data: data.nox,
                        borderColor: '#ff6b6b',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'SOx',
                        data: data.sox,
                        borderColor: '#ffd93d',
                        backgroundColor: 'rgba(255, 217, 61, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'VOC',
                        data: data.voc,
                        borderColor: '#6bcb77',
                        backgroundColor: 'rgba(107, 203, 119, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 12, padding: 15 }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.05)' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        title: { display: true, text: 'Tonnes' }
                    }
                }
            }
        });
    }

    // Initialize SCADA Anomaly Chart
    initAnomalyChart() {
        const canvas = document.getElementById('anomalyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const data = MockData.scadaData;

        // Create threshold lines
        const upperThreshold = Array(data.labels.length).fill(data.threshold.upper);
        const lowerThreshold = Array(data.labels.length).fill(data.threshold.lower);

        this.charts.anomaly = new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'SCADA Signal',
                        data: data.normal,
                        borderColor: '#00d4ff',
                        backgroundColor: 'rgba(0, 212, 255, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.2,
                        pointRadius: 0
                    },
                    {
                        label: 'Upper Threshold',
                        data: upperThreshold,
                        borderColor: '#ffd93d',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    },
                    {
                        label: 'Lower Threshold',
                        data: lowerThreshold,
                        borderColor: '#ffd93d',
                        borderWidth: 1,
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { boxWidth: 10, padding: 10, font: { size: 10 } }
                    }
                },
                scales: {
                    x: { display: false },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.05)' },
                        min: 30,
                        max: 70
                    }
                }
            }
        });

        // Add anomaly points
        if (data.anomalies.length > 0) {
            this.charts.anomaly.data.datasets.push({
                label: 'Anomalies',
                data: data.anomalies.map(a => ({ x: a.x, y: a.y })),
                borderColor: '#ff4757',
                backgroundColor: '#ff4757',
                pointRadius: 6,
                pointStyle: 'triangle',
                showLine: false
            });
            this.charts.anomaly.update();
        }
    }

    // Initialize Network Topology Canvas
    initNetworkCanvas() {
        const canvas = document.getElementById('networkCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Network nodes
        const nodes = [
            { x: 100, y: 50, label: 'Firewall', type: 'security', color: '#ff6b6b' },
            { x: 250, y: 50, label: 'Core Switch', type: 'network', color: '#4d96ff' },
            { x: 400, y: 50, label: 'DMZ', type: 'security', color: '#ffd93d' },
            { x: 100, y: 150, label: 'IT Network', type: 'network', color: '#4d96ff' },
            { x: 250, y: 150, label: 'Historian', type: 'server', color: '#9d4edd' },
            { x: 400, y: 150, label: 'OT Network', type: 'network', color: '#00ff88' },
            { x: 100, y: 250, label: 'Workstations', type: 'endpoint', color: '#6bcb77' },
            { x: 250, y: 250, label: 'SCADA Server', type: 'server', color: '#9d4edd' },
            { x: 400, y: 250, label: 'PLCs', type: 'ot', color: '#00d4ff' }
        ];

        // Connections
        const connections = [
            [0, 1], [1, 2], [1, 3], [1, 4], [2, 5],
            [3, 6], [4, 7], [5, 8], [4, 5]
        ];

        let animationOffset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections
            connections.forEach(([from, to]) => {
                const n1 = nodes[from];
                const n2 = nodes[to];

                ctx.beginPath();
                ctx.moveTo(n1.x, n1.y);
                ctx.lineTo(n2.x, n2.y);
                ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
                ctx.lineWidth = 2;
                ctx.stroke();

                // Animated data flow
                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const len = Math.sqrt(dx * dx + dy * dy);
                const progress = (animationOffset % 100) / 100;
                
                ctx.beginPath();
                ctx.arc(
                    n1.x + dx * progress,
                    n1.y + dy * progress,
                    3,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = '#00d4ff';
                ctx.fill();
            });

            // Draw nodes
            nodes.forEach(node => {
                // Glow
                ctx.beginPath();
                ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
                ctx.fillStyle = node.color + '30';
                ctx.fill();

                // Node
                ctx.beginPath();
                ctx.arc(node.x, node.y, 18, 0, Math.PI * 2);
                ctx.fillStyle = '#0a0e17';
                ctx.fill();
                ctx.strokeStyle = node.color;
                ctx.lineWidth = 2;
                ctx.stroke();

                // Label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                ctx.font = '10px Inter';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, node.x, node.y + 35);
            });

            animationOffset += 0.5;
            requestAnimationFrame(draw);
        };

        draw();
    }

    // Initialize Personnel Map Canvas
    initPersonnelMap() {
        const canvas = document.getElementById('personnelMap');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        // Zones
        const zones = [
            { x: 20, y: 20, w: 100, h: 80, type: 'safe', label: 'Admin' },
            { x: 140, y: 20, w: 120, h: 80, type: 'caution', label: 'Processing' },
            { x: 20, y: 120, w: 80, h: 100, type: 'safe', label: 'Storage' },
            { x: 120, y: 120, w: 100, h: 100, type: 'restricted', label: 'Reactor' },
            { x: 240, y: 120, w: 80, h: 100, type: 'caution', label: 'Utilities' }
        ];

        // Personnel (random positions)
        const personnel = [];
        for (let i = 0; i < 50; i++) {
            const zone = zones[Math.floor(Math.random() * zones.length)];
            personnel.push({
                x: zone.x + Math.random() * zone.w,
                y: zone.y + Math.random() * zone.h,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                zone: zone
            });
        }

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw zones
            zones.forEach(zone => {
                ctx.fillStyle = zone.type === 'safe' ? 'rgba(0, 255, 136, 0.1)' :
                               zone.type === 'caution' ? 'rgba(255, 217, 61, 0.1)' :
                               'rgba(255, 71, 87, 0.1)';
                ctx.fillRect(zone.x, zone.y, zone.w, zone.h);

                ctx.strokeStyle = zone.type === 'safe' ? 'rgba(0, 255, 136, 0.5)' :
                                 zone.type === 'caution' ? 'rgba(255, 217, 61, 0.5)' :
                                 'rgba(255, 71, 87, 0.5)';
                ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);

                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.font = '10px Inter';
                ctx.fillText(zone.label, zone.x + 5, zone.y + 15);
            });

            // Draw and update personnel
            personnel.forEach(p => {
                // Update position
                p.x += p.vx;
                p.y += p.vy;

                // Bounce within zone
                if (p.x < p.zone.x || p.x > p.zone.x + p.zone.w) p.vx *= -1;
                if (p.y < p.zone.y || p.y > p.zone.y + p.zone.h) p.vy *= -1;

                // Draw
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
                ctx.fillStyle = p.zone.type === 'safe' ? '#00ff88' :
                               p.zone.type === 'caution' ? '#ffd93d' : '#ff4757';
                ctx.fill();
            });

            requestAnimationFrame(draw);
        };

        draw();
    }

    // Initialize Tower Visualization Canvas
    initTowerCanvas() {
        const canvas = document.getElementById('towerCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        const centerX = canvas.width / 2;
        const towerWidth = 80;
        const towerHeight = 320;
        const towerTop = 30;

        // Product layers
        const layers = [
            { name: 'LPG', color: '#9d4edd', height: 0.1, temp: '40°C' },
            { name: 'Naphtha', color: '#4d96ff', height: 0.18, temp: '120°C' },
            { name: 'Kerosene', color: '#6bcb77', height: 0.18, temp: '180°C' },
            { name: 'Diesel', color: '#ffd93d', height: 0.24, temp: '280°C' },
            { name: 'Residue', color: '#ff6b6b', height: 0.3, temp: '365°C' }
        ];

        let flowOffset = 0;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Tower outline
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX - towerWidth/2, towerTop);
            ctx.lineTo(centerX - towerWidth/2 - 10, towerTop + towerHeight);
            ctx.lineTo(centerX + towerWidth/2 + 10, towerTop + towerHeight);
            ctx.lineTo(centerX + towerWidth/2, towerTop);
            ctx.closePath();
            ctx.stroke();

            // Draw layers
            let currentY = towerTop + towerHeight;
            layers.forEach((layer, i) => {
                const layerHeight = towerHeight * layer.height;
                const widthAtTop = towerWidth + (currentY - layerHeight - towerTop) / towerHeight * 20;
                const widthAtBottom = towerWidth + (currentY - towerTop) / towerHeight * 20;

                // Layer fill with gradient
                const gradient = ctx.createLinearGradient(0, currentY - layerHeight, 0, currentY);
                gradient.addColorStop(0, layer.color + '80');
                gradient.addColorStop(1, layer.color + 'cc');

                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.moveTo(centerX - widthAtTop/2, currentY - layerHeight);
                ctx.lineTo(centerX - widthAtBottom/2, currentY);
                ctx.lineTo(centerX + widthAtBottom/2, currentY);
                ctx.lineTo(centerX + widthAtTop/2, currentY - layerHeight);
                ctx.closePath();
                ctx.fill();

                // Bubbles animation
                for (let j = 0; j < 5; j++) {
                    const bubbleY = currentY - (flowOffset + j * 20) % layerHeight;
                    if (bubbleY > currentY - layerHeight) {
                        ctx.beginPath();
                        ctx.arc(
                            centerX + (Math.sin(flowOffset * 0.1 + j) * 20),
                            bubbleY,
                            2 + Math.random() * 2,
                            0,
                            Math.PI * 2
                        );
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                        ctx.fill();
                    }
                }

                // Output pipe
                const pipeY = currentY - layerHeight / 2;
                ctx.strokeStyle = layer.color;
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(centerX + widthAtBottom/2 + 5, pipeY);
                ctx.lineTo(centerX + 100, pipeY);
                ctx.stroke();

                // Flow indicator
                const flowX = centerX + 50 + ((flowOffset * 2) % 50);
                ctx.beginPath();
                ctx.arc(flowX, pipeY, 4, 0, Math.PI * 2);
                ctx.fillStyle = layer.color;
                ctx.fill();

                // Label
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.font = '12px Inter';
                ctx.textAlign = 'left';
                ctx.fillText(layer.name, centerX + 110, pipeY + 4);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                ctx.font = '10px Inter';
                ctx.fillText(layer.temp, centerX + 110, pipeY + 18);

                currentY -= layerHeight;
            });

            // Feed inlet
            ctx.strokeStyle = '#ffd93d';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(centerX - 100, towerTop + towerHeight - 50);
            ctx.lineTo(centerX - towerWidth/2 - 10, towerTop + towerHeight - 50);
            ctx.stroke();

            // Feed flow
            const feedFlowX = centerX - 100 + ((flowOffset * 2) % 50);
            ctx.beginPath();
            ctx.arc(feedFlowX, towerTop + towerHeight - 50, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd93d';
            ctx.fill();

            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = '12px Inter';
            ctx.textAlign = 'right';
            ctx.fillText('Crude Feed', centerX - 110, towerTop + towerHeight - 46);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = '10px Inter';
            ctx.fillText('9,375 BPH', centerX - 110, towerTop + towerHeight - 32);

            // Dome
            ctx.fillStyle = 'rgba(100, 100, 120, 0.5)';
            ctx.beginPath();
            ctx.ellipse(centerX, towerTop, towerWidth/2, 15, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.stroke();

            flowOffset += 0.5;
            requestAnimationFrame(draw);
        };

        draw();
    }

    // Initialize all charts
    initAll() {
        this.initKPICharts();
        this.initTemperatureChart();
        this.initPressureChart();
        this.initFlowChart();
        this.initYieldChart();
        this.initGauges();
        this.initVibrationChart();
        this.initMotorChart();
        this.initBearingChart();
        this.initRULChart();
        this.initEmissionsChart();
        this.initAnomalyChart();
        this.initNetworkCanvas();
        this.initPersonnelMap();
        this.initTowerCanvas();
    }

    // Update chart data (for real-time simulation)
    updateChartData(chartId, newData) {
        if (this.charts[chartId]) {
            this.charts[chartId].data.datasets[0].data = newData;
            this.charts[chartId].update('none');
        }
    }
}

// Export
window.DashboardCharts = new DashboardCharts();
