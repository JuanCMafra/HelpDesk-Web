import { API_URL } from "../services/api";
import { classMerge } from "../utils/classMerge";

type Props = {
  avatar?: string;
  name?: string | null;
  className?: string;
  variants: keyof typeof variant;
};

const variant = {
  sm: "w-5 h-5 text-[8.75px]",
  md: "w-7 h-7 text-[12.25px]",
  lg: "w-8 h-8 text-[14px]",
  xlg: "w-10 h-10 text-[14px]",
  xlg2: "w-12 h-12 text-[16px]",
};

export function Profile({ name, avatar, variants = "sm", className }: Props) {
  if (avatar) {
    return (
      <img
        src={`${API_URL}/profile/avatar/${avatar}`}
        alt={name ?? "Avatar"}
        className={classMerge(
          "object-cover rounded-full",
          variant[variants],
          className,
        )}
      />
    );
  }

  if (!name) {
    return null;
  }

  const initials = name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={classMerge(
        "flex items-center justify-center rounded-full bg-blue-dark text-gray-600 leading-none",
        variant[variants],
        className,
      )}
    >
      {initials}
    </div>
  );
}
