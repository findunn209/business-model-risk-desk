import { mcpHandler } from "@/lib/mcp/server";
import { mcpOptionsResponse, withMcpCors } from "@/lib/mcp/cors";

export const dynamic = "force-dynamic";

export function OPTIONS() {
  return mcpOptionsResponse();
}

async function handle(request: Request) {
  return withMcpCors(await mcpHandler(request));
}

export { handle as GET, handle as POST, handle as DELETE };
