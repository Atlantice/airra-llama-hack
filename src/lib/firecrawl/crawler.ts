// src/lib/firecrawl/crawler.ts
import { MockContentCrawler } from "./mock-crawler";
import type { CrawlResult } from "./types";

export class ContentCrawler {
  private crawler: MockContentCrawler;

  constructor() {
    this.crawler = new MockContentCrawler();
  }

  async crawlWebsite(url: string): Promise<CrawlResult> {
    return this.crawler.crawlWebsite(url);
  }
}
