import { useState } from "react";
import { register as apiRegister } from "../api/api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  LinearProgress,
  InputAdornment,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutline from "@mui/icons-material/PersonOutline";
import EmailOutlined from "@mui/icons-material/EmailOutlined";
import LockOutlined from "@mui/icons-material/LockOutlined";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
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
    return { label: "Muy fuerte", color: "darkgreen", value: 100 };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username.trim()) return toast.error("El usuario es obligatorio");
    if (form.email && !/\S+@\S+\.\S+/.test(form.email))
      return toast.error("El correo no es válido");
    if (form.password.length < 6)
      return toast.error("La contraseña debe tener al menos 6 caracteres");
    if (form.password !== form.confirm)
      return toast.error("Las contraseñas no coinciden");

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
      } else toast.error("❌ No se pudo registrar");
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const strength = passwordStrength(form.password);

  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #42a5f5 0%, #1976d2 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: 3,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          backgroundColor: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#1976d2" }}
        >
          Crear cuenta
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Completa tus datos para registrarte
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Usuario */}
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Email */}
          <TextField
            label="Correo (opcional)"
            type="email"
            fullWidth
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Contraseña */}
          <TextField
            label="Contraseña"
            type={showPasswords ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Barra de fuerza */}
          {form.password && (
            <Box sx={{ my: 1 }}>
              <LinearProgress
                variant="determinate"
                value={strength.value}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  mb: 0.5,
                  backgroundColor: "#ddd",
                  "& .MuiLinearProgress-bar": { backgroundColor: strength.color },
                }}
              />
              <Typography
                variant="caption"
                sx={{ color: strength.color, fontWeight: "bold" }}
              >
                {strength.label}
              </Typography>
            </Box>
          )}

          {/* Confirmar contraseña */}
          <TextField
            label="Confirmar contraseña"
            type={showPasswords ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
            }}
          />

          {/* Opción única para mostrar/ocultar */}
          <FormControlLabel
            control={
              <Checkbox
                checked={showPasswords}
                onChange={() => setShowPasswords(!showPasswords)}
                icon={<VisibilityOff />}
                checkedIcon={<Visibility />}
              />
            }
            label="Mostrar contraseñas"
            sx={{ mt: 1 }}
          />

          <Box mt={3}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #1976d2, #42a5f5)",
                "&:hover": {
                  transform: "scale(1.03)",
                  boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
                },
                transition: "all 0.3s",
              }}
            >
              {loading ? "Creando cuenta..." : "Registrarse"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
        }
