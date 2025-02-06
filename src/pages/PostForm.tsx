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
  FormMessage,
} from "../components/ui-lib/Form";
import { Input } from "../components/ui-lib/Input";
import { Textarea } from "../components/ui-lib/TextArea";
import { MultiSelect } from "../components/ui-lib/MultiSelect";

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
    outburst: z.string().min(2).max(50),
    body: z.string().min(2).max(50),
    tags: z.string().array().min(1).max(3),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      outburst: "",
      body: "",
      tags: []
    }
  });

  function createPost(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <div className='flex-grow h-screen flex flex-col justify-center items-center'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(createPost)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="title" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="outburst"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Outburst</FormLabel>
                <FormDescription>
                  Write a short eye-catching description of your project.
                </FormDescription>
                <FormControl>
                  <Input placeholder="outburst" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Body</FormLabel>
                <FormControl>
                  <Textarea placeholder="tell us kind of a long story about your project..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <MultiSelect
                  options={tagList}
                  onValueChange={(value) => {
                    form.setValue("tags", value)
                  }}
                  placeholder="Select tags"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
