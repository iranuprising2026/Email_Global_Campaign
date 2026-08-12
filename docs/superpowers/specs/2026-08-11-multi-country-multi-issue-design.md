# Multiple countries and multiple issues

**Date:** 2026-08-11
**Status:** implemented 2026-08-12

**Built as specified, with four additions made during implementation:**

1. **`[DEMANDS]`, per country and per version.** Not in this spec, and it turned
   out to be necessary: this document accepted "letters cannot reflect
   country-specific politics ... whether an embassy exists" as a cost. That cost
   became real the moment Canada was added, because Canada closed the Islamic
   Republic embassy in 2012 and listed the IRGC in 2024 — the two things every
   letter demands. Per version as well as per country, because the five letters
   vary their wording deliberately and the grammar around the placeholder differs.
2. **`isSendable()` + `comingSoon[]`.** A country is offered only if it has both
   recipients and letters in a language it uses; anything else is a greyed-out
   "coming soon" option. This spec's §3 disabled the form for a country with no
   letters, which would have shown Canada as live with an empty recipient
   dropdown, since Canada *does* have English letters.
3. **A "Letter language" picker** for countries listing more than one usable
   language, with `?lang=` in the URL. §1 assumed one `language` per country.
4. **Verification exceeded §6's plan:** the 260-combination byte-identity check
   was kept as a permanent regression test and re-run after every subsequent
   change, including the `[DEMANDS]` refactor.

Extend the site from one country (Netherlands) and one issue (executions) to
several of each, without a build step and without making the data files harder
for a non-technical collaborator to edit.

---

## Goal and non-goals

**Goal.** A visitor picks their country and the issue they care about, and gets
a ready-to-send letter addressed to their own parliament, in their own language.
An organiser can share a link that lands someone directly on the right
combination.

**Target scale (agreed):** 3–5 countries, 2–3 issues. Roughly 4 languages and
up to 12 letter sets. This is deliberately *not* built for 15 countries — see
[Rejected](#decisions-with-the-alternative-rejected).

**Non-goals.**

- No lazy loading or dynamic `import()`. At this scale everything can load up
  front; adding it now would be complexity with no payoff.
- No build step, bundler or package manager. Unchanged hard constraint.
- No separate page per country. One `index.html` serves every combination.
- No translation of the *instructions*. The instruction cards stay English +
  Persian: the audience is the Iranian diaspora, not the host population.
- Not fixing the Live Action Tracker backend. That is separate work, deferred
  by the user. This spec only makes sure the tracker's data key does not become
  ambiguous — see [Tracker key](#5-tracker-key-decide-now-cheap-later-painful).
- No change to the email-sending logic (mailto / Gmail / Outlook), the Mithra
  theme, or the masthead.

---

## Decisions, with the alternative rejected

| Decision | Alternative rejected | Why |
| --- | --- | --- |
| One master letter per **language**, with per-country placeholders | A separately written letter per country × issue | Far less writing, and it exploits the fact that countries share languages: Belgium reuses the Dutch letters, Austria the German ones. Cost: letters cannot reflect country-specific politics (trade ties, whether an embassy exists). Accepted by the user. |
| Letters keyed by language, countries keyed separately | Letters nested under each country | Nesting would duplicate the Dutch text for Belgium, and the two copies would drift. Drift between a letter and its translation is the worst bug this codebase can have. |
| Everything loads up front | Lazy `import()` per country/issue | YAGNI at 3–5 countries. Revisit only past ~10 countries, where a visitor would otherwise download every letter in every language to read one. |
| One `index.html`, choice in the URL query | A folder and `index.html` per country | With no build step, per-country pages means the form markup is copy-pasted 5 times. A typo fix would have to be made 5 times by hand, and they would drift. |
| Country and issue in the query string | Path segments or a hash | Query params need no server rewrites, which GitHub Pages cannot do anyway. |
| One file per country, containing its politicians | A central `countries.js` plus separate politician files | "Everything about Germany is in `de.js`" is the clearest possible rule for a non-technical editor, and keeps each file to one screenful of concepts. |

---

## 1. File layout

```
assets/js/data/
  index.js              Registry: which countries and issues exist. Two lists.
  countries/
    nl.js               Everything about the Netherlands, incl. its politicians
    be.js               (later) reuses the Dutch letters
    de.js               (later)
  issues/
    executions.js       The letters, keyed by language
    hostages.js         (later)
```

`politicians.js` and `campaign.js` are replaced by the above. Their contents
move: the 13 Dutch politicians into `countries/nl.js`, the 5 execution letters
into `issues/executions.js`.

### `data/countries/nl.js`

```js
/**
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Everything about one country lives here: which language its letters are
 * written in, the words filled into the letters, and who to write to.
 *
 * TO ADD A COUNTRY: copy this file, rename it to the country's two-letter
 * code, change every value below, then add one line to ../index.js.
 */
export default {
  id: 'nl',

  /** Shown in the Country dropdown. */
  name: 'Netherlands',

  /**
   * Which set of letters to use, from the files in ../issues/.
   * Countries that share a language share their letters: Belgium is also 'nl'.
   */
  language: 'nl',

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] in the letters.
   *
   * Two languages are needed: the language the letter is sent in, and English,
   * because the preview box shows supporters an English translation of what
   * they are about to send.
   *
   * Include any article the sentence needs: English says "the Netherlands",
   * Dutch says just "Nederland".
   */
  terms: {
    nl: { country: 'Nederland', government: 'de Nederlandse regering' },
    en: { country: 'the Netherlands', government: 'the Dutch government' },
  },

  /** Used as the signature when the visitor leaves the name field empty. */
  anonymousSignature: {
    nl: 'Een Iraanse inwoner in Nederland',
    en: 'An Iranian resident in the Netherlands',
  },

  /** Who the letters can be sent to. Same shape as the old politicians.js. */
  politicians: [
    {
      name: 'Caspar Veldkamp',
      party: 'NSC',
      primary: 'c.veldkamp@tweedekamer.nl',
      cc: ['p.omtzigt@tweedekamer.nl', 'n.vandenhil@tweedekamer.nl', 'info@partijnieuwsociaalcontract.nl'],
    },
    // … the other 12, unchanged
  ],
};
```

### `data/issues/executions.js`

Same content as today's `campaign.js`, with one structural change: `subject`
and `body` gain a key per language rather than being fixed at `nl` and `en`.

```js
export default {
  id: 'executions',

  /** Heading shown above the form, and the Issue dropdown label. */
  title: 'Stop Daily Executions Campaign',

  versions: [
    {
      id: 'Version 1',
      subject: {
        nl: 'URGENT: Ultimatum vereist om staatsslachting in Iran te stoppen',
        en: 'URGENT: Ultimatum required to stop the state-led slaughter in Iran',
        // de: '…'   ← add when Germany is added
      },
      body: {
        nl: 'Geachte [NAME],\n\n… Wij eisen dat u [GOVERNMENT] oproept tot …',
        en: 'Dear [NAME],\n\n… We urge you to demand an immediate ultimatum from [GOVERNMENT]: …',
      },
    },
    // … Versions 2–5
  ],
};
```

**`en` does double duty**: it is the translation shown in the preview box, and
it is also the letter language for any English-speaking country added later
(UK, Ireland, Canada).

### `data/index.js`

```js
import nl from './countries/nl.js';
import executions from './issues/executions.js';

/** Every country, in the order they appear in the dropdown. */
export const countries = [nl];

/** Every issue, in the order they appear in the dropdown. */
export const issues = [executions];

export function getCountry(id) { /* find, or throw a named error */ }
export function getIssue(id) { /* find, or throw a named error */ }
```

Both getters throw a message naming the file to check, matching how
`getCampaign()` behaves today.

---

## 2. Placeholders

Existing three, unchanged:

| Placeholder | Becomes |
| --- | --- |
| `[NAME]` | The politician's name |
| `[USER]` | The visitor's name, or `anonymousSignature` if blank |
| `[CITY]` | The visitor's city, or removed with its blank line if empty |

Two new ones, both taken from the chosen country's `terms`, in the language
being rendered:

| Placeholder | `nl` | `en` |
| --- | --- | --- |
| `[COUNTRY]` | `Nederland` | `the Netherlands` |
| `[GOVERNMENT]` | `de Nederlandse regering` | `the Dutch government` |

Both grammatical forms are needed because the real letters use both: *"Wij
eisen dat u **de Nederlandse regering** oproept"* and *"namens **Nederland**"*.
A single placeholder cannot serve both. Version 4 uses neither and needs no
placeholders at all.

**Rendering rule.** The letter body uses `terms[country.language]`; the preview
translation uses `terms.en`. When a country's language *is* English, both use
`terms.en`.

**Missing-term rule.** If a term is absent for the language being rendered,
fail loudly at load with a message naming the country file and the missing key.
A silently unreplaced `[GOVERNMENT]` would be mailed to a member of parliament.

---

## 3. Choosing a country and issue

Two dropdowns above the form: **Country**, then **Issue**.

**URL.** `?country=nl&issue=executions`. Changing either dropdown rewrites the
query with `history.replaceState`, so the address bar is always a shareable
link to the current combination. No page reload.

**On first load:**

1. Use `?country=` / `?issue=` if present and known.
2. Otherwise guess the country from `navigator.language` (e.g. `nl-NL` → `nl`),
   accepting only a country that exists.
3. Otherwise fall back to `DEFAULT_COUNTRY_ID` / `DEFAULT_ISSUE_ID` in
   `config.js`.

An unknown or malformed parameter falls back silently rather than erroring — a
mistyped shared link must still give the visitor a working page.

**Changing country resets the preview**, because the politician list and the
letter language both change. This reuses the existing `invalidatePreview()`,
which already re-disables the action buttons — the mechanism that fixed a real
bug on 2026-07-30 (sending person B a letter addressed to person A).

**Issue dropdown is filtered.** Only issues that have a translation for the
selected country's language are listed. Adding Germany before the German
letters exist must not offer a German visitor an empty letter.

**If a country has no translated issue at all** — which happens the moment
someone adds a country file before writing its letters — the form is disabled
and the status region explains that this country has no campaigns yet, rather
than showing an empty Issue dropdown and a Generate button that cannot work.
The Country dropdown stays usable so the visitor can switch away.

**If the URL names an issue the chosen country cannot serve** (`?country=de`
with a Dutch-only issue), the issue falls back to that country's first
available one rather than erroring, and the URL is rewritten to match what is
actually shown — so the address bar never lies about the page.

---

## 4. Module API changes

| Module | Change |
| --- | --- |
| `data/index.js` | **New.** Exports `countries`, `issues`, `getCountry`, `getIssue`. |
| `data/countries/*.js` | **New.** Default-exports one country object. |
| `data/issues/*.js` | **New.** Default-exports one issue object. |
| `data/politicians.js` | **Deleted.** Contents move into `countries/nl.js`. `politicianLabel()` moves to `data/index.js`; its `"Name (PARTY)"` format is unchanged because it is stored in the tracker. |
| `data/campaign.js` | **Deleted.** Contents move into `issues/executions.js`. |
| `email.js` | `buildEmail({ country, issue, versionId, politician, userName, city })` — `campaign` becomes `issue`, and `country` is added. `fillTemplate` gains `[COUNTRY]` and `[GOVERNMENT]`. Stays pure. |
| `config.js` | `ACTIVE_CAMPAIGN_ID` → `DEFAULT_COUNTRY_ID` + `DEFAULT_ISSUE_ID`. `ANONYMOUS_SIGNATURE` is **removed** — it moves into each country file, since it names the country. |
| `tracker.js` | `politicians` becomes a **parameter** instead of a module-level import, because the list now depends on the selected country. |
| `stats.js` | `topic` is now `"<country>:<issue>"`. See below. |
| `app.js` | Populates the two new dropdowns, reads and writes the URL, and passes `country` through. Still the only file touching the DOM. |

`buildMailtoUrl`, `buildComposeUrl`, `formatForClipboard` and
`isMobileUserAgent` are untouched.

---

## 5. Tracker key: decide now, cheap; later, painful

Stats currently store `topic = 'executions'`. With more than one country that
becomes ambiguous — Dutch and German execution emails would be counted
together, and the chart would show German politicians under a Dutch total.

**Decision:** `topic = "nl:executions"`.

The database is being rebuilt from scratch anyway (the old Supabase project no
longer exists), so this costs nothing today. Changing it after real counts
exist would split every campaign's history.

No schema change is required — `topic` is already a `text` column.
`docs/supabase-schema.sql` gains a comment recording the new format.

---

## 6. Migration must not change one word of any letter

The letters name real people who were executed. Their names, ages and the
demands made are factual content and must survive the migration exactly.

The only edits to letter text are mechanical substitutions:

- `Nederland` → `[COUNTRY]`
- `de Nederlandse regering` → `[GOVERNMENT]`, and `the Dutch government` →
  `[GOVERNMENT]`

**Verification, before anything is committed.** Reuse the technique that caught
two mistakes on 2026-07-30: capture the rendered output of the *current* code
for every combination, then assert the new code produces byte-identical
strings.

- 13 politicians × 5 versions × {`nl`, `en`} × {name filled, name blank} ×
  {city filled, city blank} = **520 renders**, each compared as subject *and*
  body separately, so **1040 string comparisons**.
- Any single differing byte fails the migration.
- Also compare the generated `mailto:` URLs for all 520, since they encode the
  body and would catch an encoding regression the plain string compare misses.

This is a throwaway script in the scratchpad, not a committed test — the repo
has no test framework and must not gain one.

---

## 7. Documentation to update in the same change

- **`README.md`** — the "Which file do I edit?" table, and new sections:
  *Add a country*, *Add an issue*, *Add a language*. This is the file the
  non-technical collaborator actually reads, so these must be written as
  numbered click-by-click steps.
- **`CLAUDE.md`** — file map, the "adding a campaign touches three files"
  gotcha (now wrong), and the `topic` format.
- **`docs/supabase-schema.sql`** — the `topic` comment.

---

## Open questions

- **Which countries come first, and who writes the letters?** The structure
  makes adding a country cheap in code; the letters still need someone fluent
  writing at the quality of the Dutch originals. This is the real constraint on
  the whole feature and is not a code problem.
- **Whether the campaign title should be translated.** Currently
  `title` is one English string shown as the page heading. If a German visitor
  should see a German heading, `title` needs to become per-language like
  `subject`. Left as a single string for now; it is a one-line change later.

---

## Verification summary

1. `node --check` on every module.
2. The 520-render / 1040-comparison byte-identical letter check described above.
3. Serve locally and confirm: switching country changes the politician list and
   the letter language; switching issue changes the letters; the URL updates on
   both; a shared URL reproduces the exact same page; an unknown `?country=zz`
   falls back without an error.
4. Confirm the preview still shows an English translation for a non-English
   country, with `terms.en` substituted, not `[GOVERNMENT]`.
5. Screenshot the page to confirm the Mithra theme still holds with two extra
   dropdowns.
