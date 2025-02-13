import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z, ZodError } from "zod";
import { toast } from "react-toastify";
import { PostgrestError } from "@supabase/supabase-js";
import { CommentType } from "../lib/types";
import { formatTimestamp } from "../lib/utils";

const defaultName = "Anon";
const defaultAvatar = "public/anon-user.png";

const CommentSchema = z.object({
  id: z.number(),
  post_id: z.string(),
  user_id: z.string(),
  content: z.string(),
  parent_comment_id: z.nullable(z.string()),
  created_at: z.string(),
  profiles: z.object({
    id: z.string(),
    avatar_url: z.nullable(z.string()),
    full_name: z.nullable(z.string()),
  }),
});

type PostDBType = z.infer<typeof CommentSchema>;

async function fetchUserComments(
  userID: string,
  postID: string
): Promise<PostDBType[] | undefined> {
  try {
    const { data } = await supabase
      .from("comments")
      .select(
        `
              id,
              content,
              created_at,
              user_id,
              post_id,
              parent_comment_id,
              profiles!comments_user_id_fkey (
                id,
                full_name,
                avatar_url
          )
        `
      )
      .eq("user_id", userID)
      .eq("post_id", postID)
      .order("created_at", { ascending: false });

    if (data) {
      return data.map((datum) => CommentSchema.parse(datum));
    } else {
      return [];
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      });

      toast.error(`Error was an error retrieving Comments:, ${errorMessages}`, {
        toastId: "fetchUserCommentsError",
      });
    } else {
      const Error = error as PostgrestError;
      toast.error(`Error was an error retrieving Comments:, ${Error.message}`, {
        toastId: "fetchUserCommentsError",
      });
    }
  }
}

type Params = {
  userID: string;
  postID: string;
};

export default function useGetUserCommentByPostID(params: Params) {
  return useQuery<CommentType[], Error>({
    queryKey: ["user-comments", params],
    queryFn: async () => {
      const data = await fetchUserComments(params.userID, params.postID);

      if (!data || data?.length === 0) return [];

      return data.map((datum) => ({
        id: datum.id,
        userID: datum.user_id,
        parentCommentID: datum.parent_comment_id,
        content: datum.content,
        createdAt: formatTimestamp(datum.created_at),
        postID: datum.post_id,
        profile: {
          id: datum.profiles.id,
          avatarURL: datum.profiles.avatar_url ?? defaultAvatar,
          name: datum.profiles.full_name ?? defaultName,
        },
      }));
    },
    enabled: params.postID.length > 0 && params.userID.length > 0,
  });
}
