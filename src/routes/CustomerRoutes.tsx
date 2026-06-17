import { Route, Routes } from "react-router";
import { NotFound } from "../pages/NotFound";
import { NewTicket } from "../pages/CustomerPages/NewTicket";
import { AppLayout } from "../components/AppLayout";
import { ShowTicket } from "../components/ShowTicket";
import { CustomerTicketsDashboard } from "../pages/CustomerPages/CustomerTicketsDashboard";

export function CustomerRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route path="/" element={<CustomerTicketsDashboard />} />

        <Route path="/newTicket" element={<NewTicket />} />
        <Route path="/tickets/customer/:id" element={<ShowTicket />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
