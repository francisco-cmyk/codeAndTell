import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { showToast } from "../lib/utils";

export default function useSignout() {
  return useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => {
      await supabase.auth.signOut();
    },
    onError: (error) => {
      if (error) {
        showToast({
          type: "error",
          message: `Error signing out:, ${error.message}`,
          toastId: "logoutError",
        });
      }
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: `Successfully signed out`,
        toastId: "logoutSuccess",
      });
    },
  });
}
