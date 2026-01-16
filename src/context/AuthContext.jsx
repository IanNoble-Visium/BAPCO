import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

/**
 * DEMO-ONLY AUTHENTICATION
 * This is a static authentication implementation for demonstration purposes.
 * NOT suitable for production use - credentials are hardcoded.
 * In production, implement proper authentication with secure backend.
 */
const DEMO_CREDENTIALS = {
  username: 'admin',
  password: 'admin'
};

const AUTH_STORAGE_KEY = 'trucontext_auth';
const REMEMBER_KEY = 'trucontext_remember';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY) || sessionStorage.getItem(AUTH_STORAGE_KEY);
    
    if (storedAuth) {
      try {
        const authData = JSON.parse(storedAuth);
        if (authData.isAuthenticated) {
          setUser(authData.user);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Error parsing auth data:', e);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (username, password, rememberMe = false) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
          const userData = {
            username,
            role: 'Administrator',
            displayName: 'BAPCO Admin',
            loginTime: new Date().toISOString()
          };

          const authData = {
            isAuthenticated: true,
            user: userData
          };

          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
          
          if (rememberMe) {
            localStorage.setItem(REMEMBER_KEY, username);
          } else {
            localStorage.removeItem(REMEMBER_KEY);
          }

          setUser(userData);
          setIsAuthenticated(true);
          resolve(userData);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 800);
    });
  };

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const getRememberedUsername = () => {
    return localStorage.getItem(REMEMBER_KEY) || '';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    getRememberedUsername
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
