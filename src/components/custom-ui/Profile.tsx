import { Pencil, PencilIcon } from "lucide-react";
import { Button } from "../ui-lib/Button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { useState } from "react";
import TiptapEditor from "./TipTapEditor";
import { htmlParser } from "../../lib/parser";
import getMergeState, { getDiff, showToast } from "../../lib/utils";
import { Input } from "../ui-lib/Input";
import useUpdateProfile from "../../hooks/useUpdateProfle";
import { useAuthContext } from "../../context/auth";

type State = {
  name: string;
  bio: string;
  avatarURL: string;
  showEditAvatar: boolean;
  showEditName: boolean;
  showEditBio: boolean;
  showEditMediaLinks: boolean;
};

const initialState: State = {
  name: "",
  bio: "",
  avatarURL: "",
  showEditAvatar: false,
  showEditName: false,
  showEditBio: false,
  showEditMediaLinks: false,
};

export function Profile() {
  const { user } = useAuthContext();
  const [state, setState] = useState({
    ...initialState,
    name: user.name,
    bio: user.bio,
    avatarURL: user.avatarUrl,
  });

  const mergeState = getMergeState(setState);

  const { mutate: updateProfile } = useUpdateProfile();

  function handleSubmit() {
    const diff = getDiff(
      { bio: user.bio, name: user.name, avatarURL: user.avatarUrl },
      { bio: state.bio, name: state.name, avatarURL: state.avatarURL }
    );

    if (Object.entries(diff).length > 0) {
      updateProfile(
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

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFiles = Array.from(event.target.files);
      mergeState({ avatarURL: selectedFiles[0].name });
    }
  }

  function closeEdits() {
    mergeState({
      showEditBio: false,
      showEditName: false,
      showEditAvatar: false,
    });
  }

  return (
    <div className='w-full flex flex-col p-6'>
      <div className='flex w-full gap-x-5'>
        <div className='relative max-w-36'>
          <Avatar className='h-24 w-24 dark:bg-slate-300'>
            <AvatarImage className='border-2' src={user.avatarUrl} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>

          <Button
            className='absolute top-14 right-0 rounded-full w-4'
            onClick={() =>
              mergeState({ showEditAvatar: !state.showEditAvatar })
            }
          >
            <Pencil size={13} />
          </Button>
        </div>
        {state.showEditAvatar && (
          <div className='mt-3 p-4 w-full'>
            <Input
              type='file'
              accept='image/*'
              // value={state.avatarURL}
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      <div className='w-full flex flex-col gap-y-3 p-4'>
        <div className='w-full flex text-sm justify-between items-center'>
          <div>
            {state.showEditName ? (
              <>
                <p className='text-xs italic'>name</p>
                <Input
                  className='w-[450px]'
                  value={state.name}
                  onChange={(e) => mergeState({ name: e.target.value })}
                />
              </>
            ) : (
              <>
                <p className='text-xs italic'>name</p>
                <p className='font-semibold text-lg'>{user.name}</p>
              </>
            )}
          </div>
          <Button
            variant='ghost'
            className={`w-4 h-6 ${state.showEditName ? "bg-blue-400" : ""}`}
            onClick={() => mergeState({ showEditName: !state.showEditName })}
          >
            <PencilIcon size={13} />
          </Button>
        </div>

        <div className='w-full flex text-sm justify-between items-center'>
          <p className='text-base'>bio</p>
          <Button
            variant='ghost'
            className={`w-4 h-6 ${state.showEditBio ? "bg-blue-400" : ""}`}
            onClick={() => mergeState({ showEditBio: !state.showEditBio })}
          >
            <PencilIcon size={13} />
          </Button>
        </div>
        <div className='w-full'>
          {!state.showEditBio ? (
            <div
              className={`h-44 overflow-y-auto rounded-md p-2 ${
                user.bio.length === 0
                  ? "bg-zinc-200 dark:bg-zinc-700"
                  : "border-zinc-300 dark:border-zinc-600 border-[0.5px]"
              }`}
            >
              <div className='text-sm text-opacity-45'>
                {user.bio.length > 0 ? htmlParser(user.bio) : "no bio yet.."}
              </div>
            </div>
          ) : (
            <TiptapEditor
              showSubmit={false}
              value={state.bio}
              onChange={(val) => mergeState({ bio: val })}
            />
          )}
        </div>

        <div className='w-full flex justify-end gap-x-3'>
          <Button variant='secondary' onClick={closeEdits}>
            cancel
          </Button>
          <Button onClick={handleSubmit}>save</Button>
        </div>

        {/* <div className='w-full flex text-sm justify-between items-centerp-1'>
          <div>
            <p className='font-semibold'>{"will be media links rows"}</p>
            <p className='text-xs italic'>social media link</p>
          </div>
          <Button variant='ghost' className='w-4 h-6'>
            <PencilIcon size={13} />
          </Button>
        </div> */}
      </div>
    </div>
  );
}
