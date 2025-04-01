import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";
import { NotificationType } from "../lib/types";

type Params = {
  notifID: number;
  read: boolean;
  userID: string;
};

export default function useUpdateNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["comment-like"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase
        .from("notifications")
        .update({
          read: true,
        })
        .eq("id", params.notifID)
        .eq("user_id", params.userID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: async ({ notifID }) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });

      const previousData = queryClient.getQueryData(["notifications"]);

      queryClient.setQueryData(
        ["notifications"],
        (oldData: NotificationType[]) => {
          if (!oldData) return oldData;

          return oldData.map((data) => {
            if (data.id !== notifID) return data;

            return {
              ...data,
              read: true,
            };
          });
        }
      );

      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        // Rollback UI to previous state if failed
        queryClient.setQueryData(["notifications"], context.previousData);
      }

      if (error) {
        showToast({
          type: "error",
          message: `Error updating notification:, ${error.message}`,
          toastId: "notifUpdateError",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}
