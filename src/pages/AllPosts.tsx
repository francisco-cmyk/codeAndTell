import Feed from "../components/custom-ui/Feed";
import useGetPosts from "../hooks/useGetPosts";
import { useSearchParams } from "react-router-dom";
import PostView from "../components/custom-ui/PostView";
import { useMemo } from "react";

export default function AllPosts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  const searchParamPostID = searchParams.get("postID") ?? "";
  const tagSearchParam = searchParams.get("tag") ?? "";
  //http://localhost:5173/feed?tag="discord"

  function handleSelectPost(id: string): void {
    if (!searchParams.has("postID")) {
      setSearchParams({ postID: id });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("postID", id);
      setSearchParams(newParams, { replace: true });
    }
  };

  const filteredPost = useMemo(() => {
    if (!tagSearchParam) return posts;

    return posts.filter((post) => post.badges.includes(tagSearchParam))
  }, [tagSearchParam, posts])


  // if filter by tags
  // posts.filter(tag(discord))
  // pass posts to feed xd

  return (
    <div className='w-full h-screen flex'>
      <div className={"flex-auto"}>
        {searchParamPostID ? (
          <PostView />
        ) : (
          <Feed
            isLoading={isLoadingPosts}
            posts={filteredPost}
            onSelect={handleSelectPost}
          />
        )}
      </div>
    </div>
  );
}
