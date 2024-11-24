"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function Validator() {
  const [isValidating, setIsValidating] = useState(false);
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<any>(null);

  const validateAirraTxt = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsValidating(true);

    try {
      let parsedConfig;
      if (url === "https://airra.ai") {
        // Mock example for airra.ai
        parsedConfig = {
          contentTypes: ["article", "image", "video"],
          allowedUsageTypes: {
            article: ["inference", "generation"],
            image: ["inference"],
            video: ["inference"],
          },
          attributionRequirements: [
            "Provide attribution to the original creator",
            "Do not use content for commercial purposes without permission",
          ],
          restrictions: [
            "Do not modify the content without permission",
            "Do not use the content in a way that could be harmful or misleading",
          ],
          creator: "Airra AI",
        };
      } else {
        const response = await fetch(`${url}/airra.txt`);
        if (response.ok) {
          const airraTxt = await response.text();
          parsedConfig = parseAirraTxt(airraTxt);
        } else {
          parsedConfig = {
            error: "Airra.txt file not found",
            contentTypes: [],
            allowedUsageTypes: {},
            attributionRequirements: [],
            restrictions: [],
            creator: "",
          };
        }
      }
      setResult(parsedConfig);
    } catch (error) {
      console.error("Validation failed:", error);
      setResult({
        error: "Error validating Airra.txt",
        contentTypes: [],
        allowedUsageTypes: {},
        attributionRequirements: [],
        restrictions: [],
        creator: "",
      });
    } finally {
      setIsValidating(false);
    }
  };

  const parseAirraTxt = (content: string) => {
    const lines = content.split("\n");
    const config: any = {
      contentTypes: [],
      allowedUsageTypes: {},
      attributionRequirements: [],
      restrictions: [],
      creator: "",
    };

    let currentSection: string | null = null;
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("#")) {
        // Skip comments
        continue;
      } else if (trimmedLine.startsWith("-")) {
        // Parse list items
        if (currentSection === "content_rules") {
          const type = trimmedLine.split(":")[1].trim();
          config.contentTypes.push(type);
          const allowedUsageTypesLine = trimmedLine.split(":")[2];
          if (allowedUsageTypesLine) {
            config.allowedUsageTypes[type] = allowedUsageTypesLine
              .split("-")
              .map((t) => t.trim());
          } else {
            config.allowedUsageTypes[type] = ["inference"];
          }
        } else if (currentSection === "attribution") {
          config.attributionRequirements.push(trimmedLine.slice(2).trim());
        } else if (currentSection === "restrictions") {
          config.restrictions.push(trimmedLine.slice(2).trim());
        }
      } else if (trimmedLine.startsWith("global:")) {
        currentSection = "global";
      } else if (trimmedLine.startsWith("content_rules:")) {
        currentSection = "content_rules";
      } else if (trimmedLine.startsWith("attribution:")) {
        currentSection = "attribution";
      } else if (trimmedLine.startsWith("restrictions:")) {
        currentSection = "restrictions";
      } else if (trimmedLine.startsWith("creator:")) {
        config.creator = trimmedLine.split(":")[1].trim();
      }
    }

    return config;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Validate Airra.txt</h1>

      <Card>
        <CardHeader>
          <CardTitle>Validation</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={validateAirraTxt} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Website URL</label>
              <div className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://your-website.com"
                  required
                />
                <Button type="submit" disabled={isValidating}>
                  {isValidating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating
                    </>
                  ) : (
                    "Validate"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Validation Results</CardTitle>
          </CardHeader>
          <CardContent>
            {result.error ? (
              <div className="text-red-500 flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                {result.error}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p>
                    <span className="font-medium">Creator:</span>{" "}
                    {result.creator || "Not specified"}
                  </p>
                </div>
                <div className="mb-4">
                  <p className="font-medium">Content Types:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.contentTypes.length > 0 ? (
                      result.contentTypes.map((type: string, index: number) => (
                        <li key={index}>
                          {type}{" "}
                          {result.allowedUsageTypes[type]?.length > 0 ? (
                            <span className="text-green-500 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Allowed:{" "}
                              {result.allowedUsageTypes[type].join(", ")}
                            </span>
                          ) : (
                            <span className="text-red-500 flex items-center gap-1">
                              <XCircle className="h-4 w-4" />
                              Not allowed
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li>No content types specified</li>
                    )}
                  </ul>
                </div>
                <div className="mb-4">
                  <p className="font-medium">Attribution Requirements:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.attributionRequirements.length > 0 ? (
                      result.attributionRequirements.map(
                        (req: string, index: number) => (
                          <li key={index}>{req}</li>
                        )
                      )
                    ) : (
                      <li>No attribution requirements specified</li>
                    )}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Restrictions:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    {result.restrictions.length > 0 ? (
                      result.restrictions.map(
                        (restriction: string, index: number) => (
                          <li key={index}>{restriction}</li>
                        )
                      )
                    ) : (
                      <li>No restrictions specified</li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
