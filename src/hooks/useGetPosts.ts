import { useQuery } from "@tanstack/react-query";
import { supabase } from "../config/supabaseConfig";
import { z } from "zod";

const PostSchema = z.object({
  id: z.number(),
  created_at: z.string(),
  updated_at: z.nullable(z.string()),
  created_by_id: z.nullable(z.string()),
  updated_by_id: z.nullable(z.string()),
  title: z.nullable(z.string()),
  description: z.nullable(z.string()),
  badges: z.nullable(z.array(z.string())),
  img_source: z.nullable(z.array(z.string())),
});

type PostDBType = z.infer<typeof PostSchema>;

type PostType = {
  id: number;
  createdAt: string;
  updatedAt: string | null;
  createdById: string | null;
  updatedById: string | null;
  title: string | null;
  description: string | null;
  badges: string[];
  imgSource: string[];
};

async function fetchPosts(): Promise<PostDBType[] | undefined> {
  try {
    const { data } = await supabase.from("Content").select();

    if (data) {
      const test = data.map((datum) => {
        return PostSchema.parse(datum);
      });
      return test;
    } else {
      [];
    }
  } catch (error) {
    console.warn(`There was an error: ${error}`);
  }
}

export default function useGetPosts() {
  return useQuery<PostType[], Error>({
    queryKey: ["posts"],
    queryFn: async () => {
      const data = await fetchPosts();

      return (data ?? []).map((datum) => ({
        id: datum.id,
        createdAt: datum.created_at,
        updatedAt: datum.updated_at,
        createdById: datum.created_by_id,
        updatedById: datum.updated_by_id,
        title: datum.title,
        description: datum.description,
        badges: datum.badges ?? [],
        imgSource: datum.img_source ?? [],
      }));
    },
  });
}
