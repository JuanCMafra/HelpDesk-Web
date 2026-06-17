import type { ComponentProps } from "react";
import { Button } from "./UI/Button";
import CloseIcon from "../assets/icons/x.svg?react";
import BackIcon from "../assets/icons/arrow-left.svg?react";
import clsx from "clsx";

type Props = Omit<ComponentProps<"form">, "action"> & {
  state: boolean;
  setState: (states: boolean) => void;
  backState?: (states: boolean) => void;
  title: string;
  backIcon: boolean;
  isLoading?: boolean;
  onAction?: (payload: FormData) => void;
};

export function PopUp({
  state = false,
  setState,
  children,
  title,
  backIcon = false,
  backState,
  isLoading,
  onAction,
  ...rest
}: Props) {
  return (
    <div
      className={clsx(
        "fixed inset-0 z-60 w-screen h-screen flex items-center justify-center px-4 bg-black/40 transition-opacity duration-450",
        state
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none",
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setState(false);
        }
      }}
    >
      <div
        className={clsx(
          "bg-gray-600 w-full md:max-w-110 h-auto rounded-xl transition-all duration-400 text-gray-200",
          state ? "scale-100 opacity-100" : "scale-80 opacity-0",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-7 py-5 flex items-center justify-between font-bold">
          <div className="text-gray-200 flex items-center justify-center gap-3">
            {backIcon && (
              <BackIcon
                className="text-gray-300 w-7 h-7 p-1 cursor-pointer transition duration-500 ease-in-out hover:bg-gray-500 rounded-full"
                onClick={() => {
                  setState(false);
                  backState?.(true);
                }}
              />
            )}
            <span className="text-md font-bold">{title}</span>
          </div>
          <CloseIcon
            className="w-8 h-8 p-1 cursor-pointer transition duration-500 ease-in-out hover:bg-gray-500 rounded-full"
            onClick={() => setState(false)}
          />
        </header>

        <form action={onAction} {...rest} onClick={(e) => e.stopPropagation()}>
          <div className="flex flex-col justify-baseline border border-gray-500 px-7 pt-7 pb-8 gap-4">
            {children}
          </div>
          <div className="px-7 py-6">
            <Button type="submit" variant="dark" isLoading={isLoading}>
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
