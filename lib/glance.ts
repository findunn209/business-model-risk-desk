export const TIME_TO_BREAK = [
  "already",
  "this_cycle",
  "later",
  "unbounded_if_holds",
] as const;

export const EVIDENCE = ["measured", "inferred", "unknown"] as const;

export const MODEL_CONDITION = [
  "breaking",
  "fragile",
  "contingent",
  "insufficient_evidence",
] as const;

export type TimeToBreak = (typeof TIME_TO_BREAK)[number];
export type Evidence = (typeof EVIDENCE)[number];
export type ModelCondition = (typeof MODEL_CONDITION)[number];

export type Glance = {
  dominant_break: string;
  time_to_break: TimeToBreak;
  evidence: Evidence;
  model_condition: ModelCondition;
};

export const TIME_TO_BREAK_GLOSS: Record<TimeToBreak, string> = {
  already: "The model is already broken in how it operates.",
  this_cycle:
    "Expected to break within the current planning or funding cycle.",
  later: "Plausible, but not the near-term clock.",
  unbounded_if_holds: "Does not break on its own if current conditions hold.",
};

export const EVIDENCE_GLOSS: Record<Evidence, string> = {
  measured: "Observed in this model's operations or artifacts.",
  inferred: "Deduced from structure, comparables, or public record.",
  unknown: "Not established. We do not fill the gap with a score.",
};

export const MODEL_CONDITION_GLOSS: Record<ModelCondition, string> = {
  breaking: "Failing in operation now.",
  fragile: "Holds only while a leak is not fully exploited.",
  contingent: "Holds if an external condition continues.",
  insufficient_evidence: "We will not guess a condition.",
};

/** Human gloss for enum chips — not raw keys. */
export const TIME_TO_BREAK_LABEL: Record<TimeToBreak, string> = {
  already: "already",
  this_cycle: "this cycle",
  later: "later",
  unbounded_if_holds: "unbounded if holds",
};

export const EVIDENCE_LABEL: Record<Evidence, string> = {
  measured: "measured",
  inferred: "inferred",
  unknown: "unknown",
};

export const MODEL_CONDITION_LABEL: Record<ModelCondition, string> = {
  breaking: "breaking",
  fragile: "fragile",
  contingent: "contingent",
  insufficient_evidence: "insufficient evidence",
};
