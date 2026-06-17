import { Button } from "./Button";
import ClosedIcon from "../../assets/icons/close.svg?react";
import ProgressIcon from "../../assets/icons/in_progress.svg?react";
import clsx from "clsx";
import {
  closeTicket,
  openTicket,
  startTicket,
} from "../../utils/changeTicketStatus";
import type { FormState } from "../../utils/formState";

type Props = React.ComponentProps<"a"> & {
  status: TicketStatus;
  role: UserAPIRole;
  ticketId: string;
  apiTicket: () => Promise<void>;
  errorMessage: React.Dispatch<React.SetStateAction<FormState | null>>;
  isLoading: boolean;
};

type RenderProps = {
  ticketId: string;
  apiTicket: () => Promise<void>;
  errorMessage: React.Dispatch<React.SetStateAction<FormState | null>>;
};

const roleVariant = {
  admin: {
    open: {
      left: {
        icon: ProgressIcon,
        label: "Em atendimento",
        type: "light",
        render: (ticket: RenderProps) =>
          startTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
      right: {
        icon: ClosedIcon,
        label: "Encerrado",
        type: "light",
        render: (ticket: RenderProps) =>
          closeTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
    },
    in_progress: {
      left: null,

      right: {
        icon: ClosedIcon,
        label: "Encerrar",
        type: "light",
        render: (ticket: RenderProps) =>
          closeTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
    },
    close: {
      left: null,

      right: {
        icon: ProgressIcon,
        label: "Abrir novamente",
        type: "light",
        render: (ticket: RenderProps) =>
          openTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
    },
  },
  technician: {
    open: {
      left: {
        icon: ClosedIcon,
        label: "Encerrar",
        type: "light",
        render: (ticket: RenderProps) =>
          closeTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
      right: {
        icon: ProgressIcon,
        label: "Iniciar atendimento",
        type: "dark",
        render: (ticket: RenderProps) =>
          startTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
    },
    in_progress: {
      left: null,
      right: {
        icon: ClosedIcon,
        label: "Encerrar",
        type: "dark",
        render: (ticket: RenderProps) =>
          closeTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
    },
    close: {
      left: null,

      right: {
        icon: ProgressIcon,
        label: "Abrir novamente",
        type: "dark",
        render: (ticket: RenderProps) =>
          openTicket(ticket.ticketId, ticket.apiTicket, ticket.errorMessage),
      },
    },
  },
} as const;

export function ChangeStatusButton({
  role,
  status,
  ticketId,
  apiTicket,
  errorMessage,
  isLoading,
  ...rest
}: Props) {
  if (role === "customer") return null;

  const currentConfig = roleVariant[role][status];
  if (!currentConfig) return null;

  const LeftIcon = currentConfig.left?.icon;
  const RightIcon = currentConfig.right?.icon;

  const isRightAlone = !currentConfig.left && currentConfig.right;
  const renderProps = {
    ticketId,
    apiTicket,
    errorMessage,
  };

  return (
    <div
      className={clsx(
        "flex gap-2 w-full md:w-auto justify-end h-auto md:ml-auto shrink-0",
        isRightAlone ? "max-w-42 ml-auto" : "w-full md:max-w-none",
      )}
    >
      {currentConfig.left && LeftIcon && (
        <a
          href=""
          onClick={(e) => {
            e.preventDefault();
            currentConfig.left.render(renderProps);
          }}
          {...rest}
          className="flex-1 md:max-w-44.75 h-auto md:flex-none"
        >
          <Button
            variant={currentConfig.left.type}
            className="py-2.75 px-4 h-auto text-nowrap flex gap-2 text-sm font-bold w-full justify-center"
            isLoading={isLoading}
          >
            <LeftIcon className="w-4.5 h-4.5" />
            {currentConfig.left.label}
          </Button>
        </a>
      )}

      {currentConfig.right && RightIcon && (
        <a
          href=""
          className="flex-1 md:flex-none h-auto w-full md:w-auto"
          onClick={(e) => {
            e.preventDefault();
            currentConfig.right.render(renderProps);
          }}
          {...rest}
        >
          <Button
            variant={currentConfig.right.type}
            className="py-2.75 px-4 w-full h-auto tex
            t-nowrap flex gap-2 text-sm font-bold md:w-full justify-center"
            isLoading={isLoading}
          >
            <RightIcon className="w-4.5 h-4.5" />
            {currentConfig.right.label}
          </Button>
        </a>
      )}
    </div>
  );
}
