// src/app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { LlamaAnalyzer } from "@/lib/llama/client";
import { ContentCrawler } from "@/lib/firecrawl/crawler";
import { parseAnalysis } from "@/lib/utils/analysis-parser";
import type { AnalysisResult } from "@/types";

const analyzer = new LlamaAnalyzer();
const crawler = new ContentCrawler();

export async function POST(req: Request) {
  try {
    const { url, preferences } = await req.json();

    console.log("Starting analysis for:", url);

    // Use the mocked crawler
    const crawledContent = await crawler.crawlWebsite(url);
    console.log("Mocked crawl completed");

    // Analyze with Llama
    const analysis = await analyzer.analyzeContent(crawledContent, preferences);
    console.log("Llama analysis completed");

    // Parse and structure the response
    const structuredAnalysis = parseAnalysis(JSON.stringify(analysis));

    return NextResponse.json({
      success: true,
      analysis: structuredAnalysis,
    });
  } catch (error: unknown) {
    console.error("Analysis failed:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
