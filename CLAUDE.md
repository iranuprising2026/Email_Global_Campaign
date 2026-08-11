# CLAUDE.md

Guidance for Claude Code when working in this repository. Read this before
touching any file.

**This file is maintained by Claude.** See
[Keeping this file current](#keeping-this-file-current) — it defines exactly when
to update it. Do not let it drift out of date.

---

## What this is

A single-page, static advocacy site that helps people in the Netherlands email
members of the Dutch parliament (Tweede Kamer) demanding action against the
executions in Iran. It prepares a `mailto:` link; **it never sends mail itself**
— every email is sent by a real person from their own mailbox.

Published with GitHub Pages from `main`. No build step, no server of its own.

Human-facing documentation lives in `README.md`, which is written as a guide for
a **non-technical collaborator**. When you change behaviour, update that guide in
the same commit.

---

## Hard constraints

Violating any of these breaks the project for the people who maintain it:

1. **No build step, no bundler, no framework, no package manager.** The site must
   stay editable by opening a file and refreshing the browser. There is no
   `package.json` and there should not be one.
2. **A non-technical collaborator edits this repo.** Keep the editable data in
   `assets/js/data/` with plain-language "HOW TO EDIT THIS FILE" comment blocks.
   Prefer clarity over cleverness in those two files especially.
3. **Never alter the campaign texts' factual content** — the Dutch/English email
   bodies name real people who were executed. Reformat or restructure freely;
   never reword the substance, change a name, an age, or a date unless the user
   explicitly asks.
4. **A Dutch text and its English translation must always be changed together.**
   The preview box exists so nobody is asked to send words they cannot read.
   Letting the two drift apart is the worst bug this codebase can have.
5. **Never add a `service_role` key.** The Supabase key in `config.js` is a
   publishable/anon key and is meant to be public. Row Level Security is the only
   protection on the stats table.
6. **No personal data leaves the browser.** Only politician label, version id and
   action type are recorded. Do not add fields that identify a supporter.
7. **Publishing is instant.** Anything merged to `main` is live within a minute.
   Verify locally before committing, and never commit on the user's behalf unless
   asked.

---

## File map

```
index.html                  Markup only. Loads Supabase + Chart.js from CDN (pinned, SRI).
assets/css/styles.css       All styling. Tokens in :root, sections 0-9.
assets/fonts/               Inter .woff2 (2 latin subsets) for en/nl + IRANSans
                            .woff (Bold/Light/UltraLight) for Persian.
                            README.md documents provenance and licences;
                            Inter-LICENSE.txt is required by the OFL — keep it.
assets/js/
  config.js                 Supabase creds, STATS_TABLE, ACTIVE_CAMPAIGN_ID, anon signature.
  data/campaign.js        ← Email texts. Campaign → versions[] → {subject,body}×{nl,en}.
  data/politicians.js     ← Recipients. {name, party, primary, cc[]} + label/lookup helpers.
  email.js                  PURE. Exports buildEmail, buildMailtoUrl,
                            formatForClipboard, isMobileUserAgent.
  stats.js                  Supabase read/write. Never throws by design.
  tracker.js                Chart.js stacked bar. Holds VERSION_COLORS.
  app.js                    The ONLY file that touches the DOM.
docs/supabase-schema.sql    Table + RLS policies (reconstructed, see Open questions).
README.md                   Non-technical maintainer guide.
CLAUDE.md                   This file.
DESIGN.md                   Mithra brand reference (fonts + palette) from the
                            Lion-and-Sun-Nederland repo. NOT this repo's active
                            system. Read on demand, not every session. Source of
                            truth is that repo, checked out locally at
                            ../Lion-and-Sun-Nederland — verify, never trust.
LICENSE                     MIT (see Open questions).
.claude/settings.local.json Personal Claude hooks. Gitignored — the collaborator
                            does not inherit them.
.claude/command-log.txt     Gitignored log of every Bash command run here.
```

`email.js` is pure and has no DOM or network access — put logic there, not in
`app.js`, so it stays testable.

---

## Commands

Verified working on this machine. Add to this list whenever a new command proves
useful; correct it whenever one turns out to be wrong.

**Serve locally** (required — ES modules will not load from `file://`):

```bash
python3 -m http.server 8000    # then open http://localhost:8000
```

**Syntax-check every module** (`node --check` treats `.js` as CommonJS and chokes
on `export`, so copy to `.mjs` first):

```bash
for f in assets/js/*.js assets/js/data/*.js; do cp "$f" /tmp/c.mjs; node --check /tmp/c.mjs || echo "FAIL $f"; done
```

**Import a data module in Node** to inspect it (works because `config.js`,
`data/*.js` and `email.js` touch neither DOM nor network):

```bash
node --input-type=module -e "const m = await import('./assets/js/email.js'); console.log(Object.keys(m))"
```

**Load the real page headlessly** and dump the rendered DOM:

```bash
python3 -m http.server 8765 &
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
  --no-sandbox --virtual-time-budget=8000 --dump-dom http://localhost:8765/ > /tmp/dom.html
```

**Recompute an SRI hash** after changing a CDN version in `index.html`:

```bash
curl -sL "<url>" | openssl dgst -sha384 -binary | openssl base64 -A
```

**Regression-test a refactor against git history** — the technique that caught
two mistakes on 2026-07-30: extract the `politicians` and `campaignData` object
literals out of `git show <ref>:index.html`, `eval` them, and assert the new data
modules and `buildEmail`/`buildMailtoUrl` produce byte-identical output across
every politician × version × input × device combination. Not committed; recreate
in the scratchpad when needed.

**Mining the command log.** A `PostToolUse` hook appends every Bash command run
here to `.claude/command-log.txt` as `timestamp<TAB>command` (newlines escaped by
`@tsv`, so one line per command). When curating the section above, read that file
for commands worth keeping — it is raw material, not a section to paste wholesale.
Most entries are one-off greps and are noise.

Note: `gh` is **not** installed on this machine.

---

## Gotchas

- **`mailto:` quirks in `email.js` are deliberate.** The To address is repeated
  as a `to=` parameter because some clients drop the one in the path; the CC
  separator switches between `;` (desktop Outlook) and `,` (mobile Gmail). Built
  by hand with `encodeURIComponent`, **not** `URLSearchParams` — the latter
  encodes spaces as `+` and escapes parentheses differently. Do not "tidy" this
  without testing on real devices.
- **Adding a 6th email version touches three files:** `data/campaign.js`, the
  `(1 to 5)` label in `index.html`, and `VERSION_COLORS` in `tracker.js` (only
  five colours; the list wraps, so a 6th version silently reuses the first).
  Any new bar colour must be **light** — the chart card is `--color-surface`
  navy, and `blue-800 #1b3a6b` is 1.45 against it, i.e. invisible.
- **Adding a campaign touches three files:** `data/campaign.js`,
  `ACTIVE_CAMPAIGN_ID` in `config.js`, and the fallback `<h2 id="campaign-title">`
  in `index.html`.
- **Statistics are keyed on the string `"Name (PARTY)"`.** Renaming a politician
  splits their chart history. Never change `politicianLabel()`'s format.
- **Version ids (`"Version 1"`…) are stored in the database.** Renaming one
  splits its stats too.
- **`stats.js` swallows errors on purpose.** A failed count must never block a
  supporter from sending. Do not make it throw.
- **The Supabase host in `config.js` does not exist (2026-08-03).**
  `jjplszhxhwliimzpqwyc.supabase.co` returns NXDOMAIN from every resolver, so
  every read and write fails. That is why the tracker shows "could not be loaded"
  — it is a dead backend, **not** a bug in the refactor. Before debugging the
  tracker, always check DNS first:
  `curl -s "https://dns.google/resolve?name=<ref>.supabase.co&type=A"`
  (`"Status":3` = the project is gone). The pre-refactor `index.html` had the same
  failure but a bare `catch` that logged and returned, so it silently painted
  nothing — the new error note is the refactor surfacing a pre-existing outage.
- **When injecting a test `<script>` via `node -e '...'`,** shell single-quoting
  turns `\n` into a literal newline and breaks the JS string. Write the injector
  to a `.mjs` file instead of inlining it.
- **Cache-busting:** `?v=N` on `styles.css` works; it does **not** propagate to a
  module's imports, so bumping it on `app.js` would be misleading. GitHub Pages
  may serve stale assets for ~10 minutes. **Bump it in the same edit that
  touches `styles.css`, not after.** Missed once on 2026-08-11 mid-refactor — a
  disabled-button colour fix shipped with the version still at the value from
  before it, so a browser that had the page open could keep showing the old
  colours through a normal refresh. The user reported this as "not working."
- **The tracker chart must be created on `window.load`, not at module execution.**
  `app.js` runs as soon as the DOM is parsed, which is too early for Chart.js: it
  measures the canvas before layout is final, constructs the chart **without any
  error**, and paints nothing — an empty card and a clean console. Cost hours on
  2026-08-03. It is not the markup and not the canvas CSS (a variant using the
  original's exact `div.chart-container` markup was pixel-identical to the broken
  one). Never move `refreshTracker()` back into the synchronous part of `init()`.
- **Verifying charts in headless Chrome needs care.** `--virtual-time-budget`
  fast-forwards timers while real network stays pending, so probes sample at
  t≈0 and report a blank page even when the code is fine. Two false "verified"
  claims came from this. What works: serve a deliberately slow image so the load
  event is delayed, then `--screenshot` the full page and *look* at it. Asserting
  on DOM attributes (`canvas[width]`, `note.hidden`) is unreliable — `hidden` is
  also the initial state, so absence of an error proves nothing.
- **The theme is dark (since 2026-08-11). Three traps follow from that.**
  - **Gold `--color-brand #c9a84c` always needs dark text on it** (7.93 with
    `--color-bg`). As text on any light ground it is 2.29 and fails everything.
    This is why the three main-action buttons (Generate, both Open Email) are
    gold-filled with dark lettering and gold is never a text colour. The trap
    is now live in the code, not hypothetical.
  - **Chart.js's default tick and grid colours are dark grey** and vanish on the
    navy card, so `tracker.js` sets `ticks.color`, `grid.color` and
    `legend.labels.color` explicitly, reading them from the CSS tokens via
    `getComputedStyle`. Do not delete those options assuming defaults are fine —
    the chart would render with invisible axes and no error.
  - **`color-scheme: dark` in `styles.css` §1 is load-bearing.** Without it the
    native `<select>` popup and the scrollbar render light against the dark page.
    It is a real fix, not decoration.
- **Any new CSS must use the `--color-*` tokens.** The old `--navy-900`/`--ink`/
  `--surface` names are gone; there are no primitive tokens and no second layer.
  Adding a raw hex code re-introduces a colour the tokens cannot control — and
  the chart reads those same tokens, so it would drift too.
- **IRANSans has no Regular weight.** Only Bold, Light and UltraLight exist, so
  `styles.css` maps **Light to `font-weight: 400`** deliberately — the filename and
  the declared weight disagree on purpose. Don't "correct" it to 300 without also
  setting the Persian card's weight, or Persian body text loses its font.
- **Creating `.claude/settings.local.json` mid-session does not activate it.** The
  settings watcher only watches directories that already held a settings file when
  the session started. A newly created `.claude/` needs `/hooks` opened once, or a
  restart. The hook is not broken — validate with `jq -e` and move on.

---

## Open questions

Unverified — confirm before relying on, and update this section once known:

- **GitHub Pages source.** Assumed `main` / `/root`. Never confirmed (`gh` is not
  installed, repo settings unread).
- **`docs/supabase-schema.sql` is reconstructed** from how `stats.js` uses the
  table, not exported from the live project. The real table's columns and RLS
  policies have not been inspected. In particular, confirm no `UPDATE`/`DELETE`
  policy exists for `anon`.
- **`LICENSE` is MIT by default**, chosen by Claude, not requested by the user.
  Note it covers the code, **not** the bundled fonts.
- **IRANSans licence document is not filed here (2026-08-11).** The user states a
  licence is held; the paperwork was not accessible when asked, so nothing is
  attached. Not a blocker — treat as pending paperwork, not an unlicensed font.
  Attach it to `assets/fonts/` when available. Drop-in fallback if it ever
  becomes a problem: an OFL face (Vazirmatn, Estedad, Sahel), which would also
  supply the Regular weight IRANSans lacks.
  **Inter needs no such question** — OFL-1.1, notice shipped at
  `assets/fonts/Inter-LICENSE.txt`. That file must stay: the OFL requires the
  notice to travel with the files, and this repo serves them publicly.
- **Email addresses in `data/politicians.js` were carried over verbatim** and have
  not been checked against tweedekamer.nl. Two look odd but are intentional:
  `b.eerdmans@` for Joost Eerdmans (formal initial) and
  `j.jaspervandijk@` in the SP list.

---

## Keeping this file current

**Update this file in the same turn that you learn something, not later.**

Update it when any of the following happens:

| Trigger | What to write |
| --- | --- |
| The user states a fact about the repo, its hosting, the campaign, the team, or the backend | Add it to the matching section; if it answers an item under **Open questions**, move it out of there |
| A command is run and worth reusing | Add it under **Commands**, with what it is for |
| A command in **Commands** fails or turns out to be wrong | Fix or delete it — never leave a broken command documented |
| A non-obvious trap is discovered (a client quirk, an escaping issue, a cross-file dependency) | Add a bullet to **Gotchas** |
| Files are added, removed or renamed | Update **File map** |
| A constraint is learned the hard way, or the user pushes back on an approach | Add to **Hard constraints** or **Gotchas** with the reason |
| An assumption is made that could not be verified | Add it to **Open questions**, stated as unverified |
| Something here is contradicted by the code | Correct it immediately; the code wins |

Rules for edits:

- **Terse.** One or two lines per fact. This file is loaded into context every
  session; bloat costs the user money.
- **Record the reason, not just the rule.** "Don't use `URLSearchParams`" is
  useless without "it encodes spaces as `+`".
- **Delete what is no longer true.** Do not accumulate history here; git has it.
- **Date only things that will age** (an assumption, a version, a decision).
  Use `YYYY-MM-DD`.
- **Never record secrets** — no tokens, no `service_role` keys, no personal data.
- **Do not duplicate `README.md`.** That file is for humans maintaining the
  campaign; this one is for Claude working on the code. Cross-reference instead.

---

## Log

Dated decisions and findings that would otherwise be invisible. Keep short;
prune anything superseded.

- **2026-07-30** — Reorganised from a single 340-line `index.html` into the
  current structure. Behaviour verified byte-identical against the pre-refactor
  version (email texts, addresses, `mailto:` URLs) across 260 combinations.
- **2026-07-30** — Intentional behaviour changes, all approved: `alert()` replaced
  with an inline `aria-live` status region; action buttons start disabled and
  re-disable when an input changes (this fixed a real bug — `openMail` read the
  politician live from the dropdown but the body from the textarea, so changing
  the dropdown after generating emailed person B a letter addressed to person A);
  trailing blank line removed when the city field is empty; canvas height changed
  to `calc(100% - 40px)` so it no longer overflows its card.
- **2026-07-30** — Removed dead code: `triggerMailto()` (never called) and the
  `#topic` CSS rule (targeted an element that never existed).
- **2026-07-30** — CDN scripts pinned with SRI: `@supabase/supabase-js@2.45.4`,
  `chart.js@4.4.1`.
- **2026-08-03** — `README.md` expanded with dedicated sections for running
  locally, deploying, and adding entries to any list. Instructions were validated
  by following them in a throwaway copy and driving the result in headless Chrome.
- **2026-08-03** — Persian text switched from Tahoma to IRANSans (`assets/fonts/`,
  three `.woff` files copied verbatim from the user's Lion-and-Sun-Nederland
  project). Applied via `--font-fa` on `[lang='fa']` and the Persian card, with
  Tahoma kept as fallback and `font-display: swap`. Verified in headless Chrome:
  weights 400 and 700 load, and Persian renders 212.2px wide vs Tahoma's 195.7px,
  proving the face is actually in use. Persian line-height raised to 1.7.
- **2026-08-03** — Added `DESIGN.md`, the Mithra brand reference. Its key
  finding — gold `#c9a84c` is 2.29 on white and only works as a background
  behind dark text — is what shaped the 2026-08-11 adoption below.
- **2026-08-04** — `DESIGN.md` re-verified line by line against the local
  `../Lion-and-Sun-Nederland` checkout (it had been written from memory of that
  repo). Corrections: 6 Mithra tokens are declared but never used; there is a
  third overlay/`rgb()` token layer; `--color-accent-blue` is also a random
  card-border colour, not date strips only; Inter also uses weight 500; Mithra
  declares IRANSans inline and only when `lang === "fa"`, under the family name
  `"IranSans"`. All 30 contrast ratios recomputed and confirmed exact. Also
  dropped the copy of this repo's own `styles.css` §1 tokens from `DESIGN.md` —
  duplicating them there could only drift.
- **2026-08-11** — Adopted the Mithra palette and fonts (`DESIGN.md`). The theme
  is now dark navy with gold as the only accent, Inter for latin, IRANSans
  unchanged for Persian. `styles.css` §1 was replaced with flat `--color-*`
  semantic tokens (no primitive layer) and all 30 usage sites repointed; the six
  remaining hardcoded colours are gone. User decisions, not defaults: gold was
  initially reserved for the two send buttons only, then widened the same day
  to cover "Generate Email Content" too, so gold now marks every main-action
  button and Copy All is the only outlined one; the preview box is dark like
  everything else; status messages are all one colour and are told apart by a
  ✓/⚠/ℹ glyph that `showStatus` prepends. Also fixed same day: `button:disabled`
  used `opacity: 0.55`, which blended the gold fill with the dark page into a
  muddy brown read as "broken" rather than "disabled" — replaced with flat
  `--color-surface` / `--color-text-muted` / `--color-border`, which wins over
  the per-button background via `:disabled`'s specificity, no `!important`
  needed. Verified in headless Chrome — Inter measurably in use (313.06px vs
  Arial 297.05px on the same string), IRANSans still loading at 400/700, all
  chart tokens resolving, focus ring gold. Two real fixes came out of the
  initial pass: the focus ring was `--navy-900`, invisible on the new ground, and the
  chart's axes would have been invisible on Chart.js defaults.
- **2026-08-11** — Inter ships under OFL-1.1 with its notice at
  `assets/fonts/Inter-LICENSE.txt`; the OFL requires it to stay with the files.
  `assets/fonts/README.md` now documents both faces. User states an IRANSans
  licence is held but the document was not accessible — see **Open questions**.
- **2026-08-03** — Added the Bash-logging `PostToolUse` hook (see **Commands**).
  **Deliberately did not add a `Stop` hook** to nag about updating this file:
  `prompt`/`agent` hook types only work on tool events, so a Stop reminder must be
  a `command` hook returning `decision: "block"`, which fires on every stop —
  including `/clear` and `/compact` — and needs loop guarding. Not worth it for a
  repo this size. Revisit only if this file is observed going stale, and then
  guard it on "code changed but CLAUDE.md did not".
