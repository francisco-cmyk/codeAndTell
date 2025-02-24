import { z } from "zod";
import { useAuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { Loader2Icon } from "lucide-react";
import useUploadMedia from "../hooks/useUploadMedia";
import PostForm from "../components/custom-ui/PostForm";
import { formSchema } from "../lib/schemas";
import { MediaPayload } from "../lib/types";
import useCreatePost from "../hooks/useCreatePost";
import { getLinkType } from "../lib/utils";

export default function PostFormPage() {
  const navigate = useNavigate();

  const { user } = useAuthContext();
  const { mutate: createPost, isPending: isLoadingNewPost } = useCreatePost();
  const uploadMedia = useUploadMedia();

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    let uploadedUrls: string[] = [];

    const media: MediaPayload = {
      mediaType: null,
      mediaSource: null,
      mediaName: null,
      mediaSize: null,
    };

    if (values.media && values.media.length > 0) {
      uploadedUrls = await uploadMedia.mutateAsync({ media: values.media });

      media.mediaType = values.media.map((file) => file.type); // MIME types
      media.mediaSize = values.media.map((file) => file.size); // File sizes in bytes
      media.mediaName = values.media.map((file) => file.name); // File names
      media.mediaSource = uploadedUrls;
    }

    if (values.mediaLink && values.mediaLink.length > 0) {
      const link = values.mediaLink;
      const type = getLinkType(link);
      media.mediaType = [type];
      media.mediaSource = [link];
      media.mediaName = [link];
      media.mediaSize = null;
    }

    createPost(
      {
        userID: user.id,
        title: values.title,
        description: values.description,
        badges: values.badges,
        getHelp: values.getHelp,
        ...media,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate("/");
          }, 1000);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }

  return (
    <div className='flex-grow relative h-full w-full flex justify-center pt-10 overflow-y-auto'>
      {isLoadingNewPost && (
        <Loader2Icon size={40} className='absolute animate-spin' />
      )}
      <div className='w-full h-full flex justify-center'>
        <PostForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
