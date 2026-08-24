import { sampleReportMarkdown } from "@/lib/sample-report";

export const dynamic = "force-static";

export function GET() {
  return new Response(sampleReportMarkdown(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
