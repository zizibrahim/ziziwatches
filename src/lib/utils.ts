import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  amount: number,
  currency: string = "MAD",
  locale: string = "fr-MA"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 9000) + 1000;
  return `ZW-${year}-${random}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function getLocalizedField(
  obj: Record<string, string>,
  field: string,
  locale: string
): string {
  const localeMap: Record<string, string> = {
    fr: "Fr",
    en: "En",
    ar: "Ar",
  };
  const suffix = localeMap[locale] ?? "Fr";
  return obj[`${field}${suffix}`] ?? obj[`${field}Fr`] ?? "";
}
