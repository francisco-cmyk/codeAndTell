import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui-lib/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import useSignout from "../../hooks/useSignout";

type User = {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
};

type UserprofileProps = {
  user: User;
  isAuthenticated: boolean;
  setLoginOpen: () => void;
};

export default function UserProfile({
  user,
  isAuthenticated,
  ...props
}: UserprofileProps) {
  const { mutate: useSignoutFn } = useSignout();

  function handleSignIn() {
    props.setLoginOpen();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={`flex`}>
        <Avatar className='h-7 w-7 dark:bg-slate-300'>
          <AvatarImage className='border-2' src={user.avatarUrl} />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-40'>
        <DropdownMenuLabel className='cursor-default truncate text-ellipsis overflow-hidden'>
          <p className='text-xs font-light'>my account</p>
          {user.name || user.email || "anonymous"}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
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
