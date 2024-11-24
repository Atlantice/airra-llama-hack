// src/lib/firecrawl/mock-crawler.ts
import type { CrawlResult } from "./types";

const sampleWebsites = [
  {
    url: "https://example.com",
    content: `
      <html>
        <head>
          <title>Example Website</title>
          <meta name="description" content="This is a sample website for testing purposes.">
          <meta name="keywords" content="example, test, website">
        </head>
        <body>
          <h1>Welcome to the Example Website</h1>
          <p>This is a sample website for testing purposes. It contains blog posts, documentation, and marketing content.</p>
          <h2>Blog Posts</h2>
          <article>
            <h3>Introduction to Web Development</h3>
            <p>In this article, we'll explore the basics of web development and how to get started.</p>
          </article>
          <article>
            <h3>CSS Fundamentals</h3>
            <p>Learn the essential CSS concepts to style your web pages effectively.</p>
          </article>
          <h2>Documentation</h2>
          <section>
            <h3>API Reference</h3>
            <p>Detailed documentation for our public API.</p>
          </section>
          <section>
            <h3>User Guide</h3>
            <p>Step-by-step instructions on how to use our platform.</p>
          </section>
          <h2>Marketing</h2>
          <div>
            <h3>Product Overview</h3>
            <p>Learn more about our cutting-edge product offerings.</p>
          </div>
          <div>
            <h3>Pricing</h3>
            <p>Check out our competitive pricing plans.</p>
          </div>
        </body>
      </html>
    `,
    links: [
      "https://example.com/about",
      "https://example.com/contact",
      "https://example.com/blog",
      "https://example.com/docs",
    ],
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
    title: "Example Website",
    metadata: {
      description: "Sample website for testing",
      keywords: ["example", "test", "website"],
    },
  },
  {
    url: "https://techblog.example.com",
    content: `
      <html>
        <head>
          <title>Tech Blog</title>
          <meta name="description" content="A blog dedicated to the latest technology trends and innovations.">
          <meta name="keywords" content="technology, tech, blog, programming, software">
        </head>
        <body>
          <h1>Tech Blog</h1>
          <p>Welcome to our tech blog, where we discuss the latest advancements in the world of technology.</p>
          <h2>Featured Articles</h2>
          <article>
            <h3>Exploring the Future of Artificial Intelligence</h3>
            <p>In this article, we delve into the exciting developments in the field of AI and its potential impact on our lives.</p>
          </article>
          <article>
            <h3>The Rise of Serverless Computing</h3>
            <p>Learn about the benefits and challenges of serverless architecture and how it's transforming the way we build applications.</p>
          </article>
          <h2>Developer Resources</h2>
          <section>
            <h3>Programming Tutorials</h3>
            <p>Improve your coding skills with our comprehensive programming tutorials.</p>
          </section>
          <section>
            <h3>Open-Source Projects</h3>
            <p>Explore and contribute to our curated list of open-source projects.</p>
          </section>
        </body>
      </html>
    `,
    links: [
      "https://techblog.example.com/about",
      "https://techblog.example.com/contact",
      "https://techblog.example.com/articles",
      "https://techblog.example.com/resources",
    ],
    status: 200,
    headers: {
      "Content-Type": "text/html",
    },
    title: "Tech Blog",
    metadata: {
      description:
        "A blog dedicated to the latest technology trends and innovations",
      keywords: ["technology", "tech", "blog", "programming", "software"],
    },
  },
];

export class MockContentCrawler {
  async crawlWebsite(url: string): Promise<CrawlResult> {
    const sampleWebsite = sampleWebsites.find((site) => site.url === url);
    if (sampleWebsite) {
      return sampleWebsite;
    } else {
      return {
        url: "https://example.com",
        content: `
          <html>
            <head>
              <title>Example Website</title>
            </head>
            <body>
              <h1>Welcome to the Example Website</h1>
              <p>This is a sample website for testing purposes.</p>
            </body>
          </html>
        `,
        links: ["https://example.com/about", "https://example.com/contact"],
        status: 200,
        headers: {
          "Content-Type": "text/html",
        },
        title: "Example Website",
        metadata: {
          description: "Sample website for testing",
          keywords: ["example", "test", "website"],
        },
      };
    }
  }
}
