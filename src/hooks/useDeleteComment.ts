import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

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
        toast.error(`Error deleting your Comment:, ${error.message}`, {
          toastId: "deleteCommentError",
        });
      }
    },
    onSuccess: () => {
      toast.success(`Successfully deleted the Comment`, {
        toastId: "deleteCommentSuccess",
      });
    },
  });
}
