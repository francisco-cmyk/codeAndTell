import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

type Params = {
  postID: string;
  userID: string;
  content: string;
  parentCommentID?: string;
};

export default function usePostComment() {
  return useMutation({
    mutationKey: ["commment"],
    mutationFn: async (params: Params) => {
      await supabase.from("comments").insert([
        {
          post_id: params.postID,
          user_id: params.userID,
          content: params.content,
        },
      ]);
    },
    onError: (error) => {
      if (error) {
        toast.error(`Error submitting your comment:, ${error.message}`, {
          toastId: "postCommentError",
        });
      }
    },
    onSuccess: () => {},
  });
}
