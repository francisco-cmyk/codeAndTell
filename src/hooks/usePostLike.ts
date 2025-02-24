import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";
import { PostType } from "../lib/types";

type Params = {
  commentID: number;
  hasLiked: boolean;
  key: string[];
  userID: string;
};

export default function usePostLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["comment-like"],
    mutationFn: async (params: Params) => {
      let _error;
      if (!params.hasLiked) {
        const { error } = await supabase.from("comment_likes").insert([
          {
            comment_id: params.commentID,
            user_id: params.userID,
          },
        ]);
        _error = error;
      } else {
        const { error } = await supabase
          .from("comment_likes")
          .delete()
          .eq("comment_id", params.commentID)
          .eq("user_id", params.userID);

        _error = error;
      }

      if (_error) {
        throw new Error(_error.message);
      }
    },
    onMutate: async ({ commentID, key, hasLiked }) => {
      const queryKeyToCancel = key;
      await queryClient.cancelQueries({ queryKey: queryKeyToCancel });

      const previousData = queryClient.getQueryData(queryKeyToCancel);

      queryClient.setQueryData(
        queryKeyToCancel,
        (oldData: PostType | PostType[]) => {
          if (!oldData) return oldData;

          if (Array.isArray(oldData)) {
            return oldData.map((data) => ({
              ...data,
              comments: data.comments.map((comment) => {
                if (comment.id !== commentID) return comment;
                return {
                  ...comment,
                  likeCount: hasLiked
                    ? comment.likeCount - 1
                    : comment.likeCount + 1,
                  userHasLiked: !hasLiked,
                };
              }),
            }));
          } else {
            return {
              ...oldData,
              comments: oldData.comments.map((comment) => {
                if (comment.id !== commentID) return comment;

                return {
                  ...comment,
                  likeCount: hasLiked
                    ? comment.likeCount - 1
                    : comment.likeCount + 1,
                  userHasLiked: !hasLiked,
                };
              }),
            };
          }
        }
      );

      return { previousData };
    },
    onError: (error, variable, context) => {
      if (context?.previousData) {
        // Rollback UI to previous state if failed
        const queryKeyToCancel = variable.key;
        queryClient.setQueryData(queryKeyToCancel, context.previousData);
      }

      if (error) {
        showToast({
          type: "error",
          message: `Error liking the comment:, ${error.message}`,
          toastId: "commentLikingError",
        });
      }
    },
    onSuccess: (_, variable) => {
      const queryKeyToCancel = variable.key;
      queryClient.invalidateQueries({ queryKey: queryKeyToCancel });
    },
  });
}
