import { PostType } from "../../lib/types";
import { createAcronym, getEmbedURL } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { Badge } from "../ui-lib/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui-lib/Card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui-lib/Carousel";
import { Skeleton } from "../ui-lib/Skeleton";
import { Trash2, MessageCircle, PencilIcon } from "lucide-react";
import { Button } from "../ui-lib/Button";
import { useAuthContext } from "../../context/auth";
import useDeletePost from "../../hooks/useDeletePost";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DeleteDialog from "./DeleteDialog";
import { htmlParser } from "../../lib/parser";
import BackgroundImage from "./BackgroundImage";
import { useSearchParams } from "react-router-dom";

type FeedProps = {
  isLoading: boolean;
  posts: PostType[];
  isUserPost?: boolean;
  onSelect?: (postID: string) => void;
  onCommentSelect?: (postID: string) => void;
  onPostEdit?: (postID: string) => void;
};

export default function Feed(props: FeedProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [deletePostID, setDeletePostID] = useState<string | null>(null);

  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useDeletePost();

  const postRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const isUserPost = props.isUserPost ?? false;

  const placeholders = Array.from(Array(3).keys());
  const searchParamComView = searchParams.get("comView") ?? "";

  useEffect(() => {
    // Effect to scroll post into view on page reload
    const postID = searchParamComView;
    const element = postRefs.current[postID];

    if (postID && element) {
      const parent = element.parentElement;
      if (parent) {
        parent.scrollTo({
          top: element.offsetTop - 100,
          behavior: "smooth",
        });
      }
    }
  }, [searchParamComView, props.posts]);

  if (props.posts.length === 0 && !props.isLoading) {
    return (
      <div className='w-full h-[300px] flex justify-center items-center mt-10'>
        <p className='text-[40px] font-semibold text-slate-500 text-opacity-55'>
          no posts
        </p>
      </div>
    );
  }

  function handleSelectPost(id: string) {
    if (props.onSelect) {
      props.onSelect(id);
    }
  }

  function handleCommentSelect(id: string) {
    if (props.onCommentSelect) {
      setSearchParams({ comView: id });
      props.onCommentSelect(id);
    }
  }

  function handlePostEdit(id: string) {
    if (props.onPostEdit) {
      props.onPostEdit(id);
    }
  }

  function handleDeletePost() {
    if (!deletePostID) return;

    deletePost(
      {
        postID: deletePostID,
        userID: user.id,
      },
      {
        onSuccess: () => {
          setDeletePostID(null);
          queryClient.invalidateQueries({ queryKey: ["user-posts"] });
        },
      }
    );
  }

  return (
    <div
      className={`sm:min-w-[300px] md:min-w-[700px] max-w-3xl h-full grid grid-cols-1 gap-y-12 p-3 pb-44 place-self-center overflow-y-auto no-scrollbar cursor-pointer`}
    >
      <DeleteDialog
        isOpen={!!deletePostID}
        handleDelete={handleDeletePost}
        onClose={() => setDeletePostID(null)}
      />
      {props.isLoading
        ? placeholders.map((_, index) => (
            <Skeleton
              key={index}
              className={`min-w-full min-h-[300px] place-self-center`}
            />
          ))
        : props.posts.map((post, index) => (
            <Card
              key={`${post.title}-${index}`}
              ref={(el) => (postRefs.current[post.id] = el)}
              className={`min-w-full place-self-center hover:bg-zinc-50 dark:bg-zinc-900 hover:dark:bg-zinc-800`}
              onClick={() => handleSelectPost(post.id)}
            >
              <CardHeader>
                <CardTitle className={`text-2xl mb-1`}>{post.title}</CardTitle>
                <CardDescription className='w-full flex justify-between text-xs '>
                  <div className='flex items-center'>
                    <Avatar className='h-5 w-5 mr-2'>
                      <AvatarImage
                        src={post.profile.avatarURL}
                        alt='@profilePic'
                      />
                      <AvatarFallback>
                        {createAcronym(post.profile.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p>{post.profile.name}</p>
                  </div>
                  <p>{post.createdAt}</p>
                </CardDescription>
                <CardDescription className={`dark:text-slate-50`}>
                  {htmlParser(post.description)}
                </CardDescription>
              </CardHeader>
              <CardContent
                className='relative w-full p-1 mx-auto overflow-hidden '
                onClick={(e) => e.stopPropagation()}
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
                            <div className='flex-grow h-96 rounded-lg overflow-hidden flex justify-center items-center '>
                              {mediaFile.mediaSource.includes("youtube.com") ||
                              mediaFile.mediaSource.includes("vimeo.com") ? (
                                <iframe
                                  src={getEmbedURL(mediaFile.mediaSource)}
                                  allowFullScreen
                                  className='w-full h-full pl-2'
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
              </CardContent>
              <CardFooter className='w-full flex justify-between overflow-x-auto '>
                <div className='flex max-w-2/4'>
                  {post.badges.map((badge, index) => (
                    <Badge
                      key={`${badge}-${index}`}
                      variant={"outline"}
                      className={`mr-2 dark:text-white dark:border-slate-50`}
                    >
                      {badge}
                    </Badge>
                  ))}
                  { post.getHelp !== null ?
                      post.getHelp === false ?
                        <Badge
                          variant={"outline"}
                          className={`mr-2 text-lime-500 dark:border-lime-500`}>
                          Resolved!
                        </Badge>
                        :
                        <Badge
                          variant={"outline"}
                          className={`mr-2 text-red-500 dark:border-red-500`}>
                          Help!
                        </Badge>
                      :
                      <></>
                  }
                </div>

                <div className='flex items-center min-w-16 rounded-md pt-1'>
                  <Button
                    variant='ghost'
                    className='flex items-center hover:bg-zinc-100 dark:hover:bg-zinc-600 p-2 '
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCommentSelect(post.id);
                    }}
                  >
                    <MessageCircle className='h-5 w-5 text-zinc-400' />
                    <p className='text-sm font-semibold text-foreground'>
                      {post.commentCount}
                    </p>
                  </Button>

                  {isUserPost && (
                    <>
                      <Button
                        variant='ghost'
                        className='w-7 outline-non ml-3 '
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePostEdit(post.id);
                        }}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant='ghost'
                        className='w-7 outline-non ml-3 '
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeletePostID(post.id);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
    </div>
  );
}
