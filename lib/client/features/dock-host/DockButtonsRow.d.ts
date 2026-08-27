import type { DockButtonsRegistry, DockInput, DockInputActions, LocaleService } from "../../shared/config/index.ts";
export interface DockButtonsRowProps {
    registry: DockButtonsRegistry;
    onButtonError?: (error: unknown, buttonId: string) => void;
    locale?: LocaleService;
    input?: DockInput;
    inputActions?: DockInputActions;
    sessionId?: string;
}
/**
 * The dock row: renders one row of buttons above the composer, with the
 * overflow "更多" menu when more than DEFAULT_MAX_VISIBLE buttons exist.
 * Pure presentation: it owns placement, theme tokens, i18n, and motion; a
 * feature button's capability lives in its own run().
 */
export declare function DockButtonsRow(props: DockButtonsRowProps): JSX.Element | null;
//# sourceMappingURL=DockButtonsRow.d.ts.map