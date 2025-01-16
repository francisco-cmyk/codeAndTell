import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../context/theme";
import { Button } from "../ui-lib/Button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui-lib/NavigationMenu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui-lib/Dropdown";
import { Link } from "react-router-dom";
import UserProfile from "./UserProfile";

type NavPropsTypes = {
  isLoginPage?: boolean;
};

export default function Nav(props: NavPropsTypes) {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <div className='sticky flex justify-between dark:bg-background bg-slate-100 top-0 dark:border-white border-solid border-b-2 min-w-full p-4 z-50'>
      <NavigationMenu>
        <NavigationMenuLink
          className={`bg-transparent text-2xl  dark:text-white font-semibold select-none hover:bg-transparent hover:cursor-pointer`}
        >
          <Link to='/'>codeAndTell</Link>
        </NavigationMenuLink>
        <NavigationMenuList>
          <NavigationMenuItem className=''></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div className={`flex items-center mr-4`}>
        <UserProfile isLoginPage={props.isLoginPage} />
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
