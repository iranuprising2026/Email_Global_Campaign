/**
 * The "Live Action Tracker" chart.
 *
 * Its whole purpose is practical: show which politicians have been contacted
 * LEAST, so supporters spread the pressure across parliament instead of piling
 * onto the same few inboxes.
 *
 * That purpose drives two design choices:
 *
 *  1. Bars are sorted with the least-contacted at the TOP, so the people who
 *     need attention are the first thing you see. Do not sort by name.
 *  2. Bars run horizontally, because the labels are long ("Caspar Veldkamp
 *     (NSC)") and vertical bars force them to be rotated and hard to read.
 *
 * Every politician in the list is from a different party, so one bar per
 * politician is also one bar per party.
 */

import { politicianLabel } from './data/index.js';
import { fetchActions } from './stats.js';

/**
 * One colour per email version, light to lighter. They are all shades of the
 * same blue on purpose; the versions only need telling apart, not colour-coding.
 * Do not make the first one darker — it would disappear against the card.
 */
const VERSION_COLORS = ['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2'];

/**
 * Read one colour from styles.css section 1, so the chart follows the
 * stylesheet instead of repeating its colours here. Safe because the chart is
 * built on window.load, by which point the stylesheet has been applied.
 */
function token(name) {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

/**
 * The key the counts are stored under, e.g. "nl:executions".
 *
 * Country AND issue, because otherwise Dutch and German execution emails would
 * be counted together and the chart would show German politicians under a
 * Dutch total. Changing this format splits every campaign's history.
 */
export function trackerTopic(country, issue) {
  return `${country.id}:${issue.id}`;
}

let chart = null;

/**
 * Count actions per politician per version, and order politicians so the
 * least-contacted comes first.
 *
 * @returns {{labels: string[], datasets: object[], total: number}}
 */
function tallyActions(actions, country, issue) {
  // How many actions each politician received, per version and in total.
  const rows = country.politicians.map((politician) => {
    const label = politicianLabel(politician);
    const perVersion = issue.versions.map(
      (version) =>
        actions.filter(
          (row) =>
            row.politician_name === label && row.version_name === version.id
        ).length
    );
    return {
      label,
      perVersion,
      total: perVersion.reduce((sum, n) => sum + n, 0),
    };
  });

  // Least contacted first. Ties keep the original list order, which is stable
  // in every browser that matters, so the chart does not jitter on refresh.
  rows.sort((a, b) => a.total - b.total);

  return {
    labels: rows.map((r) => r.label),
    total: rows.reduce((sum, r) => sum + r.total, 0),
    datasets: issue.versions.map((version, index) => ({
      label: version.id,
      data: rows.map((r) => r.perVersion[index]),
      backgroundColor: VERSION_COLORS[index % VERSION_COLORS.length],
      /* A thin dark line between stacked blocks, so neighbouring shades stay
         separate even though they are close in brightness. */
      borderColor: token('--color-bg'),
      borderWidth: 1,
    })),
  };
}

/** Show a message in place of the chart. */
function showNote(noteElement, message) {
  noteElement.textContent = message;
  noteElement.hidden = false;
}

/**
 * Draw or redraw the chart.
 *
 * @param {object} country  The selected country, whose politicians are the bars
 * @param {object} issue    The selected issue, whose versions are the stacks
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} noteElement  Where to explain a failure to the visitor
 */
export async function renderTracker(country, issue, canvas, noteElement) {
  const actions = await fetchActions(trackerTopic(country, issue));

  if (actions === null) {
    showNote(
      noteElement,
      'The action tracker could not be loaded right now. You can still send your email.'
    );
    return;
  }

  if (!window.Chart) {
    showNote(noteElement, 'The chart library could not be loaded.');
    return;
  }

  const { labels, datasets, total } = tallyActions(actions, country, issue);

  // A brand-new campaign has no rows yet. An empty chart looks broken, so say
  // what is actually going on.
  if (total === 0) {
    showNote(
      noteElement,
      'No emails have been recorded yet for this campaign. Send the first one!'
    );
  } else {
    noteElement.hidden = true;
  }

  const textMuted = token('--color-text-muted');
  const gridColor = token('--color-border');

  // Chart.js cannot update a chart whose data shape changed, so replace it.
  chart?.destroy();
  chart = new window.Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: { labels, datasets },
    options: {
      // Horizontal bars: the politician names are too long to fit under
      // vertical ones without being rotated.
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      /* Chart.js defaults to dark grey text and near-black grid lines, both
         invisible on the dark card, so every colour is set explicitly. */
      scales: {
        x: {
          stacked: true,
          beginAtZero: true,
          ticks: { precision: 0, color: textMuted },
          grid: { color: gridColor },
          title: {
            display: true,
            text: 'Emails sent',
            color: textMuted,
          },
        },
        y: {
          stacked: true,
          ticks: { color: textMuted },
          grid: { display: false },
        },
      },
      plugins: {
        legend: { labels: { color: token('--color-text') } },
        tooltip: {
          callbacks: {
            // Show the running total for the politician, which is the number
            // supporters actually care about when choosing who to write to.
            footer: (items) => {
              const sum = items.reduce((n, item) => n + item.parsed.x, 0);
              return `Total: ${sum}`;
            },
          },
        },
      },
    },
  });
}
