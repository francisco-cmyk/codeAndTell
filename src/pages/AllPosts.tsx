import { keyBy } from "lodash";
import Feed from "../components/custom-ui/Feed";
import useGetPosts from "../hooks/useGetPosts";
import { useRef, useState } from "react";
import { PostType } from "../lib/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui-lib/Avatar";
import { createAcronym } from "../lib/utils";

export default function AllPosts() {
  const [selectedID, setSelectedID] = useState<string | null>(null);
  const { data: posts = [], isLoading: isLoadingPosts } = useGetPosts();

  const postKeyedById = keyBy(posts, "id");
  const selectedPost = postKeyedById[selectedID ?? ""];

  function handleSelectPost(id: string): void {
    if (!selectedID) {
      setSelectedID(id);
      return;
    }
    setSelectedID(null);
  }

  return (
    <div className='w-full h-screen '>
      <Feed
        isLoading={isLoadingPosts}
        posts={posts}
        onSelect={handleSelectPost}
      />
      {/* <SinglePostView post={selectedPost} /> */}
    </div>
  );
}

type PostViewProps = {
  post: PostType | null;
};

function SinglePostView(props: PostViewProps) {
  return (
    <div className='w-full h-screen flex flex-col p-14 '>
      <div className='flex flex-col'>
        <p className='font-semibold leading-none tracking-tight text-2xl mb-1'>
          Title
        </p>

        <div className='max-w-80 flex justify-between text-xs mt-4'>
          <Avatar className='h-5 w-5 mr-2'>
            <AvatarImage
              src={
                props.post
                  ? props.post.profile.avatarURL
                  : "public/anon-user.png"
              }
              alt='@profilePic'
            />
            <AvatarFallback>
              {createAcronym(props.post ? props.post.profile.name : "NPC")}
            </AvatarFallback>
          </Avatar>
          <p className='text-base'>
            {props.post ? props.post.profile.name : "Non Player Character"}
          </p>
        </div>
        <p>{props.post ? props.post.createdAt : "ya moms"}</p>
      </div>

      <div className='max-h-1/4 w-full overflow-y-auto'>content</div>

      <div className='max-h-2/3 overflow-y-auto w-full'>comments</div>
    </div>
  );
}
