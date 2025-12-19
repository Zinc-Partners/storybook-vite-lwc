import { registerLWC } from "../stories/index.js";

registerLWC();

const preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    options: {
      storySort: {
        order: [
          "About",
          ["Introduction", "Getting Started"],
          "Foundation",
          ["Design Principles", "Design Tokens"],
          "Content",
          "Components"
        ]
      }
    }
  }
};

export default preview;
