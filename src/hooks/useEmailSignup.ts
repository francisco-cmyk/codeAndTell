import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

type Params = {
  name: string;
  email: string;
  password: string;
};

export default function useEmailSignup() {
  return useMutation({
    mutationKey: ["signUp"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      if (error) {
        toast.error(`Error during sign up:, ${error.message}`, {
          toastId: "emailSignupError",
        });
      }
    },
    onSuccess: () => {
      toast.success(`Sign up was successful`, {
        toastId: "emailSignupSuccess",
      });
    },
  });
}
