import { CommentType, PostType } from "../../lib/types";
import { createAcronym } from "../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-lib/Avatar";
import { Separator } from "../ui-lib/Separator";
import { Skeleton } from "../ui-lib/Skeleton";
import parse from "html-react-parser";

type CommentSectionProps = {
  comments: CommentType[];
  post?: PostType;
  isLoading: boolean;
};

export default function CommentsSection(props: CommentSectionProps) {
  const placeholders = Array.from(Array(5).keys());

  if (props.isLoading) {
    return (
      <div className='w-full h-full overflow-y-auto flex flex-col justify-start gap-y-4 pl-2'>
        {placeholders.map((_, index) => (
          <Skeleton
            key={index}
            className='flex flex-col text-sm mb-5 min-h-32'
          ></Skeleton>
        ))}
      </div>
    );
  }

  const title = props.post ? props.post.title : "";
  const author = props.post ? props.post.profile.name : "";

  return (
    <div className='w-full h-screen flex flex-col p-11'>
      {props.post && (
        <div className='w-full min-h-20 max-h-1/5 '>
          <p className='text-xl font-semibold'>{title}</p>
          <p className='text-xs mt-1'>author: {author}</p>
          <Separator className='mt-2 ' />
        </div>
      )}
      <div
        className={` ${
          props.post ? "h-5/6" : "h-full"
        } w-full overflow-y-auto flex flex-col justify-start gap-y-4 pr-5 pb-10 no-scrollbar`}
      >
        {props.comments.map((comment, index) => (
          <div
            key={`${comment.userID}-${index}`}
            className='flex flex-col text-sm min-h-fit'
          >
            {!props.post && (<div className="w-full flex">
              <p></p>
            </div>)}
            <div className='w-full flex '>
              <Avatar className='h-5 w-5 mr-2'>
                <AvatarImage
                  src={comment.profile.avatarURL}
                  alt='@profilePic'
                />
                <AvatarFallback>
                  {createAcronym(comment.profile.name)}
                </AvatarFallback>
              </Avatar>

              <p className='text-xs mb-2'>{comment.profile.name}</p>
            </div>
            <p className='pl-2 pb-2 mt-2'>{parse(comment.content)}</p>
            <span className='text-xs text-right'>{comment.createdAt}</span>
            <Separator className='mt-2 ' />
          </div>
        ))}
      </div>
    </div>
  );
}
