import { describe, it, expect, beforeEach } from 'vitest';
import { MockConsultationRepository } from './consultation.repository';
import { safeStorage } from '@/lib/safe-storage';

describe('MockConsultationRepository (REQ-MANTRI-01, REQ-MANTRI-03, AC-MANTRI-03.1)', () => {
  let repository: MockConsultationRepository;

  beforeEach(() => {
    safeStorage.clear();
    repository = new MockConsultationRepository(0); // 0ms delay untuk tes cepat
  });

  it('menerbitkan tiket permohonan konsultasi baru dengan nomor referensi terstandarisasi', async () => {
    const result = await repository.createSimulationRequest(
      {
        fullName: 'Bambang Sudiro',
        phoneNumber: '081399887766',
        preferredLocation: 'Kecamatan Gondokusuman, Yogyakarta',
        businessTopic: 'cashflow_management',
        explicitConsentGiven: true,
        disclaimerAcknowledged: true,
      },
      'UQ-MNT-202610-TEST'
    );

    expect(result.id).toBeDefined();
    expect(result.referenceNumber).toBe('UQ-MNT-202610-TEST');
    expect(result.status).toBe('simulation_sent');
    expect(result.fullName).toBe('Bambang Sudiro');
  });

  it('menyimpan dan mengambil kembali tiket terakhir yang diterbitkan', async () => {
    await repository.createSimulationRequest(
      {
        fullName: 'Rina Kusuma',
        phoneNumber: '081234567890',
        preferredLocation: 'Kecamatan Menteng, Jakarta Pusat',
        businessTopic: 'financial_literacy',
        explicitConsentGiven: true,
        disclaimerAcknowledged: true,
      },
      'UQ-MNT-202610-RINA'
    );

    const latest = await repository.getLatest();
    expect(latest).not.toBeNull();
    expect(latest?.fullName).toBe('Rina Kusuma');
    expect(latest?.referenceNumber).toBe('UQ-MNT-202610-RINA');
  });

  it('mengambil tiket berdasarkan nomor referensi unik', async () => {
    await repository.createSimulationRequest(
      {
        fullName: 'Ahmad Faiz',
        phoneNumber: '081223344556',
        preferredLocation: 'Kecamatan Denpasar Selatan',
        businessTopic: 'business_expansion',
        explicitConsentGiven: true,
        disclaimerAcknowledged: true,
      },
      'UQ-MNT-202610-FAIZ'
    );

    const found = await repository.getByReference('UQ-MNT-202610-FAIZ');
    expect(found).not.toBeNull();
    expect(found?.referenceNumber).toBe('UQ-MNT-202610-FAIZ');
    expect(found?.businessTopic).toBe('business_expansion');

    const notFound = await repository.getByReference('UQ-MNT-999999-NONE');
    expect(notFound).toBeNull();
  });
});

