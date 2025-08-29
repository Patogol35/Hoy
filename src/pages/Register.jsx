import { useState } from "react";
import { register as apiRegister } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// MUI
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
} from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { label: "Débil", color: "red", value: 40 };
    if (score === 3) return { label: "Media", color: "orange", value: 60 };
    if (score === 4) return { label: "Fuerte", color: "green", value: 80 };
    if (score >= 5) return { label: "Muy fuerte", color: "darkgreen", value: 100 };
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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={3}
        sx={{ p: 4, borderRadius: 2, display: "flex", flexDirection: "column", gap: 2 }}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Registro
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <TextField
            label="Correo (opcional)"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <TextField
            label="Contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {form.password && (
            <Box sx={{ my: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strength.value}
                sx={{ height: 8, borderRadius: 4, mb: 0.5, backgroundColor: "#ddd",
                      "& .MuiLinearProgress-bar": { backgroundColor: strength.color } }}
              />
              <Typography variant="caption" sx={{ color: strength.color, fontWeight: "bold" }}>
                {strength.label}
              </Typography>
            </Box>
          )}

          <TextField
            label="Confirmar contraseña"
            type="password"
            fullWidth
            margin="normal"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}