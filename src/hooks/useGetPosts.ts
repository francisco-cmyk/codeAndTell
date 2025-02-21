import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z, ZodError } from "zod";
import { formatTimestamp, showToast } from "../lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { MediaType, PostType } from "../lib/types";
import { PostSchema } from "../lib/schemas";

const defaultName = "Anon";
const defaultAvatar = "public/anon-user.png";

type PostDBType = z.infer<typeof PostSchema>;

async function fetchPosts(): Promise<PostDBType[] | undefined> {
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
            ),
            comments!post_id (
              id,
              content,
              created_at,
              user_id,
              parent_comment_id,
              profiles!comments_user_id_fkey (
                id,
                full_name,
                avatar_url
              )
            )
        `
      )
      .order("created_at", { ascending: false });

    if (data) {
      return data.map((datum) => PostSchema.parse(datum));
    } else {
      return [];
    }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.issues.map((issue) => {
        return `${issue.path.join(".")}: ${issue.message}`;
      });

      console.warn("error", error);
      showToast({
        type: "error",
        message: `Error was an error retrieving posts:, ${errorMessages}`,
        toastId: "fetchUserPostsError",
      });
    } else {
      const Error = error as PostgrestError;
      showToast({
        type: "error",
        message: `Error was an error retrieving posts:, ${Error.message}`,
        toastId: "fetchUserPostsError",
      });
    }
  }
}

export default function useGetPosts() {
  return useQuery<PostType[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const data = await fetchPosts();

      const posts = (data ?? []).map((datum) => ({
        id: datum.id,
        createdAt: formatTimestamp(datum.created_at),
        updatedAt: datum.updated_at,
        createdById: datum.created_by_id ?? "",
        updatedById: datum.updated_by_id,
        title: datum.title ?? "",
        description: datum.description ?? "",
        badges: datum.badges ?? [],
        media: [],
        profile: {
          id: datum.profiles.id,
          avatarURL: datum.profiles.avatar_url ?? defaultAvatar,
          name: datum.profiles.full_name ?? defaultName,
        },
        comments: datum.comments.map((comment) => ({
          id: comment.id,
          userID: comment.user_id,
          parentCommentID: comment.parent_comment_id,
          content: comment.content,
          createdAt: formatTimestamp(comment.created_at ?? ""),
          profile: {
            id: comment.profiles.id,
            avatarURL: comment.profiles.avatar_url ?? defaultAvatar,
            name: comment.profiles.full_name ?? defaultName,
          },
        })),
      }));

      const mediaByPostId: Map<string, MediaType[]> = new Map();

      (data ?? []).forEach((datum) => {
        const { media_source, media_size, media_name, media_type, id } = datum;

        if (!media_source) return;

        const mediaItems = media_source.map((source, index) => ({
          mediaSource: source ?? "",
          mediaSize: media_size?.[index] ?? 0,
          mediaName: media_name?.[index] ?? "",
          mediaType: media_type?.[index] ?? "",
          mediaUrl: "",
        }));

        mediaByPostId.set(id, mediaItems);
      });

      const postsWithMedia = await Promise.all(
        posts.map(async (post) => {
          const mediaForPost = mediaByPostId.get(post.id) || [];

          if (mediaForPost.length === 0) {
            return { ...post, media: [] };
          }

          const publicUrls = await Promise.all(
            mediaForPost.map(async (mediaItem) => {
              const path = mediaItem.mediaSource.trim().toLowerCase();
              const { data } = await supabase.storage
                .from("media")
                .getPublicUrl(path);
              return data.publicUrl;
            })
          );

          const updatedMedia = mediaForPost.map((mediaItem, index) => ({
            ...mediaItem,
            mediaUrl: publicUrls[index],
          }));

          return { ...post, media: updatedMedia };
        })
      );

      return postsWithMedia;
    },
  });
}
