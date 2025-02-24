import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";

type Params = {
  userID: string;
  title: string;
  description: string;
  badges: string[];
  getHelp: boolean;
  mediaName: string[] | null;
  mediaType: string[] | null;
  mediaSize: number[] | null;
  mediaSource: string[] | null;
};

export default function useCreatePost() {
  return useMutation({
    mutationKey: ["newPost"],
    mutationFn: async (params: Params) => {
      if (!params.userID) {
        showToast({
          type: "warning",
          message: `Please sign in to post`,
          toastId: "newPostError",
        });
        throw new Error("Unauthorized: User must be signed in to submit post.");
      }

      const { error } = await supabase.from("content").insert([
        {
          created_by_id: params.userID,
          title: params.title,
          description: params.description,
          badges: params.badges,
          getHelp: params.getHelp,
          media_source: params.mediaSource,
          media_type: params.mediaType,
          media_size: params.mediaSize,
          media_name: params.mediaName,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      console.warn("error", error);
      showToast({
        type: "error",
        message: `Error submitting your post:, ${error.message}`,
        toastId: "newPostError",
      });
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: `Successfully created post!`,
        toastId: "newPostSuccess",
      });
    },
  });
}
