# Blackford / Hyacinth brand (source of truth)

Read before changing UI. Do not invent colors or fonts outside this file.

## Colors

| Token | HEX | Role |
|-------|-----|------|
| `--brand-ink` | `#16130F` | Dark surfaces, text on light |
| `--brand-ruby` | `#C8191E` | Accent, errors, signature bar (⅓) |
| `--brand-gold` | `#A8820F` | Labels on dark, signature bar (⅔) |
| `--brand-gold-deep` | `#7A5C00` | Small gold text / links on light |
| `--brand-pale-gold` | `#E8D9A0` | Large figures on Ink |
| `--brand-parchment` | `#F7EBC5` | Callouts / warnings (Gold border) |
| `--brand-ivory` | `#F5F3EE` | Page background |
| `--brand-gray` | `#8C877D` | Captions, inactive |
| `--brand-hairline` | `#DDD8CC` | Borders |

Signature bar: 6px, Ruby ⅓ + Gold ⅔.

## Type

- Display: **DM Serif Display**
- Body / UI: **IBM Plex Sans**
- Labels / data: **IBM Plex Mono**

Self-host via `next/font`. No green — success uses Gold Deep.

## Derived shades

Mixes of the core palette only — no new hues. Defined in `packages/brand/tokens.css`.

| Token | HEX | Role |
|-------|-----|------|
| `--brand-ink-soft` | `#3A352C` | Secondary text on light, borders on Ink |
| `--brand-ink-raised` | `#2A241C` | Hover / active on Ink surfaces |
| `--brand-gray-strong` | `#69645C` | Muted text (AA on Ivory and white — use instead of Gray for text) |
| `--brand-sand` | `#ECE8DF` | Sunken areas, row dividers, progress tracks |
| `--brand-parchment-soft` | `#FBF5E2` | Selected rows / current step |
| `--brand-ruby-soft` | `#FBECED` | Error backgrounds |

## Color architecture (staff app)

Tailwind's default palette is removed; only brand colors exist as utilities:
`ink, ink-soft, ink-raised, ruby, ruby-soft, gold, gold-deep, pale-gold, parchment,
parchment-soft, ivory, sand, gray, hairline, divider, surface, muted, white`
(e.g. `text-muted`, `bg-sand`, `border-hairline`). Never use hex values or
`[var(--…)]` arbitrary classes in components.

Status language, used everywhere:

| Meaning | Color | Tag | Progress |
|---------|-------|-----|----------|
| Done / healthy | Gold Deep | `tag-ok` | Ink fill |
| Needs attention | Gold on Parchment | `tag-warn` | `progress-warn` (Gold) |
| Error / blocked | Ruby on Ruby Soft | `tag-bad` | — |
| In progress / info | Ink on Ivory | `tag-info` | — |
| Not started | Muted on Ivory | `tag-mute` | Sand track |

Shared building blocks live in `apps/staff/app/globals.css` (`@layer components`)
and `apps/staff/components/ui/`: `PageHeader`, `Callout`, `StatCard`, `Tag`,
`.card`, `.panel`, `.section-title`, `.btn-*`, `.segmented`, `.pill`, `.tabs`,
`.list-row`, `.table/.th/.td`, `.progress`, `.avatar`, `.dot`, `.bubble`.
Component classes sit in a cascade layer, so Tailwind utilities can override them
without `!important`.
