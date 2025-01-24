import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui-lib/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { useAuthContext } from "../../context/auth";
import useSignout from "../../hooks/useSignout";

type UserprofileProps = {
  setLoginOpen: () => void;
};

export default function UserProfile(props: UserprofileProps) {
  const { user, isAuthenticated } = useAuthContext();
  const { mutate: useSignoutFn } = useSignout();

  function handleSignIn() {
    props.setLoginOpen();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex mr-2`}>
        <Avatar className='h-7 w-7 dark:bg-slate-300'>
          <AvatarImage className='border-2' src={user.avatarUrl} />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className='cursor-default truncate text-ellipsis overflow-hidden'>
          <p className='text-xs font-light'>my account</p>
          {user.name || user.email || "anonymous"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>notifications</DropdownMenuItem>
        <DropdownMenuItem>settings</DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (isAuthenticated ? useSignoutFn() : handleSignIn())}
        >
          {isAuthenticated ? "logout" : "sign in "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
