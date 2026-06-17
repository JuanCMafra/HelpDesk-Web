import UploadIcon from "../../assets/icons/upload.svg?react";

type Props = Omit<React.ComponentProps<"input">, "onChange"> & {
  filename?: string | null;
  onChange?: (file: File) => void;
  name?: string;
};

export function Upload({ filename = null, onChange, name, ...rest }: Props) {
  return (
    <label
      htmlFor="upload"
      className="flex items-center justify-center w-full gap-2 h-7 px-2 bg-gray-500 rounded-[5px] cursor-pointer hover:brightness-95 transition duration-300 ease-in-out "
    >
      <UploadIcon className="w-4 h-4 text-gray-200" />
      <input
        type="file"
        id="upload"
        className="hidden"
        name={name}
        {...rest}
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onChange?.(file);
          }
        }}
      />
      <span className="text-xs font-bold text-gray-200 w-full">
        {filename ?? "Nova Imagem"}
      </span>
    </label>
  );
}
