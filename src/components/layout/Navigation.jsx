import { useEffect, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import anime from 'animejs';

const navItems = [
  { path: '/', label: 'Overview', icon: '◉', page: 'landing' },
  { path: '/facility', label: '3D Facility', icon: '⬡', page: 'facility' },
  { path: '/process', label: 'Process', icon: '◈', page: 'process' },
  { path: '/equipment', label: 'Equipment', icon: '⚙', page: 'equipment' },
  { path: '/safety', label: 'Safety', icon: '⚠', page: 'safety' },
  { path: '/cyber', label: 'Cyber', icon: '🛡', page: 'cyber' }
];

function Navigation() {
  const [dateTime, setDateTime] = useState('');
  const { user, logout } = useAuth();
  const { realTimeEnabled, toggleRealTime } = useAppState();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      };
      setDateTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavHover = (e, isEnter) => {
    anime({
      targets: e.currentTarget,
      scale: isEnter ? 1.05 : 1,
      duration: 200,
      easing: 'easeOutQuad'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav id="mainNav" className="main-nav" ref={navRef}>
      <div className="nav-brand">
        <div className="brand-logo">
          <span className="logo-v">V</span>isium
        </div>
        <div className="brand-product">TruContext™</div>
      </div>

      <div className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onMouseEnter={(e) => handleNavHover(e, true)}
            onMouseLeave={(e) => handleNavHover(e, false)}
            end={item.path === '/'}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="nav-status">
        <button 
          className={`realtime-toggle ${realTimeEnabled ? 'active' : ''}`}
          onClick={toggleRealTime}
          title={realTimeEnabled ? 'Pause real-time updates' : 'Resume real-time updates'}
        >
          <span className="toggle-icon">{realTimeEnabled ? '▶' : '⏸'}</span>
        </button>
        <div className={`status-indicator ${realTimeEnabled ? 'online' : 'paused'}`}>
          <span className="status-dot"></span>
          <span className="status-text">{realTimeEnabled ? 'LIVE' : 'PAUSED'}</span>
        </div>
        <div className="datetime">{dateTime}</div>
        <div className="user-menu">
          <button className="user-button" onClick={handleLogout} title="Logout">
            <span className="user-name">{user?.displayName || 'Admin'}</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="logout-icon">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
