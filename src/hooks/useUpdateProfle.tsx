import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";
import { UserType } from "../lib/types";

type Params = {
  userID: string;
  name?: string;
  bio?: string;
  avatarURL?: string;
};

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...(params.bio ? { bio: params.bio } : {}),
          ...(params.name ? { full_name: params.name } : {}),
          ...(params.avatarURL ? { avatar_url: params.avatarURL } : {}),
        })
        .eq("id", params.userID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: async ({ bio, name, avatarURL }) => {
      await queryClient.cancelQueries({ queryKey: ["userData"] });

      const previousData = queryClient.getQueryData(["userData"]);

      queryClient.setQueryData(["userData"], (oldData: UserType) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          ...(bio ? { bio } : {}),
          ...(name ? { name } : {}),
          ...(avatarURL ? { avatarURL } : {}),
        };
      });

      return { previousData };
    },
    onError: (error, _, context) => {
      if (context?.previousData) {
        // Rollback UI to previous state if failed
        queryClient.setQueryData(["userData"], context.previousData);
      }

      if (error) {
        showToast({
          type: "error",
          message: `Error updating profile:, ${error.message}`,
          toastId: "profileUpdateError",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}
