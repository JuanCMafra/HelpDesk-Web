import DangerIcon from "../../assets/icons/alert.svg?react";


type Props = React.ComponentProps<"select"> & {
  legend?: string;
  formState?: { message?: string; field?: string } | null;
  alert?: string;
};

export function Select({ legend, children, formState, alert, ...rest }: Props) {
  const activeAlert =
    alert || (formState?.field === rest.name ? formState?.message : undefined);
  return (
    <fieldset className="flex flex-1 flex-col gap-2 max-h-20 text-gray-300 focus-within:text-blue-base focus-within:border-none ">
      {legend && (
        <label className="uppercase text-xxs text-inherit">{legend}</label>
      )}

      <select
        className="h-10 w-full border-b border-gray-500 text-gray-200 placeholder-gray-400  focus-within:border-b-blue-base bg-transparent  focus-within:outline-0"
        {...rest}
      >
        <option value="" disabled hidden>
          Selecione a categoria de atendimento
        </option>

        {children}
      </select>
      {activeAlert && (
        <div className="flex gap-1">
          <DangerIcon className="text-feedback-danger w-4 h-4" />
          <span className="text-xs text-feedback-danger"> {activeAlert} </span>
        </div>
      )}
    </fieldset>
  );
}
