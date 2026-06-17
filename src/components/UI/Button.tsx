import { classMerge } from "../../utils/classMerge";

type Props = React.ComponentProps<"button"> & {
  isLoading?: boolean;
  variant?: keyof typeof variants.button;
};

const variants = {
  button: {
    dark: "bg-gray-200 text-gray-600 hover:bg-gray-100",
    light: "bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100",
    darkSm: "bg-gray-200 text-gray-600 hover:bg-gray-100 p-[5.5px] w-auto",
    lightSm:
      "bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100 p-[5.5px] w-auto",
    link: "bg-transparent text-gray-300 hover:text-gray-100 hover:bg-gray-500 p-1",
    iconLightSm:
      "bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100 p-[7px] w-auto",
    iconLightLg:
      "bg-gray-500 text-gray-200 hover:bg-gray-400 hover:text-gray-100 p-[11px] w-auto",
    iconDarkSm: "bg-gray-200 text-gray-600 hover:bg-gray-100 p-[7px] w-auto",
    iconDarkLg: "bg-gray-200 text-gray-600 hover:bg-gray-100 p-[11px] w-auto",
  },
};

export function Button({
  children,
  isLoading,
  className,
  variant = "dark",
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={isLoading}
      className={classMerge([
        "flex items-center justify-center w-full py-2.5 rounded-md hover:cursor-pointer disabled:opacity-50 disabled:cursor-progress transition duration-400 ease-in-out",
        variants.button[variant],
        className,
      ])}
      {...rest}
    >
      {children}
    </button>
  );
}
