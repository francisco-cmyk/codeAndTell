import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui-lib/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";

type ProfileProps = {
  isLoginPage?: boolean;
};

export default function UserProfile(props: ProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`${props.isLoginPage ? "hidden" : "flex"} mr-2`}
      >
        <Avatar className='h-7 w-7'>
          <AvatarImage src='https://github.com/shadcn.png' />
          <AvatarFallback>USR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='cursor-default'>
          my account
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>notifications</DropdownMenuItem>
        <DropdownMenuItem>settings</DropdownMenuItem>
        <DropdownMenuItem>logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
