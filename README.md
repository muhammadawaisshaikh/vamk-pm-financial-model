**VAMK PM Financial Model**

An interactive 20-year project financial model built with React, TypeScript and AMCharts. The app embeds spreadsheet-derived default inputs, recalculates results instantly when inputs change, and provides a table and multiple charts for visualization.

**Tech Stack:**
- **React (Vite):** fast development build and HMR.
- **TypeScript:** typed codebase.
- **Tailwind CSS:** utility-first styling.
- **Zustand:** lightweight global store for inputs/results.
- **AMCharts 5:** interactive charts (XY, Pie, Percent modules).

**Quick Start:**
- **Install:** `npm install`
- **Dev server:** `npm run dev` (open `http://localhost:5173`)
- **Build:** `npm run build`
- **Preview:** `npm run preview`

**High-level Architecture**
- **Inputs → Store → Engine → Views**: user edits inputs in `src/components/InputForm.tsx`; the store in `src/store/financeStore.ts` updates `inputs` and calls the calculation engine `computeFinancialModel` in `src/utils/formulas.ts`; `results` are stored in the same store and consumed by `ResultsTable` and chart components.
- **Single source of truth:** `useFinanceStore` selectors are used by components to subscribe to only the pieces they need.

**Key Files**
- `src/utils/formulas.ts`: the financial engine. Exports `computeFinancialModel(inputs)` that returns `FinancialResults` (per-year rows and aggregate metrics such as NPV, IRR, cumulative cashflow, per-year IRR/DSCR arrays).
- `src/store/financeStore.ts`: Zustand store exposing `inputs`, `setInput`, and `results`. `setInput` recomputes `results` synchronously so the UI updates immediately.
- `src/components/InputForm.tsx`: the inputs layout (four responsive columns, each rendered as a card). Inputs bind to the store via `setInput`.
- `src/components/ResultsTable.tsx`: renders the 21-column (20 years + label) results table and summary tiles (NPV, IRR, cumulative equity).
- `src/components/ChartsView.tsx`: layout that composes several chart components (see below).
- `src/components/charts/*`: chart components (MainChart, MetricsChart, BreakdownDonut, OpexStacked, CashflowWaterfall, Sparklines). Each chart creates and disposes a single amCharts `Root` instance and updates series data when `results` change.

**Charts & Visualization**
- Main cashflow chart: stacked columns + cumulative line; includes Revenue, CFADS, Interest, Principal and Cumulative Free Cash.
- Metrics chart: per-year equity NPV, cumulative equity, and IRR (dual axis).
- CAPEX donut: breakdown of major capex items.
- OPEX stacked: component-wise OPEX with revenue overlay.
- Waterfall: project-level totals and cumulative build.
- Sparklines: small compact trends for DSCR, annual IRR, and cumulative equity.

Important implementation notes (developer)
- amCharts lifecycle: create exactly one `am5.Root` per DOM container and dispose it on unmount. Chart components in `src/components/charts` follow this pattern.
- Legend and labels: legends are placed below charts and charts have added bottom padding to avoid overlaying the plot area. Tiny sparkline charts hide axis labels and ticks to avoid overlap.
- Safe updates: chart data/legend updates are guarded (refs + existence checks + try/catch) to prevent runtime errors such as calling `setAll` on an undefined object during HMR or early mount.

Development commands
- Typecheck: `npx tsc --noEmit`
- Dev server: `npm run dev`

Troubleshooting
- Runtime error `Cannot read properties of undefined (reading 'setAll')`: usually caused by updating chart legend/data before the legend or series instances are ready. The chart components now store series/legend refs and guard `setAll` calls — ensure you are on the latest code.
- Multiple amCharts roots: creating more than one `Root` for the same DOM node will produce errors. Make sure each chart component creates a `Root` only once (see `useLayoutEffect` patterns in `src/components/charts/*`).

Extending the model
- To change formulas: update `computeFinancialModel` in `src/utils/formulas.ts`. Keep the output shape (`FinancialResults`) to remain compatible with components.
- To add inputs: add fields to `src/store/defaults.ts` (or `initialInputs`) and add UI controls in `src/components/InputForm.tsx`.

Contributing
- Open a PR against `main`. Keep changes focused and run `npx tsc --noEmit` and the dev server to verify runtime behavior.

License
- MIT (or adapt as your project requires)

If you want, I can also add a small architecture diagram, or extract chart helpers to a utility module for reuse.
