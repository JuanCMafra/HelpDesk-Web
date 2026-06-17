import { useNavigate, useParams } from "react-router";
import { Button } from "./UI/Button";
import BackIcon from "../assets/icons/arrow-left.svg?react";
import CloseIcon from "../assets/icons/x.svg?react";
import { Input } from "./UI/Input";
import { useActionState, useEffect, useState } from "react";
import { hours } from "../utils/hoursOpen";
import { handleFormError } from "../utils/handleFormError";
import type { FormState } from "../utils/formState";
import { api } from "../services/api";
import z from "zod";
import { AlertMessage } from "./AlertMessage";

const createSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Nome e sobrenome deve ter ter mais de 5 letras!" }),
  email: z.email({ message: "e-mail inválido!" }),
  password: z
    .string()
    .min(6, { message: "A senha deve possuir mais que 6 caracteres!" }),
  availability: z
    .array(z.enum(hours))
    .min(1, { message: "Selecione ao menos um horário!" }),
});

const updateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Nome e sobrenome deve ter mais de 5 letras!" })
    .optional(),
  email: z.email({ message: "E-mail inválido!" }),
  availability: z
    .array(z.enum(hours))
    .min(1, { message: "Selecione ao menos um horário!" }),
});
export function TechnicianProfile() {
  const params = useParams<{ id: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [period, setPeriod] = useState<string[]>([]);

  const [state, formAction, pending] = useActionState(onAction, null);

  const navigate = useNavigate();

  function schedulesHours(period: "morning" | "afternoon" | "night") {
    if (period === "morning") {
      return hours.filter((hour) => Number(hour.split(":")[0]) <= 12);
    }

    if (period === "afternoon") {
      return hours.filter((hour) => {
        const h = Number(hour.split(":")[0]);

        return h > 12 && h <= 18;
      });
    }

    if (period === "night") {
      return hours.filter((hour) => Number(hour.split(":")[0]) > 18);
    }
  }

  function handleSelectHour(hour: string) {
    setPeriod((prev) =>
      prev.includes(hour) ? prev.filter((h) => h !== hour) : [...prev, hour],
    );
  }

  async function fetchProfile(id: string) {
    try {
      const response = await api.get<TechnicianProfile>(
        `/admin/technician/${id}`,
      );
      setName(response.data.name);
      setEmail(response.data.email);
      setPeriod(response.data.availability ?? []);
    } catch (error) {
      handleFormError(error);
    }
  }

  async function onAction(
    prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      if (params.id) {
        const data = updateSchema.parse({
          name: formData.get("name"),
          email: formData.get("email"),
          availability: period,
        });

        await api.patch(`/admin/technician/${params.id}`, data);

        fetchProfile(params.id);

        return {
          message: "Perfil alterado com sucesso!",
          field: "confirm",
        };
      } else {
        const data = createSchema.parse({
          name: formData.get("name"),
          email: formData.get("email"),
          password: formData.get("password"),
          availability: period,
        });

        await api.post("/admin/technician", data);

        return {
          message: "Técnico criado com sucesso!",
          field: "confirm",
        };
      }
    } catch (error) {
      return handleFormError(error);
    }
  }

  useEffect(() => {
    if (state?.field === "confirm") {
      setName("");
      setEmail("");
      setPassword("");
      setPeriod([]);
    }
  }, [state]);

  useEffect(() => {
    if (params.id) {
      fetchProfile(params.id);
    }
  }, [params.id]);

  return (
    <div className="text-gray-200 flex flex-col w-full max-w-200 gap-4 md:mx-auto">
      <header className="flex flex-col w-full md:flex-row md:justify-between md:items-end items-start gap-3">
        <div className="flex flex-col md:flex-1 items-start w-full gap-1">
          <Button
            variant="link"
            className="flex gap-2 w-auto"
            onClick={() => navigate(-1)}
          >
            <BackIcon className="w-3.5 h-auto text-gray-300" />
            <span>Voltar</span>
          </Button>
          <h1 className="text-xl  text-blue-dark text-nowrap">
            Perfil de técnico
          </h1>
        </div>
        <div className="flex w-full gap-2 md:w-auto justify-end md:max-w-none h-auto md:ml-auto shrink-0">
          <Button
            variant="light"
            className="flex-1 md:max-w-21.75 h-auto md:flex-none"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="dark"
            className="flex-1 md:flex-none h-auto w-full md:max-w-17.5"
            isLoading={pending}
            form="tech-form"
          >
            Salvar
          </Button>
        </div>
      </header>

      <form
        action={formAction}
        className="flex gap-5 w-full flex-col md:flex-row md:gap-6 md:items-start"
        id="tech-form"
      >
        <div className="flex flex-col gap-4 border h-auto w-full md:flex-1 border-gray-500 rounded-[10px] p-5">
          <div>
            <h3 className="text-md font-bold">Dados pessoais</h3>
            <span className="text-xs text-gray-300">
              Defina as informações do perfil de técnico
            </span>
          </div>

          <div className="flex flex-col  gap-4 ">
            <Input
              required
              type="text"
              legend="nome"
              name="name"
              placeholder="Digite o nome completo"
              onChange={(e) => setName(e.target.value)}
              value={name}
              formState={state}
            />
            <Input
              required
              type="email"
              name="email"
              legend="e-mail"
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              formState={state}
            />
            {params.id ? (
              <span></span>
            ) : (
              <Input
                required
                type="password"
                name="password"
                legend="senha"
                placeholder="Digite sua senha"
                onChange={(e) => setPassword(e.target.value)}
                helper="Mínimo de 6 dígitos"
                formState={state}
              />
            )}
          </div>
        </div>

        <div className="border h-auto border-gray-500 rounded-[10px] p-5 flex  flex-col w-full md:max-w-120 gap-5">
          <div>
            <h2 className="text-md text-gray-200 font-bold">
              Horários de atendimento
            </h2>
            <span className="text-xs text-gray-300">
              Selecione os horários de disponibilidade do técnico para
              atendimento
            </span>
          </div>
          <div className="flex flex-col gap-4 h-full w-auto">
            <div className="flex flex-col gap-2 h-full">
              <span className="text-xxs text-gray-300">MANHÃ</span>
              <ul className="flex gap-2 text-xs font-bold w-full h-auto flex-wrap ">
                {schedulesHours("morning")?.map((hour) => (
                  <li
                    onClick={() => handleSelectHour(hour)}
                    className={`h-auto rounded-full cursor-pointer flex-wrap ${
                      period.includes(hour)
                        ? "bg-blue-base text-gray-600 py-1.75 px-1.5 border-none flex items-center "
                        : "border-2 border-gray-400 p-1.5"
                    }`}
                    key={hour}
                  >
                    <span className="px-1.5">{hour}</span>
                    {period.includes(hour) && (
                      <CloseIcon className="text-gray-600 w-3.5 h-3.5" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 h-full">
              <span className="text-xxs text-gray-300">TARDE</span>
              <ul className="flex gap-2 text-xs font-bold w-full h-auto flex-wrap ">
                {schedulesHours("afternoon")?.map((hour) => (
                  <li
                    onClick={() => handleSelectHour(hour)}
                    className={`h-auto rounded-full cursor-pointer flex-wrap ${
                      period.includes(hour)
                        ? "bg-blue-base text-gray-600 py-1.75 px-1.5 border-none flex items-center"
                        : "border-2 border-gray-400 p-1.5"
                    }`}
                    key={hour}
                  >
                    <span className="px-1.5">{hour}</span>
                    {period.includes(hour) && (
                      <CloseIcon className="text-gray-600 w-3.5 h-3.5" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-2 h-full">
              <span className="text-xxs text-gray-300">NOITE</span>
              <ul className="flex gap-2 text-xs font-bold w-full h-auto flex-wrap">
                {schedulesHours("night")?.map((hour) => (
                  <li
                    onClick={() => handleSelectHour(hour)}
                    className={`h-auto rounded-full cursor-pointer flex-wrap ${
                      period.includes(hour)
                        ? "bg-blue-base text-gray-600 py-1.75 px-1.5 border-none flex items-center "
                        : "border-2 border-gray-400 p-1.5"
                    }`}
                    key={hour}
                  >
                    <span className="px-1.5">{hour}</span>
                    {period.includes(hour) && (
                      <CloseIcon className="text-gray-600 w-3.5 h-3.5" />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </form>
      <AlertMessage message={state} />
      <span> </span>
    </div>
  );
}
