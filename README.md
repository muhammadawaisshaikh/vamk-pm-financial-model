# VAMK PM Financial Model (Vite + React + Tailwind + Zustand + AMCharts)

This project is a small interactive financial model for project management. It is built with:

- React (Vite)
- Tailwind CSS
- Zustand for global state
- AMCharts 5 for interactive charts
- TypeScript

Files of interest
- `src/utils/formulas.ts` — all model formulas are implemented here: annuity payment, NPV, IRR, and the main `computeFinancialModel` which returns the yearly schedule and metrics.
- `src/store/financeStore.ts` — the global Zustand store. It contains `inputs`, `setInput`, and `results`. `results` are computed by calling `computeFinancialModel` when an input changes.
- `src/components/InputForm.tsx` — input UI for user values.
- `src/components/ResultsTable.tsx` — table view with yearly schedule, NPV, IRR, cumulative cash flow.
- `src/components/ChartsView.tsx` — AMCharts 5 charts that automatically update when the store updates.

Setup

1. Install dependencies

```bash
cd /path/to/vamk-pm-financial-model
npm install
```

2. Run development server

```bash
npm run dev
```

3. Build for production

```bash
npm run build
npm run preview
```

Where formulas live and data flow

- Formulas are in `src/utils/formulas.ts`. The function `computeFinancialModel(inputs)` accepts the inputs object and returns `FinancialResults` containing `schedule` (per-year rows), `npv`, `irr`, `cumulativeCashFlow`, and `dscrs`.
- The store in `src/store/financeStore.ts` keeps `inputs` and `results`. The `setInput` action updates `inputs` and immediately recomputes `results` by calling `computeFinancialModel` so everything stays synchronous and reactive.
- Components use `useFinanceStore` selectors to read inputs and results; when inputs change, the store updates results and React re-renders components and charts automatically.

Extending the model

- Replace or extend formulas in `src/utils/formulas.ts`. The store calls that function, so keeping the same output shape (`FinancialResults`) keeps components compatible.
- Add more inputs in `initialInputs` and in `InputForm.tsx`.

Notes

- The attached Excel/PDF reference was not provided in this workspace. The formulas implemented are standard financial formulas (annuity payment for debt service, NPV, IRR) and a simple schedule. If you supply the exact model (Excel or PDF), I will adapt the formulas to match the reference exactly.
