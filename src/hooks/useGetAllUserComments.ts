import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z, ZodError } from "zod";
import { PostgrestError } from "@supabase/supabase-js";
import { CommentType } from "../lib/types";
import { formatTimestamp, showToast } from "../lib/utils";

const defaultName = "Anon";
const defaultAvatar = "public/anon-user.png";

const CommentSchema = z.object({
  id: z.number(),
  post_id: z.string(),
  user_id: z.string(),
  comment_text: z.string(),
  parent_comment_id: z.nullable(z.number()),
  created_at: z.string(),
  profiles: z.object({
    //User profile
    id: z.string(),
    avatar_url: z.nullable(z.string()),
    full_name: z.nullable(z.string()),
  }),
  post: z.object({
    created_at: z.string(),
    created_by_id: z.string(),
    description: z.string(),
    id: z.string(),
    title: z.string(),
    author: z.object({
      id: z.string(),
      avatar_url: z.nullable(z.string()),
      full_name: z.nullable(z.string()),
    }),
  }),
});

type PostDBType = z.infer<typeof CommentSchema>;

async function fetchUserComments(
  userID: string
): Promise<PostDBType[] | undefined> {
  try {
    const { data } = await supabase
      .from("comments")
      .select(
        `
              id,
              comment_text:content,
              created_at,
              user_id,
              post_id,
              parent_comment_id,
              profiles!comments_user_id_fkey (
                id,
                full_name,
                avatar_url
            ),
            post:content!comments_post_id_fkey (
                id,
                created_by_id,
                title,
                description,
                created_at,
                author:profiles!content_created_by_id_fkey (
                  id,
                  full_name,
                  avatar_url
               )
            )
        `
      )
      .eq("user_id", userID)
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

      showToast({
        type: "error",
        message: `Error was an error retrieving Comments:, ${errorMessages}`,
        toastId: "fetchUserCommentsError",
      });
    } else {
      const Error = error as PostgrestError;

      showToast({
        type: "error",
        message: `Error was an error retrieving Comments:, ${Error.message}`,
        toastId: "fetchUserCommentsError",
      });
    }
  }
}

type Params = {
  userID: string;
  postID: string;
};

export default function useGetAllUserComments(params: Params) {
  return useQuery<CommentType[], Error>({
    queryKey: ["user-all-comments", params],
    queryFn: async () => {
      const data = await fetchUserComments(params.userID);

      if (!data || data?.length === 0) return [];

      return data.map((datum) => ({
        id: datum.id,
        userID: datum.user_id,
        parentCommentID: datum.parent_comment_id,
        content: datum.comment_text,
        createdAt: formatTimestamp(datum.created_at),
        postID: datum.post_id,
        profile: {
          id: datum.profiles.id,
          avatarURL: datum.profiles.avatar_url ?? defaultAvatar,
          name: datum.profiles.full_name ?? defaultName,
        },
        post: {
          createdAt: formatTimestamp(datum.post.created_at),
          description: datum.post.description,
          id: datum.post.id,
          title: datum.post.title,
          author: {
            id: datum.post.author.id,
            avatarURL: datum.post.author.avatar_url ?? defaultAvatar,
            name: datum.post.author.full_name ?? defaultName,
          },
        },
      }));
    },
    enabled: params.userID.length > 0 && params.postID.length === 0,
  });
}
