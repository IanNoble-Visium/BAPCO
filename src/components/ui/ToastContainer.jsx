import { useAppState } from '../../context/AppStateContext';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

function ToastContainer() {
  const { notifications, removeNotification } = useAppState();

  return (
    <div id="toastContainer" className="toast-container">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
}

function Toast({ notification, onClose }) {
  const toastRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      toastRef.current,
      { opacity: 0, x: 50, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: 'back.out(1.5)' }
    );
  }, []);

  const handleClose = () => {
    gsap.to(toastRef.current, {
      opacity: 0,
      x: 50,
      duration: 0.2,
      onComplete: onClose
    });
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      default: return 'ℹ';
    }
  };

  return (
    <div ref={toastRef} className={`toast toast-${notification.type || 'info'}`}>
      <span className="toast-icon">{getIcon()}</span>
      <div className="toast-content">
        {notification.title && <div className="toast-title">{notification.title}</div>}
        <div className="toast-message">{notification.message}</div>
      </div>
      <button className="toast-close" onClick={handleClose}>×</button>
    </div>
  );
}

export default ToastContainer;
