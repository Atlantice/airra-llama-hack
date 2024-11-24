// src/components/generator/airra-config-editor.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Download, Copy, Plus, Trash } from "lucide-react";
import type { AnalysisResult } from "@/types";

interface AirraConfigEditorProps {
  initialConfig: AnalysisResult;
}

function generateAirraTxt(config: AnalysisResult): string {
  return `# airra.txt
  
  # Global Settings
  global:
    allow_ai_usage: partial
    content_update_frequency: weekly
  
  # Content-Specific Rules
  content_rules:
  ${config.contentTypes
    .map(
      (type: string) => `  - type: ${type}
      allow_usage: true
      allowed_usage_types:
  ${
    config.suggestedPermissions[type]
      ?.map((perm: string) => `      - ${perm}`)
      .join("\n") || "      - inference"
  }`
    )
    .join("\n\n")}
  
  # Attribution Requirements
  attribution:
  ${config.attributionRequirements
    .map((req: string) => `  - ${req}`)
    .join("\n")}
  
  # Access Restrictions
  restrictions:
  ${config.restrictions
    .map((restriction: string) => `  - ${restriction}`)
    .join("\n")}`;
}

export function AirraConfigEditor({ initialConfig }: AirraConfigEditorProps) {
  const [config, setConfig] = useState(initialConfig);
  const [airraTxt, setAirraTxt] = useState(generateAirraTxt(initialConfig));

  // Handle direct text edit
  const handleTextEdit = (newText: string) => {
    setAirraTxt(newText);
    // Optionally: Try to parse the text back into config
  };

  // Handle form-based edits
  const handleContentTypeAdd = () => {
    setConfig((prev) => ({
      ...prev,
      contentTypes: [...prev.contentTypes, ""],
    }));
  };

  const handleContentTypeChange = (index: number, value: string) => {
    const newTypes = [...config.contentTypes];
    newTypes[index] = value;
    setConfig((prev) => ({
      ...prev,
      contentTypes: newTypes,
    }));
  };

  const handlePermissionAdd = (contentType: string) => {
    setConfig((prev) => ({
      ...prev,
      suggestedPermissions: {
        ...prev.suggestedPermissions,
        [contentType]: [...(prev.suggestedPermissions[contentType] || []), ""],
      },
    }));
  };

  // Download configuration
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

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(airraTxt);
      // Show success toast
    } catch (err) {
      // Show error toast
    }
  };

  return (
    <div className="space-y-6">
      {/* Installation Instructions */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Builder */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {config.contentTypes.map((type, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={type}
                    onChange={(e) =>
                      handleContentTypeChange(index, e.target.value)
                    }
                    placeholder="Content type"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newTypes = config.contentTypes.filter(
                        (_, i) => i !== index
                      );
                      setConfig((prev) => ({
                        ...prev,
                        contentTypes: newTypes,
                      }));
                    }}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button onClick={handleContentTypeAdd} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Content Type
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Permissions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(config.suggestedPermissions).map(
                ([type, permissions]) => (
                  <div key={type} className="space-y-2">
                    <Label>{type}</Label>
                    {permissions.map((permission, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={permission}
                          onChange={(e) => {
                            const newPermissions = [...permissions];
                            newPermissions[index] = e.target.value;
                            setConfig((prev) => ({
                              ...prev,
                              suggestedPermissions: {
                                ...prev.suggestedPermissions,
                                [type]: newPermissions,
                              },
                            }));
                          }}
                          placeholder="Permission"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newPermissions = permissions.filter(
                              (_, i) => i !== index
                            );
                            setConfig((prev) => ({
                              ...prev,
                              suggestedPermissions: {
                                ...prev.suggestedPermissions,
                                [type]: newPermissions,
                              },
                            }));
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => handlePermissionAdd(type)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Permission
                    </Button>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        {/* airra.txt Preview */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                airra.txt Preview
                <div className="space-x-2">
                  <Button variant="outline" size="icon" onClick={handleCopy}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleDownload}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={airraTxt}
                onChange={(e) => handleTextEdit(e.target.value)}
                className="font-mono h-[600px]"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
