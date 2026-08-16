# Email Global Campaign

A one-page website that helps people email members of their own national
parliament, demanding action against the executions in Iran. A visitor picks
their country and gets a ready-to-send letter addressed to that parliament, in
that country's language. Six countries are live: the **Netherlands, Canada, the
United Kingdom, Germany, Sweden and France**. The letters themselves exist in
twelve languages, so the next country is often only a list of names away.

**This guide is written for everyone on the team, including people who have never
edited code before.** If you can follow a recipe, you can maintain this site.
Nothing here requires you to be a programmer.

---

## Table of contents

1. [What the site does](#1-what-the-site-does)
2. [Which file do I edit?](#2-which-file-do-i-edit)
3. [Run the site on your own computer](#3-run-the-site-on-your-own-computer)
4. [Add a new entry to a list](#4-add-a-new-entry-to-a-list)
5. [Other common edits](#5-other-common-edits)
6. [Deploy: publish your changes](#6-deploy-publish-your-changes)
7. [When something goes wrong](#7-when-something-goes-wrong)
8. [Rules worth respecting](#8-rules-worth-respecting)
9. [How it works under the hood](#9-how-it-works-under-the-hood)
10. [Project structure](#10-project-structure)
11. [Maintenance](#11-maintenance)
12. [Open items and decisions, for later](#12-open-items-and-decisions-for-later)

---

## 1. What the site does

From a supporter's point of view:

1. They pick their **country**, and the **issue** they want to write about. The
   choice is kept in the page address, so a link like `?country=nl` can be
   shared to land somebody straight on the right one.
2. They type their **name and city** — both optional. If they leave the name
   blank, the email is signed for them — "Een Iraanse inwoner in Nederland" (An
   Iranian resident in the Netherlands) — so people who fear identification can
   still act.
3. They pick a **politician** — one choice per party. Each choice emails that
   party's foreign-affairs figure or leader *plus* colleagues from the same
   party, so one send reaches a whole party bloc: four people in the
   Netherlands, five in Sweden, up to seven in Canada.
4. They pick one of **five versions** of the email.
5. They press **Generate Email Content**. The letter appears in the language it
   will be sent in, together with an **English translation** — nobody is asked to
   send words they cannot read. A country that writes in English needs no
   translation panel, so it is hidden there.
6. They press **Open Email**, which opens their own mail app with everything
   filled in. They still press Send themselves, from their own address.
7. The action is counted in the **Live Action Tracker** at the bottom of the
   page. It has two charts. The top one compares all six countries, with the
   visitor's own country in gold, so they can see whether it is pulling its
   weight. The one below shows the politicians *inside* that country. Both put
   the least-contacted at the top, because the whole point is to send people
   where the effort is missing rather than pile onto the same few inboxes.
   Change the Country dropdown and both charts follow. Counts are kept per
   country and issue, so nothing is ever mixed together.

Two design decisions are worth knowing, because they look like mistakes and
aren't:

- **Five versions exist on purpose.** Parliamentary mail systems filter and
  de-prioritise identical bulk mail. Varied wording means each message reads as
  a real constituent writing, so more of them get read.
- **The site never sends anything itself.** It only prepares the message. Every
  email is sent by a real person from their own mailbox.

---

## 2. Which file do I edit?

Ninety percent of the time, it is one of the first two:

| I want to change… | Edit this file |
| --- | --- |
| The politicians and their email addresses | `assets/js/data/countries/` — one file per country |
| The email texts | `assets/js/data/issues/` — one file per issue |
| Which countries and issues exist at all | `assets/js/data/index.js` |
| The instructions shown at the top, in English or Persian | `index.html` |
| Colours, spacing, fonts | `assets/css/styles.css` |
| Which country and issue a visitor sees by default | `assets/js/config.js` |
| The chart colours | `assets/js/tracker.js` |
| How the page behaves when buttons are pressed | `assets/js/app.js` |

Everything inside `assets/js/data/` is written to be edited by non-programmers.
Open a file and read the comment block at the top before changing anything — it
explains the format of that specific file.

**The rule to remember:** recipients belong to a **country**, letters belong to
an **issue**. They are kept apart on purpose, because countries share letters —
Belgium would reuse the Dutch letters, Austria the German ones. If the letters
were stored per country, the same text would exist in two places and the two
copies would eventually disagree.

### Where the email addresses live

Each country has its own file named after its two-letter code, and everything
about that country is in it — including every address a letter can be sent to:

```
assets/js/data/countries/
  nl.js    Netherlands    — 13 parties, letters in Dutch    @tweedekamer.nl
  ca.js    Canada         —  5 parties, letters in English  @parl.gc.ca
  uk.js    United Kingdom —  7 parties, letters in English  @parliament.uk
  de.js    Germany        —  5 parties, letters in German   @bundestag.de
  se.js    Sweden         —  6 parties, letters in Swedish  @riksdagen.se
  fr.js    France         —  7 parties, letters in French   @assemblee-nationale.fr
```

So "who do we write to in Canada" is answered in exactly one place, `ca.js`,
and you never have to touch code to answer it.

Every country follows the same rule: **one entry per party.** The address in the
`To` field is that party's foreign-affairs figure or its leader; other MPs from
the same party go in the `CC`. One send therefore reaches a whole party bloc,
and the dropdown offers a supporter one choice per party rather than a long list
of individual names.

> **Always look an address up; never guess it.** Every address in `ca.js` carries
> a `[VERIFIED]` comment with the date it was read off that MP's own page at
> [ourcommons.ca/members](https://www.ourcommons.ca/members). Do that for anyone
> you add. Parliamentary addresses are *usually*
> `Firstname.Lastname@parl.gc.ca`, but not always — Robert Oliphant answers at
> `rob.oliphant@` and Gary Anandasangaree at `gary.anand@`. A guessed address
> fails silently: the supporter presses Send and nothing arrives, with no warning
> to anyone. Note also that the downloadable MP list from ourcommons.ca has no
> email addresses in it at all — they exist only on the individual profile
> pages.
>
> **Canada is the only country whose addresses have been checked this way.** The
> UK, Germany, Sweden and France went live on 2026-08-16 with 108 addresses that
> nobody has verified against a parliament's own website — see
> [section 12.3](#123-most-email-addresses-have-never-been-checked). Checking
> them is the single most useful job on the list.

---

## 3. Run the site on your own computer

Do this **before** publishing anything. It lets you see your changes privately,
so mistakes never reach the public site.

### Why you can't just double-click the file

Opening `index.html` by double-clicking **will show a broken page**, even when
your edit is perfect. Browsers refuse to load a site's JavaScript from a plain
file for security reasons. You need to serve the folder, which is one command.
This is normal and is not a problem with the project.

### Step 1 — get the code onto your computer

Only needed the first time. If you already have the folder, skip to step 2.

```bash
git clone https://github.com/iranuprising2026/Email_Global_Campaign.git
cd Email_Global_Campaign
```

No git? Go to the repository on github.com, press the green **Code** button →
**Download ZIP**, and unzip it. (You can edit and preview this way, but to
publish you will need either git or the github.com web editor — see section 6.)

### Step 2 — start a local server

**On a Mac** — open **Terminal** (press `Cmd+Space`, type "Terminal", Enter):

```bash
cd ~/Developer/personal/Email_Global_Campaign
python3 -m http.server 8000
```

**On Windows** — open **Command Prompt** (press the Windows key, type "cmd",
Enter):

```cmd
cd path\to\Email_Global_Campaign
python -m http.server 8000
```

Adjust the folder path to wherever you actually keep the project. On Windows you
can type `cd `, then drag the folder into the window to paste its path.

You should see a line like `Serving HTTP on :: port 8000`. Leave this window
open — that *is* the server. It looks like nothing is happening; that is correct.

### Step 3 — open it in your browser

Go to **<http://localhost:8000>**

The site should look exactly like the live one.

### While you work

- Edit a file, **save it**, then **refresh** the browser. That's the whole loop.
- No need to restart the server between edits.
- To stop the server: click the Terminal/Command Prompt window and press
  `Ctrl+C`. Closing the window also works.

### If step 2 doesn't work

| Message | What to do |
| --- | --- |
| `command not found: python3` | Try `python` instead of `python3`. If neither exists, use an alternative below. |
| `Address already in use` | A server is already running on that port. Use a different number, e.g. `python3 -m http.server 8001`, and open `http://localhost:8001`. |
| Terminal shows the server, but the browser says it can't connect | Check the port number in the URL matches the one in the command. |

**Alternatives, if you'd rather not use Python:**

- **VS Code:** install the **Live Server** extension, then right-click
  `index.html` → *Open with Live Server*. This also auto-refreshes on save.
- **Node.js installed?** Run `npx serve` in the project folder.

### Check these before you publish

- [ ] Pick a country and a politician, press **Generate Email Content** — the
      letter and its English translation both appear.
- [ ] The English translation actually matches the letter above it.
- [ ] Check the country you changed, and one you didn't — a mistake in the
      letters affects all six.
- [ ] Press **Open Email**, then the choice matching how you read your mail —
      that app opens with To, CC, subject and body filled in.
- [ ] Try it on a **phone** too, both Android and iPhone if you can. Each
      choice must open the *app*, not that app's website.
- [ ] The Live Action Tracker draws both charts, and your country is the gold
      bar in the top one.
- [ ] Change the Country dropdown — both charts follow it.
- [ ] Leave the name field empty — the email is signed with the anonymous
      signature and there is no stray blank line at the end.

---

## 4. Add a new entry to a list

Almost everything on this site is a **list**: the politicians, the email
versions, the campaigns, the chart colours. They all follow the same shape, so
learning it once covers every case.

### 4.1 How these lists work

A list is wrapped in **square brackets** `[ ]`. Each entry is separated by a
**comma**. Text is always inside **quotes**.

```js
export const example = [
  'first',
  'second',
  'third',
];
```

When an entry has several pieces of information, it is wrapped in **curly
braces** `{ }` and each piece is written as `name: value`:

```js
export const example = [
  { name: 'Alice', city: 'Utrecht' },
  { name: 'Bob',   city: 'Delft' },
];
```

**The golden rule for adding an entry:** never type a new entry from scratch.
**Copy an entry that already works**, paste it, then change the values. That way
the brackets, quotes and commas are already correct.

Four things break a list. If the page goes blank, it is almost always one of
these:

1. A **missing comma** between two entries.
2. A **missing quote** at the start or end of a text.
3. A **missing bracket** `}` or `]` — copy from `{` to the matching `},`
   *including* the closing brace and comma.
4. An **apostrophe inside single quotes**, e.g. `'Iran's future'`. Use double
   quotes around such text instead: `"Iran's future"`.

A trailing comma after the **last** entry is fine and normal — leave it there.

### 4.2 Add a politician

File: **the country's own file in `assets/js/data/countries/`** — `nl.js` for a
Dutch MP, `ca.js` for a Canadian one. Scroll to the `politicians:` list at the
bottom.

1. **Verify every address on the parliament's own website first** —
   tweedekamer.nl, ourcommons.ca/members, members.parliament.uk,
   bundestag.de, riksdagen.se, assemblee-nationale.fr. A wrong address means a
   supporter's effort goes nowhere, and nothing warns anybody.
2. Find any existing entry and copy the whole block, from `{` down to `},`.
   In a country whose list is still empty, copy the example block out of the
   comment just above the list instead.
3. Paste it just before the final `];` at the end of the list.
4. Change the four values:

```js
  {
    name: 'Nieuwe Politicus',              // shown in the dropdown, and used
                                           // after "Geachte" in the email
    party: 'PARTIJ',                       // shown in brackets after the name
    primary: 'n.politicus@tweedekamer.nl', // goes in the "To" field
    cc: [                                  // everyone who gets a copy
      'colleague.one@tweedekamer.nl',
      'colleague.two@tweedekamer.nl',
      'info@partij.nl',
    ],
  },
```

5. Save, refresh your local browser, and confirm the new name is in the dropdown.

Nothing else needs changing — the dropdown, the email greeting and the chart all
pick up the new entry automatically. `cc` may hold as many or as few addresses as
you like, including none at all (`cc: []`).

**Adding the first recipient to an empty country launches it.** A country with
nobody to write to shows in the Country dropdown greyed out as "coming soon".
The moment its `politicians:` list has one entry, it becomes selectable on its
own — you do not have to switch anything on anywhere else. That is exactly how
the United Kingdom went live on 2026-08-16: `uk.js` had been complete apart from
its MPs, and adding seven entries was the whole launch.

All six countries are live today, so nothing is greyed out at the moment. The
greyed-out state comes back the day somebody adds the next country file.

### 4.3 Add a sixth email version

File: **`assets/js/data/issues/executions.js`** — plus **two other files**, which
is why this one needs care.

**Step 1.** In `executions.js`, copy an entire existing version block — from `{`
before `id:` down to its closing `},` — and paste it before the closing `],` of
the `versions` list. Then change all five values:

```js
  {
    id: 'Version 6',                  // must be unique
    subject: {
      nl: 'Dutch subject line',       // sent to a Dutch politician
      en: 'English translation',      // the preview everyone sees, and the
                                      // subject sent in Canada and the UK
      de: 'German subject line',      // sent to a German politician
      // … one line per language, the same list as the other versions
    },
    body: {
      nl: 'Geachte [NAME],\n\n…\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
      en: 'Dear [NAME],\n\n…\n\nKind regards,\n[USER]\n[CITY]',
      de: 'Sehr geehrte/r [NAME],\n\n…\n\nMit freundlichen Grüßen,\n[USER]\n[CITY]',
      // … one line per language
    },
  },
```

Each key under `subject` and `body` is a **language**, not a country. The
letters currently exist in twelve:

| Code | Language | Used by | Code | Language | Used by |
| --- | --- | --- | --- | --- | --- |
| `nl` | Dutch | Netherlands | `no` | Norwegian | — |
| `en` | English | Canada, UK | `da` | Danish | — |
| `de` | German | Germany | `pl` | Polish | — |
| `fr` | French | France | `fi` | Finnish | — |
| `sv` | Swedish | Sweden | `pt` | Portuguese | — |
| `it` | Italian | — | `es` | Spanish | — |

The seven marked "—" are translated and waiting: Italy, Spain, Norway, Denmark,
Poland, Finland and Portugal each need only a country file with a list of MPs.

> **A new version must carry every language the other versions have.** A
> language is offered only when **all** versions have it, so forgetting `sv` on
> version 6 quietly removes Swedish from the site — no error message, Sweden
> simply turns into "coming soon". If you cannot supply all twelve, it is better
> to add the version in a few languages and accept that the rest disappear until
> the translations arrive — but know that is what will happen.

**Always write the English one, and make it say the same thing as the others** —
the preview box shows the English to somebody who cannot read the letter they
are about to send, and letting the two drift apart is the worst mistake possible
here.

Keep the placeholders exactly as written — they are filled in automatically:

| Placeholder | Becomes |
| --- | --- |
| `[NAME]` | The politician being written to |
| `[USER]` | The supporter's name, or an anonymous line if they leave it blank |
| `[CITY]` | The supporter's city, removed entirely if they leave it blank |
| `[COUNTRY]` | `Nederland` / `Sverige` / `la France` — from the country's file |
| `[GOVERNMENT]` | `de Nederlandse regering` / `the German government` |
| `[DEMANDS]` | The measures this letter asks for — **different in every country** |

Use these placeholders instead of naming a country or a demand in the text. That
is what lets one letter serve every country. `\n` means "new line"; `\n\n`
leaves a blank line between paragraphs.

> **`[DEMANDS]` is the one to be careful with.** What to demand is not the same
> everywhere. The Islamic Republic still has an embassy in the Netherlands, the
> UK, Germany, Sweden and France, so demanding its closure is a real demand
> there. **Canada closed its one in 2012** — so the Dutch wording would ask a
> Canadian MP to do something they already did fourteen years ago, and several
> of the Canadian MPs on our list are the people who did it. Each country writes
> its own wording under `demands` in its own file, one per email version.
>
> This also means the words *around* `[DEMANDS]` matter: if you reword the
> sentence it sits in, re-read every country's `demands` to check the grammar
> still fits.

**Step 2.** In **`index.html`**, find this line and change `1 to 5` to `1 to 6`:

```html
<label class="field-label" for="version">3. Choose an Email Version randomly (1 to 5):</label>
```

**Step 3.** In **`assets/js/tracker.js`**, add a sixth colour to the list, or the
new version will reuse the first colour in the chart:

```js
const VERSION_COLORS = ['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2'];
```

Add one more, e.g. `'#eaf2f8'`. Keep it light — the chart sits on a dark navy
card, so a dark colour would be invisible against it.

**Step 4.** Save all three files, refresh, and check that the dropdown offers
Version 6 and that generating it produces the right text.

### 4.4 Add a country

This is two steps: one new file, one line added to the index.

**Step 1.** In `assets/js/data/countries/`, copy the file of a country that
already writes in the same language, or `se.js` if none does, and rename the
copy to the new country's two-letter code — `it.js` for Italy, `no.js` for
Norway. Then work down the file changing every value: `id` (must match the
filename), `name`, `languages`, `terms`, `anonymousSignature`, `demands`, and
the `politicians` list. The comments in the file explain each one.

> The copied comments describe the country you copied *from*. Read them as you
> go and fix the ones that no longer fit — `de.js` still tells you to check
> addresses "against tweedekamer.nl", which is the Dutch parliament, and `fr.js`
> still says France is "coming soon" above seven live entries. Harmless to the
> site, confusing to the next person.

**Step 2.** In `assets/js/data/index.js`, add two lines — an `import` at the top
and the country's name in the `countries` list:

```js
import it from './countries/it.js';                    // ← added

export const countries = [nl, ca, uk, de, se, fr, it]; // ← it added
```

That is all. There is no third file to remember — **unless the country's
language is not yet named** in the `LANGUAGE_NAMES` list further down that same
file. Finnish is the one gap today: the letters exist in Finnish but the list
has no `fi:` line, so a Finnish page would show the raw code `fi` where it
should say "Finnish". Add the line in the same edit:

```js
export const LANGUAGE_NAMES = {
  …
  fi: 'Finnish',   // ← added
};
```

**If the letters do not exist in that country's language yet**, add the country
anyway — it will show greyed out as "coming soon" until they do, and it goes
live by itself once they exist. A country is offered to visitors only when it has
**both** somebody to write to **and** a letter in a language it uses. Neither
half can be forgotten silently.

**To advertise a country before making its file at all**, add one line to the
`comingSoon` list in `index.js` instead. It is empty right now, because every
country listed has a real file:

```js
export const comingSoon = [
  { id: 'it', name: 'Italy' },         // ← added
];
```

It then appears greyed out in the dropdown as "Italy — coming soon". Remember to
delete that line on the day Italy gets a real `it.js`, or it would be listed
twice.

### 4.5 Add a new issue

An issue is a whole set of letter versions with its own heading — the executions
campaign is one. Each keeps its own statistics, per country, so nothing is ever
mixed up or lost.

**Step 1.** In `assets/js/data/issues/`, copy `executions.js` to a new file named
after the issue, e.g. `hostages.js`, and change its `id`, its `title` and all its
versions. The `id` must match the filename.

**Step 2.** In `assets/js/data/index.js`, add the `import` line and the name to
the `issues` list, exactly as for a country:

```js
import hostages from './issues/hostages.js';   // ← added

export const issues = [executions, hostages];  // ← hostages added
```

**Step 3.** Save and refresh. The new issue appears in the Issue dropdown for
**every country whose language it has been translated into** — and only those, so
a half-translated issue can never reach the wrong country.

To make it the one visitors see first, set `DEFAULT_ISSUE_ID` in
`assets/js/config.js`, and update the fallback heading in `index.html` to match
(that text is only shown if JavaScript fails, but it should still be correct):

```html
<h2 id="campaign-title">Stop Daily Executions Campaign</h2>
```

### 4.6 Add a chart colour

File: **`assets/js/tracker.js`**, the `VERSION_COLORS` list. One colour per
version, in order. Each is a hex code in quotes. If there are fewer colours than
versions, the list starts over from the beginning.

Pick something **light**. The chart sits on a dark navy card, so dark colours
disappear against it. The existing five run from medium blue to almost white;
anything in that range works.

### 4.7 After adding anything

- [ ] Refresh your local page (section 3) — it loads without a blank screen.
- [ ] The new entry appears where you expected.
- [ ] Generate an email using it and read the result.
- [ ] Only then publish (section 6).

---

## 5. Other common edits

### Change the wording of an existing email

1. Open the issue's file in `assets/js/data/issues/` — `executions.js` for the
   executions campaign — and find the version, e.g. `id: 'Version 3'`.
2. Change **every language of that version**, not just one. Each version holds
   twelve `subject:` lines and twelve `body:` lines:
   - `subject.en` / `body.en` — the English, which is both sent in Canada and
     the UK **and** shown as the translation under every other country's letter
   - `subject.nl` / `body.nl` — the Dutch that gets sent in the Netherlands
   - …and the same for `de`, `fr`, `sv`, `it`, `es`, `no`, `da`, `pl`, `fi`,
     `pt`
3. Keep `[NAME]`, `[USER]`, `[CITY]`, `[COUNTRY]`, `[GOVERNMENT]`, `[DEMANDS]`
   and the `\n` line breaks as they are, in every language.
4. Remember the text is shared by every country using that language, so never
   name one country in it — that is what `[COUNTRY]` and `[GOVERNMENT]` are for.

> **If you change one language, you must change all of them.** A supporter who is
> shown an inaccurate English translation is being asked to sign something they
> haven't actually read. That is the one thing this site must never do — and with
> twelve languages it is now twelve times easier to get wrong. Change one
> version at a time, all the way across, rather than one language at a time.

**A shortcut that will bite you:** deleting a language from one version does not
"turn that language off" neatly. A language is offered only when every version
has it, so deleting `sv` from version 3 removes Swedish from the whole site and
Sweden becomes "coming soon" — with no error message anywhere.

### Remove a politician

In the country's file in `assets/js/data/countries/`, delete their whole block,
from `{` to the matching `},`. Their past statistics
stay in the database but are no longer shown.

Careful with **renaming**: statistics are stored under "Name (PARTY)", so a
renamed politician starts a fresh bar in the chart and their old numbers remain
under the old name. Renaming is fine — just expect the numbers to split.

### Change what the letters demand

File: **the country's own file in `assets/js/data/countries/`**, under `demands`.

This is the one edit where the same words are **not** right for every country,
so it deserves a moment's thought.

The letters do not contain the demand itself. They contain `[DEMANDS]`, and each
country supplies its own wording. The reason:

| Country | The Islamic Republic embassy | The IRGC |
| --- | --- | --- |
| Netherlands | Open — so demanding closure is a live demand | Not proscribed by the EU — live demand |
| Canada | **Closed since 2012** | **Listed since 2024** |
| United Kingdom | Open in London — live demand | **Proscribed since July 2026** |
| Germany | Assumed open in Berlin — **not checked** | Assumed not proscribed — **not checked** |
| Sweden | Assumed open in Stockholm — **not checked** | Assumed not proscribed — **not checked** |
| France | Assumed open in Paris — **not checked** | Assumed not proscribed — **not checked** |

If Canada reused the Dutch wording, a Canadian MP would be asked to close an
embassy that closed fourteen years ago — and several of the MPs on our Canadian
list are the people who closed it. Canada's wording therefore asks for something
it has *not* done: targeted sanctions on those responsible for the executions,
real enforcement of the IRGC listing through investigations and prosecutions,
dismantling regime-linked networks in Canada, and leading an international push
to stop the executions.

The three rows marked **not checked** are the ones to worry about. Germany,
Sweden and France went live on 2026-08-16 with demands written by analogy to the
Dutch ones, and nobody has confirmed the facts behind them — see section 12.5.

**There is one wording per email version**, because the five versions phrase the
demand differently on purpose and the grammar differs. Version 4 reads
"...measures must follow, including `[DEMANDS]`" and needs a phrase starting like
"closure of the embassy"; version 1 reads "...if the executions do not stop,
`[DEMANDS]`" and needs a full sentence. Any version you do not write a wording
for falls back to `default`.

**To change one:** open the country file, find `demands`, and find the version.
Then open `assets/js/data/issues/executions.js`, find that same version, and read
the whole sentence around `[DEMANDS]` — your words have to fit inside it. Save,
refresh, press Generate, and read the result aloud. If it reads as a sentence,
it is right.

**These facts go stale.** The UK proscribed the IRGC one month before this was
written. Re-check the table above before launching a new country, and whenever
you review the letters — section 12.5 keeps the dated version of it.

One open question about the demands is recorded in section 12: whether to add
deportation of regime officials to Canada's wording (12.1).

### Change the campaign heading

Edit the `title` line in the issue's file in `assets/js/data/issues/`, and the
fallback `<h2>` in `index.html` to match.

### Change the colours

Every colour on the page comes from one place: `assets/css/styles.css`, section
**1. Design tokens**. Each line looks like `--color-brand: #c9a84c;`. Change the
hex code and it updates everywhere that colour is used — including the chart,
which reads the same values.

The palette is the one from the Mithra foundation site (mithra-iran.org), so the
two look related.

**The one rule:** gold (`--color-brand`) must always have *dark* text on top of
it. White text on gold is unreadable. That is why "Generate Email Content" and
the two "Open Email" buttons are gold with dark lettering, and why gold is
never used for ordinary text.

After changing a colour, bump the stylesheet version — see
"[My change isn't showing up](#my-change-isnt-showing-up)".

### Change the fonts

Two typefaces, one per language:

- **Inter** for the English and Dutch text (`--font-latin`)
- **IRANSans** for the Persian text (`--font-fa`)

To swap either one:

1. Put the new font files in `assets/fonts/`.
2. In `assets/css/styles.css`, section **0. Fonts**, update the `@font-face`
   blocks to point at the new filenames. Match the `format(...)` to the file
   type — `.woff` is `format('woff')`, `.woff2` is `format('woff2')`.
3. In section **1. Design tokens**, update `--font-latin` or `--font-fa` if the
   family name changed.
4. Bump the stylesheet version in `index.html` so visitors get the new CSS —
   see "[My change isn't showing up](#my-change-isnt-showing-up)".

`assets/fonts/README.md` has the details for both faces, including their
licences. **Do not delete `assets/fonts/Inter-LICENSE.txt`** — Inter's licence
requires that file to stay alongside the fonts.

IRANSans has only three weights and no Regular file, so **Light is used as the
normal body weight** and Bold for emphasis. If the Persian text looks too thin,
that is why — the fix is a Regular/Medium weight file, not a CSS change.

### Change the instructions at the top of the page

They are in `index.html`, in two blocks: the English card and the Persian
(right-to-left) card. Edit the text between the tags and leave the tags alone.
Change both languages so they keep saying the same thing.

---

## 6. Deploy: publish your changes

### How publishing works

The site is hosted by **GitHub Pages**, and the rule is simple:

> **Whatever is on the `main` branch is what the public sees.**

There is no build step, no upload, no separate deploy button. A change reaches
the live site within about a minute of reaching `main`. Because it is that
immediate, **preview locally first** (section 3).

### Option A — edit on github.com (no software needed)

Best for small text fixes, and the easiest route if you don't use git.

1. Go to the repository on github.com and click the file you want to change,
   e.g. `assets/js/data/issues/executions.js`.
2. Click the **pencil icon** (Edit this file).
3. Make your change.
4. Scroll down, write a short description of what you changed, e.g.
   `Update Version 3 wording`.
5. Click **Commit changes**.

That's the deploy. Wait a minute, then reload the live site.

### Option B — from your computer with git

Best when you changed several files, or previewed locally first.

```bash
git add .
git commit -m "Add Version 6 of the campaign email"
git push
```

`git add .` stages everything you changed, `git commit` records it with a
description, and `git push` sends it to GitHub — which publishes it.

To check what you're about to publish, run `git status` (which files changed) or
`git diff` (the exact changes) beforehand.

### Confirm it actually went live

1. On github.com, open the **Actions** tab. A run appears for your commit; a
   green tick means it published.
2. Open the live site and **hard refresh**: `Ctrl+Shift+R`, or `Cmd+Shift+R` on
   a Mac.

### First-time GitHub Pages setup

Only needed if Pages was never switched on, or you are setting up a copy of the
site:

1. Repository → **Settings** → **Pages** (left sidebar).
2. Under **Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Click **Save**.
4. After a minute the page shows the public address, usually
   `https://<account>.github.io/<repository>/`.

### Undo a bad deploy

Because publishing is instant, knowing how to undo matters more than avoiding
mistakes.

**On github.com:** open the file, click **History**, find the last good version,
open it, click the **⋯** menu → **Revert** — or simply copy the old text back in
and commit again.

**With git:**

```bash
git revert HEAD   # undoes the most recent commit as a new commit
git push
```

Reverting is safer than deleting history, and it publishes the fix the same way.

---

## 7. When something goes wrong

### The whole page is blank or the dropdowns are empty

Almost always a typo in one of the files under `assets/js/data/` — see the four
common mistakes in section 4.1. To find it:

1. In the browser, press **F12** (Mac: `Cmd+Option+I`) and open the
   **Console** tab.
2. The red message names the file and the line number.
3. Go to that line and look for the missing comma, quote or bracket.

If you can't spot it, undo your change and redo it in smaller steps. On
github.com you can also open the file's **History** and revert to the version
that worked.

### My change isn't showing up

1. **Hard refresh:** `Ctrl+Shift+R`, or `Cmd+Shift+R` on a Mac.
2. GitHub Pages can serve the old file for up to about ten minutes. Wait, then
   hard refresh again.
3. If you changed `assets/css/styles.css`, open `index.html`, find
   `styles.css?v=` followed by a number, and add one to that number. That forces
   every visitor to fetch the new stylesheet immediately.

### The tracker charts are missing

The card shows a short note instead of the charts. It never stops anyone sending
an email — that is deliberate. Which note it is tells you what happened:

| The note says | What it means |
| --- | --- |
| "No emails have been recorded yet for this campaign" | Nothing has been sent anywhere yet. Not a fault — send one and it appears. |
| "The action tracker could not be loaded right now" | The database could not be reached. |
| "No emails have been recorded for *[country]* yet" | Only that one country is empty; the country chart above is still shown. |

For the middle one, check the Supabase project is still active — a free project
is paused after a long idle period, and one was deleted outright once before,
which is how the counts were lost in August 2026. Open the Console (F12) for the
underlying reason.

### The email opens with an empty To field

This is a difference between mail apps, not a bug in the text. Outlook Mobile is
known to mishandle these links; Gmail is reliable. As a fallback, **Copy the
email and paste it yourself** always works.

### A website opened instead of the app

That is the built-in safety net, and it means the device decided the app is not
installed. The page tries the app first and only opens the website when the app
does not answer — no browser can ask "is this app installed?" in advance, so
the page clicks the app and waits a moment to see what happens (1.5 seconds on
a phone, 4 on a computer).

If the app *is* installed and the website still wins:

- On a computer, a prompt like **"Open Microsoft Outlook?"** may be waiting for
  a click. Allowing it once (tick "always allow") makes it instant afterwards.
- The app may simply have been slow to start. Press the button again.
- Either way, **Copy the email and paste it yourself** always works.

---

## 8. Rules worth respecting

- **Never put a `service_role` key in this project.** The key in
  `assets/js/config.js` is a *publishable* key and is meant to be visible. A
  `service_role` key would let anyone wipe the campaign statistics.
- **No personal data is collected.** The supporter's name, city and email text
  never leave their browser. Only the politician's name, the version number and
  the type of click are recorded. Please keep it that way.
- **Verify email addresses** against the parliament's own website before adding
  them — the sites are listed in section 4.2. Most of the ones already in the
  repo have not been checked; see section 12.3.
- **Never let a country go live half-finished.** A country is only offered once
  it has both recipients and letters; the site enforces this, so don't work
  around it.
- **Keep the translations honest** — see the warning in section 5.
- **Don't "simplify" the mailto code** in `assets/js/email.js` without testing
  on real devices. The odd-looking parts are there because different mail apps
  disagree with each other; the comments explain each one.

---

## 9. How it works under the hood

*This section is for developers. Skip it if you only edit texts.*

A static site with no build step and no server of its own: plain HTML, CSS and
ES modules, plus two libraries from a CDN. Open a file, edit, refresh.

**Data flow**

```
data/countries/*.js ─┐
data/issues/*.js     ├─> data/index.js ─> email.js (pure) ─> app.js ─> DOM + mailto:
config.js           ─┘                                         │
                                                               ├─> stats.js ─> Supabase
                                                               └─> tracker.js ─> Chart.js
```

`data/index.js` is the only place that knows which countries and issues exist.
Countries hold recipients; issues hold letters keyed by language; a country
points at the languages it can be written in. That is what lets two countries
share one letter without duplicating its text.

**Module responsibilities**

| File | Responsibility |
| --- | --- |
| `config.js` | Settings: Supabase credentials, default country and issue |
| `data/index.js` | The registry of countries and issues, plus lookup helpers and the rule deciding which countries are ready |
| `data/countries/*.js` | One file per country: its language, its wording, its recipients |
| `data/issues/*.js` | One file per issue: the letter versions, keyed by language |
| `email.js` | Pure functions: fill templates, build the `mailto:` URL |
| `stats.js` | Supabase reads and writes; never throws |
| `tracker.js` | Renders both tracker charts and owns everything inside that card |
| `app.js` | The only file that touches the DOM |

`email.js` holds no state and reads nothing from the page, so its behaviour is
reproducible and testable. Two quirks in it are intentional and documented in
place: the To address is repeated as a `to=` parameter because some clients drop
the one in the path, and the CC separator switches between `;` and `,` because
desktop Outlook and mobile Gmail accept different ones.

`stats.js` swallows its errors by design. Counting an action is less important
than sending the email, so a failed database write is logged to the console and
the supporter is never interrupted.

**Backend.** One Supabase table, `email_stats`. The schema and — more
importantly — the Row Level Security policies are in
`docs/supabase-schema.sql`. That file is reconstructed from how the code uses
the table, not exported from the live project, so verify it against the
dashboard before relying on it. Because the API key is public, those policies
are the only protection: insert and select are allowed, update and delete are
not.

---

## 10. Project structure

```
.
├── index.html                    The page itself
├── README.md                     This guide
├── LICENSE
├── .gitignore
├── assets/
│   ├── css/
│   │   └── styles.css            All styling
│   ├── fonts/                    Inter (English/Dutch) + IRANSans (Persian),
│   │                             with their licences and a README
│   └── js/
│       ├── app.js                Connects the page to the logic
│       ├── config.js             Settings
│       ├── email.js              Builds the email text and mailto link
│       ├── stats.js              Records and reads action counts
│       ├── tracker.js            Draws both tracker charts, holds the colours
│       └── data/
│           ├── index.js          ← which countries and issues exist
│           ├── countries/        ← one file each: wording + recipients
│           │   ├── nl.js         ← Netherlands
│           │   ├── ca.js         ← Canada
│           │   ├── uk.js         ← United Kingdom
│           │   ├── de.js         ← Germany
│           │   ├── se.js         ← Sweden
│           │   └── fr.js         ← France
│           └── issues/
│               └── executions.js ← the email texts, in 12 languages
└── docs/
    └── supabase-schema.sql       Database structure and security rules
```

---

## 11. Maintenance

### Updating the libraries

`index.html` loads Supabase and Chart.js pinned to exact versions, each with an
`integrity` hash. The hash means the browser refuses the file if it does not
match — protection against a tampered CDN. **If you change a version number you
must recalculate its hash**, or the script will silently refuse to load and the
page will break.

```bash
curl -sL "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js" \
  | openssl dgst -sha384 -binary | openssl base64 -A
```

Put `sha384-` in front of the output and paste it into the `integrity`
attribute. Then test the page before publishing.

Current versions: `@supabase/supabase-js@2.45.4`, `chart.js@4.4.1`.

### Keeping the campaign current

The email texts name specific people who have been executed. When the situation
changes, those texts go stale and the campaign loses force. Review the files in
`assets/js/data/issues/` regularly, and verify names and details against a
reliable source before adding them. The current letters were rewritten on
2026-08-16 around the public executions in Isfahan on 28 July.

With twelve languages, updating them is now a bigger job than it used to be: one
factual change means twelve edits, and a language left behind is a supporter
somewhere being shown an English preview that no longer matches the letter they
are sending.

Recipients go stale too. After an election, check every address in the affected
country's file under `assets/js/data/countries/` against the parliament's own
website — MPs who have left keep their seat in our list otherwise.

**Everything known to be unfinished is listed in section 12**, including which
addresses have never been checked and which campaign facts need rechecking before
another country goes live. Read it before starting any of this work.

---

## 12. Open items and decisions, for later

Nothing here is broken. These are things that are **deliberately unfinished**,
recorded so they are not forgotten and nobody has to rediscover them. Each says
what it is, why it is still open, and which file it lives in.

The three most urgent are 12.3 (unverified addresses), 12.4 (unreviewed
translations) and 12.5 (unchecked campaign facts) — all three came in with the
2026-08-16 expansion to six countries, and all three affect letters that are
being sent right now.

### 12.1 Canada's demand could be sharper — needs a decision

**File:** `assets/js/data/countries/ca.js`, under `demands`.

Canada already did the two things the letters demand of everyone else: it closed
the Islamic Republic embassy in 2012 and listed the IRGC as a terrorist entity in
2024. The wording was rewritten on 2026-08-16 and now asks for things Canada has
*not* done — targeted sanctions on those responsible for the executions, real
enforcement of the IRGC listing through investigations and prosecutions,
dismantling regime-linked networks, and leading international action. That is a
big improvement on the earlier "keep the embassy closed" phrasing.

**One demand is still deliberately absent: deporting the regime officials and
their families who have settled in Canada.** It is a live campaign in the Iranian
community there and it has not been done.

It is left out on purpose: **it is a political judgement about what the campaign
demands, and that is the organisers' call, not a technical one.** If you want it,
it goes into `demands` in `ca.js` — one wording per version.

### 12.2 Quebec MPs are being written to in English

**File:** `assets/js/data/countries/ca.js`, the `languages` line.

The Bloc Québécois entry writes to five MPs who all sit for Quebec, and they
receive the **English** letter.

**This is now a one-line fix.** The French translations arrived on 2026-08-16 for
France, so all five letters already exist in French. Change `languages` in
`ca.js` from:

```js
  languages: ['en'],
```

to:

```js
  languages: ['en', 'fr'],
```

The site does the rest — a "Letter language" dropdown appears by itself, English
stays the default because it is listed first, and the preview keeps showing the
English translation underneath. Worth testing locally before publishing, but
nothing else has to change.

### 12.3 Most email addresses have never been checked

**Files:** `nl.js`, `uk.js`, `de.js`, `se.js`, `fr.js`.

**160 of the site's 184 addresses are unverified.** Only Canada's 24 have been
read off the MPs' own pages, on 2026-08-12, and they are the only ones carrying a
`[VERIFIED]` note.

| File | Addresses | Status |
| --- | --- | --- |
| `ca.js` | 24 | **Verified 2026-08-12** against ourcommons.ca |
| `nl.js` | 52 | Carried over from the site's first version, never checked |
| `uk.js` | 31 | Added 2026-08-16, never checked |
| `se.js` | 30 | Added 2026-08-16, never checked |
| `fr.js` | 27 | Added 2026-08-16, never checked |
| `de.js` | 20 | Added 2026-08-16, never checked |

They all follow their parliament's usual pattern, so most are probably right —
but "probably" is doing a lot of work, and a wrong address fails silently: the
supporter presses Send, nothing arrives, and nobody finds out. Canada is the
proof that patterns fail: two of its 24 do not match the standard form.

Check them country by country against the official sites listed in section 4.2,
and add a `[VERIFIED <date>]` comment as you go so the next person knows where
you stopped.

Two Dutch ones look like typos and are **not** — leave them alone:

- `b.eerdmans@` for Joost Eerdmans, who is registered under his formal initial.
- `j.jaspervandijk@` in the SP list.

### 12.4 The ten new translations have not been reviewed

**File:** `assets/js/data/issues/executions.js`.

On 2026-08-16 the letters went from two languages to twelve: German, French,
Italian, Spanish, Swedish, Norwegian, Danish, Polish, Finnish and Portuguese were
added to Dutch and English. Five of them are in active use (Dutch, English,
German, Swedish, French); the rest are waiting for a country.

The site has been checked mechanically — all 60 subject/body pairs build, and no
placeholder is ever left unreplaced — but **no native speaker has read them
against the English.** The site's central promise is that the preview shows a
supporter exactly what they are about to send, so each language needs one person
who reads it to confirm that it does.

Priority order: German, Swedish and French first, since letters are going out in
them today.

### 12.5 The demand facts go stale — recheck them

This is the one to re-read before launching any country. What to demand depends
on facts that change:

| Country | Islamic Republic embassy | IRGC | Checked |
| --- | --- | --- | --- |
| Netherlands | Open | Not proscribed by the EU | carried over |
| Canada | Closed since 2012 | Listed since 2024 | 2026-08-12 |
| United Kingdom | Open, in London | **Proscribed July 2026** | 2026-08-12 |
| Germany | assumed open, Berlin | assumed not proscribed | **never** |
| Sweden | assumed open, Stockholm | assumed not proscribed | **never** |
| France | assumed open, Paris | assumed not proscribed | **never** |

The bottom three rows went live on 2026-08-16 anyway, and their letters demand
closure of an embassy in Berlin, Stockholm and Paris on that assumption. Check
them. A letter demanding something a country did last month damages the
campaign's credibility with exactly the MPs who did it — the UK proscribed the
IRGC **one month** before this table was first written, which is how fast this
moves. Treat the table as part of the campaign texts and review it alongside
them.

### 12.6 The tracker lost its history — fixed 2026-08-16, but the old counts are gone

**File:** `assets/js/config.js`.

The tracker works again. It had been pointing at a Supabase project that no
longer existed, so every count silently failed; a new project was created on
2026-08-16 and the site now points at it.

**The counts from before that date could not be recovered** — they were inside
the project that disappeared, and nobody has a copy. The tracker started from
zero. If somebody reports that the numbers "reset", that is why, and it is not a
bug.

Nothing is outstanding here. It is written down only so the missing history has
an explanation.

### 12.7 Small tidy-ups

Nothing here affects a supporter; they are loose ends left by the 2026-08-16
expansion.

- **The step numbers disagree.** The instruction cards at the top of the page now
  list seven steps (starting with Country and Issue), but the form's own labels
  still read "1. Enter Your Details", "2. Choose the Politician", "3. Choose an
  Email Version". If you renumber them, remember the English and Persian cards
  must always change together.
- **Copied comments in `de.js` and `fr.js` describe the wrong country.** `de.js`
  says to verify addresses "against tweedekamer.nl" (the Dutch parliament) and
  opens with "The Germany."; `fr.js` says France "will remain Coming soon" above
  seven live entries.
- **Finnish has no name.** The letters exist in Finnish, but `LANGUAGE_NAMES` in
  `assets/js/data/index.js` has no `fi:` line, so a Finnish country would display
  the raw code. One line, whenever Finland is added.

---

## License

Released under the MIT License — see [LICENSE](LICENSE). The code may be freely
reused to build similar campaigns. If a different license suits the project
better, change that file; MIT was chosen as a permissive default.
