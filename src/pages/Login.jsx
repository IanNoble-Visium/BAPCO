import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';
import anime from 'animejs';

/**
 * DEMO-ONLY LOGIN PAGE
 * Credentials: admin / admin
 * This is for demonstration purposes only - not production-ready authentication.
 */
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, getRememberedUsername } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const particlesRef = useRef(null);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    const remembered = getRememberedUsername();
    if (remembered) {
      setUsername(remembered);
      setRememberMe(true);
    }

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );

    initParticles();
  }, []);

  const initParticles = () => {
    if (!particlesRef.current) return;
    
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.className = 'login-particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: rgba(0, 212, 255, ${Math.random() * 0.4 + 0.1});
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        pointer-events: none;
      `;
      particlesRef.current.appendChild(particle);

      anime({
        targets: particle,
        translateY: [-100 - Math.random() * 200],
        translateX: [(Math.random() - 0.5) * 100],
        opacity: [1, 0],
        duration: 3000 + Math.random() * 2000,
        easing: 'easeOutQuad',
        loop: true
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(username, password, rememberMe);
      
      gsap.to(formRef.current, {
        opacity: 0,
        y: -20,
        scale: 0.95,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => navigate(from, { replace: true })
      });
    } catch (err) {
      setError('Invalid credentials. Use admin / admin for demo.');
      setIsLoading(false);
      
      anime({
        targets: formRef.current,
        translateX: [-10, 10, -10, 10, 0],
        duration: 400,
        easing: 'easeInOutQuad'
      });
    }
  };

  return (
    <div className="login-page" ref={containerRef}>
      <div className="login-particles" ref={particlesRef}></div>
      
      <div className="login-background">
        <div className="grid-overlay"></div>
        <div className="gradient-overlay"></div>
      </div>

      <div className="login-container" ref={formRef}>
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-v">V</span>isium
          </div>
          <div className="login-product">TruContext™</div>
          <div className="login-subtitle">Operations Intelligence Platform</div>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-wrapper">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkmark"></span>
              <span className="checkbox-label">Remember me</span>
            </label>
          </div>

          {error && (
            <div className="login-error">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <span className="button-loader">
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
                <span className="loader-dot"></span>
              </span>
            ) : (
              <>
                <span>Access Dashboard</span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <div className="demo-credentials">
            <span className="demo-label">Demo Credentials:</span>
            <code>admin / admin</code>
          </div>
          <div className="login-company">
            <span>Powered by</span>
            <strong>BAPCO</strong>
            <span>Bahrain Petroleum Company</span>
          </div>
        </div>
      </div>

      <div className="login-decoration">
        <div className="decoration-ring ring-1"></div>
        <div className="decoration-ring ring-2"></div>
        <div className="decoration-ring ring-3"></div>
      </div>
    </div>
  );
}

export default Login;
