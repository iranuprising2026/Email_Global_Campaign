# Email Global Campaign

A one-page website that helps people in the Netherlands send an email to members
of the Dutch parliament (Tweede Kamer), demanding action against the executions
in Iran.

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

---

## 1. What the site does

From a supporter's point of view:

1. They type their **name and city** — both optional. If they leave the name
   blank, the email is signed "Een Iraanse inwoner in Nederland" (An Iranian
   resident in the Netherlands), so people who fear identification can still act.
2. They pick a **politician**. Each choice actually emails four people: the
   politician, two colleagues from their party, and the party's general inbox.
3. They pick one of **five versions** of the email.
4. They press **Generate Email Content**. The Dutch email appears, together with
   an **English translation** — nobody is asked to send words they cannot read.
5. They press **Open Email**, which opens their own mail app with everything
   filled in. They still press Send themselves, from their own address.
6. The action is counted in the **Live Action Tracker** at the bottom of the
   page, so supporters can see which politicians have been contacted least and
   aim there instead.

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
| The email texts (Dutch or English) | `assets/js/data/campaign.js` |
| The politicians and their addresses | `assets/js/data/politicians.js` |
| The instructions shown at the top, in English or Persian | `index.html` |
| Colours, spacing, fonts | `assets/css/styles.css` |
| Which campaign is live | `assets/js/config.js` |
| The chart colours | `assets/js/tracker.js` |
| How the page behaves when buttons are pressed | `assets/js/app.js` |

The two data files are written to be edited by non-programmers. Open one and
read the comment block at the top before changing anything — it explains the
format of that specific file.

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

- [ ] Pick a politician, press **Generate Email Content** — Dutch text and the
      English translation both appear.
- [ ] The English translation actually matches the Dutch.
- [ ] Press **Open Email (PC/Outlook)** — your mail app opens with To, CC,
      subject and body filled in.
- [ ] Try it on a **phone** too, using the Mobile button and the Gmail app.
- [ ] The Live Action Tracker at the bottom draws its bars.
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

File: **`assets/js/data/politicians.js`**

1. **Verify every address on tweedekamer.nl first.** A wrong address means a
   supporter's effort goes nowhere.
2. Find any existing entry and copy the whole block, from `{` down to `},`.
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
you like.

### 4.3 Add a sixth email version

File: **`assets/js/data/campaign.js`** — plus **two other files**, which is why
this one needs care.

**Step 1.** In `campaign.js`, copy an entire existing version block — from `{`
before `id:` down to its closing `},` — and paste it before the closing `],` of
the `versions` list. Then change all five values:

```js
      {
        id: 'Version 6',                  // must be unique
        subject: {
          nl: 'Dutch subject line',       // what gets sent
          en: 'English translation',      // what the supporter is shown
        },
        body: {
          nl: 'Geachte [NAME],\n\n…\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
          en: 'Dear [NAME],\n\n…\n\nKind regards,\n[USER]\n[CITY]',
        },
      },
```

Keep the placeholders `[NAME]`, `[USER]` and `[CITY]` exactly as written — they
are filled in automatically. `\n` means "new line"; `\n\n` leaves a blank line
between paragraphs.

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

### 4.4 Add a new campaign

A campaign is a whole set of versions with its own heading. Only one is live at
a time, and each keeps its own statistics — so switching back and forth never
loses numbers.

**Step 1.** In `assets/js/data/campaign.js`, copy the entire `executions: { … }`
block — from `executions:` down to its closing `},` — and paste it after. Give
the copy a new short, lower-case name and its own `title`:

```js
  politicalPrisoners: {
    id: 'politicalPrisoners',        // must match the name on the line above
    title: 'Free the Political Prisoners',
    versions: [
      // … your versions here
    ],
  },
```

The `id` must be spelled identically to the name before the colon.

**Step 2.** In **`assets/js/config.js`**, point the site at it:

```js
export const ACTIVE_CAMPAIGN_ID = 'politicalPrisoners';
```

**Step 3.** In **`index.html`**, update the fallback heading so it matches (this
text is only shown if JavaScript fails, but it should still be correct):

```html
<h2 id="campaign-title">Stop Daily Executions Campaign</h2>
```

**Step 4.** Save, refresh, and confirm the new heading and versions appear. To
switch back, change `ACTIVE_CAMPAIGN_ID` again — the old campaign's texts and
statistics are still there.

### 4.5 Add a chart colour

File: **`assets/js/tracker.js`**, the `VERSION_COLORS` list. One colour per
version, in order. Each is a hex code in quotes. If there are fewer colours than
versions, the list starts over from the beginning.

Pick something **light**. The chart sits on a dark navy card, so dark colours
disappear against it. The existing five run from medium blue to almost white;
anything in that range works.

### 4.6 After adding anything

- [ ] Refresh your local page (section 3) — it loads without a blank screen.
- [ ] The new entry appears where you expected.
- [ ] Generate an email using it and read the result.
- [ ] Only then publish (section 6).

---

## 5. Other common edits

### Change the wording of an existing email

1. Open `assets/js/data/campaign.js` and find the version, e.g. `id: 'Version 3'`.
2. Change the Dutch text **and** its English translation:
   - `subject.nl` — the Dutch subject line that gets sent
   - `subject.en` — the English translation shown to the supporter
   - `body.nl` — the Dutch email that gets sent
   - `body.en` — the English translation of it
3. Keep `[NAME]`, `[USER]`, `[CITY]` and the `\n` line breaks as they are.

> **If you change a Dutch text, you must change its English translation too.**
> A supporter who is shown an inaccurate translation is being asked to sign
> something they haven't actually read. That is the one thing this site must
> never do.

### Remove a politician

Delete their whole block, from `{` to the matching `},`. Their past statistics
stay in the database but are no longer shown.

Careful with **renaming**: statistics are stored under "Name (PARTY)", so a
renamed politician starts a fresh bar in the chart and their old numbers remain
under the old name. Renaming is fine — just expect the numbers to split.

### Change the campaign heading

Edit the `title` line in `assets/js/data/campaign.js`, and the fallback `<h2>` in
`index.html` to match.

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
   e.g. `assets/js/data/campaign.js`.
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

Almost always a typo in one of the data files — see the four common mistakes in
section 4.1. To find it:

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

### The tracker chart is missing

The page shows a short note when the statistics can't be loaded. This does not
stop anyone from sending an email — that is deliberate. Check that the Supabase
project is still active, and look at the Console (F12) for the reason.

### The email opens with an empty To field

This is a difference between mail apps, not a bug in the text. Use the button
that matches the device: **PC/Outlook** on a computer, **Mobile/Gmail** on a
phone. On mobile, Gmail is reliable and Outlook Mobile is known to mishandle
these links. As a fallback, **Copy All to Clipboard** always works.

---

## 8. Rules worth respecting

- **Never put a `service_role` key in this project.** The key in
  `assets/js/config.js` is a *publishable* key and is meant to be visible. A
  `service_role` key would let anyone wipe the campaign statistics.
- **No personal data is collected.** The supporter's name, city and email text
  never leave their browser. Only the politician's name, the version number and
  the type of click are recorded. Please keep it that way.
- **Verify email addresses** against tweedekamer.nl before adding them.
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
data/campaign.js  ─┐
data/politicians.js┼─> email.js (pure) ──> app.js ──> DOM + mailto:
config.js         ─┘                          │
                                              ├──> stats.js ──> Supabase
                                              └──> tracker.js ──> Chart.js
```

**Module responsibilities**

| File | Responsibility |
| --- | --- |
| `config.js` | Settings: Supabase credentials, active campaign |
| `data/politicians.js` | The recipient list, plus label/lookup helpers |
| `data/campaign.js` | Campaign texts in Dutch and English |
| `email.js` | Pure functions: fill templates, build the `mailto:` URL |
| `stats.js` | Supabase reads and writes; never throws |
| `tracker.js` | Renders the Chart.js stacked bar chart |
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
│       ├── tracker.js            Draws the chart, holds the colour list
│       └── data/
│           ├── campaign.js       ← the email texts
│           └── politicians.js    ← the recipients
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
changes, those texts go stale and the campaign loses force. Review
`assets/js/data/campaign.js` regularly, and verify names and details against a
reliable source before adding them.

---

## License

Released under the MIT License — see [LICENSE](LICENSE). The code may be freely
reused to build similar campaigns. If a different license suits the project
better, change that file; MIT was chosen as a permissive default.
