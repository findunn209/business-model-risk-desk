import type { NextConfig } from "next";

const mcpCors = [
  { key: "Access-Control-Allow-Origin", value: "*" },
  {
    key: "Access-Control-Allow-Methods",
    value: "GET, POST, DELETE, OPTIONS",
  },
  {
    key: "Access-Control-Allow-Headers",
    value: "*",
  },
  {
    key: "Access-Control-Expose-Headers",
    value: "MCP-Protocol-Version, Mcp-Session-Id",
  },
  { key: "Access-Control-Max-Age", value: "86400" },
];

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "mcp-handler",
    "@modelcontextprotocol/server",
    "@modelcontextprotocol/core",
  ],
  async headers() {
    return [
      { source: "/mcp", headers: mcpCors },
      { source: "/.well-known/mcp.json", headers: mcpCors },
    ];
  },
};

export default nextConfig;
