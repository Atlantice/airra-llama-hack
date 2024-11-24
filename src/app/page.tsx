// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Airra.txt Tools</h1>
        <p className="text-xl text-muted-foreground mb-8">
          AI-powered airra.txt generator and validator for ethical content usage
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/generator">
            <Button className="w-full h-24 text-lg">Generate Airra.txt</Button>
          </Link>

          <Link href="/validator">
            <Button variant="outline" className="w-full h-24 text-lg">
              Validate Airra.txt
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
