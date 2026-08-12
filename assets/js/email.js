/**
 * Turning campaign templates into a finished email.
 *
 * Everything here is a pure function: same input, same output, no reading from
 * the page and no side effects. That keeps the fiddly parts (placeholder
 * filling, mailto quirks) easy to reason about and to test.
 */

import { politicianLabel } from './data/index.js';

/**
 * Replace one placeholder, capitalising the replacement where it starts a
 * sentence.
 *
 * This exists for [COUNTRY]. In English the term is "the Netherlands", but two
 * of the letters open a sentence with it, where it has to read "The
 * Netherlands". Rather than ask whoever writes the letters to think about that,
 * the first letter is capitalised automatically when the placeholder follows
 * the start of the text, a full stop, or a line break.
 *
 * Harmless in languages that always capitalise the term: Dutch "Nederland" and
 * German "Deutschland" are unchanged by it.
 */
function replacePlaceholder(text, placeholder, value) {
  const escaped = placeholder.replace(/[[\]]/g, '\\$&');
  // Capture what precedes the placeholder so it can be put back unchanged.
  const pattern = new RegExp(`(^|[.!?]\\s*|\\n\\s*)${escaped}`, 'g');
  const capitalised = value.charAt(0).toUpperCase() + value.slice(1);

  return text
    .replace(pattern, (_match, before) => before + capitalised)
    .replaceAll(placeholder, value);
}

/**
 * Replace the placeholders in a letter.
 *
 * If the visitor left their city blank, the placeholder would leave a dangling
 * empty line under the signature, so trailing blank lines are trimmed away.
 */
function fillTemplate(template, { politicianName, signature, city, terms, demands }) {
  let text = template
    .replaceAll('[NAME]', politicianName)
    .replaceAll('[USER]', signature)
    .replaceAll('[CITY]', city);

  text = replacePlaceholder(text, '[COUNTRY]', terms.country);
  text = replacePlaceholder(text, '[GOVERNMENT]', terms.government);
  text = replacePlaceholder(text, '[DEMANDS]', demands);

  return text.replace(/[ \t]+$/gm, '').replace(/\s+$/, '');
}

/**
 * The measures one country's letter asks for, for one version.
 *
 * Country-specific because the same demand is not true everywhere: Canada
 * closed the Islamic Republic embassy in 2012 and listed the IRGC in 2024, so
 * asking a Canadian MP to do either reads as though nobody checked. Per version
 * because the five letters phrase the demand differently on purpose, and the
 * grammar around the placeholder differs -- version 4 needs a noun phrase
 * ("including ...") where version 1 needs a full clause.
 *
 * Falls back to `default`, so adding a sixth version does not require editing
 * every country file -- it just gets the country's general wording until
 * somebody writes a specific one.
 */
function demandsFor(country, versionId, language) {
  const forVersion = country.demands?.[versionId] || country.demands?.default;
  return forVersion?.[language];
}

/**
 * Build the ready-to-send email for one country, issue, politician and version.
 *
 * Two languages come back:
 *
 *   `sent`  the letter in the country's own language -- this is what gets
 *           emailed to the politician.
 *   `en`    the English translation, shown in the preview box so supporters
 *           can read what they are about to send.
 *
 * For an English-speaking country the two are the same text.
 *
 * @param {object}   args
 * @param {object}   args.country    A country from data/countries/
 * @param {object}   args.issue      An issue from data/issues/
 * @param {string}   [args.language] Which of the country's languages to write
 *                                   in. Defaults to its first, which is the
 *                                   only one for every country except a
 *                                   bilingual one like Canada.
 * @param {string}   args.versionId  e.g. "Version 3"
 * @param {object}   args.politician An entry from the country's politicians
 * @param {string}   args.userName   Visitor's name, may be empty
 * @param {string}   args.city       Visitor's city, may be empty
 * @returns {{subject: {sent: string, en: string},
 *            body: {sent: string, en: string},
 *            language: string,
 *            recipients: string[],
 *            politicianLabel: string}}
 */
export function buildEmail({
  country,
  issue,
  language,
  versionId,
  politician,
  userName = '',
  city = '',
}) {
  const version = issue.versions.find((v) => v.id === versionId);
  if (!version) {
    throw new Error(`Unknown version "${versionId}" in issue "${issue.id}".`);
  }

  const lang = language || country.languages[0];
  if (!country.languages.includes(lang)) {
    throw new Error(
      `Country "${country.id}" does not list language "${lang}". ` +
        `Add it to \`languages\` in assets/js/data/countries/${country.id}.js.`
    );
  }
  if (!version.subject[lang] || !version.body[lang]) {
    throw new Error(
      `Issue "${issue.id}" has no "${lang}" text for "${versionId}". ` +
        `Add it in assets/js/data/issues/${issue.id}.js, or remove ` +
        `"${country.id}" from assets/js/data/index.js until it is translated.`
    );
  }
  if (!country.terms[lang] || !country.terms.en) {
    throw new Error(
      `Country "${country.id}" is missing terms for "${lang}" or "en". ` +
        `Add them in assets/js/data/countries/${country.id}.js -- an ` +
        `unreplaced placeholder would be emailed to a member of parliament.`
    );
  }
  // Only required by letters that actually use [DEMANDS], so check the text
  // first rather than forcing every country to carry a field it never uses.
  const usesDemands = (version.body[lang] + version.body.en).includes('[DEMANDS]');
  if (usesDemands && !(demandsFor(country, versionId, lang) && demandsFor(country, versionId, 'en'))) {
    throw new Error(
      `Country "${country.id}" has no demands for "${versionId}" in "${lang}" ` +
        `or "en". Add them under \`demands\` in ` +
        `assets/js/data/countries/${country.id}.js -- the letter asks for ` +
        `specific measures and an unreplaced [DEMANDS] would be emailed to a ` +
        `member of parliament.`
    );
  }

  const trimmedName = userName.trim();
  const trimmedCity = city.trim();

  const inLanguage = (code) => ({
    politicianName: politician.name,
    signature: trimmedName || country.anonymousSignature[code],
    city: trimmedCity,
    terms: country.terms[code],
    demands: demandsFor(country, versionId, code),
  });

  const sent = inLanguage(lang);
  const english = inLanguage('en');

  return {
    subject: {
      sent: fillTemplate(version.subject[lang], sent),
      en: fillTemplate(version.subject.en, english),
    },
    body: {
      sent: fillTemplate(version.body[lang], sent),
      en: fillTemplate(version.body.en, english),
    },
    language: lang,
    recipients: [politician.primary, ...politician.cc],
    politicianLabel: politicianLabel(politician),
  };
}

/** True for phones and tablets, which need different mailto separators. */
export function isMobileUserAgent(userAgent) {
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
}

/** True on iPhone/iPad/iPod. iOS opens apps through their own URL schemes. */
export function isIosUserAgent(userAgent) {
  return /iPhone|iPad|iPod/i.test(userAgent);
}

/** True on Android. Android opens apps through intent: URLs, not schemes. */
export function isAndroidUserAgent(userAgent) {
  return /Android/i.test(userAgent);
}

/**
 * Android app ids ("package names"). These are what Android matches to decide
 * which installed app opens the email, so a typo means "app not installed".
 */
const ANDROID_PACKAGES = {
  gmail: 'com.google.android.gm',
  outlook: 'com.microsoft.office.outlook',
};

/**
 * Build an Android intent: URL — the only reliable way to open one *named* app.
 *
 * Why not a scheme like googlegmail:// ? Those are iOS-only. Android apps
 * register for the standard mailto: link instead, and an intent: URL is how a
 * web page says "open this mailto: with exactly this app". Two things come for
 * free: Android itself checks whether the app is installed, and
 * browser_fallback_url tells the browser where to go when it is not.
 *
 * The syntax is fussy. Everything before "#Intent;" is the mailto: link, and
 * the parts after it are separated by semicolons -- which is why every value
 * inside is percent-encoded (encodeURIComponent turns ";" and "#" into %3B and
 * %23, so they cannot end a section early).
 */
function androidIntentUrl({ service, mailtoUrl, fallbackUrl }) {
  return (
    `intent:${mailtoUrl}` +
    '#Intent;action=android.intent.action.SENDTO' +
    `;package=${ANDROID_PACKAGES[service]}` +
    `;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}` +
    ';end'
  );
}

/**
 * Where the visitor reads their email. These keys are what the buttons pass
 * to buildComposeUrl(); the values are shown to the visitor.
 */
export const MAIL_SERVICES = {
  gmail: 'Gmail',
  outlook: 'Outlook',
  device: 'My mail app',
};

/**
 * Build the mailto: link that opens the visitor's own mail program.
 *
 * IMPORTANT: this only does anything if the device actually has a mail program
 * registered to handle mailto: links. Phones always do. A PC where the owner
 * reads mail in a browser tab often does NOT, and there the link fails
 * silently -- nothing happens at all, with no error. That is why the page also
 * offers Gmail and Outlook web links; see buildComposeUrl below.
 *
 * Two deliberate quirks, both discovered the hard way -- please do not
 * "tidy" them away without testing on real devices first:
 *
 * 1. SEPARATORS. RFC 6068 says commas, but desktop Outlook only accepts
 *    semicolons, while Gmail on mobile only accepts commas. The device decides:
 *    phones and tablets get commas, everything else gets semicolons. This used
 *    to depend on which of two buttons was pressed, which asked the visitor to
 *    know something they cannot be expected to know.
 *
 * 2. THE ADDRESS APPEARS TWICE. Once in the mailto: path and again as a `to=`
 *    parameter. Some mail clients drop the path address as soon as other
 *    parameters are present and would otherwise open with an empty To field.
 *    The duplicate is harmless: clients de-duplicate it.
 *
 * @param {object} args
 * @param {object} args.politician An entry from the country's politicians
 * @param {string} args.subject    Subject line, already in the send language
 * @param {string} args.body       Email body, already in the send language
 * @param {string} args.userAgent  navigator.userAgent
 */
export function buildMailtoUrl({ politician, subject, body, userAgent }) {
  const separator = isMobileUserAgent(userAgent) ? ',' : ';';
  const to = politician.primary;
  const cc = politician.cc.join(separator);

  // Built by hand with encodeURIComponent rather than URLSearchParams:
  // URLSearchParams would encode spaces as "+" (which some clients show
  // literally) and would escape characters this link has always sent raw.
  // This produces exactly the URL the campaign has been using in the field.
  return (
    `mailto:${encodeURIComponent(to)}` +
    `?to=${encodeURIComponent(to)}` +
    `&cc=${encodeURIComponent(cc)}` +
    `&subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`
  );
}

/**
 * Build the link that opens a pre-filled email, for whichever service the
 * visitor picked.
 *
 * The rule is the same everywhere, phone or computer: try the installed app
 * first, and only use the website when the device has no such app. How "try
 * the app" is spelled differs per platform, and getting that wrong is exactly
 * the bug this used to have:
 *
 *   Android  intent: URL naming the app (see androidIntentUrl). The iOS
 *            schemes below do NOT work here -- Android never registers them,
 *            so the link did nothing and every visitor ended up on the mobile
 *            website, which does not fill the email in. Fixed 2026-08-12.
 *   iOS      the app's own scheme, googlegmail:/// or ms-outlook://. Verified
 *            working on real devices -- do not change these.
 *   Computer ms-outlook:// for Outlook, which desktop Outlook registers. Gmail
 *            has no desktop app, so Gmail goes straight to the website.
 *
 * @param {object} args
 * @param {object} args.politician An entry from the country's politicians
 * @param {string} args.subject    Subject line, already in the send language
 * @param {string} args.body       Email body, already in the send language
 * @param {'gmail'|'outlook'|'device'} args.service Which option was chosen
 * @param {string} args.userAgent  navigator.userAgent
 * @returns {{url: string, newTab: boolean, fallbackUrl: string|null,
 *            fallbackDelayMs: number}}
 *          newTab false means "do not navigate away from the page" -- a
 *          mailto: or an app link must not open a tab.
 *          fallbackUrl is the website to use when `url` is an app link and the
 *          app turns out not to be installed; app links fail silently, so
 *          app.js waits fallbackDelayMs to find out. See openAppOrFallBack.
 */
export function buildComposeUrl({ politician, subject, body, service, userAgent }) {
  if (service === 'device') {
    return {
      url: buildMailtoUrl({ politician, subject, body, userAgent }),
      newTab: false,
      fallbackUrl: null,
      fallbackDelayMs: 0,
    };
  }

  const onPhone = isMobileUserAgent(userAgent);
  const onAndroid = isAndroidUserAgent(userAgent);
  const to = politician.primary;
  const cc = politician.cc.join(',');
  const q = {
    to: encodeURIComponent(to),
    cc: encodeURIComponent(cc),
    subject: encodeURIComponent(subject),
    body: encodeURIComponent(body),
  };

  // How long to wait before deciding "the app is not installed". A phone
  // switches apps instantly; a computer may need seconds to bring a cold
  // Outlook to the front, and giving up too early would yank the visitor to
  // the website while their Outlook was still starting.
  const fallbackDelayMs = onPhone ? 1500 : 4000;

  if (service === 'gmail') {
    const web =
      'https://mail.google.com/mail/?view=cm&fs=1' +
      `&to=${q.to}&cc=${q.cc}&su=${q.subject}&body=${q.body}`;

    if (onAndroid) {
      return {
        url: androidIntentUrl({
          service,
          mailtoUrl: buildMailtoUrl({ politician, subject, body, userAgent }),
          fallbackUrl: web,
        }),
        newTab: false,
        fallbackUrl: web,
        fallbackDelayMs,
      };
    }

    if (onPhone) {
      // Note the three slashes: that is what the Gmail iOS app registers, not
      // a typo. The https link would open the Gmail website instead, because
      // Gmail's universal links do not cover the compose URL.
      return {
        url: `googlegmail:///co?to=${q.to}&cc=${q.cc}&subject=${q.subject}&body=${q.body}`,
        newTab: false,
        fallbackUrl: web,
        fallbackDelayMs,
      };
    }

    // No Gmail desktop app exists, so this is the app, in a tab of its own.
    return { url: web, newTab: true, fallbackUrl: null, fallbackDelayMs: 0 };
  }

  if (service === 'outlook') {
    const web =
      'https://outlook.live.com/mail/0/deeplink/compose?' +
      `to=${q.to}&cc=${q.cc}&subject=${q.subject}&body=${q.body}`;

    if (onAndroid) {
      return {
        url: androidIntentUrl({
          service,
          mailtoUrl: buildMailtoUrl({ politician, subject, body, userAgent }),
          fallbackUrl: web,
        }),
        newTab: false,
        fallbackUrl: web,
        fallbackDelayMs,
      };
    }

    // iOS and every computer: the Outlook app's own scheme, website as backup.
    return {
      url: `ms-outlook://compose?to=${q.to}&cc=${q.cc}&subject=${q.subject}&body=${q.body}`,
      newTab: false,
      fallbackUrl: web,
      fallbackDelayMs,
    };
  }

  throw new Error(`Unknown mail service "${service}".`);
}

/** The plain-text block used by the "Copy All" button. */
export function formatForClipboard({ recipients, subject, body }) {
  return `To: ${recipients.join('; ')}\nSubject: ${subject}\n\n${body}`;
}
