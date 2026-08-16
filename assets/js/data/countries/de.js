/**
 * The Germany.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Everything about one country lives in one file: which language its letters
 * are written in, the words filled into those letters, and who to write to.
 *
 * TO ADD A COUNTRY
 *   1. Copy this file and rename it to the country's two-letter code
 *      (de.js for Germany, fr.js for France, be.js for Belgium).
 *   2. Change every value below.
 *   3. Add one line to ../index.js so the site knows the file exists.
 *
 * If the new country speaks a language we already have letters in (Belgium
 * speaks Dutch, Austria speaks German) you do NOT need to write new letters --
 * just set `language` to that language and the existing letters are reused.
 */
export default {
  /** Two-letter country code. Must match the filename and ../index.js. */
  id: 'de',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'Germany',

  /**
   * Which language(s) the letters may be written in, from the files in
   * ../issues/. Countries sharing a language share their letters.
   *
   * Most countries have one. Put more than one only where the country really
   * is bilingual (Canada is ['en', 'fr']) -- the visitor then gets an extra
   * "Letter language" dropdown. The first one listed is the default.
   */
  languages: ['de'],

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] where they appear in the
   * letters.
   *
   * Two languages are needed. The letter is SENT in the country's own
   * language, but the preview box shows supporters an English translation of
   * what they are about to send, so English is needed too.
   *
   * Include whatever article the sentence needs: English says "the
   * Netherlands", Dutch says just "Nederland".
   */
terms: {
  de: { country: 'Deutschland', government: 'die deutsche Regierung' },
  en: { country: 'Germany', government: 'the German government' },
},

  /**
   * Signature used when the visitor leaves the name field empty, so an
   * anonymous letter still says where the writer lives.
   */
anonymousSignature: {
  de: 'Ein iranischer Einwohner in Deutschland',
  en: 'An Iranian resident in Germany',
},

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   /**
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
    de: 'die Botschaft der Islamischen Republik geschlossen, ihre Diplomaten ausgewiesen und das Vermögen des IRGC eingefroren werden',
    en: 'the Islamic Republic embassy must be closed, its diplomats expelled, and IRGC assets frozen',
  },

  'Version 2': {
    de: 'die Botschaft in Berlin schließen, ihre Diplomaten ausweisen und das Vermögen des IRGC einfrieren',
    en: 'close the embassy in Berlin, expel its diplomats, and freeze IRGC assets',
  },

  'Version 3': {
    de: 'die Botschaft der Islamischen Republik in Berlin schließen und das Vermögen des IRGC einfrieren',
    en: 'close the Islamic Republic embassy in Berlin and freeze IRGC assets',
  },

  // A noun phrase: the letter reads "... diplomatische Maßnahmen folgen, darunter [DEMANDS]".
  'Version 4': {
    de: 'die Schließung der Botschaft in Berlin, die Ausweisung ihrer Diplomaten und das Einfrieren von IRGC-Vermögen',
    en: 'closure of the embassy in Berlin, expulsion of its diplomats, and freezing of IRGC assets',
  },

  'Version 5': {
    de: 'die Botschaft geschlossen, ihre Diplomaten ausgewiesen und die finanziellen Mittel des IRGC eingefroren werden',
    en: 'the embassy must be closed, its diplomats expelled, and the IRGC financially crippled through asset freezes',
  },
},

  /**
   * Who the letters can be sent to. Each entry is one option in the
   * "Choose the Politician" dropdown.
   *
   *   name    Written the way the letter should address them, because the
   *           letter opens with "Geachte <name>,".
   *   party   Party abbreviation. Shown as "Name (PARTY)".
   *   primary The main recipient -- goes in the "To" field.
   *   cc      Everyone who gets a copy, in the "CC" field.
   *
   * IMPORTANT: `name` and `party` together form the label saved in the
   * tracker ("Caspar Veldkamp (NSC)"). Renaming an existing politician splits
   * their statistics between the old and new label.
   *
   * Please verify addresses against tweedekamer.nl before adding them.
   * Sending to a wrong address wastes a supporter's effort.
   */
 politicians: [
  {
    name: 'Jens Spahn',
    party: 'CDU/CSU',
    primary: 'jens.spahn@bundestag.de',
    cc: [
      'juergen.hardt@bundestag.de',
      'norbert.roettgen@bundestag.de',
      'alexander.hoffmann@bundestag.de',
    ],
  },
  {
    name: 'Matthias Miersch',
    party: 'SPD',
    primary: 'matthias.miersch@bundestag.de',
    cc: [
      'nils.schmid@bundestag.de',
      'adis.ahmetovic@bundestag.de',
      'siemtje.moeller@bundestag.de',
    ],
  },
  {
    name: 'Alice Weidel',
    party: 'AfD',
    primary: 'alice.weidel@bundestag.de',
    cc: [
      'tino.chrupalla@bundestag.de',
      'markus.frohnmaier@bundestag.de',
      'bernd.baumann@bundestag.de',
    ],
  },
  {
    name: 'Katharina Dröge',
    party: 'Bündnis 90/Die Grünen',
    primary: 'katharina.droege@bundestag.de',
    cc: [
      'deborah.duering@bundestag.de',
      'omid.nouripour@bundestag.de',
      'britta.hasselmann@bundestag.de',
    ],
  },
  {
    name: 'Heidi Reichinnek',
    party: 'Die Linke',
    primary: 'heidi.reichinnek@bundestag.de',
    cc: [
      'soeren.pellmann@bundestag.de',
      'desiree.becker@bundestag.de',
      'janine.wissler@bundestag.de',
    ],
  },
],
};
