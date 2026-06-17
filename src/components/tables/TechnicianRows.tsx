import { Button } from "../UI/Button";
import { Profile } from "../Profile";
import PencilIcon from "../../assets/icons/pencil.svg?react";
import ActiveIcon from "../../assets/icons/done.svg?react";
import CancelIcon from "../../assets/icons/cancel.svg?react";
import { AvailabilityBadges } from "./AvailabilityBadges";

type Props = React.ComponentProps<"ul"> & {
  role: UserAPIRole;
  technicians: TechnicianProfile[];
  deleteTechnician: (id: string) => Promise<void>;
};

export const TECHNICIAN_ROWS_CONFIG = {
  admin: {
    gridClass:
      "grid items-center grid-cols-[1fr_120px_80px] py-3.5 md:grid-cols-[1fr_288px_328px_138px] text-sm text-gray-200",
    cells: [
      {
        className: "md:truncate flex items-center md:inline px-3",
        render: (technician: TechnicianProfile) => (
          <div className="flex items-center gap-3 font-bold truncate">
            <Profile
              variants="md"
              avatar={technician.avatar}
              name={technician.name}
              className="min-w-7 font-medium"
            />
            <span className="truncate">{technician.name}</span>
          </div>
        ),
      },
      {
        className: "hidden truncate px-3 flex items-center md:inline",
        render: (technician: TechnicianProfile) => (
          <span>{technician.email}</span>
        ),
      },
      {
        className: "px-3",
        render: (technician: TechnicianProfile) =>
          technician.availability && (
            <AvailabilityBadges hours={technician.availability} />
          ),
      },
      {
        className: "truncate flex items-center justify-end",
        render: (
          technician: TechnicianProfile,
          deleteTechnician: (id: string) => Promise<void>,
        ) => (
          <div className="flex  items-center gap-2 px-3">
            <Button
              variant="link"
              onClick={() => deleteTechnician(technician.id)}
            >
              {technician.active ? (
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
            <a href={`/technician/${technician.id}`}>
              <Button variant="iconLightSm" className="w-7 h-7">
                <PencilIcon />
              </Button>
            </a>
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
        render: (technician: TechnicianProfile) => (
          <span>Linha não encontrada!</span>
        ),
      },
    ],
  },

  technician: {
    gridClass: "",
    cells: [
      {
        className: "p-10 text-red-500 font-bold text-lg",
        render: (technician: TechnicianProfile) => (
          <span>Linha não encontrada!</span>
        ),
      },
    ],
  },
} as const;

export function TechnicianRows({
  role,
  technicians,
  deleteTechnician,
  ...rest
}: Props) {
  const config = TECHNICIAN_ROWS_CONFIG[role];

  const sortedTechnicians = [...technicians].sort(
    (a, b) => Number(b.active) - Number(a.active),
  );

  return (
    <ul className="divide-y divide-gray-500" {...rest}>
      {sortedTechnicians.map((technician) => (
        <li key={technician.id} className={config.gridClass}>
          {config.cells.map((cell, index) => (
            <div key={index} className={cell.className}>
              {cell.render(technician, deleteTechnician)}
            </div>
          ))}
        </li>
      ))}
    </ul>
  );
}
