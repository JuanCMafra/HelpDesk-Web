import { useActionState } from "react";
import { Button } from "../components/UI/Button";
import { Input } from "../components/UI/Input";
import z, { ZodError } from "zod";
import axios from "axios";
import type { FormState } from "../utils/formState";
import { api } from "../services/api";
import DangerIcon from "../assets/icons/alert.svg?react";
import { useAuth } from "../hooks/useAuth";
import { handleFormError } from "../utils/handleFormError";

const signInSchema = z.object({
  email: z.email({ message: "E-mail inválido!" }),
  password: z.string().trim().min(6, { message: "Informe a senha!" }),
});

export function SignIn() {
  const [state, formAction, pending] = useActionState(onAction, null);

  const auth = useAuth()

  async function onAction(
    prevState: any,
    formData: FormData,
  ): Promise<FormState> {
    try {
      const data = signInSchema.parse({
        email: formData.get("email"),
        password: formData.get("password"),
      });

      const response = await api.post("/sessions", data);

      auth.save(response.data)
      console.log(response);
      
      return {};
    } catch (error) {
      return handleFormError(error)
    }
  }

  const isGlobalError = state?.field === "server" || state?.field === "network";

  return (
    <form action={formAction} className="w-full flex flex-col gap-3">
      <div className="w-full flex flex-col gap-8 md:gap-10 border-gray-500 border rounded-xl p-6 md:p-7">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-lg text-gray-200">Acesse o portal</h1>
          <span className="text-xs text-gray-300">
            Entre usando seu e-mail e senha cadastrados
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            name="email"
            required
            type="email"
            legend="e-mail"
            placeholder="exemplo@email.com"
            formState={state}
          />
          <Input
            name="password"
            required
            type="password"
            legend="senha"
            placeholder="Digite sua senha"
            formState={state}
          />

          {isGlobalError && (
            <div className="flex items-center justify-center gap-1">
              <DangerIcon className="text-feedback-danger w-4 h-4" />
              <span className="w-auto text-xs text-feedback-danger ">
                {state.message}
              </span>
            </div>
          )}
        </div>

        <Button type="submit" variant="dark" isLoading={pending}>
          Entrar
        </Button>
      </div>

      <div className="w-full flex flex-col gap-5 md:gap-6 border-gray-500 border rounded-xl p-6 md:p-7">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-md font-bold text-gray-200">
            Ainda não tem uma conta?
          </h2>
          <span className="text-xs text-gray-300">Cadastre agora mesmo</span>
        </div>
        <a href="/signup">
          <Button type="button" variant="light">
            Criar Conta
          </Button>
        </a>
      </div>
    </form>
  );
}
