// src/components/generator/analysis-result.tsx
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AirraConfigEditor } from "./airra-config-editor";
import type { AnalysisResult as AnalysisResultType } from "@/types";

export function AnalysisResult({ result }: { result: AnalysisResultType }) {
  return (
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

      {/* New editor component */}
      <AirraConfigEditor initialConfig={result} />
    </div>
  );
}
