import { Route, Routes } from "react-router";
import { NotFound } from "../pages/NotFound";
import { AppLayout } from "../components/AppLayout";
import { TechnicianDashboard } from "../pages/TechnicianPages/TechnicianDashboard";
import { ShowTicket } from "../components/ShowTicket";

export function TechnicianRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<TechnicianDashboard />} />
        <Route path="/tickets/technician/:id" element={<ShowTicket />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
