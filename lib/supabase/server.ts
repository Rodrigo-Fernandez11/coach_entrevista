import { createClient } from "@supabase/supabase-js";

/**
 * Creates a Supabase client with the service role key.
 * NEVER expose this on the client side.
 * Used for server-only operations such as Storage signed URLs.
 */
export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
