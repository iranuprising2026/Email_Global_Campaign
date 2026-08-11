/**
 * The "Live Action Tracker" chart.
 *
 * A stacked bar per politician, split by email version. Its purpose is
 * practical: supporters use it to spot which politicians have been contacted
 * least, so the pressure spreads across parliament instead of piling onto the
 * same few inboxes.
 */

import { politicians, politicianLabel } from './data/politicians.js';
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

let chart = null;

/** Count actions per politician per version. */
function tallyActions(actions, campaign) {
  return campaign.versions.map((version, index) => ({
    label: version.id,
    backgroundColor: VERSION_COLORS[index % VERSION_COLORS.length],
    /* A thin dark line between stacked blocks, so neighbouring shades stay
       separate even though they are close in brightness. */
    borderColor: token('--color-bg'),
    borderWidth: 1,
    data: politicians.map(
      (politician) =>
        actions.filter(
          (row) =>
            row.politician_name === politicianLabel(politician) &&
            row.version_name === version.id
        ).length
    ),
  }));
}

/**
 * Draw or redraw the chart.
 *
 * @param {object} campaign  The active campaign
 * @param {HTMLCanvasElement} canvas
 * @param {HTMLElement} noteElement  Where to explain a failure to the visitor
 */
export async function renderTracker(campaign, canvas, noteElement) {
  const actions = await fetchActions(campaign.id);

  if (actions === null) {
    noteElement.textContent =
      'The action tracker could not be loaded right now. You can still send your email.';
    noteElement.hidden = false;
    return;
  }

  noteElement.hidden = true;

  if (!window.Chart) {
    noteElement.textContent = 'The chart library could not be loaded.';
    noteElement.hidden = false;
    return;
  }

  const datasets = tallyActions(actions, campaign);

  // Chart.js cannot update a chart whose data shape changed, so replace it.
  chart?.destroy();
  chart = new window.Chart(canvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: politicians.map((p) => p.name),
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      /* Chart.js defaults to dark grey text and near-black grid lines, both
         invisible on the dark card, so every colour is set explicitly. */
      scales: {
        x: {
          stacked: true,
          ticks: { color: token('--color-text-muted') },
          grid: { color: token('--color-border') },
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: { precision: 0, color: token('--color-text-muted') },
          grid: { color: token('--color-border') },
        },
      },
      plugins: {
        legend: { labels: { color: token('--color-text') } },
        tooltip: {
          callbacks: {
            title: (items) => {
              const politician = politicians[items[0].dataIndex];
              return politicianLabel(politician);
            },
          },
        },
      },
    },
  });
}
