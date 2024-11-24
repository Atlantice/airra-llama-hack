// lib/utils/analysis-parser.ts
interface ParsedAnalysis {
  contentTypes: string[];
  suggestedPermissions: {
    [type: string]: string[];
  };
  attributionRequirements: string[];
  restrictions: string[];
}

export function parseAnalysis(analysisText: string): ParsedAnalysis {
  try {
    // If the response is already JSON
    if (typeof analysisText === "object") {
      return analysisText as ParsedAnalysis;
    }

    // Try to parse if it's a JSON string
    try {
      return JSON.parse(analysisText);
    } catch {
      // If not JSON, parse the text format
      const sections = analysisText.split("\n\n");

      return {
        contentTypes: extractList(
          sections.find((s) => s.includes("Content Types")) || ""
        ),
        suggestedPermissions: extractPermissions(
          sections.find((s) => s.includes("Permissions")) || ""
        ),
        attributionRequirements: extractList(
          sections.find((s) => s.includes("Attribution")) || ""
        ),
        restrictions: extractList(
          sections.find((s) => s.includes("Restrictions")) || ""
        ),
      };
    }
  } catch (error) {
    console.error("Error parsing analysis:", error);
    return {
      contentTypes: [],
      suggestedPermissions: {},
      attributionRequirements: [],
      restrictions: [],
    };
  }
}

function extractList(text: string): string[] {
  return text
    .split("\n")
    .filter((line) => line.trim().startsWith("-"))
    .map((line) => line.trim().replace(/^-\s*/, ""));
}

function extractPermissions(text: string): { [key: string]: string[] } {
  const permissions: { [key: string]: string[] } = {};
  let currentType: string | null = null;

  text.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed.endsWith(":")) {
      currentType = trimmed.slice(0, -1);
      permissions[currentType] = [];
    } else if (currentType && trimmed.startsWith("-")) {
      permissions[currentType].push(trimmed.replace(/^-\s*/, ""));
    }
  });

  return permissions;
}
