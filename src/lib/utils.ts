import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";

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

export function formatTimestamp(timestamp: string) {
  return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
}

export function createAcronym(name: string, length = 2) {
  if (!name || typeof name !== "string") {
    return "";
  }

  const words = name.trim().split(/\s+/);
  let acronym = words.map((word) => word[0].toUpperCase()).join("");

  return acronym.slice(0, length);
}
