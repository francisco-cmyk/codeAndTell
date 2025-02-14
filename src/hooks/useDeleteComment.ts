import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";

type Params = {
  commentID: number;
  userID: string;
};

export default function useDeleteComment() {
  return useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", params.commentID)
        .eq("user_id", params.userID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        showToast({
          type: "error",
          message: `Error deleting your Comment:, ${error.message}`,
          toastId: "deleteCommentError",
        });
      }
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: "Successfully deleted the Comment",
        toastId: "deleteCommentSuccess",
      });
    },
  });
}
