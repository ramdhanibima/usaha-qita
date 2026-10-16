/**
 * Modul Penyimpanan Lokal Aman (Safe Storage) (TASK-CORE-04, REQ-PROF-03, AC-PROF-03.1).
 * Melindungi aplikasi dari crash akibat kegagalan localStorage (mode private browsing,
 * kuota penyimpanan penuh, atau SSR) dengan fallback in-memory cache otomatis.
 */

class SafeStorage {
  private memoryFallback: Map<string, string> = new Map();

  private isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      const testKey = '__storage_test__';
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Mengambil item dari storage secara aman dengan deserialisasi JSON otomatis.
   */
  getItem<T>(key: string, defaultValue: T): T {
    try {
      if (this.isLocalStorageAvailable()) {
        const raw = window.localStorage.getItem(key);
        if (raw === null) return defaultValue;
        return JSON.parse(raw) as T;
      } else {
        const raw = this.memoryFallback.get(key);
        if (!raw) return defaultValue;
        return JSON.parse(raw) as T;
      }
    } catch {
      // Jika parsing JSON gagal atau ada SecurityError, kembalikan nilai default tanpa crash
      return defaultValue;
    }
  }

  /**
   * Menyimpan item ke storage secara aman dengan serialisasi JSON.
   */
  setItem<T>(key: string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      if (this.isLocalStorageAvailable()) {
        window.localStorage.setItem(key, serialized);
        return true;
      } else {
        this.memoryFallback.set(key, serialized);
        return true;
      }
    } catch {
      // Jika localStorage penuh (QuotaExceededError), fallback simpan di memori
      try {
        this.memoryFallback.set(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Menghapus item dari storage secara aman.
   */
  removeItem(key: string): boolean {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.removeItem(key);
      }
      this.memoryFallback.delete(key);
      return true;
    } catch {
      this.memoryFallback.delete(key);
      return false;
    }
  }

  /**
   * Mengosongkan seluruh item.
   */
  clear(): void {
    try {
      if (this.isLocalStorageAvailable()) {
        window.localStorage.clear();
      }
      this.memoryFallback.clear();
    } catch {
      this.memoryFallback.clear();
    }
  }
}

export const safeStorage = new SafeStorage();

