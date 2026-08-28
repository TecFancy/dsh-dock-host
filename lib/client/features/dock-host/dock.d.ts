import type { DockButton } from "../../shared/config/index.ts";
/** The registry service id a feature declares as a dependency on the host. */
export declare const DOCK_BUTTONS_SERVICE = "dockButtons";
/** The composer slot this host mounts its row into. */
export declare const DOCK_SLOT = "conversation.input.dock";
/** The slot entry id. */
export declare const DOCK_ID = "dock-host";
/** The dock row's slot order (additive slot; lower comes first). */
export declare const DOCK_ORDER = 1;
/** How many buttons render before the rest go to the overflow menu. */
export declare const DEFAULT_MAX_VISIBLE = 4;
/** The host chrome's i18n namespace. */
export declare const LOCALE_NS = "dockHost";
export declare const DOCK_HOST_LOCALES: {
    readonly zh: {
        readonly more: "更多";
        readonly less: "收起";
    };
    readonly en: {
        readonly more: "More";
        readonly less: "Collapse";
    };
};
/**
 * Render a button's label as plain text: a string icon stays a text prefix
 * (`"▸ Label"`). A React element icon is not stringified here (renderers use
 * {@link DockButtonsRow} instead); the text-only form treats it as unset.
 */
export declare function labelOf(button: DockButton): string;
//# sourceMappingURL=dock.d.ts.map