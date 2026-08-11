/**
 * The email texts.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Every version has four texts that belong together:
 *
 *   subject.nl   The Dutch subject line -- this is what gets sent.
 *   subject.en   English translation, shown to the visitor so they can read
 *                what they are about to send.
 *   body.nl      The Dutch email -- this is what gets sent.
 *   body.en      English translation of that same email.
 *
 * When you change a Dutch text, change its English translation too. The whole
 * point of the preview box is that supporters are never asked to send something
 * they cannot read.
 *
 * PLACEHOLDERS -- these are filled in automatically, keep them exactly as-is:
 *
 *   [NAME]   becomes the politician's name
 *   [USER]   becomes the visitor's name (or "An Iranian resident in the
 *            Netherlands" if they leave it blank)
 *   [CITY]   becomes the visitor's city (removed if they leave it blank)
 *
 * `\n` means "start a new line". `\n\n` leaves a blank line between paragraphs.
 *
 * WHY FIVE VERSIONS: parliamentary inboxes filter and de-prioritise identical
 * bulk mail. Varied wording means each message reads as a real constituent
 * writing, not a form letter, so more of them actually get read.
 *
 * The `id` values ("Version 1" ...) are stored in the tracker. Renaming one
 * splits its statistics, so prefer editing a version's text over renaming it.
 */

export const campaigns = {
  executions: {
    id: 'executions',
    /** Heading shown above the form. */
    title: 'Stop Daily Executions Campaign',

    versions: [
      {
        id: 'Version 1',
        subject: {
          nl: 'URGENT: Ultimatum vereist om staatsslachting in Iran te stoppen',
          en: 'URGENT: Ultimatum required to stop the state-led slaughter in Iran',
        },
        body: {
          nl: 'Geachte [NAME],\n\nMet de start van de nieuwe militaire operatie heeft het regime in Iran opnieuw een golf van executies gelanceerd. De meest recente slachtoffers zijn de 18-jarige Erfan Esfandiari, de 23-jarige van Afghaanse afkomst Gol-Mohammad Mohammadi en de 26-jarige Mehdi Khanaki. Tientallen anderen zijn door schijnprocessen en zogenaamde rechtbanken zonder eerlijk proces ter dood veroordeeld.\n\nVrijblijvende diplomatie werkt niet. Wij eisen dat u de Nederlandse regering oproept tot een direct ultimatum: stop de executies onmiddellijk, anders moeten de ambassade van de Islamitische Republiek worden gesloten, diplomaten uitgezet en IRGC-tegoeden bevroren.\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
          en: 'Dear [NAME],\n\nWith the start of the new military operation, the regime in Iran has once again launched a wave of executions. The latest victims include 18-year-old Erfan Esfandiari, 23-year-old Gol-Mohammad Mohammadi of Afghan descent, and 26-year-old Mehdi Khanaki. Dozens more people are being sentenced to death by kangaroo courts without fair trials.\n\nVague diplomacy is not enough. We urge you to demand an immediate ultimatum from the Dutch government: if the executions do not stop, the Islamic Republic embassy must be closed, diplomats expelled, and IRGC assets frozen.\n\nKind regards,\n[USER]\n[CITY]',
        },
      },
      {
        id: 'Version 2',
        subject: {
          nl: 'Stop de executies in Iran: Sluit de ambassade en bevries IRGC-tegoeden',
          en: 'Stop the executions in Iran: Close the embassy and freeze IRGC assets',
        },
        body: {
          nl: 'Geachte [NAME],\n\nNa de start van de nieuwe militaire operatie heeft de Islamitische Republiek haar executiemachine opnieuw geactiveerd. Jonge Iraniërs zoals de 18-jarige Erfan Esfandiari, de 23-jarige Gol-Mohammad Mohammadi en de 26-jarige Mehdi Khanaki zijn geëxecuteerd. Ondertussen worden tientallen anderen in kangaroo-rechtbanken zonder eerlijk proces ter dood veroordeeld.\n\nWij accepteren geen woorden meer. Nederland moet een duidelijk ultimatum stellen: beëindig de executies nu, of sluit de ambassade, zet diplomaten uit en bevries onmiddellijk alle tegoeden van de IRGC.\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
          en: 'Dear [NAME],\n\nFollowing the beginning of the new military operation, the Islamic Republic has restarted its execution campaign. Young Iranians including 18-year-old Erfan Esfandiari, 23-year-old Gol-Mohammad Mohammadi, and 26-year-old Mehdi Khanaki have been executed. Meanwhile, dozens more are being sentenced to death in kangaroo courts without fair trials.\n\nWe no longer accept empty words. The Netherlands must issue a clear ultimatum: stop the executions now, or close the embassy, expel diplomats, and immediately freeze all IRGC assets.\n\nKind regards,\n[USER]\n[CITY]',
        },
      },
      {
        id: 'Version 3',
        subject: {
          nl: 'Actie vereist: Beëindig de psychologische oorlog en executies in Iran',
          en: 'Action required: End the psychological war and executions in Iran',
        },
        body: {
          nl: 'Geachte [NAME],\n\nDe nieuwe militaire operatie van het regime in Iran heeft opnieuw geleid tot een golf van executies en doodvonnissen. De recente executies van Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23, van Afghaanse afkomst) en Mehdi Khanaki (26) tonen aan dat het regime doorgaat met het vermoorden van jonge mensen. Tientallen anderen wachten op de doodstraf na processen zonder enige vorm van rechtspraak.\n\nNederland moet een grens trekken. Wij eisen concrete actie: stop de executies onmiddellijk, sluit anders de ambassade van de Islamitische Republiek en bevries alle IRGC-bezittingen.\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
          en: 'Dear [NAME],\n\nThe regime’s new military operation has been followed by another wave of executions and death sentences in Iran. The recent executions of Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23, of Afghan descent), and Mehdi Khanaki (26) demonstrate that the regime continues to kill young people. Dozens more face execution after sham trials with no due process.\n\nThe Netherlands must draw a line. We demand immediate action: stop the executions, or close the Islamic Republic embassy and freeze all IRGC assets.\n\nKind regards,\n[USER]\n[CITY]',
        },
      },
      {
        id: 'Version 4',
        subject: {
          nl: 'Ultimatum voor de Islamitische Republiek: Stop de moorden of vertrek',
          en: 'Ultimatum for the Islamic Republic: Stop the killings or face departure',
        },
        body: {
          nl: 'Geachte [NAME],\n\nHet Iraanse regime gebruikt executies opnieuw als wapen van terreur na de start van zijn nieuwe militaire operatie. De executies van de 18-jarige Erfan Esfandiari, de 23-jarige Gol-Mohammad Mohammadi en de 26-jarige Mehdi Khanaki zijn slechts de meest recente voorbeelden. Tientallen mensen worden door schijnrechtbanken zonder eerlijk proces naar de dood gestuurd.\n\nStel een krachtig ultimatum: de executies moeten stoppen, anders moeten diplomatieke maatregelen volgen, waaronder de sluiting van de ambassade en het bevriezen van IRGC-tegoeden.\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
          en: 'Dear [NAME],\n\nThe Iranian regime is once again using executions as a weapon of terror following the launch of its new military operation. The executions of 18-year-old Erfan Esfandiari, 23-year-old Gol-Mohammad Mohammadi, and 26-year-old Mehdi Khanaki are only the latest examples. Dozens of others are being sent to their deaths through sham courts without fair trials.\n\nSet a firm ultimatum: the executions must stop, or diplomatic measures must follow, including closure of the embassy and freezing of IRGC assets.\n\nKind regards,\n[USER]\n[CITY]',
        },
      },
      {
        id: 'Version 5',
        subject: {
          nl: 'Executiecrisis: Eis voor onmiddellijke sluiting van de Iraanse ambassade',
          en: 'Execution Crisis: Demand for immediate closure of the Iranian embassy',
        },
        body: {
          nl: 'Geachte [NAME],\n\nTerwijl de wereld toekijkt, hervat de Islamitische Republiek haar campagne van executies na de start van de nieuwe militaire operatie. Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23) en Mehdi Khanaki (26) behoren tot de nieuwste slachtoffers. Daarnaast worden tientallen anderen ter dood veroordeeld door rechtbanken die geen echte rechtsgang bieden.\n\nWij vragen u om namens Nederland een duidelijk ultimatum te eisen. Als deze executies doorgaan, moeten de ambassade worden gesloten en de financiële middelen van de IRGC worden bevroren.\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
          en: 'Dear [NAME],\n\nWhile the world watches, the Islamic Republic has resumed its campaign of executions after launching its new military operation. Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23), and Mehdi Khanaki (26) are among the latest victims. At the same time, dozens more are being sentenced to death by courts that provide no genuine justice.\n\nWe ask you to demand a clear ultimatum on behalf of the Netherlands. If these executions continue, the embassy must be closed and the IRGC financially crippled through asset freezes.\n\nKind regards,\n[USER]\n[CITY]',
        },
      },
    ],
  },
};

/** Fetch a campaign by id, failing loudly if it is missing or misspelled. */
export function getCampaign(id) {
  const campaign = campaigns[id];
  if (!campaign) {
    throw new Error(
      `Unknown campaign "${id}". Check ACTIVE_CAMPAIGN_ID in assets/js/config.js ` +
        `against the campaign ids in assets/js/data/campaign.js.`
    );
  }
  return campaign;
}
