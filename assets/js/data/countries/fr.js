/**
 * France.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Everything about one country lives in one file: which language its letters
 * are written in, the words filled into those letters, and who to write to.
 *
 * TO ADD A COUNTRY
 *   1. Copy this file and rename it to the country's two-letter code.
 *   2. Change every value below.
 *   3. Add one line to ../index.js so the site knows the file exists.
 *
 * If the new country speaks a language we already have letters in, you do NOT
 * need to write new letters -- just set `languages` to that language and the
 * existing letters are reused.
 */
export default {
  /** Two-letter country code. Must match the filename and ../index.js. */
  id: 'fr',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'France',

  /**
   * Which language(s) the letters may be written in, from the files in
   * ../issues/.
   *
   * France uses French letters here. English is also included because the
   * application uses English as the translation language in the preview.
   */
  languages: ['fr'],

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] where they appear in the
   * letters.
   *
   * The French wording is used in the actual letter. English is used for the
   * English translation shown in the preview.
   */
  terms: {
    fr: {
      country: 'la France',
      government: 'le gouvernement français',
    },
    en: {
      country: 'France',
      government: 'the French government',
    },
  },

  /**
   * Signature used when the visitor leaves the name field empty, so an
   * anonymous letter still says where the writer lives.
   */
  anonymousSignature: {
    fr: 'Un résident iranien en France',
    en: 'An Iranian resident in France',
  },

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   * WHY THIS IS PER COUNTRY:
   * The same diplomatic demands are not necessarily appropriate everywhere.
   * France's diplomatic relationship with the Islamic Republic has its own
   * circumstances, so these demands should be checked specifically for France.
   *
   * WHY THIS IS PER VERSION:
   * The five letters word the demand differently on purpose, and the grammar
   * around [DEMANDS] differs between versions.
   *
   * Read the whole sentence in ../issues/executions.js before changing these,
   * so the grammar still fits around the placeholder.
   *
   * `default` is used for any version not listed here.
   */
  demands: {
    default: {
      fr: "fermer l'ambassade de la République islamique, expulser ses diplomates et appliquer l'interdiction du CGRI par des arrestations et des saisies d'avoirs",
      en: 'the Islamic Republic embassy must be closed, its diplomats expelled, and IRGC assets frozen',
    },

    'Version 2': {
      fr: "fermer l'ambassade à Paris, expulser ses diplomates et saisir les avoirs du CGRI",
      en: 'close the embassy in Paris, expel its diplomats, and seize IRGC assets',
    },

    'Version 3': {
      fr: "fermer l'ambassade de la République islamique à Paris et saisir les avoirs du CGRI",
      en: 'close the Islamic Republic embassy in Paris and seize IRGC assets',
    },

    // A noun phrase: the letter reads "... mesures diplomatiques doivent
    // suivre, notamment [DEMANDS]".
    'Version 4': {
      fr: "la fermeture de l'ambassade à Paris, l'expulsion de ses diplomates et la saisie des avoirs du CGRI",
      en: 'closure of the embassy in Paris, expulsion of its diplomats, and seizure of IRGC assets',
    },

    'Version 5': {
      fr: "l'ambassade doit être fermée, ses diplomates expulsés et les réseaux financiers du CGRI démantelés par des arrestations et des saisies d'avoirs",
      en: 'the embassy must be closed, its diplomats expelled, and IRGC financial networks dismantled through arrests and asset seizures',
    },
  },

  /**
   * Who the letters can be sent to. Each entry is one option in the
   * "Choose the Politician" dropdown.
   *
   * We are leaving this empty for now. France will therefore remain
   * "Coming soon" until we populate the list with verified recipients.
   *
   *   name    The name shown in the politician dropdown.
   *   party   Party abbreviation.
   *   primary The main recipient -- goes in the "To" field.
   *   cc      Everyone who gets a copy, in the "CC" field.
   *
   * IMPORTANT: Verify every address against the French Parliament's official
   * member pages before adding it.
   */
   politicians: [
    {
      name: 'Marine Le Pen',
      party: 'RN',
      primary: 'marine.lepen@assemblee-nationale.fr',
      cc: [
        'jean-philippe.tanguy@assemblee-nationale.fr',
        'alexandre.loubet@assemblee-nationale.fr',
        'thomas.menage@assemblee-nationale.fr',
      ],
    },
    {
      name: 'Gabriel Attal',
      party: 'EPR',
      primary: 'gabriel.attal@assemblee-nationale.fr',
      cc: [
        'pieyre-alexandre.anglade@assemblee-nationale.fr',
        'thomas.gassilloud@assemblee-nationale.fr',
        'constance.legrip@assemblee-nationale.fr',
      ],
    },
    {
      name: 'Mathilde Panot',
      party: 'LFI-NFP',
      primary: 'mathilde.panot@assemblee-nationale.fr',
      cc: [
        'clemence.guette@assemblee-nationale.fr',
        'manuel.bompard@assemblee-nationale.fr',
        'hadrien.clouet@assemblee-nationale.fr',
      ],
    },
    {
      name: 'Olivier Faure',
      party: 'PS',
      primary: 'olivier.faure@assemblee-nationale.fr',
      cc: [
        'boris.vallaud@assemblee-nationale.fr',
        'alain.david@assemblee-nationale.fr',
        'jerome.guedj@assemblee-nationale.fr',
      ],
    },
    {
      name: 'Laurent Wauquiez',
      party: 'DR',
      primary: 'laurent.wauquiez@assemblee-nationale.fr',
      cc: [
        'michel.herbillon@assemblee-nationale.fr',
        'constance.legrip@assemblee-nationale.fr',
        'philippe.gosselin@assemblee-nationale.fr',
      ],
    },
    {
      name: 'Cyrielle Chatelain',
      party: 'E&S',
      primary: 'cyrielle.chatelain@assemblee-nationale.fr',
      cc: [
        'sabrina.sebaihi@assemblee-nationale.fr',
        'nicolas.thierry@assemblee-nationale.fr',
        'dominique.voynet@assemblee-nationale.fr',
      ],
    },
    {
      name: 'Laurent Marcangeli',
      party: 'Horizons',
      primary: 'laurent.marcangeli@assemblee-nationale.fr',
      cc: [
        'laetitia.saint-paul@assemblee-nationale.fr',
        'frederic.valletoux@assemblee-nationale.fr',
        'philippe.pradal@assemblee-nationale.fr',
      ],
    },
  ],
};
