import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z } from "zod";
import { buildCommentTree, formatTimestamp, showToast } from "../lib/utils";
import { PostgrestError } from "@supabase/supabase-js";
import { PostSchema } from "../lib/schemas";
import { PostType } from "../lib/types";
import { postQuery } from "../lib/queries";
import { fetchUser } from "./useGetUserBasic";

const defaultName = "Anon";
const defaultAvatar = "public/anon-user.png";

type PostDBType = z.infer<typeof PostSchema>;

export async function fetchUserPostByID(
  postID: string,
  userID?: string
): Promise<PostDBType | undefined> {
  try {
    let query = supabase.from("content").select(postQuery).eq("id", postID);

    if (userID) {
      query = query.eq("created_by_id", userID);
    }

    const { data } = await query;

    if (data) {
      return PostSchema.parse(data[0]);
    } else {
      [];
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        let errorMessage;

        if (err.path.length === 0) {
          errorMessage = `Invalid input: ${err.message}`;
        } else {
          errorMessage = `${err.path.join(".")} - ${err.message}`;
        }

        showToast({
          type: "error",
          message: `Validation error - ${errorMessage}`,
          toastId: "fetchUserPostZodError",
        });
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
  postID: string;
  userID?: string;
};

export default function useGetUserPostByID(params: Params) {
  return useQuery<PostType, Error>({
    queryKey: ["user-posts-by-id", params],
    queryFn: async () => {
      const data = await fetchUserPostByID(params.postID, params.userID);
      const userDB = await fetchUser();

      const user = userDB ? userDB.id : params.userID;

      if (!data) {
        showToast({
          type: "error",
          message: `No post found`,
          toastId: "fetchUserPostError",
        });
        throw new Error("Error: no post found.");
      }

      let post = {
        id: data.id,
        createdAt: formatTimestamp(data.created_at),
        updatedAt: data.updated_at ? formatTimestamp(data.updated_at) : null,
        createdById: data.created_by_id ?? "",
        updatedById: data.updated_by_id,
        title: data.title ?? "",
        description: data.description ?? "",
        badges: data.badges ?? [],
        getHelp: data.getHelp ?? false,
        media: (data.media_source ?? []).map((source, index) => ({
          mediaSource: source ?? "",
          mediaSize: data.media_size ? data.media_size[index] : 0,
          mediaName: data.media_name ? data.media_name[index] : "",
          mediaType: data.media_type ? data.media_type[index] : "",
          mediaUrl: "",
        })),
        profile: {
          id: data.profiles.id,
          avatarURL: data.profiles.avatar_url ?? defaultAvatar,
          name: data.profiles.full_name ?? defaultName,
        },
        commentCount: data.comments.length ?? 0,
        comments: data.comments.map((comment) => ({
          id: comment.id,
          userID: comment.user_id,
          parentCommentID: comment.parent_comment_id,
          content: comment.content,
          createdAt: formatTimestamp(comment.created_at),
          likeCount: comment.like_count[0].count ?? 0,
          userHasLiked: comment.users_liked.some(
            (like) => like.user_id === user
          ),
          profile: {
            id: comment.profiles.id,
            avatarURL: comment.profiles.avatar_url ?? defaultAvatar,
            name: comment.profiles.full_name ?? defaultName,
          },
        })),
      };

      post = { ...post, comments: buildCommentTree(post.comments) };

      const postWithMedia = await (async () => {
        if (post.media.length === 0) {
          return { ...post, media: [] };
        }

        const publicUrls = await Promise.all(
          post.media.map(async (mediaItem) => {
            let path = mediaItem.mediaSource;
            path = path.trim().toLowerCase();
            const { data } = await supabase.storage
              .from("media")
              .getPublicUrl(path);

            return data.publicUrl;
          })
        );

        const mediaWithURLs = post.media.map((mediaItem, index) => ({
          ...mediaItem,
          mediaUrl: publicUrls[index],
        }));

        return { ...post, media: mediaWithURLs };
      })(); // self invoking function

      return postWithMedia;
    },
    enabled: params.postID.length > 0,
  });
}
