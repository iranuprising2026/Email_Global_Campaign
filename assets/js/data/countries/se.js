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
      name: 'Ulf Kristersson',
      party: 'M',
      primary: 'ulf.kristersson@riksdagen.se',
      cc: [
        'karin.enstrom@riksdagen.se',
        'mattias.j.karlsson@riksdagen.se',
        'hans.wallmark@riksdagen.se',
        'margareta.cederfelt@riksdagen.se',
      ],
    },
    {
      name: 'Elisabeth Thand Ringqvist',
      party: 'C',
      primary: 'elisabeth.thand.ringqvist@riksdagen.se',
      cc: [
        'niels.paarup.petersen@riksdagen.se',
        'daniel.backstrom@riksdagen.se',
        'rickard.nordin@riksdagen.se',
        'anders.aadahl@riksdagen.se',
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
      name: 'Ebba Busch',
      party: 'KD',
      primary: 'ebba.busch@riksdagen.se',
      cc: [
        'mikael.oscarsson@riksdagen.se',
        'andreas.carlson@riksdagen.se',
        'jakob.forssmed@riksdagen.se',
        'peter.kullgren@riksdagen.se',
      ],
    },
  ],
};
