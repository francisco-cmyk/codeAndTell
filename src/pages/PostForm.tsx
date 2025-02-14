import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../components/ui-lib/Button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../components/ui-lib/Form";
import { Input } from "../components/ui-lib/Input";
import { MultiSelect } from "../components/ui-lib/MultiSelect";
import { useAuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import useNewPost from "../hooks/useNewPost";
import TiptapEditor from "../components/custom-ui/TipTapEditor";
import { Loader2Icon } from "lucide-react";
import DragAndDrop from "../components/custom-ui/DragAndDrop";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui-lib/Tabs";
import { useEffect } from "react";
import { showToast } from "../lib/utils";

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

export default function PostForm() {
  const navigate = useNavigate();

  const formSchema = z.object({
    title: z.string().min(2, "Title must be atleast 2 characters").max(50),
    description: z.string().min(2, "Please add a description").max(5000),
    media: z.array(z.any()),
    badges: z.string().array().min(1, "Select atleast once badge").max(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      media: [],
      badges: [],
    },
  });

  const { setValue, watch, formState } = form;
  const { errors } = formState;
  const mediaFiles = watch("media");

  const { user } = useAuthContext();
  const { mutate: newPost, isPending: isLoadingNewPost } = useNewPost();

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

  function createPost(values: z.infer<typeof formSchema>) {
    newPost(
      {
        userID: user.id,
        title: values.title,
        description: values.description,
        badges: values.badges,
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
      <div className='2xl:w-full w-5/6 flex justify-center'>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(createPost)}
            className='w-2/4 space-y-4 min-h-full'
          >
            <Tabs defaultValue='text'>
              <TabsList className='grid w-full grid-cols-2'>
                <TabsTrigger value='text'>Text</TabsTrigger>
                <TabsTrigger value='multimedia'>Multimedia</TabsTrigger>
              </TabsList>
              <TabsContent value='text' className='min-h-fit'>
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
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
                      <FormLabel>Description</FormLabel>
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
                      <FormLabel>Badges</FormLabel>
                      <MultiSelect
                        options={tagList}
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
                      <FormLabel>Media</FormLabel>
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
      </div>
    </div>
  );
}
