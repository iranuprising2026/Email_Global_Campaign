/**
 * The United Kingdom.
 *
 * ⚠️ NOT LIVE YET. The `politicians` list at the bottom is empty, so the UK
 * shows in the Country dropdown greyed out as "coming soon" and cannot be
 * chosen. Everything else is ready: add one MP and it goes live by itself.
 *
 * TO LAUNCH IT, fill in `politicians` with one entry per party -- the same
 * shape as nl.js and ca.js: the To is that party's foreign-affairs figure or
 * leader, and colleagues from the same party go in the CC.
 *
 * Look every address up on the MP's own page at members.parliament.uk. UK
 * parliamentary addresses are usually firstname.lastname@parliament.uk, but do
 * NOT assume it -- in Canada two of the addresses turned out to be short forms
 * that the pattern would have got wrong, and a guessed address fails silently.
 */
export default {
  /** Two-letter code. Must match the filename and the entry in ../index.js. */
  id: 'uk',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'United Kingdom',

  /** The letters are sent in English, reusing the English texts already written. */
  languages: ['en'],

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] in the letters.
   *
   * Both keys hold English here, because the letter is sent in English and the
   * preview also shows English. Include the article the sentence needs.
   */
  terms: {
    en: { country: 'the United Kingdom', government: 'the British government' },
  },

  /** Used as the signature when the visitor leaves the name field empty. */
  anonymousSignature: {
    en: 'An Iranian resident in the United Kingdom',
  },

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   * THE UK SITS BETWEEN THE OTHER TWO COUNTRIES, which is why its wording is
   * its own:
   *
   *   - The Islamic Republic embassy in London is OPEN, at 16 Princes Gate,
   *     with an ambassador in post since June 2025. So demanding its closure is
   *     a live demand here, exactly as it is in the Netherlands.
   *   - But the UK proscribed the IRGC as a terrorist organisation in July
   *     2026. Demanding that it do so would be a month out of date, so the
   *     demand below is to ENFORCE the proscription instead.
   *
   * ⚠️ CHECK BOTH FACTS BEFORE LAUNCHING. They were true on 2026-08-12 and
   * they move faster than these letters do.
   *
   * One per version, because the five letters word the demand differently on
   * purpose and the grammar differs -- version 4 needs a noun phrase. Read the
   * whole sentence in ../issues/executions.js before changing one.
   *
   * Double quotes are used where the text contains an apostrophe.
   */
  demands: {
    default: {
      en: "the Islamic Republic embassy in London must be closed, its diplomats expelled, and the IRGC's proscription enforced with arrests and asset seizures",
    },
    'Version 2': {
      en: "close the embassy in London, expel its diplomats, and use the IRGC's proscription to seize its assets and prosecute its operatives",
    },
    'Version 3': {
      en: "close the Islamic Republic embassy in London and enforce the IRGC's proscription with expulsions and asset seizures",
    },
    // A noun phrase: the letter reads "... measures must follow, including [DEMANDS]".
    'Version 4': {
      en: "closure of the embassy in London, expulsion of its diplomats, and full enforcement of the IRGC's proscription",
    },
    'Version 5': {
      en: "the embassy in London must be closed, its diplomats expelled, and the IRGC's proscribed networks dismantled through arrests and asset seizures",
    },
  },

  /**
   * Who the letters can be sent to. Empty, which is what keeps the UK greyed
   * out as "coming soon".
   *
   * TO ADD ONE: copy the block between the dashes, paste it inside the square
   * brackets below, and change the four values. Verify the address on the MP's
   * own page at members.parliament.uk first.
   *
   *   ----------------------------------
   *   {
   *     name: 'Full Name',
   *     party: 'Labour',
   *     primary: 'full.name@parliament.uk',
   *     cc: ['colleague@parliament.uk'],
   *   },
   *   ----------------------------------
   */
  politicians: [
  {
    name: 'Andy Burnham',
    party: 'Labour',
    primary: 'andy.burnham.mp@parliament.uk',
    cc: [
      'ed.miliband.mp@parliament.uk',
      'thornberrye@parliament.uk',
      'uma.kumaran.mp@parliament.uk',
      'alex.ballinger.mp@parliament.uk',
    ],
  },
  {
    name: 'Kemi Badenoch',
    party: 'Conservative',
    primary: 'kemi.badenoch.mp@parliament.uk',
    cc: [
      'withammp@parliament.uk',
      'john.whittingdale.mp@parliament.uk',
      'aphra.brandreth.mp@parliament.uk',
      'james.cleverly.mp@parliament.uk',
    ],
  },
  {
    name: 'Nigel Farage',
    party: 'Reform UK',
    primary: 'nigel.farage.mp@parliament.uk',
    cc: [
      'richard.tice.mp@parliament.uk',
      'andrew.rosindell.mp@parliament.uk',
      'lee.anderson.mp@parliament.uk',
      'robert.jenrick.mp@parliament.uk',
    ],
  },
  {
    name: 'Ed Davey',
    party: 'Liberal Democrats',
    primary: 'edward.davey.mp@parliament.uk',
    cc: [
      'calum.miller.mp@parliament.uk',
      'richard.foord.mp@parliament.uk',
      'edward.morello.mp@parliament.uk',
    ],
  },
  {
    name: 'Siân Berry',
    party: 'Green Party',
    primary: 'sian.berry.mp@parliament.uk',
    cc: [
      'ellie.chowns.mp@parliament.uk',
      'carla.denyer.mp@parliament.uk',
      'adrian.ramsay.mp@parliament.uk',
    ],
  },
  {
    name: 'Dave Doogan',
    party: 'SNP',
    primary: 'dave.doogan.mp@parliament.uk',
    cc: [
      'brendan.ohara.mp@parliament.uk',
      'chris.law.mp@parliament.uk',
      'kirsty.blackman.mp@parliament.uk',
      'graham.leadbitter.mp@parliament.uk',
    ],
  },
  {
    name: 'Liz Saville Roberts',
    party: 'Plaid Cymru',
    primary: 'liz.savilleroberts.mp@parliament.uk',
    cc: [
      'ben.lake.mp@parliament.uk',
      'llinos.medi.mp@parliament.uk',
    ],
  },
],
};
