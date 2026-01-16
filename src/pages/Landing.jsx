import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useRealTimeData, useAnimatedValue } from '../hooks/useRealTimeData';
import HeroRefinery from '../components/three/HeroRefinery';

function Landing() {
  const sectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const { data } = useRealTimeData();

  const productionValue = useAnimatedValue(data.kpis.production.value, 2000);
  const efficiencyValue = useAnimatedValue(data.kpis.efficiency.value, 2000);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.from('.hero-badge', {
      opacity: 0,
      y: -30,
      duration: 0.6,
      ease: 'power2.out'
    })
    .from('.title-line', {
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.3')
    .from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')
    .from('.stat-card', {
      opacity: 0,
      y: 30,
      scale: 0.9,
      stagger: 0.1,
      duration: 0.5,
      ease: 'back.out(1.5)'
    }, '-=0.2');

    gsap.to('.scroll-wheel', {
      y: 8,
      duration: 0.8,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section id="landing" className="page-section landing-section active" ref={sectionRef}>
      <div className="video-background">
        <div className="video-overlay"></div>
        <div className="gradient-overlay"></div>
        <canvas id="heroCanvas"></canvas>
      </div>

      <div className="landing-content">
        <div className="hero-text" ref={heroTextRef}>
          <div className="hero-badge">
            <span className="badge-icon">◆</span>
            <span>BAHRAIN PETROLEUM COMPANY</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">Unified</span>
            <span className="title-line highlight">Operations</span>
            <span className="title-line">Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            AI-Driven Analytics • Digital Twins • Predictive Maintenance
          </p>
          <div className="hero-stats">
            <StatCard 
              value={Math.round(productionValue).toLocaleString()} 
              label="BPD Capacity" 
              trend="+12%" 
              trendUp={true} 
            />
            <StatCard 
              value={`${efficiencyValue.toFixed(1)}%`} 
              label="Uptime" 
              trend="+2.3%" 
              trendUp={true} 
            />
            <StatCard 
              value="47" 
              label="Active Alerts" 
              trend="-31%" 
              trendUp={false} 
            />
            <StatCard 
              value="156" 
              label="Sensors Online" 
              trend="→" 
              trendUp={null} 
            />
          </div>
        </div>

        <div className="hero-3d-container">
          <HeroRefinery />
          <div className="hotspot-labels" id="heroHotspots"></div>
        </div>
      </div>

      <div className="scroll-indicator">
        <div className="scroll-mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to Explore</span>
      </div>
    </section>
  );
}

function StatCard({ value, label, trend, trendUp }) {
  const getTrendClass = () => {
    if (trendUp === true) return 'up';
    if (trendUp === false) return 'down';
    return 'neutral';
  };

  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      <div className={`stat-trend ${getTrendClass()}`}>
        {trendUp === true && '↑'}
        {trendUp === false && '↓'}
        {trend}
      </div>
    </div>
  );
}

export default Landing;
