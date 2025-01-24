import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z, ZodError } from "zod";
import { formatTimestamp } from "../lib/utils";
import { toast } from "react-toastify";
import { PostgrestError } from "@supabase/supabase-js";
import { PostType } from "../lib/types";

const PostSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.nullable(z.string()),
  created_by_id: z.nullable(z.string()),
  updated_by_id: z.nullable(z.string()),
  title: z.nullable(z.string()),
  description: z.nullable(z.string()),
  badges: z.nullable(z.array(z.string())), // Shouldn't be nullable and limit ?
  media_source: z.nullable(z.array(z.string())),
  media_size: z.nullable(z.number()),
  media_name: z.nullable(z.string()),
  media_type: z.nullable(z.string()),
  profiles: z.object({
    id: z.string(),
    avatar_url: z.string(),
    full_name: z.string(),
  }),
});

type PostDBType = z.infer<typeof PostSchema>;

async function fetchUserPosts(
  userID: string
): Promise<PostDBType[] | undefined> {
  try {
    const { data } = await supabase
      .from("content")
      .select(
        `
            id,
            created_at,
            updated_at,
            created_by_id,
            updated_by_id,
            title,
            description,
            badges,
            media_source,
            media_type,
            media_size,
            media_name,
            profiles (
                id,
                full_name,
                avatar_url
            )
        `
      )
      .eq("created_by_id", userID);

    if (data) {
      return data.map((datum) => PostSchema.parse(datum));
    } else {
      [];
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      });

      toast.error(`Error was an error retrieving posts:, ${errorMessages}`, {
        toastId: "fetchUserPostsError",
      });
    } else {
      const Error = error as PostgrestError;
      toast.error(`Error was an error retrieving posts:, ${Error.message}`, {
        toastId: "fetchUserPostsError",
      });
    }
  }
}

type Params = {
  userID: string;
};

export default function useGetUserPosts(params: Params) {
  return useQuery<PostType[], Error>({
    queryKey: ["user-posts", params],
    queryFn: async () => {
      const data = await fetchUserPosts(params.userID);

      const posts = (data ?? []).map((datum) => ({
        id: datum.id,
        createdAt: formatTimestamp(datum.created_at),
        updatedAt: datum.updated_at,
        createdById: datum.created_by_id,
        updatedById: datum.updated_by_id,
        title: datum.title,
        description: datum.description,
        badges: datum.badges ?? [],
        mediaSource: datum.media_source ?? [],
        mediaSize: datum.media_size ?? 0,
        mediaName: datum.media_name ?? "None",
        mediaType: datum.media_type ?? "None",
        mediaUrl: [],
        profile: {
          id: datum.profiles.id,
          avatarURL: datum.profiles.avatar_url,
          name: datum.profiles.full_name,
        },
      }));

      const postsWithMedia = await Promise.all(
        posts.map(async (post) => {
          if (!post.mediaSource) {
            return { ...post, mediaUrl: [] };
          }

          const publicUrls = await Promise.all(
            post.mediaSource.map(async (path) => {
              path = path.trim().toLowerCase();
              const { data } = await supabase.storage
                .from("media")
                .getPublicUrl(path);

              return data.publicUrl;
            })
          );

          return {
            ...post,
            mediaUrl: publicUrls,
          };
        })
      );

      return postsWithMedia;
    },
    enabled: params.userID.length > 0,
  });
}
