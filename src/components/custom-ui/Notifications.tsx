import {
  Bell,
  ConciergeBell,
  Database,
  Heart,
  MessageCircle,
} from "lucide-react";
import useGetNotifications from "../../hooks/useGetNotifications";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui-lib/Dropdown";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { formatTimestamp } from "../../lib/utils";
import useUpdateNotification from "../../hooks/useUpdateNotification";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { NotificationType } from "../../lib/types";

const NotifType = {
  comment: "comment",
  post: "post",
  like_post: "like_post",
  like_comment: "like_comment",
  system: "system",
} as const;

type NotifType = keyof typeof NotifType;

type NotificationProps = {
  userID: string;
};

export default function Notifications(props: NotificationProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  const { data: notifications = [] } = useGetNotifications({
    userID: props.userID,
  });

  const { mutate: updateNotification } = useUpdateNotification();

  function handleNotificationClick({
    id,
    postID,
    commentID,
    read,
    type,
  }: NotificationType) {
    let url = `/feed?postID=${postID}`;
    if (type === "comment" || type === "like_comment") {
      url = url + "&commentID=" + commentID.toString();
    }

    if (read) {
      navigate(url);
      setOpen(false);
      return;
    }

    updateNotification(
      {
        userID: props.userID,
        notifID: id,
        read: true,
      },
      {
        onSuccess: () => {
          setOpen(false);
          navigate(url);
        },
      }
    );
  }

  const count = notifications.reduce((accum, item) => {
    if (!item.read) accum += 1;
    return accum;
  }, 0);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger className='p-1'>
        <div className='relative'>
          <Bell size={20} />
          {count > 0 && (
            <div className='absolute top-[-11px] right-[9px] z-10 text-[0.7em] rounded-lg min-w-5 max-w-9 p-[2px] bg-red-500 text-white  '>
              {count}
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='center'
        className=' p-1 mr-3 cursor-pointer max-h-[600px]'
      >
        <DropdownMenuLabel className='font-medium text-sm'>
          notifications
        </DropdownMenuLabel>
        <DropdownMenuSeparator className='p-0' />
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className='flex justify-between items-center w-72 p-2 rounded-sm hover:bg-zinc-300 dark:hover:bg-zinc-800'
            onClick={() => handleNotificationClick(notification)}
          >
            <div className='flex gap-x-2'>
              <div className='relative'>
                <Avatar className='h-7 w-7 dark:bg-slate-300'>
                  <AvatarImage
                    className='border-2'
                    src={notification.profile.avatarURL}
                  />
                  <AvatarFallback>
                    {notification.profile.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute flex justify-center items-center bottom-0 left-3 bg-white dark:bg-zinc-900 rounded-full'>
                  {renderNotifIcon(notification.type as NotifType)}
                </div>
              </div>

              <div className='flex flex-col text-xs'>
                <div className='flex gap-x-1 text-wrap'>
                  <p className='font-semibold'>{notification.profile.name}</p>
                  <p>{formatNotif(notification.type as NotifType)}</p>
                </div>
                <p className='text-[11px]'>
                  {formatTimestamp(notification.createdAt)}
                </p>
              </div>
            </div>

            <div>
              <div
                className={`w-2 h-2 rounded-full ${
                  notification.read
                    ? "bg-gray-500 dark:bg-zinc-500"
                    : "bg-green-500"
                }`}
              />
            </div>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatNotif(type: NotifType): string {
  switch (type) {
    case NotifType.comment: {
      return "commented on your post";
    }
    case NotifType.post: {
      return "posted something cool";
    }
    case NotifType.like_post: {
      return "liked your post";
    }
    case NotifType.like_comment: {
      return "liked your comment";
    }
    case NotifType.system: {
      return "check out system update";
    }
  }
}

function renderNotifIcon(type: NotifType) {
  switch (type) {
    case NotifType.comment: {
      return <MessageCircle className='h-4 w-4' />;
    }
    case NotifType.post: {
      return <ConciergeBell className='h-4 w-4 text-blue-400' />;
    }
    case NotifType.like_post: {
      return <Heart className='h-4 w-4 text-red-400' />;
    }
    case NotifType.like_comment: {
      return <Heart className='h-4 w-4 text-red-400 ' />;
    }
    case NotifType.system: {
      return <Database />;
    }
  }
}
