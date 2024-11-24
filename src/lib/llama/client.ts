// src/lib/llama/client.ts
import Groq from "groq-sdk";
import type { CrawlResult } from "../firecrawl/types";
import type { AnalysisResult } from "@/types";

export class LlamaAnalyzer {
  private client: Groq;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not defined");
    }

    this.client = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  async analyzeContent(
    crawlResult: CrawlResult,
    userPreferences: string
  ): Promise<AnalysisResult> {
    try {
      const prompt = `As an AI content permission analyzer, analyze this website content and generate an airra.txt configuration.

      Website Content:
      URL: ${crawlResult.url}
      Title: ${crawlResult.title || ""}
      Content: ${this.sanitizeContent(crawlResult.content).substring(0, 1500)}
      Links: ${crawlResult.links?.join(", ")}

      User Preferences:
      ${userPreferences}

      Generate a structured analysis in the following JSON format:
      {
        "contentTypes": ["list of detected content types"],
        "suggestedPermissions": {
          "content-type-1": ["permission1", "permission2"],
          "content-type-2": ["permission1", "permission2"]
        },
        "attributionRequirements": ["list of attribution requirements"],
        "restrictions": ["list of usage restrictions"]
      }

      Ensure your response is valid JSON. Do not include any explanation or text outside the JSON structure.`;

      const completion = await this.client.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "You are an AI expert at analyzing websites and recommending content permissions. Always respond with valid JSON in the specified format.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        model: "llama3-8b-8192", // Using Mixtral model for better structured output
        temperature: 0.3, // Lower temperature for more consistent structured output
        max_tokens: 2048,
        top_p: 1,
        stream: false,
      });

      const result = completion.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No analysis generated");
      }

      // Parse and validate the response
      return this.parseAndValidateResponse(result);
    } catch (error) {
      console.error("Error in Llama analysis:", error);
      if (error instanceof Error) {
        throw new Error(`Failed to analyze content: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred during Llama analysis");
      }
    }
  }

  private parseAndValidateResponse(response: string): AnalysisResult {
    try {
      // Try to parse as JSON
      const parsedResponse = JSON.parse(response.trim()) as AnalysisResult;

      // Validate the structure
      this.validateAnalysisResult(parsedResponse);

      return parsedResponse;
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      // Instead of falling back to text parsing, throw an error
      throw new Error("Failed to parse Llama response as JSON");
    }
  }

  private validateAnalysisResult(
    result: AnalysisResult
  ): asserts result is AnalysisResult {
    const requiredFields = [
      "contentTypes",
      "suggestedPermissions",
      "attributionRequirements",
      "restrictions",
    ];

    for (const field of requiredFields) {
      if (!(field in result)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate types
    if (!Array.isArray(result.contentTypes)) {
      throw new Error("contentTypes must be an array");
    }

    if (!Array.isArray(result.attributionRequirements)) {
      throw new Error("attributionRequirements must be an array");
    }

    if (!Array.isArray(result.restrictions)) {
      throw new Error("restrictions must be an array");
    }

    if (
      typeof result.suggestedPermissions !== "object" ||
      result.suggestedPermissions === null
    ) {
      throw new Error("suggestedPermissions must be an object");
    }
  }

  private sanitizeContent(content: string): string {
    return content
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
