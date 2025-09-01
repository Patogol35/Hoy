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
} from "@mui/material";

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
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          boxShadow: "0 8px 30px rgba(0,0,0,0.1)",
        }}
      >
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          Iniciar sesión
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
            label="Contraseña"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                    variant="text"
                  >
                    {showPassword ? "Ocultar" : "Mostrar"}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <Box mt={2} display="flex" flexDirection="column" gap={2}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
            >
              {loading ? "Entrando..." : "Iniciar sesión"}
            </Button>

            {/* Botón de registro */}
            <Button
              variant="outlined"
              color="secondary"
              fullWidth
              onClick={() => navigate("/register")}
            >
              Registrarse
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
}
