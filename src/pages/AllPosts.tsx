import Feed from "../components/custom-ui/Feed";
import useGetPosts from "../hooks/useGetPosts";
import { useSearchParams } from "react-router-dom";
import PostView from "../components/custom-ui/PostView";

export default function AllPosts() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  const searchParamPostID = searchParams.get("postID") ?? "";

  function handleSelectPost(id: string): void {
    if (!searchParams.has("postID")) {
      setSearchParams({ postID: id });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("postID", id);
      setSearchParams(newParams, { replace: true });
    }
  }

  return (
    <div className='w-full h-screen flex'>
      <div className={"flex-auto"}>
        {searchParamPostID ? (
          <PostView />
        ) : (
          <Feed
            isLoading={isLoadingPosts}
            posts={posts}
            onSelect={handleSelectPost}
            // onCommentSelect={handleSelectedCommentPostID}
          />
        )}
      </div>
    </div>
  );
}
