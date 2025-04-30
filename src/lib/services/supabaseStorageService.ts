import { supabase } from "@/utils/supabase";

export const getPublicUrl = (bucket: string, path: string): string | null => {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data?.publicUrl ?? null;
};
