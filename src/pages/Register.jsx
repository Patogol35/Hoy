import { useState } from "react";
import { register as registerApi } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ username: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await registerApi(form);
        if (res.id) {
            alert("Usuario registrado");
            navigate("/login");
        } else {
            alert("Error al registrar");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Usuario" onChange={e => setForm({...form, username: e.target.value})} />
            <input type="password" placeholder="Contraseña" onChange={e => setForm({...form, password: e.target.value})} />
            <button type="submit">Registrarse</button>
        </form>
    );
}