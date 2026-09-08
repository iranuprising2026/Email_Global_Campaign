/**
 * The European Parliament.
 *
 * This one is not a country, and that is deliberate. It sits in the same
 * "Country" dropdown as the Netherlands and Canada because it works the same
 * way -- pick who to write to, pick a letter, send it yourself -- but the
 * people here are MEPs, elected across all 27 member states, and the thing in
 * the "party" slot is their POLITICAL GROUP, not a national party.
 *
 * The seven groups below are the Parliament's own groupings. An MEP from
 * Ireland and one from Poland can sit in the same group, so a supporter
 * anywhere in the EU can write to any of these seven.
 *
 * WHY THESE MEPs AND NOT OTHERS
 * -----------------------------
 * Every MEP in this file has personally put their name to an Iran resolution in
 * the current Parliament (2024-2029). That is a documented act, not a guess
 * about sympathies, and the comment next to each name says which document.
 *
 * Most come from the joint motion of 22 January 2026 on the brutal repression
 * against protesters in Iran (document RC-B10-0071/2026, adopted 562 votes to
 * 9 with 57 abstentions). That document is useful because it lists the MEPs who
 * tabled it GROUP BY GROUP -- so it names, in the Parliament's own words, each
 * group's Iran people. The Patriots for Europe group did not sign that joint
 * motion; they tabled their own Iran motion instead (B10-0117/2026, February
 * 2026), so their names come from there.
 *
 * We deliberately did NOT take names from press coverage of the April 2026
 * Iran conference in the Parliament. That reporting comes from outlets aligned
 * with the NCRI/MEK, which is a contested position among Iranians, and two of
 * the people it described as speaking are not MEPs at all -- Guy Verhofstadt
 * left the Parliament in 2024 and Herta Daubler-Gmelin was never an MEP.
 * Resolutions the Parliament itself published are a safer source.
 *
 * WHERE THE ADDRESSES CAME FROM
 * -----------------------------
 * All 31 were read from the European Parliament's own open-data register
 * (data.europarl.europa.eu, the "hasEmail" field) AND checked a second time
 * against each MEP's public profile page at europarl.europa.eu/meps/en/<id>.
 * Both sources agreed on all 31. The number after each name is that MEP's id,
 * so you can go straight to their page and check for yourself -- three of them
 * were spot-checked by hand that way on 2026-09-08 (Neumann, Maniatis,
 * Al-Sahlani) and all three matched.
 *
 * DO NOT GUESS AN EP ADDRESS. There is no reliable pattern, and this file is
 * full of proof:
 *   - ioannis.maniatis@  -- he is listed everywhere as YANNIS Maniatis
 *   - abir.alsahlani@    -- the hyphen in Al-Sahlani is dropped
 *   - marie-agnes.strack-zimmermann@ -- but here the hyphens are kept
 *   - d.montserrat@      -- an initial, not "dolors"
 *   - isabel.wiseler@    -- the second half of Wiseler-Lima is dropped
 *   - antonio.lopezisturiz@, hana.jalloulmuro@, jorge.martinfrias@
 *   - moritz.koerner@    -- the umlaut becomes "oe"
 * A guessed address does not warn anybody. It just quietly never arrives.
 *
 * HOW TO EDIT THIS FILE
 * ---------------------
 * Everything about one entry in the Country dropdown lives in one file: which
 * language its letters are written in, the words filled into those letters, and
 * who to write to.
 *
 * The letters themselves are NOT here -- they are shared and live in
 * ../issues/. This entry writes in English, so it reuses the English letters
 * that already exist. Nothing new has to be written.
 *
 * TO ADD AN MEP: find them at europarl.europa.eu/meps/en/full-list, open their
 * page, copy the address exactly as shown, and add a comment saying which Iran
 * document they signed. If you cannot point to a document, think twice about
 * adding them -- that is the whole standard this file is built on.
 */
export default {
  /**
   * Code used in the URL (?country=eu) and in ../index.js.
   *
   * "eu" is not a country code in the way "nl" is, but the site only needs it
   * to be short, unique and stable. Do not change it: the Live Action Tracker
   * stores it, so renaming it would split this entry's history in two.
   */
  id: 'eu',

  /** Shown in the "Country" dropdown at the top of the page. */
  name: 'European Parliament',

  /**
   * Which language(s) the letters may be written in.
   *
   * English only. The Parliament works in all 24 EU languages, so this could
   * grow -- and unusually for this project, the letters already exist in
   * twelve languages, so adding them here costs nothing but a decision.
   * English was chosen because it is a working language of the Parliament and
   * every MEP's office handles it.
   *
   * If you ever add more, note that a language is only offered when ALL FIVE
   * letters exist in it, and that 'fi' (Finnish) is missing from
   * LANGUAGE_NAMES in ../index.js -- it would show up as the bare code "fi"
   * in the dropdown until somebody adds the name there.
   */
  languages: ['en'],

  /**
   * The words put into [COUNTRY] and [GOVERNMENT] where they appear in the
   * letters.
   *
   * Both say "the European Union" rather than "the European Parliament", and
   * that is on purpose. The letters ask the reader to press for an ultimatum,
   * and it is the EU -- through its Council -- that would issue one. So
   * Version 1 reads "we demand that you urge the European Union to issue an
   * immediate ultimatum", which is exactly what an MEP can do.
   *
   * The letters are sent in English and the preview also shows English, so
   * both keys hold the same words. An entry writing in its own language needs
   * two different sets -- see nl.js.
   */
  terms: {
    en: { country: 'the European Union', government: 'the European Union' },
  },

  /**
   * Signature used when the visitor leaves the name field empty, so an
   * anonymous letter still says where the writer lives.
   */
  anonymousSignature: {
    en: 'An Iranian resident in the European Union',
  },

  /**
   * Subject lines that replace the shared ones, where the shared one is wrong.
   *
   * ⚠️ Two of the five letters carry a subject line about closing the Islamic
   * Republic embassy -- Version 2 ("Close the embassy and freeze IRGC assets")
   * and Version 5 ("Demand for immediate closure of the Iranian embassy").
   * There is no EU embassy to close, and an MEP could not close one anyway.
   * The letter bodies already ask for the right thing through `demands` below;
   * these two subject lines had to be replaced to match, because otherwise the
   * subject contradicted the letter under it.
   *
   * Versions 1, 3 and 4 never mention the embassy, so they are not listed here
   * and keep the shared subject. Anything left out falls back that way.
   */
  subjectOverrides: {
    'Version 2': {
      en: 'Stop the executions in Iran: Put the IRGC on the EU terrorist list',
    },
    'Version 5': {
      en: 'Execution Crisis: Designate the IRGC and sanction those responsible',
    },
  },

  /**
   * The measures the letters demand -- what goes where [DEMANDS] appears.
   *
   * ⚠️ THIS IS NOT A NATIONAL DEMAND, and that is why this field exists. An
   * MEP cannot close an embassy or freeze assets; the Parliament passes
   * resolutions and then presses the Council, which decides. So the demand
   * here is the one the Parliament has already voted for repeatedly and the
   * Council has still not delivered: putting the IRGC on the EU terrorist
   * list. Asking an MEP to do it themselves would ask for the impossible;
   * asking them to force the Council's hand is the real lever.
   *
   * The wording follows paragraph 5 of the 22 January 2026 resolution, which
   * calls on the Council "to proceed without delay with the full designation
   * of the IRGC, including the Basij militia and the Quds Force, as terrorist
   * organisations" and for sanctions to be expanded and strictly enforced.
   * The same resolution says any normalisation of relations must depend on
   * real progress on human rights.
   *
   * ⚠️ IF THE COUNCIL EVER DOES LIST THE IRGC, this whole block is out of
   * date and the letters would be asking for something already done -- the
   * exact mistake Canada's wording had to be rewritten to avoid. Check before
   * assuming it still holds.
   *
   * There is one entry per letter version because the five letters build the
   * sentence around [DEMANDS] differently. Version 4 needs a NOUN PHRASE
   * ("measures must follow, including ...") where Version 1 needs a full
   * clause. `default` covers any version without its own wording.
   */
  demands: {
    default: {
      en: 'the Council must proceed without delay with the full designation of the IRGC, including the Basij militia and the Quds Force, as terrorist organisations, expand and strictly enforce sanctions against every official responsible for the executions, and make any normalisation of relations conditional on the killing stopping',
    },

    'Version 2': {
      en: 'the Council must finally designate the IRGC, including the Basij militia and the Quds Force, as terrorist organisations, expand sanctions against the officials responsible for the executions, and rule out any normalisation of relations while they continue',
    },

    'Version 3': {
      en: 'designate the IRGC, including the Basij militia and the Quds Force, as terrorist organisations, expand and strictly enforce sanctions against the officials responsible, and suspend any normalisation of relations',
    },

    // A noun phrase: the letter reads "... measures must follow, including [DEMANDS]".
    'Version 4': {
      en: 'the designation of the IRGC, the Basij militia and the Quds Force as terrorist organisations, expanded and strictly enforced sanctions against the officials responsible for the executions, and the suspension of any normalisation of relations',
    },

    'Version 5': {
      en: 'the Council must at last place the IRGC, including the Basij militia and the Quds Force, on the EU terrorist list, expand sanctions against everyone responsible for the executions, and abandon any normalisation of relations',
    },
  },

  /**
   * Who the letters can be sent to. Each entry is one option in the
   * "Choose the Politician" dropdown.
   *
   * One entry per political group, following the same rule as Canada: the
   * group's most Iran-committed MEP receives the letter, and colleagues from
   * the SAME group who also signed an Iran resolution are copied in. Keeping a
   * group's own colleagues in the CC is what makes the letter hard to ignore.
   *
   * ⚠️ The "party" strings below are stored by the Live Action Tracker. Do not
   * reword them -- "Greens/EFA" cannot become "Greens" without splitting that
   * group's chart history in two.
   */
  politicians: [
    {
      // PPE (the European People's Party) is the Parliament's largest group.
      // Gahler is its foreign-affairs coordinator and the first name on the
      // January 2026 joint motion, which is the group's own way of saying he
      // leads on this.
      name: 'Michael Gahler',
      party: 'EPP',
      primary: 'michael.gahler@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 2341.
                                                    //   First signatory, RC-B10-0071/2026
      cc: [
        'david.mcallister@europarl.europa.eu',     // [VERIFIED 2026-09-08] MEP 124806.
                                                   //   Chairs the Foreign Affairs Committee
                                                   //   (AFET); signed RC-B10-0071/2026
        'antonio.lopezisturiz@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 28399.
                                                   //   Signed RC-B10-0071/2026.
                                                   //   NOT antonio.lopez-isturiz@
        'isabel.wiseler@europarl.europa.eu',       // [VERIFIED 2026-09-08] MEP 197421.
                                                   //   Human rights; signed RC-B10-0071/2026.
                                                   //   NOT isabel.wiseler-lima@
        'sebastiao.bugalho@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 257081.
                                                   //   Signed RC-B10-0071/2026 and led the
                                                   //   PPE's April 2026 Iran motion
      ],
    },

    {
      // S&D, the Socialists and Democrats. Incir is Swedish-Kurdish, sits on
      // the human rights subcommittee and is the group's most visible voice on
      // Iran; Maniatis was the first name on the January motion.
      name: 'Evin Incir',
      party: 'S&D',
      primary: 'evin.incir@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 197392.
                                                //   Signed RC-B10-0071/2026
      cc: [
        'ioannis.maniatis@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 256824.
                                                  //   First S&D signatory, RC-B10-0071/2026.
                                                  //   He goes by YANNIS, but the Parliament
                                                  //   registers him as ioannis. NOT yannis.
        'alessandra.moretti@europarl.europa.eu',  // [VERIFIED 2026-09-08] MEP 124799.
                                                  //   Signed RC-B10-0071/2026
        'lucia.annunziata@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 257123.
                                                  //   Signed RC-B10-0071/2026
        'hana.jalloulmuro@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 256992.
                                                  //   Signed RC-B10-0071/2026.
                                                  //   NOT hana.jalloul-muro@
      ],
    },

    {
      // Renew Europe, the liberals. Groothuis was the first Renew name on the
      // January 2026 motion -- the group's own way of marking who leads on
      // this -- so the letter goes to him.
      //
      // Abir Al-Sahlani is directly below in the CC. She is the MEP most
      // publicly identified with Iran in the whole Parliament, having cut off
      // her hair in the plenary chamber for Mahsa Amini, and she signed the
      // same motion. Either of them is a defensible main recipient; this was
      // the organisers' choice on 2026-09-08. If it is ever swapped back,
      // remember the Live Action Tracker stores the recipient's name, so the
      // chart entry starts again under the new one.
      name: 'Bart Groothuis',
      party: 'Renew',
      primary: 'bart.groothuis@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 197780.
                                                    //   First Renew signatory,
                                                    //   RC-B10-0071/2026
      cc: [
        'abir.alsahlani@europarl.europa.eu',     // [VERIFIED 2026-09-08] MEP 197400.
                                                 //   Signed RC-B10-0071/2026.
                                                 //   NOT abir.al-sahlani@
        'petras.austrevicius@europarl.europa.eu',// [VERIFIED 2026-09-08] MEP 124766.
                                                 //   Signed both the January and April 2026
                                                 //   Iran motions
        'nathalie.loiseau@europarl.europa.eu',   // [VERIFIED 2026-09-08] MEP 197494.
                                                 //   Signed RC-B10-0071/2026
        'hilde.vautmans@europarl.europa.eu',     // [VERIFIED 2026-09-08] MEP 130100.
                                                 //   Signed both the January and April 2026
                                                 //   Iran motions
      ],
    },

    {
      // ECR, the European Conservatives and Reformists. Bielan was the first
      // ECR name on both the January and the April 2026 Iran motions.
      name: 'Adam Bielan',
      party: 'ECR',
      primary: 'adam.bielan@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 23788.
                                                 //   First ECR signatory on both
                                                 //   RC-B10-0071/2026 and the April motion
      cc: [
        'sebastian.tynkkynen@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 256806.
                                                  //   Signed both 2026 Iran motions
        'rihards.kols@europarl.europa.eu',        // [VERIFIED 2026-09-08] MEP 220871.
                                                  //   Signed both 2026 Iran motions
        'assita.kanko@europarl.europa.eu',        // [VERIFIED 2026-09-08] MEP 197469.
                                                  //   Signed both 2026 Iran motions
        'carlo.fidanza@europarl.europa.eu',       // [VERIFIED 2026-09-08] MEP 96810.
                                                  //   Signed both 2026 Iran motions
      ],
    },

    {
      // The Greens/EFA. Neumann was the ONLY MEP to table the January 2026
      // motion for her group, and she has led the Parliament's Iran work for
      // years -- the clearest single case in this file.
      name: 'Hannah Neumann',
      party: 'Greens/EFA',
      primary: 'hannah.neumann@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 197464.
                                                    //   Sole Verts/ALE signatory,
                                                    //   RC-B10-0071/2026
      cc: [
        'anna.strolenberg@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 256990.
                                               //   Spoke at the Parliament's April 2026
                                               //   Iran event
        'leoluca.orlando@europarl.europa.eu',  // [VERIFIED 2026-09-08] MEP 2152.
                                               //   Spoke at the Parliament's April 2026
                                               //   Iran event
      ],
    },

    {
      // The Left. Clausen was the first of the group's three signatories on the
      // January 2026 motion. This is the smallest entry here -- only three of
      // the group's MEPs have signed an Iran resolution this term, and we would
      // rather list three real names than pad it out.
      name: 'Per Clausen',
      party: 'The Left',
      primary: 'per.clausen@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 257023.
                                                 //   Signed RC-B10-0071/2026
      cc: [
        'hanna.gedin@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 257092.
                                             //   Signed RC-B10-0071/2026
        'jonas.sjostedt@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 2268.
                                             //   Signed RC-B10-0071/2026
      ],
    },

    {
      // Patriots for Europe -- the hard-right group (Rassemblement National,
      // Lega, Fidesz, PVV, Vox and others).
      //
      // They are here on the same test as everybody else: they tabled their own
      // Iran motion, B10-0117/2026 of February 2026, on the systemic oppression
      // and arbitrary detentions by the regime. They did not sign the
      // cross-party January motion, so all five names below come from their own.
      //
      // This was a deliberate decision by the organisers, taken with the
      // group's politics in mind, and it can be reversed by deleting this whole
      // block -- nothing else in the project depends on it. If you do remove
      // it, the Live Action Tracker keeps whatever counts it already recorded
      // for "Patriots"; they simply stop growing.
      name: 'Hermann Tertsch',
      party: 'Patriots',
      primary: 'hermann.tertsch@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 197831.
                                                     //   First signatory, B10-0117/2026
      cc: [
        'jorge.martinfrias@europarl.europa.eu', // [VERIFIED 2026-09-08] MEP 257029.
                                                //   Signed B10-0117/2026.
                                                //   NOT jorge.martin-frias@
        'mieke.andriese@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 130881.
                                                //   Signed B10-0117/2026
        'silvia.sardone@europarl.europa.eu',    // [VERIFIED 2026-09-08] MEP 197578.
                                                //   Signed B10-0117/2026
        'susanna.ceccardi@europarl.europa.eu',  // [VERIFIED 2026-09-08] MEP 197786.
                                                //   Signed B10-0117/2026
      ],
    },
  ],
};
