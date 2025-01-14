import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

//For state management in components

export default function getMergeState<State>(
  ss: React.Dispatch<React.SetStateAction<State>>
) {
  return function mergeState(ps: Partial<State>) {
    return ss((s: State) => ({ ...s, ...ps }));
  };
}

export function formatDateToDMY(timestamp: Date) {
  const date = new Date(timestamp);

  // Extract day, month, and year
  const day = String(date.getUTCDate()).padStart(2, "0"); // Ensure 2 digits
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const year = date.getUTCFullYear();

  // Return formatted string
  return `${day}/${month}/${year}`;
}
