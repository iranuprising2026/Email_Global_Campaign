/**
 * Canada.
 *
 * Every address here has been read off that MP's own page on
 * ourcommons.ca/members -- Parliament's own record -- and is marked [VERIFIED]
 * with the date. Nothing in this file is guesswork.
 *
 * WHEN YOU ADD SOMEBODY, look their address up the same way. Search their name
 * at ourcommons.ca/members, open their profile, and copy the address under
 * "Contact Details". Do NOT assume it is Firstname.Lastname@parl.gc.ca: that
 * pattern is usual but not a rule, and two of the MPs below break it --
 * Robert Oliphant answers at rob.oliphant@ and Gary Anandasangaree at
 * gary.anand@. A guessed address fails silently, with nothing to warn the
 * supporter that their letter went nowhere.
 *
 * Note that the downloadable MP list from ourcommons.ca carries names, parties
 * and ridings but NO email addresses, so there is no shortcut -- the addresses
 * exist only on the individual profile pages.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Everything about one country lives in one file: which language its letters
 * are written in, the words filled into those letters, and who to write to.
 *
 * The letters themselves are NOT here -- they are shared between countries and
 * live in ../issues/. Canada writes in English, so it reuses the English
 * letters that already exist. Nothing new has to be written.
 */
export default {
  /** Two-letter country code. Must match the filename and ../index.js. */
  id: 'ca',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'Canada',

  /**
   * Which language(s) the letters may be written in.
   *
   * English only for now. Canada is officially bilingual, so this should become
   * ['en', 'fr'] -- but only once French letters exist in ../issues/. Adding
   * 'fr' before then changes nothing on the page: a language with no letters
   * is ignored, so the site never offers a letter it cannot produce.
   *
   * This matters for the Bloc Québécois entry below, whose MPs all sit for
   * Quebec and currently receive an English letter. Translating the five
   * letters into French and adding 'fr' here would give supporters a
   * "Letter language" dropdown and let those MPs be written to in French.
   */
  languages: ['en'],

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] where they appear in the
   * letters.
   *
   * Canada's letters are sent in English and the preview also shows English,
   * so both keys hold the same words here. A country writing in its own
   * language needs two different sets -- see nl.js.
   *
   * Include whatever article the sentence needs: "the Canadian government",
   * but just "Canada".
   */
  terms: {
    en: { country: 'Canada', government: 'the Canadian government' },
  },

  /**
   * Signature used when the visitor leaves the name field empty, so an
   * anonymous letter still says where the writer lives.
   */
  anonymousSignature: {
    en: 'An Iranian resident in Canada',
  },

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   * ⚠️ CANADA IS NOT THE NETHERLANDS HERE, and this is the whole reason this
   * field exists. Canada broke off relations and closed the Islamic Republic
   * embassy in 2012, and listed the IRGC as a terrorist entity in 2024. The
   * Dutch letters demand exactly those two things, so reusing their wording
   * would ask a Canadian MP to do what they already did -- and several of the
   * MPs above are the very people who did it. So Canada's demand is to hold
   * that line and enforce it, not to start it.
   *
   * ONE PER VERSION, because the five letters word the demand differently on
   * purpose and the grammar differs. Read the whole sentence in
   * ../issues/executions.js before changing one of these, so it still fits.
   * Version 4 needs a noun phrase; the others need a sentence.
   *
   * `default` is used for any version not listed here.
   *
   * Double quotes are used where the text contains an apostrophe -- inside
   * single quotes an apostrophe would break the file.
   * UPDATED by Iranuprising2026, August 16, 2026
   */
   
demands: {
  default: {
    en: "Canada must impose targeted sanctions on those responsible for the executions and death sentences, fully enforce the IRGC's terrorist listing through investigations and prosecutions, dismantle regime-linked networks operating in Canada, seize their assets, and lead an international effort to stop the executions",
  },
  'Version 2': {
    en: "impose targeted sanctions on those responsible for the executions and death sentences, fully enforce the IRGC's terrorist listing by investigating and prosecuting its operatives and regime-linked networks in Canada, seizing their assets, and coordinating with allies to demand an immediate halt to executions",
  },
  'Version 3': {
    en: "Canada will impose targeted sanctions on the officials responsible for the executions, enforce the IRGC terrorist designation through investigations and prosecutions, dismantle its networks and other regime-linked networks in Canada, seize their assets, and mobilize allies to demand an immediate end to the executions",
  },
  // A noun phrase: the letter reads "... measures must follow, including [DEMANDS]".
  'Version 4': {
    en: "imposing targeted sanctions on those responsible for the executions and death sentences, fully enforcing the IRGC's terrorist listing through investigations and prosecutions, dismantling regime-linked networks in Canada, seizing their assets, and leading coordinated international action to halt the executions",
  },
  'Version 5': {
    en: "Canada must impose targeted sanctions on those responsible for the executions and death sentences, enforce the IRGC's terrorist listing through prosecutions and asset seizures, dismantle regime-linked networks operating in Canada, and work with its allies to impose coordinated consequences unless the executions stop",
  },
},

  /**
   * Who the letters can be sent to. Each entry is one option in the
   * "Choose the Politician" dropdown.
   *
   *   name    Written the way the letter should address them, because the
   *           letter opens with "Dear <name>,".
   *   party   Party abbreviation. Shown as "Name (PARTY)".
   *   primary The main recipient -- goes in the "To" field.
   *   cc      Everyone who gets a copy, in the "CC" field. May be left empty
   *           as `cc: []`.
   *
   * One entry per party, the same way the Netherlands works: the To is that
   * party's foreign-affairs figure or its leader, and colleagues from the same
   * party go in the CC. So one send reaches a whole party bloc.
   *
   * IMPORTANT: `name` and `party` together form the label saved in the
   * tracker ("Anita Anand (Liberal)"). Renaming an existing politician splits
   * their statistics between the old and new label.
   *
   * Please verify addresses against ourcommons.ca/members before adding them.
   * Sending to a wrong address wastes a supporter's effort.
   *
   * TO ADD ONE: copy the block between the dashes, paste it inside the square
   * brackets below, and change the four values.
   *
   *   ----------------------------------
   *   {
   *     name: 'Full Name',
   *     party: 'Liberal',
   *     primary: 'full.name@parl.gc.ca',
   *     cc: ['colleague@parl.gc.ca'],
   *   },
   *   ----------------------------------
   */
  politicians: [
    {
      // Minister of Foreign Affairs. The government's own front bench, which
      // mirrors the Dutch list: Caspar Veldkamp is likewise both a sitting MP
      // and the foreign minister.
      name: 'Anita Anand',
      party: 'Liberal',
      primary: 'Anita.Anand@parl.gc.ca', // [VERIFIED 2026-08-12] Foreign Affairs
      cc: [
        'rob.oliphant@parl.gc.ca',   // [VERIFIED 2026-08-12] Parl. Sec., Foreign Affairs.
                                     //   NOT robert.oliphant@ -- see the note above.
        'mark.carney@parl.gc.ca',    // [VERIFIED 2026-08-12] Prime Minister, Liberal leader
        'gary.anand@parl.gc.ca',     // [VERIFIED 2026-08-12] Public Safety, the portfolio
                                     //   that owns the IRGC terrorist listing.
                                     //   NOT gary.anandasangaree@ -- his real address is short.
        'melanie.joly@parl.gc.ca',   // [VERIFIED 2026-08-12] former Foreign Minister
        'vince.gasparro@parl.gc.ca', // [VERIFIED 2026-08-12]
        'leslie.church@parl.gc.ca',  // [VERIFIED 2026-08-12]
      ],
    },
    {
      // Shadow Foreign Minister and vice-chair of the foreign policy committee.
      name: 'Michael Chong',
      party: 'Conservative',
      primary: 'michael.chong@parl.gc.ca', // [VERIFIED 2026-08-12]
      cc: [
        'melissa.lantsman@parl.gc.ca', // [VERIFIED 2026-08-12] Deputy Leader
        'pierre.poilievre@parl.gc.ca', // [VERIFIED 2026-08-12] party leader
        'garnett.genuis@parl.gc.ca',   // [VERIFIED 2026-08-12]
        'james.bezan@parl.gc.ca',      // [VERIFIED 2026-08-12]
        'roman.baber@parl.gc.ca',      // [VERIFIED 2026-08-12]
      ],
    },
    {
      // The CC list is the entire rest of the NDP caucus: the party holds five
      // seats, so one send reaches all of them.
      name: 'Heather McPherson',
      party: 'NDP',
      primary: 'heather.mcpherson@parl.gc.ca', // [VERIFIED 2026-08-12] foreign affairs critic
      cc: [
        'don.davies@parl.gc.ca',  // [VERIFIED 2026-08-12] party leader
        'jenny.kwan@parl.gc.ca',  // [VERIFIED 2026-08-12]
        'leah.gazan@parl.gc.ca',  // [VERIFIED 2026-08-12]
        'gord.johns@parl.gc.ca',  // [VERIFIED 2026-08-12]
      ],
    },
    {
      // ⚠️ These MPs sit for Quebec and would receive an ENGLISH letter, because
      // no French translation exists yet. See `languages` at the top of this
      // file for how to fix that.
      name: 'Yves-François Blanchet',
      party: 'Bloc Québécois',
      primary: 'yves-francois.blanchet@parl.gc.ca', // [VERIFIED 2026-08-12] party leader.
                                                    //   The accent is dropped: francois, not françois.
      cc: [
        'alexis.brunelle-duceppe@parl.gc.ca', // [VERIFIED 2026-08-12]
        'christine.normandin@parl.gc.ca',     // [VERIFIED 2026-08-12]
        'mario.beaulieu@parl.gc.ca',          // [VERIFIED 2026-08-12]
        'louis.plamondon@parl.gc.ca',         // [VERIFIED 2026-08-12]
      ],
    },
    {
      // The Green Party holds one seat, so there is nobody to copy in.
      name: 'Elizabeth May',
      party: 'Green',
      primary: 'elizabeth.may@parl.gc.ca', // [VERIFIED 2026-08-12] party leader
      cc: [],
    },
  ],
};
