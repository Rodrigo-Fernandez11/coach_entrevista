import { createSupabaseServiceClient } from "@/lib/supabase/server";

const STORAGE_BUCKET = "answers";

/**
 * Creates a signed upload URL for direct client-to-Supabase upload.
 * - Uses service role to create the URL (server-side only).
 * - Upload URL expires in 120 seconds (buffer for slow connections).
 * - Path format: {userId}/{answerId}/{filename}
 */
export async function createSignedUploadUrl(
  path: string,
  mime?: string
): Promise<{ uploadUrl: string; path: string; expiresAt: string }> {
  // mime is optional — Supabase derives content-type from request headers.
  // Callers may pass it for future content-type validation (e.g., T-20).
  void mime;
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data) {
    throw new Error(`Failed to create signed upload URL: ${error?.message}`);
  }

  const expiresAt = new Date(Date.now() + 120 * 1000).toISOString();

  return {
    uploadUrl: data.signedUrl,
    path,
    expiresAt,
  };
}

/**
 * Creates a signed download URL for server-side retrieval (e.g., for Whisper).
 * - Expires in 300 seconds (5 minutes) — enough for transcription pipeline.
 * - Never exposed to the client.
 */
export async function createSignedDownloadUrl(
  path: string
): Promise<string> {
  const supabase = createSupabaseServiceClient();

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .createSignedUrl(path, 300);

  if (error || !data?.signedUrl) {
    throw new Error(`Failed to create signed download URL: ${error?.message}`);
  }

  return data.signedUrl;
}
