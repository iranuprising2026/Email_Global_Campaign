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
   Prefer clarity over cleverness in every file under that directory.
3. **Never alter the campaign texts' factual content** — the Dutch/English email
   bodies name real people who were executed. Reformat or restructure freely;
   never reword the substance, change a name, an age, or a date unless the user
   explicitly asks.
4. **A letter and its English translation must always be changed together**, in
   every language the issue carries. The preview box exists so nobody is asked to
   send words they cannot read. Letting the languages drift apart is the worst bug
   this codebase can have. The same rule binds the **English and Persian
   instruction cards** in `index.html`: they are a translation pair, so a change
   to one is incomplete until the other matches.
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
  config.js                 Supabase creds, STATS_TABLE, DEFAULT_COUNTRY_ID,
                            DEFAULT_ISSUE_ID.
  data/index.js           ← Registry: countries[], comingSoon[] (empty), issues[],
                            LANGUAGE_NAMES/languageName, lookups, politicianLabel,
                            isSendable/sendableCountries/unavailableCountries,
                            issuesForLanguage, languagesForCountry.
  data/countries/nl.js    ← NL: id, name, languages[], terms, anonymousSignature,
                            demands{}, politicians[] {name, party, primary, cc[]}.
                            13 entries, 4 addresses each.
  data/countries/ca.js    ← Canada, en. 5 entries, one per party (Liberal,
                            Conservative, NDP, Bloc Québécois, Green). Every
                            address [VERIFIED 2026-08-12] off ourcommons.ca.
                            demands rewritten 2026-08-16 (sanctions/enforcement).
  data/countries/uk.js    ← UK, en. 7 entries (Labour, Conservative, Reform UK,
                            Lib Dem, Green, SNP, Plaid Cymru). @parliament.uk,
                            not parl.gc.ca. Addresses UNVERIFIED.
  data/countries/de.js    ← Germany, de. 5 entries (CDU/CSU, SPD, AfD, Grüne,
                            Linke) @bundestag.de. Addresses UNVERIFIED.
  data/countries/se.js    ← Sweden, sv. 6 entries (S, SD, M, C, V, KD)
                            @riksdagen.se. Addresses UNVERIFIED.
  data/countries/fr.js    ← France, fr. 7 entries (RN, EPR, LFI-NFP, PS, DR, E&S,
                            Horizons) @assemblee-nationale.fr. UNVERIFIED.
  data/issues/executions.js ← Email texts. versions[] → {subject,body} keyed by
                            language. 12 languages since 2026-08-16: nl en de fr
                            it es sv no da pl fi pt.
  email.js                  PURE. Exports buildEmail, buildMailtoUrl,
                            formatForClipboard, isMobileUserAgent.
  stats.js                  Supabase read/write. Never throws by design.
                            fetchActions (rows for one topic) + fetchTopicTotals
                            (head-only counts, one query per country).
  tracker.js                TWO Chart.js charts in one card: countries, then
                            that country's politicians. Holds VERSION_COLORS,
                            COUNTRY_BAR_COLOR, trackerTopic, renderTracker.
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
for f in assets/js/*.js assets/js/data/*.js assets/js/data/*/*.js; do cp "$f" /tmp/c.mjs; node --check /tmp/c.mjs || echo "FAIL $f"; done
```

**Import a data module in Node** to inspect it (works because `config.js`,
`data/*.js` and `email.js` touch neither DOM nor network):

```bash
node --input-type=module -e "const m = await import('./assets/js/email.js'); console.log(Object.keys(m))"
```

**Smoke-test every letter after a data change** — builds every country ×
language × version × recipient (215 on 2026-08-16) and fails on a throw or a
leftover `[PLACEHOLDER]`. Catches a missing `demands` entry, a country listing a
language the letters lack, and a half-translated version:

```bash
node --input-type=module -e "
const d = await import('./assets/js/data/index.js');
const e = await import('./assets/js/email.js');
let n = 0; const errs = [];
for (const c of d.countries)
  for (const language of d.languagesForCountry(c))
    for (const v of d.issues[0].versions)
      for (const p of c.politicians) {
        try {
          const r = e.buildEmail({country: c, issue: d.issues[0], versionId: v.id, politician: p, language, userName: '', city: ''});
          const t = r.body.sent + r.body.en + r.subject.sent + r.subject.en;
          if (/\[[A-Z]+\]/.test(t)) errs.push(c.id + ' ' + v.id + ' leftover placeholder');
          n++;
        } catch (err) { errs.push(c.id + ' ' + language + ' ' + v.id + ': ' + err.message); }
      }
console.log('combos:', n, 'errors:', errs.length); console.log([...new Set(errs)].join('\n'));
"
```

Note `buildEmail` takes **`versionId`** (a string), not a version object, and
returns `{subject: {sent, en}, body: {sent, en}, …}` — passing the object or
reading `r.body` as a string are both easy mistakes that make the harness lie.

**Drive a real browser over CDP** — the only reliable way to verify the tracker,
because `--virtual-time-budget` lies about it (see **Gotchas**). Start Chrome
with a debugging port, then talk to it from Node using the built-in `WebSocket`:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --no-sandbox --remote-debugging-port=9333 \
  --user-data-dir=<scratch>/chrome-profile &
curl -s http://127.0.0.1:9333/json/version | jq -r .Browser   # confirm it is up
```

Then in a `.mjs` file: `PUT /json/new` for a tab, connect to
`webSocketDebuggerUrl`, `Page.enable` + `Runtime.enable` + `Page.navigate`, and
poll `Runtime.evaluate` in **real** time (`await sleep(500)` in a loop) until
`window.Chart.getChart(document.getElementById('country-chart'))` exists. From
there: read chart data for assertions, `dispatchEvent(new Event('change'))` on
`#country` to exercise a country switch, and `Page.captureScreenshot` with
`clip` from a `getBoundingClientRect()` to photograph one card. Written fresh
each time in the scratchpad; not committed. Two things that cost time:
`navigator.clipboard.writeText` rejects in headless even after
`Browser.grantPermissions` (no focused document), so test the write path through
the **Gmail** button with `window.open` stubbed, not "Copy All"; and screenshots
need `captureBeyondViewport: true` or you get the viewport only.

**Talk to the Supabase Management API** (project `wazrgvwqotgdpmaphldt`). Needs a
personal access token, which is **not** stored in this repo — ask the user, keep
it in the scratchpad, and read it as `$(cat …)` so the value never reaches
`.claude/command-log.txt`:

```bash
curl -s -H "Authorization: Bearer $(cat <scratch>/pat)" \
  https://api.supabase.com/v1/projects | jq '[.[] | {id, name, region, status}]'
# run SQL (jq -Rs builds the JSON so quoting in the .sql file cannot break it):
jq -Rs '{query: .}' docs/supabase-schema.sql > <scratch>/payload.json
curl -s -X POST -H "Authorization: Bearer $(cat <scratch>/pat)" \
  -H "Content-Type: application/json" --data @<scratch>/payload.json \
  https://api.supabase.com/v1/projects/<ref>/database/query | jq .
```

**Check the site's own database access as a visitor sees it** — the publishable
key, straight at PostgREST. Confirms RLS rather than assuming it:

```bash
KEY=sb_publishable_UHHkZewi_ZjDN6KMbznKgw_p-0SOOVx
URL=https://wazrgvwqotgdpmaphldt.supabase.co
curl -s -I "$URL/rest/v1/email_stats?select=*&topic=eq.nl:executions" \
  -H "apikey: $KEY" -H "Prefer: count=exact" -H "Range: 0-0" | grep -i content-range
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

**Test `buildComposeUrl` per platform** — the harness written on 2026-08-12 (not
committed; recreate in the scratchpad). It imports `email.js` from a path in
`EMAIL_MODULE` so the same file can be run against `git show HEAD:...` to prove a
bug exists before fixing it, and asserts, for Android/iOS/Windows/macOS UAs: the
URL shape per service, `newTab`/`fallbackUrl`/`fallbackDelayMs`, that the
`intent:` payload round-trips to `buildMailtoUrl` output with no raw `;`/`#`, and
that subject, body, To and both CCs survive encoding. Uses a subject and body
containing `;`, `#` and `&` on purpose.

**Verify a data-layer change without touching the repo** — the technique used on
2026-08-12 to prove Canada goes live from one edit: `rsync -a --exclude .git
--exclude docs ./ <scratch>/copy/`, edit only the data file there, then
`diff -rq` against the real repo to prove nothing else differs, and import
`<scratch>/copy/assets/js/data/index.js` in Node. Also the way to exercise
multi-country branches that a single live country cannot reach — add throwaway
`be.js`/`ca.js`/`de.js` in the copy.

**Drive the real page headlessly** (asserting on DOM attributes alone is
unreliable — see the chart gotcha). Copy `index.html` to `probe.html` in the repo
root with an appended module script that runs on `window.load`, clicks
`#generate`, and appends its findings as JSON in a `<pre id="probe-result">`;
serve, `--dump-dom`, extract the `<pre>`, then delete `probe.html`. Wrap the
probe body in try/catch and report the error into the same `<pre>` — a probe that
throws is otherwise indistinguishable from a page that never ran.

**Mining the command log.** A `PostToolUse` hook appends every Bash command run
here to `.claude/command-log.txt` as `timestamp<TAB>command` (newlines escaped by
`@tsv`, so one line per command). When curating the section above, read that file
for commands worth keeping — it is raw material, not a section to paste wholesale.
Most entries are one-off greps and are noise.

Note: `gh` is **not** installed on this machine.

---

## Gotchas

- **App links are per-platform; there is no "mobile" case.** `googlegmail:///co`
  and `ms-outlook://compose` are **iOS** schemes. Android registers neither, so
  the link silently did nothing and every Android visitor got the mobile website
  (which ignores Gmail's `view=cm` compose params) — the 2026-08-12 bug report.
  Android must use an `intent:` URL: `ACTION_SENDTO` + `package=` +
  `S.browser_fallback_url`. Packages: `com.google.android.gm`,
  `com.microsoft.office.outlook`. Desktop Outlook registers `ms-outlook://`, so
  desktop now takes the same path as iOS.
- **`intent:` URL syntax is brittle.** Everything between `intent:` and
  `#Intent;` is the `mailto:` data; `;` separates the parts after it and
  `Intent.parseUri` splits on the **last** `#`. So any `;` or `#` inside the
  data must be percent-encoded — `encodeURIComponent` does both, which is why
  `buildMailtoUrl`'s output can be embedded verbatim. Never hand-build the data
  with raw punctuation.
- **Detecting "app not installed" needs `document.hasFocus()`, not just
  `document.hidden`.** On a phone the app backgrounds the page (`hidden`), but on
  a computer the browser's "Open Outlook?" prompt fires **no event** and the page
  stays visible — it only loses focus. `openAppOrFallBack` therefore checks both
  when the timer fires rather than listening for `visibilitychange`. Desktop also
  waits 4s, not 1.5s: a cold Outlook can take longer to steal focus, and firing
  early would drag the visitor to the website mid-launch.
- **`mailto:` quirks in `email.js` are deliberate.** The To address is repeated
  as a `to=` parameter because some clients drop the one in the path; the CC
  separator switches between `;` (desktop Outlook) and `,` (mobile Gmail). Built
  by hand with `encodeURIComponent`, **not** `URLSearchParams` — the latter
  encodes spaces as `+` and escapes parentheses differently. Do not "tidy" this
  without testing on real devices.
- **Adding a 6th email version touches three files:** `data/issues/executions.js`, the
  `(1 to 5)` label in `index.html`, and `VERSION_COLORS` in `tracker.js` (only
  five colours; the list wraps, so a 6th version silently reuses the first).
  Any new bar colour must be **light** — the chart card is `--color-surface`
  navy, and `blue-800 #1b3a6b` is 1.45 against it, i.e. invisible.
- **The instruction cards and the form number their steps differently
  (2026-08-16).** Both cards were renumbered 1–7 to include Country and Issue,
  but the form's own `field-label`s still read "1. Enter Your Details", "2.
  Choose the Politician", "3. Choose an Email Version". So the card's step 5 is
  the field labelled 3. Left as-is deliberately; if it is ever fixed, the
  English and Persian cards must change together (constraint 4).
- **The country files carry copy-paste comments that contradict their own
  data.** `de.js` tells the editor to verify addresses "against tweedekamer.nl"
  and its header reads "The Germany."; `fr.js` says "We are leaving this empty
  for now. France will therefore remain 'Coming soon'" above seven populated
  entries. Harmless to the site, misleading to the non-technical collaborator
  the comments exist for — fix them when next in those files.
- **Adding a country or an issue touches exactly two places:** the new file in
  `data/countries/` or `data/issues/`, and its `import` + list entry in
  `data/index.js`. Nothing else — `isSendable()` decides on its own when a
  country is ready, so there is no switch to flip. Changing which one loads
  *first* also touches `DEFAULT_COUNTRY_ID`/`DEFAULT_ISSUE_ID` in `config.js` and
  the fallback `<h2 id="campaign-title">` in `index.html`.
- **A country is offered only if `isSendable()`:** ≥1 politician AND ≥1 language
  with letters. Everything else lands in `unavailableCountries()` and renders as
  a disabled "— coming soon" option. This exists because Canada *has* English
  letters — a letters-only check would have shown it as live with an empty
  recipient dropdown and a working Generate button. `comingSoon[]` in
  `data/index.js` covers countries with no file at all — a country must never be
  in both lists or it appears twice.
- **Since 2026-08-16 every country is sendable and `comingSoon[]` is empty,** so
  `unavailableCountries()` returns nothing and the disabled-option path is no
  longer exercised by the live site. Do not delete it as dead code: the next
  country added lands there until its `politicians` list is filled. Verify that
  path in a scratch copy (see **Commands**), not by reading the live page.
- **`resolveSelection()` must reject a non-sendable country,** not just an
  unknown one. `getCountry()` returns a real object for a half-finished country;
  without the `isSendable` guard, `?country=xx` would open a page that cannot send.
- **A language is offered only if EVERY version has it.** `issuesForLanguage()`
  requires `subject[lang]` and `body[lang]` on all five versions, so one missing
  translation drops that language for the whole country — silently, with no
  error. Add a language to all five versions or to none.
- **`LANGUAGE_NAMES` in `data/index.js` is a separate list from the letter
  translations, and they already disagree.** `executions.js` carries Finnish
  (`fi`); `LANGUAGE_NAMES` does not, so `languageName('fi')` falls back to the
  raw code. Harmless today (no country lists `fi`), but adding Finland would put
  "fi" in the Letter language dropdown. Add the name in the same edit that adds
  the country.
- **`[DEMANDS]` is per country AND per version, and both halves are load-bearing.**
  Per country because the demand is not true everywhere: NL, DE, SE, FR and the
  UK still have an Islamic Republic embassy, Canada closed its one in 2012 and
  listed the IRGC in 2024 — which is why Canada's wording asks for targeted
  sanctions and enforcement instead (rewritten 2026-08-16), while DE/SE/FR ask
  for closure of the embassy in Berlin/Stockholm/Paris and an IRGC asset freeze.
  The UK proscribed the IRGC in July 2026. Per version because the five
  letters vary the wording deliberately (anti-bulk-mail) and the grammar around
  the placeholder differs — Version 4 reads "including [DEMANDS]" and needs a
  noun phrase where Version 1 needs a full clause. A single string per country
  would have forced a rewrite of the Dutch letters, which constraint 3 forbids.
  `demands.default` covers any version without its own wording, so adding a 6th
  version does not touch every country file. `buildEmail` throws if a letter
  contains [DEMANDS] and the country has no wording for it — the check is
  conditional on the text so a country whose letters never use it needs no field.
- **`Firstname.Lastname@parl.gc.ca` is 17/18, not 18/18.** Measured against the
  user's verified Canadian addresses: Robert Oliphant answers at `rob.oliphant@`.
  Nicknames break it and the failure is silent (a bounce, or nothing). Accents
  are stripped (`melanie.joly@`) and a multi-word first name is concatenated
  (Lena Metlege Diab → `lenametlege.diab@`), which the PDF's flat text cannot
  disambiguate. Never derive a **To** address from the pattern without saying so.
- **Statistics are keyed on the string `"Name (PARTY)"`.** Renaming a politician
  splits their chart history. Never change `politicianLabel()`'s format. Canada's
  party strings are the full words `Liberal`, `Conservative`, `NDP`,
  `Bloc Québécois`, `Green` — chosen for the dropdown's readability and now
  frozen by the tracker.
- **Version ids (`"Version 1"`…) are stored in the database.** Renaming one
  splits its stats too.
- **`stats.js` swallows errors on purpose.** A failed count must never block a
  supporter from sending. Do not make it throw.
- **The backend was replaced on 2026-08-16** and the tracker works again. Project
  `wazrgvwqotgdpmaphldt` ("Email tracker", `eu-west-3`), created by the user;
  Claude ran `docs/supabase-schema.sql` into it through the Management API. The
  old `jjplszhxhwliimzpqwyc` is gone for good and **all counts before that date
  are lost with it** — the table started empty. If the tracker ever goes quiet
  again, check DNS before anything else:
  `curl -s "https://dns.google/resolve?name=<ref>.supabase.co&type=A"`
  (`"Status":3` = the project no longer exists).
- **`UPDATE` and `DELETE` as `anon` return 204, not an error.** With no policy
  granting them, RLS makes the rows invisible to the statement, so it succeeds
  against zero rows. Verified 2026-08-16 — the row was neither changed nor
  removed. Do not read a 204 as "the security is missing"; check the row
  afterwards, which is what the test did.
- **When injecting a test `<script>` via `node -e '...'`,** shell single-quoting
  turns `\n` into a literal newline and breaks the JS string. Write the injector
  to a `.mjs` file instead of inlining it.
- **The preview inputs and the translation panel are different element kinds.**
  `#subject`/`#recipient`/`#output` are inputs (`.value`); `#trans-subject` and
  `#trans-body` are `<div>`s (`.textContent`). Using `.value` on a div fails
  silently on write and yields `undefined` on read.
- **Cache-busting:** `?v=N` on `styles.css` works; it does **not** propagate to a
  module's imports, so bumping it on `app.js` would be misleading. GitHub Pages
  may serve stale assets for ~10 minutes. **Bump it in the same edit that
  touches `styles.css`, not after.** Missed once on 2026-08-11 mid-refactor — a
  disabled-button colour fix shipped with the version still at the value from
  before it, so a browser that had the page open could keep showing the old
  colours through a normal refresh. The user reported this as "not working."
- **The tracker card is two charts, and `renderTracker` owns both.** Signature is
  `renderTracker({country, issue, elements})` — an object, not positional args.
  `app.js` passes the seven nodes; everything inside the card is tracker.js's.
  Adding a third chart means adding to `elements`, not a new entry point.
- **Chart.js clips a long y-axis label instead of shortening it.** "Yves-François
  Blanchet (Bloc Québécois)" ran off the canvas on a 390px phone and rendered as
  "s Blanchet (Bloc Québécois)" — the *start* of the name silently gone, which
  reads as a data error rather than a layout one. Fixed with a `ticks.callback`
  that truncates to the third of the chart width Chart.js allows the axis, and
  appends "…". `data.labels` is left alone so tooltips keep the full name — and
  because those labels are the tracker's database key.
- **Each canvas needs a parent with a real height, set from the bar count.**
  `maintainAspectRatio: false` measures the parent, and the card no longer has
  one fixed height: six countries and thirteen Dutch politicians need different
  room, and Canada's five would be stretched by either. `tracker.js` sets
  `canvas.parentElement.style.height` before constructing each chart. The
  `.tracker__canvas` height in the CSS is only the pre-first-draw fallback.
- **The tracker chart must be created on `window.load`, not at module execution.**
  `app.js` runs as soon as the DOM is parsed, which is too early for Chart.js: it
  measures the canvas before layout is final, constructs the chart **without any
  error**, and paints nothing — an empty card and a clean console. Cost hours on
  2026-08-03. It is not the markup and not the canvas CSS (a variant using the
  original's exact `div.chart-container` markup was pixel-identical to the broken
  one). Never move `refreshTracker()` back into the synchronous part of `init()`.
- **`--virtual-time-budget` cannot verify this page. Use CDP.** Confirmed again
  2026-08-16: with a live backend and a 40s budget, both a `--screenshot` and a
  polling in-page probe reported "no chart" while the page was in fact perfect.
  Virtual time fast-forwards the probe's own `setTimeout` loop to exhaustion
  while the real Supabase fetch is still in flight, so it always samples at
  t≈0. Three false negatives have now come from this flag. **Drive a real
  Chrome over the DevTools Protocol instead** — see **Commands**. Node 24 has a
  global `WebSocket`, so the driver needs no packages. Prefer reading the live
  `Chart.getChart(canvas).data` over DOM attributes: it is positive evidence,
  where `note.hidden` is also the initial state and so proves nothing.
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
- ~~`docs/supabase-schema.sql` is reconstructed~~ **Settled 2026-08-16.** The
  live table was created *by running that file*, so it is now the source of
  truth rather than a guess. Columns, the topic index, RLS on, and exactly two
  policies (`anon` insert, `anon` select) were read back from
  `information_schema` and `pg_policies` and match. No `UPDATE`/`DELETE` policy
  exists. Keep the file and the table in step from here.
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
- **The 2026-08-12 app-link fix is verified by URL shape only.** The Android
  `intent:` URLs and the desktop `ms-outlook://` attempt pass the test harness
  above, but nothing has been clicked on a real Android phone or Windows PC —
  this machine has neither. iOS was reported working before the change and its
  URLs are unchanged. Ask the user for a real-device result before treating any
  of it as confirmed.
- **Canada's addresses are all confirmed (2026-08-12).** All 24 were read off
  each MP's own page at ourcommons.ca; `gary.anand@parl.gc.ca` is correct as the
  user's Ministers PDF had it, and the pattern-derived
  `gary.anandasangaree@` was wrong. Nothing in `ca.js` is guesswork.
- **The UK's two campaign facts were verified 2026-08-12 and the UK went live
  2026-08-16 without a re-check.** Iran's embassy at 16 Princes Gate London is
  open with an ambassador in post since June 2025, and the UK proscribed the
  IRGC in July 2026 — one month before, so this ages fast. `uk.js` demands
  depend on both.
- **Germany's, Sweden's and France's embassy/IRGC facts have NOT been checked,
  yet all three are live (2026-08-16).** Their `demands` all assert an open
  Islamic Republic embassy in Berlin / Stockholm / Paris and unfrozen IRGC
  assets, written by analogy to the Dutch wording. Verify before treating the
  letters as accurate; if one is wrong, the letters demand something already
  done, which is exactly the failure Canada's rewrite avoids.
- **The 108 addresses added 2026-08-16 (uk.js 31, de.js 20, se.js 30, fr.js 27
  unique) are UNVERIFIED.** None carries a `[VERIFIED]` marker and none was
  checked here; they arrived with the user's commits. They follow each
  parliament's usual pattern (`firstname.lastname.mp@parliament.uk`,
  `firstname.lastname@bundestag.de` / `@riksdagen.se` /
  `@assemblee-nationale.fr`), and a pattern-derived address fails silently —
  see the `parl.gc.ca` gotcha. With the 52 Dutch ones, 160 of the site's 184
  addresses are unverified; only Canada's 24 have been checked.
- **The 12-language letter set (2026-08-16) has not been reviewed for
  translation accuracy.** All 60 subject/body pairs build without error and no
  placeholder is left unreplaced (215 combinations checked), but that is a
  mechanical check. Constraint 4 binds every one of the 12 to the English:
  nobody here has read the Finnish, Polish or Portuguese against it.
- **The MP List PDF lists 339 MPs, not the full 343 seats.** Confirmed with the
  stream filter widened to every text stream: Liberal 172, Conservative 139,
  Bloc Québécois 21, NDP 5, Green 1, Independent 1. Whether the 4 missing are
  vacancies or an export gap is unknown. Two rows also disagree with expectation
  — Lori Idlout is listed Liberal and Alexandre Boulerice Independent; the PDF
  was taken as the source of truth rather than corrected.
- **Email addresses in `data/countries/nl.js` were carried over verbatim** and have
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
- **README section 12 is the human-facing list of unfinished work.** When an item
  under **Open questions** here is something the *organisers* must decide or check
  (campaign wording, unverified addresses, a country's facts), it belongs in both:
  there with the reasoning, section 12 with the instructions. Close it in both at
  the same time, or one will lie.

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
- **2026-08-12** — Mail buttons reworked around "try the installed app, fall back
  to the website" on every platform, from a user bug report: Android Gmail and
  Outlook both landed on the website with an empty compose window, and desktop
  Outlook never tried the app at all. Root cause was one class of mistake —
  `isMobileUserAgent` treated Android like iOS and reused the iOS-only URL
  schemes. Now: Android gets `intent:` URLs, desktop Outlook gets
  `ms-outlook://` with the web link as fallback, iOS untouched. `buildComposeUrl`
  gained `fallbackDelayMs`; `openAppOrFallBack` now also checks
  `document.hasFocus()`. See the three new **Gotchas** bullets.
- **2026-08-12** — Multi-country refactor finished and extended to NL + Canada
  live-ish, Germany + UK advertised. A half-finished `git stash pop` had left
  conflict markers in `app.js` (the stash predated the Android fix, so the
  resolution needed both `findPoliticianByLabel(country, …)` and
  `fallbackDelayMs`) — the page did not load at all until it was resolved.
  Letters re-verified byte-identical to the pre-migration output: 260
  combinations, 2340 comparisons including `mailto:` URLs on three platforms, 0
  differences. `comingSoon[]` + `isSendable()` added so a country launches from
  its data alone; `option:disabled` styling added and `styles.css?v=` bumped to
  13 in the same edit. README rewritten around countries/issues (16 stale
  references to the two deleted data files removed).
- **2026-08-12** — Canada added as the second live country, one entry per party
  (Liberal/Conservative/NDP/Bloc/Green), mirroring the Dutch "party's foreign
  affairs figure as To, colleagues in CC" rule at the user's request. Sources:
  an 18-name list vetted by a contact in Toronto, a 28-minister PDF, and a
  full MP List PDF that carries names and parties but **no addresses**. All 28
  ministers were confirmed to be sitting MPs, so no separate minister list is
  needed. User decision: derived addresses are acceptable in CC, and as a To
  only for parties with no vetted address at all (NDP, Bloc, Green) — each
  marked `[DERIVED]` for their verification pass. Deliberately excluded: the
  Persian role notes accompanying the Toronto list, which contain personal
  remarks about named MPs and would have been published publicly.
- **2026-08-16** — Campaign expanded to **six live countries** and **12
  languages**, in commits by the user (Iranuprising2026), not by Claude. New:
  `de.js`, `se.js`, `fr.js`; `uk.js` got its 7 recipients so it went live by
  itself via `isSendable()`; `comingSoon[]` is now empty. `executions.js`
  letters were rewritten around the 28 July Isfahan public executions (Abolfazl
  Sepahi Badjani, Amirhossein Safari Hosseinabadi, Alireza Sepahi) and
  translated into de fr it es sv no da pl fi pt alongside nl/en. Canada's
  `demands` were rewritten from "hold the closed embassy" to targeted sanctions
  + IRGC-listing enforcement + dismantling regime networks — which closes README
  12.1 in spirit, though deportation was still left out. Both instruction cards
  renumbered to 7 steps. Reviewed here, nothing changed: 215 country × language
  × version × recipient combinations build with no error and no unreplaced
  placeholder; every module still parses. What did **not** happen: address
  verification (122 new addresses, none marked `[VERIFIED]`), embassy/IRGC fact
  checks for DE/SE/FR, and any review of the ten new translations — all three
  are in **Open questions** and README §12.
- **2026-08-16** — Live Action Tracker rebuilt and given a working backend.
  New Supabase project `wazrgvwqotgdpmaphldt` (`eu-west-3`), schema applied from
  `docs/supabase-schema.sql`; the pre-existing counts are gone with the old
  project. The card is now **two charts**: countries least-first with the
  selected one in gold, then that country's politicians as before. New
  `fetchTopicTotals` asks for head-only counts (one query per country, no rows
  transferred) so the comparison costs the same at any campaign size.
  `renderTracker` took over the whole card, including its notes, and switched
  to an object argument. Verified over CDP against the live database: correct
  ordering and gold highlight for nl/ca/se, the politician chart following the
  dropdown, per-bar-count canvas heights, all four states (data, this-country-
  empty, nothing-anywhere, backend-down), no horizontal overflow at 390px, and
  a full round trip — clicking Gmail wrote the expected row and redrew the card
  from the empty state without a reload. **Requirement "switch the graph when
  the country changes" needed no code**: it was already wired through
  `applySelection`, just never observable against a dead backend. One real bug
  found and fixed on the way: Chart.js was clipping long politician names on a
  phone. Deliberately not built: clicking a country bar to switch country — the
  dropdown already does it.
- **2026-08-03** — Added the Bash-logging `PostToolUse` hook (see **Commands**).
  **Deliberately did not add a `Stop` hook** to nag about updating this file:
  `prompt`/`agent` hook types only work on tool events, so a Stop reminder must be
  a `command` hook returning `decision: "block"`, which fires on every stop —
  including `/clear` and `/compact` — and needs loop guarding. Not worth it for a
  repo this size. Revisit only if this file is observed going stale, and then
  guard it on "code changed but CLAUDE.md did not".
