/*
   Purpose of this file is to store queries used in multiple hooks
   For examples when querying posts and comments
*/

// This query is used in several files so becareful with changes
export const postQuery = `
id,
created_at,
updated_at,
created_by_id,
updated_by_id,
title,
description,
badges,
media_source,
media_type,
media_size,
media_name,
profiles (
    id,
    full_name,
    avatar_url
),
comments!post_id (
  id,
  content,
  created_at,
  user_id,
  parent_comment_id,
  like_count: comment_likes(count),
  users_liked: comment_likes(user_id),
  profiles!comments_user_id_fkey (
    id,
    full_name,
    avatar_url
  )
)
`;
