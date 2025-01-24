import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui-lib/Avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui-lib/Tabs";
import { useAuthContext } from "../context/auth";
import useGetUserPosts from "../hooks/useGetUserPosts";
import { keyBy } from "lodash";
import { PostType } from "../lib/types";
import { useState } from "react";
import getMergeState from "../lib/utils";

type State = {
  selectedID: string | null;
};

const initialState: State = {
  selectedID: null,
};

export default function UserPosts() {
  const { user } = useAuthContext();

  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { data: posts = [], isLoading: isLoadingPosts } = useGetUserPosts({
    userID: user.id,
  });

  const postKeyedById = keyBy(posts, "id");
  const selectedPost = postKeyedById[state.selectedID ?? ""];

  function handleSelectPost(id: string) {
    mergeState({ selectedID: id });
  }

  return (
    <div className={`w-full h-screen `}>
      <div className='flex w-full items-center h-24 px-10 mt-4'>
        <Avatar className='h-16 w-16 dark:bg-slate-300 mr-4'>
          <AvatarImage className='border-2' src={user.avatarUrl} />
          <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <p className='font-semibold text-2xl'>{user.name}</p>
          <p className='text-sm text-foreground'>{user.email}</p>
        </div>
      </div>
      <Tabs defaultValue='account' className='w-full p-5'>
        <TabsList className='grid w-1/4 grid-cols-2 bg-slate-50 dark:bg-zinc-700'>
          <TabsTrigger value='account'>Posts</TabsTrigger>
          <TabsTrigger value='password'>Comments</TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          {/* <Feed posts={posts} isLoading={isLoadingPosts} /> */}

          <UserPostList
            posts={posts}
            isLoading={isLoadingPosts}
            onSelect={handleSelectPost}
          />
        </TabsContent>
        <TabsContent value='password'>
          <div>
            <p>content 2</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

type ListProps = {
  isLoading: boolean;
  posts: PostType[];
  onSelect: (id: string) => void;
};

function UserPostList(props: ListProps) {
  return (
    <div className='w-full h-screen mt-5 flex justify-start'>
      <ul className='w-5/6'>
        {props.posts.map((post, index) => (
          <li
            key={`${post.id}-${index}`}
            onClick={() => props.onSelect(post.id)}
          >
            <div className='flex bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800  items-center text-card-foreground shadow h-16  p-5 rounded-md mb-2 cursor-pointer'>
              <Avatar className='h-9 w-9 mr-2'>
                <AvatarImage src={post.profile.avatarURL} alt='@profilePic' />
                <AvatarFallback>{post.profile.name}</AvatarFallback>
              </Avatar>
              <div className='w-full flex justify-between text-sm '>
                <p className='ml-2 text-sm font-semibold'>{post.title}</p>

                <p className='text-sm'>{post.createdAt}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
