import { User } from "@supabase/supabase-js";
import { supabase } from "../config/supabaseConfig";

export async function fetchUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session?.user || null;
}
