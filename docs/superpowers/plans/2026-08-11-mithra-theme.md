# Mithra Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-theme the site to Mithra's visual language — dark navy ground, gold as the single accent, Inter for latin and IRANSans for Persian — without touching markup, campaign texts, or email logic.

**Architecture:** Replace `styles.css` §1's token block with Mithra's flat semantic vocabulary (`--color-bg`, `--color-surface`, `--color-brand`, …) and repoint all 30 usage sites in §2–9. Add Inter as two committed `woff2` files with hand-written `@font-face`. `tracker.js` reads its chart colours from those CSS tokens rather than duplicating hex codes. `app.js` gains a glyph per status kind, because the design makes all status colours identical.

**Tech Stack:** Static HTML/CSS/ES modules. No build step, no bundler, no package manager, no test framework. Chart.js 4.4.1 and supabase-js 2.45.4 from CDN, pinned with SRI.

## Global Constraints

Copied from `docs/superpowers/specs/2026-08-11-mithra-theme-design.md` and `CLAUDE.md`:

- **No build step, no bundler, no framework, no package manager.** No `package.json` may be created. Fonts must be committed files with hand-written `@font-face`.
- **No test framework exists.** There is no pytest/jest/vitest and none may be added. Verification is `node --check` for syntax plus looking at the served page. Every task below states its own concrete check; none of them is a unit test, and that is correct for this repo.
- **`styles.css` keeps its ten numbered sections and its plain-language comments.** A non-technical collaborator reads this file. Do not restructure it, and do not introduce a second token layer (no primitive/semantic split).
- **One flat token layer only**, in §1.
- **IRANSans Light stays declared as `font-weight: 400`.** Changing it to 300 silently drops Persian body text to Tahoma.
- **Never alter campaign texts, politician names, addresses, or email-building logic.** `email.js`, `stats.js`, `config.js`, `data/campaign.js`, `data/politicians.js` are not touched by any task in this plan.
- **Version ids and the `"Name (PARTY)"` politician label format are stored in the database.** Do not change `politicianLabel()`.
- **Publishing is instant.** Anything merged to `main` is live within a minute. All work happens on a branch; nothing is pushed or merged without the user asking.
- **Exact palette values** — the only colours permitted anywhere in `styles.css` after this work:

  | Token | Value |
  | --- | --- |
  | `--color-bg` | `#0a1628` |
  | `--color-surface` | `#0f1f3d` |
  | `--color-surface-strong` | `#142e5c` |
  | `--color-border` | `#243352` |
  | `--color-border-strong` | `#7387a3` |
  | `--color-text` | `#ffffff` |
  | `--color-text-muted` | `#99abc2` |
  | `--color-brand` | `#c9a84c` |

- **Chart ramp**, exact and in this order: `['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2']`. Do **not** darken the first step; `#1b3a6b` is 1.45 against the card and invisible.

---

## File Structure

| File | Change | Responsibility after the change |
| --- | --- | --- |
| `assets/fonts/inter-latin-wght-normal.woff2` | **create** (copy) | Inter latin subset, 48 KB |
| `assets/fonts/inter-latin-ext-wght-normal.woff2` | **create** (copy) | Inter latin-ext subset, 85 KB |
| `assets/css/styles.css` | modify §0–9 | All styling. Every colour comes from a §1 token after this work |
| `assets/js/tracker.js` | modify | Chart. Owns the version ramp; reads text/grid colours from CSS tokens |
| `assets/js/app.js` | modify `showStatus` only | Adds the per-kind status glyph |
| `index.html` | modify 1 line | `?v=2` → `?v=3` |
| `README.md` | modify 4 places | Non-technical maintainer guide, kept in step |
| `CLAUDE.md` | modify | New gotchas + Log entry |
| `DESIGN.md` | modify framing | Records the three deliberate divergences |

### Why §1–9 of `styles.css` is one task and not five

This plan **renames** tokens rather than repointing their values. The moment §1 stops defining `--navy-900`, all 30 usage sites in §2–9 reference an undefined variable and the page renders unstyled. There is no working intermediate state, so §1–9 must land in a single edit and a single commit. Splitting it by CSS section would produce commits that are individually broken.

---

## Task 0: Establish a revertible baseline

**Files:**
- Create: none
- Modify: none (commit only)

**Interfaces:**
- Consumes: nothing
- Produces: a git branch `mithra-theme` and a baseline commit that later tasks can be reverted to

Only `index.html` has ever been committed to this repo. `assets/`, `README.md`, `CLAUDE.md`, `DESIGN.md`, `LICENSE` and `docs/` are all untracked, so **there is currently nothing to revert to.** Every later task depends on this one.

- [ ] **Step 1: Confirm the untracked state**

Run: `git ls-files`
Expected: prints `index.html` and nothing else.

- [ ] **Step 2: Read `.gitignore` before adding anything**

Run: `cat .gitignore`
Expected: it excludes `.claude/settings.local.json` and `.claude/command-log.txt`. Confirm those two do not appear in the next step's output.

- [ ] **Step 3: Create the branch**

```bash
git checkout -b mithra-theme
```

- [ ] **Step 4: Stage everything and check what is about to be committed**

```bash
git add -A
git status --short
```

Expected: `assets/`, `README.md`, `CLAUDE.md`, `DESIGN.md`, `LICENSE`, `docs/`, `.gitignore` and the modified `index.html`. **Verify `.claude/settings.local.json` and `.claude/command-log.txt` are absent.** If either appears, stop and fix `.gitignore` first — the command log may contain paths the user does not want published.

- [ ] **Step 5: Commit the baseline**

```bash
git commit -m "chore: commit existing site state as a baseline

Only index.html was tracked. This commits the July refactor, the docs and
the assets tree so the Mithra re-theme has something to revert to."
```

- [ ] **Step 6: Verify the baseline is clean**

Run: `git status --short`
Expected: empty output.

---

## Task 1: Add Inter

**Files:**
- Create: `assets/fonts/inter-latin-wght-normal.woff2`
- Create: `assets/fonts/inter-latin-ext-wght-normal.woff2`
- Modify: `assets/css/styles.css` §0 (insert above the IRANSans blocks, after the section comment)

**Interfaces:**
- Consumes: the baseline commit from Task 0
- Produces: a font family named `'Inter'`, usable as `font-family: 'Inter', …`. Task 2 defines the `--font-latin` token that consumes it. This task does **not** apply Inter to anything — the page looks unchanged when it is done.

This task is deliberately additive and separately verifiable: an unused `@font-face` changes nothing visually, so if something breaks later you know it was not this.

- [ ] **Step 1: Copy the two files**

```bash
cp ../Lion-and-Sun-Nederland/node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2 assets/fonts/
cp ../Lion-and-Sun-Nederland/node_modules/@fontsource-variable/inter/files/inter-latin-ext-wght-normal.woff2 assets/fonts/
```

- [ ] **Step 2: Verify the copies arrived intact**

Run: `ls -l assets/fonts/`
Expected: five files. The two new ones are 48256 and 85068 bytes. If either is 0 bytes, the source path was wrong — do not proceed.

- [ ] **Step 3: Add the two `@font-face` blocks**

In `assets/css/styles.css`, insert directly after the `/* 0. Fonts */` comment block and **before** the first IRANSans `@font-face`:

```css
/*
   Inter, used for all the English and Dutch text. Same typeface as the Mithra
   foundation site (mithra-iran.org) — see DESIGN.md.

   These are "variable" fonts: one file contains every weight from 100 to 900,
   which is why font-weight says "100 900" instead of a single number.

   The unicode-range list tells the browser which letters are inside each file,
   so it downloads only the one it actually needs. Copied exactly from the
   fontsource package; do not hand-edit it.
*/
@font-face {
  font-family: 'Inter';
  src: url('../fonts/inter-latin-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,
    U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193,
    U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Inter';
  src: url('../fonts/inter-latin-ext-wght-normal.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0100-02BA, U+02BD-02C5, U+02C7-02CC, U+02CE-02D7,
    U+02DD-02FF, U+0304, U+0308, U+0329, U+1D00-1DBF, U+1E00-1E9F, U+1EF2-1EFF,
    U+2020, U+20A0-20AB, U+20AD-20C0, U+2113, U+2C60-2C7F, U+A720-A7FF;
}
```

- [ ] **Step 4: Verify the page is unchanged and the files are reachable**

```bash
python3 -m http.server 8000 &
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" http://localhost:8000/assets/fonts/inter-latin-wght-normal.woff2
curl -s -o /dev/null -w "%{http_code} %{size_download}\n" http://localhost:8000/assets/fonts/inter-latin-ext-wght-normal.woff2
```

Expected: `200 48256` and `200 85068`. A 404 means the `url()` path or the filename is wrong.

Then open `http://localhost:8000` and confirm the page still looks exactly as before — light theme, Arial. Nothing should have changed yet.

- [ ] **Step 5: Commit**

```bash
git add assets/fonts/inter-latin-wght-normal.woff2 assets/fonts/inter-latin-ext-wght-normal.woff2 assets/css/styles.css
git commit -m "feat: add Inter variable font files and @font-face blocks

Copied from the Mithra project's fontsource package. Declared but not yet
applied, so the page is visually unchanged."
```

---

## Task 2: Re-theme `styles.css` §1–9

**Files:**
- Modify: `assets/css/styles.css` §1 (the whole `:root` block) and §2–9 (all 30 token usage sites, plus 6 hardcoded colours)

**Interfaces:**
- Consumes: the `'Inter'` family from Task 1
- Produces: the eight `--color-*` tokens and `--font-latin`, all readable via `getComputedStyle(document.documentElement).getPropertyValue(name)`. Task 4 consumes `--color-text`, `--color-text-muted` and `--color-border` by exactly those names.

This is the single atomic visual change. See "Why §1–9 is one task" above.

- [ ] **Step 1: Replace §1 entirely**

Replace the whole `:root { … }` block with:

```css
/* 1. Design tokens ------------------------------------------------------- */
/*
   Change a colour here and it updates everywhere it is used — including the
   chart, which reads these same values.

   This is the palette of the Mithra foundation site (mithra-iran.org), so the
   two sites look related. DESIGN.md explains where each colour comes from.
*/
:root {
  /* Backgrounds, darkest to lightest. */
  --color-bg: #0a1628;              /* the page itself */
  --color-surface: #0f1f3d;         /* cards, the preview box, the chart card */
  --color-surface-strong: #142e5c;  /* boxes you can type in */

  /* Lines. */
  --color-border: #243352;          /* quiet dividers and card outlines */
  --color-border-strong: #7387a3;   /* outlines of boxes you can type in, which
                                       need to be clearly visible */

  /* Text. */
  --color-text: #ffffff;            /* headings and body text */
  --color-text-muted: #99abc2;      /* small print, notes, chart labels */

  /* The one accent colour: gold. Used for labels, the send buttons and the
     coloured bars on the cards. Gold ALWAYS needs dark text on top of it —
     white on gold is unreadable. */
  --color-brand: #c9a84c;

  --radius: 10px;
  --radius-sm: 8px;
  --gap: 15px;
  /* A stronger shadow than a light theme needs; a faint one is invisible here. */
  --shadow: 0 2px 8px rgba(0, 0, 0, 0.45);

  /* Tells the browser this is a dark page, so scrollbars and the dropdown
     lists it draws itself come out dark instead of white. */
  color-scheme: dark;

  /* Latin text (English and Dutch). Arial is the fallback if Inter fails. */
  --font-latin: 'Inter', Arial, Helvetica, sans-serif;

  /* Persian text. Tahoma is the fallback: it ships on Windows and macOS and has
     real Persian glyphs, so the layout holds even if IRANSans fails to load. */
  --font-fa: 'IRANSans', Tahoma, Arial, sans-serif;
}
```

`color-scheme: dark` is not decoration. Without it the native `<select>` dropdown list renders as dark text on a white popup, and the scrollbar stays light — both visibly wrong against the rest of the page.

- [ ] **Step 2: Replace §2**

```css
/* 2. Base & layout ------------------------------------------------------- */
body {
  font-family: var(--font-latin);
  max-width: 800px;
  margin: auto;
  padding: 16px;
  color: var(--color-text);
  background: var(--color-bg);
}

h1 {
  text-align: center;
  color: var(--color-text);
  font-size: 1.5rem;
}

h2 {
  color: var(--color-text);
  font-size: 1.17rem;
}

.divider {
  margin: 30px 0;
  border: 0;
  border-top: 1px solid var(--color-border);
}
```

`body` is only 800px wide, but a background set on `body` when `html` has none is painted across the whole browser window, so no separate `html` rule is needed. Confirm this visually in Step 9 on a wide window — if navy gutters do not reach the edges, add `html { background: var(--color-bg); }`.

- [ ] **Step 3: Replace the colour declarations in §3**

Keep every layout, `direction`, `text-align` and `line-height` declaration exactly as it is. Change only these:

```css
.instructions__card {
  /* … flex, min-width, padding, border-radius, font-size, line-height unchanged … */
  background: var(--color-surface);
  box-shadow: var(--shadow);
}

.instructions__card--en {
  border-left: 5px solid var(--color-brand);
}

.instructions__card--fa {
  border-right: 5px solid var(--color-brand);
  /* … direction, text-align, font-family, line-height unchanged … */
}

.instructions__heading--en,
.instructions__heading--fa {
  color: var(--color-brand);
}

.instructions__lead {
  margin: 5px 0;
  font-size: 13px;
  color: var(--color-text-muted);
}

.instructions__rule {
  border: 0;
  border-top: 1px solid var(--color-border);
  margin: 10px 0;
}

.instructions__warning {
  color: var(--color-brand);
  font-weight: bold;
}

.instructions__note {
  margin-top: 10px;
  font-size: 13px;
  color: var(--color-text-muted);   /* was a hardcoded #2d3748 */
  font-style: italic;
}
```

The two `.instructions__heading--*` rules collapse into one selector because both are now gold. The `[lang='fa']` rule is unchanged.

- [ ] **Step 4: Replace §4**

```css
/* 4. Form fields --------------------------------------------------------- */
.field-label {
  color: var(--color-brand);
  font-weight: bold;
  margin-top: var(--gap);
  display: block;
}

select,
textarea,
input,
button {
  width: 100%;
  margin: 8px 0;
  padding: 12px;
  font-size: 16px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border-strong);
  box-sizing: border-box;
  font-family: inherit;
}

/* Boxes you can type in are the lightest thing on the page, so it is obvious
   where to type. */
select,
textarea,
input {
  background: var(--color-surface-strong);
  color: var(--color-text);
}

textarea {
  min-height: 200px;
}

/* Boxes filled in for you sit one shade darker, so they read as "not yours to
   edit" without needing a different colour. */
input[readonly],
textarea[readonly] {
  background: var(--color-surface);
  color: var(--color-text);
}
```

- [ ] **Step 5: Replace §5**

```css
/* 5. Buttons (shared) ---------------------------------------------------- */
/* Each button sets its own text colour: the gold ones need dark text on top,
   the others need white. */
button {
  border: none;
  font-weight: bold;
  cursor: pointer;
}

button:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* The focus ring must be gold, not navy — a navy ring on a navy page is
   invisible, which makes the page unusable with a keyboard. */
button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
  outline: 3px solid var(--color-brand);
  outline-offset: 2px;
}

.btn-generate {
  background: var(--color-surface-strong);
  color: var(--color-text);
}

/* Gold means "this sends your email". Nothing else on the page is gold-filled. */
.btn-web,
.btn-mobile {
  background: var(--color-brand);
  color: var(--color-bg);
  height: 50px;
}

.btn-copy {
  background: transparent;
  color: var(--color-brand);
  border: 1px solid var(--color-brand);
}
```

The shared `button { color: #fff }` rule is gone. `.btn-copy`'s border wins over `button { border: none }` because a class selector outranks a type selector.

> **Superseded same day — see the Addendum at the end of this plan.**
> `.btn-generate` above shipped as specified here, then the user asked for it
> to be gold too. Current code: `.btn-generate` shares `.btn-web`/`.btn-mobile`'s
> rule. This step is left as written because it is what Task 2 actually ran.

- [ ] **Step 6: Replace the colour declarations in §6**

```css
.translation {
  /* … padding, border-radius, font-size, margin-top, line-height, text-align,
     white-space unchanged … */
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  color: var(--color-text);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.45);
}

.translation__label {
  color: var(--color-brand);
  display: block;
  margin-bottom: 5px;
}

.translation__subject {
  margin-bottom: var(--gap);
  font-weight: bold;
  border-bottom: 1px solid var(--color-border);   /* was a hardcoded #eee */
  padding-bottom: 5px;
}
```

- [ ] **Step 7: Replace §8 and delete the two `data-kind` rules**

```css
/* 8. Status messages ----------------------------------------------------- */
/* Replaces the old alert() pop-ups, which mobile browsers often suppress.

   Every message looks the same on purpose — the tick, warning or info symbol
   at the start of the text is what tells them apart. app.js adds that symbol. */
.status {
  margin: var(--gap) 0 0;
  padding: 12px;
  border-radius: var(--radius-sm);
  border-left: 5px solid var(--color-brand);
  background: var(--color-surface);
  font-size: 14px;
  box-shadow: var(--shadow);
}
```

Delete `.status[data-kind='success']` and `.status[data-kind='error']` entirely. `app.js` keeps writing `dataset.kind`; it is simply no longer styled.

- [ ] **Step 8: Replace the colour declarations in §9**

```css
.tracker {
  /* … padding, border-radius, margin-top, position, height, width unchanged … */
  background: var(--color-surface);
  box-shadow: var(--shadow);
}

.tracker__heading {
  text-align: center;
  margin: 0 0 10px;
  color: var(--color-text);
  font-size: 18px;
}

.tracker__note {
  font-size: 14px;
  color: var(--color-text-muted);
  text-align: center;
}
```

Leave the `#stats-chart` sizing rules and the `@media (max-width: 480px)` block alone.

- [ ] **Step 9: Verify no colour is left hardcoded and nothing references a dead token**

```bash
grep -n "#[0-9a-fA-F]\{3\}" assets/css/styles.css | grep -v "^5[0-9]:\|^6[0-9]:\|^7[0-9]:"
grep -n "navy-900\|navy-700\|blue-600\|green-600\|grey-500\|red-700\|--ink\|--surface\b\|border-soft" assets/css/styles.css
```

Expected: the first prints only the `rgba(0, 0, 0, …)` shadow lines; the second prints nothing at all. Any hit on the second command is a usage site that was missed and will render unstyled.

- [ ] **Step 10: Look at the page**

Serve with `python3 -m http.server 8000` and open it. Check, in order:
1. The whole window is navy, edge to edge, on a wide browser window.
2. Both instruction cards are navy with a gold bar and a gold heading; the Persian one still reads right-to-left in IRANSans, not Tahoma.
3. The field labels are gold. Click into the Name box — it is lighter than the page, with a clearly visible outline.
4. Open the politician dropdown — the popup list is dark, not white. If it is white, `color-scheme: dark` is missing or misplaced.
5. "Generate Email Content" is a solid navy button; press it. Subject/Recipient/Preview fill in and sit one shade *darker* than the boxes you type in.
6. The two Open Email buttons are gold with dark text. "Copy All" is outlined gold on transparent.
7. Press Tab repeatedly through every control. A gold ring appears on each one, including on the gold buttons.

- [ ] **Step 11: Commit**

```bash
git add assets/css/styles.css
git commit -m "feat: re-theme to the Mithra palette

Replaces the light token set with Mithra's flat semantic tokens and repoints
all 30 usage sites. Gold is the only accent and is reserved for the two send
buttons. Also removes the six remaining hardcoded colours, and changes the
focus ring from navy to gold — a navy ring on a navy page is invisible."
```

---

## Task 3: Add a glyph per status kind

**Files:**
- Modify: `assets/js/app.js:42-46` (the `showStatus` function only)

**Interfaces:**
- Consumes: nothing from earlier tasks
- Produces: no new exported names. `showStatus(message, kind)` keeps its exact signature — `kind` is one of `'info' | 'success' | 'error'`, defaulting to `'info'`. All seven existing call sites are unchanged.

§8 makes every status message the same colour, so the glyph is now the only thing distinguishing success from error. Putting it in `showStatus` rather than in the seven call sites means new messages get it automatically.

- [ ] **Step 1: Replace `showStatus`**

```js
/**
 * A symbol per kind. The status messages are all the same colour by design
 * (see styles.css section 8), so this symbol is what tells them apart.
 */
const STATUS_GLYPH = { info: 'ℹ', success: '✓', error: '⚠' };

function showStatus(message, kind = 'info') {
  el.status.textContent = message ? `${STATUS_GLYPH[kind]} ${message}` : '';
  el.status.dataset.kind = kind;
  el.status.hidden = !message;
}
```

`hidden` still tests the original `message`, not the prefixed string, so clearing the status still hides the element.

- [ ] **Step 2: Syntax-check every module**

```bash
for f in assets/js/*.js assets/js/data/*.js; do cp "$f" /tmp/c.mjs; node --check /tmp/c.mjs || echo "FAIL $f"; done
```

Expected: no `FAIL` lines.

- [ ] **Step 3: Exercise all three kinds in the browser**

Serve and open the page, then:

| Action | Expected status text |
| --- | --- |
| Press "Generate Email Content" with a politician selected | `✓ Ready. Read the English translation below, …` |
| Then change the politician dropdown | `ℹ Your choices changed — press "Generate Email Content" again.` |
| Reload, then press "Copy All to Clipboard" without generating | `⚠ Please press "Generate Email Content" first.` |

All three show the same gold bar. The glyph is the only difference — that is the intended behaviour.

- [ ] **Step 4: Commit**

```bash
git add assets/js/app.js
git commit -m "feat: prefix status messages with a per-kind glyph

The Mithra palette has one accent, so success and error messages are now
the same colour. The glyph carries the distinction instead."
```

---

## Task 4: Re-colour the chart

**Files:**
- Modify: `assets/js/tracker.js:14` (`VERSION_COLORS`), `:19-32` (`tallyActions`), `:69-86` (the `options` object)

**Interfaces:**
- Consumes: `--color-text`, `--color-text-muted` and `--color-border` from `styles.css` §1 (Task 2)
- Produces: no new exports. `renderTracker(campaign, canvas, noteElement)` keeps its exact signature.

- [ ] **Step 1: Replace `VERSION_COLORS` and add the token reader**

```js
/**
 * One colour per email version, light to lighter. They are all shades of the
 * same blue on purpose; the numbers only need to be told apart, not colour-coded.
 * Do not make the first one darker — it would disappear against the card.
 */
const VERSION_COLORS = ['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2'];

/**
 * Read one colour from styles.css section 1, so the chart follows the
 * stylesheet instead of repeating its colours here. Safe because the chart is
 * built on window.load, by which point the stylesheet has been applied.
 */
function token(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}
```

- [ ] **Step 2: Add a border between stacked segments in `tallyActions`**

Inside the object returned by the `campaign.versions.map` callback, alongside `backgroundColor`:

```js
    backgroundColor: VERSION_COLORS[index % VERSION_COLORS.length],
    /* A thin dark line between stacked blocks, so neighbouring shades stay
       separate even though they are close in brightness. */
    borderColor: token('--color-bg'),
    borderWidth: 1,
```

- [ ] **Step 3: Give the axes and legend explicit colours**

Chart.js defaults to dark grey axis text and near-black grid lines, both invisible on the navy card. Replace the `options` object with:

```js
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: { color: token('--color-text-muted') },
          grid: { color: token('--color-border') },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { precision: 0, color: token('--color-text-muted') },
          grid: { color: token('--color-border') },
        },
      },
      plugins: {
        legend: { labels: { color: token('--color-text') } },
        tooltip: {
          callbacks: {
            title: (items) => {
              const politician = politicians[items[0].dataIndex];
              return politicianLabel(politician);
            },
          },
        },
      },
    },
```

The `tooltip.callbacks.title` function is unchanged — keep it exactly as it was. Chart.js's default tooltip is already dark and needs nothing.

- [ ] **Step 4: Syntax-check**

```bash
for f in assets/js/*.js assets/js/data/*.js; do cp "$f" /tmp/c.mjs; node --check /tmp/c.mjs || echo "FAIL $f"; done
```

Expected: no `FAIL` lines.

- [ ] **Step 5: Verify the token reader returns real values**

The Supabase backend is dead (see `CLAUDE.md` → Gotchas), so the chart will show "could not be loaded" rather than bars. That means the axis colours cannot be confirmed from a live chart. Confirm the reader works instead — serve the page, open the browser console and run:

```js
getComputedStyle(document.documentElement).getPropertyValue('--color-text-muted').trim()
```

Expected: `"#99abc2"`. An empty string means Task 2's token names do not match the names used here, and the chart would silently fall back to Chart.js's invisible defaults.

- [ ] **Step 6: Verify the chart renders against a stub**

Because the real backend is gone, force data through it. In the console:

```js
const c = document.getElementById('stats-chart');
new window.Chart(c.getContext('2d'), {
  type: 'bar',
  data: { labels: ['A', 'B'], datasets: [1, 2, 3, 4, 5].map((n, i) => ({
    label: `Version ${n}`,
    data: [i + 1, 5 - i],
    backgroundColor: ['#4a7fb5','#6a9bc6','#89b4d8','#b0cde3','#d6e6f2'][i],
    borderColor: '#0a1628', borderWidth: 1,
  })) },
  options: { scales: {
    x: { stacked: true, ticks: { color: '#99abc2' }, grid: { color: '#243352' } },
    y: { stacked: true, ticks: { color: '#99abc2' }, grid: { color: '#243352' } } },
    plugins: { legend: { labels: { color: '#ffffff' } } } },
});
```

Expected: five distinguishable bands per bar, legible axis numbers, visible politician labels, and a legend in white. If any band vanishes into the card, the ramp was altered.

- [ ] **Step 7: Commit**

```bash
git add assets/js/tracker.js
git commit -m "feat: re-colour the chart for the dark theme

Version bars use Mithra's blue ramp with a dark border between stacked
segments. Axis, grid and legend colours are now set explicitly and read from
styles.css section 1 — Chart.js's defaults are dark grey and invisible on navy."
```

---

## Task 5: Cache-bust and update the four documents

**Files:**
- Modify: `index.html:35` (`?v=2` → `?v=3`)
- Modify: `README.md` — lines ~279, ~326-329, ~372-380, ~495-496
- Modify: `CLAUDE.md` — Gotchas and Log
- Modify: `DESIGN.md` — the opening framing block

**Interfaces:**
- Consumes: the finished code from Tasks 1–4
- Produces: nothing consumed by later tasks

`CLAUDE.md` requires that `README.md` is updated in the same commit as a behaviour change, so this task is not optional polish.

- [ ] **Step 1: Bump the stylesheet version**

In `index.html`, change `href="assets/css/styles.css?v=2"` to `?v=3`. This is the only change to `index.html` in the entire plan.

- [ ] **Step 2: Update the `VERSION_COLORS` examples in `README.md`**

Two places quote the old blue list — around line 279 (adding a sixth version) and §4.5 "Add a chart colour" around line 326. Replace both occurrences of

```js
const VERSION_COLORS = ['#2b6cb0', '#4299e1', '#63b3ed', '#90cdf4', '#bee3f8'];
```

with

```js
const VERSION_COLORS = ['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2'];
```

In §4.5, add a sentence: "Pick something light. The card behind the chart is dark navy, so a dark colour will not be visible against it."

- [ ] **Step 3: Rewrite the "Change the Persian font" section of `README.md`**

It currently describes only IRANSans. Retitle it "Change the fonts" and cover both faces: latin text uses **Inter** (`assets/fonts/inter-latin-*.woff2`), Persian uses **IRANSans**. The swap procedure is the same four steps, but step 3 becomes "update `--font-latin` or `--font-fa` in section 1, whichever you changed". Keep the existing warning about IRANSans having no Regular weight.

- [ ] **Step 4: Fix the cache-bust instruction in `README.md`**

Around line 495 it says to bump `?v=1` to `?v=2`. It will now be at `?v=3`. Reword it so it does not name specific numbers: "find `styles.css?v=` followed by a number, and add one to that number."

- [ ] **Step 5: Add a colours section to `README.md`**

After the fonts section, add a short "Change the colours" section: all colours live in `styles.css` section 1; each is a `--color-…` line; changing one updates the whole page including the chart. State the one rule plainly: "Gold (`--color-brand`) must always have dark text on top of it. White text on gold is unreadable."

- [ ] **Step 6: Add three gotchas to `CLAUDE.md`**

- Gold `#c9a84c` needs dark text on it (7.93 with `--color-bg`); as text on any light ground it is 2.29 and fails everything. This trap is now live in the code.
- Chart.js's default tick and grid colours are dark grey and vanish on the navy card, so `tracker.js` sets them explicitly from CSS tokens via `getComputedStyle`. Do not delete those options assuming the defaults are fine.
- `color-scheme: dark` in §1 is load-bearing: without it the native `<select>` popup and the scrollbar render light against the dark page.

Also correct the existing IRANSans gotcha if it implies the theme is light, and add a Log entry dated 2026-08-11 recording the re-theme and that the four decisions came from the user.

- [ ] **Step 7: Rewrite `DESIGN.md`'s framing**

Its opening block currently says the Mithra palette is **not** this repo's active system. That is now false. Replace that block with a note that this repo adopted the palette and Inter on 2026-08-11, that `styles.css` §1 is the live copy, and that this file remains the record of where the values came from. Then record the three deliberate divergences:

1. `--color-text-subtle` `#7387a3` is not carried over as text — it fails on raised surfaces. `--color-text-muted` `#99abc2` is used instead.
2. No green or red. Mithra declares both and uses neither, because on dark they score 3.68 and 2.90.
3. `slate-400 #7387a3` is reused as `--color-border-strong`, an input outline — 3.63 against the field fill and 4.94 against the page, clearing WCAG 1.4.11 on both sides of the edge.

Keep the gold-trap section as it is; it is still the most important thing in the file.

- [ ] **Step 8: Verify the docs match the code**

```bash
grep -n "2b6cb0\|4299e1\|63b3ed\|90cdf4\|bee3f8" README.md CLAUDE.md DESIGN.md
grep -n "v=2" index.html
```

Expected: both print nothing. A hit on the first means a stale chart colour is still documented; a hit on the second means the cache-bust was missed and visitors would get the old stylesheet.

- [ ] **Step 9: Commit**

```bash
git add index.html README.md CLAUDE.md DESIGN.md
git commit -m "docs: update the guides for the Mithra theme

Bumps the stylesheet cache-buster, refreshes the chart colours and font
instructions in README, records the new traps in CLAUDE.md, and corrects
DESIGN.md, which claimed this palette was not in use here."
```

---

## Task 6: Whole-page verification

**Files:**
- Modify: none

**Interfaces:**
- Consumes: everything from Tasks 1–5
- Produces: a screenshot at `/tmp/mithra-verify.png` and a go/no-go verdict

The two relevant traps in `CLAUDE.md`: the chart must be built on `window.load`, and headless verification with `--virtual-time-budget` samples at t≈0 while the network is still pending, which has produced two false "verified" claims here before. **This task is verified by looking at a screenshot, not by asserting on DOM attributes** — `hidden` is also the initial state, so its absence proves nothing.

- [ ] **Step 1: Syntax-check everything one last time**

```bash
for f in assets/js/*.js assets/js/data/*.js; do cp "$f" /tmp/c.mjs; node --check /tmp/c.mjs || echo "FAIL $f"; done
```

Expected: no `FAIL` lines.

- [ ] **Step 2: Screenshot the full page**

```bash
python3 -m http.server 8765 &
sleep 1
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-sandbox --window-size=900,3000 --screenshot=/tmp/mithra-verify.png \
  --virtual-time-budget=8000 http://localhost:8765/
```

- [ ] **Step 3: Look at the screenshot**

Open `/tmp/mithra-verify.png` and confirm: navy throughout, gold bars on both cards, gold field labels, gold-filled Open Email buttons with dark text, outlined Copy button, and the Persian card rendering right-to-left.

- [ ] **Step 4: Confirm Inter is actually in use, not silently falling back to Arial**

The failure mode this catches: a wrong `url()` path means Inter never loads, the page renders in Arial, and it still looks fine. Same technique used for IRANSans on 2026-08-03. In the browser console:

```js
document.fonts.check('16px Inter')
```

Expected: `true`. Then measure, which is the stronger check:

```js
const m = (font) => { const s = document.createElement('span');
  s.style.font = `16px ${font}`; s.style.position = 'absolute';
  s.textContent = 'Email Politicians Netherlands'; document.body.append(s);
  const w = s.offsetWidth; s.remove(); return w; };
[m('Inter'), m('Arial')]
```

Expected: two **different** numbers. Identical widths mean Inter is not loading and Arial is being used for both.

- [ ] **Step 5: Confirm Persian still renders in IRANSans, not Tahoma**

This is the likeliest silent breakage, because `--font-latin` and `--font-fa` now coexist and IRANSans's Light-mapped-to-400 is deliberately unusual. In the console:

```js
const fa = document.querySelector('.instructions__card--fa');
[getComputedStyle(fa).fontFamily, document.fonts.check('400 16px IRANSans')]
```

Expected: the family string starts with `IRANSans`, and the check is `true`. If the check is `false`, the 400-weight mapping was disturbed and Persian has fallen back to Tahoma.

- [ ] **Step 6: Keyboard pass**

Tab through every control: two text inputs, two dropdowns, Generate, both Open buttons, Copy. A gold ring must be clearly visible on each, including on the two gold-filled buttons where the ring sits just outside the button on the navy ground.

- [ ] **Step 7: Confirm the email output is untouched**

No task in this plan modified `email.js`, `data/campaign.js` or `data/politicians.js`, so this is a regression check, not a change check. Generate an email, then confirm the Subject, Recipient and Preview are non-empty and the Recipient is a `;`-separated address list. Press "Copy All" and confirm the clipboard contains the Dutch body.

- [ ] **Step 8: Report, do not push**

Publishing is instant from `main`. Leave the work on the `mithra-theme` branch, summarise what was verified and what was not (the live chart cannot be verified — the Supabase backend is dead), and ask the user before merging or pushing.

---

## Self-Review

**Spec coverage.** Every section of the spec maps to a task: §1 tokens → Task 2 Step 1; §2–9 CSS → Task 2 Steps 2–8; §3 fonts → Task 1; §4 chart → Task 4; §5 `app.js` → Task 3; §6 markup and docs → Task 5. Verification list items 1–6 → Task 6. Task 0 is new and not in the spec: it exists because `assets/` turned out to be untracked, which also **falsifies the spec's rollback claim** that `git checkout` reverts the work. Task 0 makes that claim true.

**Deviation from the spec, deliberate.** The spec said to prefix the seven `showStatus` call sites. Task 3 puts the glyph inside `showStatus` instead — one edit rather than seven, and new call sites get it for free. Same user-visible result.

**Addition not in the spec.** `color-scheme: dark` in §1. Without it the native `<select>` popup renders light against the dark page, which the spec did not account for.

**Placeholder scan.** No TBDs. Every code step carries the actual code. Task 5's doc edits are prose rewrites described by content and location rather than full text, because they are English paragraphs in files the implementer can read — but each names the exact file, section and the substance required, and Step 8 greps to prove the result.

**Type consistency.** Token names are identical across tasks: Task 2 defines `--color-bg`, `--color-surface`, `--color-surface-strong`, `--color-border`, `--color-border-strong`, `--color-text`, `--color-text-muted`, `--color-brand`, `--font-latin`, `--font-fa`; Task 4 consumes `--color-bg`, `--color-text`, `--color-text-muted`, `--color-border` by exactly those spellings. `showStatus(message, kind)` and `renderTracker(campaign, canvas, noteElement)` keep their existing signatures. `token(name)` is defined once, in Task 4 Step 1, and used in Steps 2 and 3 of that same task.

**One known verification gap.** The live chart cannot be verified end-to-end: the Supabase host in `config.js` returns NXDOMAIN, so `fetchActions` always fails and the tracker shows its error note instead of bars. Task 4 Steps 5–6 work around this with a console stub, which proves the colours render but not that real data flows. Flag this in the Task 6 report rather than claiming the chart is verified.

---

## Addendum (2026-08-11, same day): two changes made after this plan ran

Both landed after Tasks 0–6 executed, in response to real user feedback while
checking the result locally — not part of the plan as originally written.

**1. Gold widened to Generate.** Task 2 Step 5 above gave `.btn-generate` a
`--color-surface-strong` background, matching the spec's "gold means send, and
only send" decision. The user then asked directly for "Generate Email Content"
to be gold too. `.btn-generate` now shares `.btn-web`/`.btn-mobile`'s rule.
Copy All is still the only non-gold, outlined button. `styles.css?v=` was
bumped to `5`.

**2. Fixed a real bug the plan didn't anticipate: muddy disabled buttons.**
`button:disabled { opacity: 0.55 }` (Task 2 Step 5) fades a solid colour
toward the page behind it — correct on the old light background, but on navy
it blends gold into a dirty olive-brown that the user reported as "not
colored as others" and, combined with the buttons' pre-Generate disabled
state producing zero click feedback, as "not working." Root-caused with
`superpowers:systematic-debugging` before fixing: confirmed via a fresh-load
probe that disabled buttons fire no click handler at all (not a JS fault),
and separately caught that a prior CSS fix had shipped without its own
cache-bust — `styles.css?v=` and its content had drifted apart mid-session.
Fix: `button:disabled` now sets flat `--color-surface` / `--color-text-muted`
/ `--color-border`, which overrides `.btn-web`/`.btn-mobile`/`.btn-copy`'s own
colours without `!important`, because `:disabled` gives the selector higher
specificity than a plain class.

**Lesson for future edits to this file:** bump `styles.css?v=` in the *same*
edit that touches the stylesheet, not in a separate pass — see the new
`CLAUDE.md` → Gotchas entry on cache-busting.
