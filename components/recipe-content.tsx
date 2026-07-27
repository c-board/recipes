"use client";

import ReactMarkdown from "react-markdown";
import { withTimerChips } from "@/components/timer-text";

type RecipeContentProps = {
  content: string;
};

export const RecipeContent = ({ content }: RecipeContentProps) => {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => <p>{withTimerChips(children)}</p>,
        li: ({ children }) => <li>{withTimerChips(children)}</li>,
        strong: ({ children }) => <strong>{withTimerChips(children)}</strong>,
        em: ({ children }) => <em>{withTimerChips(children)}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};
