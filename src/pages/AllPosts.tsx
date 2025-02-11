import { keyBy } from "lodash";
import Feed from "../components/custom-ui/Feed";
import useGetPosts from "../hooks/useGetPosts";
import { useState } from "react";
import getMergeState from "../lib/utils";
import CommentPanel from "../components/custom-ui/CommentPanel";

type State = {
  selectedID: string;
  selectedCommentPostID: string;
};

const initialState: State = {
  selectedID: "",
  selectedCommentPostID: "",
};

export default function AllPosts() {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  const postKeyedById = keyBy(posts, "id");
  const selectedPost = postKeyedById[state.selectedID ?? ""];
  const selectedComments = postKeyedById[state.selectedCommentPostID ?? ""];

  function handleSelectPost(id: string): void {
    if (!state.selectedID) {
      mergeState({ selectedID: id });
      return;
    }
    mergeState({ selectedID: "" });
  }

  function handleSelectedCommentPostID(id: string): void {
    mergeState({ selectedCommentPostID: id });
  }

  function handleCommentsClose() {
    mergeState({ selectedCommentPostID: "" });
  }

  const isCommentOpen = !!state.selectedCommentPostID;

  return (
    <div className='w-full h-screen flex'>
      <div
        className={isCommentOpen ? "flex-1" : "flex-auto"}
        onClick={handleCommentsClose}
      >
        <Feed
          isLoading={isLoadingPosts}
          posts={posts}
          onSelect={handleSelectPost}
          onCommentSelect={handleSelectedCommentPostID}
        />
      </div>
      <CommentPanel
        post={selectedComments}
        isOpen={isCommentOpen}
        onClose={handleCommentsClose}
      />
    </div>
  );
}
