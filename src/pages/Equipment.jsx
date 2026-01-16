import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useRealTimeData } from '../hooks/useRealTimeData';
import EquipmentCharts from '../components/charts/EquipmentCharts';
import EquipmentViewer from '../components/three/EquipmentViewer';

function Equipment() {
  const [selectedView, setSelectedView] = useState('exterior');
  const [searchTerm, setSearchTerm] = useState('');
  const { data } = useRealTimeData();

  const healthyCounts = {
    total: data.assets.length,
    healthy: data.assets.filter(a => a.status === 'operational').length,
    warning: data.assets.filter(a => a.status === 'warning').length,
    critical: data.assets.filter(a => a.status === 'critical').length
  };

  const filteredAssets = data.assets.filter(asset =>
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    asset.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    gsap.from('.overview-card', {
      opacity: 0,
      scale: 0.8,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.7)'
    });
  }, []);

  return (
    <section id="equipment" className="page-section equipment-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">⚙</span>
          Equipment Health & Predictive Maintenance
        </h2>
        <div className="ai-indicator">
          <span className="ai-pulse"></span>
          AI Analytics Active
        </div>
      </div>

      <div className="equipment-grid">
        <div className="equipment-overview">
          <OverviewCard icon="📦" value={healthyCounts.total} label="Total Assets" type="total" />
          <OverviewCard icon="✅" value={healthyCounts.healthy} label="Healthy" type="healthy" />
          <OverviewCard icon="⚠️" value={healthyCounts.warning} label="Warning" type="warning" />
          <OverviewCard icon="🔴" value={healthyCounts.critical} label="Critical" type="critical" />
        </div>

        <div className="equipment-viewer">
          <div className="viewer-header">
            <h3>ESP Pump Assembly - Well A-14</h3>
            <div className="viewer-controls">
              {['exterior', 'cutaway', 'exploded'].map((view) => (
                <button
                  key={view}
                  className={`viewer-btn ${selectedView === view ? 'active' : ''}`}
                  onClick={() => setSelectedView(view)}
                >
                  {view.charAt(0).toUpperCase() + view.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <EquipmentViewer viewMode={selectedView} />
          <div className="viewer-info">
            <InfoItem label="Model" value="ESP-540X" />
            <InfoItem label="Installed" value="2023-06-15" />
            <InfoItem label="Runtime" value="8,760 hrs" />
            <InfoItem label="RUL" value="2,340 hrs" warning />
          </div>
        </div>

        <div className="predictive-panel">
          <div className="panel-header">
            <h3>Predictive Maintenance Alerts</h3>
            <span className="alert-count">{data.predictions.length} Active</span>
          </div>
          <div className="prediction-list">
            {data.predictions.map((prediction) => (
              <PredictionItem key={prediction.id} prediction={prediction} />
            ))}
          </div>
        </div>

        <EquipmentCharts data={data} />

        <div className="asset-table-container">
          <div className="table-header">
            <h3>Critical Assets Monitoring</h3>
            <div className="table-search">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="table-wrapper">
            <table className="asset-table">
              <thead>
                <tr>
                  <th>Asset ID</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Health Score</th>
                  <th>RUL (hrs)</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <AssetRow key={asset.id} asset={asset} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function OverviewCard({ icon, value, label, type }) {
  return (
    <div className={`overview-card ${type}`}>
      <div className="overview-icon">{icon}</div>
      <div className="overview-value">{value}</div>
      <div className="overview-label">{label}</div>
    </div>
  );
}

function InfoItem({ label, value, warning }) {
  return (
    <div className="info-item">
      <span className="info-label">{label}</span>
      <span className={`info-value ${warning ? 'warning' : ''}`}>{value}</span>
    </div>
  );
}

function PredictionItem({ prediction }) {
  return (
    <div className={`prediction-item ${prediction.severity}`}>
      <div className="prediction-header">
        <span className="prediction-asset">{prediction.asset}</span>
        <span className="prediction-probability">{prediction.probability}%</span>
      </div>
      <div className="prediction-issue">{prediction.type}</div>
      <div className="prediction-timeframe">Expected: {prediction.timeframe}</div>
      <div className="prediction-actions">
        <button className="action-btn">Schedule</button>
        <button className="action-btn secondary">Details</button>
      </div>
    </div>
  );
}

function AssetRow({ asset }) {
  return (
    <tr className={asset.status}>
      <td>{asset.id}</td>
      <td>{asset.name}</td>
      <td>{asset.type}</td>
      <td>{asset.location}</td>
      <td>
        <div className="health-bar">
          <div className={`health-fill ${asset.status}`} style={{ width: `${asset.health}%` }}></div>
        </div>
        <span className="health-value">{asset.health}%</span>
      </td>
      <td>{asset.rul.toLocaleString()}</td>
      <td><span className={`status-badge ${asset.status}`}>{asset.status}</span></td>
      <td>
        <button className="table-btn">View</button>
        <button className="table-btn">Schedule</button>
      </td>
    </tr>
  );
}

export default Equipment;
