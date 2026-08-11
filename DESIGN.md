# DESIGN.md

Brand reference for the **Mithra — Lion and Sun Foundation** identity, read from
the `Lion-and-Sun-Nederland` source (mithra-iran.org). Every token, count and
contrast ratio below was verified against that repo on 2026-08-04.

**Read on demand, not every session.** Unlike `CLAUDE.md`, nothing here is a
standing instruction. Consult it when a task involves this repo's fonts, colours
or visual alignment with the foundation's site.

> **This repo adopted this palette and these fonts on 2026-08-11.**
> `assets/css/styles.css` §0–1 is now the *live* copy — dark navy ground, gold
> accent, Inter for latin, IRANSans for Persian. This file stays as the record
> of where those values came from and why, not as a proposal.
>
> This file does **not** restate this repo's own tokens — read `styles.css` §1,
> which is the only source of truth for them and cannot drift from itself. Three
> places this repo's tokens deliberately differ from Mithra's are listed in
> [What this repo did differently](#what-this-repo-did-differently).

---

## Mithra fonts

Two self-hosted faces, chosen per language. Neither site loads a webfont from a
CDN.

### Inter Variable — latin (en/nl)

One variable file covers every weight; the axis is weight only.

- Applied to `html, body` via a `--font-default` token.
- Stack: `"Inter Variable", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Weights used: **400** body, **500** (once, in an article page), **600** card
  titles, **700** headings and labels.
- Ships as 7 `woff2` subsets, each carrying a `unicode-range` — 213 KiB in total,
  but a latin reader downloads only the two latin cuts, 130 KiB.

The Mithra site installs it from npm (`@fontsource-variable/inter@^5.2.8`).
**That route is closed here** — this repo has no package manager by hard
constraint. To use Inter here, copy the two latin `woff2` files into
`assets/fonts/` and declare them by hand; see
[Adding Inter without a package manager](#adding-inter-without-a-package-manager).

### IRANSans — Persian (fa)

**This repo already ships IRANSans** — the same three `.woff` files, copied from
the Mithra project (see `CLAUDE.md` → Log, 2026-08-03). Only Bold, Light and
UltraLight exist; there is **no Regular**.

Three differences between the two repos, all deliberate:

| | Mithra site | This repo |
| --- | --- | --- |
| Family name | `"IranSans"` | `'IRANSans'` |
| Declared | inline in `Layout.astro`, only when `lang === "fa"` | always, in `styles.css` §0 |
| Light file declared as | `font-weight: 300` | **`font-weight: 400`** |
| Body text asks for | 300 | 400 (inherits) |
| Bold file | 700 | 700 |
| UltraLight (200) | declared, never used | declared, never used |

**Do not change this repo's weight mapping to match Mithra's.** `styles.css` §0
maps Light to 400 so ordinary Persian text renders in Light without every rule
asking for 300. Changing it to 300 silently drops Persian body text back to
Tahoma unless the Persian card's weight is changed in the same edit. Already
recorded as a gotcha in `CLAUDE.md`.

Neither repo sets a `unicode-range` on IRANSans, so it renders latin glyphs and
numerals inside Persian blocks too, rather than deferring to the latin face.

**Both repos ship legacy `.woff`.** `woff2` superseded it ~a decade ago and is
roughly 30% smaller — about 48 KB off the two files actually used. Converting is
a drop-in change here: same `@font-face` blocks, `format('woff2')`, no build step.

**Licensing is unresolved** and already flagged under `CLAUDE.md` → Open
questions: IRANSans is a commercial Persian typeface, this repo is public and
serves the files, and no licence accompanied them. If it turns out unlicensed,
the fix is an OFL face — **Vazirmatn**, Estedad or Sahel — which would also
supply the Regular weight IRANSans lacks and make the 400-mapping hack
unnecessary. Do not deepen the dependency on IRANSans before that is settled.

---

## Mithra palette

Three layers in `src/styles/tokens.css`: raw primitives feed semantic tokens,
plus a small `rgb()` helper layer for overlays. Components reference only the
semantic and overlay layers.

Fifteen colour primitives, but the defining fact is that **seven of them are one
hue** — a navy ramp — with gold as the only interruption.

```css
/* primitives — the navy ramp, dark to light */
--lsf-navy-950:  #0a1628;   /* page ground */
--lsf-navy-900:  #0f1f3d;
--lsf-blue-900:  #142e5c;
--lsf-blue-800:  #1b3a6b;
--lsf-slate-800: #243352;
--lsf-blue-500:  #4a7fb5;
--lsf-sky-300:   #89b4d8;

/* neutrals */
--lsf-white:     #ffffff;
--lsf-slate-300: #99abc2;
--lsf-slate-400: #7387a3;   /* see contrast note */

/* the only non-navy hue in use */
--lsf-gold-500:  #c9a84c;

/* declared but never referenced anywhere in src/ */
--lsf-green-700: #088957;
--lsf-red-700:   #c42b2b;
--lsf-flag-green:#0f5344;
--lsf-flag-red:  #b10104;

/* rgb helpers, for the overlay layer only */
--lsf-navy-950-rgb: 10 22 40;
--lsf-blue-900-rgb: 20 46 92;
--lsf-blue-800-rgb: 27 58 107;

/* semantic layer */
--color-bg:             var(--lsf-navy-950);
--color-surface:        var(--lsf-navy-900);
--color-surface-strong: var(--lsf-blue-900);
--color-surface-muted:  var(--lsf-slate-800);
--color-text:           var(--lsf-white);
--color-text-muted:     var(--lsf-slate-300);
--color-text-subtle:    var(--lsf-slate-400);
--color-brand:          var(--lsf-gold-500);
--color-border:         var(--lsf-slate-800);
--color-accent-blue:    var(--lsf-blue-500);
--color-link:           var(--lsf-gold-500);   /* unused — see below */
--color-accent-sky:     var(--lsf-sky-300);    /* unused */
--color-flag-green:     var(--lsf-flag-green); /* unused */
--color-flag-red:       var(--lsf-flag-red);   /* unused */

/* overlays */
--overlay-navy-50 / -55 / -75      rgb(navy-950 / .5 .55 .75)
--overlay-blue-15                  rgb(blue-800 / .15)
--overlay-blue-20 / -25 / -35      rgb(blue-900 / .2 .25 .35)
```

| Token | Role on the Mithra site |
| --- | --- |
| `--color-bg` | page ground, nothing else |
| `--color-surface` | header, footer, card panels |
| `--color-surface-strong` | card bodies, location chips |
| `--color-surface-muted` | card borders, muted chips |
| `--color-text` | headings, card titles |
| `--color-text-muted` | body copy, nav links |
| `--color-text-subtle` | card dates, footer meta, header logo subtitle and nav |
| `--color-brand` | every accent — labels, links, buttons, badges, active nav (36 uses across 13 files) |
| `--color-border` | every rule and outline |
| `--color-accent-blue` | calendar-card date strip, and one of four randomly-picked card top-border colours (2 uses) |

Gold carries the entire accent load. There is no second accent hue: `--color-link`
is just gold again and is never referenced — links use `--color-brand` directly.
The site declares status and flag colours (green, red, flag green, flag red) and
`--color-accent-sky`, and **uses none of them**.

### Contrast on Mithra's own dark grounds

White (18.13), gold (7.93) and `slate-300` (7.73) all clear AAA on
`--color-bg` — the palette is sound where it matters. One real flaw:
**`--color-text-subtle` `#7387a3` passes on the page ground (4.94) but fails on
every raised surface** — 4.46 on `--color-surface`, 3.63 on `-strong`, 3.43 on
`-muted` — which is exactly where the site uses it, for 13px card dates and
footer meta. Raising it to `#8496b0` would clear 4.5 on `--color-surface` (5.43)
without disturbing the ramp. Also `white on --color-accent-blue` is 4.20, which
fails for small text.

That is a bug in the source site, not a pattern to copy.

---

## What this repo did differently

Three deliberate divergences from Mithra's own values, made when the palette
was adopted on 2026-08-11:

1. **No `--color-text-subtle`.** Mithra's `slate-400 #7387a3` fails as text on
   every raised surface it uses it on — 4.46 on `--color-surface`, 3.63 on
   `-strong` — a real bug in the source site (see the contrast table above).
   This repo's muted text uses `--color-text-muted` (`slate-300 #99abc2`,
   6.98 on `--color-surface`) everywhere instead.
2. **No green or red.** Mithra declares `green-700` and `red-700` and uses
   neither, because on its own dark grounds they score 3.68 and 2.90 — unusable
   as text. This repo's status messages (success/error) carry no colour at all;
   they share one gold bar and are told apart by a ✓/⚠/ℹ glyph instead.
3. **`slate-400 #7387a3` is reused, but as a border, not text** —
   `--color-border-strong`, the outline on every input. It clears WCAG 1.4.11's
   3:1 for a non-text boundary on both sides of the edge it draws (3.63 against
   the field fill, 4.94 against the page), which is a different bar than the
   4.5:1 text failure above.

Full implementation record: `docs/superpowers/specs/2026-08-11-mithra-theme-design.md`.

### The gold trap — read this first

**Mithra's gold is a dark-ground colour and does not survive on white.**

| Gold `#c9a84c` on | Ratio | Verdict |
| --- | --- | --- |
| this repo's `--surface` `#ffffff` | **2.29** | fails everything |
| this repo's page gradient `#f7fafc` | **2.18** | fails everything |
| Mithra's `--color-bg` `#0a1628` | 7.93 | AAA |

So on this light site gold can only appear as a **background with dark text on
it** (navy-950 on gold is 7.93, AAA) — a badge, a filled button, a rule. Never as
link, heading or body colour. The obvious move, "use the brand gold for
headings", produces unreadable text.

The navy end of the ramp transfers cleanly, being dark:

| Mithra colour on white | Ratio | Small text |
| --- | --- | --- |
| `navy-950 #0a1628` | 18.13 | AAA |
| `blue-900 #142e5c` | 13.33 | AAA |
| `blue-500 #4a7fb5` | 4.20 | large only |
| `slate-400 #7387a3` | 3.67 | large only |

Separately, and independent of Mithra: this repo's own `--green-600 #38a169`
gives its white button label only **3.25**, the weakest contrast on the page.
Darkening it to `#2f8659` clears 4.5 (4.49) without changing the hue.

### Constraints any adoption must respect

1. **No npm, no build step, no bundler** (`CLAUDE.md` hard constraint 1). Fonts
   must be committed files with hand-written `@font-face`; tokens must be plain
   custom properties in `styles.css` §1.
2. **Keep IRANSans Light mapped to 400** here, whatever Mithra does.
3. **Settle IRANSans licensing** before adding more Persian weights or files.
4. **Additive, in the existing idiom.** `styles.css` is one file in ten numbered
   sections with plain-language comments a non-technical collaborator reads. New
   tokens go in §1 with a comment saying what they are for; do not introduce a
   second token layer or restructure the file.
5. **Verify in the browser, not by reading.** Serve with
   `python3 -m http.server 8000` and check the Persian card and the preview box,
   which are the two places type changes show up first.

### Adding Inter without a package manager

Download `inter-latin-wght-normal.woff2` and `inter-latin-ext-wght-normal.woff2`
(from the `@fontsource-variable/inter` release, or fonts.google.com), commit them
to `assets/fonts/`, then in `styles.css` §0:

```css
@font-face {
  font-family: 'Inter';
  src: url('../fonts/inter-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;          /* one variable file, whole range */
  font-style: normal;
  font-display: swap;
  unicode-range: /* copy verbatim from fontsource's wght.css */;
}
```

then in §1 add `--font-latin: 'Inter', Arial, Helvetica, sans-serif;` and swap
`body { font-family: … }` to use it. Keep Arial in the stack — it is the current
face and the guaranteed fallback.

Two caveats:

- Copy each subset's `unicode-range` from `wght.css` rather than hand-typing it;
  without it the browser downloads both files for every reader.
- This repo's Persian rules use `--font-fa`, which puts IRANSans first and falls
  back to Tahoma. Adding Inter to the latin side does not touch that, and should
  not — Inter has no Persian glyphs.
