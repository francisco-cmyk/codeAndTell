import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { getDiff, showToast } from "../lib/utils";
import { fetchUserPostByID } from "./useGetPostByID";

type Params = {
  userID: string
  postID: string
  getHelp: boolean
};

export default function useResolveHelpPost() {
  return useMutation({
    mutationKey: ["resolveHelpPost"],
    mutationFn: async (params: Params) => {
      if (!params.userID) {
        showToast({
          type: "warning",
          message: `Please sign in to resolve help post`,
          toastId: "resolveHelpPostError",
        });
        throw new Error("Unauthorized: User must be signed in to resolve help post.");
      }

      const existingPost = await fetchUserPostByID(
        params.userID,
        params.postID
      );

      const updatedPost = getDiff(
        {
          getHelp: existingPost?.getHelp
        },
        {
          getHelp: params.getHelp
        }
      );

      const { error } = await supabase
        .from("content")
        .update({
          ...updatedPost,
          updated_at: new Date().toISOString(),
          updated_by_id: params.userID,
        })
        .eq("id", params.postID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      console.warn("error", error);
      showToast({
        type: "error",
        message: `Error submitting your post edit:, ${error.message}`,
        toastId: "resolveHelpPostError",
      });
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: `Successfully resolved post!`,
        toastId: "resolveHelpPostSuccess",
      });
    },
  });
}