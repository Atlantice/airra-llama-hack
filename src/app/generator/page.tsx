// app/generator/page.tsx
"use client";

import { useState } from "react";
import { AnalysisForm } from "@/components/generator/analysis-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Generator() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Generate Airra.txt</h1>

      <Card>
        <CardHeader>
          <CardTitle>Website Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <AnalysisForm />
        </CardContent>
      </Card>
    </div>
  );
}
