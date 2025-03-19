import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";
import { PostType } from "../lib/types";

type Params = {
  postID: string;
  userID: string;
  content: string;
  parentCommentID?: number;
  key?: string[];
};

export default function usePostComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["commment"],
    mutationFn: async (params: Params) => {
      const { data, error } = await supabase
        .from("comments")
        .insert([
          {
            post_id: params.postID,
            user_id: params.userID,
            content: params.content,
            parent_comment_id: params.parentCommentID ?? null,
          },
        ])
        .select("*")
        .single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
    onMutate: async ({ postID, userID, content, parentCommentID }) => {
      await queryClient.cancelQueries({ queryKey: ["user-posts-by-id"] });
      const previousData = queryClient.getQueryData(["user-posts-by-id"]);

      const tempID = Date.now() - 1;
      const newComment = {
        id: tempID,
        userID,
        content,
        postID,
        parentCommentID,
      };

      queryClient.setQueryData(["user-posts-by-id"], (oldData: PostType) => {
        if (!oldData || !oldData.comments) return oldData || { comments: [] };

        return {
          ...oldData,
          comments: [...oldData.comments, newComment],
        };
      });

      return { previousData, tempID };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["user-posts-by-id"], context.previousData);
      }
      if (error) {
        showToast({
          type: "error",
          message: `Error submitting your comment:, ${error.message}`,
          toastId: "postCommentError",
        });
      }
    },
    onSuccess: async (data, _, context) => {
      if (!data.id) return;

      const { tempID } = context;

      queryClient.setQueryData(["user-posts-by-id"], (oldData: PostType) => {
        if (!oldData || !oldData.comments) return oldData;

        return {
          ...oldData,
          comments: oldData.comments.map((comment) =>
            comment.id === tempID ? { ...comment, id: data.id } : comment
          ),
        };
      });

      await queryClient.invalidateQueries({
        queryKey: ["user-posts-by-id"],
      });
    },
  });
}
