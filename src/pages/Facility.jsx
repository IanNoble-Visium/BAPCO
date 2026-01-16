import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useRealTimeData } from '../hooks/useRealTimeData';
import FacilityView from '../components/three/FacilityView';

function Facility() {
  const [activeView, setActiveView] = useState('overview');
  const [activeTab, setActiveTab] = useState('sections');
  const { data } = useRealTimeData();

  useEffect(() => {
    gsap.from('.section-card', {
      opacity: 0,
      x: 30,
      stagger: 0.1,
      duration: 0.5,
      ease: 'power2.out'
    });
  }, []);

  const handleViewChange = (view) => {
    setActiveView(view);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    gsap.from(`#${tab}Tab`, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  return (
    <section id="facility" className="page-section facility-section">
      <div className="section-header">
        <h2 className="section-title">
          <span className="title-icon">⬡</span>
          3D Facility Overview
        </h2>
        <div className="section-controls">
          {['overview', 'thermal', 'flow', 'alerts'].map((view) => (
            <button
              key={view}
              className={`control-btn ${activeView === view ? 'active' : ''}`}
              onClick={() => handleViewChange(view)}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="facility-container">
        <div className="facility-3d-viewport">
          <FacilityView viewMode={activeView} />
          <ViewportControls />
          <CompassIndicator />
        </div>

        <div className="facility-sidebar">
          <div className="sidebar-tabs">
            {['sections', 'activity', 'labels'].map((tab) => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="sidebar-content">
            <div className={`tab-content ${activeTab === 'sections' ? 'active' : ''}`} id="sectionsTab">
              <SectionCard
                name="CDU - Crude Distillation"
                status="operational"
                metrics={[
                  { label: 'Throughput', value: '225,000 BPD' },
                  { label: 'Temperature', value: '365°C' }
                ]}
                progress={87}
              />
              <SectionCard
                name="RHCU - Hydrocracking"
                status="warning"
                metrics={[
                  { label: 'Throughput', value: '65,000 BPD' },
                  { label: 'Pressure', value: '2,150 PSI' }
                ]}
                progress={72}
              />
              <SectionCard
                name="Tank Farm - Storage"
                status="operational"
                metrics={[
                  { label: 'Capacity', value: '2.4M BBL' },
                  { label: 'Utilization', value: '78%' }
                ]}
                progress={78}
              />
              <SectionCard
                name="Utilities & Power"
                status="operational"
                metrics={[
                  { label: 'Power Load', value: '145 MW' },
                  { label: 'Steam', value: '890 T/H' }
                ]}
                progress={91}
              />
            </div>

            <div className={`tab-content ${activeTab === 'activity' ? 'active' : ''}`} id="activityTab">
              <div className="activity-list">
                {data.activities.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>

            <div className={`tab-content ${activeTab === 'labels' ? 'active' : ''}`} id="labelsTab">
              <div className="labels-filter">
                <span className="filter-label">Filter by Tag:</span>
                <div className="filter-tags">
                  <button className="tag-btn active">All</button>
                  <button className="tag-btn">Critical</button>
                  <button className="tag-btn">Maintenance</button>
                  <button className="tag-btn">Safety</button>
                </div>
              </div>
              <div className="labels-list">
                {data.units.map((unit) => (
                  <div key={unit.id} className={`label-item ${unit.status}`}>
                    <span className="label-name">{unit.shortName}</span>
                    <span className="label-status">{unit.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionCard({ name, status, metrics, progress }) {
  return (
    <div className={`section-card ${status}`}>
      <div className="section-header-mini">
        <span className={`section-status ${status}`}></span>
        <span className="section-name">{name}</span>
      </div>
      <div className="section-metrics">
        {metrics.map((metric, index) => (
          <div key={index} className="metric">
            <span className="metric-label">{metric.label}</span>
            <span className="metric-value">{metric.value}</span>
          </div>
        ))}
      </div>
      <div className="section-progress">
        <div className="progress-bar" style={{ '--progress': `${progress}%` }}></div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  return (
    <div className={`activity-item ${activity.type}`}>
      <div className="activity-icon">{activity.icon}</div>
      <div className="activity-content">
        <div className="activity-title">{activity.title}</div>
        <div className="activity-time">{activity.meta}</div>
      </div>
      <div className={`activity-status ${activity.severity}`}>{activity.severity}</div>
    </div>
  );
}

function ViewportControls() {
  return (
    <div className="viewport-controls">
      <button className="viewport-btn" id="zoomIn">+</button>
      <button className="viewport-btn" id="zoomOut">−</button>
      <button className="viewport-btn" id="resetView">⟲</button>
      <button className="viewport-btn" id="toggleRotate">◎</button>
    </div>
  );
}

function CompassIndicator() {
  return (
    <div className="compass-indicator">
      <div className="compass-ring">
        <span className="compass-n">N</span>
        <span className="compass-e">E</span>
        <span className="compass-s">S</span>
        <span className="compass-w">W</span>
      </div>
      <div className="compass-needle" id="compassNeedle"></div>
      <div className="compass-degrees" id="compassDegrees">315°</div>
    </div>
  );
}

export default Facility;
