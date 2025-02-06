import { PostType } from "../../lib/types";
import { createAcronym } from "../../lib/utils";
import { AspectRatio } from "../ui-lib/AspectRatio";
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

  return (
    <div
      className={`w-full h-screen grid grid-cols-1 gap-y-12 p-5 pb-44 place-self-center overflow-y-auto no-scrollbar`}
    >
      {props.isLoading
        ? placeholders.map((_, index) => (
            <Skeleton
              key={index}
              className={`w-3/5 min-h-[300px] place-self-center`}
            />
          ))
        : props.posts.map((post, index) => (
            <Card
              key={`${post.title}-${index}`}
              className={`w-3/5 h-content place-self-center dark:bg-zinc-900`}
            >
              <CardHeader className=''>
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
                className={`${
                  post.mediaSource.length > 0 ? `h-96` : `hidden`
                } mx-6 mb-6 p-4 overflow-y-auto  no-scrollbar flex justify-center border-black `}
              >
                <Carousel className='w-5/6'>
                  <CarouselContent>
                    {post.mediaUrl.map((image, index) => (
                      <CarouselItem
                        key={`${image}-${index}`}
                        className={
                          post.mediaSource.length > 1 ? "basis-5/6" : ""
                        }
                      >
                        <AspectRatio ratio={4 / 5}>
                          <img src={image} />
                        </AspectRatio>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {post.mediaSource.length > 1 && (
                    <>
                      <CarouselPrevious />
                      <CarouselNext />
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
                  onClick={() => props.onSelect && props.onSelect(post.id)}
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
