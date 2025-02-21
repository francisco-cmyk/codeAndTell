import {
  ChevronLeft,
  ChevronRight,
  EllipsisIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { CommentType, PostType } from "../../lib/types";
import { createAcronym } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { Separator } from "../ui-lib/Separator";
import { Skeleton } from "../ui-lib/Skeleton";
import { useSearchParams } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../ui-lib/Popover";
import { Button } from "../ui-lib/Button";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";
import useDeleteComment from "../../hooks/useDeleteComment";
import { useAuthContext } from "../../context/auth";
import { useQueryClient } from "@tanstack/react-query";
import EditDialog from "./EditDialog";
import { keyBy } from "lodash";
import useEditComment from "../../hooks/useEditComment";
import { htmlParser } from "../../lib/parser";

type CommentSectionProps = {
  comments: CommentType[];
  post?: PostType;
  isLoading: boolean;
};

export default function CommentsSection(props: CommentSectionProps) {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectDeleteCommendID, setSelectDeleteCommentID] = useState<
    number | null
  >(null);
  const [selecteEditCommentID, setSelectEditCommentID] = useState<
    number | null
  >(null);

  const isSelectPost = !!searchParams.get("postID");

  const commentsKeyedByID = keyBy(props.comments, "id");
  const selectedCommentContentByID = selecteEditCommentID
    ? commentsKeyedByID[selecteEditCommentID].content
    : null;

  //
  // Mutations
  //
  const { mutate: deleteComment, isPending: isLoadingDeleteComment } =
    useDeleteComment();
  const { mutate: editComment, isPending: isLoadingUpdateComment } =
    useEditComment();

  function removeSearchParam() {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("postID");
    setSearchParams(newParams, { replace: true });
  }

  function returnToPosts() {
    const newParams = new URLSearchParams();
    newParams.set("tab", "posts");
    setSearchParams(newParams, { replace: true });
  }

  function handleDeleteComment() {
    if (!selectDeleteCommendID) return;

    deleteComment(
      {
        userID: user.id,
        commentID: selectDeleteCommendID,
      },
      {
        onSuccess: () => {
          setSelectDeleteCommentID(null);
          queryClient.invalidateQueries({
            queryKey: [isSelectPost ? "user-comments" : "user-all-comments"],
          });
        },
      }
    );
  }

  function handleEditComment(comment: string) {
    if (!selecteEditCommentID) return;

    editComment(
      {
        userID: user.id,
        commentID: selecteEditCommentID,
        commentText: comment,
      },
      {
        onSuccess: () => {
          setSelectEditCommentID(null);
          queryClient.invalidateQueries({
            queryKey: [isSelectPost ? "user-comments" : "user-all-comments"],
          });
        },
      }
    );
  }

  //
  // Render
  //

  if (props.isLoading) {
    const placeholders = Array.from(Array(5).keys());
    return (
      <div className='w-full h-full overflow-y-auto flex flex-col justify-start gap-y-4 p-11'>
        {placeholders.map((_, index) => (
          <Skeleton
            key={index}
            className='flex flex-col text-sm mb-5 min-h-32'
          ></Skeleton>
        ))}
      </div>
    );
  }

  return (
    <div className='w-full h-screen flex flex-col p-11'>
      <DeleteDialog
        isOpen={!!selectDeleteCommendID}
        isLoading={isLoadingDeleteComment}
        variant='comment'
        handleDelete={handleDeleteComment}
        onClose={() => setSelectDeleteCommentID(null)}
      />
      <EditDialog
        isOpen={!!selecteEditCommentID}
        isLoading={isLoadingUpdateComment}
        variant='comment'
        value={selectedCommentContentByID ?? ""}
        handleSubmitEdit={handleEditComment}
        onClose={() => setSelectEditCommentID(null)}
      />
      <div
        className={`${isSelectPost ? "flex" : "hidden"} w-full justify-between`}
      >
        <div
          className='text-xs flex items-center dark:hover:bg-zinc-700 hover:bg-zinc-400 mb-2 p-2 rounded-lg'
          onClick={returnToPosts}
        >
          <ChevronLeft size={15} />
          <p>go back to posts</p>
        </div>
        <div
          className=' text-xs flex items-center dark:hover:bg-zinc-700 hover:bg-zinc-400 mb-2 p-2 rounded-lg'
          onClick={removeSearchParam}
        >
          <p>go back to all comments</p>
          <ChevronRight size={15} />
        </div>
      </div>
      <div
        className={`${
          isSelectPost ? "flex" : "hidden"
        } w-full min-h-20 max-h-1/5`}
      >
        <div className='w-full h-full'>
          <p className='text-xl font-semibold'>
            {props.post ? props.post.title : "post title.."}
          </p>
          <p className='text-xs mt-1'>
            author: {props.post ? props.post.profile.name : "..."}
          </p>
          <Separator className='mt-2 ' />
        </div>
      </div>
      <div className={` ${isSelectPost ? "hidden" : "block"} w-full pb-4`}>
        <p>All comments</p>
        <Separator className='mt-2 ' />
      </div>
      <div
        className={` ${
          props.post ? "h-5/6" : "h-full"
        } w-full overflow-y-auto flex flex-col justify-start gap-y-4 pr-5 pb-10 no-scrollbar`}
      >
        {props.comments.map((comment, index) => (
          <div
            key={`${comment.userID}-${index}`}
            className='flex flex-col text-sm min-h-fit'
          >
            <div className='w-full flex justify-end'>
              <Popover>
                <PopoverTrigger className='p-1'>
                  <EllipsisIcon size={15} />
                </PopoverTrigger>
                <PopoverContent className='flex flex-col gap-y-2 p-2'>
                  <Button
                    variant='ghost'
                    className='outline-none text-xs w-full flex justify-start ring-0 focus:ring-0 focus:outline-none'
                    onClick={() => setSelectEditCommentID(comment.id)}
                  >
                    <PencilIcon className='text-blue-500' />
                    edit comment
                  </Button>
                  <Button
                    variant='ghost'
                    className='outline-none text-xs w-full flex justify-start ring-0 focus:ring-0 focus:outline-none'
                    onClick={() => setSelectDeleteCommentID(comment.id)}
                  >
                    <TrashIcon className='text-red-500' />
                    delete comment
                  </Button>
                </PopoverContent>
              </Popover>
            </div>
            {!props.post && (
              <div className='w-full flex mb-2 text-xs'>
                <p>From post ~</p>
                <p className='italic'>{comment.post.title}</p>
              </div>
            )}
            <div className='w-full flex mt-3'>
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
            <p className='pl-4 pb-2 mt-2'>{htmlParser(comment.content)}</p>
            <span className='text-xs text-right'>{comment.createdAt}</span>
            <Separator className='mt-2 ' />
          </div>
        ))}
      </div>
    </div>
  );
}
