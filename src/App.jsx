import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Carrito from "./pages/Carrito";
import Pedidos from "./pages/Pedidos";
import ProductoDetalle from "./pages/ProductoDetalle";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// ✅ Sonner para notificaciones
import { Toaster } from "sonner";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CarritoProvider>
          {/* 🌟 Toaster elegante y moderno */}
          <Toaster
            position="top-center"
            richColors
            theme="dark"
            expand
            closeButton
            duration={4000}
            toastOptions={{
              style: {
                borderRadius: "16px",
                padding: "16px 20px",
                background:
                  "linear-gradient(135deg, #1e1e1e 0%, #2b2b2b 100%)",
                color: "#ffffff",
                boxShadow: "0 8px 20px rgba(0,0,0,0.35)",
                fontSize: "16px",
                fontWeight: 500,
              },
            }}
          />

          <Routes>
            {/* Rutas con Navbar */}
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route
                path="/carrito"
                element={
                  <ProtectedRoute>
                    <Carrito />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pedidos"
                element={
                  <ProtectedRoute>
                    <Pedidos />
                  </ProtectedRoute>
                }
              />
              <Route path="/producto/:id" element={<ProductoDetalle />} />
            </Route>

            {/* Rutas sin Navbar */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </CarritoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
