export type RecipeSections = {
  ingredients: string[];
  steps: string[];
};

function extractListItems(sectionBody: string): string[] {
  const items: string[] = [];

  for (const line of sectionBody.split("\n")) {
    const match = line.match(/^\s*(?:\d+\.|[-*])\s+(.+)\s*$/);
    if (match?.[1]) {
      items.push(match[1].trim());
    }
  }

  return items;
}

function extractSection(content: string, heading: string): string {
  const lines = content.split("\n");
  const headingPattern = new RegExp(`^##\\s+${heading}\\s*$`, "i");
  const startIndex = lines.findIndex((line) => headingPattern.test(line));

  if (startIndex === -1) {
    return "";
  }

  const bodyLines: string[] = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index] ?? "";
    if (/^##\s+/.test(line)) {
      break;
    }
    bodyLines.push(line);
  }

  return bodyLines.join("\n").trim();
}

export function parseRecipeSections(content: string): RecipeSections {
  return {
    ingredients: extractListItems(extractSection(content, "Ingredients")),
    steps: extractListItems(extractSection(content, "Instructions")),
  };
}
