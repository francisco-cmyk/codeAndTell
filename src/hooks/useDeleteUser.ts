import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";

type Params = {
  userID: string;
};

export default function useDeleteUser() {
  return useMutation({
    mutationKey: ["deleteUser"],
    mutationFn: async (params: Params) => {
      //NOTE: This won't delete in authentication table - needs an edge function
      const { error } = await supabase.rpc("delete_user_data", {
        user_id: params.userID,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        showToast({
          type: "error",
          message: `Error deleting user:, ${error.message}`,
          toastId: "deleteUserError",
        });
      }
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: "Successfully deleted the user",
        toastId: "deleteUserSuccess",
      });
    },
  });
}
