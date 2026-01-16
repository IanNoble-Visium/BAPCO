import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRealTimeData } from '../hooks/useRealTimeData';
import { Line } from 'react-chartjs-2';

function Safety() {
  const { data } = useRealTimeData();

  useEffect(() => {
    gsap.from('.safety-kpi-card', {
      opacity: 0,
      scale: 0.9,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.5)'
    });

    // Animate rings
    document.querySelectorAll('.ring-progress').forEach((ring, index) => {
      const progress = parseFloat(ring.style.getPropertyValue('--progress') || 0.5);
      const circumference = 2 * Math.PI * 45;
      const offset = circumference * (1 - progress);
      
      gsap.fromTo(ring,
        { strokeDashoffset: circumference },
        { strokeDashoffset: offset, duration: 1.5, ease: 'power2.out', delay: index * 0.2 }
      );
    });
  }, []);

  const emissionsChartData = {
    labels: data.emissions.history.months,
    datasets: [
      {
        label: 'NOx',
        data: data.emissions.history.nox,
        borderColor: '#ff6b6b',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'SOx',
        data: data.emissions.history.sox,
        borderColor: '#ffd93d',
        backgroundColor: 'rgba(255, 217, 61, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      },
      {
        label: 'VOC',
        data: data.emissions.history.voc,
        borderColor: '#6bcb77',
        backgroundColor: 'rgba(107, 203, 119, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgba(255, 255, 255, 0.7)' }
      }
    },
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  return (
    <section id="safety" className="page-section safety-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">⚠</span>
          Safety & Environmental Compliance
        </h2>
        <div className="compliance-badge">
          <span className="badge-icon">✓</span>
          Bahrain Vision 2030 Aligned
        </div>
      </div>

      <div className="safety-grid">
        <div className="safety-kpis">
          <SafetyKPICard
            value={data.safety.daysWithoutLTI}
            title="Days Without LTI"
            subtitle="Lost Time Incident"
            progress={0.95}
          />
          <SafetyKPICard
            value={`${data.safety.compliance}%`}
            title="Safety Compliance"
            subtitle="Regulatory Standards"
            progress={0.88}
          />
          <SafetyKPICard
            value={data.safety.activeHazards}
            title="Active Hazards"
            subtitle="Under Monitoring"
            progress={0.72}
            warning
          />
        </div>

        <div className="emissions-dashboard">
          <div className="emissions-header">
            <h3>Emissions Monitoring (Scope 1 & 2)</h3>
            <div className="emissions-period">
              <span>Jan 2026</span>
              <span className="trend down">↓ 12% YoY</span>
            </div>
          </div>

          <div className="emissions-charts">
            <EmissionCard
              type="nox"
              label="NOx"
              value={data.emissions.nox.value}
              limit={data.emissions.nox.limit}
              unit={data.emissions.nox.unit}
            />
            <EmissionCard
              type="sox"
              label="SOx"
              value={data.emissions.sox.value}
              limit={data.emissions.sox.limit}
              unit={data.emissions.sox.unit}
            />
            <EmissionCard
              type="voc"
              label="VOC"
              value={data.emissions.voc.value}
              limit={data.emissions.voc.limit}
              unit={data.emissions.voc.unit}
            />
            <EmissionCard
              type="co2"
              label="CO₂"
              value={`${(data.emissions.co2.value / 1000).toFixed(1)}K`}
              limit={`${data.emissions.co2.limit / 1000}K`}
              unit={data.emissions.co2.unit}
              warning
            />
          </div>

          <div className="emissions-trend-chart">
            <Line data={emissionsChartData} options={chartOptions} />
          </div>
        </div>

        <div className="personnel-map">
          <div className="map-header">
            <h3>Personnel Tracking & Geofencing</h3>
            <div className="personnel-count">
              <span className="count-value">{data.safety.personnelOnsite}</span>
              <span className="count-label">On-site</span>
            </div>
          </div>
          <div className="map-container">
            <PersonnelMap />
            <div className="map-legend">
              <div className="legend-item"><span className="dot green"></span>Safe Zone</div>
              <div className="legend-item"><span className="dot yellow"></span>Caution Zone</div>
              <div className="legend-item"><span className="dot red"></span>Restricted Zone</div>
            </div>
          </div>
        </div>

        <div className="alerts-panel">
          <div className="alerts-header">
            <h3>Safety Alerts</h3>
            <div className="alerts-filter">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">Critical</button>
              <button className="filter-btn">Warning</button>
            </div>
          </div>
          <div className="alerts-list">
            {data.safetyAlerts.map((alert) => (
              <AlertItem key={alert.id} alert={alert} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SafetyKPICard({ value, title, subtitle, progress, warning }) {
  return (
    <div className="safety-kpi-card">
      <div className={`kpi-ring ${warning ? 'warning' : ''}`}>
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="ring-bg" />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="ring-progress"
            style={{ '--progress': progress }}
          />
        </svg>
        <div className="ring-value">{value}</div>
      </div>
      <div className="kpi-info">
        <div className="kpi-title">{title}</div>
        <div className="kpi-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}

function EmissionCard({ type, label, value, limit, unit, warning }) {
  const percentage = (parseFloat(value) / parseFloat(limit)) * 100;
  
  return (
    <div className="emission-card">
      <div className={`emission-icon ${type}`}>{label}</div>
      <div className="emission-value">{value}</div>
      <div className="emission-unit">{unit}</div>
      <div className="emission-bar">
        <div 
          className={`bar-fill ${warning ? 'warning' : ''}`} 
          style={{ '--fill': `${Math.min(percentage, 100)}%` }}
        ></div>
        <div className="bar-limit">Limit: {limit}</div>
      </div>
    </div>
  );
}

function PersonnelMap() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw zones
    const zones = [
      { x: 50, y: 50, r: 80, color: 'rgba(107, 203, 119, 0.2)', label: 'CDU' },
      { x: 200, y: 80, r: 60, color: 'rgba(255, 217, 61, 0.2)', label: 'RHCU' },
      { x: 150, y: 150, r: 50, color: 'rgba(255, 107, 107, 0.2)', label: 'Restricted' }
    ];

    zones.forEach(zone => {
      ctx.beginPath();
      ctx.arc(zone.x, zone.y, zone.r, 0, Math.PI * 2);
      ctx.fillStyle = zone.color;
      ctx.fill();
      ctx.strokeStyle = zone.color.replace('0.2', '0.5');
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '10px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(zone.label, zone.x, zone.y);
    });

    // Draw personnel dots
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
    }
  }, []);

  return <canvas ref={canvasRef} width={300} height={200} />;
}

function AlertItem({ alert }) {
  const getIcon = () => {
    switch (alert.severity) {
      case 'critical': return '🚨';
      case 'warning': return '⚠️';
      default: return 'ℹ️';
    }
  };

  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hrs ago`;
  };

  return (
    <div className={`alert-item ${alert.severity}`}>
      <div className="alert-icon">{getIcon()}</div>
      <div className="alert-content">
        <div className="alert-title">{alert.title}</div>
        <div className="alert-detail">{alert.description}</div>
      </div>
      <div className="alert-time">{getTimeAgo(alert.timestamp)}</div>
    </div>
  );
}

export default Safety;
