import { ConsultationRequest } from '@/types/consultation';
import { safeStorage } from '@/lib/safe-storage';
import { generateTicketReference } from '@/domain/consultation/ticket-generator';

const STORAGE_KEY_CONSULTATIONS = 'usaha_qita_consultation_history';
const STORAGE_KEY_LATEST = 'usaha_qita_last_consultation_ticket';

/**
 * Kontrak Interface Repository Konsultasi Mantri BRI (Port)
 */
export interface IConsultationRepository {
  createSimulationRequest(
    data: Omit<ConsultationRequest, 'id' | 'referenceNumber' | 'submittedAt' | 'status'>,
    customReference?: string
  ): Promise<ConsultationRequest>;
  getAll(): Promise<ConsultationRequest[]>;
  getLatest(): Promise<ConsultationRequest | null>;
  getById(id: string): Promise<ConsultationRequest | null>;
  getByReference(referenceNumber: string): Promise<ConsultationRequest | null>;
  clearHistory(): Promise<void>;
}

/**
 * Implementasi Mock Consultation Repository berbasis SafeStorage lokal.
 * Tidak mengirim data apa pun ke server luar atau sistem perbankan resmi (Zero Secret Leakage).
 */
export class MockConsultationRepository implements IConsultationRepository {
  private readonly artificialDelayMs: number;

  constructor(artificialDelayMs: number = 300) {
    this.artificialDelayMs =
      process.env.NODE_ENV === 'test' ? 0 : artificialDelayMs;
  }

  private async simulateLatency(): Promise<void> {
    if (this.artificialDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.artificialDelayMs));
    }
  }

  async createSimulationRequest(
    data: Omit<ConsultationRequest, 'id' | 'referenceNumber' | 'submittedAt' | 'status'>,
    customReference?: string
  ): Promise<ConsultationRequest> {
    await this.simulateLatency();

    const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const referenceNumber = customReference || generateTicketReference();
    const submittedAt = new Date().toISOString();

    const record: ConsultationRequest = {
      ...data,
      id,
      referenceNumber,
      submittedAt,
      status: 'simulation_sent',
    };

    const history = safeStorage.getItem<ConsultationRequest[]>(
      STORAGE_KEY_CONSULTATIONS,
      []
    );
    history.unshift(record);
    safeStorage.setItem(STORAGE_KEY_CONSULTATIONS, history);
    safeStorage.setItem(STORAGE_KEY_LATEST, record);

    return { ...record };
  }

  async getAll(): Promise<ConsultationRequest[]> {
    await this.simulateLatency();
    const history = safeStorage.getItem<ConsultationRequest[]>(
      STORAGE_KEY_CONSULTATIONS,
      []
    );
    return history.map((item) => ({ ...item }));
  }

  async getLatest(): Promise<ConsultationRequest | null> {
    await this.simulateLatency();
    const latest = safeStorage.getItem<ConsultationRequest | null>(
      STORAGE_KEY_LATEST,
      null
    );
    return latest ? { ...latest } : null;
  }

  async getById(id: string): Promise<ConsultationRequest | null> {
    await this.simulateLatency();
    const history = safeStorage.getItem<ConsultationRequest[]>(
      STORAGE_KEY_CONSULTATIONS,
      []
    );
    const found = history.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  async getByReference(referenceNumber: string): Promise<ConsultationRequest | null> {
    await this.simulateLatency();
    const history = safeStorage.getItem<ConsultationRequest[]>(
      STORAGE_KEY_CONSULTATIONS,
      []
    );
    const found = history.find((item) => item.referenceNumber === referenceNumber);
    return found ? { ...found } : null;
  }

  async clearHistory(): Promise<void> {
    await this.simulateLatency();
    safeStorage.removeItem(STORAGE_KEY_CONSULTATIONS);
    safeStorage.removeItem(STORAGE_KEY_LATEST);
  }
}

export const consultationRepository = new MockConsultationRepository();

