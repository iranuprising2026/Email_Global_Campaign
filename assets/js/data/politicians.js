/**
 * The politicians visitors can write to.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Each entry is one option in the dropdown. Copy an existing block, change the
 * values, and keep the punctuation exactly as it is (commas, quotes, brackets).
 *
 *   name    Politician's name, as shown in the dropdown and used to open the
 *           email with "Geachte <name>," -- so write it the way you want the
 *           email to address them.
 *   party   Party abbreviation. Shown in the dropdown as "Name (PARTY)".
 *   primary The main recipient. This address goes in the "To" field.
 *   cc      Everyone else who should receive a copy, in the "CC" field.
 *           Usually two colleagues plus the party's general inbox.
 *
 * IMPORTANT: `name` and `party` together form the label saved in the tracker
 * ("Caspar Veldkamp (NSC)"). If you rename an existing politician, their old
 * statistics will appear under the old label and the new one separately.
 *
 * Please verify addresses against tweedekamer.nl before adding them. Sending to
 * a wrong or outdated address wastes a supporter's effort.
 */

export const politicians = [
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
];

/**
 * The label shown in the dropdown and stored in the tracker, e.g.
 * "Caspar Veldkamp (NSC)".
 */
export function politicianLabel(politician) {
  return `${politician.name} (${politician.party})`;
}

/** Look a politician up by their dropdown label. */
export function findPoliticianByLabel(label) {
  return politicians.find((p) => politicianLabel(p) === label);
}
