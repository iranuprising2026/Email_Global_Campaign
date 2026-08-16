/**
 * The "Live Action Tracker": two charts, one card.
 *
 *  - The COUNTRY chart compares every country the site can write to, so a
 *    supporter can see whether their own country is pulling its weight. The
 *    country they are currently on is drawn in gold so they can find it.
 *  - The POLITICIAN chart, below it, shows who has been contacted inside that
 *    one country.
 *
 * Both are here for the same practical reason: show what has been done LEAST,
 * so effort goes where it is needed instead of piling onto the same few
 * inboxes. That purpose drives two design choices in both charts:
 *
 *  1. Bars are sorted with the least-contacted at the TOP, so whoever needs
 *     attention is the first thing you see. Do not sort by name.
 *  2. Bars run horizontally, because the labels are long ("Caspar Veldkamp
 *     (NSC)") and vertical bars force them to be rotated and hard to read.
 *
 * Every politician in the list is from a different party, so one bar per
 * politician is also one bar per party.
 */

import { politicianLabel, sendableCountries } from './data/index.js';
import { fetchActions, fetchTopicTotals } from './stats.js';

/**
 * One colour per email version, light to lighter. They are all shades of the
 * same blue on purpose; the versions only need telling apart, not colour-coding.
 * Do not make the first one darker — it would disappear against the card.
 */
const VERSION_COLORS = ['#4a7fb5', '#6a9bc6', '#89b4d8', '#b0cde3', '#d6e6f2'];

/**
 * The countries you are NOT currently looking at, in the country chart. The
 * one you are on is drawn in gold instead -- see tallyCountries.
 */
const COUNTRY_BAR_COLOR = '#6a9bc6';

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

/**
 * Height of one horizontal bar, in pixels, plus the room the axis and legend
 * need underneath.
 *
 * The card cannot have one fixed height any more: the country chart has six
 * bars and the politician chart has anywhere from five (Canada) to thirteen
 * (the Netherlands). A fixed height would squash one and stretch the other, so
 * each canvas is sized from the number of bars it is about to draw.
 */
const BAR_HEIGHT = 34;
const CHART_CHROME = 76;

function canvasHeightFor(barCount) {
  return barCount * BAR_HEIGHT + CHART_CHROME;
}

let countryChart = null;
let politicianChart = null;

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

/**
 * Order the countries least-contacted first, the same way the politician
 * chart orders its bars, and mark which one the visitor is looking at.
 *
 * Countries with nothing recorded are kept, not dropped. A country sitting at
 * zero is exactly the one a supporter should be told about.
 *
 * @param {Object<string, number>} totals counts keyed by topic
 */
function tallyCountries(totals, issue, selectedCountry) {
  const rows = sendableCountries().map((country) => ({
    name: country.name,
    isSelected: country.id === selectedCountry.id,
    total: totals[trackerTopic(country, issue)] ?? 0,
  }));

  rows.sort((a, b) => a.total - b.total);

  return {
    labels: rows.map((r) => r.name),
    total: rows.reduce((sum, r) => sum + r.total, 0),
    values: rows.map((r) => r.total),
    // Gold for the country you are on, so you can find yourself at a glance.
    // Gold is safe as a bar FILL on the dark card (7.93 against the page); it
    // is only unusable as text on a light ground. See styles.css section 1.
    colors: rows.map((r) =>
      r.isSelected ? token('--color-brand') : COUNTRY_BAR_COLOR
    ),
  };
}

/** Show a message in place of the chart. */
function showNote(noteElement, message) {
  noteElement.textContent = message;
  noteElement.hidden = false;
}

/**
 * Options shared by both charts, so they read as one picture rather than two
 * unrelated ones. Chart.js defaults to dark grey text and near-black grid
 * lines, both invisible on the dark card, so every colour is set explicitly.
 */
function baseOptions(textMuted, gridColor) {
  return {
    // Horizontal bars: the labels are too long to fit under vertical ones
    // without being rotated.
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true,
        beginAtZero: true,
        ticks: { precision: 0, color: textMuted },
        grid: { color: gridColor },
        title: { display: true, text: 'Emails sent', color: textMuted },
      },
      y: {
        stacked: true,
        ticks: {
          color: textMuted,
          /*
            Shorten a label that will not fit, rather than let it be cut off.

            "Yves-François Blanchet (Bloc Québécois)" is wider than a phone
            screen. Chart.js does not shorten such a label: it draws it at full
            length and the canvas edge clips it, so the START of the name
            disappears and the bar reads "s Blanchet (Bloc Québécois)". An
            ellipsis at the end is far better than a silently amputated name.

            Chart.js gives the y-axis at most a third of the chart, so that is
            the space to fit into. `data.labels` is untouched, so the tooltip
            still shows the whole name.
          */
          callback(value) {
            const label = this.getLabelForValue(value);
            const room = this.chart.width / 3 - 10;
            const budget = Math.max(10, Math.floor(room / 6.6));
            return label.length > budget ? `${label.slice(0, budget - 1)}…` : label;
          },
        },
        grid: { display: false },
      },
    },
  };
}

/**
 * Draw or redraw the whole tracker card: the country comparison on top, the
 * politicians of the selected country underneath.
 *
 * Both charts are replaced rather than updated, because Chart.js cannot update
 * a chart whose data shape changed -- and it changes every time the visitor
 * picks a different country.
 *
 * MUST be called on window.load, never during module execution. Chart.js
 * measures the canvas before the layout is final and then paints nothing at
 * all, with no error -- see the comment in app.js.
 *
 * @param {object} options
 * @param {object} options.country The selected country
 * @param {object} options.issue   The selected issue
 * @param {object} options.elements The card's DOM nodes, from app.js
 */
export async function renderTracker({ country, issue, elements }) {
  const {
    countryCanvas,
    politicianCanvas,
    note,
    politicianNote,
    countryPanel,
    politicianPanel,
    politicianHeading,
  } = elements;

  const showPanels = (visible) => {
    countryPanel.hidden = !visible;
    politicianPanel.hidden = !visible;
  };

  note.hidden = true;
  politicianNote.hidden = true;

  // Both requests at once: the country totals are counts across every country,
  // the actions are the rows for this one. Waiting for them in sequence would
  // double how long the card sits empty.
  const [totals, actions] = await Promise.all([
    fetchTopicTotals(
      sendableCountries().map((each) => trackerTopic(each, issue))
    ),
    fetchActions(trackerTopic(country, issue)),
  ]);

  if (totals === null || actions === null) {
    showPanels(false);
    showNote(
      note,
      'The action tracker could not be loaded right now. You can still send your email.'
    );
    return;
  }

  if (!window.Chart) {
    showPanels(false);
    showNote(note, 'The chart library could not be loaded.');
    return;
  }

  const countries = tallyCountries(totals, issue, country);

  // A brand-new campaign has no rows anywhere. Two empty charts look broken,
  // so hide them both and say what is actually going on -- once. Two identical
  // notes stacked in one card reads as a bug in itself.
  if (countries.total === 0) {
    showPanels(false);
    showNote(
      note,
      'No emails have been recorded yet for this campaign. Send the first one!'
    );
    return;
  }

  showPanels(true);
  politicianHeading.textContent = `${country.name} — who has been contacted`;

  const textMuted = token('--color-text-muted');
  const gridColor = token('--color-border');

  // ---- Country comparison -------------------------------------------------
  countryCanvas.parentElement.style.height = `${canvasHeightFor(countries.labels.length)}px`;
  countryChart?.destroy();
  countryChart = new window.Chart(countryCanvas.getContext('2d'), {
    type: 'bar',
    data: {
      labels: countries.labels,
      datasets: [
        {
          label: 'Emails sent',
          data: countries.values,
          backgroundColor: countries.colors,
          borderColor: token('--color-bg'),
          borderWidth: 1,
        },
      ],
    },
    options: {
      ...baseOptions(textMuted, gridColor),
      plugins: {
        // One dataset, so the legend would just repeat the axis title.
        legend: { display: false },
      },
    },
  });

  // ---- Politicians in the selected country --------------------------------
  const { labels, datasets, total } = tallyActions(actions, country, issue);

  // Other countries have started but this one has not. Worth saying out loud:
  // it is the most useful thing a visitor on this page could know.
  if (total === 0) {
    showNote(
      politicianNote,
      `No emails have been recorded for ${country.name} yet. Yours would be the first.`
    );
  }

  politicianCanvas.parentElement.style.height = `${canvasHeightFor(labels.length)}px`;
  politicianChart?.destroy();
  politicianChart = new window.Chart(politicianCanvas.getContext('2d'), {
    type: 'bar',
    data: { labels, datasets },
    options: {
      ...baseOptions(textMuted, gridColor),
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
