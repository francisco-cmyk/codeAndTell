import { ToastContentProps } from "react-toastify";
import cx from "clsx";

const DefaultDate = new Date();

interface CustomToastProps
  extends ToastContentProps<{ title: string; content: string }> {}

export default function CustomToast({ data }: CustomToastProps) {
  if (!data) return null;

  return (
    <div className='flex flex-col w-full'>
      <h3 className={cx("text-sm font-semibold")}>{data.title}</h3>
      <div className='flex items-center justify-between'>
        <p className='text-sm mt-1'>{data.content}</p>
      </div>
      <div className='w-full flex justify-end mt-2'>
        <p className='text-xs'>
          {DefaultDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}
