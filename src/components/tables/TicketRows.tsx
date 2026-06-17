import { Status } from "../UI/Status";
import showIcon from "../../assets/icons/details.svg";
import { Button } from "../UI/Button";
import { formatCurrency } from "../../utils/formatCurrency";
import { Profile } from "../Profile";

import PencilIcon from "../../assets/icons/pencil.svg?react";

import { classMerge } from "../../utils/classMerge";

type Props = React.ComponentProps<"ul"> & {
  role: UserAPIRole;
  tickets: TicketProps[];
};

export const TICKETS_ROWS_CONFIG = {
  admin: {
    gridClass:
      "grid grid-cols-[80px_1fr_64px_52px] text-sm text-gray-200 md:grid-cols-[112px_64px_1fr_104px_160px_160px_152px_52px]",
    cells: [
      {
        className:
          "md:truncate flex items-center md:inline py-3.75 text-xs px-3 md:pl-3 md:pr-3.25 md:py-[23.5px]",
        render: (ticket: TicketProps) => ticket.updated_at,
      },
      {
        className:
          "hidden md:block md:py-[23.5px] text-shadow-2xs md:px-3 font-bold",
        render: (ticket: TicketProps) =>
          String(ticket.ticketNumber).padStart(5, "0"),
      },
      {
        className: "flex flex-col py-5.5 px-3 items-start md:min-w-20 truncate",
        render: (ticket: TicketProps) => (
          <>
            <h3 className="font-bold">{ticket.title}</h3>
            <span className="text-xs text-gray-400">
              {ticket.service
                .filter((s) => s.type === "base")
                .map((s) => s.title)}
            </span>
          </>
        ),
      },
      {
        className: "hidden py-5.5 px-3 md:block md:px-3 truncate",
        render: (ticket: TicketProps) => (
          <>
            <small className="font-normal text-sm">R$</small>{" "}
            {formatCurrency(ticket.total)}
          </>
        ),
      },
      {
        className: "hidden md:flex py-5.5 px-3 md:gap-2 items-center",
        render: (ticket: TicketProps) => (
          <>
            <Profile
              avatar={ticket.client.avatar}
              name={ticket.client.name}
              variants="sm"
            />
            <span>{ticket.client.name}</span>
          </>
        ),
      },
      {
        className: "hidden md:flex py-5.5 px-3 md:gap-2 items-center",
        render: (ticket: TicketProps) => (
          <>
            <Profile
              avatar={ticket.technician.avatar}
              name={ticket.technician.name}
              variants="sm"
            />
            <span>{ticket.technician.name}</span>
          </>
        ),
      },
      {
        className: "md:px-3 md:justify-start flex items-center justify-center",
        render: (ticket: TicketProps) => (
          <>
            <Status
              className="hidden md:flex"
              status={ticket.status}
              variant="base"
            />
            <Status
              className="md:hidden"
              status={ticket.status}
              variant="icon"
            />
          </>
        ),
      },
      {
        className: "flex items-center justify-center",
        render: (ticket: TicketProps) => (
          <a href={`/tickets/admin/${ticket.id}`}>
            <Button variant="iconLightSm">
              <PencilIcon className="w-3.5 h-auto" />
            </Button>
          </a>
        ),
      },
    ],
  },

  customer: {
    gridClass:
      "grid grid-cols-[80px_1fr_64px_52px] text-sm text-gray-200 md:grid-cols-[112px_64px_1fr_200px_104px_160px_152px_52px]",
    cells: [
      {
        className:
          "md:truncate flex items-center md:inline py-3.75 text-xs px-3 md:pl-3 md:pr-3.25 md:py-[23.5px] cursor-pointer",
        render: (ticket: TicketProps) => ticket.updated_at,
      },
      {
        className:
          "hidden md:block md:py-[23.5px] text-shadow-2xs md:px-3 font-bold",
        render: (ticket: TicketProps) =>
          String(ticket.ticketNumber).padStart(5, "0"),
      },
      {
        className: "py-5.5 px-3 truncate  font-bold flex items-center",
        render: (ticket: TicketProps) => ticket.title,
      },
      {
        className: "hidden md:block py-5.5 px-3 md:px-3 md:truncate",
        render: (ticket: TicketProps) => (
          <>
            {ticket.service
              .filter((s) => s.type === "base")
              .map((s) => s.title)}
          </>
        ),
      },
      {
        className: "hidden py-5.5 px-3 md:block md:px-3 truncate",
        render: (ticket: TicketProps) => (
          <>
            <small className="font-normal text-sm">R$</small>{" "}
            {formatCurrency(ticket.total)}
          </>
        ),
      },
      {
        className: "hidden md:flex py-5.5 px-3 md:gap-2 items-center",
        render: (ticket: TicketProps) => (
          <>
            <Profile
              avatar={ticket.technician.avatar}
              name={ticket.technician.name}
              variants="sm"
            />
            <span>{ticket.technician.name}</span>
          </>
        ),
      },
      {
        className: "md:px-3 md:justify-start flex items-center justify-center",
        render: (ticket: TicketProps) => (
          <>
            <Status
              className="hidden md:flex"
              status={ticket.status}
              variant="base"
            />
            <Status
              className="md:hidden"
              status={ticket.status}
              variant="icon"
            />
          </>
        ),
      },
      {
        className: "flex items-center justify-center",
        render: (ticket: TicketProps) => (
          <a href={`/tickets/customer/${ticket.id}`}>
            <Button variant="iconLightSm">
              <img src={showIcon} className="w-3.5 h-auto" alt="" />
            </Button>
          </a>
        ),
      },
    ],
  },

  technician: {
    gridClass: "",
    cells: [
      {
        className: "p-10 text-red-500 font-bold text-lg",
        render: () => <span>Linha não encontrada!</span>,
      },
    ],
  },
} as const;

export function TicketRows({ role, tickets }: Props) {
  if (!role) {
    return;
  }

  const config = TICKETS_ROWS_CONFIG[role];

  const sortedTickets = [...tickets].sort(
    (a, b) => Number(a.status) - Number(b.status),
  );

  return (
    <ul className="divide-y divide-gray-500">
      {sortedTickets.map((ticket) => (
        <li
          key={ticket.id}
          className={classMerge(["items-center", config.gridClass])}
        >
          {config.cells.map((cell, index) => (
            <div key={index} className={cell.className}>
              {cell.render(ticket)}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
