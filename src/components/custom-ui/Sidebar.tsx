import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "../ui-lib/NavigationMenu";

import { Button } from "../ui-lib/Button";


export default function Sidebar () {
  return (
    <div className={`min-h-dvh w-1/6 border-solid dark:border-white border-black border-r-[0.5px] p-4 flex justify-center`}>
      <NavigationMenu className={`flex items-start min-w-full`}>
        <NavigationMenuList className='grid grid-cols-1 gap-y-4'>
          <NavigationMenuItem>
            <Button> new + </Button>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink className={`hover:cursor-pointer hover:dark:bg-slate-300`}>
              askHelp
            </NavigationMenuLink>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink>
              feed
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}