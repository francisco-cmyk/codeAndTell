import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

export default function useSignout() {
  return useMutation({
    mutationKey: ["signout"],
    mutationFn: async () => {
      await supabase.auth.signOut();
    },
    onError: (error) => {
      if (error) {
        toast.error(`Error signing out:, ${error.message}`, {
          toastId: "logoutError",
        });
      }
    },
    onSuccess: () => {
      toast.success(`Successfully signed out`, {
        toastId: "logoutSuccess",
      });
    },
  });
}
