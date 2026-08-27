import type { DockButtonsRegistry } from "../config/index.ts";
/**
 * The dockButtons registry: feature packages register / list / subscribe.
 *
 * Pure and environment-free so it is trivial to unit test in a Node context;
 * the plugin provides the instance as the client `dockButtons` service so a
 * feature can `inject: ['dockButtons']` and declare a hard dependency.
 */
export declare function createRegistry(): DockButtonsRegistry;
//# sourceMappingURL=registry.d.ts.map