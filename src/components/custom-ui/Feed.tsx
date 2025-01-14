import { supabase } from "../../config/supabaseConfig";
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

type MockDataType = {
  title: string;
  description: string;
  imgSource: string[];
  badges: string[];
};

const mockData: MockDataType[] = [
  {
    title: "Side-Project App",
    description:
      "An app that puts side projects, coding help, and other devs like you within reach.",
    imgSource: [
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
    ],
    badges: ["2-3 Devs", "Discord", "Short Project"],
  },
  {
    title: "Communism Made Easy",
    description: " Revolution today, 72 virgins in heaven tomorrow.",
    imgSource: [
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
    ],
    badges: ["2-3 Devs", "Discord", "Short Project"],
  },
  {
    title: "Erm, I need help??!",
    description:
      "My wife says I play too many video games. I throwed my switch at her",
    imgSource: [
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
    ],
    badges: ["2-3 Devs", "Discord", "Short Project"],
  },
];

export default function Feed() {
  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

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
