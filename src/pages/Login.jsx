import { useState } from "react";
import { login as loginApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ username: "", password: "" });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = await loginApi(form);
        if (data.access) {
            login(data.access);
            navigate("/");
        } else {
            alert("Credenciales inválidas");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Usuario" onChange={e => setForm({...form, username: e.target.value})} />
            <input type="password" placeholder="Contraseña" onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit">Iniciar sesión</button>
        </form>
    );
}