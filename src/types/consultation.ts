export type BusinessTopic =
  | 'financial_literacy'
  | 'cashflow_management'
  | 'business_expansion'
  | 'general_advice';

export interface ConsultationRequest {
  id: string;
  referenceNumber: string; // Format: "UQ-MNT-[YYYYMM]-[XXXX]"
  fullName: string;
  phoneNumber: string; // Format Indonesia: 08xx / +62
  preferredLocation: string; // Alamat / Kecamatan unit kerja terdekat
  businessTopic: BusinessTopic;
  businessProfileSnapshot?: {
    category: string;
    plannedCapital: number;
    projectedNetProfit: number;
  };
  notes?: string;
  explicitConsentGiven: boolean; // Wajib true sebelum kirim
  disclaimerAcknowledged: boolean; // Wajib true sebelum kirim
  submittedAt: string; // ISO Date String
  status: 'simulation_sent';
}

