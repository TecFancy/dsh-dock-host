/**
 * Client shared config segment barrel. Import types through this barrel, never
 * directly from ./context.ts outside this segment.
 */
export type {
  DockButton,
  DockButtonCtx,
  DockButtonsRegistry,
  DockClientContext,
  DockInput,
  DockInputActions,
  DockLogger,
  LocaleService,
  SlotRegisterOptions,
  SlotsService,
} from "./context.ts";
