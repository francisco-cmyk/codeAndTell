import { useMutation } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";

type Params = {
  media: File[];
};

export default function useUploadMedia() {
  return useMutation({
    mutationKey: ["uploadMedia"],
    mutationFn: async (params: Params): Promise<string[]> => {
      const uploadedFilePaths: string[] = [];

      if (params.media) {
        for (const file of params.media) {
          const cleanFileName = file.name.replace(/\s+/g, "_").toLowerCase();
          const filePath = `${Date.now()}_${cleanFileName}`;

          const { error } = await supabase.storage
            .from("media")
            .upload(filePath, file);

          if (error) {
            console.error("Upload Error:", error.message);
            return [];
          }

          // Return all file paths that have been uploaded
          uploadedFilePaths.push(filePath);
        }
      }

      return uploadedFilePaths;
    },
  });
}
