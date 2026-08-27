import { useEffect, useState, type CSSProperties } from "react";
import type {
  DockButton,
  DockButtonCtx,
  DockButtonsRegistry,
  DockInput,
  DockInputActions,
  LocaleService,
} from "../../shared/config/index.ts";
import { DEFAULT_MAX_VISIBLE, DOCK_HOST_LOCALES, LOCALE_NS, labelOf } from "./dock.ts";
import css from "./DockButtonsRow.module.css";

export interface DockButtonsRowProps {
  registry: DockButtonsRegistry;
  onButtonError?: (error: unknown, buttonId: string) => void;
  locale?: LocaleService;
  input?: DockInput;
  inputActions?: DockInputActions;
  sessionId?: string;
}

const EMPTY_INPUT: DockInput = { draft: "" };
const EMPTY_ACTIONS: DockInputActions = { setDraft: () => undefined };

function buttonCtx(props: DockButtonsRowProps): DockButtonCtx {
  const ctx: DockButtonCtx = {
    input: props.input ?? EMPTY_INPUT,
    inputActions: props.inputActions ?? EMPTY_ACTIONS,
  };
  if (props.sessionId !== undefined) ctx.sessionId = props.sessionId;
  return ctx;
}

/**
 * The dock row: renders one row of buttons above the composer, with the
 * overflow "更多" menu when more than DEFAULT_MAX_VISIBLE buttons exist.
 * Pure presentation: it owns placement, theme tokens, i18n, and motion; a
 * feature button's capability lives in its own run().
 */
export function DockButtonsRow(props: DockButtonsRowProps): JSX.Element | null {
  const { registry, onButtonError, locale, input, inputActions } = props;

  const [, tick] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const disposers = [registry.subscribe(() => tick((n) => n + 1))];
    if (locale !== undefined) disposers.push(locale.subscribe(() => tick((n) => n + 1)));
    return () => {
      for (const dispose of disposers) dispose();
    };
  }, [registry, locale]);

  if (input === undefined || inputActions === undefined) return null;

  const t =
    locale === undefined
      ? (key: string) => DOCK_HOST_LOCALES.zh[key as keyof typeof DOCK_HOST_LOCALES.zh] ?? key
      : locale.bind(LOCALE_NS);

  const ctx = buttonCtx(props);
  const all = registry
    .list()
    .filter((button) => {
      if (typeof button.enabled !== "function") return button.enabled !== false;
      return Boolean(button.enabled(ctx));
    })
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const primary = all.filter((button) => button.primary);
  const regular = all.filter((button) => !button.primary);
  const visible = [...primary, ...regular].slice(0, DEFAULT_MAX_VISIBLE);
  const overflow = all.filter((button) => !visible.includes(button));

  const run = (button: DockButton): void => {
    Promise.resolve(button.run(ctx)).catch((error: unknown) => {
      onButtonError?.(error, button.id);
    });
  };

  const rowStyle: CSSProperties = {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: "var(--dsh-composer-card-max-width)",
    margin: "0 auto",
    display: "flex",
    gap: "8px",
    alignItems: "center",
    position: "relative",
    padding: "0 12px 6px",
  };
  const btnStyle: CSSProperties = {
    border: "1px solid var(--dsw-alias-border-l1)",
    background: "var(--dsw-alias-bg-layer-1)",
    color: "var(--dsw-alias-label-primary)",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
    lineHeight: "1.4",
  };
  const chevronStyle: CSSProperties = {
    display: "inline-flex",
    transform: moreOpen ? "rotate(180deg)" : "none",
    transition: "transform var(--ds-transition-duration-fast) var(--ds-ease-in-out)",
  };
  const menuStyle: CSSProperties = {
    position: "absolute",
    bottom: "calc(100% + 6px)",
    left: 0,
    zIndex: 50,
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    gap: "4px",
    minWidth: "120px",
    background: "var(--dsw-alias-bg-overlay)",
    border: "1px solid var(--dsw-alias-border-l1)",
    borderRadius: "8px",
    padding: "6px",
    boxShadow: "var(--dsw-shadow-lv2)",
    opacity: moreOpen ? 1 : 0,
    transform: moreOpen ? "none" : "translateY(4px)",
    visibility: moreOpen ? "visible" : "hidden",
    pointerEvents: moreOpen ? "auto" : "none",
    transition:
      "opacity var(--ds-transition-duration-fast) var(--ds-ease-in-out), transform var(--ds-transition-duration-fast) var(--ds-ease-in-out)",
  };
  const backdropStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 40,
    background: "transparent",
  };

  return (
    <>
      {moreOpen && <div style={backdropStyle} onClick={() => setMoreOpen(false)} />}
      <div style={rowStyle}>
        {visible.map((button) => (
          <button key={button.id} onClick={() => run(button)} style={btnStyle}>
            {labelOf(button)}
          </button>
        ))}
        {overflow.length > 0 && (
          <div key="__more__" style={{ position: "relative" }}>
            <button
              onClick={() => setMoreOpen((open) => !open)}
              style={{ ...btnStyle, padding: "4px 7px" }}
              aria-expanded={moreOpen}
              aria-label={t(moreOpen ? "less" : "more")}
              title={t(moreOpen ? "less" : "more")}
            >
              <span style={chevronStyle}>
                <svg
                  width={10}
                  height={6}
                  viewBox="0 0 10 6"
                  aria-hidden="true"
                  style={{ display: "block" }}
                >
                  <path
                    d="M1 1 L5 5 L9 1"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div className={css["menu"]} style={menuStyle}>
              {overflow.map((button) => (
                <button
                  key={button.id}
                  onClick={() => {
                    setMoreOpen(false);
                    run(button);
                  }}
                  style={{ ...btnStyle, textAlign: "left" }}
                >
                  {labelOf(button)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
