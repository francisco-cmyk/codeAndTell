import { useState } from "react";
import { PostType } from "../../lib/types";
import { Separator } from "../ui-lib/Separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { createAcronym, showToast } from "../../lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../../context/auth";
import usePostComment from "../../hooks/usePostComment";
import parse from "html-react-parser";
import TiptapEditor from "./TipTapEditor";
import { htmlParser } from "../../lib/parser";

type PostViewProps = {
  post: PostType;
  isOpen: boolean;
  onClose: () => void;
};

export default function Comments(props: PostViewProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const [comment, setComment] = useState("");

  const { mutate: postComment } = usePostComment();

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
      },
      {
        onSuccess: () => {
          clearComment();
          queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
      }
    );
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
            <p className='text-sm mt-1 line-clamp-4'>
              {htmlParser(props.post.description)}
            </p>
            <p className='text-xs text-right font-semibold'>{`by ${props.post.profile.name}`}</p>
            <Separator className='mb-5 mt-2' />
          </div>

          <div className='min-h-80 max-h-96 overflow-y-auto p-3 space-y-4 '>
            {props.post && props.post.comments
              ? props.post.comments.map((comment, index) => (
                  <div
                    key={`${comment.userID}-${index}`}
                    className='flex flex-col text-sm mb-5'
                  >
                    <div className='w-full flex mb-1'>
                      <Avatar className='h-5 w-5 mr-2'>
                        <AvatarImage
                          src={comment.profile.avatarURL}
                          alt='@profilePic'
                        />
                        <AvatarFallback>
                          {createAcronym(comment.profile.name)}
                        </AvatarFallback>
                      </Avatar>

                      <p className='text-xs mb-2'>{comment.profile.name}</p>
                    </div>
                    <p className='pl-2 pb-2'>{parse(comment.content)}</p>
                    <p className='text-xs text-right'>{comment.createdAt}</p>
                    <Separator className='mt-2 ' />
                  </div>
                ))
              : null}
          </div>
        </div>

        <div className='w-full'>
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
