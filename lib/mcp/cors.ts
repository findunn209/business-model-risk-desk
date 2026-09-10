const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version, Mcp-Session-Id",
  "Access-Control-Max-Age": "86400",
};

export function mcpCorsHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }
  return headers;
}

export function mcpOptionsResponse() {
  return new Response(null, { status: 204, headers: mcpCorsHeaders() });
}

export function withMcpCors(response: Response): Response {
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: mcpCorsHeaders(response.headers),
  });
}
