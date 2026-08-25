import { compileReportJson } from "@/lib/intake/compile";
import { decodeAnswers, encodeAnswers } from "@/lib/intake/encode";
import { normalizeAnswers } from "@/lib/intake/schema";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function corsHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers(extra);
  for (const [key, value] of Object.entries(cors)) {
    headers.set(key, value);
  }
  return headers;
}

export function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, { status, headers: corsHeaders() });
}

export function mintFromUnknown(input: unknown) {
  const answers = normalizeAnswers(input);
  const report_id = encodeAnswers(answers);
  const report = compileReportJson(report_id, answers);
  return { report_id, report };
}

export function reportFromId(id: string) {
  const answers = decodeAnswers(id);
  if (!answers) return null;
  return compileReportJson(id, answers);
}
