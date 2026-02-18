import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('keneshab_token');
    if (token) {
      try {
        const res = await fetch('http://localhost:3001/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          localStorage.removeItem('keneshab_token');
        }
      } catch (err) {
        console.error('Auth check failed', err);
      }
    }
    setIsLoading(false);
  };

  const login = (userData, token) => {
    localStorage.setItem('keneshab_token', token);
    setUser(userData);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    localStorage.removeItem('keneshab_token');
    setUser(null);
  };

  const [isAppModalOpen, setIsAppModalOpen] = useState(false);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openAppModal = () => setIsAppModalOpen(true);
  const closeAppModal = () => setIsAppModalOpen(false);

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      isAuthModalOpen,
      isAppModalOpen,
      openAuthModal,
      closeAuthModal,
      openAppModal,
      closeAppModal,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
