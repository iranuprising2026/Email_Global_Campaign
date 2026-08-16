/**
 * Wires the page together: reads the form, calls the email builders, updates
 * the preview, opens the mail app, and refreshes the tracker.
 *
 * This is the only file that touches the DOM. If you are looking for the email
 * texts or the politician list, they are in assets/js/data/.
 */

import { DEFAULT_COUNTRY_ID, DEFAULT_ISSUE_ID } from './config.js';
import {
  getCountry,
  getIssue,
  issuesForLanguage,
  languagesForCountry,
  languageName,
  politicianLabel,
  findPoliticianByLabel,
  isSendable,
  sendableCountries,
  unavailableCountries,
} from './data/index.js';
import { buildEmail, buildComposeUrl, formatForClipboard, MAIL_SERVICES } from './email.js';
import { recordAction, ACTIONS } from './stats.js';
import { renderTracker, trackerTopic } from './tracker.js';

/** What is currently on screen. All set by applySelection(). */
let country = null;
let issue = null;
let language = null;

const el = {
  country: document.getElementById('country'),
  issue: document.getElementById('issue'),
  language: document.getElementById('language'),
  languageField: document.getElementById('language-field'),
  labelSubject: document.getElementById('label-subject'),
  labelRecipient: document.getElementById('label-recipient'),
  labelOutput: document.getElementById('label-output'),
  campaignTitle: document.getElementById('campaign-title'),
  username: document.getElementById('username'),
  city: document.getElementById('city'),
  politician: document.getElementById('politician'),
  version: document.getElementById('version'),
  generate: document.getElementById('generate'),
  subject: document.getElementById('subject'),
  recipient: document.getElementById('recipient'),
  output: document.getElementById('output'),
  translationArea: document.getElementById('translation-area'),
  transSubject: document.getElementById('trans-subject'),
  transBody: document.getElementById('trans-body'),
  openEmail: document.getElementById('open-email'),
  mailChoices: document.getElementById('mail-choices'),
  openGmail: document.getElementById('open-gmail'),
  openOutlook: document.getElementById('open-outlook'),
  openDevice: document.getElementById('open-device'),
  copyAll: document.getElementById('copy-all'),
  status: document.getElementById('status'),
  // The Live Action Tracker card. tracker.js owns everything inside it.
  countryCanvas: document.getElementById('country-chart'),
  politicianCanvas: document.getElementById('stats-chart'),
  trackerNote: document.getElementById('tracker-note'),
  politicianNote: document.getElementById('politician-note'),
  countryPanel: document.getElementById('country-panel'),
  politicianPanel: document.getElementById('politician-panel'),
  politicianHeading: document.getElementById('politician-chart-heading'),
};

/** The email currently shown in the preview, or null before Generate. */
let currentEmail = null;

/**
 * A symbol per kind. The status messages are all the same colour by design
 * (see styles.css section 8), so this symbol is what tells them apart.
 */
const STATUS_GLYPH = { info: 'ℹ', success: '✓', error: '⚠' };

function showStatus(message, kind = 'info') {
  el.status.textContent = message ? `${STATUS_GLYPH[kind]} ${message}` : '';
  el.status.dataset.kind = kind;
  el.status.hidden = !message;
}

/** Replace a dropdown's options. */
function fillSelect(select, items) {
  select.replaceChildren();
  for (const { value, text, disabled } of items) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    if (disabled) option.disabled = true;
    select.append(option);
  }
}

/**
 * The Country dropdown never changes, so it is filled once.
 *
 * Countries that are not ready yet are listed too, greyed out and unselectable,
 * so a visitor can see their country is planned rather than assuming the site
 * has nothing for them. See unavailableCountries() in data/index.js.
 */
function populateCountries() {
  fillSelect(el.country, [
    ...sendableCountries().map((c) => ({ value: c.id, text: c.name })),
    ...unavailableCountries().map((c) => ({
      value: c.id,
      text: `${c.name} — coming soon`,
      disabled: true,
    })),
  ]);
}

/**
 * Fill everything that depends on the chosen country and issue: the Issue
 * dropdown, the heading, the politician list and the version list.
 */
function populateForSelection() {
  fillSelect(
    el.issue,
    issuesForLanguage(language).map((i) => ({ value: i.id, text: i.title }))
  );
  el.issue.value = issue.id;
  el.campaignTitle.textContent = issue.title;

  // The language picker only earns its place in a bilingual country.
  const languages = languagesForCountry(country);
  el.languageField.hidden = languages.length < 2;
  fillSelect(
    el.language,
    languages.map((code) => ({ value: code, text: languageName(code) }))
  );
  el.language.value = language;

  fillSelect(
    el.politician,
    country.politicians.map((p) => ({
      value: politicianLabel(p),
      text: politicianLabel(p),
    }))
  );

  fillSelect(
    el.version,
    issue.versions.map((v) => ({ value: v.id, text: v.id }))
  );

  // Say which language the letter is in, since it is no longer always Dutch.
  const name = languageName(language);
  el.labelOutput.textContent = `Preview (${name} text that will be sent):`;
  el.labelSubject.textContent = `Subject (${name}):`;
  el.labelRecipient.textContent = 'Recipient:';
}

/**
 * Work out which country and issue to show, from the link the visitor followed.
 *
 * A mistyped or outdated shared link must still produce a working page, so
 * anything unrecognised falls back instead of failing.
 *
 *   1. ?country= / ?issue= in the address, if they name things that exist.
 *   2. The browser's language, e.g. nl-NL -> nl.
 *   3. The defaults in config.js.
 *
 * A country that is not ready yet is treated the same as one that does not
 * exist: a link to ?country=de must not open a page with nothing to send.
 */
function resolveSelection() {
  const params = new URLSearchParams(window.location.search);

  /** A country only counts here if a letter can actually be sent to it. */
  const ready = (id) => {
    const found = getCountry(id);
    return found && isSendable(found) ? found : null;
  };

  const browserLanguage = (navigator.language || '').split('-').pop().toLowerCase();
  const chosenCountry =
    ready(params.get('country')) ||
    ready(browserLanguage) ||
    ready(DEFAULT_COUNTRY_ID) ||
    sendableCountries()[0];

  // Which language to write in. Only matters for a bilingual country.
  const languages = languagesForCountry(chosenCountry);
  const requested = params.get('lang');
  const chosenLanguage = languages.includes(requested) ? requested : languages[0] || null;

  // Only issues actually written in that language can be offered.
  const available = chosenLanguage ? issuesForLanguage(chosenLanguage) : [];
  const chosenIssue =
    available.find((i) => i.id === params.get('issue')) ||
    available.find((i) => i.id === DEFAULT_ISSUE_ID) ||
    available[0] ||
    null;

  return { country: chosenCountry, issue: chosenIssue, language: chosenLanguage };
}

/**
 * Put the current choice in the address bar, so the link can be shared.
 *
 * replaceState rather than pushState: switching country is not a separate page
 * the Back button should have to walk through.
 */
function syncUrl() {
  const params = new URLSearchParams(window.location.search);
  params.set('country', country.id);
  params.set('issue', issue.id);
  // Only worth putting in the link where there is a real choice.
  if (languagesForCountry(country).length > 1) params.set('lang', language);
  else params.delete('lang');
  window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

/**
 * Show a country that has no letters yet. Happens when a country file is added
 * before its letters are translated.
 */
function showNoIssuesForCountry() {
  el.campaignTitle.textContent = `No campaigns for ${country.name} yet`;
  fillSelect(el.issue, []);
  fillSelect(el.politician, []);
  fillSelect(el.version, []);
  el.languageField.hidden = true;
  el.generate.disabled = true;
  setActionsEnabled(false);
  showStatus(
    `There are no letters written for ${country.name} yet. Choose another country.`,
    'info'
  );
}

/**
 * Nothing can be sent from anywhere. Only reachable if every country file is
 * unfinished at once, which means somebody mid-edit -- so say so plainly
 * instead of leaving a dead form on the page.
 */
function showNoCountriesReady() {
  el.campaignTitle.textContent = 'No campaigns yet';
  el.generate.disabled = true;
  setActionsEnabled(false);
  showStatus(
    'No country has both letters and recipients set up yet. ' +
      'See assets/js/data/index.js.',
    'info'
  );
}

/** Switch to a country and issue, refreshing everything that depends on them. */
function applySelection(next) {
  country = next.country;
  issue = next.issue;
  language = next.language;

  el.country.value = country.id;

  if (!issue) {
    syncUrl();
    showNoIssuesForCountry();
    return;
  }

  el.generate.disabled = false;
  populateForSelection();
  syncUrl();

  // The politician list and the letter language both just changed, so anything
  // already generated is stale.
  currentEmail = null;
  el.subject.value = '';
  el.recipient.value = '';
  el.output.value = '';
  el.translationArea.hidden = true;
  setActionsEnabled(false);
  showStatus('');

  refreshTracker();
}

/** Preview goes stale as soon as the visitor changes any input. */
function invalidatePreview() {
  if (!currentEmail) return;
  currentEmail = null;
  el.subject.value = '';
  el.recipient.value = '';
  el.output.value = '';
  el.translationArea.hidden = true;
  setActionsEnabled(false);
  showStatus('Your choices changed — press "Generate Email Content" again.', 'info');
}

function setActionsEnabled(enabled) {
  el.openEmail.disabled = !enabled;
  el.copyAll.disabled = !enabled;
  if (!enabled) showMailChoices(false);
}

/** Show or hide the Gmail / Outlook / mail-app choices. */
function showMailChoices(open) {
  el.mailChoices.hidden = !open;
  el.openEmail.setAttribute('aria-expanded', String(open));
}

function generate() {
  const politician = findPoliticianByLabel(country, el.politician.value);
  if (!politician) {
    showStatus('Please choose a politician.', 'error');
    return;
  }

  currentEmail = buildEmail({
    country,
    issue,
    language,
    versionId: el.version.value,
    politician,
    userName: el.username.value,
    city: el.city.value,
  });

  el.subject.value = currentEmail.subject.sent;
  el.recipient.value = currentEmail.recipients.join('; ');
  el.output.value = currentEmail.body.sent;

  el.transSubject.textContent = currentEmail.subject.en;
  el.transBody.textContent = currentEmail.body.en;
  // An English-speaking country needs no translation panel: it would just
  // repeat the letter the visitor is already reading above.
  el.translationArea.hidden = currentEmail.language === 'en';

  setActionsEnabled(true);
  showStatus(
    currentEmail.language === 'en'
      ? 'Ready. Read the letter above, then open your email app.'
      : 'Ready. Read the English translation below, then open your email app.',
    'success'
  );
}

/**
 * Open an app link, and fall back to the website if that app is not installed.
 *
 * An app link like ms-outlook:// does nothing at all when the app is missing,
 * and the browser offers no way to ask in advance. So we watch what happens
 * after clicking:
 *
 *   - the app opened      → a phone puts this page in the background
 *                           (document.hidden), a computer takes the keyboard
 *                           focus away from it (document.hasFocus() is false,
 *                           which is also true while the browser is asking
 *                           "Open Outlook?"). Either way: leave the page alone.
 *   - nothing happened    → still visible and still focused after the wait, so
 *                           there is no such app. Send them to the website.
 *
 * Both checks are made when the timer fires rather than in an event listener,
 * because a computer showing the "Open Outlook?" prompt fires no useful event.
 */
function openAppOrFallBack(appUrl, webUrl, delayMs) {
  const timer = setTimeout(() => {
    if (!document.hidden && document.hasFocus()) window.location.href = webUrl;
  }, delayMs);

  // Leaving this page for the app also means the fallback must be cancelled,
  // otherwise the visitor returns to find the website loaded on top.
  window.addEventListener('pagehide', () => clearTimeout(timer), { once: true });

  window.location.href = appUrl;
}

async function openMail(service) {
  if (!currentEmail) {
    showStatus('Please press "Generate Email Content" first.', 'error');
    return;
  }

  const politician = findPoliticianByLabel(country, el.politician.value);
  const { url, newTab, fallbackUrl, fallbackDelayMs } = buildComposeUrl({
    politician,
    subject: currentEmail.subject.sent,
    body: currentEmail.body.sent,
    service,
    userAgent: navigator.userAgent,
  });

  // Open the email first; counting must never delay the actual send.
  // A new tab is only for a web link, so the visitor keeps this page. An app
  // link must NOT open a tab: it hands off to another program and would
  // otherwise leave an empty tab behind.
  if (newTab) {
    window.open(url, '_blank', 'noopener');
  } else if (fallbackUrl) {
    openAppOrFallBack(url, fallbackUrl, fallbackDelayMs);
  } else {
    window.location.href = url;
  }

  // Nothing here can be detected from the page: a mailto: with no mail program
  // fails silently, and so does an app link for an app that is not installed
  // (that is what fallbackUrl above is for). So say what should happen next.
  showStatus(
    service === 'device'
      ? 'Opening your mail app. If nothing happened, no mail program is set up on this device — use Gmail, Outlook, or "Copy All to Clipboard" instead.'
      : `Opening the ${MAIL_SERVICES[service]} app, or its website if the app is not installed. Check that the email looks right, then send it.`,
    service === 'device' ? 'info' : 'success'
  );

  await recordAction({
    politicianLabel: currentEmail.politicianLabel,
    versionId: el.version.value,
    actionType: ACTIONS[service],
    campaignId: trackerTopic(country, issue),
  });
  refreshTracker();
}

async function copyAll() {
  if (!currentEmail) {
    showStatus('Please press "Generate Email Content" first.', 'error');
    return;
  }

  const text = formatForClipboard({
    recipients: currentEmail.recipients,
    subject: currentEmail.subject.sent,
    body: currentEmail.body.sent,
  });

  try {
    await navigator.clipboard.writeText(text);
    showStatus('Copied. Paste it into your email app.', 'success');
  } catch {
    // Clipboard access needs a secure context and can be blocked; selecting the
    // preview lets the visitor copy it by hand.
    el.output.focus();
    el.output.select();
    showStatus('Copying was blocked. The text is selected — press Ctrl/Cmd+C.', 'error');
    return;
  }

  await recordAction({
    politicianLabel: currentEmail.politicianLabel,
    versionId: el.version.value,
    actionType: ACTIONS.copy,
    campaignId: trackerTopic(country, issue),
  });
  refreshTracker();
}

/**
 * Redraw both tracker charts for whatever is currently selected.
 *
 * Called on every country change, issue change and recorded action, which is
 * what makes the chart follow the Country dropdown.
 */
function refreshTracker() {
  renderTracker({
    country,
    issue,
    elements: {
      countryCanvas: el.countryCanvas,
      politicianCanvas: el.politicianCanvas,
      note: el.trackerNote,
      politicianNote: el.politicianNote,
      countryPanel: el.countryPanel,
      politicianPanel: el.politicianPanel,
      politicianHeading: el.politicianHeading,
    },
  });
}

function init() {
  populateCountries();
  setActionsEnabled(false);

  // Fill everything in from the link the visitor followed. applySelection()
  // calls refreshTracker(), which is why the window.load guard at the bottom
  // only applies to the very first draw.
  const initial = resolveSelection();
  if (!initial.country) {
    showNoCountriesReady();
    return;
  }

  country = initial.country;
  issue = initial.issue;
  language = initial.language;
  el.country.value = country.id;
  if (issue) {
    populateForSelection();
  } else {
    showNoIssuesForCountry();
  }
  syncUrl();

  el.country.addEventListener('change', () => {
    const chosen = getCountry(el.country.value);
    // The "coming soon" options are disabled, so this should be unreachable --
    // but a dropdown left on an unselectable value must not blank the page.
    if (!chosen || !isSendable(chosen)) {
      el.country.value = country.id;
      return;
    }

    const languages = languagesForCountry(chosen);
    // Keep the same language if the new country writes it, else its first.
    const keptLanguage = languages.includes(language) ? language : languages[0] || null;
    // Keep the same issue if it exists in that language, else its first.
    const available = keptLanguage ? issuesForLanguage(keptLanguage) : [];
    const keptIssue = available.find((i) => i.id === issue?.id) || available[0] || null;
    applySelection({ country: chosen, issue: keptIssue, language: keptLanguage });
  });

  el.issue.addEventListener('change', () => {
    applySelection({ country, issue: getIssue(el.issue.value) || issue, language });
  });

  el.language.addEventListener('change', () => {
    const chosen = el.language.value;
    const available = issuesForLanguage(chosen);
    const keptIssue = available.find((i) => i.id === issue?.id) || available[0] || null;
    applySelection({ country, issue: keptIssue, language: chosen });
  });

  el.generate.addEventListener('click', generate);

  // "Open Email" reveals the three choices rather than sending straight away,
  // so the visitor can pick a service that actually works on their device.
  el.openEmail.addEventListener('click', () => {
    showMailChoices(el.mailChoices.hidden);
  });

  el.openGmail.addEventListener('click', () => openMail('gmail'));
  el.openOutlook.addEventListener('click', () => openMail('outlook'));
  el.openDevice.addEventListener('click', () => openMail('device'));
  el.copyAll.addEventListener('click', copyAll);

  for (const input of [el.username, el.city, el.politician, el.version]) {
    input.addEventListener('change', invalidatePreview);
  }

  // Draw the chart only once the page has fully loaded.
  //
  // This module runs as soon as the DOM is parsed, which is too early for
  // Chart.js: it measures the canvas before the layout is final, so the chart
  // is constructed without error but paints nothing at all — an empty card with
  // no clue as to why. The original code used window.onload for this reason.
  // Verified: rendering here produced a blank card, rendering on load works.
  if (document.readyState === 'complete') {
    refreshTracker();
  } else {
    window.addEventListener('load', refreshTracker, { once: true });
  }
}

init();
