import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { showToast, urlToFile } from "../../lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui-lib/Tabs";
import { Button } from "../ui-lib/Button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
  FormControl,
  Form,
} from "../ui-lib/Form";
import { Input } from "../ui-lib/Input";
import { MultiSelect } from "../ui-lib/MultiSelect";
import DragAndDrop from "./DragAndDrop";
import TiptapEditor from "./TipTapEditor";
import { SinglePostType } from "../../lib/types";

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
  post?: SinglePostType;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
};

const formSchema = z.object({
  title: z.string().min(2, "Title must be atleast 2 characters").max(50),
  description: z.string().min(2, "Please add a description").max(5000),
  media: z.array(z.any()),
  badges: z.string().array().min(1, "Select atleast once badge").max(3),
});

export default function PostForm({ post, onSubmit }: FormProps) {
  const [activeTab, setActiveTab] = useState("text");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      badges: [],
      media: [],
    },
  });

  const { formState, setValue, watch, reset } = form;
  const { errors } = formState;
  const mediaFiles = watch("media");
  const badges = watch("badges");

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
        post.mediaUrl.map((url, index) => urlToFile(url, post.mediaType[index]))
      );

      reset((prevValues) => ({
        ...prevValues,
        title: post.title ?? "",
        description: post.description ?? "",
        badges: post.badges ?? [],
        media: files,
      }));
    }

    convertUrlToFile();
  }, [post, reset]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='w-3/4 space-y-4 min-h-full'
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2 h-10 mb-3'>
            <TabsTrigger value='text'>Text</TabsTrigger>
            <TabsTrigger value='multimedia'>Multimedia</TabsTrigger>
          </TabsList>
          <TabsContent value='text' className='min-h-fit'>
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
          </TabsContent>
          <TabsContent value='multimedia' className='min-h-[400px]'>
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
                      onChange={(files) => setValue("media", files)}
                    />
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
