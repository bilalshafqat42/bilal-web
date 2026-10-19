/**
 * The spam trap's field name, shared by every lead form and /api/lead.
 *
 * Until 2026-10-19 the trap was an input named "company", labelled "Company".
 * Browser autofill fills a field with that name from the visitor's saved
 * address, the route saw a filled trap, answered success and dropped the
 * enquiry. A real lead was lost with no error anywhere.
 *
 * The name is deliberately meaningless: no autofill heuristic or password
 * manager maps "hp_x7q" to anything a person has saved. Do not rename it to
 * anything that reads as a real field (company, website, url, address, fax,
 * phone2...).
 *
 * The wire key is the same string, so a filled trap reaches the route under a
 * key it alone looks for. "company" and the older "botcheck" key are not bot
 * signals any more: a visitor's real company must never block a lead.
 */
export const HONEYPOT_FIELD = "hp_x7q";
