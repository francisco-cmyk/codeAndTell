import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

type Params = {
  email: string;
  password: string;
};

export default function useEmailLogin() {
  return useMutation({
    mutationKey: ["signIn"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });
      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        toast.error(`Error during logging in:, ${error.message}`, {
          toastId: "emailLoginError",
        });
      }
    },
    onSuccess: () => {
      toast.success(`Login was successful`, {
        toastId: "emailLoginSuccess",
      });
    },
  });
}
