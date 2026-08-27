import type { DockClientContext } from "./shared/config/index.ts";
/**
 * dsh-dock-host client half: provides the dockButtons registry and mounts the
 * dock row above the composer (conversation.input.dock).
 *
 * The row renders whatever buttons are in the registry; a feature (terminal,
 * files, ...) registers its button in a later layer. The host owns placement,
 * theme tokens, i18n (dockHost namespace, zh/en), and overflow motion.
 */
export declare const name = "dsh-dock-host";
export declare const inject: readonly ["slots", "locale"];
export declare function apply(ctx: DockClientContext): void;
//# sourceMappingURL=index.d.ts.map