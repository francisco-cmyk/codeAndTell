import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../context/theme";
import { Button } from "../ui-lib/Button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui-lib/NavigationMenu";
import UserProfile from "./UserProfile";

type NavProps = {
  setLoginOpen: () => void;
};

export default function Nav(props: NavProps) {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <div className='sticky flex justify-between dark:bg-background bg-slate-100 top-0  border-solid border-b min-w-full p-4 z-50'>
      <NavigationMenu>
        <NavigationMenuLink
          href='/'
          className={`bg-transparent text-2xl  dark:text-white font-semibold select-none hover:bg-transparent hover:cursor-pointer`}
        >
          <p>codeAndTell</p>
        </NavigationMenuLink>
        <NavigationMenuList>
          <NavigationMenuItem className=''></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className={`flex items-center mr-4`}>
        <UserProfile setLoginOpen={props.setLoginOpen} />
        <Button
          size='icon'
          variant='ghost'
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? <Sun /> : <Moon />}
        </Button>
      </div>
    </div>
  );
}
