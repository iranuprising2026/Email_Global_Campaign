/**
 * Turning campaign templates into a finished email.
 *
 * Everything here is a pure function: same input, same output, no reading from
 * the page and no side effects. That keeps the fiddly parts (placeholder
 * filling, mailto quirks) easy to reason about and to test.
 */

import { ANONYMOUS_SIGNATURE } from './config.js';
import { politicianLabel } from './data/politicians.js';

/**
 * Replace the [NAME] / [USER] / [CITY] placeholders.
 *
 * If the visitor left their city blank, the placeholder would leave a dangling
 * empty line under the signature, so trailing blank lines are trimmed away.
 */
function fillTemplate(template, { politicianName, signature, city }) {
  return template
    .replaceAll('[NAME]', politicianName)
    .replaceAll('[USER]', signature)
    .replaceAll('[CITY]', city)
    .replace(/[ \t]+$/gm, '')
    .replace(/\s+$/, '');
}

/**
 * Build the ready-to-send email for one politician and one version.
 *
 * @param {object}   args
 * @param {object}   args.campaign   A campaign from data/campaign.js
 * @param {string}   args.versionId  e.g. "Version 3"
 * @param {object}   args.politician An entry from data/politicians.js
 * @param {string}   args.userName   Visitor's name, may be empty
 * @param {string}   args.city       Visitor's city, may be empty
 * @returns {{subject: {nl: string, en: string},
 *            body: {nl: string, en: string},
 *            recipients: string[],
 *            politicianLabel: string}}
 */
export function buildEmail({ campaign, versionId, politician, userName = '', city = '' }) {
  const version = campaign.versions.find((v) => v.id === versionId);
  if (!version) {
    throw new Error(`Unknown version "${versionId}" in campaign "${campaign.id}".`);
  }

  const trimmedName = userName.trim();
  const trimmedCity = city.trim();

  const dutch = {
    politicianName: politician.name,
    signature: trimmedName || ANONYMOUS_SIGNATURE.nl,
    city: trimmedCity,
  };
  const english = {
    politicianName: politician.name,
    signature: trimmedName || ANONYMOUS_SIGNATURE.en,
    city: trimmedCity,
  };

  return {
    subject: { nl: version.subject.nl, en: version.subject.en },
    body: {
      nl: fillTemplate(version.body.nl, dutch),
      en: fillTemplate(version.body.en, english),
    },
    recipients: [politician.primary, ...politician.cc],
    politicianLabel: politicianLabel(politician),
  };
}

/** True for phones and tablets, which need different mailto separators. */
export function isMobileUserAgent(userAgent) {
  return /iPhone|iPad|iPod|Android/i.test(userAgent);
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
 * @param {object} args.politician An entry from data/politicians.js
 * @param {string} args.subject    Dutch subject line
 * @param {string} args.body       Dutch email body
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
 * Gmail and Outlook open a compose window in a normal browser tab, so they
 * work on any computer even when no mail program is installed. Both accept
 * comma-separated CC addresses.
 *
 * @param {object} args
 * @param {object} args.politician An entry from data/politicians.js
 * @param {string} args.subject    Dutch subject line
 * @param {string} args.body       Dutch email body
 * @param {'gmail'|'outlook'|'device'} args.service Which option was chosen
 * @param {string} args.userAgent  navigator.userAgent
 * @returns {{url: string, newTab: boolean}} newTab false means "do not
 *          navigate away from the page" -- mailto: must not open a tab.
 */
export function buildComposeUrl({ politician, subject, body, service, userAgent }) {
  if (service === 'device') {
    return { url: buildMailtoUrl({ politician, subject, body, userAgent }), newTab: false };
  }

  const to = politician.primary;
  const cc = politician.cc.join(',');

  if (service === 'gmail') {
    return {
      url:
        'https://mail.google.com/mail/?view=cm&fs=1' +
        `&to=${encodeURIComponent(to)}` +
        `&cc=${encodeURIComponent(cc)}` +
        `&su=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`,
      newTab: true,
    };
  }

  if (service === 'outlook') {
    return {
      url:
        'https://outlook.live.com/mail/0/deeplink/compose?' +
        `to=${encodeURIComponent(to)}` +
        `&cc=${encodeURIComponent(cc)}` +
        `&subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(body)}`,
      newTab: true,
    };
  }

  throw new Error(`Unknown mail service "${service}".`);
}

/** The plain-text block used by the "Copy All" button. */
export function formatForClipboard({ recipients, subject, body }) {
  return `To: ${recipients.join('; ')}\nSubject: ${subject}\n\n${body}`;
}
