import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const roundUpFormat = (count: number) => {
  if (count < 1000) return count.toString();
  return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
};
