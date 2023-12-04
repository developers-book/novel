export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "Tale : full-stack md editor" }],
    },
    {
      type: "image",
      attrs: {
        src: "https://i.imgur.com/jKhCBPD.png",
        alt: "banner.png",
        title: "banner.png",
        width: null,
        height: null,
      },
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "Tale includes 'novel,' a software developed by Steven Tey, available at "
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://github.com/steven-tey/novel",
                target: "_blank",
                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer"
              }
            },
          ],
          text: "GitHub"
        },
        {
          type: "text",
          text: ", and is used under the "
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://www.apache.org/licenses/LICENSE-2.0",
                target: "_blank",
                class: "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer"
              }
            },
          ],
          text: "Apache License 2.0"
        },
        {
          type: "text",
          text: ". We extend our gratitude to Steven Tey and all contributors to the 'novel' project for their valuable work."
        }
      ]
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "extension command" }],
    },
    {
      type: "codeBlock",
      attrs: { language: null },
      content: [{ type: "text", text: "/clear : clear content\n/export : markdown export\n/save : save as .tale\n/load : load .tale file\n/fullscreen : fullscreen editor" }],
    }
  ],
};