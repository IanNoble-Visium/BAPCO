import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRealTimeData, useAnimatedValue } from '../hooks/useRealTimeData';
import ProcessCharts from '../components/charts/ProcessCharts';
import TowerVisualization from '../components/three/TowerVisualization';

function Process() {
  const [timeRange, setTimeRange] = useState('24h');
  const { data } = useRealTimeData();

  const productionValue = useAnimatedValue(data.kpis.production.value, 1000);
  const efficiencyValue = useAnimatedValue(data.kpis.efficiency.value, 1000);
  const energyValue = useAnimatedValue(data.kpis.energy.value, 1000);
  const waterValue = useAnimatedValue(data.kpis.water.value, 1000);

  useEffect(() => {
    gsap.from('.kpi-card', {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.5)'
    });
  }, []);

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  return (
    <section id="process" className="page-section process-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">◈</span>
          Process Monitoring
        </h2>
        <div className="time-range-selector">
          {['1h', '24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              className={`range-btn ${timeRange === range ? 'active' : ''}`}
              onClick={() => handleTimeRangeChange(range)}
            >
              {range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="process-grid">
        <div className="kpi-row">
          <KPICard
            icon="🛢️"
            value={Math.round(productionValue).toLocaleString()}
            label="Production Rate (BPD)"
            trend="+3.2%"
            trendUp={true}
            chartData={data.kpis.production.history}
          />
          <KPICard
            icon="⚡"
            value={`${efficiencyValue.toFixed(1)}%`}
            label="Yield Efficiency"
            trend="+1.8%"
            trendUp={true}
            chartData={data.kpis.efficiency.history}
          />
          <KPICard
            icon="🔥"
            value={Math.round(energyValue).toLocaleString()}
            label="Energy (MWh)"
            trend="-2.1%"
            trendUp={false}
            chartData={data.kpis.energy.history}
          />
          <KPICard
            icon="💧"
            value={Math.round(waterValue).toLocaleString()}
            label="Water Usage (m³)"
            trend="-5.4%"
            trendUp={false}
            chartData={data.kpis.water.history}
          />
        </div>

        <div className="tower-visualization">
          <div className="tower-header">
            <h3>Crude Distillation Unit (CDU-1)</h3>
            <div className="tower-status operational">
              <span className="status-dot"></span>
              Operational
            </div>
          </div>
          <div className="tower-container">
            <TowerVisualization />
            <div className="tower-readings" id="towerReadings"></div>
          </div>
          <div className="tower-legend">
            <div className="legend-item"><span className="legend-color" style={{ background: '#ff6b6b' }}></span>Heavy Residue</div>
            <div className="legend-item"><span className="legend-color" style={{ background: '#ffd93d' }}></span>Diesel</div>
            <div className="legend-item"><span className="legend-color" style={{ background: '#6bcb77' }}></span>Kerosene</div>
            <div className="legend-item"><span className="legend-color" style={{ background: '#4d96ff' }}></span>Naphtha</div>
            <div className="legend-item"><span className="legend-color" style={{ background: '#9d4edd' }}></span>LPG</div>
          </div>
        </div>

        <ProcessCharts timeRange={timeRange} data={data.processData} />

        <div className="gauges-row">
          <GaugeDisplay id="gauge1" label="Reactor Temp" value="425°C" progress={71} color="#ff6b6b" />
          <GaugeDisplay id="gauge2" label="Column Pressure" value="2.4 Bar" progress={48} color="#4ecdc4" />
          <GaugeDisplay id="gauge3" label="Feed Rate" value="9,375 BPH" progress={78} color="#45b7d1" />
          <GaugeDisplay id="gauge4" label="Reflux Ratio" value="3.2:1" progress={64} color="#96ceb4" />
          <GaugeDisplay id="gauge5" label="Steam Flow" value="45 T/H" progress={56} color="#ffeaa7" />
        </div>
      </div>
    </section>
  );
}

function KPICard({ icon, value, label, trend, trendUp, chartData }) {
  return (
    <div className="kpi-card">
      <div className="kpi-icon">{icon}</div>
      <div className="kpi-content">
        <div className="kpi-value">{value}</div>
        <div className="kpi-label">{label}</div>
      </div>
      <div className="kpi-chart">
        <MiniSparkline data={chartData} />
      </div>
      <div className={`kpi-trend ${trendUp ? 'up' : 'down'}`}>{trend}</div>
    </div>
  );
}

function MiniSparkline({ data }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !data) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    ctx.beginPath();
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 2;

    data.forEach((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  }, [data]);

  return <canvas ref={canvasRef} width={80} height={30} />;
}

function GaugeDisplay({ id, label, value, progress, color }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Background arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, Math.PI * 2.25, false);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Value arc
    const endAngle = Math.PI * 0.75 + (Math.PI * 1.5 * (progress / 100));
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, Math.PI * 0.75, endAngle, false);
    ctx.strokeStyle = color;
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, [progress, color]);

  return (
    <div className="gauge-container">
      <canvas ref={canvasRef} id={id} width={120} height={120} />
      <div className="gauge-label">{label}</div>
      <div className="gauge-value">{value}</div>
    </div>
  );
}

export default Process;
