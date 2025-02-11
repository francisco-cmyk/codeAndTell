import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui-lib/Avatar";
import { useAuthContext } from "../context/auth";
import useGetUserPosts from "../hooks/useGetUserPosts";
import { useEffect, useState } from "react";
import getMergeState from "../lib/utils";
import Feed from "../components/custom-ui/Feed";
import { toast } from "react-toastify";

const View = {
  posts: "posts",
  comments: "comments",
  tags: "tags",
} as const;

type View = keyof typeof View;

type Tabs = {
  label: string;
  value: View;
  onClick: () => void;
};

type State = {
  selectedID: string | null;
  viewTab: View;
};

const initialState: State = {
  selectedID: null,
  viewTab: View.posts,
};

export default function UserPosts() {
  const { user, isAuthenticated, setIsLoginOpen } = useAuthContext();

  const [state, setState] = useState(initialState);
  const mergeState = getMergeState(setState);

  const { data: posts = [], isLoading: isLoadingPosts } = useGetUserPosts({
    userID: user.id,
  });

  useEffect(() => {
    if (isAuthenticated) return;

    const hasModalBeenShown = sessionStorage.getItem("hasModalBeenShown");

    if (!hasModalBeenShown) {
      toast.info("Please sign in to see your posts", {
        toastId: "signInInfo",
      });
      setIsLoginOpen(true);
      sessionStorage.setItem("hasModalBeenShown", "true");
    }
  }, [isAuthenticated]);

  // const postKeyedById = keyBy(posts, "id");
  // const selectedPost = postKeyedById[state.selectedID ?? ""];

  // function handleSelectPost(id: string) {
  //   mergeState({ selectedID: id });
  // }

  function renderContent() {
    switch (state.viewTab) {
      case View.posts: {
        return <Feed posts={posts} isLoading={isLoadingPosts} />;
      }
      case View.comments: {
        return <CommentsSection />;
      }
      case View.tags: {
        return <TagsSection />;
      }
    }
  }

  const tabs: Tabs[] = [
    {
      label: "posts",
      value: View.posts,
      onClick: () => mergeState({ viewTab: View.posts }),
    },
    {
      label: "comments",
      value: View.comments,
      onClick: () => mergeState({ viewTab: View.comments }),
    },
    {
      label: "tags",
      value: View.tags,
      onClick: () => mergeState({ viewTab: View.tags }),
    },
  ];

  return (
    <div className={`w-full h-screen flex `}>
      <div className='overflow-y-auto flex-1'>{renderContent()}</div>

      <div className='h-screen w-80 px-4 border-l'>
        <div className='flex w-full items-center h-24'>
          <Avatar className='h-12 w-12 dark:bg-slate-300 mr-4'>
            <AvatarImage className='border-2' src={user.avatarUrl} />
            <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <div className='flex flex-col'>
            <p className='font-semibold text-1xl'>{user.name}</p>
            <p className='text-sm text-foreground'>{user.email}</p>
          </div>
        </div>
        {tabs.map((tab, index) => (
          <div
            key={`${tab.label}-${index}`}
            className={`group flex h-8 w-full items-center justify-start rounded-lg px-2 font-normal text-foreground underline-offset-2 hover:bg-slate-200 dark:hover:bg-accent hover:text-accent-foreground mb-1 ${
              state.viewTab === tab.value
                ? "bg-slate-200 hover:bg-slate-300 dark:bg-accent"
                : ""
            }`}
            onClick={tab.onClick}
          >
            {tab.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function TagsSection() {
  return (
    <div className=' w-full h-full  p-6 flex'>
      <p>Tags</p>
    </div>
  );
}

function CommentsSection() {
  return (
    <div className=' w-full h-full  p-6 flex'>
      <p>Comments</p>
    </div>
  );
}
