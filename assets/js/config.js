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
export const SUPABASE_URL = 'https://jjplszhxhwliimzpqwyc.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_UDllYN6zVMFDI6P8Fy3SCQ_YD50E_bs';

/** Table that stores one row per email sent or copied. */
export const STATS_TABLE = 'email_stats';

/**
 * Which campaign from assets/js/data/campaign.js is currently live.
 *
 * To run a different campaign later: add it to campaign.js, then change this
 * one line. The tracker keeps each campaign's counts separate.
 */
export const ACTIVE_CAMPAIGN_ID = 'executions';

/** Shown as the signature when the visitor leaves the name field empty. */
export const ANONYMOUS_SIGNATURE = {
  nl: 'Een Iraanse inwoner in Nederland',
  en: 'An Iranian resident in the Netherlands',
};
