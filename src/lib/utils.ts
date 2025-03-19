import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow } from "date-fns";
import { toast, ToastOptions, ToastPosition } from "react-toastify";
import CustomToast from "../components/custom-ui/CustomToast";
import { groupBy, keyBy } from "lodash";

//
// Lowlight language map
//

export const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  html: "html",
  css: "css",
  py: "python",
  rb: "ruby",
  sh: "bash",
  yml: "yaml",
  md: "markdown",
};

//
// ShadCN Styling
//

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

  const defaultPosition = options?.position ?? "bottom-right";
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

//
// User Profiles
//

export function createAcronym(name: string, length = 2) {
  if (!name || typeof name !== "string") {
    return "";
  }

  const words = name.trim().split(/\s+/);
  const acronym = words.map((word) => word[0].toUpperCase()).join("");

  return acronym.slice(0, length);
}

//
// Diffing utility
//

// T - TS generic that works with any input object
// Partial - TS util type that makes input types optional
// Record - TS util type that defines specific types for keys and values with generic
export function getDiff<T extends Record<string, unknown>>(
  original: T,
  updated: T
): Partial<T> {
  return Object.keys(updated).reduce((diff, key) => {
    if (original[key] !== updated[key]) {
      return { ...diff, [key]: updated[key] };
    }
    return diff;
  }, {} as Partial<T>);
}

// Diff array of primitives (not objects)
export function getArrayDiff<T>(
  original: T[],
  updated: T[]
): { added: T[]; removed: T[] } {
  const added = updated.filter((item) => !original.includes(item));
  const removed = original.filter((item) => !updated.includes(item));
  return { added, removed };
}

//
// File Objects
//

export async function urlToFile(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  const mimeType = blob.type;

  return new File([blob], fileName, { type: mimeType });
}

//
// Video Link Format
//

export function getLinkType(link: string): string {
  let type;

  if (link.includes("youtube.com") || link.includes("youtu.be")) {
    // youtu.be is shortened version
    type = "video/youtube";
  } else if (link.includes("vimeo.com")) {
    type = "video/vimeo";
  } else {
    // Extract file extension
    const extensionMatch = link.match(
      /\.(mp4|mov|avi|wmv|flv|webm|mkv)(\?|$)/i
    );

    if (extensionMatch) {
      type = `video/${extensionMatch[1].toLowerCase()}`;
    } else if (link.includes("dailymotion.com")) {
      type = "video/dailymotion";
    } else if (link.includes("tiktok.com")) {
      type = "video/tiktok";
    } else if (link.includes("facebook.com") || link.includes("fb.watch")) {
      type = "video/facebook";
    } else {
      type = "video/unknown"; // Default for unknown sources
    }
  }

  return type;
}

export function getEmbedURL(url: string) {
  const youtubeRegex =
    /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/;
  const vimeoRegex = /vimeo\.com\/(\d+)/;

  const youtubeMatch = url.match(youtubeRegex);
  const vimeoMatch = url.match(vimeoRegex);

  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  } else if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

//
// Nested Comments Formatting
//

type Comment = {
  id: number;
  userID: string;
  content: string;
  createdAt: string;
  likeCount: number;
  parentCommentID: number | null;
  userHasLiked: boolean;
  profile: {
    id: string;
    avatarURL: string;
    name: string;
  };
};

type CommentWithReplies = Comment & { replies: CommentWithReplies[] };

export function buildCommentTree(comments: Comment[]): CommentWithReplies[] {
  if (!comments || comments.length === 0) return [];

  const _comments: CommentWithReplies[] = comments.map((comment) => ({
    ...comment,
    replies: [],
  }));

  const commentMap = keyBy(_comments, "id");
  const groupByParent = groupBy(_comments, "parentCommentID");

  Object.keys(groupByParent).forEach((parentID) => {
    const parentIDNum = parseInt(parentID, 10);
    if (!isNaN(parentIDNum) && commentMap[parentIDNum]) {
      commentMap[parentIDNum].replies = groupByParent[
        parentIDNum
      ] as CommentWithReplies[];
    }
  });

  return (groupByParent.null as CommentWithReplies[]) || [];
}
