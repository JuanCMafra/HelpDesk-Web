import { Table } from "../../components/tables/Table";
import { TechnicianRows } from "../../components/tables/TechnicianRows";
import { Button } from "../../components/UI/Button";
import AddIcon from "../assets/icons/add.svg?react";
import { useEffect, useState } from "react";
import type { FormState } from "../../utils/formState";
import { useAuth } from "../../hooks/useAuth";
import { handleFormError } from "../../utils/handleFormError";
import { api } from "../../services/api";
import { AlertMessage } from "../../components/AlertMessage";

export function AdminTechnician() {
  const [technician, setTechnician] = useState<TechnicianProfile[]>([]);
  const [message, setMessage] = useState<FormState | null>(null);

  const auth = useAuth();

  if (!auth.session?.user.role) return;

  async function showTechnicians() {
    try {
      const response = await api.get("/admin/technician");

      setTechnician(response.data);
    } catch (error) {
      setMessage(handleFormError(error));
    }
  }

  useEffect(() => {
    showTechnicians();
  }, []);

  async function deleteTechnician(id: string) {
    try {
      await api.patch(`/admin/technician/delete/${id}`);
      showTechnicians();
    } catch (error) {
      setMessage(handleFormError(error));
    }
  }
  return (
    <div className="text-gray-200 flex flex-col gap-4 w-full md:min-w-236 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-blue-dark text-xl">Técnicos</h1>
        <a href="/technician/add">
          <Button variant="dark" className="p-2.75 md:px-4 md:gap-2">
            <AddIcon className="w-4.5 h-4.5" />
            <span className="hidden md:inline text-sm">Novo</span>
          </Button>
        </a>
      </div>
      <Table role={auth.session.user.role} type="technicians">
        <TechnicianRows
          role={auth.session.user.role}
          technicians={technician}
          deleteTechnician={deleteTechnician}
        />
      </Table>
      <AlertMessage message={message} />
    </div>
  );
}
