import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext();

// 🔥 Función para decodificar JWT sin librerías
function decodeJWT(token) {
  try {
    const base64Url = token.split(".")[1];
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
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    if (savedAccess) {
      setAccess(savedAccess);
      const decoded = decodeJWT(savedAccess); // 👈 Usamos la función
      setUser(decoded);
    }
    if (savedRefresh) setRefresh(savedRefresh);
    setLoading(false);
  }, []);

  const isAuthenticated = !!access;

  const login = (accessToken, refreshToken) => {
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);
    setAccess(accessToken);
    setRefresh(refreshToken);

    const decoded = decodeJWT(accessToken);
    setUser(decoded);
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
