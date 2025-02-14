import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";

type Params = {
  postID: string;
  userID: string;
};

export default function useDeletePost() {
  return useMutation({
    mutationKey: ["deletePost"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase
        .from("content")
        .delete()
        .eq("id", params.postID)
        .eq("created_by_id", params.userID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        showToast({
          type: "error",
          message: `Error deleting your post:, ${error.message}`,
          toastId: "deletePostError",
        });
      }
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: "Successfully deleted the post",
        toastId: "deletePostSuccess",
      });
    },
  });
}
