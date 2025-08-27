import { useState } from "react";
import { register as apiRegister } from "../api/api";
import { useNavigate, Link } from "react-router-dom";
import "../App.css";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [showPwd2, setShowPwd2] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = "El usuario es obligatorio.";
    if (form.password.length < 6) e.password = "Mínimo 6 caracteres.";
    if (form.password !== form.confirm) e.confirm = "Las contraseñas no coinciden.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await apiRegister({
        username: form.username,
        email: form.email || undefined, // opcional
        password: form.password,
      });
      if (res?.id) {
        alert("Usuario registrado ✅");
        navigate("/login");
      } else {
        alert(res?.detail || "No se pudo registrar.");
      }
    } catch (err) {
      alert(err.message || "Error del servidor.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <form className="form-container" onSubmit={handleSubmit} noValidate>
      <h2>Crear cuenta</h2>

      <div className="input-group">
        <input
          name="username"
          placeholder="Usuario"
          value={form.username}
          onChange={onChange}
          aria-invalid={!!errors.username}
        />
        {errors.username && <div className="error-text">{errors.username}</div>}
      </div>

      <div className="input-group">
        <input
          name="email"
          type="email"
          placeholder="Correo (opcional)"
          value={form.email}
          onChange={onChange}
        />
        <div className="helper">Puedes dejarlo vacío.</div>
      </div>

      <div className="input-group">
        <input
          name="password"
          type={showPwd ? "text" : "password"}
          placeholder="Contraseña"
          value={form.password}
          onChange={onChange}
          aria-invalid={!!errors.password}
        />
        <button
          type="button"
          className="toggle"
          onClick={() => setShowPwd((s) => !s)}
          aria-label={showPwd ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPwd ? "🙈" : "👁️"}
        </button>
        <div className="helper">Mínimo 6 caracteres.</div>
        {errors.password && <div className="error-text">{errors.password}</div>}
      </div>

      <div className="input-group">
        <input
          name="confirm"
          type={showPwd2 ? "text" : "password"}
          placeholder="Confirmar contraseña"
          value={form.confirm}
          onChange={onChange}
          aria-invalid={!!errors.confirm}
        />
        <button
          type="button"
          className="toggle"
          onClick={() => setShowPwd2((s) => !s)}
          aria-label={showPwd2 ? "Ocultar confirmación" : "Mostrar confirmación"}
        >
          {showPwd2 ? "🙈" : "👁️"}
        </button>
        {errors.confirm && <div className="error-text">{errors.confirm}</div>}
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Creando..." : "Registrarse"}
      </button>

      <p className="auth-switch">
        ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
      </p>
    </form>
  );
}
