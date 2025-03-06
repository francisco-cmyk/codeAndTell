import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z } from "zod";
import { showToast } from "../lib/utils";
import { UserType } from "../lib/types";
import { format } from "date-fns";

const MetaDataSchema = z.nullable(
  z.object({
    app_metadata: z.object({
      provider: z.string(),
      providers: z.array(z.string()),
    }),
    identities: z.array(
      z.object({
        created_at: z.string(),
        email: z.string(),
        id: z.string(),
        identity_id: z.string(),
        identity_data: z.object({
          email: z.string(),
          email_verified: z.boolean(),
          phone_verified: z.boolean(),
          name: z.optional(z.string()), // Optional
          preferred_username: z.optional(z.string()), // optional
          user_name: z.optional(z.string()), // optional
        }),
        last_sign_in_at: z.string(),
        provider: z.string(),
        updated_at: z.string(),
        user_id: z.string(),
      })
    ),
    is_anonymous: z.boolean(),
    last_sign_in_at: z.string(),
    phone: z.string(),
    role: z.string(),
  })
);

type MetaData = z.infer<typeof MetaDataSchema>;

async function fetchUserMetadata(): Promise<MetaData | undefined> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return MetaDataSchema.parse(user);
}

type Params = {
  sessionID: string | undefined;
};

export default function useGetUser(params: Params) {
  return useQuery<UserType | undefined, Error>({
    queryKey: ["userData", params.sessionID],
    queryFn: async () => {
      if (!params.sessionID) return undefined;

      const userWithMetadata = await fetchUserMetadata();

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

      const userResult: UserType = {
        id: profileData.id,
        name: profileData.full_name,
        avatarUrl: profileData.avatar_url,
        email: profileData.email,
        bio: profileData.bio ?? "",
        preferredName: "",
        userName: "",
        role: "",
        lastSignInAt: "",
        provider: "",
        providers: [],
        isEmailVerified: false,
        isPhoneVerified: false,
      };

      return userWithMetadata
        ? {
            ...userResult,
            preferredName:
              userWithMetadata.identities[0].identity_data.preferred_username ??
              "",
            userName:
              userWithMetadata.identities[0].identity_data.user_name ?? "",
            role: userWithMetadata.role,
            lastSignInAt: format(
              new Date(userWithMetadata.last_sign_in_at),
              "MMMM dd, yyyy hh:mm a"
            ),
            provider: userWithMetadata.app_metadata.provider,
            providers: userWithMetadata.app_metadata.providers,
            isEmailVerified:
              userWithMetadata.identities[0].identity_data.email_verified,
            isPhoneVerified:
              userWithMetadata.identities[0].identity_data.phone_verified,
          }
        : userResult;
    },
    enabled: params.sessionID ? params.sessionID.length > 0 : false,
  });
}
