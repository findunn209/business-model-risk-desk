import { corsHeaders, jsonResponse, mintFromUnknown } from "@/lib/intake/mint";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function POST(request: Request) {
  let body: unknown = {};
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON" }, 400);
    }
  }

  const { report_id } = mintFromUnknown(body);
  return jsonResponse({ report_id });
}
