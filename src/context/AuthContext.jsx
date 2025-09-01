import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Recuperar sesión desde localStorage
  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    const savedUser = localStorage.getItem("user");

    if (savedAccess) setAccess(savedAccess);
    if (savedRefresh) setRefresh(savedRefresh);
    if (savedUser) setUser(JSON.parse(savedUser));

    setLoading(false);
  }, []);

  const isAuthenticated = !!access;

  const login = (accessToken, refreshToken, userData) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setAccess(accessToken);
    setRefresh(refreshToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    setAccess(null);
    setRefresh(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ access, refresh, user, isAuthenticated, login, logout, loading }),
    [access, refresh, user, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
