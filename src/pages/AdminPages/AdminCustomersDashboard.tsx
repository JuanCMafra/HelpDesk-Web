import { useActionState, useEffect, useState } from "react";
import { CustomerRows } from "../../components/tables/CustomerRows";
import { Table } from "../../components/tables/Table";
import clsx from "clsx";
import CloseIcon from "../assets/icons/x.svg?react";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { Profile } from "../../components/Profile";
import { PopUp } from "../../components/PopUp";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/Loading";
import type { FormState } from "../../utils/formState";
import { handleFormError } from "../../utils/handleFormError";
import { api } from "../../services/api";
import { AlertMessage } from "../../components/AlertMessage";
import z from "zod";

const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Nome e sobrenome devem ter mais de 5 letras!" }),
  email: z.email({ message: "E-mail inválido!" }),
});

export function AdminCustomersDashboard() {
  const [deleteCustomer, setDeleteCustomer] = useState(false);
  const [editCustomer, setEditCustomer] = useState(false);

  const [state, formAction, pending] = useActionState(onAction, null);

  const [userId, setUserId] = useState("");
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [message, setMessage] = useState<FormState | null>(null);
  const [customers, setCustomers] = useState<UserAPIResponse[] | undefined>([]);

  const auth = useAuth();

  if (!auth.session?.user.role) {
    return <Loading />;
  }

  async function loadCustomers() {
    try {
      const response = await api.get("/admin/customer");

      setCustomers(response.data);
    } catch (error) {
      setMessage(handleFormError(error));
    }
  }

  async function fetchCustomer(id: string) {
    try {
      setIsLoading(true);

      const response = await api.get<UserAPIResponse>(`/admin/customer/${id}`);

      setUserId(response.data.user.id);
      setAvatar(response.data.user.avatar);
      setName(response.data.user.name);
      setEmail(response.data.user.email);

      setEditCustomer(true);
    } catch (error) {
      setMessage(handleFormError(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function onAction(
    prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      const data = customerSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
      });

      await api.patch(`/admin/customer/${userId}`, data);

      setEditCustomer(true);
      loadCustomers()
      return {
        message: "Usuário alterado com sucesso!",
        field: "confirm",
      };
    } catch (error) {
      return handleFormError(error);
    }
  }

  async function getUserToDelete(id: string) {
    try {
      setIsLoading(true);

      const response = await api.get<UserAPIResponse>(`/admin/customer/${id}`);

      setUserId(response.data.user.id);
      setName(response.data.user.name);
    } catch (error) {
      setMessage(handleFormError(error));
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCustomerConfirm(id: string | null | undefined) {
    try {
      if (!id) return;
      setIsLoading(true);
      await api.delete(`/admin/customer/${id}`);
      setDeleteCustomer(false);
      loadCustomers();
    } catch (error) {
      setMessage(handleFormError(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  if (!customers) {
    return <Loading />;
  }

  return (
    <div className="text-gray-200 flex flex-col gap-4 w-full md:min-w-236 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-blue-dark text-xl">Clientes</h1>
      </div>
      <Table role={auth.session?.user.role} type="customers">
        <CustomerRows
          role={auth.session?.user.role}
          customers={customers}
          setDelete={setDeleteCustomer}
          deleteUser={getUserToDelete}
          onEdit={fetchCustomer}
        />
      </Table>
      <AlertMessage message={message} />

      <PopUp
        title="Cliente"
        backIcon={false}
        setState={setEditCustomer}
        state={editCustomer}
        onAction={formAction}
        isLoading={pending}
      >
        <Profile name={name} avatar={avatar} variants="xlg2" />
        <div className="flex justify-baseline relative flex-col gap-4">
          <Input
            required
            legend="nome"
            type="text"
            placeholder="Digite um nome"
            onChange={(e) => setName(e.target.value)}
            value={name}
            name="name"
            formState={state}
          />
          <Input
            required
            legend="e-mail"
            type="email"
            name="email"
            placeholder="Digite um e-mail"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            formState={state}
          />
        </div>
        <AlertMessage message={state} />
      </PopUp>
      {
        <div
          className={clsx(
            "fixed inset-0 z-60 w-screen h-screen flex items-center justify-center px-4 bg-black/40 transition-opacity duration-450",
            deleteCustomer
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
          )}
          onClick={() => {
            setDeleteCustomer(false);
            setEditCustomer(false);
          }}
        >
          <div
            className={clsx(
              "bg-gray-600 w-full md:max-w-110 h-auto rounded-xl transition-all duration-400 text-gray-200",
              deleteCustomer ? "scale-100 opacity-100" : "scale-80 opacity-0",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="px-7 py-5 flex items-center justify-between font-bold">
              <div className="text-gray-200 flex items-center justify-center gap-3">
                Excluir cliente
              </div>
              <CloseIcon
                className="w-7 text-gray-300 h-7 p-1 cursor-pointer transition duration-500 ease-in-out hover:bg-gray-500 rounded-full"
                onClick={() => {
                  setDeleteCustomer(false);
                  setEditCustomer(false);
                }}
              />
            </header>

            <form>
              <div className="flex flex-col justify-baseline border border-gray-500 px-7 pt-7 pb-8 gap-5">
                <div>
                  Deseja realmente excluir{" "}
                  <span className="font-bold">{name}</span> ?
                </div>
                <p>
                  Ao excluir, todos os chamados deste cliente serão removidos e
                  esta ação não poderá ser desfeita.
                </p>
              </div>
              <div className="px-7 py-6 flex gap-2">
                <Button
                  className="flex-1"
                  variant="light"
                  onClick={() => setDeleteCustomer(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="dark"
                  className="flex-1"
                  onClick={() => deleteCustomerConfirm(userId)}
                  isLoading={isLoading}
                >
                  Sim, excluir
                </Button>
              </div>
              <AlertMessage message={message} />
            </form>
          </div>
        </div>
      }
    </div>
  );
}
