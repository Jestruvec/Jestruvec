import { supabase } from "@/utils/supabase";

export const getPublicUrl = (bucket: string, path: string) => {
  try {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  } catch (error) {
    throw error;
  }
};
