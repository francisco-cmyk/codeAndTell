import Feed from "../components/custom-ui/Feed";
import useGetHelpPosts from "../hooks/useGetHelpPosts";
import { useSearchParams } from "react-router-dom";
import PostView from "../components/custom-ui/PostView";

export default function HelpPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: posts = [], isLoading: isLoadingPosts } = useGetHelpPosts();

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

  function handleCommentsClose() {
    if (searchParams.has("comView")) {
      searchParams.delete("comView");
      setSearchParams(searchParams);
    }
  }

  return (
    <div className='w-full h-screen flex'>
      <div
        className={"flex-auto"}
        onClick={handleCommentsClose}
      >
        {searchParamPostID ? (
          <PostView />
        ) : (
          <Feed
            isLoading={isLoadingPosts}
            posts={posts}
            onSelect={handleSelectPost}
          />
        )}
      </div>
    </div>
  );
}
