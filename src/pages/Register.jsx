import { useState } from "react";
import { register as apiRegister } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../App.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calcula la fuerza de la contraseña
  const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: "Débil", color: "red", width: "40%" };
    if (score === 3) return { label: "Media", color: "orange", width: "60%" };
    if (score === 4) return { label: "Fuerte", color: "green", width: "80%" };
    if (score >= 5) return { label: "Muy fuerte", color: "darkgreen", width: "100%" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username.trim()) {
      toast.error("El usuario es obligatorio");
      return;
    }

    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("El correo no es válido");
      return;
    }

    if (form.password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (form.password !== form.confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRegister({
        username: form.username,
        email: form.email,
        password: form.password,
      });

      if (data?.id) {
        toast.success("✅ Usuario registrado correctamente");
        navigate("/login");
      } else {
        toast.error("❌ No se pudo registrar");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Registro</h2>

      <input
        placeholder="Usuario"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        required
      />

      <input
        type="email"
        placeholder="Correo (opcional)"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
      />

      {form.password && (
        <div className="strength-bar-container" style={{ marginBottom: "8px" }}>
          <div
            className="strength-bar"
            style={{
              width: strength.width,
              backgroundColor: strength.color,
              transition: "width 0.3s ease",
              height: "8px",
              borderRadius: "4px",
            }}
          ></div>
          <small style={{ color: strength.color, fontWeight: "bold" }}>
            {strength.label}
          </small>
        </div>
      )}

      <input
        type="password"
        placeholder="Confirmar contraseña"
        value={form.confirm}
        onChange={(e) => setForm({ ...form, confirm: e.target.value })}
        required
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creando cuenta..." : "Registrarse"}
      </button>
    </form>
  );
}