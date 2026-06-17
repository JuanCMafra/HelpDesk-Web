import { useEffect, useState } from "react";
import { Table } from "../../components/tables/Table";
import { TicketRows } from "../../components/tables/TicketRows";
import { useAuth } from "../../hooks/useAuth";
import type { FormState } from "../../utils/formState";
import { handleFormError } from "../../utils/handleFormError";
import { api } from "../../services/api";
import { AlertMessage } from "../../components/AlertMessage";

export function AdminTicketsDashboard() {
  const [tickets, setTickets] = useState<TicketProps[]>([]);
  const [ticketMessage, setTicketMessage] = useState<FormState | null>(null);

  const auth = useAuth();

  if (!auth.session?.user.role) return;

  async function showTickets() {
    try {
      const response = await api.get("/tickets/admin");

      setTickets(response.data);
    } catch (error) {
      setTicketMessage(handleFormError(error));
    }
  }

  useEffect(() => {
    showTickets();
  }, []);
  return (
    <div className="text-gray-200 flex flex-col gap-4 w-full md:min-w-236 h-full">
      <h1 className="text-blue-dark text-xl">Chamados</h1>
      <Table role={auth.session?.user.role} type="tickets">
        <TicketRows role={auth.session?.user.role} tickets={tickets} />
      </Table>
      <AlertMessage message={ticketMessage} />
    </div>
  );
}
