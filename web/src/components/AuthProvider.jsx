import { useState, useEffect } from 'react';
import AuthContext from './AuthContext';

export function AuthProvider({ children }) {
  // Initialize token from localStorage on first render
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data && data._id) setUser(data);
          else setUser(null);
        })
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }
  }, [token]);

  const login = async (jwt) => {
    setToken(jwt);
    localStorage.setItem('token', jwt);
    try {
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (data && data._id) setUser(data);
      else setUser(null);
    } catch {
      setUser(null);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
