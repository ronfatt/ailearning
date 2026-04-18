type SupabasePublicEnv = {
  url: string;
  key: string;
  keyType: "publishable" | "anon";
};

export function getSupabasePublicEnv(): SupabasePublicEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  const key = publishableKey || anonKey;

  if (!url || !key) {
    return null;
  }

  return {
    url,
    key,
    keyType: publishableKey ? "publishable" : "anon",
  };
}

export function requireSupabasePublicEnv(): SupabasePublicEnv {
  const config = getSupabasePublicEnv();

  if (!config) {
    throw new Error(
      "Supabase public environment variables are not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY).",
    );
  }

  return config;
}

export function getSupabaseServiceRoleKey() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return key && key.length > 0 ? key : null;
}

export function isSupabaseDatabaseUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return (
    value.includes(".supabase.co") || value.includes(".pooler.supabase.com")
  );
}

export function isSupabasePooledConnection(value?: string | null) {
  if (!value) {
    return false;
  }

  return value.includes(".pooler.supabase.com");
}

export function getSupabaseIntegrationStatus() {
  const publicEnv = getSupabasePublicEnv();
  const serviceRoleKey = getSupabaseServiceRoleKey();
  const databaseUrl = process.env.DATABASE_URL ?? null;

  return {
    hasProjectUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
    hasPublishableKey: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim(),
    ),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    hasDatabaseUrl: Boolean(databaseUrl),
    usingSupabaseDatabase: isSupabaseDatabaseUrl(databaseUrl),
    usingPooledConnection: isSupabasePooledConnection(databaseUrl),
    publicClientReady: Boolean(publicEnv),
    serviceRoleReady: Boolean(publicEnv && serviceRoleKey),
    keyType: publicEnv?.keyType ?? null,
  };
}
