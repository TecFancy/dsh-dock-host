/**
 * Client feature slice: the dock button host.
 *
 * The feature owns the placement/presentation of a row of dock buttons above
 * the composer (conversation.input.dock). It renders whatever buttons are in
 * the registry; each button's capability belongs to the feature that published
 * it. The host knows nothing about any feature (terminal, files, ...).
 */
export { DockButtonsRow } from "./DockButtonsRow.tsx";
export type { DockButtonsRowProps } from "./DockButtonsRow.tsx";
export {
  DEFAULT_MAX_VISIBLE,
  DOCK_BUTTONS_SERVICE,
  DOCK_HOST_LOCALES,
  DOCK_ID,
  DOCK_ORDER,
  DOCK_SLOT,
  LOCALE_NS,
  labelOf,
} from "./dock.ts";
