import { ZodError } from "zod";
import type { FormState } from "./formState";
import axios from "axios";

export function handleFormError(error: any): FormState {
  console.log(error);
  if (axios.isAxiosError(error)) {
    return {
      message:
        error.response?.data?.message || "Erro ao obter resposta do servidor.",
      field: "server",
    };
  }
  if (error instanceof ZodError) {
    const zodError = error.issues[0];
    return { message: zodError.message, field: zodError.path[0] as string };
  }
  return {
    message: "Não foi possível conectar ao servidor. Verifique sua conexão.",
    field: "network",
  };
}
