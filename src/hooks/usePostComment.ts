import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";

type Params = {
  postID: string;
  userID: string;
  content: string;
  parentCommentID?: number;
  key: string[];
};

export default function usePostComment() {
  return useMutation({
    mutationKey: ["commment"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase.from("comments").insert([
        {
          post_id: params.postID,
          user_id: params.userID,
          content: params.content,
          parent_comment_id: params.parentCommentID ?? null,
        },
      ]);
      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        showToast({
          type: "error",
          message: `Error submitting your comment:, ${error.message}`,
          toastId: "postCommentError",
        });
      }
    },
    // onSuccess: (_, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: [variables.key],
    //   });
    // },
    // onSettled: (_, _1, variables) => {
    //   queryClient.invalidateQueries({
    //     queryKey: [variables.key],
    //   });
    // },
  });
}
