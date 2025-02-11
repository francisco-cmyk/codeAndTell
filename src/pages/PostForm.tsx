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
import { Textarea } from "../components/ui-lib/TextArea";
import { MultiSelect } from "../components/ui-lib/MultiSelect";
import { useAuthContext } from "../context/auth";
import { useNavigate } from "react-router-dom";
import useNewPost from "../hooks/useNewPost";
import { toast } from "react-toastify";

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
  const formSchema = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(300),
    badges: z.string().array().min(1).max(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      badges: [],
    },
  });

  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuthContext();
  const { mutate: newPost } = useNewPost();

  function createPost(values: z.infer<typeof formSchema>) {
    if (!values.title) {
      toast.error(`Error submitting your post:, Please include a title.`, {
        toastId: "newPostError",
      });

    }

    newPost(
      {
        userID: user.id,
        title: values.title,
        description: values.description,
        badges: values.badges
      },
      {
        onSuccess: () => {
          navigate('/');
        },
      }
    )
  }

  return (
    <div className='flex-grow h-screen flex flex-col justify-center items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createPost)} className='w-2/4 space-y-4'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='' {...field} />
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
                  Tell us all about this thing.
                </FormDescription>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder=''
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='badges'
            render={({ field }) => (
              <FormItem>
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
          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
