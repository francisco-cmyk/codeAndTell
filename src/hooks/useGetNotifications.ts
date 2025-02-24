import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z } from "zod";
import { showToast } from "../lib/utils";
import { NotificationType } from "../lib/types";

const defaultName = "Anon";
const defaultAvatar = "public/anon-user.png";

const NotificationSchema = z.object({
  id: z.number(),
  user_id: z.string(),
  post_id: z.string(),
  comment_id: z.number(),
  type: z.string(),
  read: z.boolean(),
  created_at: z.string(),
  created_by_id: z.string(),
  profile: z.object({
    id: z.string(),
    avatar_url: z.nullable(z.string()),
    full_name: z.nullable(z.string()),
  }),
});

type Params = {
  userID: string;
};

async function fetchNotifications(userID: string) {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `*,
        profile:profiles (id, full_name, avatar_url)`
      )
      .eq("user_id", userID);

    if (error) {
      throw error;
    }

    return data.map((datum) => NotificationSchema.parse(datum));
  } catch (error) {
    showToast({
      type: "error",
      message: `Error fetching notifications:, ${error}`,
      toastId: "notifFetchError",
    });
  }
}

export default function useGetNotifications(params: Params) {
  return useQuery<NotificationType[] | undefined, Error>({
    queryKey: ["notifications", params.userID],
    queryFn: async () => {
      if (!params.userID) return undefined;

      const notifications = await fetchNotifications(params.userID);

      return (notifications ?? []).map((notification) => ({
        id: notification.id,
        userID: notification.user_id,
        postID: notification.post_id,
        commentID: notification.comment_id,
        type: notification.type,
        read: notification.read,
        createdAt: notification.created_at,
        createdByID: notification.created_by_id,
        profile: {
          id: notification.profile.id,
          name: notification.profile.full_name ?? defaultName,
          avatarURL: notification.profile.avatar_url ?? defaultAvatar,
        },
      }));
    },
    enabled: params.userID ? params.userID.length > 0 : false,
  });
}
