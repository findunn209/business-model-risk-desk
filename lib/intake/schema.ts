import { EVIDENCE, type Evidence } from "@/lib/glance";

export const QUESTION_IDS = [
  "q_who_pays_whom",
  "q_home_services",
  "q_statement_name",
  "q_charge_timing",
  "q_time_until_exists",
  "q_when_pay_provider",
  "q_provider_who",
  "q_provider_can_do",
  "q_provider_done",
  "q_off_platform_repeat",
  "q_who_sets_price",
  "q_deposits",
  "q_holding_funds",
  "q_classification",
  "q_negative_option",
  "q_cancel_path",
  "q_tools_card",
  "q_tools_payouts",
  "q_tools_fraud",
  "q_tools_storefront",
  "q_entity",
  "q_site",
  "q_refund",
  "q_this_cycle",
] as const;

export type QuestionId = (typeof QUESTION_IDS)[number];

export const SKIP = "skip";

export const CHOICES = {
  q_who_pays_whom: [
    "customers_pay_me_own",
    "customers_pay_me_then_providers",
    "customers_pay_provider_i_fee",
    SKIP,
  ],
  q_home_services: ["yes", "no", SKIP],
  q_statement_name: [
    "mine_one_stack",
    "mine_bank_fbo_payouts",
    "providers",
    SKIP,
  ],
  q_charge_timing: ["before_exists", "when_exists", "after_confirm", SKIP],
  q_time_until_exists: ["days", "weeks", "months", SKIP],
  q_when_pay_provider: ["instant_before_confirm", "after_confirm", SKIP],
  q_provider_who: ["yes", "not_yet", SKIP],
  q_provider_can_do: ["yes", "not_yet", SKIP],
  q_provider_done: ["yes", "not_yet", SKIP],
  q_off_platform_repeat: ["they_leave", "they_stay", SKIP],
  q_who_sets_price: ["platform", "provider", SKIP],
  q_deposits: ["yes", "no", SKIP],
  q_holding_funds: ["yes", "no", SKIP],
  q_classification: ["yes", "no", SKIP],
  q_negative_option: ["yes", "no", SKIP],
  q_cancel_path: ["yes", "not_yet", SKIP],
  q_refund: ["yes", "not_yet", SKIP],
  q_this_cycle: ["live", "pre_launch", SKIP],
} as const;

export const TEXT_QUESTIONS = [
  "q_tools_card",
  "q_tools_payouts",
  "q_tools_fraud",
  "q_tools_storefront",
  "q_entity",
  "q_site",
] as const;

export type TextQuestionId = (typeof TEXT_QUESTIONS)[number];

const TEXT_SET = new Set<string>(TEXT_QUESTIONS);
const QUESTION_SET = new Set<string>(QUESTION_IDS);
const MAX_TEXT = 200;

export type IntakeAnswer = {
  question_id: QuestionId;
  value: string;
  evidence: Evidence;
  asked: boolean;
};

export type AnswerMap = Partial<Record<QuestionId, IntakeAnswer>>;

export function isQuestionId(id: string): id is QuestionId {
  return QUESTION_SET.has(id);
}

export function isTextQuestion(id: string): id is TextQuestionId {
  return TEXT_SET.has(id);
}

function isEvidence(value: unknown): value is Evidence {
  return (
    typeof value === "string" && (EVIDENCE as readonly string[]).includes(value)
  );
}

function allowedValues(id: QuestionId): readonly string[] | null {
  if (isTextQuestion(id)) return null;
  return CHOICES[id as keyof typeof CHOICES];
}

function clipText(value: string): string {
  const trimmed = value.trim();
  return trimmed.length > MAX_TEXT ? trimmed.slice(0, MAX_TEXT) : trimmed;
}

export function emptyAnswer(id: QuestionId): IntakeAnswer {
  return {
    question_id: id,
    value: SKIP,
    evidence: "unknown",
    asked: false,
  };
}

export function getAnswer(map: AnswerMap, id: QuestionId): IntakeAnswer {
  return map[id] ?? emptyAnswer(id);
}

export function measuredValue(map: AnswerMap, id: QuestionId): string | null {
  const answer = getAnswer(map, id);
  if (
    !answer.asked ||
    answer.value === SKIP ||
    answer.evidence !== "measured"
  ) {
    return null;
  }
  return answer.value;
}

export function isMeasured(
  map: AnswerMap,
  id: QuestionId,
  value: string,
): boolean {
  return measuredValue(map, id) === value;
}

type RawAnswer = {
  question_id?: unknown;
  value?: unknown;
  evidence?: unknown;
  asked?: unknown;
};

function coerceOne(raw: RawAnswer): IntakeAnswer | null {
  if (typeof raw.question_id !== "string" || !isQuestionId(raw.question_id)) {
    return null;
  }
  const id = raw.question_id;
  const asked = raw.asked === false ? false : true;

  if (!asked) {
    return emptyAnswer(id);
  }

  let value =
    raw.value === undefined || raw.value === null ? SKIP : String(raw.value);
  if (isTextQuestion(id)) {
    value = clipText(value) || SKIP;
  } else {
    const allowed = allowedValues(id);
    if (allowed && !allowed.includes(value)) {
      return null;
    }
  }

  let evidence: Evidence;
  if (raw.evidence === undefined || raw.evidence === null) {
    evidence = value === SKIP ? "unknown" : "measured";
  } else if (isEvidence(raw.evidence)) {
    evidence = raw.evidence;
  } else {
    return null;
  }

  if (value === SKIP) {
    evidence = "unknown";
  }

  return { question_id: id, value, evidence, asked: true };
}

function fromObjectMap(input: Record<string, unknown>): IntakeAnswer[] {
  const out: IntakeAnswer[] = [];
  for (const [key, raw] of Object.entries(input)) {
    if (!isQuestionId(key)) continue;
    if (raw === null || raw === undefined) continue;
    if (typeof raw === "string" || typeof raw === "number") {
      const one = coerceOne({ question_id: key, value: String(raw) });
      if (one) out.push(one);
      continue;
    }
    if (typeof raw === "object") {
      const one = coerceOne({ question_id: key, ...(raw as RawAnswer) });
      if (one) out.push(one);
    }
  }
  return out;
}

export function normalizeAnswers(input: unknown): AnswerMap {
  const map: AnswerMap = {};
  if (input === null || input === undefined) return map;

  let list: IntakeAnswer[] = [];
  if (Array.isArray(input)) {
    for (const item of input) {
      if (!item || typeof item !== "object") continue;
      const one = coerceOne(item as RawAnswer);
      if (one) list.push(one);
    }
  } else if (typeof input === "object") {
    const record = input as Record<string, unknown>;
    if (Array.isArray(record.answers)) {
      return normalizeAnswers(record.answers);
    }
    if (record.answers && typeof record.answers === "object") {
      list = fromObjectMap(record.answers as Record<string, unknown>);
    } else {
      list = fromObjectMap(record);
    }
  }

  for (const answer of list) {
    if (answer.asked) map[answer.question_id] = answer;
  }
  return map;
}

export function answersList(map: AnswerMap): IntakeAnswer[] {
  return QUESTION_IDS.map((id) => getAnswer(map, id));
}

export function askedAnswers(map: AnswerMap): IntakeAnswer[] {
  return answersList(map).filter((answer) => answer.asked);
}
