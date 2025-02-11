import { PostType } from "../../lib/types";
import { createAcronym } from "../../lib/utils";
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
import { MessageCircle } from "lucide-react";

type FeedProps = {
  isLoading: boolean;
  posts: PostType[];
  onSelect?: (postID: string) => void;
  onCommentSelect?: (postID: string) => void;
};

export default function Feed(props: FeedProps) {
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

  return (
    <div
      className={`max-w-3xl h-full grid grid-cols-1 gap-y-12 p-3 pb-44 place-self-center overflow-y-auto no-scrollbar`}
    >
      {props.isLoading
        ? placeholders.map((_, index) => (
            <Skeleton
              key={index}
              className={`min-h-[300px] place-self-center`}
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
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent
                className='relative w-full p-1 mx-auto overflow-hidden rounded-lg'
                onClick={(e) => e.stopPropagation()}
              >
                <Carousel className='w-full mx-auto rounded-lg'>
                  <CarouselContent>
                    {post.mediaUrl.map((image, index) => (
                      <CarouselItem
                        key={`${image}-${index}`}
                        className='relative w-full flex justify-center items-center p-2 rounded-lg'
                      >
                        <BackgroundImage image={image} />
                        <div className='relative w-full max-h-[500px] flex justify-center items-center overflow-hidden'>
                          <img
                            className=' max-h-[500px] object-contain rounded-lg'
                            src={image}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {post.mediaSource.length > 1 && (
                    <>
                      <CarouselPrevious className='left-1' />
                      <CarouselNext className='right-1' />
                    </>
                  )}
                </Carousel>
              </CardContent>
              <CardFooter className='w-full flex justify-between'>
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

                <div
                  className='flex rounded-md p-2 hover:bg-zinc-100 dark:hover:bg-zinc-600'
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCommentSelect(post.id);
                  }}
                >
                  <MessageCircle className='h-5 w-5 text-zinc-400' />
                  <p className='text-sm font-semibold text-foreground'>
                    {post.comments.length}
                  </p>
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
