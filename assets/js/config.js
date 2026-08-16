/**
 * Site-wide settings.
 *
 * These are the only "knobs" for the whole site. Everything else lives in
 * assets/js/data/ (the email texts and the politician list).
 */

/**
 * Supabase project used to count actions for the Live Action Tracker.
 *
 * This key is a *publishable* (anonymous) key. It is meant to be visible in
 * the browser and is safe to commit. It only grants what the table's
 * Row Level Security policies allow -- see docs/supabase-schema.sql.
 *
 * Never put a `service_role` key in this file. That key bypasses all security
 * rules and would let anyone delete the campaign statistics.
 */
export const SUPABASE_URL = 'https://wazrgvwqotgdpmaphldt.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_UHHkZewi_ZjDN6KMbznKgw_p-0SOOVx';

/** Table that stores one row per email sent or copied. */
export const STATS_TABLE = 'email_stats';

/**
 * What the page shows when the visitor arrives without a link that says
 * otherwise, and their browser language does not match a country we have.
 *
 * These must match an id in assets/js/data/index.js.
 */
export const DEFAULT_COUNTRY_ID = 'nl';
export const DEFAULT_ISSUE_ID = 'executions';
