import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";
import { Provider } from "@supabase/supabase-js";

export default function useAuthLogin() {
  return useMutation({
    mutationKey: ["authLogin"],
    mutationFn: async (provider: Provider) => {
      await supabase.auth.signInWithOAuth({
        provider: provider, // Example: 'google', 'github', etc
      });
    },
    onError: (error) => {
      if (error) {
        toast.error(`Error during OAuth login::, ${error.message}`, {
          toastId: "OauthLoginError",
        });
      }
    },
    onSuccess: () => {
      toast.success(`OAuth login successful`, {
        toastId: "OauthLoginSuccess",
      });
    },
  });
}
