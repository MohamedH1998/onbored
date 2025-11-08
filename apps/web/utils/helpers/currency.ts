export function formatCurrency({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}
