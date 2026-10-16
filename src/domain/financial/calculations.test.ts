import { describe, it, expect } from 'vitest';
import {
  calculateFinancials,
  determineHealthStatus,
  getHealthStatusMessage,
} from './calculations';
import { FinancialInput } from '@/types/financial';

describe('Mesin Hitung Finansial Deterministik Usaha Qita', () => {
  describe('Vektor Uji #1: Kedai Kopi Susu (Skenario Untung Sehat - AC-FIN-02.1)', () => {
    const coffeeShopInput: FinancialInput = {
      sellingPricePerUnit: 18000,
      unitsSoldPerDay: 50,
      operatingDaysPerMonth: 30, // Q = 1.500 unit
      variableCostPerUnit: 7000, // HPP per cup
      monthlyFixedCosts: {
        rent: 2500000,
        labor: 3000000,
        utilities: 500000,
        marketingAndOther: 500000,
      }, // Total FC = 6.500.000
      initialInvestment: 25000000,
    };

    it('menghitung omzet, biaya total, dan laba bersih dengan tepat', () => {
      const result = calculateFinancials(coffeeShopInput);

      expect(result.monthlyRevenue).toBe(27000000);
      expect(result.monthlyVariableCost).toBe(10500000);
      expect(result.monthlyFixedCost).toBe(6500000);
      expect(result.totalMonthlyCost).toBe(17000000);
      expect(result.monthlyNetProfit).toBe(10000000);
    });

    it('menghitung profit margin dan margin kontribusi per unit', () => {
      const result = calculateFinancials(coffeeShopInput);

      expect(result.contributionMarginPerUnit).toBe(11000);
      expect(result.profitMarginPercent).toBe(37.04);
    });

    it('menghitung titik impas (BEP) unit dan BEP Rupiah (AC-FIN-03.1)', () => {
      const result = calculateFinancials(coffeeShopInput);

      // BEP Unit = ceil(6.500.000 / 11.000) = ceil(590.909) = 591
      expect(result.bepUnitsMonthly).toBe(591);
      // BEP Rupiah = round(6.500.000 / (11.000 / 18.000)) = 10.636.364
      expect(result.bepRevenueMonthly).toBe(10636364);
    });

    it('menghitung payback period dan status kelayakan finansial (AC-FIN-04.1 & AC-FIN-05.1)', () => {
      const result = calculateFinancials(coffeeShopInput);

      // Payback Period = 25.000.000 / 10.000.000 = 2.5 bulan
      expect(result.paybackPeriodMonths).toBe(2.5);
      expect(result.healthStatus).toBe('healthy_profit');
      expect(result.statusMessage).toContain('margin di atas 15%');
    });
  });

  describe('Vektor Uji #2: Toko Baju Anak (Skenario Margin Tipis - AC-FIN-02.2)', () => {
    const clothingStoreInput: FinancialInput = {
      sellingPricePerUnit: 60000,
      unitsSoldPerDay: 5,
      operatingDaysPerMonth: 26, // Q = 130 unit
      variableCostPerUnit: 45000, // HPP per potong
      monthlyFixedCosts: {
        rent: 1000000,
        labor: 0,
        utilities: 200000,
        marketingAndOther: 200000,
      }, // Total FC = 1.400.000
      initialInvestment: 10000000,
    };

    it('menghitung omzet, biaya, dan laba bersih dengan tepat', () => {
      const result = calculateFinancials(clothingStoreInput);

      expect(result.monthlyRevenue).toBe(7800000);
      expect(result.monthlyVariableCost).toBe(5850000);
      expect(result.monthlyFixedCost).toBe(1400000);
      expect(result.totalMonthlyCost).toBe(7250000);
      expect(result.monthlyNetProfit).toBe(550000);
    });

    it('menghitung profit margin dan margin kontribusi per unit', () => {
      const result = calculateFinancials(clothingStoreInput);

      expect(result.contributionMarginPerUnit).toBe(15000);
      // PM = (550.000 / 7.800.000) * 100 = 7.05128% => 7.05%
      expect(result.profitMarginPercent).toBe(7.05);
    });

    it('menghitung BEP unit, BEP Rupiah, dan payback period (AC-FIN-03.1 & AC-FIN-04.1)', () => {
      const result = calculateFinancials(clothingStoreInput);

      // BEP Unit = ceil(1.400.000 / 15.000) = ceil(93.33) = 94 unit
      expect(result.bepUnitsMonthly).toBe(94);
      // BEP Rupiah = round(1.400.000 / (15.000 / 60.000)) = round(1.400.000 / 0.25) = 5.600.000
      expect(result.bepRevenueMonthly).toBe(5600000);
      // Payback Period = round(10.000.000 / 550.000, 1) = 18.2 bulan
      expect(result.paybackPeriodMonths).toBe(18.2);
      expect(result.healthStatus).toBe('narrow_margin');
      expect(result.statusMessage).toContain('margin tipis');
    });
  });

  describe('Vektor Uji #3: Kondisi Defisit & Batas Kritis (AC-FIN-02.3, AC-FIN-03.1, AC-FIN-04.1)', () => {
    it('menangani harga jual lebih rendah dari biaya bahan baku (CM <= 0)', () => {
      const underpricedInput: FinancialInput = {
        sellingPricePerUnit: 8000,
        unitsSoldPerDay: 20,
        operatingDaysPerMonth: 30, // Q = 600
        variableCostPerUnit: 10000, // HPP lebih tinggi daripada harga jual (CM = -2000)
        monthlyFixedCosts: {
          rent: 1000000,
          labor: 1000000,
          utilities: 200000,
          marketingAndOther: 100000,
        },
        initialInvestment: 5000000,
      };

      const result = calculateFinancials(underpricedInput);

      expect(result.contributionMarginPerUnit).toBe(-2000);
      // BEP tidak dapat dicapai karena setiap penjualan menambah kerugian
      expect(result.bepUnitsMonthly).toBeNull();
      expect(result.bepRevenueMonthly).toBeNull();
      expect(result.monthlyNetProfit).toBeLessThan(0);
      expect(result.paybackPeriodMonths).toBeNull();
      expect(result.healthStatus).toBe('operating_loss');
      expect(result.statusMessage).toContain('belum menutup modal bahan baku langsung');
    });

    it('menangani penjualan rendah yang tidak mampu menutup biaya tetap (NP < 0)', () => {
      const lowSalesInput: FinancialInput = {
        sellingPricePerUnit: 20000,
        unitsSoldPerDay: 2,
        operatingDaysPerMonth: 25, // Q = 50 unit (Omzet = 1.000.000)
        variableCostPerUnit: 10000, // VC = 500.000
        monthlyFixedCosts: {
          rent: 1500000,
          labor: 0,
          utilities: 200000,
          marketingAndOther: 100000,
        }, // FC = 1.800.000, TC = 2.300.000 => NP = -1.300.000
        initialInvestment: 15000000,
      };

      const result = calculateFinancials(lowSalesInput);

      expect(result.monthlyNetProfit).toBe(-1300000);
      expect(result.paybackPeriodMonths).toBeNull();
      expect(result.healthStatus).toBe('operating_loss');
      // BEP tetap bernilai valid karena CM > 0
      expect(result.bepUnitsMonthly).toBe(Math.ceil(1800000 / 10000)); // 180 unit
      expect(result.bepRevenueMonthly).toBe(3600000);
    });

    it('menangani kasus ekstrem nol penjualan (toko tutup sementara / 0 unit per hari)', () => {
      const zeroSalesInput: FinancialInput = {
        sellingPricePerUnit: 15000,
        unitsSoldPerDay: 0,
        operatingDaysPerMonth: 30,
        variableCostPerUnit: 8000,
        monthlyFixedCosts: {
          rent: 1000000,
          labor: 0,
          utilities: 100000,
          marketingAndOther: 0,
        },
        initialInvestment: 5000000,
      };

      const result = calculateFinancials(zeroSalesInput);

      expect(result.monthlyRevenue).toBe(0);
      expect(result.monthlyVariableCost).toBe(0);
      expect(result.monthlyNetProfit).toBe(-1100000);
      // Pembagian dengan nol harus menghasilkan 0% tanpa melempar NaN atau Infinity
      expect(result.profitMarginPercent).toBe(0);
      expect(result.paybackPeriodMonths).toBeNull();
      expect(result.healthStatus).toBe('operating_loss');
    });

    it('menangani kasus modal investasi awal 0 Rupiah', () => {
      const zeroInvestmentInput: FinancialInput = {
        sellingPricePerUnit: 25000,
        unitsSoldPerDay: 10,
        operatingDaysPerMonth: 30,
        variableCostPerUnit: 10000,
        monthlyFixedCosts: {
          rent: 500000,
          labor: 0,
          utilities: 100000,
          marketingAndOther: 0,
        },
        initialInvestment: 0,
      };

      const result = calculateFinancials(zeroInvestmentInput);

      expect(result.monthlyNetProfit).toBe(3900000);
      expect(result.paybackPeriodMonths).toBe(0);
    });
  });

  describe('Fungsi Helper Kesehatan Finansial', () => {
    it('mengklasifikasikan status kelayakan dengan benar', () => {
      expect(determineHealthStatus(5000000, 20)).toBe('healthy_profit');
      expect(determineHealthStatus(5000000, 15)).toBe('healthy_profit');
      expect(determineHealthStatus(500000, 14.99)).toBe('narrow_margin');
      expect(determineHealthStatus(0, 0)).toBe('operating_loss');
      expect(determineHealthStatus(-100000, -5)).toBe('operating_loss');
    });

    it('menghasilkan pesan edukatif yang tepat untuk setiap status', () => {
      const healthyMsg = getHealthStatusMessage('healthy_profit', 5000);
      const narrowMsg = getHealthStatusMessage('narrow_margin', 2000);
      const lossMsgNormal = getHealthStatusMessage('operating_loss', 1000);
      const lossMsgUnderpriced = getHealthStatusMessage('operating_loss', -500);

      expect(healthyMsg).toContain('margin di atas 15%');
      expect(narrowMsg).toContain('margin tipis');
      expect(lossMsgNormal).toContain('defisit operasional');
      expect(lossMsgUnderpriced).toContain('belum menutup modal bahan baku');
    });
  });
});

