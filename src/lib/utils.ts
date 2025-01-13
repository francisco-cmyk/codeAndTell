import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

//For state management in components

export default function getMergeState<State>(
  ss: React.Dispatch<React.SetStateAction<State>>
) {
  return function mergeState(ps: Partial<State>) {
    return ss((s: State) => ({ ...s, ...ps }));
  };
}