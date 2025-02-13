import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

type Params = {
  userID: string;
  title: string;
  description: string;
  badges: string[];
};

export default function useNewPost() {
  return useMutation({
    mutationKey: ["newPost"],
    mutationFn: async (params: Params) => {
      const { error } = await supabase.from("content").insert([
        {
          created_by_id: params.userID,
          title: params.title,
          description: params.description,
          badges: params.badges,
        },
      ]);

      if (error) {
        throw new Error(error.message);
      }
    },
    onError: (error) => {
      console.warn("error", error);
      toast.error(`Error submitting your post:, ${error.message}`, {
        toastId: "newPostError",
      });
    },
    onSuccess: () => {},
  });
}
