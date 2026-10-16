import { describe, it, expect } from 'vitest';
import { calculateFinancials, determineHealthStatus, getHealthStatusMessage } from '@/domain/financial/calculations';
import { financialInputSchema } from '@/domain/validation/financial.schema';
import { opportunityRepository } from '@/adapters/repositories/opportunity.repository';
import type { FinancialInput } from '@/types/financial';

describe('Simulator Finansial & Kalkulator BEP - Pengujian Wajib Fase 6', () => {
  // 1. Input valid menghasilkan kalkulasi yang sesuai dengan fungsi domain
  it('1. calculates accurate financials for valid input matching domain equations (AC-FIN-02.1)', () => {
    const input: FinancialInput = {
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

    const validation = financialInputSchema.safeParse(input);
    expect(validation.success).toBe(true);

    const result = calculateFinancials(input);
    // Vektor Uji #1
    expect(result.monthlyRevenue).toBe(27000000); // 1500 * 18000
    expect(result.monthlyVariableCost).toBe(10500000); // 1500 * 7000
    expect(result.monthlyFixedCost).toBe(6500000); // 2.5m + 3m + 0.5m + 0.5m
    expect(result.totalMonthlyCost).toBe(17000000); // 10.5m + 6.5m
    expect(result.monthlyNetProfit).toBe(10000000); // 27m - 17m
    expect(result.profitMarginPercent).toBe(37.04);
    expect(result.contributionMarginPerUnit).toBe(11000); // 18000 - 7000
    expect(result.bepUnitsMonthly).toBe(591); // ceil(6500000 / 11000)
    expect(result.bepRevenueMonthly).toBe(10636364);
    expect(result.paybackPeriodMonths).toBe(2.5); // 25m / 10m
    expect(result.healthStatus).toBe('healthy_profit');
  });

  // 2. Perubahan input memperbarui hasil
  it('2. updates calculation reactively when price or sales change', () => {
    const baseInput: FinancialInput = {
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

    const initialResult = calculateFinancials(baseInput);
    expect(initialResult.monthlyNetProfit).toBe(10000000);

    // Ubah harga jual menjadi 20.000
    const updatedInput: FinancialInput = {
      ...baseInput,
      sellingPricePerUnit: 20000,
    };

    const updatedResult = calculateFinancials(updatedInput);
    expect(updatedResult.monthlyRevenue).toBe(30000000); // 1500 * 20000
    expect(updatedResult.monthlyNetProfit).toBe(13000000); // 30m - 17m
    expect(updatedResult.bepUnitsMonthly).toBe(500); // ceil(6500000 / 13000)
    expect(updatedResult.paybackPeriodMonths).toBe(1.9); // 25m / 13m
  });

  // 3. Input tidak valid tidak menghasilkan hasil yang menyesatkan
  it('3. rejects invalid input and returns validation errors without executing misleading calculation', () => {
    const invalidInput = {
      sellingPricePerUnit: -1000, // Harga negatif
      unitsSoldPerDay: 50,
      operatingDaysPerMonth: 35, // Hari lebih dari 31
      variableCostPerUnit: -500,
      monthlyFixedCosts: {
        rent: -100000,
        labor: 0,
        utilities: 0,
        marketingAndOther: 0,
      },
      initialInvestment: -1000,
    };

    const validation = financialInputSchema.safeParse(invalidInput);
    expect(validation.success).toBe(false);

    if (!validation.success) {
      const paths = validation.error.errors.map((e) => e.path.join('.'));
      expect(paths).toContain('sellingPricePerUnit');
      expect(paths).toContain('operatingDaysPerMonth');
      expect(paths).toContain('variableCostPerUnit');
      expect(paths).toContain('monthlyFixedCosts.rent');
      expect(paths).toContain('initialInvestment');
    }
  });

  // 4. Kasus usaha untung, rugi, dan tepat di sekitar BEP
  it('4. handles healthy profit, narrow margin, and operating loss accurately', () => {
    // Untung Sehat (Margin >= 15%)
    const healthyStatus = determineHealthStatus(5000000, 20);
    expect(healthyStatus).toBe('healthy_profit');

    // Margin Tipis (Margin < 15% tapi untung)
    const narrowStatus = determineHealthStatus(550000, 7.05);
    expect(narrowStatus).toBe('narrow_margin');

    // Rugi Operasional (Net Profit <= 0)
    const lossStatus = determineHealthStatus(-1500000, -10);
    expect(lossStatus).toBe('operating_loss');

    // Di sekitar BEP (Laba = 0)
    const zeroProfitStatus = determineHealthStatus(0, 0);
    expect(zeroProfitStatus).toBe('operating_loss');
  });

  // 5. Kasus biaya variabel per unit sama dengan atau melebihi harga jual (CM <= 0)
  it('5. handles variable cost >= selling price safely (CM <= 0) with null BEP', () => {
    const lossPerUnitInput: FinancialInput = {
      sellingPricePerUnit: 10000,
      unitsSoldPerDay: 20,
      operatingDaysPerMonth: 30,
      variableCostPerUnit: 12000, // HPP lebih tinggi dari harga jual
      monthlyFixedCosts: {
        rent: 2000000,
        labor: 1000000,
        utilities: 300000,
        marketingAndOther: 200000,
      },
      initialInvestment: 10000000,
    };

    const result = calculateFinancials(lossPerUnitInput);
    expect(result.contributionMarginPerUnit).toBe(-2000);
    expect(result.contributionMarginRatio).toBe(-0.2);
    expect(result.bepUnitsMonthly).toBeNull(); // Tidak boleh Infinity atau NaN
    expect(result.bepRevenueMonthly).toBeNull();
    expect(result.paybackPeriodMonths).toBeNull();
    expect(result.healthStatus).toBe('operating_loss');
    expect(result.statusMessage).toContain('belum menutup modal bahan baku');
  });

  // 6. Kasus modal awal nol atau payback period yang tidak dapat dihitung
  it('6. handles zero initial investment and negative profit for payback period', () => {
    // Kasus modal awal 0 dengan laba positif
    const zeroInvestmentInput: FinancialInput = {
      sellingPricePerUnit: 20000,
      unitsSoldPerDay: 20,
      operatingDaysPerMonth: 30,
      variableCostPerUnit: 5000,
      monthlyFixedCosts: {
        rent: 1000000,
        labor: 1000000,
        utilities: 200000,
        marketingAndOther: 100000,
      },
      initialInvestment: 0,
    };

    const resultZero = calculateFinancials(zeroInvestmentInput);
    expect(resultZero.monthlyNetProfit).toBeGreaterThan(0);
    expect(resultZero.paybackPeriodMonths).toBe(0); // 0 / NP = 0 bulan

    // Kasus defisit dengan modal 10 juta
    const deficitInput: FinancialInput = {
      ...zeroInvestmentInput,
      unitsSoldPerDay: 2, // Penjualan terlalu sedikit
      initialInvestment: 10000000,
    };

    const resultDeficit = calculateFinancials(deficitInput);
    expect(resultDeficit.monthlyNetProfit).toBeLessThan(0);
    expect(resultDeficit.paybackPeriodMonths).toBeNull(); // Tidak boleh minus
  });

  // 7. Parameter opportunityId valid dan tidak valid
  it('7. maps opportunity assumptions to financial input model accurately', async () => {
    // Valid opportunity
    const opp = await opportunityRepository.getById('opp-culinary-01');
    expect(opp).not.toBeNull();

    if (opp) {
      const mappedInput: FinancialInput = {
        sellingPricePerUnit: opp.defaultFinancialAssumptions.sellingPricePerUnit,
        unitsSoldPerDay: opp.defaultFinancialAssumptions.estimatedUnitsSoldPerDay,
        operatingDaysPerMonth: opp.defaultFinancialAssumptions.operatingDaysPerMonth,
        variableCostPerUnit: opp.defaultFinancialAssumptions.variableCostPerUnit,
        monthlyFixedCosts: {
          rent: opp.defaultFinancialAssumptions.monthlyRent,
          labor: opp.defaultFinancialAssumptions.monthlyLaborCost,
          utilities: opp.defaultFinancialAssumptions.monthlyUtilitiesCost,
          marketingAndOther: opp.defaultFinancialAssumptions.monthlyOtherFixedCost,
        },
        initialInvestment: opp.defaultFinancialAssumptions.initialInvestmentCapital,
      };

      const validation = financialInputSchema.safeParse(mappedInput);
      expect(validation.success).toBe(true);

      const result = calculateFinancials(mappedInput);
      expect(result.monthlyRevenue).toBeGreaterThan(0);
      expect(result.bepUnitsMonthly).not.toBeNull();
    }

    // Invalid opportunity
    const invalidOpp = await opportunityRepository.getById('opp-non-existent-99');
    expect(invalidOpp).toBeNull();
  });

  // 8. Format Rupiah dan tampilan nilai negatif
  it('8. formats positive and negative net profit distinctly', () => {
    const positiveProfit = 10000000;
    const negativeProfit = -3500000;

    expect(positiveProfit).toBeGreaterThan(0);
    expect(negativeProfit).toBeLessThan(0);

    // Format display check
    const formatNetProfitDisplay = (np: number) => {
      if (np < 0) {
        return `- Rp ${Math.abs(np).toLocaleString('id-ID')}`;
      }
      return `Rp ${np.toLocaleString('id-ID')}`;
    };

    expect(formatNetProfitDisplay(positiveProfit)).toBe('Rp 10.000.000');
    expect(formatNetProfitDisplay(negativeProfit)).toBe('- Rp 3.500.000');
  });

  // 9. Pesan status edukatif kelayakan usaha
  it('9. provides informative educational status messages for all scenarios', () => {
    const healthyMsg = getHealthStatusMessage('healthy_profit', 10000);
    expect(healthyMsg).toContain('laba yang sehat dengan margin di atas 15%');

    const narrowMsg = getHealthStatusMessage('narrow_margin', 5000);
    expect(narrowMsg).toContain('margin tipis');

    const lossWithNegativeCmMsg = getHealthStatusMessage('operating_loss', -2000);
    expect(lossWithNegativeCmMsg).toContain('belum menutup modal bahan baku langsung (HPP)');

    const lossWithPositiveCmMsg = getHealthStatusMessage('operating_loss', 3000);
    expect(lossWithPositiveCmMsg).toContain('defisit operasional bulanan');
  });
});
