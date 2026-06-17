import { useActionState, useEffect, useState } from "react";
import { Table } from "../../components/tables/Table";
import AddIcon from "../../assets/icons/add.svg?react";
import { Button } from "../../components/UI/Button";
import { Input } from "../../components/UI/Input";
import { ServicesRows } from "../../components/tables/ServicesRows";
import { formatCurrency } from "../../utils/formatCurrency";
import { handlePriceChange } from "../../utils/handlePriceChange";
import { PopUp } from "../../components/PopUp";
import { useAuth } from "../../hooks/useAuth";
import { Loading } from "../../components/Loading";
import { handleFormError } from "../../utils/handleFormError";
import type { FormState } from "../../utils/formState";
import { api } from "../../services/api";
import { AlertMessage } from "../../components/AlertMessage";
import z from "zod";

const serviceSchema = z.object({
  title: z
    .string()
    .min(6, { message: "O título deve possuir no mínimo 6 letras!" }),
  price: z.coerce
    .number()
    .min(1, { message: "Valor inválido!" })
    .positive({ message: "Valor inválido!" }),
});

export function AdminServicesDashboard() {
  const [isModalServiceOpen, setIsModalServiceOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [price, setPrice] = useState(0);
  const [title, setTitle] = useState("");
  const [serviceId, setServiceId] = useState("");

  const [message, setMessage] = useState<FormState | null>(null);
  const [services, setServices] = useState<ServicesProps[] | []>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction, pending] = useActionState(onAction, null);

  const auth = useAuth();
  const userRole = auth.session?.user.role;

  if (!userRole) {
    return <Loading />;
  }

  const closeModal = () => {
    setIsModalServiceOpen(false);
    setTitle("");
    setPrice(0);
  };

  async function loadServices() {
    try {
      const response = await api.get("/services/admin");

      setServices(response.data);
    } catch (error) {
      setMessage(handleFormError(error));
    }
  }

  async function deleteService(id: string) {
    try {
      await api.patch(`/services/status/${id}`);
      loadServices();
    } catch (error) {
      setMessage(handleFormError(error));
    }
  }

  async function fetchService(id: string) {
    try {
      setIsLoading(true);

      const response = await api.get<ServicesProps>(`/services/${id}`);

      setServiceId(response.data.id);
      setTitle(response.data.title);
      setPrice(response.data.price);

      setIsModalServiceOpen(true);
      setIsEditOpen(true);
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
      if (isEditOpen) {
        const data = serviceSchema.parse({
          title: formData.get("title"),
          price: formData.get("price"),
        });

        await api.patch(`/services/update/${serviceId}`, data);

        setIsModalServiceOpen(true);
        loadServices();

        return { message: "Serviço alterado com sucesso!", field: "confirm" };
      } else {
        const data = serviceSchema.parse({
          title: formData.get("title"),
          price: formData.get("price"),
        });

        await api.post(`/services`, data);

        setIsModalServiceOpen(true);
        loadServices();
        return { message: "Serviço cadastrado com sucesso!", field: "confirm" };
      }
    } catch (error) {
      return handleFormError(error);
    }
  }

  useEffect(() => {
    if (state?.field === "confirm" && !isEditOpen) {
      setTitle("");
      setPrice(0);
    }
  }, [state]);

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <div className="text-gray-200 flex flex-col gap-4 w-full md:min-w-236 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-blue-dark text-xl">Serviços</h1>
        <Button
          variant="dark"
          className="p-2.75 md:px-4 md:gap-2 w-auto max-w-23"
          onClick={() => {
            setIsModalServiceOpen(true);
            setIsEditOpen(false);
          }}
        >
          <AddIcon className="w-4.5 h-4.5" />
          <span className="hidden md:inline text-sm ">Novo</span>
        </Button>
      </div>
      <Table role={userRole} type="services">
        <ServicesRows
          role={userRole}
          services={services}
          onDelete={deleteService}
          onEdit={fetchService}
          setModalEdit={setIsModalServiceOpen}
          isEditOpen={setIsEditOpen}
        />
      </Table>
      <AlertMessage message={message} />

      <PopUp
        state={isModalServiceOpen}
        setState={closeModal}
        title={isEditOpen ? "Serviço" : "Cadastro de serviço"}
        backIcon={false}
        onAction={formAction}
        isLoading={pending}
      >
        <Input
          legend="título"
          required
          type="text"
          placeholder="Nome do serviço"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name="title"
          formState={state}
        />
        <Input
          required
          legend="valor"
          placeholder="R$ 0,00"
          value={price > 0 ? `R$ ${formatCurrency(price)}` : ""}
          onChange={(e) =>
            handlePriceChange({ value: e.target.value, setPrice })
          }
        />
        <Input type="hidden" name="price" value={price} formState={state} />

        <AlertMessage message={state} />
      </PopUp>
    </div>
  );
}
