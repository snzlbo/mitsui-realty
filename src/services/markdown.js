// markdown.js

import MarkdownIt from "markdown-it";
import mila from "markdown-it-link-attributes";

const md = new MarkdownIt({
  html: false,
  linkify: true,
  xhtmlOut: false,
  breaks: true,
});
md.use(mila, { attrs: { target: '_blank', rel: 'noopener', className: 'link-class' } })

export const renderMarkdown = (content) => {
  return md.render(content);
};
