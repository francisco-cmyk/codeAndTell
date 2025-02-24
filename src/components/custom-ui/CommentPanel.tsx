import { useEffect, useRef, useState } from "react";
import { PostType } from "../../lib/types";
import { Separator } from "../ui-lib/Separator";
import { showToast } from "../../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/auth";
import usePostComment from "../../hooks/usePostComment";
import TiptapEditor from "./TipTapEditor";
import { htmlParser } from "../../lib/parser";
import Comment from "./Comment";
import { X } from "lucide-react";
import { Button } from "../ui-lib/Button";

type PostViewProps = {
  post: PostType;
  isOpen: boolean;
  onClose: () => void;
};

export default function Comments(props: PostViewProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const commentsRef = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const { mutate: postComment } = usePostComment();

  useEffect(() => {
    const commentID = replyTo?.id;

    if (commentsRef && commentsRef.current && commentID) {
      const element = commentsRef.current[commentID];
      const parent = element?.parentElement;
      if (parent) {
        parent.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
        });
      }
    }
  }, [replyTo]);

  function handleSubmitComment() {
    if (!comment.trim()) {
      showToast({
        type: "error",
        message: "Cannot submit empty comments, please add text.",
        toastId: "emptyCommentError",
      });
      return;
    }

    postComment(
      {
        userID: user.id,
        content: comment,
        postID: props.post.id,
        ...(replyTo?.id ? { parentCommentID: replyTo.id } : {}),
        key: ["posts"],
      },
      {
        onSuccess: () => {
          clearComment();
          setReplyTo(null);
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
      }
    );
  }

  function handleReply(id: number, name: string) {
    setReplyTo({ id, name });
  }

  function clearComment() {
    setComment("");
  }

  if (!props.post) {
    return null;
  }

  return (
    <div
      className={`relative min-w-[440px] max-w-md h-[calc(100vh-70px)] overflow-y-auto shadow-lg bg-card dark:bg-zinc-900  transition-transform duration-300 ease-in-out p-3 pb-12 no-scrollbar
      ${props.isOpen ? "translate-x-0 " : "translate-x-full "}`}
    >
      <div className='h-full p-4 text-lg flex flex-col justify-between'>
        <div className='flex flex-col'>
          <div className='w-full flex flex-col '>
            <p className='font-semibold text-xl'>{props.post.title}</p>
            <div className='text-sm mt-1 line-clamp-4'>
              {htmlParser(props.post.description)}
            </div>
            <p className='text-xs text-right font-semibold'>{`by ${props.post.profile.name}`}</p>
            <Separator className='mb-5 mt-2' />
          </div>

          <div className='min-h-80 max-h-96 overflow-y-auto p-3 space-y-4 '>
            {props.post && props.post.comments
              ? props.post.comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    comment={comment}
                    commentsRef={commentsRef}
                    isPanel
                    postID={props.post.id}
                    querykey={["posts"]}
                    userID={user.id}
                    onReply={handleReply}
                  />
                ))
              : null}
          </div>
        </div>

        <div className='w-full'>
          {replyTo && (
            <div className='flex justify-between items-center w-full p-1  rounded-lg dark:text-blue-300 text-blue-500 bg-zinc-200 dark:bg-zinc-600'>
              <p className='w-2/3 pl-4 text-sm truncate'>
                {`reply to ${replyTo.name}`}
              </p>

              <Button
                variant='ghost'
                className='h-3 w-4'
                onClick={() => setReplyTo(null)}
              >
                <X />
              </Button>
            </div>
          )}
          <TiptapEditor
            variant='small'
            value={comment}
            onChange={(value) => setComment(value)}
            onSubmit={handleSubmitComment}
          />
        </div>
      </div>
    </div>
  );
}
