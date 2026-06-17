import { api } from "../services/api";
import type { FormState } from "./formState";
import { handleFormError } from "./handleFormError";

export async function closeTicket(
  ticketId: string,
  apiTicket: () => Promise<void>,
  errorMessage: React.Dispatch<React.SetStateAction<FormState | null>>,
) {
  try {
    await api.patch(`/tickets/${ticketId}/status`, { status: "close" });
    await apiTicket();
  } catch (error) {
    errorMessage(handleFormError(error));
  }
}
export async function startTicket(
  ticketId: string,
  apiTicket: () => Promise<void>,
  errorMessage: React.Dispatch<React.SetStateAction<FormState | null>>,
) {
  try {
    await api.patch(`/tickets/${ticketId}/status`, { status: "in_progress" });
    await apiTicket();
  } catch (error) {
    errorMessage(handleFormError(error));
  }
}
export async function openTicket(
  ticketId: string,
  apiTicket: () => Promise<void>,
  errorMessage: React.Dispatch<React.SetStateAction<FormState | null>>,
) {
  try {
    await api.patch(`/tickets/${ticketId}/status`, { status: "open" });
    await apiTicket();
  } catch (error) {
    errorMessage(handleFormError(error));
  }
}
