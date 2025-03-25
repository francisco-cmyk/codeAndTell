import getMergeState, { createAcronym, showToast } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { htmlParser } from "../../lib/parser";
import { Separator } from "../ui-lib/Separator";
import { Button } from "../ui-lib/Button";
import { MessageCircle, ThumbsUpIcon } from "lucide-react";
import usePostLike from "../../hooks/usePostLike";
import { useState } from "react";
import TiptapEditor from "./TipTapEditor";
import usePostComment from "../../hooks/usePostComment";
import { useQueryClient } from "@tanstack/react-query";

const MAX_VISIBLE_REPLIES = 2;

type Comment = {
  id: number;
  userID: string;
  content: string;
  parentCommentID: number | null;
  createdAt: string | null;
  likeCount: number;
  userHasLiked: boolean;
  replies?: Comment[];
  profile: {
    id: string;
    avatarURL: string;
    name: string;
  };
};

type CommentProps = {
  comment: Comment;
  postID: string;
  userID: string;
  querykey: string[]; // necessary for optimistic updates
  maxDepth?: number;
};

type State = {
  showEditor: boolean;
  commentText: string;
  expanded: boolean;
  visibleCount: number;
  currCommentIdx: number | null;
};

const initialState: State = {
  showEditor: false,
  commentText: "",
  expanded: false,
  currCommentIdx: null,
  visibleCount: MAX_VISIBLE_REPLIES,
};

export default function Comment({
  comment,
  userID,
  querykey,
  postID,
}: CommentProps) {
  const queryClient = useQueryClient();

  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { mutate: likeComment } = usePostLike();
  const { mutate: postComment, isPaused: isPendingPostComment } =
    usePostComment();

  const flatList = flattenCommentTree(comment);

  const isTruncated = state.visibleCount < flatList.length;
  const isFullyExpanded = state.visibleCount >= flatList.length;
  const visibleComments = flatList.slice(0, state.visibleCount);

  function handleCommentLike() {
    if (!comment || !userID) return;

    likeComment({
      commentID: comment.id,
      userID,
      key: querykey,
      hasLiked: comment.userHasLiked,
    });
  }

  function handleReply(index: number) {
    mergeState({ showEditor: !state.showEditor, currCommentIdx: index });
  }

  function handleSubmitComment(commentID: number) {
    if (!state.commentText) {
      showToast({
        type: "warning",
        message: "please type a comment",
      });
      return;
    }
    postComment(
      {
        userID,
        postID,
        content: state.commentText,
        key: querykey,
        parentCommentID: commentID,
      },
      {
        onSuccess: () => {
          mergeState({ showEditor: false });
          queryClient.invalidateQueries({
            queryKey: querykey,
          });
        },
      }
    );
  }

  return (
    <div className='flex flex-col gap-2 text-sm'>
      {visibleComments.map(({ comment, depth }, index) => (
        <div
          key={comment.id}
          className={`flex flex-col text-sm min-h-fit`}
          style={{ marginLeft: depth * 16 }}
        >
          <div className='w-full flex mt-3'>
            <Avatar className='h-5 w-5 mr-2'>
              <AvatarImage src={comment.profile.avatarURL} alt='@profilePic' />
              <AvatarFallback>
                {createAcronym(comment.profile.name)}
              </AvatarFallback>
            </Avatar>

            <p className='text-xs mb-2'>{comment.profile.name}</p>
          </div>
          <div className='pl-4 pb-2 mt-2'>{htmlParser(comment.content)}</div>
          <div className='w-full flex justify-between items-center pl-2'>
            <div className='flex items-center'>
              <Button
                variant='ghost'
                className={`w-7 h-7 mr-0.5`}
                onClick={handleCommentLike}
              >
                <ThumbsUpIcon
                  className={`${
                    comment.userHasLiked
                      ? "text-blue-600 dark:text-blue-400"
                      : ""
                  }`}
                />
              </Button>

              <p className='mr-2 font-semibold text-accent-foreground'>
                {comment.likeCount}
              </p>

              <Button
                variant='ghost'
                className={`w-7 h-7 ${
                  state.showEditor && state.currCommentIdx === index
                    ? "bg-zinc-300 dark:bg-zinc-700"
                    : ""
                }`}
                onClick={() => handleReply(index)}
              >
                <MessageCircle />
              </Button>
            </div>

            <p className='text-xs'>{comment.createdAt}</p>
          </div>
          {state.showEditor && state.currCommentIdx === index && (
            <div className='px-4 mt-1'>
              <TiptapEditor
                value={state.commentText}
                variant='small'
                isLoading={isPendingPostComment}
                onChange={(value) => mergeState({ commentText: value })}
                onSubmit={() => handleSubmitComment(comment.id)}
              />
            </div>
          )}

          {isTruncated && index === visibleComments.length - 1 && (
            <button
              onClick={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    visibleCount: prevState.visibleCount + MAX_VISIBLE_REPLIES,
                  };
                })
              }
              className='text-blue-500 text-xs mt-2 rounded-sm'
            >
              View More Replies ({flatList.length - state.visibleCount})
            </button>
          )}

          {index === visibleComments.length - 1 &&
            isFullyExpanded &&
            state.visibleCount > MAX_VISIBLE_REPLIES && (
              <button
                onClick={() =>
                  mergeState({ visibleCount: MAX_VISIBLE_REPLIES })
                }
                className='text-blue-500 text-xs mt-2 rounded-sm'
              >
                Collapse Replies
              </button>
            )}

          <Separator
            className={`${comment.parentCommentID ? "hidden" : "block"}  mt-2 `}
          />
        </div>
      ))}
    </div>
  );
}

type DisplayComment = {
  comment: Comment;
  depth: number;
};

function flattenCommentTree(
  comment: Comment,
  depth = 0,
  result: DisplayComment[] = []
): DisplayComment[] {
  result.push({ comment, depth });

  if (comment.replies && comment.replies.length > 0) {
    for (const reply of comment.replies) {
      flattenCommentTree(reply, depth + 1, result);
    }
  }

  return result;
}
