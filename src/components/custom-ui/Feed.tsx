import { PostType } from "../../lib/types";
import { createAcronym, getEmbedURL } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { Badge } from "../ui-lib/Badge";
import { all, createLowlight } from 'lowlight';
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
import parse from "html-react-parser";
import { Element, Text } from "html-react-parser";
import { Button } from "../ui-lib/Button";
import { useAuthContext } from "../../context/auth";
import useDeletePost from "../../hooks/useDeletePost";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import DeleteDialog from "./DeleteDialog";

type FeedProps = {
  isLoading: boolean;
  posts: PostType[];
  isUserPost?: boolean;
  onSelect?: (postID: string) => void;
  onCommentSelect?: (postID: string) => void;
  onPostEdit?: (postID: string) => void;
};

export default function Feed(props: FeedProps) {
  const [deletePostID, setDeletePostID] = useState<string | null>(null);

  const { user } = useAuthContext();
  const queryClient = useQueryClient();

  const { mutate: deletePost } = useDeletePost();

  const isUserPost = props.isUserPost ?? false;

  const placeholders = Array.from(Array(3).keys());

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

  const lowlight = createLowlight(all)

  const options = {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.tagName === "code") {
        const className = domNode.attribs?.className || "";
        const languageMatch = className.match(/language-(\w+)/);
        const language = languageMatch ? languageMatch[1] : "plaintext";
        console.log("THIS IS LANGUAGE:", language);

        if (lowlight.listLanguages().includes(language)) {
          const textContent = domNode.children
          .map((child) => (child instanceof Text ? child.data : "")) // `text` is the correct property
          .join("");

          const highlighted = lowlight.highlight(language, textContent);
          console.log("THIS IS HIGHLIGHTED:", highlighted);
          return (
            <code
              className={`language-${language} hljs`}
              dangerouslySetInnerHTML={{ __html: highlighted.children[0].value }}
            />
          );
        }
      }
    },
  };

  return (
    <div
      className={`min-w-[700px] max-w-3xl h-full grid grid-cols-1 gap-y-12 p-3 pb-44 place-self-center overflow-y-auto no-scrollbar`}
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
                  {parse(post.description ?? "", options)}
                </CardDescription>
              </CardHeader>
              <CardContent
                className='relative w-full p-1 mx-auto overflow-hidden '
                onClick={(e) => e.stopPropagation()}
              >
                <Carousel className='w-full mx-auto'>
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
                      {post.comments.length}
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

function BackgroundImage(props: { image: string }) {
  return (
    <div
      className='absolute inset-0 bg-center bg-cover blur-lg brightness-75'
      style={{ backgroundImage: `url(${props.image})` }}
    ></div>
  );
}
