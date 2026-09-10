import { getPublicOrigin } from "mcp-handler";
import {
  MCP_PATH,
  MCP_SERVER_DESCRIPTION,
  MCP_SERVER_INFO,
  MCP_SERVER_TITLE,
} from "./paths";

export function mcpServerCard(origin: string) {
  return {
    $schema:
      "https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json",
    name: MCP_SERVER_INFO.name,
    title: MCP_SERVER_TITLE,
    description: MCP_SERVER_DESCRIPTION,
    version: MCP_SERVER_INFO.version,
    remotes: [
      {
        type: "streamable-http" as const,
        url: `${origin}${MCP_PATH}`,
      },
    ],
  };
}

export function mcpServerCardFromRequest(request: Request) {
  return mcpServerCard(getPublicOrigin(request));
}
