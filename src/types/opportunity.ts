import { BusinessCategory } from './profile';

export type RiskLevel = 'low' | 'medium' | 'high';

export interface BusinessOpportunity {
  id: string;
  slug: string;
  title: string;
  category: BusinessCategory;
  shortDescription: string;
  fullDescription: string;
  minCapital: number;
  maxCapital: number;
  matchingRationale: string;
  targetCustomer: string;
  riskLevel: RiskLevel;
  riskMitigationTips: string[];
  defaultFinancialAssumptions: {
    sellingPricePerUnit: number;
    estimatedUnitsSoldPerDay: number;
    operatingDaysPerMonth: number;
    variableCostPerUnit: number;
    monthlyRent: number;
    monthlyLaborCost: number;
    monthlyUtilitiesCost: number;
    monthlyOtherFixedCost: number;
    initialInvestmentCapital: number;
  };
  isSimulation: true; // Wajib true pada tahap MVP untuk kepatuhan etis
  dataSourceLabel: string; // Contoh: "Estimasi Model Edukatif Usaha Qita (Data Simulasi)"
}

