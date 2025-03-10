declare let remark : any;
import React, {
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useRef,
  useLayoutEffect,
  useContext,
} from "react";
import { Editor, Range, Extension } from "@tiptap/core";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import { useCompletion } from "ai/react";
import tippy from "tippy.js";
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Text,
  TextQuote,
  Image as ImageIcon,
  Code,
  CheckSquare,
  NewspaperIcon,
  DownloadIcon,
  UploadIcon,
  BombIcon,
  MaximizeIcon,
  ProjectorIcon,
  FileTextIcon
} from "lucide-react";
import { LoadingCircle } from "@/ui/icons";
import { toast } from "sonner";
import va from "@vercel/analytics";
import { Magic } from "@/ui/icons";
import { getPrevText } from "@/lib/editor";
import { startImageUpload } from "@/ui/editor/plugins/upload-images";
import { NovelContext } from "../provider";

interface CommandItemProps {
  title: string;
  description: string;
  icon: ReactNode;
}

interface CommandProps {
  editor: Editor;
  range: Range;
}

const Command = Extension.create({
  name: "slash-command",
  addOptions() {
    return {
      suggestion: {
        char: "/",
        command: ({
          editor,
          range,
          props,
        }: {
          editor: Editor;
          range: Range;
          props: any;
        }) => {
          props.command({ editor, range });
        },
      },
    };
  },
  addProseMirrorPlugins() {
    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),
    ];
  },
});

const getSuggestionItems = ({ query }: { query: string }) => {
  return [
    {
      title: "Text",
      description: "Just start typing with plain text.",
      searchTerms: ["p", "paragraph"],
      icon: <Text size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .run();
      },
    },
    {
      title: "To-do List",
      description: "Track tasks with a to-do list.",
      searchTerms: ["todo", "task", "list", "check", "checkbox"],
      icon: <CheckSquare size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleTaskList().run();
      },
    },
    {
      title: "Heading 1",
      description: "Big section heading.",
      searchTerms: ["title", "big", "large"],
      icon: <Heading1 size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 1 })
          .run();
      },
    },
    {
      title: "Heading 2",
      description: "Medium section heading.",
      searchTerms: ["subtitle", "medium"],
      icon: <Heading2 size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 2 })
          .run();
      },
    },
    {
      title: "Heading 3",
      description: "Small section heading.",
      searchTerms: ["subtitle", "small"],
      icon: <Heading3 size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .setNode("heading", { level: 3 })
          .run();
      },
    },
    {
      title: "Bullet List",
      description: "Create a simple bullet list.",
      searchTerms: ["unordered", "point"],
      icon: <List size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleBulletList().run();
      },
    },
    {
      title: "Numbered List",
      description: "Create a list with numbering.",
      searchTerms: ["ordered"],
      icon: <ListOrdered size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).toggleOrderedList().run();
      },
    },
    {
      title: "Quote",
      description: "Capture a quote.",
      searchTerms: ["blockquote"],
      icon: <TextQuote size={18} />,
      command: ({ editor, range }: CommandProps) =>
        editor
          .chain()
          .focus()
          .deleteRange(range)
          .toggleNode("paragraph", "paragraph")
          .toggleBlockquote()
          .run(),
    },
    {
      title: "Code",
      description: "Capture a code snippet.",
      searchTerms: ["codeblock"],
      icon: <Code size={18} />,
      command: ({ editor, range }: CommandProps) =>
        editor.chain().focus().deleteRange(range).toggleCodeBlock().run(),
    },
    {
      title: "Image",
      description: "Up an image from your computer.",
      searchTerms: ["photo", "picture", "media"],
      icon: <ImageIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        // upload image
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
          if (input.files?.length) {
            const file = input.files[0];
            const pos = editor.view.state.selection.from;
            startImageUpload(file, editor.view, pos);
          }
        };
        input.click();
      },
    },
{
  title: "save",
  description: "Save as tale file.",
  searchTerms: ["save", "tale"],
  icon: <DownloadIcon size={18} />,
  command: async ({ editor, range }: CommandProps) => {
    editor.chain().focus().deleteRange(range).run();
    const json = localStorage.getItem("novel__content");
    if(json){
      const opts = {
        suggestedName: 'document',
        types: [{
          accept: {'text/plain': ['.tale']},
        }],
      };
      const handle = await (window as any).showSaveFilePicker(opts);
      const writable = await handle.createWritable()
      await writable.write(json)
      await writable.close()
    }
  },
},
{
  title: "load",
  description: "Loads data stored in tale format.",
  searchTerms: ["load", "upload","tale"],
  icon: <UploadIcon size={18} />,
  command: ({ editor, range }: CommandProps) => {
    editor.chain().focus().deleteRange(range).run();
    const input = document.createElement('input');
    input.type="file";
    input.id="upload_file";
    input.accept=".tale"
    input.click(); // クリックイベントを発生させる

    var fileReader = new FileReader();

    input.addEventListener('change', function(){
      if(input.files){
        fileReader.readAsText(input.files[0]);

      }
    });
    fileReader.addEventListener("loadend", (event) => {
      if(event.target){
        let json :any;
        json = event.target.result;
        localStorage.setItem("novel__content",json);
        location.reload();
      }
    });
  },
},
    {
      title: "export",
      description: "Export markdown with image.",
      searchTerms: ["export", "markdown", "build"],
      icon: <NewspaperIcon size={18} />,
      command: ({ editor , range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        const id = Math.random().toString(32).substring(2);
        let editorContent = editor.storage.markdown.getMarkdown();
        let req = /\(data:image.*?\)/g //base64化された画像のみ()ごと抜き出す
        let imgs = editorContent.match(req);
        for(let i in imgs){
          var a = document.createElement("a"); //Create <a>
          let base64 = imgs[i].slice(1);
          base64 = base64.slice(0,-1)
          a.href = base64 //Image Base64 Goes here
          a.download = i + "-" + id +".png"; //File name Here
          a.click(); //Downloaded file

          editorContent = editorContent.replace(base64+")",i+ "-"+id+".png)\n")
        }


        const blob = new Blob([editorContent], {type: 'text/plain'}); // Blob オブジェクトの作成
        const link = document.createElement('a');
        link.download = 'tale-'+id+'.md'; // ダウンロードファイル名称
        link.href = URL.createObjectURL(blob); // オブジェクト URL を生成
        link.click(); // クリックイベントを発生させる
      },
    },
    {
      title: "clear",
      description: "clear document",
      searchTerms: ["clear"],
      icon: <BombIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        editor.commands.clearContent();
      },
    },
    {
      title: "fullscreen",
      description: "fullscreen editor",
      searchTerms: ["fullscreen"],
      icon: <MaximizeIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        let editordom = document.getElementsByClassName("novel-relative");
        (editordom as any)[0].requestFullscreen();
      },
    },
    {
      title: "presentation",
      description: "start presentation",
      searchTerms: ["slide","presentation"],
      icon: <ProjectorIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        let editorContent = editor.storage.markdown.getMarkdown();
        remark.create({
          ratio: "16:9",
          navigation: {
            scroll: false,
          },
          source: editorContent,
          highlightStyle: 'github',
          container: document.getElementById('slide')
        });
        let editordom = document.getElementById("slide");
        editordom?.requestFullscreen();
      },
    },
    {
      title: "restart",
      description: "restart",
      searchTerms: ["restart"],
      icon: <ProjectorIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        editor.chain().focus().deleteRange(range).run();
        let editordom = document.getElementById("slide");
        editordom?.requestFullscreen();
      },
    },
    {
      title: "create pdf",
      description: "make pdf",
      searchTerms: ["pdf"],
      icon: <FileTextIcon size={18} />,
      command: ({ editor, range }: CommandProps) => {
        if(window.confirm("make pdf?")){
          editor.chain().focus().deleteRange(range).run();
          let editorContent = editor.storage.markdown.getMarkdown();
          document.body.innerHTML = "";
          remark.create({
            ratio: "16:9",
            navigation: {
              scroll: false,
            },
            source: editorContent,
            highlightStyle: 'github',
          });
          window?.print();
        }
      },
    }
  ].filter((item) => {
    if (typeof query === "string" && query.length > 0) {
      const search = query.toLowerCase();
      return (
        item.title.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        (item.searchTerms &&
          item.searchTerms.some((term: string) => term.includes(search)))
      );
    }
    return true;
  });
};

export const updateScrollView = (container: HTMLElement, item: HTMLElement) => {
  const containerHeight = container.offsetHeight;
  const itemHeight = item ? item.offsetHeight : 0;

  const top = item.offsetTop;
  const bottom = top + itemHeight;

  if (top < container.scrollTop) {
    container.scrollTop -= container.scrollTop - top + 5;
  } else if (bottom > containerHeight + container.scrollTop) {
    container.scrollTop += bottom - containerHeight - container.scrollTop + 5;
  }
};

const CommandList = ({
  items,
  command,
  editor,
  range,
}: {
  items: CommandItemProps[];
  command: any;
  editor: any;
  range: any;
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { completionApi } = useContext(NovelContext);

  const { complete, isLoading } = useCompletion({
    id: "novel",
    api: completionApi,
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        va.track("Rate Limit Reached");
        return;
      }
      editor.chain().focus().deleteRange(range).run();
    },
    onFinish: (_prompt, completion) => {
      // highlight the generated text
      editor.commands.setTextSelection({
        from: range.from,
        to: range.from + completion.length,
      });
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  const selectItem = useCallback(
    (index: number) => {
      const item = items[index];
      va.track("Slash Command Used", {
        command: item.title,
      });
      if (item) {
        if (item.title === "Continue writing") {
          if (isLoading) return;
          complete(
            getPrevText(editor, {
              chars: 5000,
              offset: 1,
            })
          );
        } else {
          command(item);
        }
      }
    },
    [complete, isLoading, command, editor, items]
  );

  useEffect(() => {
    const navigationKeys = ["ArrowUp", "ArrowDown", "Enter"];
    const onKeyDown = (e: KeyboardEvent) => {
      if (navigationKeys.includes(e.key)) {
        e.preventDefault();
        if (e.key === "ArrowUp") {
          setSelectedIndex((selectedIndex + items.length - 1) % items.length);
          return true;
        }
        if (e.key === "ArrowDown") {
          setSelectedIndex((selectedIndex + 1) % items.length);
          return true;
        }
        if (e.key === "Enter") {
          selectItem(selectedIndex);
          return true;
        }
        return false;
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [items, selectedIndex, setSelectedIndex, selectItem]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [items]);

  const commandListContainer = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = commandListContainer?.current;

    const item = container?.children[selectedIndex] as HTMLElement;

    if (item && container) updateScrollView(container, item);
  }, [selectedIndex]);

  return items.length > 0 ? (
    <div
      id="slash-command"
      ref={commandListContainer}
      className="novel-z-50 novel-h-auto novel-max-h-[330px] novel-w-72 novel-overflow-y-auto novel-rounded-md novel-border novel-border-stone-200 novel-bg-white novel-px-1 novel-py-2 novel-shadow-md novel-transition-all"
    >
      {items.map((item: CommandItemProps, index: number) => {
        return (
          <button
            className={`novel-flex novel-w-full novel-items-center novel-space-x-2 novel-rounded-md novel-px-2 novel-py-1 novel-text-left novel-text-sm novel-text-stone-900 hover:novel-bg-stone-100 ${
              index === selectedIndex
                ? "novel-bg-stone-100 novel-text-stone-900"
                : ""
            }`}
            key={index}
            onClick={() => selectItem(index)}
          >
            <div className="novel-flex novel-h-10 novel-w-10 novel-items-center novel-justify-center novel-rounded-md novel-border novel-border-stone-200 novel-bg-white">
              {item.title === "Continue writing" && isLoading ? (
                <LoadingCircle />
              ) : (
                item.icon
              )}
            </div>
            <div>
              <p className="novel-font-medium">{item.title}</p>
              <p className="novel-text-xs novel-text-stone-500">
                {item.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  ) : null;
};

const renderItems = () => {
  let component: ReactRenderer | null = null;
  let popup: any | null = null;

  return {
    onStart: (props: { editor: Editor; clientRect: DOMRect }) => {
      component = new ReactRenderer(CommandList, {
        props,
        editor: props.editor,
      });

      // @ts-ignore
      popup = tippy("body", {
        getReferenceClientRect: props.clientRect,
        appendTo: () => document.body,
        content: component.element,
        showOnCreate: true,
        interactive: true,
        trigger: "manual",
        placement: "bottom-start",
      });
    },
    onUpdate: (props: { editor: Editor; clientRect: DOMRect }) => {
      component?.updateProps(props);

      popup &&
        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
    },
    onKeyDown: (props: { event: KeyboardEvent }) => {
      if (props.event.key === "Escape") {
        popup?.[0].hide();

        return true;
      }

      // @ts-ignore
      return component?.ref?.onKeyDown(props);
    },
    onExit: () => {
      popup?.[0].destroy();
      component?.destroy();
    },
  };
};

const SlashCommand = Command.configure({
  suggestion: {
    items: getSuggestionItems,
    render: renderItems,
  },
});

export default SlashCommand;
