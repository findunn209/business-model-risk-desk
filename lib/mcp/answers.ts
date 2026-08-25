import { z } from "zod";
import { EVIDENCE } from "@/lib/glance";
import { REVIEW_QUIET, SCREENS } from "@/lib/intake/questions";
import {
  CHOICES,
  QUESTION_IDS,
  isTextQuestion,
  type QuestionId,
} from "@/lib/intake/schema";

const evidenceSchema = z.enum(EVIDENCE);

function questionTitle(id: QuestionId): string {
  for (const screen of SCREENS) {
    if ((screen.kind === "choice" || screen.kind === "text") && screen.id === id) {
      return screen.question;
    }
    if (screen.kind === "chips") {
      const chip = screen.chips.find((item) => item.id === id);
      if (chip) return chip.label;
    }
  }
  if (id in REVIEW_QUIET) {
    return REVIEW_QUIET[id as keyof typeof REVIEW_QUIET].question;
  }
  return id;
}

function valueSchema(id: QuestionId) {
  if (isTextQuestion(id)) return z.string().max(200);
  const allowed = CHOICES[id as keyof typeof CHOICES] as unknown as [
    string,
    ...string[],
  ];
  return z.enum(allowed);
}

function answerField(id: QuestionId) {
  const values = valueSchema(id);
  const title = questionTitle(id);
  let extra = "";
  if (id === "q_who_pays_whom") {
    extra =
      " Values: customers_pay_me_own | customers_pay_me_then_providers | customers_pay_provider_i_fee | skip.";
  } else if (
    id === "q_provider_who" ||
    id === "q_provider_can_do" ||
    id === "q_provider_done"
  ) {
    extra =
      " Marketplace three-check chip (not a q_three_checks id). Values: yes | not_yet | skip.";
  }
  return z
    .union([
      values,
      z.object({
        value: values.optional(),
        evidence: evidenceSchema.optional(),
        asked: z.boolean().optional(),
      }),
    ])
    .optional()
    .describe(`${title}.${extra} Omit for unknown.`);
}

const answersShape = Object.fromEntries(
  QUESTION_IDS.map((id) => [id, answerField(id)]),
);

export const answersObjectSchema = z
  .object(answersShape)
  .describe(
    "Answers object keyed by BMR question_id. Omit a question for unknown. skip means unknown, not no.",
  );

export const createPremortemInputSchema = z.object({
  answers: answersObjectSchema.optional(),
});

export const createPremortemOutputSchema = z.object({
  report_id: z.string(),
});

export const getPremortemInputSchema = z.object({
  id: z
    .string()
    .describe("report_id from create_premortem or GET /v1/reports/{id}"),
});
