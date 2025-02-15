import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { Provider } from "@supabase/supabase-js";
import { showToast } from "../lib/utils";

export default function useAuthLogin() {
  return useMutation({
    mutationKey: ["authLogin"],
    mutationFn: async (provider: Provider) => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider, // Example: 'google', 'github', etc
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        showToast({
          type: "error",
          message: `Error during OAuth login::, ${error.message}`,
          toastId: "OauthLoginError",
        });
      }
    },
    onSuccess: () => {
      showToast({
        type: "success",
        message: "`OAuth login successful",
        toastId: "OauthLoginSuccess",
      });
    },
  });
}
