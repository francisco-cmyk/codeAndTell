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
      className={`grid grid-cols-1 gap-y-12 p-12 w-full h-screen place-self-center overflow-y-scroll no-scrollbar`}
    >
      <Card
        className={`w-3/4 h-content place-self-center bg-slate-50 dark:bg-[#000F2C] dark:border-[#4E72C2]`}
      >
        <CardHeader className=''>
          <CardTitle className={`dark:text-[#97B5EE] text-2xl`}>
            test title
          </CardTitle>
          <CardDescription className={`dark:text-[#4E72C2]`}>
            test desc
          </CardDescription>
        </CardHeader>
        <CardContent
          className={`mx-6 mb-6 p-4 overflow-y-scroll no-scrollbar border-white border-[0.5px]`}
        >
            <img
              src={"public/i will soon forget.jpg"}
              className='w-full h-full mb-4'
            />
        </CardContent>
        <CardFooter>
            <Badge
              variant={"outline"}
              className={`mr-2 dark:text-white`}
            >
              yoooooo
            </Badge>
        </CardFooter>
      </Card>
    </div>
  );
}