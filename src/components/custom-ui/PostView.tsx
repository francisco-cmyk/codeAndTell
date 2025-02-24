import { useSearchParams } from "react-router-dom";
import useGetUserPostByID from "../../hooks/useGetPostByID";
import { useAuthContext } from "../../context/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { createAcronym, getEmbedURL, showToast } from "../../lib/utils";
import { htmlParser } from "../../lib/parser";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui-lib/Carousel";
import BackgroundImage from "./BackgroundImage";
import { Badge } from "../ui-lib/Badge";
import TiptapEditor from "./TipTapEditor";
import { useState } from "react";
import usePostComment from "../../hooks/usePostComment";
import { Skeleton } from "../ui-lib/Skeleton";
import Comment from "./Comment";

const querykey = ["user-posts-by-id"];

export default function PostView() {
  const { user } = useAuthContext();
  const [searchParams] = useSearchParams();
  const [comment, setComment] = useState("");

  const postId = searchParams.get("postID") ?? "";
  const { data: post, isLoading: isLoadingPost } = useGetUserPostByID({
    postID: postId,
  });
  const { mutate: postComment } = usePostComment();

  function handleSubmitComment() {
    if (!comment.trim() || !postId) {
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
        postID: postId,
        key: querykey,
      },
      {
        onSuccess: () => {
          setComment("");
        },
      }
    );
  }

  if (isLoadingPost) {
    return <PostSkeletion />;
  }

  if (!post) {
    return null;
  }

  return (
    <div className='w-full h-screen overflow-y-auto flex flex-col justify-start items-center no-scrollbar px-7 gap-y-4'>
      <section className='post flex flex-col 2xl:w-2/3 w-full pt-8 gap-y-3'>
        <div className='header'>
          <p className='text-2xl font-semibold mb-1'>{post.title}</p>

          <div className='w-full flex justify-between text-xs p-1'>
            <div className='flex items-center'>
              <Avatar className='h-5 w-5 mr-2'>
                <AvatarImage src={post.profile.avatarURL} alt='@profilePic' />
                <AvatarFallback>
                  {createAcronym(post.profile.name)}
                </AvatarFallback>
              </Avatar>
              <p>{post.profile.name}</p>
            </div>
            <p>{post.createdAt}</p>
          </div>
        </div>

        <div className='description p-1'>{htmlParser(post.description)}</div>

        <div
          className={`content ${
            post.media.length > 0 ? "relative" : "hidden"
          } w-full p-1 mx-auto overflow-hidden `}
        >
          <Carousel className='w-full mx-auto rounded-lg overflow-hidden'>
            <CarouselContent>
              {post.media.map((mediaFile, index) => {
                const isImage = mediaFile.mediaType
                  ? mediaFile.mediaType.includes("image/")
                  : false;
                const isVideo = mediaFile.mediaType
                  ? mediaFile.mediaType.includes("video/")
                  : false;

                return (
                  <CarouselItem
                    key={`${mediaFile.mediaName}-${index}`}
                    className='relative w-full flex justify-center items-center p-2 rounded-lg'
                  >
                    {isImage && (
                      <>
                        <BackgroundImage image={mediaFile.mediaUrl} />
                        <div className='relative w-full max-h-[500px] flex justify-center items-center overflow-hidden pl-4'>
                          <img
                            className=' max-h-[500px] object-contain rounded-md'
                            src={mediaFile.mediaUrl}
                          />
                        </div>
                      </>
                    )}
                    {isVideo && (
                      <div className='w-full h-96 rounded-lg overflow-hidden pt-2'>
                        {mediaFile.mediaSource.includes("youtube.com") ||
                        mediaFile.mediaSource.includes("vimeo.com") ? (
                          <iframe
                            src={getEmbedURL(mediaFile.mediaSource)}
                            allowFullScreen
                            className=' inset-0 w-full h-full'
                            loading='lazy'
                          />
                        ) : (
                          <video
                            src={mediaFile.mediaSource}
                            controls
                            className='w-full h-auto rounded-lg shadow-md'
                          />
                        )}
                      </div>
                    )}
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            {post.media.length > 1 && (
              <>
                <CarouselPrevious className='left-1' />
                <CarouselNext className='right-1' />
              </>
            )}
          </Carousel>
        </div>
        <div className='footer mb-3'>
          <div className='flex max-w-2/4'>
            {post.badges.map((badge, index) => (
              <Badge
                key={`${badge}-${index}`}
                variant='default'
                className={`mr-2`}
              >
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      <section className='input  2xl:w-2/3 w-full'>
        <div className='w-full flex flex-col gap-y-2  pb-5'>
          <TiptapEditor
            variant='small'
            value={comment}
            onChange={(value) => setComment(value)}
            onSubmit={handleSubmitComment}
          />
        </div>
        <p className='text-sm pl-2 italic'>leave a comment </p>
      </section>

      <section className='commments 2xl:w-2/3 w-full pb-20'>
        <div
          className={`w-full overflow-y-auto flex flex-col justify-start gap-y-4 pr-5 pb-10 no-scrollbar`}
        >
          {post.comments.map((comment, index) => (
            <Comment
              key={`${comment}-${index}`}
              comment={comment}
              postID={post.id}
              userID={user.id}
              querykey={["user-posts-by-id"]}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function PostSkeletion() {
  return (
    <div className='w-full h-screen overflow-y-auto flex flex-col justify-start items-center no-scrollbar px-7 gap-y-4'>
      <section className='post flex flex-col 2xl:w-2/3 w-full pt-8 gap-y-3'>
        <Skeleton className='w-full h-[50px]' />
        <Skeleton className='w-full h-[100px]' />
        <Skeleton className='w-full h-[250px]' />
      </section>

      <section className='input  2xl:w-2/3 w-full'>
        <Skeleton className='w-full h-[130px]' />
      </section>

      <section className='commments 2xl:w-2/3 w-full pb-20'>
        <Skeleton className='w-full h-[200px]' />
      </section>
    </div>
  );
}
