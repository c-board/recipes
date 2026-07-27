import { formatTagLabel } from "@/lib/frontmatter";
import { cn } from "@/lib/utils";

type RecipeTagsProps = {
  tags: string[];
  className?: string;
};

export const RecipeTags = ({ tags, className }: RecipeTagsProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-md border border-border bg-muted/50 px-2 py-0.5 text-xs font-medium text-muted-foreground"
        >
          {formatTagLabel(tag)}
        </li>
      ))}
    </ul>
  );
};
