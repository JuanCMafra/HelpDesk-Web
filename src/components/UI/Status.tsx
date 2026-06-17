import { classMerge } from "../../utils/classMerge";
import OpenIcon from "../../assets/icons/open.svg?react";
import ClosedIcon from "../../assets/icons/close.svg?react";
import ProgressIcon from "../../assets/icons/in_progress.svg?react";

type Props = React.ComponentProps<"span"> & {
  status: TicketStatus
  variant?: "base" | "icon";
};

const statusConfig = {
  open: {
    icon: OpenIcon,
    label: "Aberto",
    className: "bg-feedback-open/20 text-feedback-open",
  },

  in_progress: {
    icon: ProgressIcon,
    label: "Em atendimento",
    className: "bg-feedback-progress/20 text-feedback-progress",
  },

  close: {
    icon: ClosedIcon,
    label: "Encerrado",
    className: "bg-feedback-done/20 text-feedback-done",
  },
};


export function Status({ status, variant = "base", className }: Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={classMerge(
        "inline-flex items-center justify-center gap-1.5 p-1.5 rounded-full font-bold",
        config.className,
        className
      )
    
    }
      
    >
      <Icon className="w-4 h-4 p-0"/>

      {variant === "base" && (
        <span className="pr-1.5 whitespace-nowrap">{config.label}</span>
      )}
    </span>
  );
}
