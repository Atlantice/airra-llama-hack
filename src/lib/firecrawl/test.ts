import FirecrawlApp, { ScrapeResponse } from "@mendable/firecrawl-js";

const app = new FirecrawlApp({ apiKey: "fc-1aed63b3a1a248ccb80380b6d7970f0c" });

// Scrape a website:
const scrapeResult = (await app.scrapeUrl("firecrawl.dev", {
  formats: ["markdown", "html"],
})) as ScrapeResponse;

if (!scrapeResult.success) {
  throw new Error(`Failed to scrape: ${scrapeResult.error}`);
}

console.log(scrapeResult);
