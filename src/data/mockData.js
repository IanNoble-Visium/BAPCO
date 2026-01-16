/**
 * BAPCO TruContext Dashboard - Mock Data
 * Rich simulation data for oil refinery operations
 */

// Helper Functions
function generateTimeLabels(count) {
  const labels = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now - i * 3600000);
    labels.push(time.getHours().toString().padStart(2, '0') + ':00');
  }
  return labels;
}

function generateTimeSeriesData(count, min, max) {
  const data = [];
  let value = (min + max) / 2;
  for (let i = 0; i < count; i++) {
    value += (Math.random() - 0.5) * (max - min) * 0.2;
    value = Math.max(min, Math.min(max, value));
    data.push(parseFloat(value.toFixed(2)));
  }
  return data;
}

function generateAnomalyData(count) {
  const data = [];
  for (let i = 0; i < count; i++) {
    if (Math.random() < 0.05) {
      data.push({ x: i, y: 50 + (Math.random() - 0.5) * 30 });
    }
  }
  return data;
}

export const mockData = {
  company: {
    name: 'Bahrain Petroleum Company (BAPCO)',
    capacity: 380000,
    location: 'Awali, Bahrain',
    established: 1929
  },

  kpis: {
    production: {
      value: 372450,
      unit: 'BPD',
      trend: 3.2,
      target: 380000,
      history: generateTimeSeriesData(24, 360000, 380000)
    },
    efficiency: {
      value: 94.7,
      unit: '%',
      trend: 1.8,
      target: 95,
      history: generateTimeSeriesData(24, 92, 96)
    },
    energy: {
      value: 3420,
      unit: 'MWh',
      trend: -2.1,
      target: 3500,
      history: generateTimeSeriesData(24, 3200, 3600)
    },
    water: {
      value: 12450,
      unit: 'm³',
      trend: -5.4,
      target: 15000,
      history: generateTimeSeriesData(24, 11000, 14000)
    }
  },

  units: [
    {
      id: 'cdu-1',
      name: 'Crude Distillation Unit 1',
      shortName: 'CDU-1',
      type: 'distillation',
      capacity: 225000,
      throughput: 218500,
      status: 'operational',
      temperature: 365,
      pressure: 2.4,
      efficiency: 97.1,
      products: ['LPG', 'Naphtha', 'Kerosene', 'Diesel', 'Residue']
    },
    {
      id: 'rhcu-1',
      name: 'Resid Hydrocracking Unit',
      shortName: 'RHCU',
      type: 'hydrocracking',
      capacity: 65000,
      throughput: 58200,
      status: 'warning',
      temperature: 425,
      pressure: 2150,
      efficiency: 89.5,
      alert: 'Catalyst regeneration due in 72 hours'
    },
    {
      id: 'fcc-1',
      name: 'Fluid Catalytic Cracker',
      shortName: 'FCC',
      type: 'cracking',
      capacity: 45000,
      throughput: 43800,
      status: 'operational',
      temperature: 538,
      pressure: 35,
      efficiency: 97.3
    },
    {
      id: 'hds-1',
      name: 'Hydrodesulfurization Unit',
      shortName: 'HDS',
      type: 'treatment',
      capacity: 80000,
      throughput: 76500,
      status: 'operational',
      temperature: 340,
      pressure: 55,
      efficiency: 95.6
    },
    {
      id: 'reformer-1',
      name: 'Catalytic Reformer',
      shortName: 'CCR',
      type: 'reforming',
      capacity: 35000,
      throughput: 33200,
      status: 'operational',
      temperature: 510,
      pressure: 25,
      efficiency: 94.9
    }
  ],

  tanks: [
    { id: 'T-101', name: 'Crude Oil Tank 1', type: 'crude', capacity: 500000, level: 78, temperature: 45 },
    { id: 'T-102', name: 'Crude Oil Tank 2', type: 'crude', capacity: 500000, level: 65, temperature: 44 },
    { id: 'T-103', name: 'Crude Oil Tank 3', type: 'crude', capacity: 500000, level: 82, temperature: 46 },
    { id: 'T-201', name: 'Gasoline Tank 1', type: 'gasoline', capacity: 200000, level: 71, temperature: 28 },
    { id: 'T-202', name: 'Gasoline Tank 2', type: 'gasoline', capacity: 200000, level: 58, temperature: 27 },
    { id: 'T-301', name: 'Diesel Tank 1', type: 'diesel', capacity: 300000, level: 85, temperature: 32 },
    { id: 'T-302', name: 'Diesel Tank 2', type: 'diesel', capacity: 300000, level: 67, temperature: 31 },
    { id: 'T-401', name: 'Kerosene Tank', type: 'kerosene', capacity: 150000, level: 54, temperature: 29 },
    { id: 'T-501', name: 'LPG Sphere 1', type: 'lpg', capacity: 50000, level: 72, temperature: -42 },
    { id: 'T-502', name: 'LPG Sphere 2', type: 'lpg', capacity: 50000, level: 68, temperature: -41 }
  ],

  assets: [
    { id: 'ESP-001', name: 'ESP Pump A-14', type: 'Pump', location: 'Well Field A', health: 78, rul: 2340, status: 'warning' },
    { id: 'ESP-002', name: 'ESP Pump A-22', type: 'Pump', location: 'Well Field A', health: 92, rul: 8760, status: 'operational' },
    { id: 'ESP-003', name: 'ESP Pump B-07', type: 'Pump', location: 'Well Field B', health: 45, rul: 720, status: 'critical' },
    { id: 'CMP-001', name: 'Main Compressor 1', type: 'Compressor', location: 'CDU-1', health: 88, rul: 5200, status: 'operational' },
    { id: 'CMP-002', name: 'Main Compressor 2', type: 'Compressor', location: 'CDU-1', health: 91, rul: 6100, status: 'operational' },
    { id: 'CMP-003', name: 'Recycle Compressor', type: 'Compressor', location: 'RHCU', health: 72, rul: 1800, status: 'warning' },
    { id: 'HEX-001', name: 'Feed Preheater', type: 'Heat Exchanger', location: 'CDU-1', health: 95, rul: 12000, status: 'operational' },
    { id: 'HEX-002', name: 'Overhead Condenser', type: 'Heat Exchanger', location: 'CDU-1', health: 89, rul: 7500, status: 'operational' },
    { id: 'VLV-001', name: 'Feed Control Valve', type: 'Valve', location: 'CDU-1', health: 97, rul: 15000, status: 'operational' },
    { id: 'VLV-002', name: 'Pressure Relief Valve', type: 'Valve', location: 'RHCU', health: 68, rul: 1200, status: 'warning' },
    { id: 'MTR-001', name: 'Main Drive Motor', type: 'Motor', location: 'FCC', health: 94, rul: 9800, status: 'operational' },
    { id: 'MTR-002', name: 'Auxiliary Motor', type: 'Motor', location: 'FCC', health: 86, rul: 4500, status: 'operational' },
    { id: 'TRB-001', name: 'Steam Turbine 1', type: 'Turbine', location: 'Power Plant', health: 91, rul: 7200, status: 'operational' },
    { id: 'TRB-002', name: 'Steam Turbine 2', type: 'Turbine', location: 'Power Plant', health: 58, rul: 480, status: 'critical' },
    { id: 'BLR-001', name: 'Boiler 1', type: 'Boiler', location: 'Utilities', health: 93, rul: 8400, status: 'operational' }
  ],

  predictions: [
    {
      id: 1,
      asset: 'ESP-003',
      assetName: 'ESP Pump B-07',
      type: 'Bearing Failure',
      probability: 87,
      timeframe: '48-72 hours',
      severity: 'critical',
      recommendation: 'Schedule immediate replacement',
      estimatedCost: 45000
    },
    {
      id: 2,
      asset: 'TRB-002',
      assetName: 'Steam Turbine 2',
      type: 'Blade Erosion',
      probability: 78,
      timeframe: '5-7 days',
      severity: 'critical',
      recommendation: 'Plan shutdown for inspection',
      estimatedCost: 125000
    },
    {
      id: 3,
      asset: 'VLV-002',
      assetName: 'Pressure Relief Valve',
      type: 'Seat Wear',
      probability: 65,
      timeframe: '2-3 weeks',
      severity: 'warning',
      recommendation: 'Order replacement parts',
      estimatedCost: 8500
    },
    {
      id: 4,
      asset: 'CMP-003',
      assetName: 'Recycle Compressor',
      type: 'Vibration Anomaly',
      probability: 72,
      timeframe: '1-2 weeks',
      severity: 'warning',
      recommendation: 'Schedule alignment check',
      estimatedCost: 15000
    },
    {
      id: 5,
      asset: 'ESP-001',
      assetName: 'ESP Pump A-14',
      type: 'Motor Degradation',
      probability: 58,
      timeframe: '3-4 weeks',
      severity: 'warning',
      recommendation: 'Monitor closely, plan replacement',
      estimatedCost: 32000
    }
  ],

  safety: {
    daysWithoutLTI: 847,
    compliance: 98.2,
    activeHazards: 3,
    personnelOnsite: 247,
    hazards: [
      { id: 1, type: 'Gas Leak', location: 'RHCU Area', severity: 'medium', status: 'monitoring' },
      { id: 2, type: 'Hot Surface', location: 'Furnace F-101', severity: 'low', status: 'controlled' },
      { id: 3, type: 'Confined Space', location: 'Tank T-102', severity: 'medium', status: 'restricted' }
    ]
  },

  emissions: {
    nox: { value: 142, limit: 220, unit: 'tonnes/month', trend: -8 },
    sox: { value: 89, limit: 200, unit: 'tonnes/month', trend: -12 },
    voc: { value: 34, limit: 100, unit: 'tonnes/month', trend: -5 },
    co2: { value: 45200, limit: 55000, unit: 'tonnes/month', trend: -3 },
    history: {
      months: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
      nox: [165, 158, 152, 148, 145, 142],
      sox: [112, 105, 98, 94, 91, 89],
      voc: [42, 40, 38, 36, 35, 34],
      co2: [52000, 50500, 49000, 47500, 46200, 45200]
    }
  },

  safetyAlerts: [
    {
      id: 1,
      type: 'Gas Detection',
      title: 'H2S Detected - RHCU Area',
      description: 'Hydrogen sulfide levels at 8 ppm, above 5 ppm threshold',
      severity: 'critical',
      timestamp: new Date(Date.now() - 15 * 60000),
      location: 'RHCU Section B'
    },
    {
      id: 2,
      type: 'Temperature',
      title: 'High Temperature Alert',
      description: 'Furnace F-101 skin temperature exceeding normal range',
      severity: 'warning',
      timestamp: new Date(Date.now() - 45 * 60000),
      location: 'CDU-1 Furnace'
    },
    {
      id: 3,
      type: 'Personnel',
      title: 'Unauthorized Zone Entry',
      description: 'Badge #2847 entered restricted area without clearance',
      severity: 'warning',
      timestamp: new Date(Date.now() - 2 * 3600000),
      location: 'Tank Farm Zone C'
    },
    {
      id: 4,
      type: 'Equipment',
      title: 'Pressure Relief Activation',
      description: 'PSV-2201 activated due to pressure spike',
      severity: 'critical',
      timestamp: new Date(Date.now() - 4 * 3600000),
      location: 'RHCU Reactor'
    }
  ],

  cyber: {
    threatLevel: 'elevated',
    securityScore: 87,
    metrics: {
      networkSecurity: 92,
      endpointProtection: 88,
      scadaSecurity: 85,
      accessControl: 78
    },
    blockedThreats: 247,
    detectedThreats: 12,
    threats: [
      { id: 1, type: 'Port Scan', source: '185.234.xx.xx', status: 'blocked', timestamp: new Date(Date.now() - 5 * 60000) },
      { id: 2, type: 'Brute Force', source: '91.142.xx.xx', status: 'blocked', timestamp: new Date(Date.now() - 12 * 60000) },
      { id: 3, type: 'Anomalous Traffic', source: 'Internal', status: 'detected', timestamp: new Date(Date.now() - 25 * 60000) },
      { id: 4, type: 'Malware Signature', source: 'USB Device', status: 'blocked', timestamp: new Date(Date.now() - 45 * 60000) },
      { id: 5, type: 'SCADA Command', source: 'Unknown', status: 'detected', timestamp: new Date(Date.now() - 1.5 * 3600000) },
      { id: 6, type: 'SQL Injection', source: '103.45.xx.xx', status: 'blocked', timestamp: new Date(Date.now() - 2 * 3600000) }
    ],
    incidents: [
      { time: '14:32', title: 'Firewall Rule Updated', description: 'Blocked IP range 185.234.0.0/16', severity: 'info' },
      { time: '13:15', title: 'SCADA Anomaly Detected', description: 'Unusual command sequence on PLC-2201', severity: 'warning' },
      { time: '11:48', title: 'Access Denied', description: 'Multiple failed login attempts for admin account', severity: 'warning' },
      { time: '10:22', title: 'Malware Quarantined', description: 'Trojan detected on workstation WS-0147', severity: 'critical' },
      { time: '09:05', title: 'VPN Connection', description: 'New VPN session from authorized device', severity: 'info' }
    ],
    auditLog: [
      { timestamp: '2026-01-16 14:45:22', user: 'admin_ops', action: 'Config Change', resource: 'PLC-2201', status: 'success' },
      { timestamp: '2026-01-16 14:32:18', user: 'sys_monitor', action: 'Read Access', resource: 'Historian DB', status: 'success' },
      { timestamp: '2026-01-16 14:28:05', user: 'unknown', action: 'Login Attempt', resource: 'SCADA Server', status: 'denied' },
      { timestamp: '2026-01-16 14:15:33', user: 'eng_ahmed', action: 'Setpoint Change', resource: 'CDU-1 Controller', status: 'success' },
      { timestamp: '2026-01-16 14:02:47', user: 'maint_team', action: 'Download', resource: 'Equipment Logs', status: 'success' },
      { timestamp: '2026-01-16 13:55:12', user: 'admin_ops', action: 'User Creation', resource: 'Access Control', status: 'success' },
      { timestamp: '2026-01-16 13:42:28', user: 'external_ip', action: 'Port Scan', resource: 'Firewall', status: 'denied' }
    ]
  },

  activities: [
    { id: 1, type: 'maintenance', icon: '🔧', title: 'Scheduled Maintenance', meta: 'CDU-1 Heat Exchanger • 2 hours ago', severity: 'info' },
    { id: 2, type: 'alert', icon: '⚠️', title: 'High Vibration Detected', meta: 'Compressor CMP-003 • 3 hours ago', severity: 'warning' },
    { id: 3, type: 'production', icon: '📈', title: 'Production Target Met', meta: 'Daily target achieved • 5 hours ago', severity: 'info' },
    { id: 4, type: 'safety', icon: '🛡️', title: 'Safety Drill Completed', meta: 'Zone B Emergency Response • 6 hours ago', severity: 'info' },
    { id: 5, type: 'alert', icon: '🔴', title: 'Critical: Pump Failure Risk', meta: 'ESP-003 requires attention • 8 hours ago', severity: 'critical' },
    { id: 6, type: 'inspection', icon: '🔍', title: 'Inspection Completed', meta: 'Tank T-102 internal inspection • 12 hours ago', severity: 'info' }
  ],

  facilitySections: [
    { id: 'section-1', name: 'Section 1', type: 'processing', x: 30, y: 35, status: 'operational' },
    { id: 'section-2', name: 'Section 2', type: 'processing', x: 65, y: 40, status: 'warning' },
    { id: 'section-3', name: 'Section 3', type: 'storage', x: 45, y: 20, status: 'operational' },
    { id: 'section-4', name: 'Utilities', type: 'utilities', x: 80, y: 70, status: 'operational' },
    { id: 'section-5', name: 'Tank Farm', type: 'storage', x: 20, y: 65, status: 'operational' }
  ],

  processData: {
    temperature: {
      labels: generateTimeLabels(24),
      datasets: [
        { label: 'CDU Top', data: generateTimeSeriesData(24, 120, 140), color: '#4d96ff' },
        { label: 'CDU Middle', data: generateTimeSeriesData(24, 250, 280), color: '#6bcb77' },
        { label: 'CDU Bottom', data: generateTimeSeriesData(24, 340, 370), color: '#ffd93d' },
        { label: 'Furnace', data: generateTimeSeriesData(24, 400, 430), color: '#ff6b6b' }
      ]
    },
    pressure: {
      labels: generateTimeLabels(24),
      datasets: [
        { label: 'Column Top', data: generateTimeSeriesData(24, 1.8, 2.2), color: '#4d96ff' },
        { label: 'Column Bottom', data: generateTimeSeriesData(24, 2.2, 2.6), color: '#ff6b6b' },
        { label: 'Feed', data: generateTimeSeriesData(24, 3.0, 3.5), color: '#6bcb77' }
      ]
    },
    flow: {
      labels: generateTimeLabels(24),
      datasets: [
        { label: 'Crude Feed', data: generateTimeSeriesData(24, 9000, 9500), color: '#ffd93d' },
        { label: 'Naphtha', data: generateTimeSeriesData(24, 2500, 2800), color: '#4d96ff' },
        { label: 'Diesel', data: generateTimeSeriesData(24, 3200, 3600), color: '#6bcb77' },
        { label: 'Residue', data: generateTimeSeriesData(24, 2800, 3200), color: '#ff6b6b' }
      ]
    },
    yield: {
      labels: ['LPG', 'Naphtha', 'Kerosene', 'Diesel', 'Heavy Residue'],
      data: [8, 22, 15, 32, 23],
      colors: ['#9d4edd', '#4d96ff', '#6bcb77', '#ffd93d', '#ff6b6b']
    }
  },

  vibrationData: {
    labels: generateTimeLabels(48),
    normal: generateTimeSeriesData(48, 0.5, 1.5),
    current: generateTimeSeriesData(48, 0.8, 2.8),
    threshold: Array(48).fill(2.5)
  },

  motorData: {
    labels: generateTimeLabels(24),
    phaseA: generateTimeSeriesData(24, 95, 105),
    phaseB: generateTimeSeriesData(24, 94, 106),
    phaseC: generateTimeSeriesData(24, 93, 107)
  },

  bearingData: {
    labels: generateTimeLabels(24),
    de: generateTimeSeriesData(24, 65, 75),
    nde: generateTimeSeriesData(24, 60, 70),
    threshold: Array(24).fill(85)
  },

  rulData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    predicted: [8760, 7500, 6200, 4800, 3200, 1500],
    actual: [8760, 7200, 5800, null, null, null],
    confidence: [500, 600, 800, 1000, 1200, 1500]
  },

  scadaData: {
    labels: generateTimeLabels(100),
    normal: generateTimeSeriesData(100, 45, 55),
    anomalies: generateAnomalyData(100),
    threshold: { upper: 60, lower: 40 }
  }
};

export function simulateRealTimeData(data) {
  const updatedData = { ...data };
  
  updatedData.kpis = {
    ...data.kpis,
    production: {
      ...data.kpis.production,
      value: data.kpis.production.value + Math.round((Math.random() - 0.5) * 500)
    },
    efficiency: {
      ...data.kpis.efficiency,
      value: parseFloat((data.kpis.efficiency.value + (Math.random() - 0.5) * 0.2).toFixed(1))
    },
    energy: {
      ...data.kpis.energy,
      value: data.kpis.energy.value + Math.round((Math.random() - 0.5) * 20)
    },
    water: {
      ...data.kpis.water,
      value: data.kpis.water.value + Math.round((Math.random() - 0.5) * 50)
    }
  };

  return updatedData;
}

export default mockData;
