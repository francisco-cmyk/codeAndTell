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
  commentsRef?: React.MutableRefObject<{
    [key: number]: HTMLDivElement | null;
  }>;
  onReply?: (id: number, name: string) => void;
};

type State = {
  showEditor: boolean;
  commentText: string;
  expanded: boolean;
  visReplyCount: number;
};

const initialState: State = {
  showEditor: false,
  commentText: "",
  expanded: false,
  visReplyCount: 2,
};

export default function Comment({
  comment,
  userID,
  querykey,
  postID,
  commentsRef,
  maxDepth,
  onReply,
}: CommentProps) {
  const queryClient = useQueryClient();

  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { mutate: likeComment } = usePostLike();
  const { mutate: postComment, isPaused: isPendingPostComment } =
    usePostComment();

  const maxDepth_ = maxDepth ?? 2;

  // Dynamically determine visible replies
  const visibleReplies = comment.replies?.slice(0, state.visReplyCount);

  // Check if there are more replies left to load
  const hasMoreReplies =
    comment.replies && state.visReplyCount < comment.replies.length;
  console.log(hasMoreReplies);

  function handleCommentLike() {
    if (!comment || !userID) return;

    likeComment({
      commentID: comment.id,
      userID,
      key: querykey,
      hasLiked: comment.userHasLiked,
    });
  }

  function handleReply() {
    mergeState({ showEditor: !state.showEditor });
  }

  function handleSubmitComment() {
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
        parentCommentID: comment.id,
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
    <div
      key={comment.id}
      className={`${
        comment.parentCommentID ? "ml-1" : "ml-0"
      } flex flex-col text-sm min-h-fit`}
    >
      <div className='w-full flex mt-3'>
        <Avatar className='h-5 w-5 mr-2'>
          <AvatarImage src={comment.profile.avatarURL} alt='@profilePic' />
          <AvatarFallback>{createAcronym(comment.profile.name)}</AvatarFallback>
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
                comment.userHasLiked ? "text-blue-600 dark:text-blue-400" : ""
              }`}
            />
          </Button>

          <p className='mr-2 font-semibold text-accent-foreground'>
            {comment.likeCount}
          </p>

          <Button
            variant='ghost'
            className={`w-7 h-7 ${
              state.showEditor ? "bg-zinc-300 dark:bg-zinc-700" : ""
            }`}
            onClick={handleReply}
          >
            <MessageCircle />
          </Button>
        </div>

        <p className='text-xs'>{comment.createdAt}</p>
      </div>
      {state.showEditor && (
        <div className='px-4 mt-1'>
          <TiptapEditor
            value={state.commentText}
            variant='small'
            isLoading={isPendingPostComment}
            onChange={(value) => mergeState({ commentText: value })}
            onSubmit={handleSubmitComment}
          />
        </div>
      )}
      {comment.replies && comment.replies.length > 0 && maxDepth_ > 0 && (
        <div className='ml-2 border-l-[0.3px] pl-2'>
          {visibleReplies?.map((reply) => (
            <Comment
              commentsRef={commentsRef}
              key={reply.id}
              comment={reply}
              postID={postID}
              querykey={querykey}
              userID={userID}
              maxDepth={maxDepth_ - 1}
              onReply={onReply}
            />
          ))}
          {/* Show More / Show Less Button */}
          {hasMoreReplies && (
            <Button
              variant='ghost'
              onClick={() => mergeState({ expanded: !state.expanded })}
              className='text-blue-5001 p-1 text-xs'
            >
              {state.expanded
                ? "Show Less Replies"
                : `View More (${state.visReplyCount - comment.replies.length})`}
            </Button>
          )}
        </div>
      )}
      <Separator
        className={`${comment.parentCommentID ? "hidden" : "block"}  mt-2 `}
      />
    </div>
  );
}
