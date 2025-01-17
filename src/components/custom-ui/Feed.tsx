import useGetPosts from "../../hooks/useGetPosts";
import { Badge } from "../ui-lib/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui-lib/Card";
import { Skeleton } from "../ui-lib/Skeleton";

export default function Feed() {
  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  const placeholders = Array.from(Array(3).keys());

  return (
    <div
      className={`grid grid-cols-1 gap-y-12 p-12 w-full h-screen place-self-center overflow-y-scroll no-scrollbar`}
    >
      {isLoadingPosts
        ? placeholders.map((_, index) => (
            <Skeleton className={`w-3/5 min-h-[300px] place-self-center`} />
          ))
        : posts.map((post, index) => (
            <Card
              key={`${post.title}-${index}`}
              className={`w-3/5 h-content place-self-center dark:bg-zinc-900`}
            >
              <CardHeader className=''>
                <CardTitle className={` text-2xl`}>{post.title}</CardTitle>
                <CardDescription className={`dark:text-slate-50`}>
                  {post.description}
                </CardDescription>
              </CardHeader>
              <CardContent
                className={`${
                  post.imgSource.length > 0 ? `h-[300px]` : `hidden`
                } mx-6 mb-6 p-4 overflow-y-scroll no-scrollbar border-white border-[0.5px]`}
              >
                {post.imgSource.map((image, index) => (
                  <img
                    key={`${image}-${index}`}
                    src={image}
                    className='w-full h-full mb-4'
                  />
                ))}
              </CardContent>
              <CardFooter>
                {post.badges.map((badge, index) => (
                  <Badge
                    key={`${badge}-${index}`}
                    variant={"outline"}
                    className={`mr-2 dark:text-white dark:border-slate-50`}
                  >
                    {badge}
                  </Badge>
                ))}
              </CardFooter>
            </Card>
          ))}
    </div>
  );
}
