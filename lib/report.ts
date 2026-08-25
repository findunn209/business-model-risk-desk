import type { Evidence, Glance, TimeToBreak } from "./glance";

export type JargonDef = {
  term: string;
  definition: string;
};

export type FailureModeRow = {
  id: string;
  failure_mode: string;
  how_the_model_breaks: string;
  time_to_break: TimeToBreak;
  evidence: Evidence;
  /** Rail note when inferred/unknown needs a sample-specific caveat. */
  evidence_note?: string;
  jargon?: JargonDef[];
};

export type HoldPlanItem = {
  failure_mode_id: string;
  text: string;
};

export type TripwireItem = {
  lead: string;
  body: string;
};

export type TripwireSection = {
  id: string;
  title: string;
  plan_label: string;
  intro: string;
  items: TripwireItem[];
  closer?: string;
};

export type PlanBind = {
  id: string;
  label: string;
};

export type Company = {
  name: string;
  form: string;
  claimed_model: string;
};

export type FitItem = {
  id: string;
  title: string;
  body: string;
};

export type FitModule = {
  intro: string;
  only_if_they_follow_the_plan: true;
  items: FitItem[];
};

export type Report = {
  id: string;
  labeled_fiction?: boolean;
  access?: "free";
  truncated?: boolean;
  company: Company;
  glance: Glance;
  failure_modes: FailureModeRow[];
  tripwire_sections: TripwireSection[];
  if_this_model_is_to_hold: HoldPlanItem[];
  notes: string;
  fit?: FitModule;
};

export function planBinds(report: {
  failure_modes: FailureModeRow[];
  tripwire_sections: TripwireSection[];
}): PlanBind[] {
  return [
    ...report.failure_modes.map((row) => ({
      id: row.id,
      label: row.failure_mode,
    })),
    ...report.tripwire_sections.map((section) => ({
      id: section.id,
      label: section.plan_label,
    })),
  ];
}
