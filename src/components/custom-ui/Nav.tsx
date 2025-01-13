import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../ui-lib/NavigationMenu";

export default function Nav() {
  return (
    <div className='sticky top-0 border-solid border-white border-b-2 w-screen p-4 bg-[#000F2C] z-50'>
      <NavigationMenu>
        <NavigationMenuLink
          className={`bg-transparent text-2xl text-[#97B5EE] select-none hover:bg-transparent hover:cursor-pointer`}
        >
          codeAndTell
        </NavigationMenuLink>
        <NavigationMenuList>
          <NavigationMenuItem className=''></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}
