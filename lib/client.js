window.__ModuleLoader__.load({
	id: "@tecfancy/dsh-dock-host",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/features/dock-host/dock.ts
		/** The composer slot this host mounts its row into. */
		const DOCK_SLOT = "conversation.input.dock";
		/** The slot entry id. */
		const DOCK_ID = "dock-host";
		/** The host chrome's i18n namespace. */
		const LOCALE_NS = "dockHost";
		const DOCK_HOST_LOCALES = {
			zh: {
				more: "更多",
				less: "收起"
			},
			en: {
				more: "More",
				less: "Collapse"
			}
		};
		/** Render a button's label (string or thunk), with an optional icon prefix. */
		function labelOf(button) {
			const name = (typeof button.label === "function" ? button.label() : button.label) || button.id;
			return button.icon ? `${button.icon} ${name}` : name;
		}
		//#endregion
		//#region \0dsh-css:src/client/features/dock-host/DockButtonsRow.module.css.mjs
		const css = "@media (prefers-reduced-motion:reduce){.menu{transition:none!important}}";
		const tagId = "@tecfancy/dsh-dock-host/DockButtonsRow.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@tecfancy/dsh-dock-host";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var DockButtonsRow_module_css_default = { "menu": "menu" };
		//#endregion
		//#region src/client/features/dock-host/DockButtonsRow.tsx
		const EMPTY_INPUT = { draft: "" };
		const EMPTY_ACTIONS = { setDraft: () => void 0 };
		function buttonCtx(props) {
			const ctx = {
				input: props.input ?? EMPTY_INPUT,
				inputActions: props.inputActions ?? EMPTY_ACTIONS
			};
			if (props.sessionId !== void 0) ctx.sessionId = props.sessionId;
			return ctx;
		}
		/**
		* The dock row: renders one row of buttons above the composer, with the
		* overflow "更多" menu when more than DEFAULT_MAX_VISIBLE buttons exist.
		* Pure presentation: it owns placement, theme tokens, i18n, and motion; a
		* feature button's capability lives in its own run().
		*/
		function DockButtonsRow(props) {
			const { registry, onButtonError, locale, input, inputActions } = props;
			const [, tick] = (0, react.useState)(0);
			const [moreOpen, setMoreOpen] = (0, react.useState)(false);
			(0, react.useEffect)(() => {
				const disposers = [registry.subscribe(() => tick((n) => n + 1))];
				if (locale !== void 0) disposers.push(locale.subscribe(() => tick((n) => n + 1)));
				return () => {
					for (const dispose of disposers) dispose();
				};
			}, [registry, locale]);
			if (input === void 0 || inputActions === void 0) return null;
			const t = locale === void 0 ? (key) => DOCK_HOST_LOCALES.zh[key] ?? key : locale.bind(LOCALE_NS);
			const ctx = buttonCtx(props);
			const all = registry.list().filter((button) => {
				if (typeof button.enabled !== "function") return button.enabled !== false;
				return Boolean(button.enabled(ctx));
			}).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
			const primary = all.filter((button) => button.primary);
			const regular = all.filter((button) => !button.primary);
			const visible = [...primary, ...regular].slice(0, 4);
			const overflow = all.filter((button) => !visible.includes(button));
			const run = (button) => {
				Promise.resolve(button.run(ctx)).catch((error) => {
					onButtonError?.(error, button.id);
				});
			};
			const rowStyle = {
				boxSizing: "border-box",
				width: "100%",
				maxWidth: "var(--dsh-composer-card-max-width)",
				margin: "0 auto",
				display: "flex",
				gap: "8px",
				alignItems: "center",
				position: "relative",
				padding: "0 12px 6px"
			};
			const btnStyle = {
				border: "1px solid var(--dsw-alias-border-l1)",
				background: "var(--dsw-alias-bg-layer-1)",
				color: "var(--dsw-alias-label-primary)",
				borderRadius: "6px",
				padding: "4px 10px",
				fontSize: "12px",
				cursor: "pointer",
				lineHeight: "1.4"
			};
			const chevronStyle = {
				display: "inline-flex",
				transform: moreOpen ? "rotate(180deg)" : "none",
				transition: "transform var(--ds-transition-duration-fast) var(--ds-ease-in-out)"
			};
			const menuStyle = {
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
				transition: "opacity var(--ds-transition-duration-fast) var(--ds-ease-in-out), transform var(--ds-transition-duration-fast) var(--ds-ease-in-out)"
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [moreOpen && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				style: {
					position: "fixed",
					inset: 0,
					zIndex: 40,
					background: "transparent"
				},
				onClick: () => setMoreOpen(false)
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: rowStyle,
				children: [visible.map((button) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					onClick: () => run(button),
					style: btnStyle,
					children: labelOf(button)
				}, button.id)), overflow.length > 0 && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					style: { position: "relative" },
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: () => setMoreOpen((open) => !open),
						style: {
							...btnStyle,
							padding: "4px 7px"
						},
						"aria-expanded": moreOpen,
						"aria-label": t(moreOpen ? "less" : "more"),
						title: t(moreOpen ? "less" : "more"),
						children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: chevronStyle,
							children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
								width: 10,
								height: 6,
								viewBox: "0 0 10 6",
								"aria-hidden": "true",
								style: { display: "block" },
								children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
									d: "M1 1 L5 5 L9 1",
									stroke: "currentColor",
									strokeWidth: 1.5,
									fill: "none",
									strokeLinecap: "round",
									strokeLinejoin: "round"
								})
							})
						})
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
						className: DockButtonsRow_module_css_default["menu"],
						style: menuStyle,
						children: overflow.map((button) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							onClick: () => {
								setMoreOpen(false);
								run(button);
							},
							style: {
								...btnStyle,
								textAlign: "left"
							},
							children: labelOf(button)
						}, button.id))
					})]
				}, "__more__")]
			})] });
		}
		//#endregion
		//#region src/client/shared/dock/registry.ts
		/**
		* The dockButtons registry: feature packages register / list / subscribe.
		*
		* Pure and environment-free so it is trivial to unit test in a Node context;
		* the plugin provides the instance as the client `dockButtons` service so a
		* feature can `inject: ['dockButtons']` and declare a hard dependency.
		*/
		function createRegistry() {
			const buttons = /* @__PURE__ */ new Map();
			const listeners = /* @__PURE__ */ new Set();
			const notify = () => {
				for (const listener of listeners) listener();
			};
			return {
				register(button) {
					if (button == null || typeof button.id !== "string" || typeof button.run !== "function") throw new Error("dockButtons.register(button) needs { id: string, run: (ctx) => void | Promise<void>, ... }");
					buttons.set(button.id, button);
					notify();
					return () => {
						if (buttons.get(button.id) === button) {
							buttons.delete(button.id);
							notify();
						}
					};
				},
				list() {
					return Array.from(buttons.values());
				},
				subscribe(fn) {
					listeners.add(fn);
					return () => {
						listeners.delete(fn);
					};
				}
			};
		}
		//#endregion
		//#region src/client/index.tsx
		/**
		* dsh-dock-host client half: provides the dockButtons registry and mounts the
		* dock row above the composer (conversation.input.dock).
		*
		* The row renders whatever buttons are in the registry; a feature (terminal,
		* files, ...) registers its button in a later layer. The host owns placement,
		* theme tokens, i18n (dockHost namespace, zh/en), and overflow motion.
		*/
		const name = "dsh-dock-host";
		const inject = ["slots", "locale"];
		function apply(ctx) {
			const registry = createRegistry();
			const log = ctx.logger("dsh-dock-host");
			ctx.effect(() => ctx.locale.register(LOCALE_NS, "zh", DOCK_HOST_LOCALES.zh), "dsh-dock-host: zh");
			ctx.effect(() => ctx.locale.register(LOCALE_NS, "en", DOCK_HOST_LOCALES.en), "dsh-dock-host: en");
			ctx.effect(() => ctx.provide("dockButtons", registry), "dsh-dock-host: dockButtons service");
			ctx.slots.inject(DOCK_SLOT, () => ctx.slots.register({
				name: DOCK_SLOT,
				id: DOCK_ID,
				order: 1
			}, (slotProps) => {
				const props = slotProps ?? {};
				return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(DockButtonsRow, {
					registry,
					locale: ctx.locale,
					onButtonError: (error, id) => log.error("dock button \"%s\" failed", id, error),
					...props.input !== void 0 ? { input: props.input } : {},
					...props.inputActions !== void 0 ? { inputActions: props.inputActions } : {},
					...props.sessionId !== void 0 ? { sessionId: props.sessionId } : {}
				});
			}));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		exports.name = name;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map