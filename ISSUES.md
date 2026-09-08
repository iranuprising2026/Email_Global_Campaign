# Possible issues

Everything currently known to be wrong, unverified, or worth a second look.
Written in plain language — no programming knowledge needed to read it.

**Last reviewed: 8 September 2026.**

This is a working list, not a bug tracker. When you fix something, move it to
[Closed](#closed) at the bottom with the date, so the next person can see what
was already dealt with.

---

## Summary

| # | Issue | How bad | Kind of work |
| --- | --- | --- | --- |
| [1](#1-the-eu-already-listed-the-irgc--our-letters-still-ask-for-it) | EU letters ask for the IRGC listing that already happened | **Serious** | Rewrite wording |
| [2](#2-freeze-irgc-assets-is-now-automatic-eu-law) | "Freeze IRGC assets" is now automatic in the EU | **Serious** | Rewrite wording |
| [3](#3-canadas-version-4-subject-threatens-something-canada-did-in-2012) | Canada's Version 4 subject is 13 years out of date | Medium | Small edit |
| [4](#4-the-european-parliaments-version-4-subject-does-not-match-its-demand) | EP's Version 4 subject doesn't match its demand | Low | Small edit |
| [5](#5-germanys-swedens-and-frances-facts-have-never-been-checked) | DE / SE / FR embassy facts never checked | **Serious** | Research |
| [6](#6-the-uks-facts-age-quickly) | UK facts age quickly | Medium | Research |
| [7](#7-sweden-votes-on-13-september-2026) | Sweden votes 13 September 2026 | Known | Redo a file |
| [8](#8-nobody-has-read-the-twelve-translations) | The twelve translations were never reviewed | Medium | Language check |
| [9](#9-quebec-mps-are-written-to-in-english) | Quebec MPs are written to in English | Low | Decision |
| [10](#10-canadas-demand-leaves-out-deportation) | Canada's demand leaves out deportation | Low | Decision |
| [11](#11-small-things) | Small things (step numbers, Finnish, caching, charts) | Cosmetic | Small edits |

---

## 1. The EU already listed the IRGC — our letters still ask for it

**Files:** `assets/js/data/countries/eu.js`

**On 19 February 2026 the EU put the Islamic Revolutionary Guard Corps on its
terrorist list.** This is not in doubt — it is Council Decision (CFSP) 2026/421
and Implementing Regulation (EU) 2026/420, after all 27 governments agreed on
29 January 2026. It is still in force today.

Our European Parliament letters ask for exactly that. So they demand something
that was won seven months ago.

**Why this is worse than it sounds.** The European Parliament had been demanding
this listing for years and voted for it repeatedly — January 2023 (598 votes to
9), April 2025, and January 2026 (562 to 9). And the MEPs our letters are
addressed to are *the very people who tabled those resolutions*. So the letter
tells the campaign's strongest allies in Europe to do a thing they already did,
three times, and won. That does not just waste the letter — it makes the sender
look uninformed to exactly the people worth persuading.

**But not all of it is finished.** Two things the Parliament asked for have
*not* happened, and they are checked, not assumed:

- **The Basij militia and the Quds Force are not on the list.** Only "Islamic
  Revolutionary Guard Corps (IRGC)" is named in the legal text. The Parliament
  asked for the "full designation... including the Basij militia and the Quds
  Force". That half is unfinished.
- **Enforcement.** A listing on paper is not the same as assets actually found
  and frozen and networks actually dismantled.

**What to do.** Rewrite the `demands` block in `eu.js` so it credits the
Parliament for winning the designation and asks for what is left: the Basij and
Quds Force added, real enforcement, and no normalisation of relations while the
executions continue. Written that way this becomes the strongest letter in the
campaign instead of the weakest.

**Careful:** this is campaign wording. Someone who owns the campaign's message
should approve the new text, not just anyone editing the file.

---

## 2. "Freeze IRGC assets" is now automatic EU law

**Files:** `nl.js`, `de.js`, `se.js`, `fr.js`

Same event as issue 1, different consequence. The EU rule that carries the
listing — Regulation 2580/2001 — applies **directly in all 27 member states**.
Nobody has to pass a national law. Since February 2026, freezing IRGC money has
been a legal obligation in the Netherlands, Germany, Sweden and France whether
their parliaments act or not.

All four of those letters currently ask their parliament to "freeze IRGC
assets". A well-briefed MP will know it is already required.

**What to do.** Change those four demands from *freeze the assets* to *enforce
the freeze that already exists* — actually finding the money, prosecuting the
networks. That is a real and unfinished ask.

**What is NOT affected.** The other half of those letters asks the country to
**close the Islamic Republic embassy and expel its diplomats.** That is each
country's own decision, nothing to do with the EU listing, and still entirely
live. Do not touch it.

**Also not affected:** Canada and the United Kingdom. Both were already written
around *enforcing* a listing rather than creating one, and the UK is not in the
EU. They are correct as they stand.

---

## 3. Canada's Version 4 subject threatens something Canada did in 2012

**Files:** `assets/js/data/countries/ca.js`

Version 4's subject line reads *"Ultimatum for the Islamic Republic: Stop the
killings or face departure"*. "Departure" means expelling Iran's diplomats and
cutting relations.

**Canada did that in 2012.** There are no Iranian diplomats in Canada to expel.

This is the same mistake that was already fixed for Versions 2 and 5 in
September 2026 — it was missed because the check written at the time looked for
the word "embassy", and Version 4 makes the same demand using different words.

**What to do.** `ca.js` already has a `subjectOverrides` block. Add
`'Version 4'` to it with a subject about sanctions and enforcement, matching
what Canada's letter actually asks for. Small, safe edit.

---

## 4. The European Parliament's Version 4 subject does not match its demand

**Files:** `assets/js/data/countries/eu.js`

Same subject line as issue 3. For the EU it is not *false* — the EU has not cut
relations with Iran, so the threat is at least possible — but it does not match
what the EP letter actually asks for.

Lower priority than issue 3, and worth doing at the same time as issue 1 since
both are edits to the same file.

---

## 5. Germany's, Sweden's and France's facts have never been checked

**Files:** `de.js`, `se.js`, `fr.js`

**This is the biggest unchecked risk in the project.** All three letters assert
that the Islamic Republic still has an open embassy in Berlin, Stockholm and
Paris. Nobody has confirmed any of it — the wording was written by copying the
Dutch letter and swapping the city name, when those three countries went live in
August 2026.

If any one of those embassies is already closed, that country's letters demand
something already done, in front of 77 recipients. That is exactly the failure
Canada's rewrite existed to avoid.

**What to do.** For each of the three, confirm from the country's own foreign
ministry or the embassy's own site whether the embassy is open and whether an
ambassador is in post. Then correct that country's `demands` block if needed,
and write the date you checked into the file.

---

## 6. The UK's facts age quickly

**Files:** `uk.js`

The UK letters depend on two things: Iran's embassy at 16 Princes Gate, London
being open, and the IRGC's proscription being under-enforced. Both were checked
on 12 August 2026 — one month after the proscription — and not since. The UK went
live on 16 August 2026 without a re-check.

Worth confirming, but less urgent than issue 5 because these were at least
verified once.

---

## 7. Sweden votes on 13 September 2026

**Files:** `se.js`

Every Swedish name and address comes from the parliament elected in 2022.

The addresses keep working for a few weeks — the outgoing members hold their
seats until the new parliament meets on **28 September 2026** — and election day
itself changes nothing. After that:

- MPs who lose or stand down lose their `@riksdagen.se` address
- The foreign affairs committee is rebuilt, so the people the letters are
  addressed to may no longer hold that role
- If the government changes, a different set of people become ministers — and
  **Swedish ministers have no published parliamentary address at all**, which is
  what broke two of the six Swedish entries before September 2026

**What to do.** Nothing yet. Plan to redo `se.js` in early October, in one pass,
rather than patching it now.

---

## 8. Nobody has read the twelve translations

**Files:** `assets/js/data/issues/executions.js`

The letters exist in twelve languages: Dutch, English, German, French, Italian,
Spanish, Swedish, Norwegian, Danish, Polish, Finnish and Portuguese. Ten of them
arrived in one go in August 2026.

They all build without error and no blank is left unfilled — but that is a
mechanical check. **Nobody who speaks Finnish, Polish or Portuguese has read
those letters against the English.** Since every letter is shown next to its
English translation, a bad translation is visible to the recipient.

**What to do.** Get a speaker of each language to read that language's five
letters against the English and confirm they say the same thing.

---

## 9. Quebec MPs are written to in English

**Files:** `ca.js`

Canada's letters are English only, so the Bloc Québécois entry — whose MPs all
sit for Quebec — receives an English letter. French letters already exist. Adding
`'fr'` to Canada's `languages` list would fix it.

A decision about tone, not a defect.

---

## 10. Canada's demand leaves out deportation

**Files:** `ca.js`

Canada's demand was rewritten in August 2026 to ask for sanctions and
enforcement of the IRGC listing. Deporting regime officials living in Canada was
discussed and left out. Still open as a choice.

---

## 11. Small things

None of these affect a supporter.

- **The step numbers disagree.** The instruction cards at the top of the page
  count seven steps; the form's own labels still say "1. Enter Your Details",
  "2. Choose the Politician", "3. Choose an Email Version". If you renumber
  them, the English and Persian cards must both change.
- **Finnish has no name.** The letters exist in Finnish, but the list of
  language names has no entry for it, so it would appear as the bare code "fi".
  One line, needed only if a Finnish-speaking country is added.
- **Copy-paste comments that contradict their own file.** `de.js` tells the
  editor to check addresses "against tweedekamer.nl" (the *Dutch* parliament),
  and `fr.js` says France is "coming soon" above seven live entries. Harmless to
  the site, confusing to a person editing it.
- **A changed file can stay invisible.** There is no way to force browsers to
  reload the site's code, so a visitor who already had the page open may keep
  seeing the old version for a while. Always press ⌘⇧R (Ctrl+Shift+R) before
  deciding a change didn't work.
- **Three charts restarted from zero** in September 2026, when the FVD and the
  Swedish M and KD entries changed who they are addressed to. The tracker stores
  the recipient's name, so those three began counting again. Nothing is broken;
  the old counts simply stopped growing.
- **GitHub Pages settings were never confirmed.** The site is assumed to publish
  from the `main` branch, root folder. It works, so this is almost certainly
  right, but nobody has looked at the repository settings.

---

## Closed

Kept so nobody re-investigates something already dealt with.

- **Sixteen wrong email addresses — fixed 8 September 2026.** All 215 addresses
  were checked against each parliament's own register of members. Sixteen were
  wrong: twelve Dutch, three Swedish, one French. Every one came from guessing
  an address from a pattern instead of looking it up. Two were worse than a
  bounce — one Dutch address could have reached the wrong politician, and two
  Swedish entries were addressed to government ministers who have no
  parliamentary address, so those letters had nowhere to land at all. Details in
  README section 12.3.
- **Two subject lines contradicted their own letter — fixed 8 September 2026.**
  Versions 2 and 5 demanded closing the Iranian embassy in the *subject*, which
  is wrong for Canada (closed 2012) and the European Parliament (never had one).
  Country files can now override a subject. See issues 3 and 4 above for the
  part of this that was missed.
- **The tracker had no working database — fixed 16 August 2026.** Counts from
  before that date are gone.

---

## How to check these yourself

- **An email address:** open that politician's own page on the official
  parliament site and copy it exactly. README section 4.2 lists the site for
  each parliament. Never guess from the pattern.
- **What a letter demands:** check the fact is still true *today*. Issues 1 and
  2 above are both cases where a demand was correct when written and became
  wrong a few months later. A demand for something already achieved makes the
  campaign look careless.
- **That nothing else broke:** README section 4.7 and the "Check these before
  you publish" list in section 3.
