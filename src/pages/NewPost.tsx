import { Badge } from "../components/ui-lib/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui-lib/Card";


export default function NewPost () {
  return (
    <div
    className={`grid grid-cols-1 gap-y-12 p-12 w-3/4 h-screen place-self-center overflow-y-scroll no-scrollbar`}
  >
    {posts.map((post, index) => (
      <Card
        key={`${post.title}-${index}`}
        className={`w-3/4 h-content place-self-center bg-slate-50 dark:bg-[#000F2C] dark:border-[#4E72C2]`}
      >
        <CardHeader className=''>
          <CardTitle className={`dark:text-[#97B5EE] text-2xl`}>
            {post.title}
          </CardTitle>
          <CardDescription className={`dark:text-[#4E72C2]`}>
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
              className={`mr-2 dark:text-white`}
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