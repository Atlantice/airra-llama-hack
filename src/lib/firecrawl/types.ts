// src/lib/firecrawl/types.ts
export interface CrawlResult {
  url: string;
  content: string;
  links: string[];
  status: number;
  headers: Record<string, string>;
  title?: string;
  metadata?: Record<string, any>;
}

// src/types.ts
export type AnalysisResult = {
  contentTypes: string[];
  suggestedPermissions: { [key: string]: string[] };
  attributionRequirements: string[];
  restrictions: string[];
};
