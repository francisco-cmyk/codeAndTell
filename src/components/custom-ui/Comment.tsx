import { createAcronym, showToast } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { htmlParser } from "../../lib/parser";
import { Separator } from "../ui-lib/Separator";
import { Button } from "../ui-lib/Button";
import { MessageCircle, ThumbsUpIcon } from "lucide-react";
import usePostLike from "../../hooks/usePostLike";
import { forwardRef, useState } from "react";
import TiptapEditor from "./TipTapEditor";
import usePostComment from "../../hooks/usePostComment";
import { useQueryClient } from "@tanstack/react-query";

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
  isPanel?: boolean;
  commentsRef?: React.MutableRefObject<{
    [key: number]: HTMLDivElement | null;
  }>;
  onReply?: (id: number, name: string) => void;
};

const Comment = forwardRef<HTMLDivElement, CommentProps>(
  ({ comment, userID, querykey, postID, isPanel, commentsRef, onReply }, _) => {
    const queryClient = useQueryClient();
    const [showEditor, setShowEditor] = useState<boolean>(false);
    const [commentText, setCommentText] = useState<string>("");

    const { mutate: likeComment } = usePostLike();
    const { mutate: postComment } = usePostComment();

    const _isPanel = isPanel ?? false;

    function setRef(node: HTMLDivElement | null) {
      if (commentsRef) {
        commentsRef.current[comment.id] = node;
      }
    }

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
      if (!_isPanel) {
        setShowEditor(!showEditor);
      } else {
        if (onReply) {
          onReply(comment.id, comment.profile.name);
        }
      }
    }

    function handleSubmitComment() {
      if (!commentText) {
        showToast({
          type: "warning",
          message: "please type a comment",
        });
        return;
      }

      if (!_isPanel) {
        postComment(
          {
            userID,
            postID,
            content: commentText,
            key: querykey,
            parentCommentID: comment.id,
          },
          {
            onSuccess: () => {
              setShowEditor(false);
              queryClient.invalidateQueries({
                queryKey: querykey,
              });
            },
          }
        );
      }
    }

    return (
      <div
        key={comment.id}
        ref={setRef}
        className={`${
          comment.parentCommentID ? "ml-1" : "ml-0"
        } flex flex-col text-sm min-h-fit`}
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
                showEditor ? "bg-zinc-300 dark:bg-zinc-700" : ""
              }`}
              onClick={handleReply}
            >
              <MessageCircle />
            </Button>
          </div>

          <p className='text-xs'>{comment.createdAt}</p>
        </div>
        {!_isPanel && showEditor && (
          <div className='px-4 mt-1'>
            <TiptapEditor
              value={commentText}
              variant='small'
              onChange={(value) => setCommentText(value)}
              onSubmit={handleSubmitComment}
            />
          </div>
        )}
        {comment.replies && comment.replies.length > 0 && (
          <div className='ml-2 border-l-[0.3px] pl-2'>
            {comment.replies.map((reply) => (
              <Comment
                commentsRef={commentsRef}
                key={reply.id}
                comment={reply}
                isPanel={_isPanel}
                postID={postID}
                querykey={querykey}
                userID={userID}
                onReply={onReply}
              />
            ))}
          </div>
        )}
        <Separator
          className={`${comment.parentCommentID ? "hidden" : "block"}  mt-2 `}
        />
      </div>
    );
  }
);

export default Comment;
