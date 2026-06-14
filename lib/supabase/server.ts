import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the service role key.
 * NEVER expose this on the client side.
 * Used for server-only operations such as Storage signed URLs.
 */
export function createSupabaseServiceClient() {
  const url = process.env["NEXT_PUBLIC_SUPABASE_URL"];
  const key = process.env["SUPABASE_SERVICE_ROLE_KEY"];

  if (!url || !key) {
    throw new Error("Missing required Supabase environment variables");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
