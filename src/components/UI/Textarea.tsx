import DangerIcon from "../../assets/icons/alert.svg?react";

type Props = React.ComponentProps<"textarea"> & {
  legend?: string;
  formState?: { message?: string; field?: string } | null;
  alert?: string;
};

export function TextArea({ legend, formState, alert, ...rest }: Props) {
  const activeAlert =
    alert || (formState?.field === rest.name ? formState?.message : undefined);
  return (
    <fieldset className="flex flex-1 flex-col gap-2 max-h-20 text-gray-300 focus-within:text-blue-base focus-within:border-none ">
      {legend && (
        <label className="uppercase text-xxs text-inherit">{legend}</label>
      )}

      <textarea
        {...rest}
        className="h-10 w-full border-b border-gray-500 placeholder-gray-400 focus-within:border-b-blue-base bg-transparent text-gray-200 focus-within:outline-0 "
        maxLength={150}
        rows={100}
      />

      {activeAlert && (
        <div className="flex gap-1">
          <DangerIcon className="text-feedback-danger w-4 h-4" />
          <span className="text-xs text-feedback-danger"> {activeAlert} </span>
        </div>
      )}
    </fieldset>
  );
}
