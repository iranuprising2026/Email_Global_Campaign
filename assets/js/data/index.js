/**
 * The list of countries and issues the site offers.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * This is the short index that tells the site which files exist. There are
 * only two lists to keep up to date.
 *
 * TO ADD A COUNTRY
 *   1. Create the country file in ./countries/ (copy nl.js and edit it).
 *   2. Add an `import` line for it at the top of this file.
 *   3. Add its name to the `countries` list below.
 *
 * TO ADD AN ISSUE
 *   1. Create the issue file in ./issues/ (copy executions.js and edit it).
 *   2. Add an `import` line for it at the top of this file.
 *   3. Add its name to the `issues` list below.
 *
 * The order of each list is the order the dropdowns show them in.
 */

import nl from './countries/nl.js';
import ca from './countries/ca.js';
import uk from './countries/uk.js';
import de from './countries/de.js';
import executions from './issues/executions.js';

/**
 * Every country that has a file, in dropdown order.
 *
 * Being listed here does not put a country in front of visitors: one with no
 * recipients yet is shown greyed out as "coming soon" until its `politicians`
 * list is filled in. The United Kingdom is in that state.
 */
export const countries = [nl, ca, uk, de];

/**
 * Countries we intend to add but have not written a file for yet.
 *
 * These appear in the Country dropdown greyed out, labelled "coming soon", so
 * a visitor can see their country is planned. They cannot be selected.
 *
 * When a country here gets its own file in ./countries/, delete its line from
 * this list and add it to `countries` above instead -- otherwise it would be
 * listed twice.
 */
export const comingSoon = [];

/** Every issue, in dropdown order. */
export const issues = [executions];

/**
 * Look a country up by its code, e.g. 'nl'.
 * Returns undefined if there is no such country -- callers decide what to do,
 * because a mistyped link in a shared post must still give a working page.
 */
export function getCountry(id) {
  return countries.find((country) => country.id === id);
}

/** Look an issue up by its id, e.g. 'executions'. */
export function getIssue(id) {
  return issues.find((issue) => issue.id === id);
}

/**
 * Language names, shown in the "Letter language" dropdown and in the labels
 * above the preview box ("Preview (Dutch text that will be sent):").
 *
 * Add a line here whenever you add a language to the issue files.
 */
export const LANGUAGE_NAMES = {
  nl: 'Dutch',
  en: 'English',
  de: 'German',
  fr: 'French',
  it: 'Italian',
  sv: 'Swedish',
  es: 'Spanish',
  no: 'Norwegian',
  da: 'Danish',
  pl: 'Polish',
  pt: 'Portuguese',
};

/** The name of a language, falling back to its code if it is not listed. */
export function languageName(code) {
  return LANGUAGE_NAMES[code] || code;
}

/**
 * The issues actually written in a given language.
 *
 * A country added before its letters are translated would otherwise show an
 * issue whose text does not exist, and mail a member of parliament an empty
 * letter.
 */
export function issuesForLanguage(language) {
  return issues.filter((issue) =>
    issue.versions.every(
      (version) => version.subject[language] && version.body[language]
    )
  );
}

/**
 * The languages a country can actually send in: the ones it lists AND that
 * every issue has been translated into.
 */
export function languagesForCountry(country) {
  return country.languages.filter((language) => issuesForLanguage(language).length > 0);
}

/**
 * Whether a country is ready for visitors to write to.
 *
 * It needs BOTH halves to work: somebody to write to, and a letter written in
 * a language it uses. A country missing either is shown greyed out as "coming
 * soon" instead, because the alternative is worse -- an empty "Choose the
 * Politician" dropdown under a Generate button that cannot produce anything.
 *
 * This is what makes filling in a country's `politicians` list the only step
 * needed to launch it: the site works out on its own when it is ready.
 */
export function isSendable(country) {
  return country.politicians.length > 0 && languagesForCountry(country).length > 0;
}

/** Only the countries a visitor can actually pick. */
export function sendableCountries() {
  return countries.filter(isSendable);
}

/**
 * Every country shown greyed out in the dropdown: the ones with no file yet,
 * plus any with a file that is not finished (no recipients, or no letters in
 * its language).
 */
export function unavailableCountries() {
  return [
    ...countries.filter((country) => !isSendable(country)),
    ...comingSoon,
  ];
}

/**
 * The label shown in the dropdown and stored in the tracker, e.g.
 * "Caspar Veldkamp (NSC)".
 *
 * NEVER change this format: it is the key the tracker counts against, so
 * changing it splits every politician's history.
 */
export function politicianLabel(politician) {
  return `${politician.name} (${politician.party})`;
}

/** Look a politician up by their dropdown label, within one country. */
export function findPoliticianByLabel(country, label) {
  return country.politicians.find((p) => politicianLabel(p) === label);
}
