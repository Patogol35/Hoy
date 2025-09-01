import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

// Función segura para decodificar JWT
function decodeJWT(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
}

export function AuthProvider({ children }) {
  const [access, setAccess] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedAccess = localStorage.getItem("access");
      const savedRefresh = localStorage.getItem("refresh");

      if (savedAccess) {
        setAccess(savedAccess);
        const decoded = decodeJWT(savedAccess);
        if (decoded) setUser(decoded);
      }

      if (savedRefresh) setRefresh(savedRefresh);
    } catch (error) {
      console.error("Error cargando sesión:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!access;

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    setAccess(accessToken);
    setRefresh(refreshToken);

    const decoded = decodeJWT(accessToken);
    if (decoded) setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
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
