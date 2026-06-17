import { useEffect, useState } from "react";
import type { FormState } from "../utils/formState";

import CorrectIcon from "../assets/icons/correct.svg?react";
import DangerIcon from "../assets/icons/alert.svg?react";

type Props = React.ComponentProps<"div"> & {
  message: FormState | null;
};

export function AlertMessage({ message, ...rest }: Props) {
  const [visible, setVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!message?.message) {
      setVisible(false);
      setShouldRender(false);
      return;
    }

    setShouldRender(true);
    setVisible(true);

    const hideTimer = window.setTimeout(() => {
      setVisible(false);
    }, 3000);

    const unrenderTimer = window.setTimeout(() => {
      setShouldRender(false);
    }, 3300);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(unrenderTimer);
    };
  }, [message]);

  if (!shouldRender) {
    return null;
  }

  const className = [
    rest.className,
    "transition-opacity duration-300 ease-out",
    visible ? "opacity-100" : "opacity-0",
  ]
    .filter(Boolean)
    .join(" ");

  const isErrorMessage = message?.field === "network" || message?.field === "server";
  const isConfirmMessage = message?.field === "confirm";

  return (
    <div {...rest} className={className}>
      {isErrorMessage && (
        <div className="flex items-center justify-center gap-1">
          <DangerIcon className="text-feedback-danger w-4 h-4" />
          <span className="w-auto text-xs text-feedback-danger ">
            {message?.message}
          </span>
        </div>
      )}

      {isConfirmMessage && (
        <div className="flex items-center justify-center gap-1">
          <CorrectIcon className="text-feedback-done w-4 h-4" />
          <span className="w-auto text-xs text-feedback-done ">
            {message.message}
          </span>
        </div>
      )}
    </div>
  );
}
