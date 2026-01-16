import { createContext, useContext, useState, useCallback } from 'react';

const AppStateContext = createContext(null);

export function AppStateProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('landing');
  const [theme, setTheme] = useState('dark');
  const [realTimeEnabled, setRealTimeEnabled] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = { id, ...notification };
    setNotifications(prev => [...prev, newNotification]);
    
    if (notification.autoClose !== false) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
    
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const toggleRealTime = useCallback(() => {
    setRealTimeEnabled(prev => !prev);
  }, []);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  const value = {
    currentPage,
    setCurrentPage,
    theme,
    setTheme,
    realTimeEnabled,
    toggleRealTime,
    sidebarOpen,
    toggleSidebar,
    notifications,
    addNotification,
    removeNotification
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}

export default AppStateContext;
