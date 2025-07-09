import { Separator } from "../ui-lib/Separator";
import { PencilIcon } from "lucide-react";
import { Button } from "../ui-lib/Button";
import { useState } from "react";
import { htmlParser } from "../../lib/parser";
import TiptapEditor from "./TipTapEditor";
import getMergeState, { getDiff, showToast } from "../../lib/utils";
import useUpdateAccount from "../../hooks/useUpdateAccount";
import { useAuthContext } from "../../context/auth";

type State = {
  contactInfo: string;
  showEditContactInfo: boolean;
};

const initialState: State = {
  contactInfo: "",
  showEditContactInfo: false,
};

export function Preferences() {
  const { user } = useAuthContext();
  console.log('USER ---->', user);
  const [state, setState] = useState({
    ...initialState,
    contactInfo: user.contactInfo,
  });

  const mergeState = getMergeState(setState);
  const { mutate: updateAccount } = useUpdateAccount();

  function handleEditContactInfo() {
    const diff = getDiff(
      { contactInfo: user.contactInfo },
      { contactInfo: state.contactInfo }
    );

    if (Object.entries(diff).length > 0) {
      updateAccount(
        {
          ...diff,
          userID: user.id,
        },
        {
          onSuccess: () => {
            closeEdits();
            showToast({
              type: "success",
              message: "successfully updated profile.",
            });
          },
        }
      );
    }
  }

  function closeEdits() {
    mergeState({
      showEditContactInfo: false,
    });
  }

  return (
    <div className='w-full flex flex-col justify-between p-2 gap-y-3'>
      <div className='flex flex-col min-h-36'>
        <p className='font-semibold text-lg'>General</p>
        <div className='flex flex-col gap-y-3 p-2 text-sm'>
          <div className='w-full flex justify-between items-center rounded-sm p-1'>
            <p>email address</p>
            <div className='flex gap-x-2'>
              <p className='flex items-center font-semibold'>{user.email}</p>
              <Button variant='ghost' className='w-4 h-6'>
                <PencilIcon size={13} />
              </Button>
            </div>
          </div>
          <div className='w-full flex justify-between items-centerrounded-sm p-1'>
            <p>password</p>
            <Button variant='ghost' className='w-4 h-6'>
              <PencilIcon size={13} />
            </Button>
          </div>
          <div className='w-full flex justify-between items-centerrounded-sm p-1'>
            <p>location</p>
            <Button variant='ghost' className='w-4 h-6'>
              <PencilIcon size={13} />
            </Button>
          </div>
        </div>
      </div>

      <div className='flex flex-col min-h-36 gap-y-3'>
        <Separator className='mb-2' />
        <p className='font-semibold text-lg'>Account authorization</p>

        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-2'>
          <p>authentication provider</p>
          <p className='font-semibold'>{user.provider}</p>
        </div>
        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-2'>
          <p>last signed in</p>
          <p className='font-semibold'>{user.lastSignInAt}</p>
        </div>
        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-2'>
          <p>email verified</p>
          <p className='font-semibold'>{user.isEmailVerified ? "Yes" : "No"}</p>
        </div>
        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-2'>
          <p>phone verified</p>
          <p className='font-semibold'>{user.isPhoneVerified ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className='flex flex-col min-h-36'>
        <Separator className='mb-2' />
        <p className='font-semibold text-lg'>Contact Info</p>

        <div className='flex flex-col gap-y-2 text-sm'>
          <div className='w-full flex text-sm justify-between items-center'>
            <span className="text-slate-400"> note: this information will be included below all your posts </span>
            <Button
              variant='ghost'
              className={`
                w-4 h-6 ${state.showEditContactInfo ? "bg-blue-400" : ""}
              `}
              onClick={() => mergeState({ showEditContactInfo: !state.showEditContactInfo })}
            >
              <PencilIcon size={13}/>
            </Button>
          </div>

          <div className='w-full flex justify-between items-center rounded-sm'>
            <div className='w-full'>
              {!state.showEditContactInfo ? (
                <div
                  className={`rounded-md p-2 ${
                    user.contactInfo.length === 0
                      ? "bg-zinc-200 dark:bg-zinc-700"
                      : "border-zinc-300 dark:border-zinc-600 border-[0.5px]"
                  }`}
                >
                  <div className='text-sm text-opacity-45'>
                    {user.contactInfo.length > 0 ? htmlParser(user.contactInfo) : "no contact info yet..."}
                  </div>
                </div>
              ) : (
                <TiptapEditor
                  showSubmit={false}
                  value={state.contactInfo}
                  onChange={(val) => mergeState({ contactInfo: val })}
                />
              )}
            </div>
          </div>

          <div className={`w-full flex justify-end gap-x-3 ${state.showEditContactInfo ? "" : "hidden"}`}>
            <Button variant='secondary' onClick={closeEdits}>
              cancel
            </Button>
            <Button onClick={handleEditContactInfo}>save</Button>
          </div>
        </div>
      </div>
    </div>
  );
}