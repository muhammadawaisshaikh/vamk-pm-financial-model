import { FinancialInputs } from '../utils/formulas'

// Defaults taken from your specification (use as initial form values)
export const DEFAULT_INPUTS: FinancialInputs = {
  capacityFactor: 0.3,
  sizeKW: 1500,
  hoursInYear: 8760,
  availabilityRate: 0.95,
  fit: 0.14,
  inflationFit: 0,
  inflationOpex: 0,

  capexTurbinesTransformer: 1725000,
  capexFoundations: 250000,
  capexInternalCables: 160000,
  capexPermitsLegalFinancing: 200000,

  repairsPct: 0.03,
  insurance: 15728.58,
  spareParts: 20700,
  management: 7864.29,

  debtRatio: 0.75,
  equityRatio: 0.25,
  interestRate: 0.08,
  taxRate: 0.02,
  repaymentPeriod: 20,
  depreciationMethod: 'straight-line',

  discountRate: 0.08,
}

// Total investment (for convenience) = 2,335,000 (sum of CAPEX items)
