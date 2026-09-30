# UI redesign notes (styling only — no logic changed)

## Root-cause fix
`src/index.css` had an unlayered `* { margin:0; padding:0 }` reset. In Tailwind v4 that
overrides every spacing utility (`px-4`, `p-6`, `mx-auto`, `mt-*`), which is why the sidebar,
header and page content were touching the screen edges. The reset was removed
(Tailwind's own preflight already handles it).

## Other changes
- `@custom-variant dark` added so every `dark:` class follows the in-app theme toggle.
- New colour / shadow tokens (light + dark), teal-700 primary for AA contrast.
- "Redesign Layer v2" appended to `src/index.css`: buttons (40/36px), cards, forms (40px),
  badges (24px), tables (sticky light header, tabular numbers), tabs (one segmented style),
  dashboard rows, doctor grid (auto-fill, no clipping), bed cards, 12px minimum text size,
  visible focus rings, reduced-motion support.
- Class-name-only edits: `Sidebar.jsx` (readable active state, padding), `Topbar.jsx`
  (spacing, ⌘K hint), `StatCard.jsx` (clean card, icon badge).

## Run
npm install && npm run dev      (rebuild with `npm run build`; old `dist/` was removed)
