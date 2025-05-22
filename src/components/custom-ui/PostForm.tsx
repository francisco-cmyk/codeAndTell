import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { getEmbedURL, showToast, urlToFile } from "../../lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui-lib/Tabs";
import { Button } from "../ui-lib/Button";
import { Checkbox } from "../ui-lib/Checkbox";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  Form,
  FormMessage,
} from "../ui-lib/Form";
import { Input } from "../ui-lib/Input";
import { MultiSelect } from "../ui-lib/MultiSelect";
import DragAndDrop from "./DragAndDrop";
import TiptapEditor from "./TipTapEditor";
import { PostType } from "../../lib/types";

const tagList = [
  { value: "discord", label: "discord" },
  { value: "slack", label: "slack" },
  { value: "1-2 Devs", label: "1-2 Devs" },
  { value: "2-3 Devs", label: "2-3 Devs" },
  { value: "3-4 Devs", label: "3-4 Devs" },
  { value: "4+ Devs", label: "4+ Devs" },
  { value: "easy", label: "easy" },
  { value: "medium", label: "medium" },
  { value: "hard", label: "hard" },
];

type FormProps = {
  post?: PostType;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

const formSchema = z.object({
  title: z.string().min(2, "Title must be atleast 2 characters").max(50),
  description: z.string().min(2, "Please add a description").max(5000),
  media: z.array(z.any()),
  badges: z.string().array().min(1, "Select at least once badge").max(3),
  getHelp: z.boolean(),
  mediaLink: z.string().optional(),
});

export default function PostForm({ post, onSubmit }: FormProps) {
  const [activeTab, setActiveTab] = useState("text");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      badges: [],
      getHelp: undefined,
      media: [],
      mediaLink: "",
    },
  });

  const { formState, setValue, watch, reset } = form;
  const { errors } = formState;
  const mediaFiles = watch("media");
  const badges = watch("badges");
  const mediaLink = watch("mediaLink");

  //
  // Side Effect
  //

  useEffect(() => {
    if (Object.keys(errors).length === 0) return;

    Object.entries(errors).map(([key, error]) => {
      showToast({
        type: "warning",
        message: error.message ?? "invalid field",
        toastId: key,
      });
    });
  }, [errors]);

  useEffect(() => {
    async function convertUrlToFile() {
      if (!post) {
        return;
      }

      const files = await Promise.all(
        post.media.map((mediaItem) =>
          urlToFile(mediaItem.mediaUrl, mediaItem.mediaName)
        )
      );

      reset((prevValues) => ({
        ...prevValues,
        title: post.title ?? "",
        description: post.description ?? "",
        badges: post.badges ?? [],
        media: files,
        mediaLink: post.media[0].mediaSource,
      }));
    }

    convertUrlToFile();
  }, [post, reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='w-3/4 space-y-4'>
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 h-10 mb-3'>
            <TabsTrigger value='text'>Text</TabsTrigger>
            <TabsTrigger value='multimedia'>Multimedia</TabsTrigger>
          </TabsList>
          <TabsContent value='text' className='min-h-fit p-1'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel id='title'>Title</FormLabel>
                  <FormDescription>make it catchy!</FormDescription>
                  <FormControl>
                    <div>
                      <Input placeholder='' {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel id='description'>Description</FormLabel>
                  <FormDescription>
                    tell us all about this thing.
                  </FormDescription>
                  <FormControl>
                    <TiptapEditor
                      value={field.value}
                      onChange={field.onChange}
                      showSubmit={false}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='badges'
              render={() => (
                <FormItem className='mt-2'>
                  <FormLabel id='badges'>Badges</FormLabel>
                  <MultiSelect
                    options={tagList}
                    defaultValue={badges}
                    onValueChange={(value) => {
                      form.setValue("badges", value);
                    }}
                    placeholder='Select badges'
                    variant='inverted'
                    animation={2}
                    maxCount={3}
                  />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='getHelp'
              render={({ field }) => (
                <FormItem className='mt-2 flex flex-row items-center'>
                  <FormLabel id='getHelp' className=''>
                    Need Help?
                  </FormLabel>
                  <Checkbox
                    className=''
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <FormMessage className='ml-4 text-lime-500'>
                    When your question is answered, remember to edit your post
                    and mark it as resolved!
                  </FormMessage>
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent
            value='multimedia'
            className='h-[calc(100vh-400px)] p-1 overflow-y-auto'
          >
            <FormField
              control={form.control}
              name='media'
              render={() => (
                <FormItem>
                  <FormLabel id='media'>Media</FormLabel>
                  <FormDescription>
                    Add cool pictures or videos showcasing your work
                  </FormDescription>
                  <FormControl>
                    <DragAndDrop
                      values={mediaFiles}
                      link={mediaLink}
                      onChange={(files) => setValue("media", files)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='mediaLink'
              render={({ field }) => (
                <FormItem className='mt-2'>
                  <FormLabel id='mediaLink'>Video URL</FormLabel>
                  <FormDescription>Or link a snazzy video</FormDescription>
                  <FormControl>
                    <div className='w-full flex flex-col items-center justify-start'>
                      <Input
                        placeholder='paste video link (Youtube, Vimeo, MP4)..'
                        type='text'
                        value={field.value}
                        onChange={field.onChange}
                      />
                      {mediaLink && (
                        <div className='relative w-full h-96 rounded-lg overflow-hidden pt-2'>
                          {mediaLink.includes("youtube.com") ||
                          mediaLink.includes("vimeo.com") ? (
                            <iframe
                              src={getEmbedURL(mediaLink)}
                              allowFullScreen
                              className=' inset-0 w-full h-full'
                              loading='lazy'
                            />
                          ) : (
                            <video
                              src={mediaLink}
                              controls
                              className='w-full h-auto rounded-lg shadow-md'
                            />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </TabsContent>

          <Button type='submit' className='mt-10'>
            Submit
          </Button>
        </Tabs>
      </form>
    </Form>
  );
}
