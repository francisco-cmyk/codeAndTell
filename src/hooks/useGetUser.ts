import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z } from "zod";
import { showToast } from "../lib/utils";

const UserSchema = z.object({
  id: z.string(),
  full_name: z.string(),
  avatar_url: z.string(),
  email: z.string(),
});

type UserDBType = z.infer<typeof UserSchema>;

type Params = {
  sessionID: string | undefined;
};

export default function useGetSession(params: Params) {
  return useQuery<UserDBType | undefined, Error>({
    queryKey: ["userData", params.sessionID],
    queryFn: async () => {
      if (!params.sessionID) return undefined;

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", params.sessionID)
        .single();

      if (profileError) {
        showToast({
          type: "error",
          message: `Error fetching profile:, ${profileError.message}`,
          toastId: "fetchProfile",
        });
        throw profileError;
      }

      return profileData;
    },
    enabled: params.sessionID ? params.sessionID.length > 0 : false,
  });
}
