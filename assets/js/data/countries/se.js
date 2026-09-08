/**
 * Sweden.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Everything about one country lives in one file: which language its letters
 * are written in, the words filled into those letters, and who to write to.
 *
 * TO ADD A COUNTRY
 *   1. Copy this file and rename it to the country's two-letter code
 *      (se.js for Sweden, fr.js for France, it.js for Italy).
 *   2. Change every value below.
 *   3. Add one line to ../index.js so the site knows the file exists.
 *
 * If the new country speaks a language we already have letters in, you do NOT
 * need to write new letters -- just set `languages` to that language and the
 * existing letters are reused.
 */
export default {
  /** Two-letter country code. Must match the filename and ../index.js. */
  id: 'se',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'Sweden',

  /**
   * Which language(s) the letters may be written in, from the files in
   * ../issues/. Countries sharing a language share their letters.
   *
   * Most countries have one. Put more than one only where the country really
   * is bilingual -- the visitor then gets an extra "Letter language" dropdown.
   * The first one listed is the default.
   */
  languages: ['sv'],

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] where they appear in the
   * letters.
   *
   * Two languages are needed. The letter is SENT in Swedish, while the
   * preview box shows supporters an English translation of what they are
   * about to send.
   *
   * Include whatever article the sentence needs.
   */
  terms: {
    sv: {
      country: 'Sverige',
      government: 'den svenska regeringen',
    },
    en: {
      country: 'Sweden',
      government: 'the Swedish government',
    },
  },

  /**
   * Signature used when the visitor leaves the name field empty, so an
   * anonymous letter still says where the writer lives.
   */
  anonymousSignature: {
    sv: 'En iransk invånare i Sverige',
    en: 'An Iranian resident in Sweden',
  },

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   * WHY THIS IS PER COUNTRY: the same demand is not appropriate everywhere.
   * Each country has its own diplomatic relationship with the Islamic Republic,
   * so the measures demanded from its government must reflect that country's
   * actual situation.
   *
   * WHY THIS IS PER VERSION: the five letters word the demand differently on
   * purpose, so they do not read as bulk mail, and the grammar around the
   * placeholder differs. Version 4 says "including [DEMANDS]" and needs a noun
   * phrase; the other versions require wording that fits directly into their
   * respective sentences.
   *
   * Read the whole sentence in ../issues/executions.js before changing one of
   * these, so the grammar still fits around it.
   *
   * `default` is used for any version not listed here.
   */
  demands: {
    default: {
      sv: 'den Islamiska republikens ambassad måste stängas, dess diplomater utvisas och IRGC:s tillgångar frysas',
      en: 'the Islamic Republic embassy must be closed, its diplomats expelled, and IRGC assets frozen',
    },

    'Version 2': {
      sv: 'stäng ambassaden i Stockholm, utvisa dess diplomater och frys IRGC:s tillgångar',
      en: 'close the embassy in Stockholm, expel its diplomats, and freeze IRGC assets',
    },

    'Version 3': {
      sv: 'stänga den Islamiska republikens ambassad i Stockholm och frysa IRGC:s tillgångar',
      en: 'close the Islamic Republic embassy in Stockholm and freeze IRGC assets',
    },

    // A noun phrase: the letter reads "... diplomatiska åtgärder följa, däribland [DEMANDS]".
    'Version 4': {
      sv: 'stängning av ambassaden i Stockholm, utvisning av dess diplomater och frysning av IRGC:s tillgångar',
      en: 'closure of the embassy in Stockholm, expulsion of its diplomats, and freezing of IRGC assets',
    },

    'Version 5': {
      sv: 'ambassaden måste stängas, dess diplomater utvisas och IRGC:s finansiella tillgångar frysas',
      en: 'the embassy must be closed, its diplomats expelled, and the IRGC financially crippled through asset freezes',
    },
  },

  /**
   * Who the letters can be sent to. Each entry is one option in the
   * "Choose the Politician" dropdown.
   *
   *   name    Written the way the letter should address them.
   *   party   Party abbreviation. Shown as "Name (PARTY)".
   *   primary The main recipient -- goes in the "To" field.
   *   cc      Everyone who gets a copy, in the "CC" field.
   *
   * IMPORTANT: `name` and `party` together form the label saved in the
   * tracker. Renaming an existing politician splits their statistics between
   * the old and new label.
   *
   * Please verify every address against the Swedish Parliament's official
   * contact information before adding it. Sending to a wrong address wastes
   * a supporter's effort.
   */
    politicians: [
    {
      name: 'Magdalena Andersson',
      party: 'S',
      primary: 'magdalena.andersson@riksdagen.se',
      cc: [
        'morgan.johansson@riksdagen.se',
        'kenneth.g.forslund@riksdagen.se',
        'johan.buser@riksdagen.se',
        'jytte.guteland@riksdagen.se',
      ],
    },
    {
      name: 'Jimmie Åkesson',
      party: 'SD',
      primary: 'jimmie.akesson@riksdagen.se',
      cc: [
        'aron.emilsson@riksdagen.se',
        'bjorn.soder@riksdagen.se',
        'mattias.karlsson@riksdagen.se',
        'julia.kronlid@riksdagen.se',
      ],
    },
    {
      // Was Ulf Kristersson until 2026-09-08. He is Prime Minister, and in
      // Sweden a statsråd steps back from their seat -- the Riksdag then stops
      // publishing an address for them, so ulf.kristersson@riksdagen.se was a
      // guess that nothing supported. Margareta Cederfelt replaces him: she is
      // a full member (ledamot) of the utrikesutskottet, the foreign affairs
      // committee, which is the same rule the other entries follow. She was
      // already in the CC below.
      //
      // To reach the Prime Minister, Swedish practice is to write to the
      // relevant ministry's registrator rather than the person -- see
      // regeringen.se/kontaktuppgifter. Not added here because this file only
      // carries addresses that have been verified.
      name: 'Margareta Cederfelt',
      party: 'M',
      primary: 'margareta.cederfelt@riksdagen.se', // [VERIFIED 2026-09-08]
                                                   //   foreign affairs cttee
      cc: [
        'karin.enstrom@riksdagen.se',       // [VERIFIED 2026-09-08] former
                                            //   foreign minister, on the cttee
        'mattias.j.karlsson@riksdagen.se',  // [VERIFIED 2026-09-08] note the
                                            //   'j': the SD entry has a
                                            //   different Mattias Karlsson
        'ann-sofie.alm@riksdagen.se',       // [VERIFIED 2026-09-08] foreign
                                            //   affairs cttee. Replaces Hans
                                            //   Wallmark, who left the Riksdag
                                            //   on 2024-08-20 to become
                                            //   ambassador to Denmark.
        'fredrik.ahlstedt@riksdagen.se',    // [VERIFIED 2026-09-08] foreign
                                            //   affairs cttee
      ],
    },
    {
      name: 'Elisabeth Thand Ringqvist',
      party: 'C',
      primary: 'elisabeth.thand.ringqvist@riksdagen.se',
      cc: [
        'niels.paarup-petersen@riksdagen.se', // [VERIFIED 2026-09-08] a HYPHEN, not a dot
        'daniel.backstrom@riksdagen.se',
        'rickard.nordin@riksdagen.se',
        'anders.adahl@riksdagen.se',          // [VERIFIED 2026-09-08] one 'a': Ådahl -> adahl
      ],
    },
    {
      name: 'Nooshi Dadgostar',
      party: 'V',
      primary: 'nooshi.dadgostar@riksdagen.se',
      cc: [
        'lotta.johnsson.fornarve@riksdagen.se',
        'hakan.svenneling@riksdagen.se',
        'ida.gabrielsson@riksdagen.se',
        'samuel.gonzalez.westling@riksdagen.se',
      ],
    },
    {
      // Was Ebba Busch until 2026-09-08, with Jakob Forssmed, Andreas Carlson
      // and Peter Kullgren in the CC. ALL FOUR are government ministers, and a
      // Swedish minister steps back from their seat, so the Riksdag publishes
      // no address for any of them -- this entire entry was built from four
      // guesses and its letters had nowhere to land. Rebuilt from KD's actual
      // members of the utrikesutskottet (foreign affairs committee).
      //
      // Ministers are reached through their ministry's registrator instead --
      // see regeringen.se/kontaktuppgifter.
      name: 'Magnus Berntsson',
      party: 'KD',
      primary: 'magnus.berntsson@riksdagen.se', // [VERIFIED 2026-09-08] KD's
                                                //   full member of the foreign
                                                //   affairs committee
      cc: [
        'mikael.oscarsson@riksdagen.se',  // [VERIFIED 2026-09-08] foreign
                                          //   affairs cttee; was already here
        'gudrun.brunegard@riksdagen.se',  // [VERIFIED 2026-09-08] foreign
                                          //   affairs cttee
        'yusuf.aydin@riksdagen.se',       // [VERIFIED 2026-09-08] foreign
                                          //   affairs cttee
      ],
    },
  ],
};
