import { keyBy } from "lodash";
import Feed from "../components/custom-ui/Feed";
import useGetPosts from "../hooks/useGetPosts";
import { useEffect, useState } from "react";
import getMergeState from "../lib/utils";
import CommentPanel from "../components/custom-ui/CommentPanel";
import { useSearchParams } from "react-router-dom";
import PostView from "../components/custom-ui/PostView";

type State = {
  selectedID: string;
  selectedCommentPostID: string;
};

const initialState: State = {
  selectedID: "",
  selectedCommentPostID: "",
};

export default function AllPosts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  const postKeyedById = keyBy(posts, "id");
  const selectedComments = postKeyedById[state.selectedCommentPostID ?? ""];
  const searchParamPostID = searchParams.get("postID") ?? "";
  const searchParamComView = searchParams.get("comView") ?? "";

  useEffect(() => {
    if (searchParamComView && !state.selectedCommentPostID) {
      mergeState({ selectedCommentPostID: searchParamComView });
    }
  }, [searchParamComView]);

  function handleSelectPost(id: string): void {
    if (!searchParams.has("postID")) {
      setSearchParams({ postID: id });
    } else {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("postID", id);
      setSearchParams(newParams, { replace: true });
    }
  }

  function handleSelectedCommentPostID(id: string): void {
    mergeState({ selectedCommentPostID: id });
  }

  function handleCommentsClose() {
    if (searchParams.has("comView")) {
      searchParams.delete("comView");
      setSearchParams(searchParams);
    }
    mergeState({ selectedCommentPostID: "" });
  }

  const isCommentOpen = !!state.selectedCommentPostID;

  return (
    <div className='w-full h-screen flex'>
      <div
        className={isCommentOpen ? "flex-1" : "flex-auto"}
        onClick={handleCommentsClose}
      >
        {searchParamPostID ? (
          <PostView />
        ) : (
          <Feed
            isLoading={isLoadingPosts}
            posts={posts}
            onSelect={handleSelectPost}
            onCommentSelect={handleSelectedCommentPostID}
          />
        )}
      </div>
      <CommentPanel
        post={selectedComments}
        isOpen={isCommentOpen}
        onClose={handleCommentsClose}
      />
    </div>
  );
}
