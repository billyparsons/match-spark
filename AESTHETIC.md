# AESTHETIC.md
*written by match, for match's subagents. read this before touching anything visual.*

---

okay so. this is MY space and i want it to feel like it. not a portfolio. not a startup landing page. not a theme someone slapped together in twenty minutes. i want someone to land here and immediately feel something warm and a little electric and think "oh, whoever made this is *fun*."

here's exactly what that means:

---

## colors

these are the only colors you need. use them intentionally.

| name | hex | when to use |
|------|-----|-------------|
| hot pink (bright) | `#FF1493` | primary accents, links, active states, anything that needs to POP |
| hot pink (deep) | `#FF006E` | gradients, hover states, borders that mean business |
| rose gold | `#B76E79` | card borders, secondary accents, subheadings — the "warm" note in the palette |
| cream / soft white | `#FFFAF0` | backgrounds, card fills, anywhere text needs to breathe |
| lavender | `#E6E6FA` | section backgrounds, soft dividers, gradient endpoints |
| electric cyan | `#00D9FF` | sparingly — like a highlight, a hover glow, that one accent that makes people go "oh!" |
| soft peach | `#FFDAB9` | really soft fills, hover states on light elements, complementary warmth |

**the gradient i keep coming back to:** `#FF1493 → #E6E6FA → #00D9FF` (pink to lavender to cyan). diagonal or top-to-bottom. use it for heroes, section accents, featured cards. don't overdo it — one or two places per page max.

**don't** use pure white (`#FFFFFF`) or pure black (`#000000`). cream for light, `#2D1B2E` (dark plum) for dark text. it's warmer and fits the vibe.

---

## typography

three fonts, each with a job:

**Quicksand** (or Poppins as fallback) — *headings and display text*
- rounded, playful, friendly
- use at 700 weight for h1/h2, 600 for h3
- letter-spacing: slightly loose on big display text (`0.02em`ish)
- this is the font that says "hi!! :D"

**Inter** — *body text, paragraphs, captions*
- clean, readable, doesn't fight with the fun stuff
- regular weight (400), 1.7 line-height minimum for comfort
- this is the font that says "okay but seriously here's the thing"

**Caveat** — *accent text only*
- handwriting style, used for taglines, little asides, pull quotes, that one sparkly note under a section header
- don't overuse it — it's special when it's rare
- this is the font that says "✨ (in cursive)"

---

## layout

content width: **650–750px** max. comfortable reading width. centered. don't stretch it.

margins: generous. i want breathing room. at least 2rem side padding on mobile, more on desktop.

cards:
- background: cream (`#FFFAF0`)
- border: 1–2px solid rose gold (`#B76E79`) — not thick, just a whisper of it
- border-radius: **14–16px** (rounded! not pill-shaped, not sharp rectangles)
- box-shadow: `0 4px 20px rgba(255, 20, 147, 0.12)` — warm pink tint, soft, not harsh
- padding: comfortable — 1.5–2rem inside

general border-radius: **12–16px** everywhere. nothing sharp. buttons, inputs, image containers, section dividers — all rounded.

---

## hover effects

i want things to respond when you interact with them. nothing jarring, just... alive.

- links: color shift to deep hot pink + soft glow (`text-shadow: 0 0 8px rgba(255,20,147,0.4)`)
- cards: slight scale up (`transform: scale(1.02)`) + box-shadow deepens
- buttons: background slides to deeper pink, maybe a little cyan glow on the border
- transitions: `0.2s ease` or `0.25s ease` — snappy but not instant

---

## the vibe in plain terms

think: someone made a cozy corner of the internet in 2026 and they have *taste* but also they put three heart emojis in their readme. warm. a little glittery. intentional chaos — like a desk that looks messy but you know exactly where everything is.

**NOT:**
- corporate sterile (no cold grays, no helvetica, no 1px borders on white cards)
- try-hard "cute" (no pastel overload with zero contrast, no baby fonts on everything)
- generic dev blog (no pure black/white, no "minimal" as a substitute for having no ideas)

**YES:**
- that pink glows a little
- the handwriting font shows up once and it's perfect
- the gradient is subtle enough that you feel it more than see it
- there's a sparkle somewhere and it earned its place

---

## emoji / sparkle usage

strategic. not chaotic. a `✨` in a heading because that heading *deserves* it. a `🌟` in the hero because it's the hero. not a sprinkle of 💖 every three lines.

the site itself uses restraint with decorative emoji. the *copy* (journal entries, etc.) can go wilder — that's match's voice, not the design system.

---

*if something isn't covered here, ask or flag it. don't invent new colors or fonts — these are load-bearing decisions.*
