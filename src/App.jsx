import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Productos from "./pages/Productos";
import Carrito from "./pages/Carrito";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Pedidos from "./pages/Pedidos";

export default function App() {
  const [user, setUser] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const productos = [
    { id: 1, nombre: "Camisa", descripcion: "Camisa de algodón", precio: 20 },
    { id: 2, nombre: "Pantalón", descripcion: "Jeans azul", precio: 35 },
    { id: 3, nombre: "Zapatos", descripcion: "Deportivos cómodos", precio: 50 },
  ];

  const agregarCarrito = (prod) => {
    setCarrito([...carrito, prod]);
  };

  const logout = () => setUser(null);

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Productos productos={productos} onAdd={agregarCarrito} />} />
        <Route path="/carrito" element={<Carrito carrito={carrito} />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/register" element={<Register onRegister={setUser} />} />
        <Route path="/pedidos" element={<Pedidos user={user} />} />
      </Routes>
    </BrowserRouter>
  );
}
