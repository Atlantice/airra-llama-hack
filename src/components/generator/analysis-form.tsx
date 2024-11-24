// src/components/generator/analysis-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { clientCache } from "@/lib/utils/cache";
import { Loader2, Copy, Download } from "lucide-react";

const generateAirraTxt = (result: any) => `# airra.txt

# Global Settings
global:
  allow_ai_usage: partial
  content_update_frequency: weekly

# Content-Specific Rules
content_rules:
${result.contentTypes
  .map(
    (type: string) => `  - type: ${type}
    allow_usage: true
    allowed_usage_types:
${
  result.suggestedPermissions[type]
    ?.map((perm: string) => `      - ${perm}`)
    .join("\n") || "      - inference"
}`
  )
  .join("\n\n")}

# Attribution Requirements
attribution:
${result.attributionRequirements.map((req: string) => `  - ${req}`).join("\n")}

# Access Restrictions
restrictions:
${result.restrictions
  .map((restriction: string) => `  - ${restriction}`)
  .join("\n")}`;

const AirraConfigEditor = ({ initialConfig }: { initialConfig: any }) => {
  const [config, setConfig] = useState(initialConfig);
  const [airraTxt, setAirraTxt] = useState(generateAirraTxt(initialConfig));

  const handleDownload = () => {
    const blob = new Blob([airraTxt], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "airra.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(airraTxt);
      // Could add a toast notification here
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            airra.txt Preview & Editor
            <div className="space-x-2">
              <Button variant="outline" size="icon" onClick={handleCopy}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Textarea
                value={airraTxt}
                onChange={(e) => setAirraTxt(e.target.value)}
                className="font-mono min-h-[400px]"
              />
            </div>
            <div>
              <Alert>
                <AlertTitle>Setup Instructions</AlertTitle>
                <AlertDescription className="space-y-2">
                  <p>To use airra.txt on your website:</p>
                  <ol className="list-decimal ml-4 space-y-1">
                    <li>Download or copy the generated airra.txt file</li>
                    <li>
                      Place it in your website's root directory (e.g.,
                      https://yoursite.com/airra.txt)
                    </li>
                    <li>Verify it's accessible by visiting the URL directly</li>
                  </ol>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// AnalysisResult component
const AnalysisResult = ({ result }: { result: any }) => (
  <div className="space-y-6">
    <Alert>
      <AlertTitle>Analysis Complete</AlertTitle>
      <AlertDescription>
        Website content analyzed and permissions generated
      </AlertDescription>
    </Alert>

    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Content Types</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-1">
            {result.contentTypes.map((type: string, index: number) => (
              <li key={index}>{type}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attribution Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-4 space-y-1">
            {result.attributionRequirements.map(
              (req: string, index: number) => (
                <li key={index}>{req}</li>
              )
            )}
          </ul>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle>Suggested Permissions</CardTitle>
      </CardHeader>
      <CardContent>
        {Object.entries(result.suggestedPermissions).map(
          ([type, permissions]: [string, any]) => (
            <div key={type} className="mb-4">
              <h4 className="font-medium mb-2">{type}</h4>
              <ul className="list-disc pl-4 space-y-1">
                {permissions.map((permission: string, index: number) => (
                  <li key={index}>{permission}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </CardContent>
    </Card>

    {/* Add the editor component */}
    <AirraConfigEditor initialConfig={result} />
  </div>
);

// Main AnalysisForm component
export function AnalysisForm() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [url, setUrl] = useState("");
  const [preferences, setPreferences] = useState("");
  const [result, setResult] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  const analyzeWebsite = async (e: React.FormEvent) => {
    e.preventDefault();

    // Only check cache if we're mounted
    if (mounted) {
      const cachedResult = clientCache.get(url);
      if (cachedResult) {
        setResult(cachedResult);
        return;
      }
    }

    setIsAnalyzing(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, preferences }),
      });

      const data = await response.json();

      if (data.success) {
        if (mounted) {
          clientCache.set(url, data.analysis);
        }
        setResult(data.analysis);
      } else {
        setError(data.error || "Analysis failed");
      }
    } catch (error) {
      console.error("Analysis failed:", error);
      setError("Failed to analyze website. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!mounted) {
    return null; // or a loading placeholder
  }

  return (
    <div className="space-y-8">
      <form onSubmit={analyzeWebsite} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Website URL</label>
          <div className="flex gap-2">
            <Input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-website.com"
              required
            />
            <Button type="submit" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing
                </>
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">AI Usage Preferences</label>
          <Textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="Describe how you'd like AI companies to use your content..."
            className="h-32"
          />
        </div>
      </form>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {result && <AnalysisResult result={result} />}
    </div>
  );
}
