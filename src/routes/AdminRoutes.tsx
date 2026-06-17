import { Route, Routes } from "react-router";
import { NotFound } from "../pages/NotFound";
import { AppLayout } from "../components/AppLayout";
import { ShowTicket } from "../components/ShowTicket";
import { AdminTechnician } from "../pages/AdminPages/AdminTechnicians";
import { AdminTicketsDashboard } from "../pages/AdminPages/AdminTicketsDashboard";
import { TechnicianProfile } from "../components/TechnicianProfile";
import { AdminCustomersDashboard } from "../pages/AdminPages/AdminCustomersDashboard";
import { AdminServicesDashboard } from "../pages/AdminPages/AdminServicesDashboard";

export function AdminRoutes(){
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<AdminTicketsDashboard />} />
        <Route path="/tickets/admin/:id" element={<ShowTicket />} />
        <Route path="/technician" element={<AdminTechnician />} />
        <Route path="/technician/add" element={<TechnicianProfile />} />
        <Route path="/technician/:id" element={<TechnicianProfile />} />
        <Route path="/customers" element={<AdminCustomersDashboard />} />
        <Route path="/services" element={<AdminServicesDashboard />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}