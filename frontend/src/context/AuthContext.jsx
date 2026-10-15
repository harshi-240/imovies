import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session from stored JWT on first load
  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        try {
          setUser(await api('/auth/me'));
        } catch {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    })();
  }, []);

  const authenticate = async (path, payload) => {
    const data = await api(path, { method: 'POST', body: payload });
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const login = (email, password) => authenticate('/auth/login', { email, password });
  const register = (name, email, password) => authenticate('/auth/register', { name, email, password });
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
  );
}
