type Props = {
  value: string;
  setPrice: (values: number) => void;
};

export function handlePriceChange({ value, setPrice }: Props) {
  const numbers = value.replace(/\D/g, "");

  setPrice(numbers ? Number(numbers) / 100 : 0);
}
