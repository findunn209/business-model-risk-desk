import { deflateSync, inflateSync } from "node:zlib";
import { askedAnswers, normalizeAnswers, type AnswerMap } from "./schema";

const PREFIX = "v1_";

export function encodeAnswers(map: AnswerMap): string {
  const payload = askedAnswers(map).map((answer) => [
    answer.question_id,
    answer.value,
    answer.evidence,
  ]);
  const json = Buffer.from(JSON.stringify(payload), "utf8");
  return PREFIX + deflateSync(json, { level: 9 }).toString("base64url");
}

export function decodeAnswers(id: string): AnswerMap | null {
  if (!id.startsWith(PREFIX)) return null;
  try {
    const buf = Buffer.from(id.slice(PREFIX.length), "base64url");
    if (!buf.length) return null;
    const json = inflateSync(buf).toString("utf8");
    const parsed: unknown = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    const raw = parsed.flatMap((item) => {
      if (!Array.isArray(item) || item.length < 2) return [];
      return [
        {
          question_id: item[0],
          value: item[1],
          evidence: item[2],
          asked: true,
        },
      ];
    });
    return normalizeAnswers(raw);
  } catch {
    return null;
  }
}
