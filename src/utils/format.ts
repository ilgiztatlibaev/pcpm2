export function formatMoney(value: number, currency: string = "RUB") {
  if (Number.isNaN(value)) return "0";
  try {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

export function parseNumber(input: string): number {
  const normalized = input.replace(/[^0-9.,-]/g, "").replace(",", ".");
  const num = Number(normalized);
  return Number.isFinite(num) ? num : 0;
}


