import { useActionState } from "react";
import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import z from "zod";
import { api } from "../services/api";
import { useNavigate } from "react-router";
import type { FormState } from "../utils/formState";
import { handleFormError } from "../utils/handleFormError";
import { AlertMessage } from "../components/AlertMessage";

const signUpSchema = z.object({
  name: z
    .string()
    .trim()
    .min(5, { message: "Nome e sobrenome devem ter mais de 5 letras!" }),
  email: z.email({ message: "Informe um e-mail válido!" }),
  password: z.string().trim().min(6, { message: "Informe uma senha válida!" }),
});

export function SignUp() {
  const [state, formAction, pending] = useActionState(onAction, null);

  const navigate = useNavigate();

  async function onAction(
    prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      const data = signUpSchema.parse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
      });

      await api.post("/users", data);

      if (confirm("Cadastrado com sucesso. Ir para tela de login?")) {
        navigate("/");
      }

      return { message: "Cadastro realizado com sucesso!", field: "confirm" };
    } catch (error) {
      return handleFormError(error);
    }
  }

  return (
    <form action={formAction} className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col gap-8 md:gap-10 border-gray-500 border rounded-xl p-6 md:p-7">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg text-gray-200">Crie sua conta</h1>
          <span className="text-xs text-gray-300">
            Informe seu nome, e-mail e senha.
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            required
            name="name"
            type="text"
            legend="nome"
            placeholder="Digite o nome completo"
            formState={state}
          />
          <Input
            required
            name="email"
            type="email"
            legend="e-mail"
            placeholder="exemplo@email.com"
            formState={state}
          />
          <Input
            required
            name="password"
            type="password"
            legend="senha"
            placeholder="Digite sua senha"
            helper="Mínimo de 6 dígitos"
            formState={state}
          />

          <AlertMessage message={state} />
        </div>

        <Button type="submit" variant="dark" isLoading={pending}>
          Cadastrar
        </Button>
      </div>

      <div className="w-full flex flex-col gap-5 md:gap-6 border-gray-500 border rounded-xl p-6 md:p-7">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-bold text-gray-200">Já tem uma conta?</h2>
          <span className="text-xs text-gray-300">Entre agora mesmo</span>
        </div>
        <a href="/">
          <Button type="button" variant="light">
            Acessar conta
          </Button>
        </a>
      </div>
    </form>
  );
}
