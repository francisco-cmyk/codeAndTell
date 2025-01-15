import { useState } from "react";
import { Button } from "../components/ui-lib/Button";
import { Input } from "../components/ui-lib/Input";
import { Separator } from "../components/ui-lib/Separator";
import getMergeState from "../lib/utils";
import { Eye, EyeOff } from "lucide-react";

type State = {
  emailInput: string;
  passwordInput: string;
  showPassword: boolean;
};

const initialState: State = {
  emailInput: "",
  passwordInput: "",
  showPassword: false,
};

export default function Login() {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  function handleInputChange(type: string, input: string) {
    mergeState({ [`${type}Input`]: input });
  }

  return (
    <div className='w-full max-h-screen flex justify-center '>
      <div className='flex flex-col justify-evenly items-center h-[500px] w-[700px]  p-2 rounded-lg mt-20'>
        <div className='w-3/4 flex flex-col'>
          <p className='font-semibold text-lg'>Get Started</p>
          <p className=' text-sm'>
            Enter your credentials to access your account
          </p>
          <div className='w-full flex justify-evenly mt-6'>
            <Button
              variant='outline'
              className='rounded-lg p-5 text-xs bg-transparent border-slate-700 dark:text-white dark:border-slate-50'
            >
              Log in with Google
            </Button>
            <Button
              variant='outline'
              className='rounded-lg p-5 text-xs bg-transparent border-slate-700 dark:text-white dark:border-slate-50'
            >
              Log in with Discord
            </Button>
            <Button
              variant='outline'
              className='rounded-lg p-5 text-xs bg-transparent border-slate-700 dark:text-white dark:border-slate-50'
            >
              Log in with Github
            </Button>
          </div>
        </div>
        <div className='w-3/4 flex justify-evenly items-center'>
          <Separator className='w-2/5 h-1 ' />
          <span className='ml-1 mr-1'>Or</span>
          <Separator className='w-2/5  h-1' />
        </div>
        <div className='w-3/4 flex flex-col items-center'>
          <div className='w-full'>
            <span className='text-slate-700 dark:text-slate-50'>Email</span>
            <Input
              type='email'
              value={state.emailInput}
              className='mb-2 rounded-lg dark:border-slate-300'
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>
          <div className='w-full relative'>
            <span className='text-slate-700 dark:text-slate-50'>Password</span>
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
              onClick={() => mergeState({ showPassword: !state.showPassword })}
            >
              {state.showPassword ? <Eye /> : <EyeOff />}
            </Button>
          </div>

          <Button className='w-full font-bold dark:bg-slate-100 mt-3'>
            Login
          </Button>
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
