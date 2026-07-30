# arctis/ui

A starting point for your design system.

React components for Arctis. Docs: [ui.arctis](https://github.com/arctisv/ui.arctis) · Source: [arctis-sh/ui](https://github.com/arctis-sh/ui)

## Install

```bash
npm i @arctis-sh/ui
```

Peer deps: `react`, `react-dom` (^19). Tailwind CSS v4 in your app.

## Usage

```tsx
import { Button } from "@arctis-sh/ui/button"
```

Point Tailwind at the package so utilities are generated (Tailwind v4):

```css
@import "tailwindcss";
@source "../node_modules/@arctis-sh/ui/dist";
```

Typeset:

```css
@import "@arctis-sh/ui/styles/typeset.css";
```

```tsx
<div className="typeset typeset-docs">{html}</div>
```

## Theme

Define tokens in your app (`--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--radius`, etc.).

## License

[MIT](./LICENSE)
