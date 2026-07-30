# arctis/ui

React components for Arctis. Source you own — copy into your app or install when the package is published.

Docs and demos live in the [ui.arctis](https://github.com/arctisv/ui.arctis) site. This repo is **UI only**.

## What’s included

- `src/components/ui` — components
- `src/lib` — `cn` helper and overlay/menu hooks
- `src/styles/typeset.css` — Typeset (prose for HTML / markdown)

## Stack

- React 19
- Tailwind CSS v4 (utility classes + CSS variables)
- [Base UI](https://base-ui.com) where noted in components

## Theme

Components expect your app to define the usual tokens (`--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--radius`, etc.). Bring your own `globals.css` / theme — this repo does not ship a full docs theme.

## Usage (source)

Point your aliases at this tree (same layout as the docs site):

```ts
// tsconfig paths (example)
{
  "paths": {
    "@/components/ui/*": ["./src/components/ui/*"],
    "@/lib/*": ["./src/lib/*"]
  }
}
```

```tsx
import { Button } from "@/components/ui/button"
```

Import Typeset after Tailwind:

```css
@import "tailwindcss";
@import "./styles/typeset.css";
```

```tsx
<div className="typeset typeset-docs">{html}</div>
```

## npm

Package publish is planned (`@arctis-sh/ui`). Until then, use this repo as source.

## License

[MIT](./LICENSE)
