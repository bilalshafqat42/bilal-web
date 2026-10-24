/**
 * Top-level route segments under `src/app`, the names an article slug must not
 * take (articles live at the root, and a static route beats `[slug]`).
 *
 * `(group)` folders add no segment, so their children count as top level;
 * `[dynamic]`, `_private` and `@slot` folders claim no fixed name. Shared by
 * `related-check.mjs` and `new-post.mjs`, which until audit batch 3 only
 * checked `src/app/<slug>` and so missed any route inside a group.
 */
import { readdirSync } from "node:fs";

const routeNames = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => {
      if (/^\(.*\)$/.test(d.name)) return routeNames(new URL(`${d.name}/`, dir));
      if (/^[[_@]/.test(d.name)) return [];
      return [d.name];
    });

/** @param {URL} appDir the `src/app/` folder, with a trailing slash */
export const topLevelRoutes = (appDir) => new Set(routeNames(appDir));
