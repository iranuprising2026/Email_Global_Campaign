/**
 * Talking to Supabase, which stores the Live Action Tracker counts.
 *
 * One row is written per action. No personal data is stored: not the visitor's
 * name, not their city, not the email text. Only which politician was contacted,
 * which version was used, and how -- exactly what the tracker needs to show
 * supporters who has been contacted least.
 */

import { SUPABASE_URL, SUPABASE_ANON_KEY, STATS_TABLE } from './config.js';

/**
 * The Supabase library is loaded from a CDN in index.html and attaches itself
 * to window.supabase. If that request was blocked, we carry on without a
 * tracker rather than breaking the form -- sending the email matters more than
 * counting it.
 */
function createSupabaseClient() {
  if (!window.supabase?.createClient) {
    console.warn('Supabase library unavailable; the action tracker is disabled.');
    return null;
  }
  return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

const client = createSupabaseClient();

/** Human-readable labels stored in the `action_type` column. */
export const ACTIONS = {
  web: 'Web Click',
  mobile: 'Mobile Click',
  copy: 'Copy All',
};

/**
 * Record one action. Never throws: a failed count must not stop a supporter
 * from sending their email.
 */
export async function recordAction({ politicianLabel, versionId, actionType, campaignId }) {
  if (!client) return false;

  // try/catch as well as the error object: a dead host or offline device makes
  // the underlying fetch reject, which no `error` check would catch.
  try {
    const { error } = await client.from(STATS_TABLE).insert([
      {
        politician_name: politicianLabel,
        version_name: versionId,
        action_type: actionType,
        topic: campaignId,
      },
    ]);

    if (error) {
      console.error('Could not record action:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Could not reach the statistics database:', e.message);
    return false;
  }
}

/**
 * Fetch every recorded action for a campaign.
 *
 * @returns {Promise<Array<{politician_name: string, version_name: string}>|null>}
 *          null means the statistics could not be loaded.
 */
export async function fetchActions(campaignId) {
  if (!client) return null;

  // try/catch as well as the error object — see recordAction. Without this, an
  // unreachable database rejects, renderTracker never reaches its own error
  // branch, and the visitor gets a blank card with no explanation.
  try {
    const { data, error } = await client
      .from(STATS_TABLE)
      .select('politician_name, version_name')
      .eq('topic', campaignId);

    if (error) {
      console.error('Could not load statistics:', error.message);
      return null;
    }
    return data ?? [];
  } catch (e) {
    console.error('Could not reach the statistics database:', e.message);
    return null;
  }
}
