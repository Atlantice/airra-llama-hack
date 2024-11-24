// lib/utils/cache.ts
"use client";

class ClientCache {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== "undefined";
  }

  get(key: string): any {
    if (!this.isClient) return null;

    try {
      const item = window.localStorage.getItem(`airra:${key}`);
      if (!item) return null;

      const { data, timestamp } = JSON.parse(item);
      const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

      if (Date.now() - timestamp > CACHE_DURATION) {
        window.localStorage.removeItem(`airra:${key}`);
        return null;
      }

      return data;
    } catch {
      return null;
    }
  }

  set(key: string, data: any): void {
    if (!this.isClient) return;

    try {
      const entry = {
        data,
        timestamp: Date.now(),
      };
      window.localStorage.setItem(`airra:${key}`, JSON.stringify(entry));
    } catch {
      // Handle error silently
    }
  }

  clear(key: string): void {
    if (!this.isClient) return;
    window.localStorage.removeItem(`airra:${key}`);
  }
}

// Export a singleton instance
export const clientCache = new ClientCache();
