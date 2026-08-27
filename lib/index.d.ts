import type { Context } from "@deepseek-ai/cordis";
/**
 * dsh-dock-host is a client-only plugin: it renders the dock button row and
 * owns the dockButtons registry entirely on the browser half (src/client).
 *
 * The host half registers no tools and no Remote RPC; it only declares the
 * plugin identity the cordis loader needs. All dock capabilities live on the
 * client, mounted through the `conversation.input.dock` slot.
 */
export declare const name = "dsh-dock-host";
export declare function apply(_ctx: Context): void;
//# sourceMappingURL=index.d.ts.map