// lib/firecrawl/config.ts
export interface FireCrawlConfig {
  maxLinks: number;
  maxPages: number;
  timeout: number;
  headers?: Record<string, string>;
  userAgent?: string;
}

export const defaultConfig: FireCrawlConfig = {
  maxLinks: 10,
  maxPages: 10,
  timeout: 30000,
  userAgent: "Airra-Content-Analyzer",
  headers: {
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en",
  },
};
