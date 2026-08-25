import { corsHeaders, jsonResponse, reportFromId } from "@/lib/intake/mint";

export function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const report = reportFromId(id);
  if (!report) {
    return jsonResponse({ error: "Not found" }, 404);
  }
  return jsonResponse(report);
}
