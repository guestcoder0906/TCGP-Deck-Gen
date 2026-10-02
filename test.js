import React from "react";
import { renderToString } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

const md = `2x Charizard <span class="card-hover"><span class="summary">[Details]</span><span class="details">**HP**: 180<br/>Hello</span></span>, 2x Charmander <span class="card-hover"><span class="summary">[Details]</span><span class="details">HP: 60</span></span>`;

function App() {
  return React.createElement(ReactMarkdown, {
    rehypePlugins: [rehypeRaw],
    components: {
      span: ({node, className, children, ...props}) => {
        if (className === "card-hover") {
          return React.createElement("span", { className: "group relative cursor-help" }, children);
        }
        if (className === "summary") {
          return React.createElement("span", { className: "text-rose-400" }, children);
        }
        if (className === "details") {
          return React.createElement("span", { className: "absolute hidden group-hover:block" }, children);
        }
        return React.createElement("span", { className, ...props }, children);
      }
    }
  }, md);
}

console.log(renderToString(React.createElement(App)));
