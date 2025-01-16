import { useState } from "react";
import { Button } from "../components/ui-lib/Button";
import { Input } from "../components/ui-lib/Input";
import { Separator } from "../components/ui-lib/Separator";
import getMergeState from "../lib/utils";
import { Eye, EyeOff } from "lucide-react";
import Nav from "../components/custom-ui/Nav";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "../components/ui-lib/Avatar";
import { useDarkMode } from "../context/theme";

type State = {
  emailInput: string;
  passwordInput: string;
  usernameInput: string;
  showPassword: boolean;
};

const initialState: State = {
  emailInput: "",
  passwordInput: "",
  usernameInput: "",
  showPassword: false,
};

export default function SignUp() {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { githubLogoMode } = useDarkMode();

  function handleInputChange(type: string, input: string) {
    mergeState({ [`${type}Input`]: input });

    console.log(githubLogoMode);
  }

  return (
    <div className='w-screen h-screen flex flex-col justify-start cursor-default px-2'>
      <Nav isLoginPage />
      <div className='w-full flex justify-center'>
        <div className='flex flex-col justify-evenly items-center h-[500px] w-[700px]  p-2 rounded-lg mt-20'>
          <div className='w-3/4 flex flex-col'>
            <p className='font-semibold text-lg'>Sign up</p>
            <p className=' text-sm'>enter details to create your account</p>
            <div className='w-full flex flex-col justify-evenly mt-6'>
              <Button
                variant='outline'
                className='rounded-lg p-4 text-xs bg-transparent hover:bg-slate-200 dark:hover:bg-zinc-700  border-slate-700 dark:text-white dark:border-slate-50 mb-2 font-semibold'
              >
                <Avatar className='h-5 w-5'>
                  <AvatarImage src='public/google-logo.svg' />
                </Avatar>
                sign up with Google
              </Button>
              <Button
                variant='outline'
                className='rounded-lg p-4 text-xs bg-transparent hover:bg-slate-200 dark:hover:bg-zinc-700 border-slate-700 dark:text-white dark:border-slate-50 mb-2 font-semibold'
              >
                <Avatar className='h-5 w-5'>
                  <AvatarImage src={githubLogoMode} />
                </Avatar>
                sign up with Github
              </Button>
              <Button
                variant='outline'
                className='rounded-lg p-4 text-xs bg-transparent hover:bg-slate-200 dark:hover:bg-zinc-700 border-slate-700 dark:text-white dark:border-slate-50 mb-2 font-semibold'
              >
                <Avatar className='h-5 w-5'>
                  <AvatarImage src='public/discord-logo.svg' />
                </Avatar>
                sign up with Discord
              </Button>
            </div>
          </div>
          <div className='w-3/4 flex justify-evenly items-center'>
            <Separator className='w-1/5 h-1 ' />
            <span className='ml-1 mr-1 text-sm text-foreground'>
              or sign up with email
            </span>
            <Separator className='w-1/5  h-1' />
          </div>
          <div className='w-3/4 flex flex-col items-center'>
            <div className='w-full'>
              <span className='text-slate-700 dark:text-slate-50'>
                username
              </span>
              <Input
                type='email'
                value={state.usernameInput}
                className='mb-2 rounded-lg dark:border-slate-300'
                onChange={(e) => handleInputChange("username", e.target.value)}
              />
            </div>
            <div className='w-full'>
              <span className='text-slate-700 dark:text-slate-50'>email</span>
              <Input
                type='email'
                value={state.emailInput}
                className='mb-2 rounded-lg dark:border-slate-300'
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>
            <div className='w-full relative'>
              <span className='text-slate-700 dark:text-slate-50'>
                password
              </span>
              <Input
                id='password'
                type={state.showPassword ? "text" : "password"}
                value={state.passwordInput}
                className='mb-2 rounded-lg dark:border-slate-300'
                onChange={(e) => handleInputChange("password", e.target.value)}
              />
              <Button
                variant='ghost'
                size='icon'
                className='absolute z-20 top-6 right-0'
                onClick={() =>
                  mergeState({ showPassword: !state.showPassword })
                }
              >
                {state.showPassword ? <Eye /> : <EyeOff />}
              </Button>
            </div>

            <Button className='w-full font-bold dark:bg-slate-100 mt-3'>
              Login
            </Button>
          </div>

          <div className='w-3/4 flex justify-center text-sm mt-5'>
            <p>already have an account?</p>
            <Link to='/login' className='ml-2 text-blue-500 cursor-pointer'>
              login now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function isValidEmail(email: string): boolean {
  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
