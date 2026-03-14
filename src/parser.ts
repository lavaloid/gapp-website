import { SimpleMarkdown, rules, rulesExtended } from "discord-markdown-parser";

export const parser = SimpleMarkdown.parserFor({
  ...rules,
  ...rulesExtended,
  // TODO: implement list. how even
});
