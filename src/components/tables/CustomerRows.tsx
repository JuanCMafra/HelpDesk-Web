import { Button } from "../UI/Button";
import { Profile } from "../Profile";
import PencilIcon from "../../assets/icons/pencil.svg?react";
import TrashIcon from "../../assets/icons/trash.svg?react";

type Props = React.ComponentProps<"ul"> & {
  role: UserAPIRole;
  customers: UserAPIResponse[];
  onEdit?: (id: string) => void;
  setDelete?: React.Dispatch<React.SetStateAction<boolean>>;
  deleteUser?: (id: string) => void;
};

export const CUSTOMER_ROWS_CONFIG = {
  admin: {
    gridClass:
      "grid grid-cols-[1fr_120px_88px] py-3.5 md:grid-cols-[1fr_400px_88px] items-center text-sm text-gray-200",
    cells: [
      {
        className: "flex items-center px-3 min-w-0",
        render: (customer: UserAPIResponse) => (
          <div className="flex items-center min-w-0 gap-3 font-bold">
            <Profile
              variants="md"
              avatar={customer.user.avatar}
              name={customer.user.name}
              className="min-w-7 font-medium"
            />
            <span className="truncate">{customer.user.name}</span>
          </div>
        ),
      },
      {
        className: "truncate px-3",
        render: (customer: UserAPIResponse) => (
          <span>{customer.user.email}</span>
        ),
      },
      {
        className: "px-3",
        render: (
          customer: UserAPIResponse,
          onEdit?: (id: string) => void,
          setDelete?: React.Dispatch<React.SetStateAction<boolean>>,
          deleteUser?: (id: string) => void,
        ) => (
          <div className="flex gap-2 justify-end">
            <Button
              variant="iconLightSm"
              onClick={() => onEdit?.(customer.user.id)}
            >
              <PencilIcon className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="iconLightSm"
              onClick={() => {
                setDelete?.(true);
                deleteUser?.(customer.user.id);
              }}
            >
              <TrashIcon className="w-3.5 h-3.5 text-feedback-danger" />
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

export function CustomerRows({
  role,
  customers,
  onEdit,
  setDelete,
  deleteUser,
  ...rest
}: Props) {
  const config = CUSTOMER_ROWS_CONFIG[role];

  return (
    <ul className="divide-y divide-gray-500" {...rest}>
      {customers.map((customer) => (
        <li key={customer.user.id} className={config.gridClass}>
          {config.cells.map((cell, index) => (
            <div key={index} className={cell.className}>
              {cell.render(customer, onEdit, setDelete, deleteUser)}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
