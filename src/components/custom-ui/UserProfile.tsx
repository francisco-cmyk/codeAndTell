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
import { LogIn, LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserType } from "../../lib/types";

type UserprofileProps = {
  user: UserType;
  isAuthenticated: boolean;
  setLoginOpen: () => void;
};

export default function UserProfile({
  user,
  isAuthenticated,
  ...props
}: UserprofileProps) {
  const navigate = useNavigate();
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
      <DropdownMenuContent className='min-w-52 mr-2'>
        <DropdownMenuLabel className='flex w-full items-center gap-x-2 cursor-default truncate text-ellipsis overflow-hidden'>
          <Avatar className='h-7 w-7 dark:bg-slate-300'>
            <AvatarImage className='border-2' src={user.avatarUrl} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <p className='text-sm'>
              {user.preferredName || user.name || user.userName}
            </p>
            <p className='text-xs truncate text-ellipsis overflow-hidden text-zinc-500 dark:text-zinc-300'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate("/myPosts")}>
          <User />
          profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate("/settings?tab=account")}>
          <Settings />
          settings
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (isAuthenticated ? useSignoutFn() : handleSignIn())}
        >
          {isAuthenticated ? <LogOut /> : <LogIn />}
          {isAuthenticated ? "logout" : "sign in "}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
