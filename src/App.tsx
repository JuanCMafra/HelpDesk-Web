import { AuthProvider } from "./context/AuthContext";
import { Routes } from "./routes/index";

export function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}
