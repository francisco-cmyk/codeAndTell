import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import { Bold, Italic, Strikethrough, Code, Link2 } from "lucide-react";
import Link from "@tiptap/extension-link";
import { Popover, PopoverContent, PopoverTrigger } from "../ui-lib/Popover";
import { Input } from "../ui-lib/Input";
import { Button } from "../ui-lib/Button";
import { useAuthContext } from "../../context/auth";

const ToolbarType = {
  bold: "bold",
  code: "code",
  italic: "italic",
  link: "link",
  strike: "strike",
} as const;

type ToolbarType = keyof typeof ToolbarType;

const Variant = {
  big: "editor-content",
  mid: "editor-content-mid", //TODO: implement
  small: "editor-content-small",
} as const;

type VariantType = keyof typeof Variant;

type EditorProps = {
  value?: string;
  variant?: VariantType;
  showSubmit?: boolean;
  onChange?: (content: string) => void;
  onSubmit?: (content?: string) => void;
};
export default function TiptapEditor(props: EditorProps) {
  const { isAuthenticated } = useAuthContext();
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");

  const variant = props.variant ? Variant[props.variant] : Variant.big;

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
        defaultProtocol: "https",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);
      if (props.onChange) {
        props.onChange(html);
      }
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  useEffect(() => {
    if (!editor) return;
    if (!content && props.value) {
      editor.commands.setContent(props.value);
    }
  }, [props.value, editor]);

  function setLink() {
    if (!editor) return;

    const newUrl = url;

    if (newUrl === null) {
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: newUrl })
      .run();
  }

  function handleToolbarClick(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: ToolbarType
  ) {
    event.preventDefault(); // Need this to stop Form trigger
    if (!editor) return;

    switch (type) {
      case ToolbarType.bold: {
        editor.chain().focus().toggleBold().run();
        return;
      }
      case ToolbarType.code: {
        editor.chain().focus().setCode().run();
        return;
      }
      case ToolbarType.italic: {
        editor.chain().focus().toggleItalic().run();
        return;
      }
      case ToolbarType.link: {
        setLink();
        return;
      }
      case ToolbarType.strike: {
        editor.chain().focus().toggleStrike().run();
        return;
      }
    }
  }

  function handleSubmitText(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    if (!editor) return;
    if (props.onSubmit) {
      props.onSubmit(content);
      editor.commands.setContent("");
    }
  }

  function handleClearEditor(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event.preventDefault();

    if (!editor) return;

    editor.commands.setContent("");
  }

  if (!editor) return null;

  return (
    <div className='p-2 border w-full rounded-lg shadow-md min-h-36 max-h-96 overflow-y-auto'>
      <div className='flex gap-2 mb-1 border-b pb-1'>
        <button
          className={`p-1 ${
            editor.isActive("bold") ? "bg-gray-300 dark:bg-zinc-700" : ""
          }`}
          onClick={(event) => handleToolbarClick(event, ToolbarType.bold)}
        >
          <Bold size={15} />
        </button>
        <button
          className={`p-1 ${
            editor.isActive("italic") ? "bg-gray-300 dark:bg-zinc-700" : ""
          }`}
          onClick={(event) => handleToolbarClick(event, ToolbarType.italic)}
        >
          <Italic size={15} />
        </button>
        <button
          className={`p-1 ${
            editor.isActive("strike") ? "bg-gray-300 dark:bg-zinc-700" : ""
          }`}
          onClick={(event) => handleToolbarClick(event, ToolbarType.strike)}
        >
          <Strikethrough size={15} />
        </button>
        <button
          disabled={editor.isActive("code")}
          className={`p-1 ${
            editor.isActive("code") ? "bg-gray-300 dark:bg-zinc-700" : ""
          }`}
          onClick={(event) => handleToolbarClick(event, ToolbarType.code)}
        >
          <Code size={15} />
        </button>
        <Popover>
          <PopoverTrigger>
            <Link2
              className={`m-1 ${
                editor.isActive("link") ? "bg-gray-300 dark:bg-zinc-700" : ""
              }`}
              size={15}
            />
          </PopoverTrigger>
          <PopoverContent className='flex flex-col space-y-2'>
            <Input
              type='text'
              placeholder='enter link url'
              value={url}
              onChange={(e) => {
                e.preventDefault(), setUrl(e.target.value);
              }}
            />

            <Button
              onClick={(event) => handleToolbarClick(event, ToolbarType.link)}
            >
              Save
            </Button>
          </PopoverContent>
        </Popover>
      </div>
      <EditorContent editor={editor} className={variant} />
      {props.showSubmit ?? (
        <div className='w-full flex justify-end mt-2 '>
          <Button
            size='sm'
            variant='outline'
            onClick={(e) => handleClearEditor(e)}
          >
            clear
          </Button>
          <Button
            size='sm'
            className='ml-2'
            disabled={!isAuthenticated}
            onClick={(e) => handleSubmitText(e)}
          >
            send
          </Button>
        </div>
      )}
    </div>
  );
}
