import { create } from 'zustand'
import { computeFinancialModel, FinancialInputs, FinancialResults } from '../utils/formulas'
import { DEFAULT_INPUTS } from './defaults'

type FinanceState = {
  inputs: FinancialInputs
  setInput: <K extends keyof FinancialInputs>(key: K, value: FinancialInputs[K]) => void
  results: FinancialResults
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  inputs: DEFAULT_INPUTS,
  setInput: (key, value) => {
    set(state => ({ inputs: { ...state.inputs, [key]: value } }))
    // recompute results immediately
    const next = computeFinancialModel({ ...get().inputs, [key]: value })
    set(() => ({ results: next }))
  },
  results: computeFinancialModel(DEFAULT_INPUTS),
}))
