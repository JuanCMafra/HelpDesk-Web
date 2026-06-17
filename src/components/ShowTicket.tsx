import { Button } from "./UI/Button";
import { formatCurrency } from "../utils/formatCurrency";
import { useNavigate, useParams } from "react-router";
import BackIcon from "../assets/icons/arrow-left.svg?react";
import { Status } from "./UI/Status";
import { Profile } from "./Profile";
import { ChangeStatusButton } from "./UI/ChangeStatusButton";
import AddIcon from "../assets/icons/add.svg?react";
import TrashIcon from "../assets/icons/trash.svg?react";
import { useActionState, useEffect, useState } from "react";
import { Input } from "./UI/Input";
import { handlePriceChange } from "../utils/handlePriceChange";
import { PopUp } from "./PopUp";
import { useAuth } from "../hooks/useAuth";
import z from "zod";
import { handleFormError } from "../utils/handleFormError";
import { api } from "../services/api";
import { Loading } from "./Loading";
import type { FormState } from "../utils/formState";
import { AlertMessage } from "./AlertMessage";

const paramsSchema = z.object({
  id: z.uuid(),
});

const additionalServiceSchema = z.object({
  title: z.string().min(4, {
    message: "Adicione um título válido ao serviço!",
  }),
  price: z
    .number()
    .min(1, { message: "Valor inválido!" })
    .positive({ message: "Valor inválido!" }),
});

export function ShowTicket() {
  const [addAdditional, setAddAdditional] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState(0);
  const [ticket, setTicket] = useState<TicketProps | null>(null);
  const [message, setMessage] = useState<FormState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [state, formAction, pending] = useActionState(onAction, null);

  const auth = useAuth();

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!auth.session?.user.role) {
    return <Loading />;
  }

  function getUserRole(role: UserAPIRole) {
    return auth.session?.user.role === role ? true : false;
  }

  async function loadTicket() {
    try {
      const { id } = paramsSchema.parse({
        id: params.id,
      });

      const response = await api.get(
        `/tickets/${auth.session?.user.role}/${id}`,
      );

      setTicket(response.data);
    } catch (error) {
      handleFormError(error);
    }
  }

  useEffect(() => {
    loadTicket();
  }, [params.id, auth.session?.user.role]);

  if (!ticket) {
    return <Loading />;
  }

  async function onAction(
    prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      if (!ticket) {
        return {
          message: "Ticket não encontrado!",
          field: "server",
        };
      }

      const data = additionalServiceSchema.parse({
        title: formData.get("title"),
        price: Number(formData.get("price")),
      });

      await api.post(`/tickets/${ticket.id}`, data);

      await loadTicket();

      setTitle("");
      setPrice(0);
      setAddAdditional(true);

      return {
        message: "Serviço adicional criado com sucesso!",
        field: "confirm",
      };
    } catch (error) {
      return handleFormError(error);
    }
  }

  async function deleteService(serviceId: string) {
    try {
      setIsLoading(true);

      await api.delete(`/tickets/${serviceId}`);

      loadTicket();
    } catch (error) {
      setMessage(handleFormError(error));
    } finally {
      setIsLoading(false);
    }
  }

  const additionalServices =
    ticket.service?.filter((service) => service.type === "additional") ?? [];

  return (
    <div className="flex flex-col w-full gap-4 md:max-w-200 md:mx-auto h-full">
      <header className="flex flex-col w-auto md:flex-row md:justify-between md:items-end items-start gap-3">
        <div className="flex flex-col md:flex-1 items-start w-full gap-1">
          <Button
            variant="link"
            className="flex gap-2 w-auto"
            onClick={() => navigate(-1)}
          >
            <BackIcon className="w-3.5 h-auto text-gray-300" />
            <span>Voltar</span>
          </Button>
          <h1 className="text-xl text-blue-dark text-nowrap">
            Chamado detalhado
          </h1>
        </div>

        <ChangeStatusButton
          status={ticket.status}
          role={auth.session?.user.role}
          apiTicket={loadTicket}
          ticketId={ticket.id}
          errorMessage={setMessage}
          isLoading={isLoading}
        />
      </header>

      <div className="text-gray-200 flex flex-col w-full h-auto gap-4 md:items-start md:justify-start md:gap-3">
        <div className="flex  flex-col md:flex-row gap-4 w-full md:items-start">
          <div className="border border-gray-500 md:flex-1 md:w-120 w-full rounded-[10px] p-5 md:p-6 flex flex-col gap-5 md:min-h-77.5">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-300">
                  {String(ticket.ticketNumber).padStart(5, "0")}
                </span>
                <Status variant="base" status={ticket.status} />
              </div>
              <h2 className="text-md font-bold">{ticket.title}</h2>
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-gray-400">Descrição</h4>
              <p className="text-sm">
                {ticket.description ? ticket.description : "Não há descrição"}
              </p>
            </div>
            <div className="flex flex-col gap-0.5">
              <h4 className="text-xs font-bold text-gray-400">Categoria</h4>
              <span className="text-sm">
                {ticket.service?.find((service) => service.type === "base")
                  ?.title ?? "Sem categoria"}
              </span>
            </div>
            <div className="flex w-full gap-8">
              <div className="flex flex-col md:w-50 gap-0.5">
                <h4 className="text-xs font-bold text-gray-400">Criado em</h4>
                <span className="text-sm">{ticket.created_at}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-gray-400">
                  Atualizado em
                </h4>
                <span className="text-sm">{ticket.updated_at}</span>
              </div>
            </div>
            {(getUserRole("admin") || getUserRole("technician")) && (
              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-gray-400">Cliente</h4>
                <div className="flex gap-2 items-center">
                  <Profile
                    name={ticket.client.name}
                    variants="sm"
                    avatar={ticket.client.avatar}
                  />
                  <span className="text-sm">{ticket.client.name}</span>
                </div>
              </div>
            )}
          </div>

          <div className="border w-full h-auto rounded-[10px] md:w-77.25 p-5 flex flex-col gap-8 border-gray-500 whitespace-nowrap">
            <div className="flex flex-col gap-2 w-full">
              <span className="text-gray-400 text-xs font-bold">
                Técnico responsável
              </span>
              <div className="flex gap-2">
                <Profile
                  avatar={ticket.technician.avatar}
                  name={ticket.technician.name}
                  variants="lg"
                />
                <div className="flex flex-col gap-0">
                  <h3 className="text-sm">{ticket.technician.name}</h3>
                  <span className="text-xs text-gray-300">
                    {ticket.technician.email}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2">
                <h4 className="text-xs text-gray-400 font-bold">Valores</h4>
                <div className="flex justify-between text-xs">
                  <span>Preço base</span>
                  <span className="pl-2">
                    R$
                    {formatCurrency(ticket.base_value)}
                  </span>
                </div>

                {auth.session?.user.role === "technician" && (
                  <div className="flex items-center justify-between text-xs ">
                    <span className="text-xs text-gray-200">Adicionais</span>
                    <span className="pl-3">
                      R$ {formatCurrency(ticket.additional_value)}
                    </span>
                  </div>
                )}
              </div>

              {additionalServices.length > 0 &&
                (getUserRole("customer") || getUserRole("admin")) && (
                  <div className="flex flex-col gap-2">
                    <h4 className="text-xs text-gray-400 font-bold">
                      Adicionais
                    </h4>
                    <ul className="flex flex-col gap-0.5 ">
                      {ticket.service
                        .filter((service) => service.type === "additional")
                        .map((additional) => (
                          <li
                            className="flex items-center justify-between text-xs "
                            key={additional.id}
                          >
                            <span>{additional.title}</span>
                            <span className="pl-3">
                              {" "}
                              R$
                              {formatCurrency(additional.price)}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

              <div className="flex h-auto justify-between pt-3 border-t border-gray-500 text-sm font-bold">
                <span>Total</span>
                <span>
                  {" "}
                  R$
                  {formatCurrency(ticket.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {getUserRole("technician") && (
          <div className="text-gray-200 border border-gray-500 rounded-[10px] flex flex-col gap-4 p-5 md:p-6 w-full md:w-120">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 font-bold">
                Serviços adicionais
              </span>
              <Button
                variant="iconDarkSm"
                className="w-7 h-7"
                onClick={() => setAddAdditional(true)}
              >
                <AddIcon />
              </Button>
            </div>
            <ul className="flex flex-col gap-2 w-full">
              {ticket.service
                .filter((service) => service.type === "additional")
                .map((additional) => (
                  <li
                    className="flex flex-row justify-between items-center w-full pb-2 border-b border-gray-500 last:border-0"
                    key={additional.id}
                  >
                    <h3 className="text-xs font-bold text-gray-200 whitespace-nowrap">
                      {additional.title}
                    </h3>
                    <div className="flex pl-6 gap-6 items-center">
                      <span className="text-xs">
                        R${formatCurrency(additional.price)}
                      </span>
                      <Button
                        variant="iconLightSm"
                        className="w-7 h-7"
                        onClick={() => deleteService(additional.id)}
                        isLoading={isLoading}
                      >
                        <TrashIcon className="text-feedback-danger" />
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
        <div>{""}</div>
        <AlertMessage message={message} />
      </div>

      {getUserRole("technician") && (
        <PopUp
          backIcon={false}
          state={addAdditional}
          setState={setAddAdditional}
          title="Serviço adicional"
          onAction={formAction}
          isLoading={pending}
        >
          <div className="flex flex-col gap-4">
            <Input
              name="title"
              required
              legend="descrição"
              type="text"
              placeholder="Adicione a descrição do serviço"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              formState={state}
            />
            <Input
              required
              legend="valor"
              type="text"
              placeholder="R$ 0,00"
              value={price > 0 ? `R$ ${formatCurrency(price)}` : ""}
              onChange={(e) =>
                handlePriceChange({ value: e.target.value, setPrice })
              }
            />
            <Input type="hidden" name="price" value={price} formState={state} />
            <AlertMessage message={state} />
          </div>
        </PopUp>
      )}
    </div>
  );
}
