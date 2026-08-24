import { PAGE_KICKER, PROMISE, SITE_NAME } from "./site";
import { FAILURE_MODE_DEFINITION } from "./glance";
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
  jargon?: JargonDef[];
};

export type HoldPlanItem = {
  failure_mode_id: string;
  text: string;
};

export type SampleReport = {
  slug: "sample";
  labeled_fiction: true;
  company: {
    name: string;
    form: string;
    claimed_model: string;
  };
  glance: Glance;
  failure_modes: FailureModeRow[];
  if_this_model_is_to_hold: HoldPlanItem[];
  notes: string;
};

export const sampleReport: SampleReport = {
  slug: "sample",
  labeled_fiction: true,
  company: {
    name: "Porchlist",
    form: "Two-sided marketplace matching homeowners with independent tradespeople for small residential jobs.",
    claimed_model:
      "Homeowners find a plumber, electrician, or handyman in the app and pay in the app. The platform takes 18% of jobs booked there. Homeowners are bought with paid search. Trades are supposed to stay for scheduling, invoicing, and a “verified” badge.",
  },
  glance: {
    dominant_break: "Payment companies will not approve sitting in the money",
    time_to_break: "this_cycle",
    evidence: "inferred",
    model_condition: "contingent",
  },
  failure_modes: [
    {
      id: "psp-balance-sheet",
      failure_mode: "Payment companies will not approve sitting in the money",
      how_the_model_breaks:
        "Porchlist wants to take the homeowner’s payment, keep 18%, and pay the worker later — to sit in the money the way a large on-platform marketplace does. The payment companies will not approve that flow for a thin startup. They are taking fraud and chargeback risk on services they cannot inspect, so they want a stronger balance sheet before they let Porchlist hold customer funds. Until they say yes, the 18% take does not exist. The money path breaks at onboarding.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      jargon: [
        {
          term: "PSP",
          definition:
            "Payment service provider. Stripe, Adyen, and the like: they move card money and decide who is allowed to hold customer funds.",
        },
      ],
    },
    {
      id: "merchant-of-record",
      failure_mode: "Who the customer paid is unchosen",
      how_the_model_breaks:
        "If Porchlist is the merchant of record, they get the margin and the control, and they are on the hook for refunds and chargebacks on services — including jobs already done — plus the support load that comes with that. If they are only a platform, that risk is lower, but every worker must open their own payment account and connect it, and the homeowner’s complaint sits with the worker. That is harder to launch if you want payments on-platform. The claimed 18% in-app take assumes a choice that has not been made.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      jargon: [
        {
          term: "merchant of record",
          definition:
            "The company the customer paid — the name on the card statement. They must issue refunds and fight chargebacks.",
        },
      ],
    },
    {
      id: "vetting",
      failure_mode: "No check that the worker is real or can do the work",
      how_the_model_breaks:
        "The app does not say how Porchlist knows a plumber is a plumber. Anyone can sign up. A “verified” badge is not a check that the person is real, can do the work, or is not fraudulent. Bad first jobs are how homeowners learn not to open the app. The platform has no door.",
      time_to_break: "this_cycle",
      evidence: "inferred",
    },
    {
      id: "off-platform-repeat",
      failure_mode: "After the first job they stop paying the platform",
      how_the_model_breaks:
        "After the first job, the worker and the homeowner deal with each other directly and stop paying the platform (disintermediation). The next gutter cleaning, the cousin’s house, the winter leak — none of that 18% comes back. This leak is real, and it is later than the breaks above: you have to finish a first job before anyone can go around you.",
      time_to_break: "later",
      evidence: "inferred",
    },
  ],
  if_this_model_is_to_hold: [
    {
      failure_mode_id: "psp-balance-sheet",
      text: "Capitalize until a payment company will approve sitting in the money — holding homeowner payments and paying workers later. If the balance sheet cannot take that risk, this is not an on-platform take-rate business.",
    },
    {
      failure_mode_id: "merchant-of-record",
      text: "Choose merchant of record versus platform on purpose. If you are the merchant of record, staff refunds, chargebacks, and support as part of the product. If you are only a platform, workers get their own payment accounts, customer service sits with them, and you do not collect an 18% on-platform take you cannot operate.",
    },
    {
      failure_mode_id: "vetting",
      text: "Vet workers before they see a homeowner: they are a real person, they can do the work, they are who they claim. A signup and a “verified” badge is not that check.",
    },
    {
      failure_mode_id: "off-platform-repeat",
      text: "Keep the next job on the platform — warranty, materials, the follow-up visit booked in-app — or stop claiming the 18% is a tax on the relationship.",
    },
  ],
  notes:
    "Until those are true, the 18% marketplace is a sketch of a large on-platform services app without a yes from the payment companies, a decision about who the customer paid, or a way to know who is on the truck. Evidence on this sample is inferred. Porchlist is labeled fiction.",
};

function jargonLine(row: FailureModeRow): string {
  if (!row.jargon?.length) return "";
  return row.jargon.map((item) => `${item.term} — ${item.definition}`).join(" ");
}

export function sampleReportMarkdown(): string {
  const r = sampleReport;
  const glanceBlock = [
    "```",
    `dominant_break: ${r.glance.dominant_break}`,
    `time_to_break: ${r.glance.time_to_break}`,
    `evidence: ${r.glance.evidence}`,
    `model_condition: ${r.glance.model_condition}`,
    "```",
  ].join("\n");

  const failureHeader =
    "| Break | How the model breaks | time_to_break | evidence |";
  const failureDivider = "| --- | --- | --- | --- |";
  const failureRows = r.failure_modes
    .map((row) => {
      const gloss = jargonLine(row);
      const how = gloss ? `${gloss} ${row.how_the_model_breaks}` : row.how_the_model_breaks;
      return `| ${row.failure_mode} | ${how} | ${row.time_to_break} | ${row.evidence} |`;
    })
    .join("\n");

  const plan = r.if_this_model_is_to_hold
    .map((item, index) => {
      const mode = r.failure_modes.find((row) => row.id === item.failure_mode_id);
      const bound = mode ? ` (${mode.failure_mode})` : "";
      return `${index + 1}. ${item.text}${bound}`;
    })
    .join("\n");

  return [
    `# ${r.company.name}`,
    "",
    `*Labeled fiction. Not a real company. Frozen sample from ${SITE_NAME}.*`,
    "",
    `*[HTML report](/r/sample)*`,
    "",
    `> ${PAGE_KICKER}`,
    "",
    r.company.form,
    "",
    "## Claimed internet/app model",
    "",
    r.company.claimed_model,
    "",
    "## Glance",
    "",
    glanceBlock,
    "",
    "## Failure modes",
    "",
    FAILURE_MODE_DEFINITION,
    "",
    failureHeader,
    failureDivider,
    failureRows,
    "",
    "## If this model is to hold",
    "",
    plan,
    "",
    r.notes,
    "",
    "---",
    "",
    PROMISE,
    "",
  ].join("\n");
}
