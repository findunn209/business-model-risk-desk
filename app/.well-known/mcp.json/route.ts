import { mcpCorsHeaders, mcpOptionsResponse } from "@/lib/mcp/cors";
import { mcpServerCardFromRequest } from "@/lib/mcp/card";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return mcpOptionsResponse();
}

export function GET(request: Request) {
  return Response.json(mcpServerCardFromRequest(request), {
    headers: mcpCorsHeaders({
      "Cache-Control": "public, max-age=3600",
    }),
  });
}
