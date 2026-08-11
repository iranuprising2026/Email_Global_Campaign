# Adopting the Mithra design system

**Date:** 2026-08-11
**Status:** implemented; see addendum below for one change made after implementation

Re-theme the Email Global Campaign site to use the visual language of
**Mithra — Lion and Sun Foundation** (mithra-iran.org): dark navy ground, gold as
the single accent, Inter for latin text, IRANSans for Persian.

Source of truth for the palette is `../Lion-and-Sun-Nederland`, summarised in
`DESIGN.md`. Every contrast ratio quoted here was computed against the real hex
values, not estimated.

---

## Goal and non-goals

**Goal.** The page should read as visually part of the Mithra family — same
palette, same typefaces — while remaining a standalone single-purpose form.

**Non-goals.** Explicitly out of scope:

- No Mithra logo, header bar, nav or footer. `index.html` markup is unchanged
  apart from the stylesheet cache-bust.
- No changes to campaign texts, politician data, or email-building logic.
- No `woff2` conversion of the IRANSans files. Separate decision, and the
  licensing question under `CLAUDE.md` → Open questions is still open.
- No new email version or campaign.

## Decisions taken, with the alternative rejected

| Decision | Alternative rejected | Why |
| --- | --- | --- |
| Palette + fonts only | Add Mithra logo/header/footer | Keeps the change inside `styles.css`, `tracker.js`, `app.js`; the page stays a form, not a site section |
| Preview box goes dark like everything else | One deliberate light "paper" panel | Single theme, no exceptions. White on `--color-surface` is 16.36, so long-form reading is comfortable |
| Gold means *send*, and only send — **superseded same day, see addendum** | Gold on every primary button; or keep four button colours | Gives the two Open-Email buttons — the actual goal of the page — an unambiguous signal that nothing else competes with |
| Chart uses a 5-step blue ramp; gold reserved | Gold as the fifth series | Keeps gold meaning exactly one thing |
| Status: gold bar for all kinds, ✓/⚠/ℹ glyph carries the state | Lighten Mithra's green/red so they pass on dark | User's call, for palette purity. Mitigated: the region is already `role="status"` + `aria-live="polite"`, so colour was never the only channel |
| Both instruction cards gold | Gold EN / sky-300 FA | The cards are already distinguished by bar side, text direction and script; colour was redundant |
| Flat semantic token names, Mithra's vocabulary | Repoint existing token names in place | `--ink` meaning white and `--green-600` with no referent would actively mislead the non-technical collaborator this repo is written for |

---

## 1. Token layer — `styles.css` §1

Replace the existing `:root` block. One flat layer of semantic tokens: no
primitive/semantic split, per `DESIGN.md` → adoption constraint 4.

```css
:root {
  /* Mithra palette. See DESIGN.md for the source and the contrast numbers. */
  --color-bg:             #0a1628;  /* page ground */
  --color-surface:        #0f1f3d;  /* cards, preview, tracker, readonly fields */
  --color-surface-strong: #142e5c;  /* editable fields, Generate button */
  --color-border:         #243352;  /* rules and card outlines */
  --color-border-strong:  #7387a3;  /* input outlines — needs 3:1, see below */
  --color-text:           #ffffff;  /* body copy and headings */
  --color-text-muted:     #99abc2;  /* leads, notes, chart axes */
  --color-brand:          #c9a84c;  /* gold. Send buttons, labels, accents */

  --radius: 10px;
  --radius-sm: 8px;
  --gap: 15px;
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.45);   /* 0.08 is invisible on navy */

  --font-latin: 'Inter', Arial, Helvetica, sans-serif;
  --font-fa:    'IRANSans', Tahoma, Arial, sans-serif;   /* unchanged */
}
```

### Three deliberate divergences from Mithra

1. **`--color-text-subtle` is not carried over.** Mithra's `#7387a3` fails on
   every raised surface (4.46 on `--color-surface`, 3.63 on `-strong`) — a real
   bug in that site, documented in `DESIGN.md`. All muted text here uses
   `--color-text-muted` `#99abc2` (6.98 on surface) instead.
2. **No green or red.** Mithra declares `green-700 #088957` and
   `red-700 #c42b2b` and uses neither — because on dark they score 3.68 and 2.90,
   unusable as text. They have no referent in this design either.
3. **`slate-400 #7387a3` is reused as a border, not text.** As text it fails. As
   an input outline it clears WCAG 1.4.11's 3:1 on **both** sides of the edge it
   draws: 3.63 against the field fill `--color-surface-strong` inside it, and
   4.94 against the page ground `--color-bg` outside it. Mithra's own
   `--color-border` `#243352` is only 1.30 against the surface — fine for a
   decorative card rule, not enough to be an input's only boundary.

### Contrast floor

Every text pair this design produces, verified:

| Pair | Ratio | Level |
| --- | --- | --- |
| white on `--color-bg` | 18.13 | AAA |
| white on `--color-surface` | 16.36 | AAA |
| white on `--color-surface-strong` | 13.33 | AAA |
| gold on `--color-bg` | 7.93 | AAA |
| gold on `--color-surface` | 7.16 | AAA |
| `--color-bg` on a gold button | 7.93 | AAA |
| `--color-text-muted` on `--color-bg` | 7.73 | AAA |
| `--color-text-muted` on `--color-surface` | 6.98 | AA |
| `--color-border-strong` vs field fill `--color-surface-strong` | 3.63 | passes 1.4.11 (non-text) |
| `--color-border-strong` vs page ground `--color-bg` | 4.94 | passes 1.4.11 (non-text) |

Nothing in this design falls below AA for text. That is a strict improvement on
the current light theme, whose green button label sits at 3.25.

---

## 2. Per-section CSS changes — `styles.css` §2–9

Section numbering and the plain-language comment style stay exactly as they are.

**§2 Base & layout.** `body` gets `--font-latin`, `color: var(--color-text)` and
a flat `background: var(--color-bg)` — the
`linear-gradient(to bottom right, #f7fafc, #e6f0ff)` is removed. `h1` and `h2`
become `--color-text` (Mithra uses `--color-text` for headings, gold for labels
and accents). `.divider` → `--color-border`.

**§3 Instruction cards.** `.instructions__card` → `background: var(--color-surface)`.
`.instructions__card--en` keeps its 5px bar on the left and
`.instructions__card--fa` on the right, both now `var(--color-brand)`.
`.instructions__heading--en` and `--fa` both → `var(--color-brand)`.
`.instructions__lead` and `.instructions__note` (currently a hardcoded `#2d3748`)
→ `var(--color-text-muted)`. `.instructions__rule` → `var(--color-border)`.
`.instructions__warning` → `var(--color-brand)`, still bold — it already carries
a ⚠️ emoji, so it does not depend on colour.

RTL, `direction`, `text-align` and the 1.7 Persian line-height are untouched.

**§4 Form fields.** Editable `input`/`select`/`textarea`:
`background: var(--color-surface-strong)`, `border: 1px solid var(--color-border-strong)`,
`color: var(--color-text)`. Readonly `input`/`textarea`:
`background: var(--color-surface)` — recessed relative to the editable fields,
which is the dark-theme equivalent of today's `#f8fafc` and reads as
not-editable. Readonly fields keep the same `--color-border-strong` outline; the
editable/readonly distinction is carried by the fill alone, so there is one
border rule for all controls. `.field-label` → `var(--color-brand)`.

This gives three depth steps: page `--color-bg` darkest, readonly
`--color-surface`, editable `--color-surface-strong` lightest — so "where can I
type" is legible without relying on colour.

**§5 Buttons.**

| Button | Background | Text | Ratio |
| --- | --- | --- | --- |
| `.btn-generate` | `--color-surface-strong` | `--color-text` | 13.33 |
| `.btn-web` | `--color-brand` | `--color-bg` | 7.93 |
| `.btn-mobile` | `--color-brand` | `--color-bg` | 7.93 |
| `.btn-copy` | transparent, 1px `--color-brand` border | `--color-brand` | 7.93 |

The shared `button { color: #fff }` rule is removed, since the gold buttons need
dark text; each button class sets its own colour. `:disabled { opacity: 0.55 }`
is unchanged.

**`:focus-visible` changes from `--navy-900` to `--color-brand`.** This is a real
bug fix, not cosmetics: a navy focus ring on a navy ground is invisible, which
would make the page unusable by keyboard.

**§6 Preview & translation.** `.translation` → `--color-surface` fill, 2px
`--color-border`, `--color-text`; inset shadow alpha 0.05 → 0.45.
`.translation__label` → `var(--color-brand)`. `.translation__subject`
border-bottom (hardcoded `#eee`) → `var(--color-border)`.

**§8 Status messages.** `.status` → `background: var(--color-surface)`,
`border-left: 5px solid var(--color-brand)`. The
`.status[data-kind='success']` and `[data-kind='error']` rules are **deleted** —
all kinds look identical by design. `app.js` keeps writing `dataset.kind`; it is
simply no longer styled.

**§9 Tracker chart.** `.tracker` → `--color-surface`. `.tracker__heading` →
`--color-text`. `.tracker__note` → `--color-text-muted`. The `#stats-chart`
sizing rules and the `@media (max-width: 480px)` block are untouched.

**Hardcoded colours removed.** All six: the `body` gradient, `#2d3748`, `#ccc`,
`#f8fafc`, `#fff`, `#eee`. After this change every colour in the file comes from
a token, which is what §1's comment already promises.

---

## 3. Fonts — `styles.css` §0

Copy two files from the Mithra checkout — no download, no package manager:

```
../Lion-and-Sun-Nederland/node_modules/@fontsource-variable/inter/files/
  inter-latin-wght-normal.woff2       48 KB
  inter-latin-ext-wght-normal.woff2   85 KB
```

into `assets/fonts/`. Then two hand-written `@font-face` blocks above the
existing IRANSans ones:

```css
@font-face {
  font-family: 'Inter';
  src: url('../fonts/inter-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;        /* one variable file covers every weight */
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,
                 U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,
                 U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD;
}

@font-face {
  font-family: 'Inter';
  src: url('../fonts/inter-latin-ext-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,
                 U+0304,U+0308,U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,
                 U+2020,U+20A0-20AB,U+20AD-20C0,U+2113,U+2C60-2C7F,U+A720-A7FF;
}
```

Both `unicode-range` values are copied verbatim from that package's `wght.css`.
The ranges matter: without them the browser downloads both files for every
reader instead of only the one it needs.

The three IRANSans `@font-face` blocks are **not touched**. Light stays declared
as `font-weight: 400` — see `CLAUDE.md` → Gotchas for why changing it silently
drops Persian body text back to Tahoma.

Family name is `'Inter'` here, not Mithra's `'Inter Variable'`, because this repo
declares the face itself rather than importing fontsource's stylesheet. Arial
stays in `--font-latin` as the guaranteed fallback.

---

## 4. Chart — `tracker.js`

**Series colours.** Replace `VERSION_COLORS`:

```js
/** Mithra's navy→sky ramp, light enough that every step reads on the dark card. */
const VERSION_COLORS = ['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2'];
```

Each step against the `--color-surface` card: 3.89, 5.54, 7.47, 9.88, 12.82.

The ramp starts at `blue-500`, not `blue-800` — `#1b3a6b` is **1.45 against the
card**, effectively invisible. Do not darken the first step.

**Segment borders.** Each dataset gets `borderColor: '#0a1628', borderWidth: 1`.
Adjacent ramp steps separate by only 1.30–1.43, and in a stacked bar they touch,
so the border does the segmentation structurally rather than relying on
luminance alone.

**Axis, grid and legend colours.** Chart.js defaults to dark grey text
(`#666`) and near-black grid lines — both invisible on navy. Set explicitly:

- `scales.x.ticks.color` and `scales.y.ticks.color` → `--color-text-muted`
- `scales.x.grid.color` and `scales.y.grid.color` → `--color-border`
- `plugins.legend.labels.color` → `--color-text`

Read these from the stylesheet rather than duplicating hex codes into JS:

```js
const css = getComputedStyle(document.documentElement);
const token = (name) => css.getPropertyValue(name).trim();
```

This keeps §1's promise that changing a colour there updates it everywhere. It is
safe because `renderTracker` runs on `window.load`, by which point styles are
applied — see the window-load gotcha in `CLAUDE.md`. `VERSION_COLORS` stays a
literal array, because README §4.5 teaches the collaborator to edit it as hex
codes and that instruction should keep working.

Chart.js's default tooltip is already dark, so it needs no change.

---

## 5. `app.js` — status glyphs

The gold-bar-for-everything decision removes colour as the success/error signal,
so the glyph has to carry it. Today's messages are plain text. Prefix all seven
`showStatus` call sites:

| Kind | Prefix |
| --- | --- |
| `'success'` | `✓ ` |
| `'error'` | `⚠ ` |
| `'info'` | `ℹ ` |

The message wording is otherwise unchanged. `showStatus` itself and
`dataset.kind` are unchanged — only the string literals at the call sites.

This is the only change to `app.js`. No other JS file is touched: `email.js`,
`stats.js`, `config.js` and both data modules have no visual surface.

---

## 6. Markup and documentation

**`index.html`.** One change: `styles.css?v=2` → `?v=3`. No structural or class
changes anywhere.

**`README.md`**, four places that would otherwise document the old design:

- The "Colours, spacing, fonts" table row (line 67) — checked, stays correct as
  written; no edit needed.
- The `VERSION_COLORS` example (line ~279) — quotes the old blue hex codes.
- §4.5 "Add a chart colour" (line ~326) — same list.
- "Change the Persian font" (line ~372) — mentions only IRANSans; add that latin
  text now uses Inter from the same folder, and how to swap it.
- The cache-bust instruction (line ~495) says bump `?v=1` to `?v=2`; it will be
  at `?v=3`.

**`CLAUDE.md`.** Add to Gotchas:

- The palette is now dark; `--shadow` and `:focus-visible` must stay
  dark-theme-aware. A navy focus ring on navy is invisible.
- Chart.js's default tick/grid colours are dark grey and vanish on the navy
  card, so `tracker.js` sets them explicitly from CSS tokens. Do not delete
  those options assuming defaults are fine.
- Gold `#c9a84c` needs dark text on it (7.93); as text on any light ground it is
  2.29 and fails. This trap is now live in the code, not hypothetical.

Add a dated Log entry.

**`DESIGN.md`.** Update the framing: it currently says the Mithra palette is
*not* this repo's active system, which stops being true. Record the three
deliberate divergences from §1 above.

---

## Verification

The window-load and headless-Chrome gotchas in `CLAUDE.md` both bear directly on
this work, so verification is by screenshot, not by asserting on DOM attributes.

1. `for f in assets/js/*.js assets/js/data/*.js; do cp "$f" /tmp/c.mjs; node --check /tmp/c.mjs || echo "FAIL $f"; done`
2. `python3 -m http.server 8000` and look at the page: instruction cards (both
   scripts), every field state (empty, filled, readonly), all four buttons,
   the preview box with generated content, a status message of each kind, and
   the tracker.
3. Tab through the whole page and confirm the gold focus ring is visible on every
   control, including the gold buttons.
4. Confirm Inter is actually loading, not silently falling back to Arial —
   compare a rendered text width against the Arial baseline, the same technique
   used for IRANSans on 2026-08-03.
5. Confirm Persian still renders in IRANSans and not Tahoma. This is the thing
   most likely to break silently, because `--font-fa` and the 400-weight mapping
   interact with the new `--font-latin`.
6. Screenshot the tracker with data and confirm all five ramp steps are
   distinguishable and the axis labels are legible. Per the headless-Chrome
   gotcha, use a delayed load event and `--screenshot`, then look at the image.

**Rollback.** This claim was wrong when first written: `assets/`, `README.md`,
`CLAUDE.md`, `DESIGN.md` and `LICENSE` had never been committed at all — only
`index.html` had — so `git checkout` had nothing to revert *to*. The
implementation plan's Task 0 fixes this by committing the pre-theme state as a
baseline first. After that baseline exists, everything in this spec except the
two new font files is a text change in four then-tracked files, and `git
checkout <baseline>` reverts it. The font files are additive and harmless if
left.

---

## Addendum (2026-08-11, same day): gold widened to cover Generate

The "gold means *send*, and only send" decision above lasted through
implementation and one round of use before the user asked, directly, for
"Generate Email Content" to be gold too. Changed: `.btn-generate` now shares
`.btn-web`/`.btn-mobile`'s rule (`--color-brand` background, `--color-bg`
text) instead of `--color-surface-strong`. Copy All remains the only
non-gold, outlined button.

The rule is now **"gold marks every main-action button"** rather than
"gold means send." This is a direct user request, not a re-litigation of the
contrast reasoning above — nothing about the accessibility argument changed;
gold still always needs dark text on it, and that requirement is what made
this change trivial to satisfy.

A second, unrelated fix landed in the same pass: `button:disabled` used
`opacity: 0.55`, which blends the gold fill with the dark page behind it into
a muddy brown that reads as broken rather than disabled. Replaced with flat
`--color-surface` / `--color-text-muted` / `--color-border`, which overrides
the per-button background cleanly because `:disabled` gives the selector
higher specificity than a plain class — no `!important` needed. See
`CLAUDE.md` → Gotchas and → Log for both.
