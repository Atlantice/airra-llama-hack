// src/types/index.ts

// src/types/index.ts
export type AnalysisResult = {
  contentTypes: string[];
  suggestedPermissions: Record<string, string[]>;
  attributionRequirements: string[];
  restrictions: string[];
};

export interface CrawlerResult {
  url: string;
  content: string;
  title?: string;
  metadata?: Record<string, string>;
}

export interface ValidationResult {
  isValid: boolean;
  permissions: {
    allowed: string[];
    restricted: string[];
    requiresAttribution: boolean;
    commercialUse: boolean;
  };
  errors?: string[];
  warnings?: string[];
}

export interface AirraTxtConfig {
  global: {
    allowAiUsage: "full" | "partial" | "none";
    defaultLicense: string;
    creator: {
      name: string;
      contact: string;
    };
    contentUpdateFrequency: string;
  };
  contentRules: Array<{
    type: string;
    allowUsage: boolean;
    allowedUsageTypes: string[];
    includePath?: string[];
    excludePath?: string[];
  }>;
}
