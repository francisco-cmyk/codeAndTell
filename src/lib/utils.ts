import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { Tags } from "./types";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";
import { toast, ToastOptions, ToastPosition } from "react-toastify";
import CustomToast from "../components/custom-ui/CustomToast";

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

// React Toastify Util

type ShowToastParams = {
  type: "success" | "error" | "warning" | "info";
  message: string;
  toastId?: string;
  position?: ToastPosition;
  options?: ToastOptions;
};

export function showToast({
  type,
  message,
  toastId,
  options,
}: ShowToastParams) {
  const baseClass = `custom-toast`;

  const typeClass = {
    success: "custom-toast-success",
    error: "custom-toast-error",
    warning: "custom-toast-warning",
    info: "custom-toast-info",
  };

  const defaultPosition = options?.position ?? "top-right";
  const toastContent: { title: string; content: string } = {
    title: type,
    content: message,
  };

  toast[type](CustomToast, {
    ...options,
    data: toastContent,
    className: `${baseClass} ${typeClass[type]}`,
    toastId: toastId,
    position: defaultPosition,
  });
}

// Format time

export function formatTimestamp(timestamp: string) {
  if (!timestamp) return "";

  const utcDate = new Date(timestamp);
  const localTime = new Date(
    utcDate.toLocaleString("en-US", {
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })
  );
  return formatDistanceToNow(localTime, { addSuffix: true });
}

export function createAcronym(name: string, length = 2) {
  if (!name || typeof name !== "string") {
    return "";
  }

  const words = name.trim().split(/\s+/);
  let acronym = words.map((word) => word[0].toUpperCase()).join("");

  return acronym.slice(0, length);
}

export const tagList: Tags[] = [
  { value: "discrod", label: "discrod", icon: Turtle },
  { value: "torture", label: "torture", icon: Cat },
  { value: "fun", label: "fun", icon: Dog },
  { value: "easy", label: "easy", icon: Rabbit },
  { value: "dev hell", label: "dev hell", icon: Fish },
];
