export type FinancialInputs = {
  // Project parameters
  capacityFactor: number // e.g. 0.3
  sizeKW: number // 1500
  hoursInYear: number // 8760
  availabilityRate: number // 0.95
  fit: number // EUR/kWh
  inflationFit: number // decimal
  inflationOpex: number // decimal

  // CAPEX items
  capexTurbinesTransformer: number
  capexFoundations: number
  capexInternalCables: number
  capexPermitsLegalFinancing: number

  // OPEX
  repairsPct: number // decimal fraction of total capex
  insurance: number
  spareParts: number
  management: number

  // Finance
  debtRatio: number // decimal
  equityRatio: number // decimal
  interestRate: number // decimal
  taxRate: number // decimal
  repaymentPeriod: number // years (20)
  depreciationMethod: 'straight-line' | 'other'

  // discount for NPV
  discountRate: number
}

export type YearlyRow = {
  label: string
  values: number[] // length = repaymentPeriod
}

export type FinancialResults = {
  rows: YearlyRow[]
  npv: number
  irr: number
  cumulativeEquityCashFlow: number
  perYearNpv: number[]
  perYearIrr: number[]
  perYearCumulativeEquity: number[]
}

export function npv(rate: number, cashFlows: number[]) {
  return cashFlows.reduce((acc, cf, i) => acc + cf / Math.pow(1 + rate, i), 0)
}

export function irr(cashFlows: number[], guess = 0.1) {
  // Basic Newton-Raphson implementation; cashFlows indexed from 0
  let x0 = guess
  for (let iter = 0; iter < 200; iter++) {
    let f = 0
    let df = 0
    for (let t = 0; t < cashFlows.length; t++) {
      const cf = cashFlows[t]
      f += cf / Math.pow(1 + x0, t)
      df += -t * cf / Math.pow(1 + x0, t + 1)
    }
    const x1 = x0 - f / df
    if (!isFinite(x1)) break
    if (Math.abs(x1 - x0) < 1e-9) return x1
    x0 = x1
  }
  return x0
}

export function computeFinancialModel(inputs: FinancialInputs): FinancialResults {
  const years = inputs.repaymentPeriod

  const totalCapex =
    inputs.capexTurbinesTransformer +
    inputs.capexFoundations +
    inputs.capexInternalCables +
    inputs.capexPermitsLegalFinancing

  const totalDebt = totalCapex * inputs.debtRatio
  const totalEquity = totalCapex * inputs.equityRatio

  const principalRepayment = totalDebt / inputs.repaymentPeriod

  const annualEnergyProduction =
    inputs.sizeKW * inputs.capacityFactor * inputs.availabilityRate * inputs.hoursInYear

  const rowsMap: Record<string, number[]> = {}

  // initialize rows
  const labels = [
    'Revenue',
    'Repairs & Maintenance',
    'Insurance',
    'Spare Parts',
    'Management',
    'Depreciation',
    'Total OPEX',
    'EBIT',
    'Interest Expense',
    'EBT',
    'Tax',
    'Net Income',
    'CFADS',
    'Principal Repayment',
    'Free Cash Flow to Equity',
    'DSCR',
  ]

  for (const l of labels) rowsMap[l] = []

  let outstandingPrincipal = totalDebt

  // use inflation for FIT and OPEX
  let currentFIT = inputs.fit
  let repairsAmount = totalCapex * inputs.repairsPct
  let currentInsurance = inputs.insurance
  let currentSpare = inputs.spareParts
  let currentManagement = inputs.management

  const depreciation = totalCapex / inputs.repaymentPeriod

  const equityCashFlows: number[] = []
  // initial equity outflow at t=0
  equityCashFlows.push(-totalEquity)

  for (let y = 1; y <= years; y++) {
    // Revenue
    const revenue = annualEnergyProduction * currentFIT

    // OPEX
    const repairs = repairsAmount
    const insurance = currentInsurance
    const spare = currentSpare
    const management = currentManagement
    const depr = depreciation
    const totalOpex = repairs + insurance + spare + management + depr

    const ebit = revenue - totalOpex

    const interestExpense = outstandingPrincipal * inputs.interestRate

    const ebt = ebit - interestExpense
    const tax = ebt * inputs.taxRate
    const netIncome = ebt - tax

    const cfads = ebit - tax + depr

    const principal = principalRepayment
    const freeCashToEquity = cfads - interestExpense - principal

    const dscr = (interestExpense + principal) === 0 ? Infinity : cfads / (interestExpense + principal)

    rowsMap['Revenue'].push(revenue)
    rowsMap['Repairs & Maintenance'].push(repairs)
    rowsMap['Insurance'].push(insurance)
    rowsMap['Spare Parts'].push(spare)
    rowsMap['Management'].push(management)
    rowsMap['Depreciation'].push(depr)
    rowsMap['Total OPEX'].push(totalOpex)
    rowsMap['EBIT'].push(ebit)
    rowsMap['Interest Expense'].push(interestExpense)
    rowsMap['EBT'].push(ebt)
    rowsMap['Tax'].push(tax)
    rowsMap['Net Income'].push(netIncome)
    rowsMap['CFADS'].push(cfads)
    rowsMap['Principal Repayment'].push(principal)
    rowsMap['Free Cash Flow to Equity'].push(freeCashToEquity)
    rowsMap['DSCR'].push(dscr)

    // update outstanding principal
    outstandingPrincipal = Math.max(0, outstandingPrincipal - principal)

    // apply inflation for next year
    if (inputs.inflationFit && inputs.inflationFit !== 0) currentFIT *= 1 + inputs.inflationFit
    if (inputs.inflationOpex && inputs.inflationOpex !== 0) {
      currentInsurance *= 1 + inputs.inflationOpex
      currentSpare *= 1 + inputs.inflationOpex
      currentManagement *= 1 + inputs.inflationOpex
      // repairs could be percentage of capex, so skip changing repairs (it's percent of capex)
    }

    // equity cash flow for this year
    equityCashFlows.push(freeCashToEquity)
  }

  // compute NPV and IRR of equity cash flows (t=0..years)
  const computedNpv = npv(inputs.discountRate, equityCashFlows)
  const computedIrr = irr(equityCashFlows, 0.1)

  const cumulativeEquityCashFlow = equityCashFlows.reduce((s, v) => s + v, 0)

  // compute per-year NPV, IRR and cumulative equity
  const perYearNpv: number[] = []
  const perYearIrr: number[] = []
  const perYearCumulativeEquity: number[] = []
  let runningCum = 0
  // equityCashFlows[0] is t=0 (initial equity outflow), then years 1..n
  for (let k = 1; k <= years; k++) {
    const slice = equityCashFlows.slice(0, k + 1) // include t=0..k
    perYearNpv.push(npv(inputs.discountRate, slice))
    const irrVal = irr(slice, 0.1)
    perYearIrr.push(isFinite(irrVal) ? irrVal : NaN)
    // cumulative equity up to year k
    runningCum += slice[slice.length - 1]
    // Note: runningCum equals sum of equityCashFlows[0..k]
    perYearCumulativeEquity.push(equityCashFlows.slice(0, k + 1).reduce((s, v) => s + v, 0))
  }

  const rows: YearlyRow[] = labels.map(l => ({ label: l, values: rowsMap[l] }))

  return {
    rows,
    npv: computedNpv,
    irr: computedIrr,
    cumulativeEquityCashFlow,
    perYearNpv,
    perYearIrr,
    perYearCumulativeEquity,
  }
}
