import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true); // nuevo: estado de carga

  // Recuperar token de localStorage al cargar
  useEffect(() => {
    const saved = localStorage.getItem("access");
    if (saved) setAccess(saved);
    setLoading(false); // ya cargó
  }, []);

  const isAuthenticated = !!access;

  const login = (accessToken) => {
    localStorage.setItem("access", accessToken);
    setAccess(accessToken);
  };

  const logout = () => {
    localStorage.removeItem("access");
    setAccess(null);
  };

  const value = useMemo(
    () => ({ access, isAuthenticated, login, logout, loading }),
    [access, isAuthenticated, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
