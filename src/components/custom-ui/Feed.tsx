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
  imageSrc: string[];
  badges: string[];
};

const mockData: MockDataType[] = [
  {
    title: "Side-Project App",
    description:
      "An app that puts side projects, coding help, and other devs like you within reach.",
    imageSrc: [
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
    ],
    badges: ["2-3 Devs", "Discord", "Short Project"],
  },
  {
    title: "Communism Made Easy",
    description: " Revolution today, 72 virgins in heaven tomorrow.",
    imageSrc: [
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
    imageSrc: [
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
      "public/i will soon forget.jpg",
    ],
    badges: ["2-3 Devs", "Discord", "Short Project"],
  },
];

export default function Feed() {
  return (
    <div
      className={`grid grid-cols-1 gap-y-12 p-12 w-3/4 h-screen place-self-center overflow-y-scroll no-scrollbar`}
    >
      {mockData.map((data, index) => (
        <Card
          key={`${data.title}-${index}`}
          className={`w-3/4 h-content place-self-center bg-[#000F2C] border-[#4E72C2]`}
        >
          <CardHeader className=''>
            <CardTitle className={`text-[#97B5EE] text-2xl`}>
              {data.title}
            </CardTitle>
            <CardDescription className={`text-[#4E72C2]`}>
              {data.description}
            </CardDescription>
          </CardHeader>
          <CardContent
            className={`h-[300px] mx-6 mb-6 p-4 overflow-y-scroll no-scrollbar border-white border-[0.5px]`}
          >
            {data.imageSrc.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                className='w-full h-full mb-4'
              />
            ))}
          </CardContent>
          <CardFooter>
            {data.badges.map((badge, index) => (
              <Badge
                key={`${badge}-${index}`}
                variant={"outline"}
                className={`mr-2 text-white`}
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
