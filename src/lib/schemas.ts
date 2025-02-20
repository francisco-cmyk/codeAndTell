import { z } from "zod";

export const PostSchema = z.object({
  id: z.string(),
  created_at: z.string(),
  updated_at: z.nullable(z.string()),
  created_by_id: z.nullable(z.string()),
  updated_by_id: z.nullable(z.string()),
  title: z.nullable(z.string()),
  description: z.nullable(z.string()),
  badges: z.nullable(z.array(z.string())),
  media_source: z.nullable(z.array(z.string())),
  media_size: z.nullable(z.array(z.number())),
  media_name: z.nullable(z.array(z.string())),
  media_type: z.nullable(z.array(z.string())),
  profiles: z.object({
    id: z.string(),
    avatar_url: z.nullable(z.string()),
    full_name: z.nullable(z.string()),
  }),
  comments: z.array(
    z.object({
      content: z.string(),
      created_at: z.nullable(z.string()),
      id: z.number(),
      parent_comment_id: z.nullable(z.string()),
      user_id: z.string(),
      profiles: z.object({
        id: z.string(),
        avatar_url: z.nullable(z.string()),
        full_name: z.nullable(z.string()),
      }),
    })
  ),
});

export const formSchema = z.object({
  title: z.string().min(2, "Title must be atleast 2 characters").max(50),
  description: z.string().min(2, "Please add a description").max(5000),
  media: z.array(z.any()),
  badges: z.string().array().min(1, "Select atleast once badge").max(3),
  mediaLink: z.string().optional(),
});
