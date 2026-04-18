import { createClient } from "@supabase/supabase-js";

import {
  getSupabaseServiceRoleKey,
  requireSupabasePublicEnv,
} from "@/lib/supabase/config";

export function createSupabaseServiceRoleClient() {
  const { url } = requireSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not configured. This client is only available for trusted server-side tasks.",
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
