import { Button } from "../UI/Button";
import PencilIcon from "../../assets/icons/pencil.svg?react";
import ActiveIcon from "../../assets/icons/done.svg?react";
import CancelIcon from "../../assets/icons/cancel.svg?react";
import { formatCurrency } from "../../utils/formatCurrency";

type Props = React.ComponentProps<"ul"> & {
  role: UserAPIRole;
  services: ServicesProps[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
  setModalEdit?: React.Dispatch<React.SetStateAction<boolean>>;
  isEditOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SERVICES_ROWS_CONFIG = {
  admin: {
    gridClass:
      "grid grid-cols-[1fr_112px_63px_80px] py-3.5 md:grid-cols-[1fr_328px_96px_138px] items-center text-sm text-gray-200",
    cells: [
      {
        className: "truncate px-3 font-bold",
        render: (service: ServicesProps) => <span>{service.title}</span>,
      },
      {
        className: "truncate px-3",
        render: (service: ServicesProps) => (
          <span>R$ {formatCurrency(service.price)}</span>
        ),
      },
      {
        className: "w-full h-full grid",
        render: (service: ServicesProps) => (
          <span className="justify-self-center self-center w-7 h-7 ">
            {service.status ? (
              <ActiveIcon className="text-feedback-done p-1.5 bg-feedback-done/20 rounded-full" />
            ) : (
              <CancelIcon className="text-feedback-danger p-1.5 bg-feedback-danger/20 rounded-full" />
            )}
          </span>
        ),
      },
      {
        className: "truncate flex items-center justify-end",
        render: (
          service: ServicesProps,
          onDelete?: (id: string) => void,
          onEdit?: (id: string) => void,
          setModalEdit?: React.Dispatch<React.SetStateAction<boolean>>,
          isEditOpen?: React.Dispatch<React.SetStateAction<boolean>>,
        ) => (
          <div className="flex  items-center gap-2 px-3">
            <Button variant="link" onClick={() => onDelete?.(service.id)}>
              {service.status ? (
                <div className="text-xs flex gap-2 items-center">
                  <CancelIcon className="w-5 h-5 md:w-3.5 md:h-3.5" />
                  <span className="hidden md:inline">Desativar</span>
                </div>
              ) : (
                <div className="text-xs flex gap-2 items-center">
                  <ActiveIcon className="w-5 h-5 md:w-3.5 md:h-3.5" />
                  <span className="hidden md:inline">Reativar</span>
                </div>
              )}
            </Button>

            <Button
              variant="iconLightSm"
              className="w-7 h-7"
              onClick={() => {
                setModalEdit?.(true);
                isEditOpen?.(true);
                onEdit?.(service.id);
              }}
            >
              <PencilIcon />
            </Button>
          </div>
        ),
      },
    ],
  },

  customer: {
    gridClass: "",
    cells: [
      {
        className: "p-10 text-red-500 font-bold text-lg",
        render: () => <span>Linha não encontrada!</span>,
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

export function ServicesRows({
  role,
  services,
  onDelete,
  setModalEdit,
  isEditOpen,
  onEdit,
  ...rest
}: Props) {
  const config = SERVICES_ROWS_CONFIG[role];

  const sortedServices = [...services].sort(
    (a, b) => Number(b.status) - Number(a.status),
  );

  return (
    <ul className="divide-y divide-gray-500" {...rest}>
      {sortedServices.map((service) => (
        <li key={service.id} className={config.gridClass}>
          {config.cells.map((cell, index) => (
            <div key={index} className={cell.className}>
              {cell.render(
                service,
                onDelete,
                onEdit,
                setModalEdit,
                isEditOpen,
              )}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
