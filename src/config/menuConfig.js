import {
  Home as HomeIcon,
  ShoppingCart as ShoppingCartIcon,
  ListAlt as ListAltIcon,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";

export const authMenu = [
  {
    label: "Inicio",
    path: "/",
    icon: HomeIcon,
    color: "linear-gradient(135deg, #0288d1, #26c6da)",
  },
  {
    label: "Carrito",
    path: "/carrito",
    icon: ShoppingCartIcon,
    color: "linear-gradient(135deg, #2e7d32, #66bb6a)",
  },
  {
    label: "Mis pedidos",
    path: "/pedidos",
    icon: ListAltIcon,
    color: "linear-gradient(135deg, #f57c00, #ffb74d)",
  },
];

export const guestMenu = [
  {
    label: "Iniciar sesión",
    path: "/login",
    icon: LoginIcon,
    color: "linear-gradient(135deg, #0288d1, #26c6da)",
  },
  {
    label: "Registrarse",
    path: "/register",
    icon: PersonAddIcon,
    color: "linear-gradient(135deg, #6a1b9a, #ab47bc)",
  },
];
