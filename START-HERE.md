# Start here

A five-minute guide to this website. No programming needed.

For step-by-step detail on anything below, see [README.md](README.md) — it is the
long version of this page.

**Before you change a letter or an email address, read
[ISSUES.md](ISSUES.md).** It lists what is currently known to be wrong or
unchecked. Right now that includes two letters asking for things that have
already been achieved.

---

## 1. What this site is

It helps people email members of parliament about the executions in Iran.

Somebody opens the site, chooses their country and a politician, and presses a
button. Their own email program opens with the letter already written. **They
press Send themselves, from their own mailbox.**

**The site never sends any email.** It only prepares the letter. That is
deliberate — a letter from a real person's address carries weight, and it keeps
us out of the business of holding people's data.

Live at: <https://iranuprising2026.github.io/Email_Global_Campaign/>

---

## 2. Look at it on your own computer first

Two steps. You need Terminal (Mac) or Command Prompt (Windows).

**Step 1** — open the project folder, then type:

```
python3 -m http.server 8000
```

On Windows, type `python` instead of `python3`.

**Step 2** — open <http://localhost:8000> in your browser.

That's it. Change a file, save it, and **refresh the browser with ⌘⇧R**
(Ctrl+Shift+R on Windows) to see it.

Press `Ctrl + C` in Terminal to stop.

> **Why not just double-click the file?** It looks broken if you do — the page
> needs to be served, not opened directly. The command above is what does that.
>
> **Always use ⌘⇧R, not a normal refresh.** A normal refresh can show you the
> old version and make you think your change didn't work. This has fooled people
> on this project more than once.

---

## 3. Publish it

**Anything you save to the `main` branch is live on the real site within about a
minute.** There is no "publish" button and no staging site. So look at your
change on your own computer first (section 2).

Easiest way, no software at all:

1. Go to the file on [github.com](https://github.com/iranuprising2026/Email_Global_Campaign)
2. Click the pencil icon
3. Make your change
4. Click **Commit changes**

Wait a minute, then open the live site and **⌘⇧R**.

If something goes wrong, README section 6 explains how to undo a publish.

---

## 4. Where to change things

Everything you are likely to want to edit is in `assets/js/data/`. You do not
need to touch anything else.

| I want to change… | Go to |
| --- | --- |
| Who we write to in a country | `assets/js/data/countries/` — one file per country |
| The letters themselves | `assets/js/data/issues/executions.js` |
| What the letters demand (per country) | the `demands` block in that country's file |
| Add a whole new country | a new file in `countries/`, plus one line in `data/index.js` |
| The words on the page, the instructions | `index.html` |
| Colours and fonts | `assets/css/styles.css` |

Every file in `assets/js/data/` has a **"HOW TO EDIT THIS FILE"** comment at the
top written in plain language. Read it before changing that file — it explains
what each part does and warns you about the traps specific to it.

**The seven country files right now:** Netherlands, Canada, United Kingdom,
Germany, Sweden, France, and the European Parliament. The last one is not a
country — its recipients are MEPs, grouped by political group instead of party.

---

## 5. How the site decides what to show

Useful to know, because it means most things happen by themselves:

1. The visitor picks a **country**. That loads that country's file.
2. The site offers the **languages** that country lists — but only if the
   letters actually exist in that language. If a translation is missing, that
   language quietly disappears rather than sending an empty letter.
3. The visitor picks a **politician**. The letter goes to that person, with
   their party colleagues copied in, so one send reaches a whole party.
4. The visitor picks one of **five letter versions**. They say the same thing in
   different words, on purpose — a hundred identical emails get filtered as
   spam; a hundred different ones get read.
5. The site fills in the blanks: the visitor's name and city, the country's
   name, and what that country is being asked to do.
6. It shows the letter **and an English translation** side by side, so nobody is
   asked to send words they cannot read.
7. The visitor sends it. The site counts the action — politician, version and
   country only, **never anything about the person**.

**A country appears automatically once it has both recipients and letters.**
There is no switch to flip. Add the first politician to an empty country and it
goes live by itself; that is how the UK launched.

---

## 6. What to take care of

The short list. These are the things that actually break this project.

**Never change what a letter says as a matter of fact.** The letters name real
people who were executed — their names, ages and dates. Fix a typo, reword a
sentence, restructure freely. Never change a name, an age or a date unless you
are certain and someone has asked you to.

**A letter and its translation change together.** Always. If you edit the Dutch
letter and not the English one underneath, a supporter is asked to send words
they can't read, and nobody notices. The same goes for the English and Persian
instruction cards on the page: change one, change the other.

**Never guess an email address. Look it up.** This is the single most common
mistake, and it fails *silently* — the supporter presses Send, nothing arrives,
and nobody finds out. On 8 September 2026 all 215 addresses were checked against
each parliament's own records and **sixteen were wrong**, every one of them
because somebody assumed a pattern. Open the politician's own page on the
official parliament website, copy the address exactly, and write
`// [VERIFIED <today's date>]` next to it. README section 4.2 lists the
official site for each parliament, and section 12.3 records what went wrong
last time.

**Check the facts a letter demands.** Some countries are asked to close the
Iranian embassy. Canada already closed theirs in 2012, and the European
Parliament never had one — so those two ask for something else. If you copy a
country file to make a new one, check that what it demands is actually true
there, or the letter asks for something already done.

**Elections invalidate a whole country file.** When a country votes, its
politicians change and their addresses stop working. **Sweden votes on
13 September 2026, so `se.js` will need redoing in early October.**

**Never add anything that identifies a supporter.** The site records only which
politician, which letter version and which country. No names, no addresses, no
email addresses. Keep it that way.

**There is nothing to install and nothing to build.** No npm, no framework, no
build step. If a change would require any of those, it is the wrong change —
this site has to stay editable by opening a file and refreshing the browser.

---

## 7. If something looks broken

| What you see | Usually means |
| --- | --- |
| Your change isn't showing | Cached. Press ⌘⇧R. Wait a minute after publishing. |
| Page is blank, dropdowns empty | A typo in a data file — a missing comma or quote |
| Charts missing | Normal if nobody has sent anything yet |
| Email opens with empty To field | That address is wrong — look it up again |

For a blank page: open the file you last edited and check every line ends with a
comma and every address has a quote at both ends. That is nearly always it.

README section 7 has the longer list.

---

**Questions this page doesn't answer** are almost certainly answered in
[README.md](README.md). And [ISSUES.md](ISSUES.md) is the running list of what
is known to be wrong or unchecked — worth a look before you change anything.
