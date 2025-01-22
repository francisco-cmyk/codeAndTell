import { Eye, EyeOff, LoaderIcon } from "lucide-react";
import { Avatar, AvatarImage } from "../ui-lib/Avatar";
import { Button } from "../ui-lib/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui-lib/Dialog";
import { Input } from "../ui-lib/Input";
import { Separator } from "../ui-lib/Separator";
import { useState } from "react";
import getMergeState from "../../lib/utils";
import { useDarkMode } from "../../context/theme";
import { Provider } from "@supabase/supabase-js";
import useAuthLogin from "../../hooks/useAuthLogin";
import useEmailSignup from "../../hooks/useEmailSignup";
import { toast } from "react-toastify";
import useEmailLogin from "../../hooks/useEmailLogin";

type OAuthButtonTypes = {
  name: string;
  logo: string;
  provider: Provider;
  isDisabled: boolean;
};

type State = {
  emailInput: string;
  usernameInput: string;
  passwordInput: string;
  showPassword: boolean;
  isSignUp: boolean;
};

const initialState: State = {
  emailInput: "",
  passwordInput: "",
  usernameInput: "",
  showPassword: false,
  isSignUp: false,
};

type LoginProps = {
  isOpen: boolean;
  handleOpen: () => void;
};

export default function LoginModal(props: LoginProps) {
  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { githubLogoMode } = useDarkMode();
  const { mutate: OAuthLogin, isPending: isPendingAuthLogin } = useAuthLogin();
  const { mutate: signupEmail } = useEmailSignup();
  const { mutate: signInEmail } = useEmailLogin();

  function handleInputChange(type: string, input: string) {
    mergeState({ [`${type}Input`]: input });
  }

  function handleSubmitSignup() {
    const isEmail = isValidEmail(state.emailInput);

    if (
      isEmail &&
      state.passwordInput.length > 2 &&
      state.usernameInput.length > 2
    ) {
      signupEmail(
        {
          name: state.usernameInput,
          email: state.emailInput,
          password: state.passwordInput,
        },
        {
          onSuccess: () => {
            props.handleOpen();
            toast.info("Please check your email to confirm your account", {
              toastId: "emailConfirmation",
            });
          },
        }
      );
    }
  }

  function handleSignin() {
    const isEmail = isValidEmail(state.emailInput);

    if (isEmail && state.passwordInput.length > 2) {
      signInEmail(
        {
          email: state.emailInput,
          password: state.passwordInput,
        },
        {
          onSuccess: () => {
            props.handleOpen();
          },
        }
      );
    }
  }

  const OauthButtons: OAuthButtonTypes[] = [
    {
      name: "Google",
      logo: "public/google-logo.svg",
      provider: "google",
      isDisabled: true,
    },
    {
      name: "Github",
      logo: githubLogoMode,
      provider: "github",
      isDisabled: false,
    },
    {
      name: "Discord",
      logo: "public/discord-logo.svg",
      provider: "discord",
      isDisabled: true,
    },
  ];

  return (
    <Dialog open={props.isOpen} onOpenChange={props.handleOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {state.isSignUp ? "Sign up" : "Get Started"}
          </DialogTitle>
          <DialogDescription>
            {state.isSignUp
              ? "enter details to create your account"
              : "enter your credentials to access your account"}
          </DialogDescription>
        </DialogHeader>
        {isPendingAuthLogin ? (
          <div className='w-full min-h-96 flex flex-col justify-center items-center'>
            <LoaderIcon className='animate-spin h-20 w-20' />
          </div>
        ) : (
          <div className='flex flex-col max-w-full justify-evenly items-center  p-2 '>
            <div className='w-3/4  flex flex-col justify-evenly mt-3'>
              {OauthButtons.map((_button, index) => (
                <Button
                  key={`${_button.name}-${index}`}
                  disabled={_button.isDisabled}
                  variant='outline'
                  className='rounded-lg  p-5 text-xs bg-transparent hover:bg-slate-200 dark:hover:bg-zinc-700  border-slate-700 dark:text-white dark:border-slate-50 font-semibold mb-2'
                  onClick={() => OAuthLogin(_button.provider)}
                >
                  <Avatar className='h-5 w-5'>
                    <AvatarImage src={_button.logo} />
                  </Avatar>
                  {state.isSignUp ? "sign up with" : "log in with "}
                  {_button.name}
                </Button>
              ))}
            </div>
            <div className='w-3/4 flex justify-evenly items-center'>
              <Separator className='w-2/5 h-[2px] dark:bg-slate-300 ' />
              <span className='ml-1 mr-1'>or</span>
              <Separator className='w-2/5  h-[2px] dark:bg-slate-300' />
            </div>
            <div className='w-3/4 flex flex-col items-center'>
              <div className='w-full'>
                <span className='text-slate-700 dark:text-slate-50 text-sm'>
                  email
                </span>
                <Input
                  type='email'
                  value={state.emailInput}
                  className='mb-2 rounded-lg dark:border-slate-300'
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              </div>
              <div className='w-full relative'>
                <span className='text-slate-700 dark:text-slate-50 text-sm'>
                  password
                </span>
                <Input
                  id='password'
                  type={state.showPassword ? "text" : "password"}
                  value={state.passwordInput}
                  className='mb-2 rounded-lg dark:border-slate-300'
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
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

              <Button
                disabled={
                  state.emailInput.length === 0 &&
                  state.passwordInput.length === 0
                }
                className='w-full font-bold dark:bg-slate-100 mt-3'
                onClick={() => {
                  state.isSignUp ? handleSubmitSignup() : handleSignin();
                }}
              >
                {!state.isSignUp ? "Login" : "Sign up"}
              </Button>

              <div className='flex justify-center items-center text-sm mt-5'>
                <p className='cursor-default'>
                  {!state.isSignUp
                    ? "don't have an account?"
                    : "have an account?"}
                </p>
                <Button
                  variant='ghost'
                  className='text-sm ml-1 text-blue-500 p-1'
                  onClick={() => mergeState({ isSignUp: !state.isSignUp })}
                >
                  <span>
                    {!state.isSignUp ? "create an account" : "login now"}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function isValidEmail(email: string): boolean {
  // Simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
