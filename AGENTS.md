# AGENTS.md

## Stack

Next.js 16.3.8 (App Router, Turbopack) + React 19 + TypeScript + Tailwind v4 + `motion` +
`@phosphor-icons/react`. The product is a **browser photobooth** (`getUserMedia` + canvas), so
there is no backend, no DB, and no API route. Video never leaves the device.

## Commands

Order matters. Run `lint` before `typecheck` before `build`.

```
npm install
npm run dev        # http://localhost:3000
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run build      # next build, prerenders / as static
```

There is no test suite and no `test` script. Do not add one for a change that has no logic
branch worth asserting; add `*.test.ts` only if real logic lands.

## Deploy to Vercel

Zero config needed. Vercel detects Next.js from `next build`. `vercel` CLI is NOT installed
locally, so deploys happen through the Vercel dashboard or Git integration, not `vercel deploy`.

## Layout of `src/`

- `app/layout.tsx` — fonts (`next/font/google`: Outfit + JetBrains Mono), metadata, mounts the
  no-flash theme script.
- `app/globals.css` — **all** colors live here as CSS variables. Components only ever use
  `bg-bg`, `bg-surface`, `bg-elevated`, `border-line`, `text-ink`, `text-muted`, `bg-accent`,
  `text-accent-ink`. Never hardcode a hex value in a component.
- `components/photobooth.tsx` — the whole product. `Phase` state machine is
  `idle -> starting -> ready -> countdown -> done`. Camera tracks are stopped on unmount and on
  "Matikan"; the stream is intentionally **not** stopped on `done` so "Ulangi" can re-enter
  `ready`. Strip geometry (`FRAME_W`, `FRAME_H`, `PAD`, `GAP`, `BRAND_H`) is duplicated in
  `layouts.tsx` for the preview cards: change one, change both.
- `components/*.tsx` — one file per landing section. `page.tsx` only composes them.

## Things that will bite you

- **Theme is CSS variables + a `.dark` class**, not Tailwind's `dark:` variant. `globals.css`
  defines `.dark { ... }` and `@custom-variant dark` is registered but unused. Toggle state is
  read with `useSyncExternalStore`, not `useState` in an effect (eslint
  `react-hooks/set-state-in-effect` will fail the build otherwise).
- **Timers in `photobooth.tsx` must not be self-recursive const arrow functions.** The countdown
  uses the `pendingRef` + `stepShoot` function-declaration pattern because eslint
  `react-hooks/immutability` rejects a `useCallback` that references itself.
- The countdown runs `setTimeout` chains in state, so it is not testable in isolation and needs a
  browser to verify. No test suite covers it.
- **The theme script is inline in `<head>`** to avoid a flash. `suppressHydrationWarning` on
  `<html>` is required. Moving it into a component body reintroduces the flash.
- **`Reveal` is a client component.** It takes an `as` prop (`"div" | "li"`) because it is used
  both as a grid item and inside `<ol>` in `how-it-works.tsx`. Wrapping it around an `<li>`
  without `as="li"` nests a `<div>` inside `<ol>` and breaks list semantics.
- **`Reveal` is not used on section headings**, only on content blocks. Keep it that way;
  identical fade entrances on every heading is a known design smell here.
- **Icons**: server components import from `@phosphor-icons/react/dist/ssr`. Plain
  `@phosphor-icons/react` is the client build and will fail in RSC.
- **Images** are `picsum.photos` placeholders via `next/image`. Hostnames are allowlisted in
  `next.config.ts`; a new host needs an entry there or the build fails at runtime.
- **Design system is locked** (see below). Adding a second accent color, a second icon family,
  or another corner-radius scale is a design decision, not a local fix.

## Design constraints

Chosen via the `design-taste-frontend` skill and enforced in review:

- Dark/light both shipped, locked to one palette per mode. Accent is electric lime and is used
  page-wide. No purple gradients, no cream-and-brass.
- Type: Outfit (sans) + JetBrains Mono. **`font-mono` only for genuine data** (the live photo
  counter). Using it as a costume for "technical" is a rejected pattern.
- One corner-radius system: `rounded-2xl` (16px) for cards, full pills for buttons,
  `rounded-xl` for small floating media.
- No eyebrows/kickers above headings. No decorative section numbers.
- All motion honors `prefers-reduced-motion`, including the CSS marquee and the live ping.
- Exactly one CTA label per intent: **"Buat Kotak"** everywhere. Do not add "Mulai", "Get
  Started", or "Daftar" next to it.

## Shell notes

Windows + PowerShell 5.1. `&&` does not work, chain with `; if ($?) { ... }`. Use the `workdir`
parameter instead of `cd`. Edit files with the `edit`/`write` tools, not `Set-Content`.

## Known gaps

- The "Buat Kotak" CTA chain (nav and hero point at `#harga`, pricing points at `#cta`, the
  footer banner loops back to `#harga`) exists because there is no signup flow yet. Replace all
  of them with real routes when there is a destination.
- The pricing tiers, the "Acara" and "Merek" packages, and the mode layar besar are invented
  placeholders. Confirm the real offering before launch.
- `metadataBase` in `app/layout.tsx` is hardcoded to `https://pothobox.id`. Change it to the real
  domain before launch or OG tags will point at the wrong host.