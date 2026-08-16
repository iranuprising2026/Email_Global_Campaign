/**
 * The "Stop Daily Executions" letters.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Every version has a subject line and a body, written once per LANGUAGE:
 *
 *   subject.nl / body.nl   Dutch   -- sent by visitors in the Netherlands
 *                                     and Belgium
 *   subject.en / body.en   English -- shown in the preview box so supporters
 *                                     can read what they are about to send,
 *                                     AND sent by visitors in English-speaking
 *                                     countries
 *
 * When you change a text, change every other language of that same text too.
 * The whole point of the preview box is that supporters are never asked to
 * send words they cannot read. Letting the languages drift apart is the worst
 * bug this project can have.
 *
 * TO ADD A LANGUAGE: add a line to `subject` and to `body` in every version
 * below, using the two-letter language code (de: for German, fr: for French).
 * Then any country whose `language` is set to that code can use these letters.
 *
 * PLACEHOLDERS -- filled in automatically, keep them exactly as written:
 *
 *   [NAME]        the politician's name
 *   [USER]        the visitor's name, or the country's anonymous signature
 *   [CITY]        the visitor's city (the line is removed if left blank)
 *   [COUNTRY]     the country's name, e.g. "Nederland", "the Netherlands"
 *   [GOVERNMENT]  e.g. "de Nederlandse regering", "the Dutch government"
 *   [DEMANDS]     the measures this letter asks for, which differ per country
 *
 * All four come from the country file in ../countries/, so the same letter
 * works for every country that speaks this language. They are capitalised
 * automatically when they start a sentence, so English gives "The Netherlands
 * must..." mid-text but "the Netherlands" after a comma.
 *
 * ⚠️ [DEMANDS] IS THE ONE TO BE CAREFUL WITH. Never write the measures into the
 * letter directly. What to demand is not the same everywhere: the Islamic
 * Republic still has an embassy in the Netherlands and in London, but Canada
 * closed its one in 2012, so a letter telling a Canadian MP to close it asks
 * for something already done. Each country supplies its own wording under
 * `demands`, one per version, and the words either side of the placeholder have
 * to fit that wording grammatically -- so if you change the sentence around
 * [DEMANDS], re-read every country's version of it.
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
export default {
  /** Must match the filename and the entry in ../index.js. */
  id: 'executions',

  /** Heading shown above the form, and the label in the "Issue" dropdown. */
  title: 'Stop Daily Executions Campaign',

  /** Texts updated by IranUprising2026 on August 16 2026 */
versions: [
  {
    id: 'Version 1',
    subject: {
      nl: 'URGENT: Ultimatum vereist om staatsslachting in Iran te stoppen',
      en: 'URGENT: Ultimatum required to stop the state-led slaughter in Iran',
    },
    body: {
      nl: 'Geachte [NAME],\n\nDe Islamitische Republiek zet haar executiecampagne tegen Iraanse demonstranten voort. Na de executies van onder anderen Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23) en Mehdi Khanaki (26), werden op 28 juli Abolfazl Sepahi Badjani en Amirhossein Safari Hosseinabadi publiekelijk geëxecuteerd in Isfahan. Ondanks dat mensen zich hadden verzameld om de executies te stoppen, werden zij door veiligheidstroepen uiteengedreven. Een derde veroordeelde, Alireza Sepahi, kreeg naar verluidt een hartaanval tijdens zijn overbrenging naar de executieplaats.\n\nTientallen andere demonstranten blijven ter dood veroordeeld. Vrijblijvende diplomatie werkt niet. Wij eisen dat u [GOVERNMENT] oproept tot een direct ultimatum: stop de executies onmiddellijk, anders moeten [DEMANDS].\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
      en: 'Dear [NAME],\n\nThe Islamic Republic continues its execution campaign against Iranian protesters. Following the executions of, among others, Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23), and Mehdi Khanaki (26), Abolfazl Sepahi Badjani and Amirhossein Safari Hosseinabadi were publicly executed in Isfahan on July 28. Despite people gathering in an attempt to stop the executions, they were dispersed by security forces. A third defendant, Alireza Sepahi, reportedly suffered a heart attack while being transferred to the execution site.\n\nDozens of other protesters remain sentenced to death. Vague diplomacy is not enough. We demand that you urge [GOVERNMENT] to issue an immediate ultimatum: stop the executions immediately, or [DEMANDS].\n\nKind regards,\n[USER]\n[CITY]',
    },
  },
  {
    id: 'Version 2',
    subject: {
      nl: 'Stop de executies in Iran: Sluit de ambassade en bevries IRGC-tegoeden',
      en: 'Stop the executions in Iran: Close the embassy and freeze IRGC assets',
    },
    body: {
      nl: 'Geachte [NAME],\n\nDe executies van Iraanse demonstranten gaan door. Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23) en Mehdi Khanaki (26) behoren tot de slachtoffers van deze executiecampagne. Op 28 juli werden Abolfazl Sepahi Badjani en Amirhossein Safari Hosseinabadi publiekelijk opgehangen in Isfahan, terwijl burgers zich hadden verzameld om te proberen de executies tegen te houden. Een andere ter dood veroordeelde, Alireza Sepahi, kreeg naar verluidt een hartaanval tijdens zijn overbrenging naar de executieplaats.\n\nTientallen anderen lopen nog steeds het risico te worden geëxecuteerd. Wij accepteren geen woorden meer. [COUNTRY] moet een duidelijk ultimatum stellen: beëindig de executies nu, of [DEMANDS].\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
      en: 'Dear [NAME],\n\nThe executions of Iranian protesters continue. Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23), and Mehdi Khanaki (26) are among the victims of this execution campaign. On July 28, Abolfazl Sepahi Badjani and Amirhossein Safari Hosseinabadi were publicly hanged in Isfahan while civilians had gathered in an attempt to stop the executions. Another condemned prisoner, Alireza Sepahi, reportedly suffered a heart attack while being transferred to the execution site.\n\nDozens of others remain at risk of execution. We no longer accept empty words. [COUNTRY] must issue a clear ultimatum: end the executions now, or [DEMANDS].\n\nKind regards,\n[USER]\n[CITY]',
    },
  },
  {
    id: 'Version 3',
    subject: {
      nl: 'Actie vereist: Beëindig de psychologische oorlog en executies in Iran',
      en: 'Action required: End the psychological war and executions in Iran',
    },
    body: {
      nl: 'Geachte [NAME],\n\nDe executies in Iran zijn een instrument van terreur tegen demonstranten geworden. Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23) en Mehdi Khanaki (26) zijn geëxecuteerd, gevolgd door de openbare executies van Abolfazl Sepahi Badjani en Amirhossein Safari Hosseinabadi in Isfahan op 28 juli. Mensen die zich daar hadden verzameld om hun dood te voorkomen, werden door veiligheidstroepen uiteengedreven. Alireza Sepahi, die eveneens ter dood was veroordeeld, kreeg naar verluidt een hartaanval tijdens zijn overbrenging.\n\nTientallen anderen wachten nog op hun executie. [COUNTRY] moet een grens trekken. Wij eisen concrete actie: stop de executies onmiddellijk, [DEMANDS].\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
      en: 'Dear [NAME],\n\nExecutions in Iran have become an instrument of terror against protesters. Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23), and Mehdi Khanaki (26) were executed, followed by the public executions of Abolfazl Sepahi Badjani and Amirhossein Safari Hosseinabadi in Isfahan on July 28. People who gathered there in an attempt to prevent their deaths were dispersed by security forces. Alireza Sepahi, who was also sentenced to death, reportedly suffered a heart attack while being transferred.\n\nDozens of others still await execution. [COUNTRY] must draw a line. We demand concrete action: stop the executions immediately, [DEMANDS].\n\nKind regards,\n[USER]\n[CITY]',
    },
  },
  {
    id: 'Version 4',
    subject: {
      nl: 'Ultimatum voor de Islamitische Republiek: Stop de moorden of vertrek',
      en: 'Ultimatum for the Islamic Republic: Stop the killings or face departure',
    },
    body: {
      nl: 'Geachte [NAME],\n\nDe Islamitische Republiek gebruikt de doodstraf opnieuw als middel om verzet in Iran te onderdrukken. De executies van Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23) en Mehdi Khanaki (26) werden gevolgd door de openbare executie van Abolfazl Sepahi Badjani en Amirhossein Safari Hosseinabadi in Isfahan. Zelfs de mensen die zich bij de executieplaats verzamelden om hen te beschermen, werden door veiligheidstroepen uiteengedreven. Een derde veroordeelde, Alireza Sepahi, kreeg naar verluidt een hartaanval voordat zijn executie kon plaatsvinden.\n\nTientallen andere demonstranten blijven ter dood veroordeeld. Stel een krachtig ultimatum: de executies moeten stoppen, anders moeten diplomatieke maatregelen volgen, waaronder [DEMANDS].\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
      en: 'Dear [NAME],\n\nThe Islamic Republic is once again using the death penalty to suppress dissent in Iran. The executions of Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23), and Mehdi Khanaki (26) were followed by the public executions of Abolfazl Sepahi Badjani and Amirhossein Safari Hosseinabadi in Isfahan. Even people who gathered at the execution site to protect them were dispersed by security forces. A third condemned prisoner, Alireza Sepahi, reportedly suffered a heart attack before his execution could take place.\n\nDozens of other protesters remain sentenced to death. Set a firm ultimatum: the executions must stop, or diplomatic measures must follow, including [DEMANDS].\n\nKind regards,\n[USER]\n[CITY]',
    },
  },
  {
    id: 'Version 5',
    subject: {
      nl: 'Executiecrisis: Eis voor onmiddellijke sluiting van de Iraanse ambassade',
      en: 'Execution Crisis: Demand for immediate closure of the Iranian embassy',
    },
    body: {
      nl: 'Geachte [NAME],\n\nDe omvang van de executiecrisis in Iran blijft toenemen. Onder de reeds geëxecuteerde demonstranten bevinden zich Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23) en Mehdi Khanaki (26). Op 28 juli werden vervolgens Abolfazl Sepahi Badjani en Amirhossein Safari Hosseinabadi publiekelijk geëxecuteerd in Isfahan, terwijl een menigte zich had verzameld om tegen hun executies te protesteren. Alireza Sepahi, die eveneens ter dood was veroordeeld, kreeg naar verluidt een hartaanval tijdens zijn overbrenging naar de executieplaats.\n\nTientallen anderen verkeren nog steeds in levensgevaar. Wij vragen u om namens [COUNTRY] een duidelijk ultimatum te eisen. Als deze executies doorgaan, moeten [DEMANDS].\n\nMet vriendelijke groet,\n[USER]\n[CITY]',
      en: 'Dear [NAME],\n\nThe execution crisis in Iran continues to escalate. Among the protesters already executed are Erfan Esfandiari (18), Gol-Mohammad Mohammadi (23), and Mehdi Khanaki (26). On July 28, Abolfazl Sepahi Badjani and Amirhossein Safari Hosseinabadi were then publicly executed in Isfahan while a crowd had gathered to protest and try to prevent their executions. Alireza Sepahi, who had also been sentenced to death, reportedly suffered a heart attack while being transferred to the execution site.\n\nDozens of others remain in danger of execution. We ask you to demand a clear ultimatum on behalf of [COUNTRY]. If these executions continue, [DEMANDS].\n\nKind regards,\n[USER]\n[CITY]',
    },
  },
],
};
