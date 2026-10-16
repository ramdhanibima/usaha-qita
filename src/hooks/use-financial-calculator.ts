'use client';

import { useState, useMemo, useCallback } from 'react';
import type {
  FinancialInput,
  FinancialResult,
  MonthlyFixedCosts,
} from '@/types/financial';
import type { BusinessOpportunity } from '@/types/opportunity';
import { calculateFinancials } from '@/domain/financial/calculations';
import { financialInputSchema } from '@/domain/validation/financial.schema';

/**
 * Nilai asumsi bawaan standar (Vektor Uji #1: Kedai Kopi Susu)
 */
export const DEFAULT_FINANCIAL_INPUT: FinancialInput = {
  sellingPricePerUnit: 18000,
  unitsSoldPerDay: 50,
  operatingDaysPerMonth: 30,
  variableCostPerUnit: 7000,
  monthlyFixedCosts: {
    rent: 2500000,
    labor: 3000000,
    utilities: 500000,
    marketingAndOther: 500000,
  },
  initialInvestment: 25000000,
};

export interface UseFinancialCalculatorReturn {
  input: FinancialInput;
  result: FinancialResult | null;
  isValid: boolean;
  errors: Record<string, string>;
  setInput: React.Dispatch<React.SetStateAction<FinancialInput>>;
  updateField: <K extends keyof FinancialInput>(field: K, value: FinancialInput[K]) => void;
  updateFixedCost: <K extends keyof MonthlyFixedCosts>(field: K, value: number) => void;
  resetToDefaults: (defaults?: Partial<FinancialInput>) => void;
  loadFromOpportunity: (opportunity: BusinessOpportunity) => void;
}

/**
 * Custom Hook Pengelola Kalkulator Finansial Deterministik (TASK-FIN-01, REQ-FIN-01, REQ-FIN-02).
 * Mengelola input asumsi, memvalidasi runtime dengan Zod, dan memicu fungsi deterministik secara reaktif.
 */
export function useFinancialCalculator(
  initialValues?: Partial<FinancialInput>
): UseFinancialCalculatorReturn {
  const [input, setInput] = useState<FinancialInput>({
    ...DEFAULT_FINANCIAL_INPUT,
    ...initialValues,
    monthlyFixedCosts: {
      ...DEFAULT_FINANCIAL_INPUT.monthlyFixedCosts,
      ...(initialValues?.monthlyFixedCosts || {}),
    },
  });

  // Validasi runtime Zod dan Kalkulasi Deterministik secara Reaktif
  const { result, isValid, errors } = useMemo(() => {
    const validation = financialInputSchema.safeParse(input);

    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.errors.forEach((err) => {
        const path = err.path.join('.');
        errMap[path] = err.message;
      });

      return {
        result: null,
        isValid: false,
        errors: errMap,
      };
    }

    const calcResult = calculateFinancials(validation.data);
    return {
      result: calcResult,
      isValid: true,
      errors: {},
    };
  }, [input]);

  /**
   * Memperbarui satu field utama (sellingPrice, unitsSoldPerDay, dll)
   */
  const updateField = useCallback(
    <K extends keyof FinancialInput>(field: K, value: FinancialInput[K]) => {
      setInput((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  /**
   * Memperbarui satu komponen biaya tetap bulanan (rent, labor, dll)
   */
  const updateFixedCost = useCallback(
    <K extends keyof MonthlyFixedCosts>(field: K, value: number) => {
      setInput((prev) => ({
        ...prev,
        monthlyFixedCosts: {
          ...prev.monthlyFixedCosts,
          [field]: value,
        },
      }));
    },
    []
  );

  /**
   * Mengatur ulang seluruh input ke asumsi bawaan
   */
  const resetToDefaults = useCallback((defaults?: Partial<FinancialInput>) => {
    setInput({
      ...DEFAULT_FINANCIAL_INPUT,
      ...defaults,
      monthlyFixedCosts: {
        ...DEFAULT_FINANCIAL_INPUT.monthlyFixedCosts,
        ...(defaults?.monthlyFixedCosts || {}),
      },
    });
  }, []);

  /**
   * Mengimpor asumsi bawaan dari data BusinessOpportunity secara eksplisit
   */
  const loadFromOpportunity = useCallback((opportunity: BusinessOpportunity) => {
    const assumptions = opportunity.defaultFinancialAssumptions;
    setInput({
      sellingPricePerUnit: assumptions.sellingPricePerUnit,
      unitsSoldPerDay: assumptions.estimatedUnitsSoldPerDay,
      operatingDaysPerMonth: assumptions.operatingDaysPerMonth,
      variableCostPerUnit: assumptions.variableCostPerUnit,
      monthlyFixedCosts: {
        rent: assumptions.monthlyRent,
        labor: assumptions.monthlyLaborCost,
        utilities: assumptions.monthlyUtilitiesCost,
        marketingAndOther: assumptions.monthlyOtherFixedCost,
      },
      initialInvestment: assumptions.initialInvestmentCapital,
    });
  }, []);

  return {
    input,
    result,
    isValid,
    errors,
    setInput,
    updateField,
    updateFixedCost,
    resetToDefaults,
    loadFromOpportunity,
  };
}

