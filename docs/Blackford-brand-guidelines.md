# Hyacinth Industries Brand Guidelines (source of truth)

**For Claude and every developer: read this file before creating or changing any UI, document, email
template, PDF, slide or chart for the Blackford platform. If a request conflicts with this file, follow
this file and say so. Never invent colors, fonts or styles that are not listed here. Change this file
only when the user explicitly asks to change the brand.**

Values were read from the Scope of Work v2.0 (October 30, 2026) rendered pages and identified by eye.
Confirm against the original logo and font files before print production.

## 1. Colors

Use tokens, never raw hex, in code (`brand/tokens.css`). Raw hex appears here for reference only.

| Token | Name | HEX | RGB | Role |
|---|---|---|---|---|
| `--brand-ink` | Hyacinth Ink | #16130F | 22 19 15 | Primary dark: covers, dark sections, text on light |
| `--brand-ruby` | Hyacinth Ruby | #C8191E | 200 25 30 | Accent: logo leaf, milestones, errors, signature bar (left) |
| `--brand-gold` | Hyacinth Gold | #A8820F | 168 130 15 | Accent: logo leaf, rules, labels on dark, signature bar (right) |
| `--brand-gold-deep` | Gold Deep | #7A5C00 | 122 92 0 | Small gold text on light backgrounds (derived for accessibility, not in the PDF) |
| `--brand-pale-gold` | Pale Gold | #E8D9A0 | 232 217 160 | Large figures on Ink |
| `--brand-parchment` | Parchment | #F7EBC5 | 247 235 197 | Fill for automated steps, callouts, warnings (with Gold border) |
| `--brand-ivory` | Ivory | #F5F3EE | 245 243 238 | Light page and panel background; text on Ink |
| `--brand-gray` | Warm Gray | #8C877D | 140 135 125 | Captions on dark, secondary chart series, inactive |
| `--brand-hairline` | Hairline | #DDD8CC | 221 216 204 | Borders and dividers |

### Approved text and background pairings (WCAG 2.1 AA is required by the SOW)

| Text on background | Contrast | Allowed for |
|---|---|---|
| Ink on Ivory / White / Parchment | 16.7 / 18.5 / 15.6 | All text |
| Ivory on Ink | 16.7 | All text |
| Pale Gold on Ink | 13.1 | All text |
| Gold on Ink | 5.2 | All text |
| Warm Gray on Ink | 5.2 | All text |
| Ruby on Ivory | 5.2 | All text |
| Ruby on Parchment | 4.9 | All text |
| White on Ruby | 5.8 | Buttons, badges |
| Gold Deep on Ivory | 5.6 | Small gold text (labels, links) |
| **Ruby on Ink** | 3.2 | **Large type (24px+), icons, shapes only** |
| **Gold on Ivory / White** | 3.2 / 3.6 | **Large type, rules, shapes only; use Gold Deep for small text** |
| **Warm Gray on Ivory** | 3.2 | **Never for text; borders and shapes only** |

### Proportions (per page or screen)
Ink about 45%, Ivory about 35%, Gold 8%, Ruby 6%, Gray 6%. Accents stay small.

### Signature bar
Full-width 6px bar at the bottom of covers and footers: Ruby for the first third, Gold for the remaining two thirds.

### Meaning in the product UI
These are proposals; confirm with the client before the first UI release.
- Error / destructive: Ruby, always with an icon and text, never color alone
- Automatic (done by the system): Parchment fill with Gold border
- Warning: Parchment fill, Gold Deep text, warning icon
- Success: Gold Deep text with check icon (the palette has no green; do not add one)
- Neutral / disabled: Warm Gray shape, Ink text
- Extra chart series: tints of Gold and Gray, plus patterns or labels; do not add hues

## 2. Typography

| Role | Font | Weights | Use |
|---|---|---|---|
| Display / headings | **DM Serif Display** | 400 | Page titles, section titles, big figures |
| Body / UI | **IBM Plex Sans** | 400, 500, 600 | Body copy, forms, buttons, tables |
| Data / labels | **IBM Plex Mono** | 400, 500 | Dates, IDs, status chips, code, footers, small caps labels in the app |
| Eyebrow (print and marketing) | **Cormorant Garamond** | 600 | Letter-spaced uppercase labels above titles, cover meta |

All four are open source (SIL OFL) on Google Fonts. **In the app, self-host them** (for example with `next/font`)
rather than loading from Google's CDN, so employee visits do not send data to a third party.

Fallbacks: `'DM Serif Display', Georgia, serif` · `'IBM Plex Sans', system-ui, sans-serif` · `'IBM Plex Mono', ui-monospace, monospace` · `'Cormorant Garamond', Georgia, serif`.

### Scale (desktop; scale display sizes down on phones with clamp)
| Style | Font | Size / line height | Notes |
|---|---|---|---|
| Display | DM Serif Display | 56 / 1.08 | Covers only |
| H1 | DM Serif Display | 40 / 1.15 | One per page |
| H2 | DM Serif Display | 28 / 1.2 | |
| H3 | IBM Plex Sans 600 | 20 / 1.3 | |
| Body | IBM Plex Sans 400 | 16 / 1.55 | Minimum for client-facing screens |
| Small | IBM Plex Sans 400 | 14 / 1.5 | Help text, table cells |
| Label (app) | IBM Plex Mono 500 | 12 / 1.4, uppercase, tracking .14em | Eyebrows, status chips |
| Eyebrow (print) | Cormorant Garamond 600 | 13 / 1.4, uppercase, tracking .22em | Cover and marketing only |

Rules: headings in sentence case; one H1 per page; body line length 60 to 70 characters; no text under 12px;
never set body copy in DM Serif Display or Cormorant; never use more than these four families; no italics for emphasis (use weight 600).
Use typographic punctuation: ’ and “ ”.

## 3. Components
- **Cards**: Surface (White on Ivory page), 1px Hairline border, 10px radius, no shadow.
- **Primary button**: Ink background, Ivory text. **Accent button**: Ruby background, White text (one per screen). **Secondary**: Hairline border, Ink text.
- **Links**: Gold Deep on light, Gold on dark, underlined.
- **Focus ring**: 2px Gold Deep (light) or Pale Gold (dark) with 2px offset; always visible.
- **Tables**: Ivory header row, Hairline row dividers, mono for dates and IDs.
- **Status chip**: IBM Plex Mono label, pill, Hairline border; color only by the meanings above.
- **Logo**: use only the supplied logo files. Never redraw it, recolor it or place it on a busy background.

## 4. Accessibility (required)
WCAG 2.1 AA on all client-facing screens. Never convey meaning by color alone. Tap targets 44px minimum.
Respect `prefers-color-scheme` and `prefers-reduced-motion`. Text in SMS and email carries no health details.

## 5. Checklist before finishing any UI or document
1. Every color comes from a token in section 1 (no raw hex, no new hues).
2. Every text and background pair is in the approved table.
3. Only the four fonts, at sizes in the scale.
4. Ruby used once or twice per screen, not as a main surface (except the signature bar and the accent button).
5. Focus, error and empty states exist and meet contrast.
6. If something needed is missing from this file, ask the user rather than inventing it, then update this file.
