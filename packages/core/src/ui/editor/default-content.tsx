export const defaultEditorContent = {
  type: "doc",
  content: [
    {
      type: "heading",
      attrs: { level: 1 },
      content: [{ type: "text", text: "utautattaro novel editor" }],
    },
    {
      type: "image",
      attrs: {
        src: "https://i.imgur.com/znF5Tec.png",
        alt: "banner.png",
        title: "banner.png",
        width: null,
        height: null,
      },
    },
    {
      type: "heading",
      attrs: { level: 2 },
      content: [{ type: "text", text: "expansion novel command" }],
    },
    {
      type: "codeBlock",
      attrs: { language: null },
      content: [{ type: "text", text: "clear : clear content\nexport : markdown export\nsave : save as .novel\nload : load .novel file" }],
    },
    {
      type: "paragraph",
      content: [
        {
          type: "text",
          text: "view profile ",
        },
        {
          type: "text",
          marks: [
            {
              type: "link",
              attrs: {
                href: "https://utautattaro.com",
                target: "_blank",
                class:
                  "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
              },
            },
          ],
          text: "utautattaro.com",
        }
      ],
    }
  ],
};