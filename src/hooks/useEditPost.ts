import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { getDiff, showToast } from "../lib/utils";
import { fetchUserPostByID } from "./useGetPostByID";

type Params = {
  userID: string;
  postID: string;
  title?: string;
  description?: string;
  badges?: string[];
  mediaName?: string[] | null;
  mediaType?: string[] | null;
  mediaSize?: number[] | null;
  mediaSource?: string[] | null;
};

export default function useEditPost() {
  return useMutation({
    mutationKey: ["editPost"],
    mutationFn: async (params: Params) => {
      if (!params.userID) {
        showToast({
          type: "warning",
          message: `Please sign in to edit post`,
          toastId: "editPostError",
        });
        throw new Error("Unauthorized: User must be signed in to submit post.");
      }

      const existingPost = await fetchUserPostByID(
        params.userID,
        params.postID
      );

      const updatedPost = getDiff(
        {
          title: existingPost?.title,
          description: existingPost?.description,
          badges: existingPost?.badges,
          media_source: existingPost?.media_source,
          media_type: existingPost?.media_type,
          media_size: existingPost?.media_size,
          media_name: existingPost?.media_name,
        },
        {
          title: params.title,
          description: params.description,
          badges: params.badges,
          media_source: params.mediaSource,
          media_type: params.mediaType,
          media_size: params.mediaSize,
          media_name: params.mediaName,
        }
      );

      console.log(updatedPost);

      const { error } = await supabase.from("content").update({
        ...updatedPost,
        updated_at: new Date().toISOString(),
        updated_by_id: params.userID,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      console.warn("error", error);
      showToast({
        type: "error",
        message: `Error submitting your post:, ${error.message}`,
        toastId: "editPostError",
      });
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: `Successfully created post!`,
        toastId: "editPostSuccess",
      });
    },
  });
}
