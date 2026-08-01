# arctis/ui

A starting point for your design system.

React components for Arctis. Docs: [ui.arctis](https://github.com/arctisv/ui.arctis) · Source: [arctis-sh/ui](https://github.com/arctis-sh/ui)

## Add (recommended)

Copy only what you need into your app:

```bash
npx @arctis-sh/ui@latest add button
npx @arctis-sh/ui@latest add slider pricing-01
```

Files land under `components/ui`, `components/blocks`, and `lib` with `@/` imports. Registry dependencies (and npm packages they need) are pulled automatically.

## Install the full package

```bash
npm i @arctis-sh/ui
```

```tsx
import { Button } from "@arctis-sh/ui/button"
```

Peer deps: `react`, `react-dom` (^19). Tailwind CSS v4 in your app.

Point Tailwind at the package so utilities are generated:

```css
@import "tailwindcss";
@source "../node_modules/@arctis-sh/ui/dist";
```

## Theme

Define tokens in your app (`--background`, `--foreground`, `--muted`, `--border`, `--primary`, `--radius`, etc.).

## License

[MIT](./LICENSE)
