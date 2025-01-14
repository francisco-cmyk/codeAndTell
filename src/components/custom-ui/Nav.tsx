import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "../../context/theme";
import { Button } from "../ui-lib/Button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui-lib/NavigationMenu";

export default function Nav() {
  const { isDarkMode, setIsDarkMode } = useDarkMode();

  return (
    <div className='sticky flex justify-between dark:bg-slate-950 bg-slate-100 top-0 border-solid border-b-2 w-screen p-4 z-50'>
      <NavigationMenu>
        <NavigationMenuLink
          className={`bg-transparent text-2xl  dark:text-[#97B5EE] font-semibold select-none hover:bg-transparent hover:cursor-pointer`}
        >
          codeAndTell
        </NavigationMenuLink>
        <NavigationMenuList>
          <NavigationMenuItem className=''></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div>
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
