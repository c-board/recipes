# Recipes

A personal recipe site built with Next.js and shadcn/ui. Recipes live as Markdown files; optional photos live under `public/assets/`.

## Features

- Browse and search recipes on the home page
- Recipe detail pages with Markdown ingredients/instructions and photo lightbox
- Cook mode: full-screen step-by-step cooking with wake lock, ingredient checklist, and timers
- Command palette (`⌘K` / `Ctrl+K`) to jump to any recipe
- `llms.txt` feed for AI / ChatGPT Voice use (see below)

## Stack

- Next.js (App Router) + React
- Tailwind CSS + shadcn/ui
- Recipe content from `recipes/*.md`
- Images from `public/assets/<slug>.png` (matched by recipe filename)

## Adding a recipe

1. Create `recipes/my_dish.md` with ingredients and instructions.
2. Optionally add `public/assets/my_dish.png` for a photo.
3. The home list, detail route, and `llms.txt` update automatically from the Markdown files.

## Development

```bash
npm install
npm run dev
```

```bash
npm run build
npm start
```

Set `NEXT_PUBLIC_SITE_URL` to your deployed origin (used by the sitemap, robots, and absolute URLs).

## ChatGPT Voice + `llms.txt`

This site exposes a machine-readable recipe dump at:

```text
https://<your-domain>/llms.txt
```

The route (`app/llms.txt/route.ts`) builds a plain-text file that includes every recipe’s title and full Markdown content. It is linked from the sitemap so crawlers and tools can find it easily.

### Why this helps with ChatGPT Voice

ChatGPT Voice (and ChatGPT with browsing) works best with clean text, not cluttered HTML. `/llms.txt` gives the model one fetchable document with all recipes already in order—ideal when your hands are busy cooking and you want answers spoken aloud.

Typical flow:

1. Deploy the site and note the public URL for `/llms.txt`.
2. In ChatGPT, start a chat (or Voice mode) and point it at that file, for example:
   - “Use https://\<your-domain\>/llms.txt as my recipe book.”
   - “From my recipes llms.txt, how do I make tonkatsu?”
3. With Voice mode on, ask follow-ups out loud (“What’s next?”, “How long do I fry it?”, “Read the ingredients for steak”) and ChatGPT can answer from the feed without you scrolling the site.

You can also paste the contents of `/llms.txt` into a custom GPT or project instructions if you want a private, always-on cookbook assistant.

### Keeping it up to date

Whenever you add or edit a file in `recipes/`, rebuild/redeploy. The next request to `/llms.txt` regenerates the full collection from those Markdown files—no separate sync step.
