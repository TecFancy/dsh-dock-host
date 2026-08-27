import {
  DOCK_HOST_LOCALES,
  DOCK_ID,
  DOCK_ORDER,
  DOCK_SLOT,
  DockButtonsRow,
  LOCALE_NS,
} from "./features/dock-host/index.ts";
import { createRegistry } from "./shared/dock/index.ts";
import type { DockClientContext, DockInput, DockInputActions } from "./shared/config/index.ts";

/** Slot view props (the dock row reads the composer input / actions). */
interface DockSlotProps {
  input?: DockInput;
  inputActions?: DockInputActions;
  sessionId?: string;
}

/**
 * dsh-dock-host client half: provides the dockButtons registry and mounts the
 * dock row above the composer (conversation.input.dock).
 *
 * The row renders whatever buttons are in the registry; a feature (terminal,
 * files, ...) registers its button in a later layer. The host owns placement,
 * theme tokens, i18n (dockHost namespace, zh/en), and overflow motion.
 */
export const name = "dsh-dock-host";
export const inject = ["slots", "locale"] as const;

export function apply(ctx: DockClientContext): void {
  const registry = createRegistry();
  const log = ctx.logger("dsh-dock-host");

  // Own the host chrome's dictionaries (en + zh) for this run.
  ctx.effect(() => ctx.locale.register(LOCALE_NS, "zh", DOCK_HOST_LOCALES.zh), "dsh-dock-host: zh");
  ctx.effect(() => ctx.locale.register(LOCALE_NS, "en", DOCK_HOST_LOCALES.en), "dsh-dock-host: en");

  // Feature providers (terminal, files, ...) register buttons here in later
  // layers; for now the host ships without any button.

  ctx.slots.inject(DOCK_SLOT, () =>
    ctx.slots.register({ name: DOCK_SLOT, id: DOCK_ID, order: DOCK_ORDER }, (slotProps) => {
      const props = (slotProps ?? {}) as DockSlotProps;
      return (
        <DockButtonsRow
          registry={registry}
          locale={ctx.locale}
          onButtonError={(error, id) => log.error('dock button "%s" failed', id, error)}
          {...(props.input !== undefined ? { input: props.input } : {})}
          {...(props.inputActions !== undefined ? { inputActions: props.inputActions } : {})}
          {...(props.sessionId !== undefined ? { sessionId: props.sessionId } : {})}
        />
      );
    }),
  );
}
