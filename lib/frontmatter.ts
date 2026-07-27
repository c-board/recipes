export type RecipeFrontmatter = {
  tags: string[];
};

const EMPTY_FRONTMATTER: RecipeFrontmatter = {
  tags: [],
};

function parseTagsValue(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  const bracketMatch = trimmed.match(/^\[(.*)\]$/);
  if (bracketMatch) {
    return bracketMatch[1]
      .split(",")
      .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
      .filter(Boolean);
  }

  return [trimmed.replace(/^["']|["']$/g, "")].filter(Boolean);
}

function parseFrontmatterBlock(block: string): RecipeFrontmatter {
  const tags: string[] = [];
  const lines = block.split(/\r?\n/);
  let inTagsList = false;

  for (const line of lines) {
    const tagsInline = line.match(/^tags:\s*(.*)$/i);
    if (tagsInline) {
      const rest = tagsInline[1]?.trim() ?? "";
      if (!rest) {
        inTagsList = true;
        continue;
      }
      inTagsList = false;
      tags.push(...parseTagsValue(rest));
      continue;
    }

    if (inTagsList) {
      const listItem = line.match(/^\s*-\s+(.+)$/);
      if (listItem?.[1]) {
        tags.push(listItem[1].trim().replace(/^["']|["']$/g, ""));
        continue;
      }
      if (line.trim() === "" || /^\s/.test(line)) {
        continue;
      }
      inTagsList = false;
    }
  }

  return {
    tags: [...new Set(tags.map((tag) => tag.toLowerCase()))],
  };
}

export function parseRecipeMarkdown(raw: string): {
  frontmatter: RecipeFrontmatter;
  content: string;
} {
  const normalized = raw.replace(/^\uFEFF/, "");
  if (!normalized.startsWith("---")) {
    return { frontmatter: EMPTY_FRONTMATTER, content: raw };
  }

  const endMatch = normalized.match(/\r?\n---\r?\n/);
  if (!endMatch || endMatch.index == null) {
    return { frontmatter: EMPTY_FRONTMATTER, content: raw };
  }

  const blockStart = normalized.startsWith("---\r\n") ? 5 : 4;
  const block = normalized.slice(blockStart, endMatch.index);
  const content = normalized.slice(endMatch.index + endMatch[0].length);

  return {
    frontmatter: parseFrontmatterBlock(block),
    content,
  };
}

export function formatTagLabel(tag: string): string {
  return tag
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
