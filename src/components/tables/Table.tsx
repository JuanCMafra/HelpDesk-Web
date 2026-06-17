import type { UserRole } from "../../dtos/user";
import { classMerge } from "../../utils/classMerge";

type Props = React.ComponentProps<"div"> & {
  role: UserRole;
  type: keyof typeof tablesHeaders.admin;
};

const tablesHeaders = {
  admin: {
    tickets: {
      className:
        "grid grid-cols-[80px_1fr_64px_52px] py-3.5 text-sm text-gray-400 border-b border-gray-500 md:grid-cols-[112px_64px_1fr_104px_160px_160px_152px_52px]",
      headers: [
        {
          label: "Atualizado em",
          className: "truncate pl-3 pr-2.75",
        },
        {
          label: "Id",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Título e Serviço",
          className: "px-3 md:min-w-20 truncate",
        },
        {
          label: "Valor total",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Cliente",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Técnico",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Status",
          className: "px-[12.5px] md:px-3",
        },
        {
          label: "",
          className: "",
        },
      ],
    },

    technicians: {
      className:
        "grid items-center grid-cols-[1fr_120px_80px] py-3.5 md:grid-cols-[1fr_288px_328px_138px] text-sm text-gray-200",
      headers: [
        { label: "Nome", className: "px-3" },
        { label: "E-mail", className: "hidden md:block md:px-3" },
        { label: "Disponibilidade", className: "pl-3 pr-[11px]" },
        { label: "", className: "" },
      ],
    },

    customers: {
      className:
        "grid grid-cols-[1fr_120px_88px] py-3.5 md:grid-cols-[1fr_400px_88px]",
      headers: [
        { label: "Nome", className: "px-3" },
        { label: "E-mail", className: "px-3" },
        { label: "", className: "" },
      ],
    },

    services: {
      className:
        "grid grid-cols-[1fr_112px_63px_80px] py-3.5 md:grid-cols-[1fr_328px_96px_138px]",
      headers: [
        { label: "Título", className: "px-3" },
        { label: "Valor", className: "px-3" },
        { label: "Status", className: "self-center justify-self-center" },
        { label: "", className: "" },
      ],
    },
  },

  customer: {
    tickets: {
      className:
        "grid grid-cols-[80px_1fr_64px_52px] py-3.5 text-sm text-gray-400 border-b border-gray-500 md:grid-cols-[112px_64px_1fr_200px_104px_160px_152px_52px]",
      headers: [
        {
          label: "Atualizado em",
          className: "truncate pl-3 pr-2.75",
        },
        {
          label: "Id",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Título",
          className: "px-3 md:min-w-20 truncate",
        },
        {
          label: "Serviço",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Valor total",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Técnico",
          className: "hidden md:block md:px-3",
        },
        {
          label: "Status",
          className: "px-3",
        },
        {
          label: "",
          className: "",
        },
      ],
    },

    technicians: {
      className: "",
      headers: [{ label: "", className: "" }],
    },

    customers: {
      className: "",
      headers: [{ label: "", className: "" }],
    },

    services: {
      className: "",
      headers: [{ label: "", className: "" }],
    },
  },

  technician: {
    tickets: {
      className: "",
      headers: [{ label: "", className: "" }],
    },

    technicians: {
      className: "",
      headers: [{ label: "", className: "" }],
    },

    customers: {
      className: "",
      headers: [{ label: "", className: "" }],
    },

    services: {
      className: "",
      headers: [{ label: "", className: "" }],
    },
  },
} as const;

export function Table({ role, type, className, children, ...rest }: Props) {
  const config = tablesHeaders[role]?.[type];
  if (!config || !config.headers) {
    return (
      <div className="p-4 text-red-500">
        Configuração de tabela não encontrada.
      </div>
    );
  }
  return (
    <div className="border border-gray-500 rounded-[10px] flex flex-col w-full">
      <div
        className={classMerge(
          "py-3.5 text-sm text-gray-400 border-b border-gray-500",
          [config.className, className],
        )}
        {...rest}
      >
        {config.headers.map((header, index) => (
          <span key={index} className={header.className}>
            {header.label}
          </span>
        ))}
      </div>
      {children}
    </div>
  );
}
