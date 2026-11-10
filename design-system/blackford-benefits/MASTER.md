# Design System: Blackford Benefits (brand override)

**Source of truth:** Hyacinth brand guidelines + SOW v2.0.  
The auto-generated teal palette was discarded — brand forbids inventing hues.

## Brand tokens

| Role | Token | HEX |
|------|-------|-----|
| Primary / ink | `--brand-ink` | `#16130F` |
| Accent ruby | `--brand-ruby` | `#C8191E` |
| Accent gold | `--brand-gold` | `#A8820F` |
| Gold deep (small text on light) | `--brand-gold-deep` | `#7A5C00` |
| Pale gold (figures on ink) | `--brand-pale-gold` | `#E8D9A0` |
| Parchment (auto / warning fill) | `--brand-parchment` | `#F7EBC5` |
| Ivory ground | `--brand-ivory` | `#F5F3EE` |
| Warm gray | `--brand-gray` | `#8C877D` |
| Hairline | `--brand-hairline` | `#DDD8CC` |
| Surface | white | `#FFFFFF` |

Proportions: Ink ~45%, Ivory ~35%, Gold 8%, Ruby 6%, Gray 6%.

## Typography (self-hosted via next/font)

- Display / H1–H2: **DM Serif Display**
- Body / UI: **IBM Plex Sans** 400/500/600
- Data / labels: **IBM Plex Mono** 400/500
- Print eyebrow only: **Cormorant Garamond**

## Components

- Cards: white on ivory, 1px hairline, 10px radius, **no shadow**
- Primary button: Ink + Ivory text
- Accent button (one per screen): Ruby + white
- Secondary: hairline border + ink
- Focus: 2px gold-deep (light) / pale-gold (dark) + 2px offset
- Status: mono pill + icon + text (never color alone)
- Signature bar: 6px; first ⅓ ruby, rest gold

## App-screen style

Flat, dense CRM/portal UI. Quiet chrome. Colour on status/data, not decoration. Follow SOW workflows A–H.
