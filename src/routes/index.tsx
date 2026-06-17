import { BrowserRouter } from "react-router";
import { AuthRoutes } from "./AuthRoutes";
import { Loading } from "../components/Loading";
import { CustomerRoutes } from "./CustomerRoutes";
import { TechnicianRoutes } from "./TechnicianRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { useAuth } from "../hooks/useAuth";


export function Routes() {
  const { session, isLoading } = useAuth();

  function Route() {
    switch (session?.user.role) {
      case "customer":
        return <CustomerRoutes />;
      case "technician":
        return <TechnicianRoutes />;
      case "admin":
        return <AdminRoutes />;
      default:
        return <AuthRoutes />;
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Route />
    </BrowserRouter>
  );
}
