## Project Overview

- **Purpose:** Single-page React + Vite portfolio for a UX/UI designer, using hash-based routing and modular sections (see `App.tsx`).
- **Tech Stack:** React 19, TypeScript, Vite, Tailwind (CDN in `index.html`), Framer Motion, lucide-react. See `package.json` and `vite.config.ts` for details.

## Developer Workflow

1. Install dependencies: `npm install`
2. Set `GEMINI_API_KEY` in `.env.local` (see `README.md`)
3. Start dev server: `npm run dev` (Vite, port 3000)
4. Build: `npm run build`  |  Preview: `npm run preview`

## Architecture & Patterns

- **Routing:** Hash-based, managed in `App.tsx`. Key routes:
  - `#/project/:id` → `ProjectDetail`
  - `#/design/:category` → `DesignDetail`
  - `#/about`, `#/services` → static pages
  - Navigation and scroll logic in `Header.tsx` and `App.tsx` (header offset ~80px for anchor scrolls)
- **Section Management:**
  - Sections composed in `App.tsx` from `components/*`
  - Order is persisted in `localStorage` (`sectionOrder` key)
  - Admin Mode (Ctrl+Shift+A) enables drag-and-drop reordering
- **Data & Assets:**
  - Project/media assets: `img/projects/*`
  - Project data: hard-coded array in `components/FeaturedWork.tsx`
  - Shared types: `types.ts` (Project, Skill, NavItem, Testimonial)
- **UI Patterns:**
  - Tailwind via CDN, theme config in `index.html` script
  - Vite alias `@` → project root (see `vite.config.ts`, `tsconfig.json`)
  - Many components use `<video>` with `onError` fallback to images (see `FeaturedWork.tsx`)
  - Shared UI: `components/ui/*` (e.g., `NeonButton.tsx`)

## Key Files & Directories

- App composition/routing: `App.tsx`
- Entry: `index.tsx`, `index.html`
- Navigation: `components/Header.tsx`
- Hero/landing: `components/Hero.tsx`
- Portfolio grid: `components/FeaturedWork.tsx`
- UI atoms: `components/ui/`
- Types: `types.ts`
- Vite config: `vite.config.ts`
- Tailwind/theme: `index.html`
- Project/media assets: `img/projects/`

## Integration & Environment

- Requires `GEMINI_API_KEY` (see `README.md`, `vite.config.ts`)
- Tailwind is not PostCSS-based; all config is inline in `index.html`
- No backend; all data is local/static

---
For new patterns, follow the structure and conventions in the files above. When editing, preserve video fallback logic and section order persistence. For scroll/anchor logic, maintain header offset behavior. Use Vite alias `@` for imports from project root.

## What agents should avoid changing without tests or verification

- Do not remove the inline Tailwind config from `index.html` without testing visual regressions — styles rely on that script.
- Avoid changing how `window.location.hash` is used (hash routing) unless updating all call sites (`App.tsx`, `Header.tsx`, components that call `window.location.hash`).
- Don't change video-to-image fallback logic in `FeaturedWork.tsx` without verifying the visual result and network path correctness.

## Example tasks and pointers

- Add a new project card: edit `components/FeaturedWork.tsx` projects array and place media under `img/projects/<name>/`.
- Add a new section: create `components/MySection.tsx`, then plug it into the `sections` map inside `App.tsx` and add its id to the default `sectionOrder`.
- Change nav behavior: edit `components/Header.tsx` — pay attention to `handleNavClick` and mobile menu logic.

If anything above is unclear or you want the instructions expanded to include contributor guidelines, test commands, or code-style rules, tell me which areas to expand and I will iterate. 
