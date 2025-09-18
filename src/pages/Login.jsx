import { useState } from "react";
import { login as apiLogin } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonOutline from "@mui/icons-material/PersonOutline";
import LockOutlined from "@mui/icons-material/LockOutlined";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await apiLogin(form);
      if (data?.access && data?.refresh) {
        login(data.access, data.refresh);
        toast.success("Bienvenido 👋");
        navigate("/");
      } else {
        toast.error("Credenciales inválidas");
      }
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

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
          Bienvenido
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          sx={{ mb: 2 }}
        >
          Ingresa tus credenciales para continuar
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Usuario"
            fullWidth
            margin="normal"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutline color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box mt={3} display="flex" flexDirection="column" gap={2}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
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
              {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate("/register")}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                borderColor: "#1976d2",
                color: "#1976d2",
                "&:hover": {
                  backgroundColor: "rgba(25,118,210,0.08)",
                  transform: "scale(1.03)",
                  borderColor: "#1976d2",
                },
                transition: "all 0.3s",
              }}
            >
              Registrarse
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
