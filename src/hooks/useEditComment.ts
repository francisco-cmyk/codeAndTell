import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

type Params = {
  commentID: number;
  userID: string;
  commentText: string;
};

export default function useEditComment() {
  return useMutation({
    mutationKey: ["editComment"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase
        .from("comments")
        .update({ content: params.commentText })
        .eq("id", params.commentID)
        .eq("user_id", params.userID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        toast.error(`Error updating your Comment:, ${error.message}`, {
          toastId: "updateCommentError",
        });
      }
    },
    onSuccess: () => {
      toast.success(`Successfully updated the Comment`, {
        toastId: "updateCommentSuccess",
      });
    },
  });
}
