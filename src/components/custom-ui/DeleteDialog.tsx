import { Loader2, TriangleAlert } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui-lib/Dialog";
import { Button } from "../ui-lib/Button";

const Variant = {
  account: "account",
  comment: "comment",
  custom: "custom",
  post: "post",
} as const;

type Variant = keyof typeof Variant;

type BaseProps = {
  isOpen: boolean;
  isLoading?: boolean;
  handleDelete: () => void;
  onClose: () => void;
};

type NonCustomVariantProps = BaseProps & {
  variant?: Exclude<Variant, "custom">;
  message?: never; // Prevents message from being used
};
// Variant when it's "custom"
type CustomVariantProps = BaseProps & {
  variant: "custom";
  message: string;
};

type DeleteDialogProps = NonCustomVariantProps | CustomVariantProps;

export default function DeleteDialog(props: DeleteDialogProps) {
  const variant = props.variant ?? Variant.post;

  function renderMessage() {
    switch (variant) {
      case Variant.post: {
        return "This will permanently delete this post. Once deleted your post will be gone forever.";
      }
      case Variant.comment: {
        return "This will permanently delete this comment. Once deleted your comment will be gone forever.";
      }
      case Variant.account: {
        return "This will permanently delete your account. Once deleted your account will be gone forever.";
      }
      case Variant.custom: {
        if (props.message) return props.message;
        return "This action is permanent and cannot be undone.";
      }
    }
  }

  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent
        className='max-w-96'
        aria-describedby='Warning modal for deleting post action'
      >
        <DialogHeader>
          <DialogTitle className='w-full flex justify-center mb-3'>
            <TriangleAlert className='text-red-400' />
          </DialogTitle>
          <DialogTitle>Are you super duper sure?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <p className='text-xs'>{renderMessage()}</p>
        </DialogDescription>

        <div className='w-full flex justify-between mt-4'>
          <Button variant='outline' onClick={props.onClose}>
            cancel
          </Button>
          <Button
            variant='destructive'
            className='min-w-20'
            onClick={props.handleDelete}
          >
            {props.isLoading ? <Loader2 /> : "delete"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
