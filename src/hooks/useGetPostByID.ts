import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z, ZodError } from "zod";
import { formatTimestamp, showToast } from "../lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { SinglePostType } from "../lib/types";
import { SinglePostSchema } from "../lib/schemas";

type PostDBType = z.infer<typeof SinglePostSchema>;

export async function fetchUserPostByID(
  userID: string,
  postID: string
): Promise<PostDBType | undefined> {
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
            media_name
        `
      )
      .eq("created_by_id", userID)
      .eq("id", postID);

    if (data) {
      return SinglePostSchema.parse(data[0]);
    } else {
      [];
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      });

      showToast({
        type: "error",
        message: `Error was an error retrieving post:, ${errorMessages}`,
        toastId: "fetchUserPostError",
      });
    } else {
      const Error = error as PostgrestError;
      showToast({
        type: "error",
        message: `Error was an error retrieving post:, ${Error.message}`,
        toastId: "fetchUserPostError",
      });
    }
  }
}

type Params = {
  userID: string;
  postID: string;
};

export default function useGetUserPostByID(params: Params) {
  return useQuery<SinglePostType, Error>({
    queryKey: ["user-posts-by-id", params],
    queryFn: async () => {
      const data = await fetchUserPostByID(params.userID, params.postID);

      if (!data) {
        showToast({
          type: "error",
          message: `No post found`,
          toastId: "fetchUserPostError",
        });
        throw new Error("Error: no post found.");
      }

      const post = {
        id: data.id,
        createdAt: formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? formatTimestamp(data.updated_at) : null,
        createdById: data.created_by_id,
        updatedById: data.updated_by_id,
        title: data.title,
        description: data.description,
        badges: data.badges,
        mediaSource: data.media_source ?? [],
        mediaSize: data.media_size ?? [],
        mediaName: data.media_name ?? [],
        mediaType: data.media_type ?? [],
        mediaUrl: [],
      };

      const postWithMedia = await (async () => {
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

        return { ...post, mediaUrl: publicUrls };
      })(); // self invoking function

      return postWithMedia;
    },
    enabled: params.userID.length > 0 && params.postID.length > 0,
  });
}
