/**
 * The Netherlands.
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
  id: 'nl',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'Netherlands',

  /**
   * Which language(s) the letters may be written in, from the files in
   * ../issues/. Countries sharing a language share their letters.
   *
   * Most countries have one. Put more than one only where the country really
   * is bilingual (Canada is ['en', 'fr']) -- the visitor then gets an extra
   * "Letter language" dropdown. The first one listed is the default.
   */
  languages: ['nl'],

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
    nl: { country: 'Nederland', government: 'de Nederlandse regering' },
    en: { country: 'the Netherlands', government: 'the Dutch government' },
  },

  /**
   * Signature used when the visitor leaves the name field empty, so an
   * anonymous letter still says where the writer lives.
   */
  anonymousSignature: {
    nl: 'Een Iraanse inwoner in Nederland',
    en: 'An Iranian resident in the Netherlands',
  },

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   * WHY THIS IS PER COUNTRY: the same demand is not true everywhere. The
   * Islamic Republic still has an embassy in the Netherlands, so demanding its
   * closure is a live demand here. In Canada that embassy closed in 2012, so
   * the same sentence would tell a Canadian MP to do something they already
   * did, and the letter would look uninformed.
   *
   * WHY THIS IS PER VERSION: the five letters word the demand differently on
   * purpose, so they do not read as bulk mail, and the grammar around the
   * placeholder differs. Version 4 says "including [DEMANDS]" and needs a noun
   * phrase; version 1 says "if the executions do not stop, [DEMANDS]" and needs
   * a full sentence. One wording cannot serve both.
   *
   * Read the whole sentence in ../issues/executions.js before changing one of
   * these, so the grammar still fits around it.
   *
   * `default` is used for any version not listed here.
   */
  demands: {
    default: {
      nl: 'de ambassade van de Islamitische Republiek worden gesloten, diplomaten uitgezet en IRGC-tegoeden bevroren',
      en: 'the Islamic Republic embassy must be closed, diplomats expelled, and IRGC assets frozen',
    },
    'Version 2': {
      nl: 'sluit de ambassade, zet diplomaten uit en bevries onmiddellijk alle tegoeden van de IRGC',
      en: 'close the embassy, expel diplomats, and immediately freeze all IRGC assets',
    },
    'Version 3': {
      nl: 'sluit de ambassade van de Islamitische Republiek en bevries alle IRGC-bezittingen',
      en: 'close the Islamic Republic embassy and freeze all IRGC assets',
    },
    // A noun phrase: the letter reads "... maatregelen volgen, waaronder [DEMANDS]".
    'Version 4': {
      nl: 'de sluiting van de ambassade en het bevriezen van IRGC-tegoeden',
      en: 'closure of the embassy and freezing of IRGC assets',
    },
    'Version 5': {
      nl: 'de ambassade worden gesloten en de financiële middelen van de IRGC worden bevroren',
      en: 'the embassy must be closed and the IRGC financially crippled through asset freezes',
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
      name: 'Caspar Veldkamp',
      party: 'NSC',
      primary: 'c.veldkamp@tweedekamer.nl',
      cc: [
        'p.omtzigt@tweedekamer.nl',
        'n.vandenhil@tweedekamer.nl',
        'info@partijnieuwsociaalcontract.nl',
      ],
    },
    {
      name: 'Ruben Brekelmans',
      party: 'VVD',
      primary: 'r.brekelmans@tweedekamer.nl',
      cc: [
        'd.yesilgoz@tweedekamer.nl',
        's.erkens@tweedekamer.nl',
        'info@vvd.nl',
      ],
    },
    {
      name: 'Jan Paternotte',
      party: 'D66',
      primary: 'j.paternotte@tweedekamer.nl',
      cc: [
        's.sjoerdsma@tweedekamer.nl',
        'h.hammelburg@tweedekamer.nl',
        'info@d66.nl',
      ],
    },
    {
      name: 'Jesse Klaver',
      party: 'GL-PvdA',
      primary: 'j.klaver@tweedekamer.nl',
      cc: [
        'k.piri@tweedekamer.nl',
        's.maatoug@tweedekamer.nl',
        'info@groenlinks.nl',
      ],
    },
    {
      name: 'Geert Wilders',
      party: 'PVV',
      primary: 'g.wilders@tweedekamer.nl',
      cc: [
        'm.markuszower@tweedekamer.nl',
        'r.deroon@tweedekamer.nl',
        'pvv.publiek@tweedekamer.nl',
      ],
    },
    {
      name: 'Laurens Dassen',
      party: 'Volt',
      primary: 'l.dassen@tweedekamer.nl',
      cc: [
        'n.koekkoek@tweedekamer.nl',
        's.bamenga@tweedekamer.nl',
        'info@voltnederland.org',
      ],
    },
    {
      name: 'Henri Bontenbal',
      party: 'CDA',
      primary: 'h.bontenbal@tweedekamer.nl',
      cc: [
        'd.boswijk@tweedekamer.nl',
        'p.heerma@tweedekamer.nl',
        'info@cda.nl',
      ],
    },
    {
      name: 'Chris Stoffer',
      party: 'SGP',
      primary: 'c.stoffer@tweedekamer.nl',
      cc: [
        'r.bisschop@tweedekamer.nl',
        'k.vandermolen@tweedekamer.nl',
        'info@sgp.nl',
      ],
    },
    {
      name: 'Mirjam Bikker',
      party: 'ChristenUnie',
      primary: 'm.bikker@tweedekamer.nl',
      cc: [
        'd.ceder@tweedekamer.nl',
        'e.vandergraaf@tweedekamer.nl',
        'info@christenunie.nl',
      ],
    },
    {
      name: 'Esther Ouwehand',
      party: 'PvdD',
      primary: 'esther.ouwehand@tweedekamer.nl',
      cc: [
        'c.teunissen@tweedekamer.nl',
        'f.wassenberg@tweedekamer.nl',
        'info@partijvdedieren.nl',
      ],
    },
    {
      name: 'Joost Eerdmans',
      party: 'JA21',
      // Registered in the Tweede Kamer under his formal initial (B.), not "J.".
      primary: 'b.eerdmans@tweedekamer.nl',
      cc: [
        's.pouw-verweij@tweedekamer.nl',
        'j.eppink@tweedekamer.nl',
        'info@ja21.nl',
      ],
    },
    {
      name: 'Jimmy Dijk',
      party: 'SP',
      primary: 'j.dijk@tweedekamer.nl',
      cc: [
        'j.jaspervandijk@tweedekamer.nl',
        's.beckerman@tweedekamer.nl',
        'info@sp.nl',
      ],
    },
    {
      name: 'Lidewij de Vos',
      party: 'FVD',
      primary: 'l.dvos@tweedekamer.nl',
      cc: [
        't.baudet@tweedekamer.nl',
        'p.vanmeijeren@tweedekamer.nl',
        'partij@fvd.nl',
      ],
    },
  ],
};
