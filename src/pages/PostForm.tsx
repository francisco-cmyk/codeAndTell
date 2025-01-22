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
import { useState } from "react";
import { Cat, Dog, Fish, Rabbit, Turtle } from "lucide-react";

const tagList = [
  { value: "discrod", label: "discrod", icon: Turtle },
  { value: "torture", label: "torture", icon: Cat },
  { value: "fun", label: "fun", icon: Dog },
  { value: "easy", label: "easy", icon: Rabbit },
  { value: "dev hell", label: "dev hell", icon: Fish },
];


export default function PostForm() {
  const [selectedTags, setSelectedTags] = useState<string[]>(["discrod", "torture"]);

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
                  onValueChange={setSelectedTags}
                  defaultValue={selectedTags}
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
