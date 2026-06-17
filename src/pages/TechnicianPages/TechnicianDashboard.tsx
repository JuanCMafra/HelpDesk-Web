import { Button } from "../components/UI/Button";
import { Status } from "../components/UI/Status";
import pencilIcon from "../assets/icons/pencil.svg";
import ClosedIcon from "../assets/icons/close.svg?react";
import ProgressIcon from "../assets/icons/in_progress.svg?react";
import { formatCurrency } from "../utils/formatCurrency";
import { Profile } from "../components/Profile";
import { useEffect, useState } from "react";
import type { FormState } from "../utils/formState";
import { api } from "../services/api";
import { handleFormError } from "../utils/handleFormError";
import { AlertMessage } from "../components/AlertMessage";
import {
  closeTicket,
  openTicket,
  startTicket,
} from "../utils/changeTicketStatus";
import { useNavigate } from "react-router";

export function TechnicianDashboard() {
  const [errorMessage, setErrorMessage] = useState<FormState | null>(null);
  const [tickets, setTickets] = useState<TicketProps[] | null>([]);
  const navigate = useNavigate();

  async function showTickets() {
    try {
      const response = await api.get("/tickets/technician");

      setTickets(response.data);
      navigate("/");
    } catch (error) {
      setErrorMessage(handleFormError(error));
    }
  }

  useEffect(() => {
    showTickets();
  }, []);

  return (
    <div className="text-gray-200 w-full h-auto flex flex-col gap-4 md:gap-6 ">
      <h1 className="text-blue-dark text-lg">Meus Chamados</h1>
      <AlertMessage message={errorMessage} />
      <div className="flex flex-col gap-6 ">
        <div className="flex flex-col items-start h-auto gap-4">
          <Status status="in_progress" />
          <ul className="flex flex-col md:flex-row items-start w-full gap-4">
            {tickets
              ?.filter((ticket) => ticket.status === "in_progress")
              .map((ticket) => (
                <li
                  className="flex flex-col  gap-4 p-5 border border-gray-500 rounded-[10px] h-auto w-full md:max-w-86.5 relative"
                  key={ticket.id}
                >
                  <div className="absolute flex gap-1 top-3 right-3">
                    <a href={`/tickets/technician/${ticket.id}`}>
                      <Button variant="iconLightSm">
                        <img src={pencilIcon} className="w-3.5" alt="" />
                      </Button>
                    </a>
                    <Button
                      className="flex w-auto px-2 py-[5.5px] gap-2"
                      onClick={() =>
                        closeTicket(ticket.id, showTickets, setErrorMessage)
                      }
                    >
                      <ClosedIcon className="text-gray-600 w-3.5 h-auto" />
                      <span className="text-gray-600 text-xs font-bold">
                        Encerrar
                      </span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-400 font-bold">
                      {String(ticket.ticketNumber).padStart(5, "0")}
                    </span>
                    <div>
                      <h3 className="text-gray-100 text-md font-bold">
                        {ticket.title}
                      </h3>
                      <span className="text-xs ">
                        {ticket.service.map(
                          (service) => service.type === "base" && service.title,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span>{ticket.updated_at}</span>
                    <span>
                      <small className="text-xxs font-bold">R$</small>
                      {formatCurrency(ticket.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-500 pt-5">
                    <div className="flex gap-0.75">
                      <Profile
                        avatar={ticket.client.avatar}
                        name={ticket.client.name}
                        variants="sm"
                      />
                      <span className="text-xs font-bold">
                        {ticket.client.name}
                      </span>
                    </div>
                    <Status variant="icon" status={ticket.status} />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="flex flex-col items-start h-auto gap-4">
          <Status status="open" />
          <ul className="flex flex-col md:flex-row items-start w-full gap-4">
            {tickets
              ?.filter((ticket) => ticket.status === "open")
              .map((ticket) => (
                <li
                  className="flex flex-col  gap-4 p-5 border border-gray-500 rounded-[10px] h-auto w-full md:max-w-86.5 relative"
                  key={ticket.id}
                >
                  <div className="absolute flex gap-1 top-3 right-3">
                    <a href={`/tickets/technician/${ticket.id}`}>
                      <Button variant="iconLightSm">
                        <img src={pencilIcon} className="w-3.5" alt="" />
                      </Button>
                    </a>
                    <Button
                      className="flex w-auto px-2 py-[5.5px] gap-2"
                      onClick={() =>
                        startTicket(ticket.id, showTickets, setErrorMessage)
                      }
                    >
                      <ProgressIcon className="text-gray-600 w-3.5 h-auto" />
                      <span className="text-gray-600 text-xs font-bold">
                        Iniciar
                      </span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-400 font-bold">
                      {String(ticket.ticketNumber).padStart(5, "0")}
                    </span>
                    <div>
                      <h3 className="text-gray-100 text-md font-bold">
                        {ticket.title}
                      </h3>
                      <span className="text-xs ">
                        {ticket.service.map(
                          (service) => service.type === "base" && service.title,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span>{ticket.updated_at}</span>
                    <span>
                      <small className="text-xxs font-bold">R$</small>
                      {formatCurrency(ticket.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-500 pt-5">
                    <div className="flex gap-0.75">
                      <Profile
                        avatar={ticket.client.avatar}
                        name={ticket.client.name}
                        variants="sm"
                      />
                      <span className="text-xs font-bold">
                        {ticket.client.name}
                      </span>
                    </div>
                    <Status variant="icon" status={ticket.status} />
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className="flex flex-col items-start h-auto gap-4">
          <Status status="close" />
          <ul className="flex flex-col md:flex-row items-start w-full gap-4">
            {tickets
              ?.filter((ticket) => ticket.status === "close")
              .map((ticket) => (
                <li
                  className="flex flex-col  gap-4 p-5 border border-gray-500 rounded-[10px] h-auto w-full md:max-w-86.5 relative"
                  key={ticket.id}
                >
                  <div className="absolute flex gap-1 top-3 right-3">
                    <a href={`/tickets/technician/${ticket.id}`}>
                      <Button variant="iconLightSm">
                        <img src={pencilIcon} className="w-3.5" alt="" />
                      </Button>
                    </a>
                    <Button
                      className="flex w-auto px-2 py-[5.5px] gap-2"
                      onClick={() =>
                        openTicket(ticket.id, showTickets, setErrorMessage)
                      }
                    >
                      <ProgressIcon className="text-gray-600 w-3.5 h-auto" />
                      <span className="text-gray-600 text-xs font-bold">
                        Abrir Novamente
                      </span>
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs text-gray-400 font-bold">
                      {String(ticket.ticketNumber).padStart(5, "0")}
                    </span>
                    <div>
                      <h3 className="text-gray-100 text-md font-bold">
                        {ticket.title}
                      </h3>
                      <span className="text-xs ">
                        {ticket.service.map(
                          (service) => service.type === "base" && service.title,
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <span>{ticket.updated_at}</span>
                    <span>
                      <small className="text-xxs font-bold">R$</small>
                      {formatCurrency(ticket.total)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center border-t border-gray-500 pt-5">
                    <div className="flex gap-0.75">
                      <Profile
                        avatar={ticket.client.avatar}
                        name={ticket.client.name}
                        variants="sm"
                      />
                      <span className="text-xs font-bold">
                        {ticket.client.name}
                      </span>
                    </div>
                    <Status variant="icon" status={ticket.status} />
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
