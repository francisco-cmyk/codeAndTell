import { Separator } from "../ui-lib/Separator";
import { PencilIcon, Trash } from "lucide-react";
import { UserType } from "../../lib/types";
import { Button } from "../ui-lib/Button";
import { useState } from "react";
import DeleteDialog from "./DeleteDialog";
import useDeleteUser from "../../hooks/useDeleteUser";

type AccountProps = {
  user: UserType;
};
export function Account({ user }: AccountProps) {
  const [showDelete, setShowDelete] = useState(false);

  const { mutate: deleteAccount } = useDeleteUser();

  function handleSubmitDeleteAccount() {
    deleteAccount({ userID: user.id });
  }

  return (
    <div className='w-full flex flex-col justify-between p-2 gap-y-3'>
      {showDelete && (
        <DeleteDialog
          isOpen={showDelete}
          variant={"account"}
          handleDelete={handleSubmitDeleteAccount}
          onClose={() => setShowDelete(false)}
        />
      )}
      <div className='flex flex-col min-h-36'>
        <p className='font-semibold'>General</p>
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
        <p className='font-semibold'>Account authorization</p>

        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-1'>
          <p>authentication provider</p>
          <p className='font-semibold'>{user.provider}</p>
        </div>
        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-1'>
          <p>last signed in</p>
          <p className='font-semibold'>{user.lastSignInAt}</p>
        </div>
        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-1'>
          <p>email verified</p>
          <p className='font-semibold'>{user.isEmailVerified ? "Yes" : "No"}</p>
        </div>
        <div className='w-full flex text-sm justify-between items-centerrounded-sm p-1'>
          <p>phone verified</p>
          <p className='font-semibold'>{user.isPhoneVerified ? "Yes" : "No"}</p>
        </div>
      </div>

      <div className='flex flex-col min-h-36'>
        <Separator className='mb-2' />
        <p className='font-semibold'>Advanced</p>

        <div className='flex flex-col gap-y-2 p-2 text-sm'>
          <div className='w-full flex justify-between items-center rounded-sm p-1'>
            <p>Delete account</p>
            <Button variant='destructive' onClick={() => setShowDelete(true)}>
              <Trash />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
