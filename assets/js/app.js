/**
 * Wires the page together: reads the form, calls the email builders, updates
 * the preview, opens the mail app, and refreshes the tracker.
 *
 * This is the only file that touches the DOM. If you are looking for the email
 * texts or the politician list, they are in assets/js/data/.
 */

import { ACTIVE_CAMPAIGN_ID } from './config.js';
import { getCampaign } from './data/campaign.js';
import { politicians, politicianLabel, findPoliticianByLabel } from './data/politicians.js';
import { buildEmail, buildComposeUrl, formatForClipboard, MAIL_SERVICES } from './email.js';
import { recordAction, ACTIONS } from './stats.js';
import { renderTracker } from './tracker.js';

const campaign = getCampaign(ACTIVE_CAMPAIGN_ID);

const el = {
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
  chart: document.getElementById('stats-chart'),
  chartNote: document.getElementById('chart-note'),
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

function populateDropdowns() {
  el.campaignTitle.textContent = campaign.title;

  for (const politician of politicians) {
    const option = document.createElement('option');
    option.value = politicianLabel(politician);
    option.textContent = politicianLabel(politician);
    el.politician.append(option);
  }

  for (const version of campaign.versions) {
    const option = document.createElement('option');
    option.value = version.id;
    option.textContent = version.id;
    el.version.append(option);
  }
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
  const politician = findPoliticianByLabel(el.politician.value);
  if (!politician) {
    showStatus('Please choose a politician.', 'error');
    return;
  }

  currentEmail = buildEmail({
    campaign,
    versionId: el.version.value,
    politician,
    userName: el.username.value,
    city: el.city.value,
  });

  el.subject.value = currentEmail.subject.nl;
  el.recipient.value = currentEmail.recipients.join('; ');
  el.output.value = currentEmail.body.nl;

  el.transSubject.textContent = currentEmail.subject.en;
  el.transBody.textContent = currentEmail.body.en;
  el.translationArea.hidden = false;

  setActionsEnabled(true);
  showStatus(
    'Ready. Read the English translation below, then open your email app.',
    'success'
  );
}

async function openMail(service) {
  if (!currentEmail) {
    showStatus('Please press "Generate Email Content" first.', 'error');
    return;
  }

  const politician = findPoliticianByLabel(el.politician.value);
  const { url, newTab } = buildComposeUrl({
    politician,
    subject: currentEmail.subject.nl,
    body: currentEmail.body.nl,
    service,
    userAgent: navigator.userAgent,
  });

  // Open the email first; counting must never delay the actual send.
  // Gmail and Outlook get a new tab so the visitor keeps this page. A mailto:
  // must NOT open a tab: it hands off to the mail program and would otherwise
  // leave an empty tab behind.
  if (newTab) {
    window.open(url, '_blank', 'noopener');
  } else {
    window.location.href = url;
  }

  // A mailto: does nothing at all when no mail program is installed, and the
  // browser gives us no way to detect that, so say what should happen next.
  showStatus(
    service === 'device'
      ? 'Opening your mail app. If nothing happened, no mail program is set up on this device — use Gmail, Outlook, or "Copy All to Clipboard" instead.'
      : `Opening ${MAIL_SERVICES[service]} in a new tab. Check that the email looks right, then send it.`,
    service === 'device' ? 'info' : 'success'
  );

  await recordAction({
    politicianLabel: currentEmail.politicianLabel,
    versionId: el.version.value,
    actionType: ACTIONS[service],
    campaignId: campaign.id,
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
    subject: currentEmail.subject.nl,
    body: currentEmail.body.nl,
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
    campaignId: campaign.id,
  });
  refreshTracker();
}

function refreshTracker() {
  renderTracker(campaign, el.chart, el.chartNote);
}

function init() {
  populateDropdowns();
  setActionsEnabled(false);

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
