import { Loader2, PencilIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui-lib/Dialog";
import TiptapEditor from "./TipTapEditor";

const Variant = {
  post: "post",
  comment: "comment",
} as const;

type Variant = keyof typeof Variant;

type EditDialogProps = {
  isOpen: boolean;
  value: string;
  isLoading?: boolean;
  variant?: Variant;
  handleSubmitEdit: (text: string) => void;
  onClose: () => void;
};

export default function EditDialog(props: EditDialogProps) {
  const variant = props.variant ?? Variant.post;

  function renderMessage() {
    switch (variant) {
      case Variant.post: {
        return "Make any changes to your post here! Remember they are permanent.";
      }
      case Variant.comment: {
        return "Make any changes to your comments here! Remember they are permanent.";
      }
    }
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent
        className='max-w-[550px]'
        aria-describedby='Warning modal for deleting post action'
      >
        <DialogHeader>
          <DialogTitle className='w-full flex justify-center mb-3'>
            {props.isLoading ? (
              <Loader2 className='text-blue-500' />
            ) : (
              <PencilIcon className='text-blue-500' />
            )}
          </DialogTitle>
          <DialogTitle>{`Edit ${variant}`}</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className='text-xs'>{renderMessage()}</p>
        </DialogDescription>

        <TiptapEditor
          variant='small'
          value={props.value}
          onSubmit={(val) => {
            if (val) {
              if (val.length === 0) return;
              props.handleSubmitEdit(val);
            }
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
