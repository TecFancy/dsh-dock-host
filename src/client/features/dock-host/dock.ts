import type { DockButton } from "../../shared/config/index.ts";

/** The registry service id a feature declares as a dependency on the host. */
export const DOCK_BUTTONS_SERVICE = "dockButtons";
/** The composer slot this host mounts its row into. */
export const DOCK_SLOT = "conversation.input.dock";
/** The slot entry id. */
export const DOCK_ID = "dock-host";
/** The dock row's slot order (additive slot; lower comes first). */
export const DOCK_ORDER = 1;
/** How many buttons render before the rest go to the overflow menu. */
export const DEFAULT_MAX_VISIBLE = 4;

/** The host chrome's i18n namespace. */
export const LOCALE_NS = "dockHost";
export const DOCK_HOST_LOCALES = {
  zh: { more: "更多", less: "收起" },
  en: { more: "More", less: "Collapse" },
} as const;

/** Render a button's label (string or thunk), with an optional icon prefix. */
export function labelOf(button: DockButton): string {
  const text = typeof button.label === "function" ? button.label() : button.label;
  const name = text || button.id;
  return button.icon ? `${button.icon} ${name}` : name;
}
