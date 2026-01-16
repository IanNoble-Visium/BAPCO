import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRealTimeData, useAnimatedValue } from '../hooks/useRealTimeData';
import { Line } from 'react-chartjs-2';

function Cyber() {
  const { data } = useRealTimeData();
  const securityScore = useAnimatedValue(data.cyber.securityScore, 2000);

  useEffect(() => {
    gsap.from('.posture-metric', {
      opacity: 0,
      x: -20,
      stagger: 0.1,
      duration: 0.4,
      ease: 'power2.out'
    });
  }, []);

  const anomalyChartData = {
    labels: data.scadaData.labels,
    datasets: [
      {
        label: 'Normal Pattern',
        data: data.scadaData.normal,
        borderColor: '#6bcb77',
        backgroundColor: 'rgba(107, 203, 119, 0.1)',
        borderWidth: 1,
        fill: true,
        tension: 0.4,
        pointRadius: 0
      },
      {
        label: 'Upper Threshold',
        data: Array(100).fill(data.scadaData.threshold.upper),
        borderColor: '#ffd93d',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      },
      {
        label: 'Lower Threshold',
        data: Array(100).fill(data.scadaData.threshold.lower),
        borderColor: '#ffd93d',
        borderWidth: 1,
        borderDash: [5, 5],
        fill: false,
        pointRadius: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: 'rgba(255, 255, 255, 0.7)', font: { size: 10 } }
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: 'rgba(255, 255, 255, 0.5)' }
      }
    }
  };

  return (
    <section id="cyber" className="page-section cyber-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">🛡</span>
          IT/OT Cybersecurity Operations
        </h2>
        <div className="threat-level">
          <span className="threat-label">Threat Level:</span>
          <span className={`threat-value ${data.cyber.threatLevel}`}>
            {data.cyber.threatLevel.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="cyber-grid">
        <div className="security-posture">
          <div className="posture-header">
            <h3>Security Posture</h3>
            <div className="posture-score">
              <span className="score-value">{Math.round(securityScore)}</span>
              <span className="score-max">/100</span>
            </div>
          </div>
          <div className="posture-metrics">
            <PostureMetric label="Network Security" value={data.cyber.metrics.networkSecurity} />
            <PostureMetric label="Endpoint Protection" value={data.cyber.metrics.endpointProtection} />
            <PostureMetric label="SCADA Security" value={data.cyber.metrics.scadaSecurity} />
            <PostureMetric label="Access Control" value={data.cyber.metrics.accessControl} warning />
          </div>
        </div>

        <div className="network-topology">
          <div className="topology-header">
            <h3>Network Topology</h3>
            <div className="topology-controls">
              <button className="topo-btn active">IT</button>
              <button className="topo-btn">OT</button>
              <button className="topo-btn">Combined</button>
            </div>
          </div>
          <NetworkTopology />
        </div>

        <div className="threat-detection">
          <div className="detection-header">
            <h3>Real-time Threat Detection</h3>
            <div className="detection-stats">
              <span className="stat blocked">{data.cyber.blockedThreats} Blocked</span>
              <span className="stat detected">{data.cyber.detectedThreats} Detected</span>
            </div>
          </div>
          <div className="threat-feed">
            {data.cyber.threats.map((threat) => (
              <ThreatItem key={threat.id} threat={threat} />
            ))}
          </div>
        </div>

        <div className="scada-anomaly">
          <div className="anomaly-header">
            <h3>SCADA Anomaly Detection</h3>
            <div className="ai-badge">
              <span className="ai-icon">🤖</span>
              TruContext AI
            </div>
          </div>
          <div className="chart-container">
            <Line data={anomalyChartData} options={chartOptions} />
          </div>
          <div className="anomaly-legend">
            <div className="legend-item"><span className="dot normal"></span>Normal Pattern</div>
            <div className="legend-item"><span className="dot anomaly"></span>Anomaly Detected</div>
            <div className="legend-item"><span className="dot threshold"></span>Threshold</div>
          </div>
        </div>

        <div className="incident-timeline">
          <div className="timeline-header">
            <h3>Incident Timeline</h3>
            <div className="timeline-range">Last 24 Hours</div>
          </div>
          <div className="timeline-container">
            {data.cyber.incidents.map((incident, index) => (
              <TimelineItem key={index} incident={incident} />
            ))}
          </div>
        </div>

        <div className="audit-log">
          <div className="audit-header">
            <h3>Access Audit Log</h3>
            <button className="export-btn">Export</button>
          </div>
          <div className="audit-table-wrapper">
            <table className="audit-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Action</th>
                  <th>Resource</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.cyber.auditLog.map((log, index) => (
                  <AuditRow key={index} log={log} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function PostureMetric({ label, value, warning }) {
  return (
    <div className="posture-metric">
      <div className="metric-bar">
        <div 
          className={`bar-fill ${warning ? 'warning' : ''}`} 
          style={{ '--fill': `${value}%` }}
        ></div>
      </div>
      <span className="metric-label">{label}</span>
      <span className="metric-value">{value}%</span>
    </div>
  );
}

function NetworkTopology() {
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

    // Define nodes
    const nodes = [
      { x: 150, y: 30, label: 'Internet', type: 'external' },
      { x: 150, y: 80, label: 'Firewall', type: 'security' },
      { x: 75, y: 130, label: 'IT Network', type: 'it' },
      { x: 225, y: 130, label: 'DMZ', type: 'dmz' },
      { x: 150, y: 180, label: 'OT Network', type: 'ot' },
      { x: 75, y: 230, label: 'SCADA', type: 'scada' },
      { x: 150, y: 230, label: 'DCS', type: 'scada' },
      { x: 225, y: 230, label: 'Historian', type: 'it' }
    ];

    // Draw connections
    ctx.strokeStyle = 'rgba(0, 212, 255, 0.3)';
    ctx.lineWidth = 2;
    
    const connections = [
      [0, 1], [1, 2], [1, 3], [2, 4], [3, 4], [4, 5], [4, 6], [4, 7]
    ];

    connections.forEach(([from, to]) => {
      ctx.beginPath();
      ctx.moveTo(nodes[from].x, nodes[from].y);
      ctx.lineTo(nodes[to].x, nodes[to].y);
      ctx.stroke();

      // Animated data flow dots
      const progress = (Date.now() % 2000) / 2000;
      const x = nodes[from].x + (nodes[to].x - nodes[from].x) * progress;
      const y = nodes[from].y + (nodes[to].y - nodes[from].y) * progress;
      
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.fill();
    });

    // Draw nodes
    nodes.forEach(node => {
      const colors = {
        external: '#ff6b6b',
        security: '#ffd93d',
        it: '#4d96ff',
        dmz: '#9d4edd',
        ot: '#6bcb77',
        scada: '#00d4ff'
      };

      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
      ctx.fillStyle = colors[node.type] || '#00d4ff';
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.font = '9px Inter';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, node.x, node.y + 28);
    });
  }, []);

  return <canvas ref={canvasRef} id="networkCanvas" width={300} height={280} />;
}

function ThreatItem({ threat }) {
  const getTimeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours} hrs ago`;
  };

  return (
    <div className={`threat-item ${threat.status}`}>
      <div className="threat-status">{threat.status === 'blocked' ? '🛡️' : '⚠️'}</div>
      <div className="threat-content">
        <div className="threat-attack">{threat.type}</div>
        <div className="threat-source">{threat.source}</div>
      </div>
      <div className="threat-time">{getTimeAgo(threat.timestamp)}</div>
    </div>
  );
}

function TimelineItem({ incident }) {
  const severityColors = {
    critical: '#ff6b6b',
    warning: '#ffd93d',
    info: '#00d4ff'
  };

  return (
    <div className={`timeline-item ${incident.severity}`}>
      <div 
        className="timeline-marker" 
        style={{ backgroundColor: severityColors[incident.severity] }}
      ></div>
      <div className="timeline-content">
        <div className="timeline-time">{incident.time}</div>
        <div className="timeline-title">{incident.title}</div>
      </div>
    </div>
  );
}

function AuditRow({ log }) {
  return (
    <tr className={log.status === 'denied' ? 'warning' : ''}>
      <td>{log.timestamp.split(' ')[1]}</td>
      <td>{log.user}</td>
      <td>{log.action}</td>
      <td>{log.resource}</td>
      <td><span className={`status-badge ${log.status}`}>{log.status}</span></td>
    </tr>
  );
}

export default Cyber;
