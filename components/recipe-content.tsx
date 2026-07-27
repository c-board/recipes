"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import { TimerChip } from "@/components/timer-chip";
import { parseDurations } from "@/lib/parse-durations";

function textWithTimerChips(text: string): React.ReactNode {
  const matches = parseDurations(text);
  if (matches.length === 0) {
    return text;
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const [index, match] of matches.entries()) {
    if (match.start > cursor) {
      parts.push(text.slice(cursor, match.start));
    }
    parts.push(
      <TimerChip
        key={`timer-${match.start}-${index}`}
        label={match.label}
        ms={match.ms}
      />,
    );
    cursor = match.end;
  }

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts;
}

function withTimerChips(children: React.ReactNode): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return textWithTimerChips(child);
    }

    if (!React.isValidElement<{ children?: React.ReactNode }>(child)) {
      return child;
    }

    if (child.props.children == null) {
      return child;
    }

    return React.cloneElement(child, {
      children: withTimerChips(child.props.children),
    });
  });
}

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
