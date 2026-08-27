/**
 * Structural type contracts for the dsh-dock-host client half.
 *
 * These are plain structural mirrors of the dsh web client services the plugin
 * touches. The client bundle is built as a single externalized file whose only
 * externals are react / react/jsx-runtime (see tsdown.config.ts), so this file
 * must NEVER import any @deepseek-ai/* runtime value: everything here is a
 * shape, and the real objects are injected by the dsh web host at runtime.
 */
export interface SlotRegisterOptions {
    name: string;
    id: string;
    order?: number;
    label?: string | (() => string);
}
export interface SlotsService {
    inject(slotName: string, register: () => void): void;
    register(options: SlotRegisterOptions, view: (props: unknown) => unknown): unknown;
}
export interface LocaleService {
    register(namespace: string, lang: string, dictionary: Readonly<Record<string, string>>): unknown;
    bind(namespace: string): (key: string) => string;
    subscribe(fn: () => void): () => void;
}
/** The conversation input state the dock row reads. */
export interface DockInput {
    draft: string;
    phase?: unknown;
    queue?: unknown;
    [key: string]: unknown;
}
/** The input actions a button uses to write back into the composer. */
export interface DockInputActions {
    setDraft(text: string): void;
    addImages?(ids: string[]): void;
    removeImage?(id: string): void;
    submit?(): void;
}
/** What a button's run() receives. */
export interface DockButtonCtx {
    input: DockInput;
    inputActions: DockInputActions;
    sessionId?: string;
}
/** A registered dock button (published by a feature into the dock host). */
export interface DockButton {
    id: string;
    order?: number;
    label: string | (() => string);
    icon?: string;
    enabled?: boolean | ((ctx: DockButtonCtx) => boolean);
    primary?: boolean;
    run(ctx: DockButtonCtx): void | Promise<void>;
}
/** The client `dockButtons` service: register / list / subscribe. */
export interface DockButtonsRegistry {
    register(button: DockButton): () => void;
    list(): DockButton[];
    subscribe(fn: () => void): () => void;
}
/** A minimal cordis logger shape (ctx.logger(namespace)). */
export interface DockLogger {
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
}
/** The cordis client context shape this plugin relies on. */
export interface DockClientContext {
    slots: SlotsService;
    locale: LocaleService;
    logger: (namespace: string) => DockLogger;
    effect: (fn: () => unknown, label?: string) => unknown;
    provide: (name: string, value: unknown) => () => void;
}
//# sourceMappingURL=context.d.ts.map