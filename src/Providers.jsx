
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";
import { ThemeModeProvider } from "./context/ThemeContext";

export default function Providers({ children }) {
  return (
    <ThemeModeProvider>
      <AuthProvider>
        <CarritoProvider>{children}</CarritoProvider>
      </AuthProvider>
    </ThemeModeProvider>
  );
}
