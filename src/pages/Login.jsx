import { useState } from "react";
import { login as apiLogin } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiLogin(form);
      if (data?.access) {
        login(data.access);
        navigate("/");
      } else {
        alert("Credenciales inválidas");
      }
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ padding: 16, display: "grid", gap: 8, maxWidth: 360 }}>
      <h2>Iniciar sesión</h2>
      <input
        placeholder="Usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit" disabled={loading}>{loading ? "Entrando..." : "Iniciar sesión"}</button>
    </form>
  );
}
