import { useActionState, useEffect, useState } from "react";
import { Input } from "../../components/UI/Input";
import { Select } from "../../components/UI/Select";
import { TextArea } from "../../components/UI/Textarea";
import { Button } from "../../components/UI/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import z from "zod";
import { api } from "../../services/api";
import type { FormState } from "../../utils/formState";
import { handleFormError } from "../../utils/handleFormError";
import { AlertMessage } from "../../components/AlertMessage";

const newTicketSchema = z.object({
  title: z.string().trim().min(4, "O título deve ter pelo menos 4 caracteres!"),
  description: z.string().optional(),
  service: z.uuid(),
});

export function NewTicket() {
  const [services, setServices] = useState<ServicesProps[]>([]);
  const [category, setCategory] = useState("");
  const [state, formAction, pending] = useActionState(onAction, null);
  const [serviceMessage, setServiceMessage] = useState<FormState | null>(null);

  async function showServices() {
    try {
      const response = await api.get("/services/customer");

      setServices(response.data);
    } catch (error) {
      setServiceMessage(handleFormError(error));
    }
  }

  const selectedCategory = services.find((service) => service.id === category);

  async function onAction(
    prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      const data = newTicketSchema.parse({
        title: formData.get("title"),
        description: formData.get("description"),
        service: formData.get("service"),
      });

      await api.post("/tickets", data);

      return { message: "Chamado criado com sucesso!", field: "confirm" };
    } catch (error) {
      return handleFormError(error);
    }
  }

  useEffect(() => {
    showServices();
  }, []);

  useEffect(() => {
    if (state?.field === "confirm") {
      const form = document.getElementById("ticket-form") as HTMLFormElement;
      form?.reset();

      setCategory("");
    }
  }, [state]);

  return (
    <div className="max-w-200 h-full flex flex-col gap-4 md:gap-6 mx-auto">
      <h1 className="text-blue-dark text-lg md:text-xl">Novo chamado</h1>
      <form
        action={formAction}
        className="flex gap-4 flex-col md:flex-row md:items-start md:gap-6"
        id="ticket-form"
      >
        <div className="p-5 flex flex-col gap-5 md:gap-6 border md:p-8 border-gray-500 rounded-[10px]">
          <div className="flex flex-col gap-2">
            <h2 className="text-gray-200 text-md font-bold">Informações</h2>
            <span className="text-gray-300 text-xs">
              Configure os dias e horários em que você está disponível para
              atender chamados
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <Input
              required
              name="title"
              legend="título"
              placeholder="Digite um título para o chamado"
              type="text"
              formState={state}
              defaultValue={""}
            />

            <TextArea
              name="description"
              legend="descrição"
              placeholder="Descreva o que está acontecendo"
              formState={state}
              defaultValue={""}
            />
            <div className="flex flex-col gap-1">
              <Select
                required
                legend="categoria do serviço"
                value={category}
                name="service"
                formState={state}
                onChange={(e) => setCategory(e.target.value)}
                className={`${category === "" ? "text-gray-400" : "text-gray-200"} h-10 w-full border-b border-gray-500 text-gray-200 placeholder-gray-400  focus-within:border-b-blue-base bg-transparent  focus-within:outline-0`}
              >
                <option value="" disabled className="text-gray-400">
                  Selecione a categoria de atendimento
                </option>
                {services.map((service) => (
                  <option
                    className="text-md text-gray-200"
                    value={service.id}
                    key={service.id}
                  >
                    {service.title}
                  </option>
                ))}
              </Select>
              <AlertMessage message={serviceMessage} />
            </div>
          </div>
        </div>
        <div className="border border-gray-500 w-auto rounded-[10px] p-5 flex flex-col gap-5">
          <div>
            <h2 className="text-md text-gray-200 font-bold">Resumo</h2>
            <span className="text-xs text-gray-300">Valores e detalhes</span>
          </div>

          <div>
            <h3 className="text-xs text-gray-400">Categoria de serviço</h3>
            <span className="text-sm text-gray-200">
              {selectedCategory?.title ?? ""}
            </span>
          </div>

          <div>
            <h3 className="text-xs text-gray-400">Custo inicial</h3>
            <span className="text-lg text-gray-200">
              <mark className="text-xs bg-gray-600">R$</mark>
              {formatCurrency(selectedCategory?.price ?? 0)}
            </span>
          </div>

          <span className="text-gray-300 text-xs">
            O chamado será automaticamente atribuído a um técnico disponível
          </span>

          <Button type="submit" variant="dark" isLoading={pending}>
            Criar chamado
          </Button>

          <AlertMessage message={state} />
        </div>
      </form>
    </div>
  );
}
