import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { toast } from "react-toastify";

export default function useGetSession() {
  return useQuery<Session | null, Error>({
    queryKey: ["session"],
    queryFn: async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        toast.error(`Error fetching session:, ${sessionError.message}`, {
          toastId: "fetchSession",
        });
      }

      return session;
    },
  });
}
