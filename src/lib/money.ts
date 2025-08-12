export const parseMoneyStringToNumber = (value: string | null | undefined): number => {
  if (!value) return 0;
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : 0;
};

export const formatCentsToCurrency = (cents: number, currency = "VND"): string => {
  const amount = cents / 100;
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
};


