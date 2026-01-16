import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

function Preloader() {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Systems...');
  const containerRef = useRef(null);
  const particlesRef = useRef(null);

  const loadingSteps = [
    { progress: 20, text: 'Loading 3D Assets...' },
    { progress: 40, text: 'Connecting to SCADA...' },
    { progress: 60, text: 'Fetching Real-time Data...' },
    { progress: 80, text: 'Initializing AI Analytics...' },
    { progress: 100, text: 'Ready!' }
  ];

  useEffect(() => {
    let stepIndex = 0;
    
    const interval = setInterval(() => {
      if (stepIndex < loadingSteps.length) {
        const step = loadingSteps[stepIndex];
        setProgress(step.progress);
        setStatusText(step.text);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 500);

    initParticles();

    return () => clearInterval(interval);
  }, []);

  const initParticles = () => {
    if (!particlesRef.current) return;

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'preloader-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(0, 212, 255, ${Math.random() * 0.5 + 0.2});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;
      particlesRef.current.appendChild(particle);

      gsap.to(particle, {
        y: -100 - Math.random() * 200,
        x: (Math.random() - 0.5) * 100,
        opacity: 0,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        ease: 'power1.out'
      });
    }
  };

  return (
    <div id="preloader" ref={containerRef}>
      <div className="loader-container">
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-ring"></div>
        <div className="loader-logo">
          <span className="logo-text">TruContext</span>
          <span className="logo-tm">™</span>
        </div>
        <div className="loader-text">{statusText}</div>
        <div className="loader-progress">
          <div 
            className="loader-progress-bar" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <div className="particle-field" ref={particlesRef}></div>
    </div>
  );
}

export default Preloader;
