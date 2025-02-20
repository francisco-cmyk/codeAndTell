import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui-lib/Avatar";
import { z } from "zod";
import { useAuthContext } from "../context/auth";
import useGetUserPosts from "../hooks/useGetUserPosts";
import { useEffect } from "react";
import Feed from "../components/custom-ui/Feed";
import { useSearchParams } from "react-router-dom";
import useGetUserCommentByPostID from "../hooks/useGetUserCommentByPostID";
import { keyBy } from "lodash";
import CommentsSection from "../components/custom-ui/CommentSection";
import useGetAllUserComments from "../hooks/useGetAllUserComments";
import { getArrayDiff, showToast } from "../lib/utils";
import PostForm from "../components/custom-ui/PostForm";
import { ChevronLeft, Loader2Icon } from "lucide-react";
import useEditPost from "../hooks/useEditPost";
import { formSchema } from "../lib/schemas";
import { MediaPayload } from "../lib/types";
import useGetUserPostByID from "../hooks/useGetPostByID";
import useUploadMedia from "../hooks/useUploadMedia";
import { useQueryClient } from "@tanstack/react-query";

const View = {
  posts: "posts",
  comments: "comments",
  tags: "tags",
  edit: "edit",
} as const;

type View = keyof typeof View;

type Tabs = {
  label: string;
  value: View;
  onClick: () => void;
};

export default function UserPosts() {
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setIsLoginOpen } = useAuthContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const viewTab = searchParams.get("tab") ?? View.posts;
  const selectedPostIDSearchParam = searchParams.get("postID") ?? "";

  const { data: posts = [], isLoading: isLoadingPosts } = useGetUserPosts({
    userID: user.id,
  });
  const { data: post, isLoading: isLoadingPost } = useGetUserPostByID({
    userID: user.id,
    postID: selectedPostIDSearchParam,
  });

  const { data: _comments = [], isLoading: isLoadingComments } =
    useGetUserCommentByPostID({
      userID: user.id,
      postID: selectedPostIDSearchParam,
    });
  const { data: allComments = [], isLoading: isLoadingAllComments } =
    useGetAllUserComments({
      userID: user.id,
      postID: selectedPostIDSearchParam,
    });
  const comments = _comments.length > 0 ? _comments : allComments;

  const { mutate: editPost, isPending: isLoadingEditPost } = useEditPost();
  const uploadMedia = useUploadMedia();

  useEffect(() => {
    if (isAuthenticated) return;

    const hasModalBeenShown = sessionStorage.getItem("hasModalBeenShown");

    if (!hasModalBeenShown) {
      showToast({
        type: "info",
        message: "Please sign in to see your posts",
        toastId: "signInInfo",
      });
      setIsLoginOpen(true);
      sessionStorage.setItem("hasModalBeenShown", "true");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!searchParams.has("tab")) {
      setSearchParams({ tab: "posts" });
    }
  }, []);

  const postKeyedById = keyBy(posts, "id");

  function handleSelectedComments(id: string) {
    setSearchParams({ tab: View.comments, postID: id });
  }
  function handleSelectEditPost(id: string) {
    setSearchParams({ tab: View.edit, postID: id });
  }

  function removeSearchParam() {
    const newParams = new URLSearchParams();
    newParams.set("tabs", "posts");
    setSearchParams(newParams, { replace: true });
  }

  //TODO: THIS IS BROKEN ~ NEED TO FIX
  async function handleSubmitEditPost(values: z.infer<typeof formSchema>) {
    if (!selectedPostIDSearchParam || !post) return;

    let uploadedUrls: string[] = post.mediaSource || [];

    const media: MediaPayload = {
      mediaType: null,
      mediaSource: null,
      mediaName: null,
      mediaSize: null,
    };

    let mediaValues = values.media; //Base changes on this var
    const mediaNames = mediaValues.map((media) => media.name);
    const { added, removed } = getArrayDiff(post.mediaName, mediaNames);

    //1. ** Handle removed files **
    if (removed.length > 0) {
      mediaValues = mediaValues.filter(
        (media: File) => !removed.includes(media.name)
      );

      uploadedUrls = uploadedUrls.filter((url) => {
        const extractedFilename = url.replace(/^\d+_/, ""); // remove timestamp
        return !removed.includes(extractedFilename);
      });
    }

    // 2. ** Upload new files**
    if (added.length > 0) {
      const newFiles = mediaValues.filter((media: File) =>
        added.includes(media.name)
      );

      if (newFiles.length > 0) {
        const uploadedMedia = await uploadMedia.mutateAsync({
          media: newFiles,
        });

        uploadedUrls = [...uploadedUrls, ...uploadedMedia];
      }
    }

    // 3. ** Map final media object **
    media.mediaType = mediaValues.map((file) => file.type);
    media.mediaSize = mediaValues.map((file) => file.size);
    media.mediaName = mediaValues.map((file) => file.name);
    media.mediaSource = uploadedUrls;

    editPost(
      {
        userID: user.id,
        postID: selectedPostIDSearchParam,
        title: values.title,
        description: values.description,
        badges: values.badges,
        ...media,
      },
      {
        onSuccess: () => {
          setTimeout(() => removeSearchParam(), 1000);
          queryClient.invalidateQueries({ queryKey: ["user-posts"] });
        },
      }
    );
  }

  function renderContent() {
    switch (viewTab) {
      case View.posts: {
        return (
          <Feed
            posts={posts}
            isLoading={isLoadingPosts}
            onCommentSelect={handleSelectedComments}
            onPostEdit={handleSelectEditPost}
            isUserPost
          />
        );
      }
      case View.comments: {
        return (
          <CommentsSection
            comments={comments}
            isLoading={isLoadingComments || isLoadingAllComments}
            post={postKeyedById[selectedPostIDSearchParam]}
          />
        );
      }
      case View.edit: {
        return (
          <div className='w-full h-screen flex flex-col items-center pt-8'>
            {(isLoadingEditPost || isLoadingPost) && (
              <Loader2Icon size={60} className='absolute animate-spin' />
            )}
            <div className='w-3/4  flex justify-start'>
              <div
                className='flex w-40 text-xs dark:hover:bg-zinc-700 hover:bg-zinc-400 mb-2 p-2 rounded-lg'
                onClick={removeSearchParam}
              >
                <ChevronLeft size={15} />
                <p>go back to posts</p>
              </div>
            </div>
            <PostForm
              post={post}
              onSubmit={(values) => handleSubmitEditPost(values)}
            />
          </div>
        );
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
      onClick: () => setSearchParams({ tab: View.posts }),
    },
    {
      label: "comments",
      value: View.comments,
      onClick: () => setSearchParams({ tab: View.comments }),
    },
    {
      label: "tags",
      value: View.tags,
      onClick: () => setSearchParams({ tab: View.tags }),
    },
  ];

  return (
    <div className='w-full h-screen flex'>
      <div className='flex-1'>{renderContent()}</div>

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
              viewTab === tab.value
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
    <div className=' w-full h-full  p-6 flex justify-center'>
      <p>Tags</p>
    </div>
  );
}
