import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";
import { UserType } from "../lib/types";

type Params = {
  userID: string;
  contactInfo?: string;
};

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateAccount"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...(params.contactInfo ? { avatar_url: params.contactInfo } : {}),
        })
        .eq("id", params.userID);

      if (error) {
        throw new Error(error.message);
      }
    },
    onMutate: async ({ contactInfo }) => {
      await queryClient.cancelQueries({ queryKey: ["userData"] });

      const previousData = queryClient.getQueryData(["userData"]);

      queryClient.setQueryData(["userData"], (oldData: UserType) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          ...(contactInfo ? { contactInfo } : {}),
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
          toastId: "accountUpdateError",
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userData"] });
    },
  });
}