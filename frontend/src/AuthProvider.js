// AuthContext.js
import React, { createContext, useContext, useState } from 'react';
import { useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      // If a token is found, set the state
        setUser(storedUser);
        setToken(storedToken);
    }
  }, []);

  const login = (userData, authToken) => {
    setUser(userData.username);
    setToken(authToken);
    localStorage.setItem('user', userData.username);
    localStorage.setItem('token', authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
