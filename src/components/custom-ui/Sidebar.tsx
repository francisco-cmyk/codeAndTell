import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui-lib/Button";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className='border-grid fixed  z-30 hidden h-[calc(100vh-3.5rem)] w-1/6  shrink-0 border-r md:sticky md:block '>
      <div className='no-scrollbar h-full overflow-auto mt-3  px-4 py-4'>
        <div className='flex flex-col'>
          <Button onClick={() => navigate("/createPost")}> new + </Button>
          <div className='grid grid-flow-row auto-rows-max gap-0.5 text- mt-2'>
            <Link
              to='/'
              className='group flex h-8 w-full items-center rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-slate-200 dark:hover:bg-accent hover:text-accent-foreground'
            >
              allProjects
            </Link>
            <Link
              to='/myPosts'
              className='group flex h-8 w-full items-center rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-slate-200 dark:hover:bg-accent hover:text-accent-foreground'
            >
              myPosts
            </Link>
            <Link
              to='/ask4help'
              className='group flex h-8 w-full items-center rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-slate-200 dark:hover:bg-accent hover:text-accent-foreground'
            >
              askForHelp
            </Link>

            <Link
              // to='/rateMyProject'
              to='https://www.youtube.com/watch?v=Cqd1Gvq-RBY'
              target='blank'
              className='group flex h-8 w-full items-center rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-slate-200 dark:hover:bg-accent hover:text-accent-foreground'
            >
              rateMyProject
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
