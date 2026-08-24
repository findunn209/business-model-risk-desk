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
  tripwire_sections: TripwireSection[];
  if_this_model_is_to_hold: HoldPlanItem[];
  notes: string;
};

export function planBinds(report: SampleReport): PlanBind[] {
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
    dominant_break: "You charged the homeowner without checking the worker",
    time_to_break: "this_cycle",
    evidence: "inferred",
    model_condition: "contingent",
  },
  failure_modes: [
    {
      id: "psp-balance-sheet",
      failure_mode: "You charged the homeowner without checking the worker",
      how_the_model_breaks:
        "You hold 100% of the payment; card in, worker paid later. You have not checked who the worker is, whether they can do this job here, and whether the work got done.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      evidence_note:
        "This inferred fiction assumes those three checks are not in the file. If they were, this would not be the dominant break.",
    },
    {
      id: "merchant-of-record",
      failure_mode: "Charging the homeowner is being the merchant of record",
      how_the_model_breaks:
        "Porchlist is merchant of record because it accepts 100% of the homeowner’s payment, then pays the worker their share after the charge — real time or delayed. The 18% take rate is the fee, not the test; 100% of GMV is the exposure. If the customer books and pays on your site, app, or brand, you are merchant of record and you own the financial risk. Tools for that path include Stripe Connect, or a payment company plus a payouts rail. A payout rail KYCs payees and sends money. It does not move card risk if you already charged the homeowner. Marketplace facilitator is a sales-tax label. Saying you are a facilitator does not mean you are not the merchant. Checkout might name one provider, or hold funds until the job is done; either way, the charge is yours. The bank statement says PORCHLIST, not the plumber. Services have no tracking number, so a homeowner can keep the work and still reverse the card (friendly fraud). Refunds and support land on whoever is merchant of record. Then a dual dispute: the homeowner reverses the job and the worker fights a reversed payout. The only real “platform, customer service sits with the worker” path is charging the worker’s own merchant account directly — not collecting the homeowner card and calling the worker’s payout account a pass-through.",
      time_to_break: "this_cycle",
      evidence: "inferred",
      jargon: [
        {
          term: "merchant of record",
          definition:
            "The company the customer paid — the name on the card statement. They take the payment, issue refunds, and fight chargebacks.",
        },
      ],
    },
    {
      id: "vetting",
      failure_mode: "A “verified” badge is not a first-job check",
      how_the_model_breaks:
        "Anyone can sign up. Fake workers, stolen identity, first-job deposit theft. A skill failure comes back as a chargeback. Fraud comes back as a card-network flag. Bad first jobs are how homeowners learn not to open the app.",
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
  tripwire_sections: [
    {
      id: "psp-underwrite-tripwires",
      title: "PSP underwrite tripwires",
      plan_label: "PSP underwrite tripwires",
      intro:
        "A processor is not grading whether Porchlist is a good business. They are deciding whether to let you take cards, and on what leash. Sitting in the money (take 100% of the customer payment, then pay providers) is a named product they sell — Connect-style destination charges; a contractor–homeowner marketplace is a documented example. Stripe, Adyen, and PayPal sell “customers pay you, you pay sellers.” What they fail or condition is the three checks, not the funds flow itself.",
      items: [
        {
          lead: "Assumption on this sample",
          body: "The operator sits in the money: takes the homeowner’s card, pays the worker later, and has not checked who the worker is, that they can do this job here, and that the work got done. Instant payout to workers before the job is confirmed is how platform cash gets eaten, not why a MID (the processor’s account number for you) is impossible. If those three checks were in the file, this would not be the dominant break. If the product never touches the card, the underwrite changes. TaskRabbit typically charges after a completion notice. Thumbtack is mostly lead-gen, with optional in-app pay.",
        },
        {
          lead: "Underwritten once",
          body: "A marketplace that sits in the money is underwritten once, the same way a merchant selling their own goods or services is underwritten once. Taking the customer’s payment, then paying the provider, is that one underwrite. Restricted, not prohibited. Extra work a single-MoR shop does not have: provider KYC, proof they can do the advertised job, and a post-job quality loop you own.",
        },
        {
          lead: "Two stacks",
          body: "What the processor requires of you: identity, tax, bank, financials, a site with delivery and refunds. What they will not do for you: the three checks. A payout rail (Hyperwallet, Payoneer, Connect payouts) KYCs payees and sends money. It does not move card risk if you already charged the homeowner.",
        },
        {
          lead: "What they need to see",
          body: "Honest funds flow: take the card and pay workers, or a lead fee only. Provider vetting in three parts you own: KYC on each provider (sub-merchant in a PSP underwrite), can they do the advertised job, and a post-job quality loop — pause payout until delivered, customer confirmation, ratings. Exposure is unfulfilled GMV for N days: days between charge and fulfillment times volume, then the dispute tail — same for monthly vs annual prepaid. Delayed payout and cash for the charge-to-job gap. As volume grows, exposure grows.",
        },
        {
          lead: "What fails",
          body: "No provider KYC. Cannot perform the advertised service. No quality or dispute loop while sitting in the money. Stealth aggregation on a vanilla SaaS MID. Future-service with no capital, hold, or quality loop. “We have reviews” is not that loop. Sitting in the money is not the fail. Missing that extra work is. MATCH (a list processors share of merchants they terminated), or hopping from a terminated contractor account into a “marketplace.”",
        },
        {
          lead: "Terms if they say yes",
          body: "Typical, not a promise. Delayed or manual payout until the job is done. A reserve or hold sized to unfulfilled volume — Connect’s public max hold is 180 days. Volume caps until statements. The platform eats negative balances. They can freeze the whole platform. MATCH listing can follow a termination.",
        },
        {
          lead: "The termination path operators miss",
          body: "Disputes or MATCH can end the account and list you. That listing follows the company — and sometimes the people — to the next processor.",
        },
      ],
    },
    {
      id: "legal-and-contractable",
      title: "Legal and contractable",
      plan_label: "Legal and contractable",
      intro:
        "US home-services marketplace. Short, not a treatise. What a first-time operator misses.",
      items: [
        {
          lead: "18% is economics; 100% of GMV is exposure",
          body: "The take rate is the fee. If you take the homeowner’s payment then pay the worker, 100% of GMV is the card, chargeback, refund, and deposit exposure. Processors can approve that. The break is you took the money and cannot prove who will show up, that they may legally do this job here, and that the work will be done (KYC + license/ability + post-job quality).",
        },
        {
          lead: "Facilitator is not merchant of record",
          body: "Marketplace facilitator is a sales-tax label. Merchant of record is your name on the statement. Saying you are a facilitator does not mean you are not the merchant.",
        },
        {
          lead: "Receipt test",
          body: "The same legal person should be on the card statement, who took the funds, who pays the worker, and who the homeowner hired. If those split, you have two stories.",
        },
        {
          lead: "Who the homeowner thinks they hired",
          body: "Selling the introduction (lead-gen: the pro pays for a contact) is not the same as arranging the job and taking the money. If you price the job, are party to the contract, or take payment, states treat you more like a contractor than an app. Licensed trades (plumbing, electrical, HVAC, roofing) still need their licenses. Listing an unlicensed one is your problem too.",
        },
        {
          lead: "Deposits and prepaid",
          body: "Home-improvement rules often cap down payments (example: California, $1,000 or 10%, whichever is less) and require a written contract. If you are merchant of record, checkout is the down payment. “We held it for the pro” does not erase that. Prepaid hours, memberships, or job credits are money now for work later: still exposure until the work is done — same as annual vs monthly subscription.",
        },
        {
          lead: "Worker classification",
          body: "Prop 22 is rideshare, not cleaners and plumbers. California’s ABC test is the one home-services platforms lose if the product is the home service. Budget payroll if you need employees. Independent contractors still get litigated.",
        },
        {
          lead: "“Vetted / insured / bonded” is a claim",
          body: "If the check is old, the policy lapsed, or you did not verify the license for this job, that is a false-advertising problem. Background checks at scale have a federal process (FCRA: Fair Credit Reporting Act). Requiring a certificate of insurance is not the same as you insuring the job.",
        },
        {
          lead: "Holding customer money",
          body: "Holding funds until the job is done can be money transmission (moving other people’s money as a business — often licensed) or stored value. Do not keep homeowner funds in the operating account. No Porchlist Cash wallet without counsel.",
        },
        {
          lead: "Payments legal",
          body: "They will pick an MCC (the processor’s category for what you sell) from actual volume (HVAC, plumbing, roofing, cleaning), not the pitch. They refuse unlicensed home improvement, large deposits months before work, washing the category code, and guarantees you cannot evidence.",
        },
        {
          lead: "Before you scale",
          body: "License gate by trade and ZIP before the card is charged. Small deposit tied to work. Payout delay plus proof the job was done. Consent for SMS and email. No stored-value wallet.",
        },
      ],
      closer:
        "Needs a lawyer before the first homeowner charge. This is not legal advice.",
    },
  ],
  if_this_model_is_to_hold: [
    {
      failure_mode_id: "psp-balance-sheet",
      text: "Check who the worker is, that they can do this job here, and that the work got done — before payout. Capitalize in cash that can cover the days between charge and job done, then the dispute tail. Same logic as subscriptions: a monthly charge is about a month of exposure; an annual charge is about a year. As volume grows, exposure grows.",
    },
    {
      failure_mode_id: "psp-underwrite-tripwires",
      text: "Apply with one honest funds flow — take the card and pay workers, or a lead fee only, not both. Identity, tax, bank, refunds, and statement name on the site. Do not hop a terminated contractor account into a marketplace. A dump can put you on MATCH.",
    },
    {
      failure_mode_id: "psp-underwrite-tripwires",
      text: "If they say yes, budget delayed or manual payout until the job is done, a hold sized to unfulfilled volume (Connect’s public max hold is 180 days), volume caps until statements, and negative balances the platform eats. They can freeze the whole platform. Instant payout before the job is confirmed is how cash gets eaten, not why a MID is impossible.",
    },
    {
      failure_mode_id: "merchant-of-record",
      text: "If the customer books and pays on your site, app, or brand, you are the merchant of record: you accept 100% of the payment, pay the worker their share after the charge, and staff refunds, chargebacks, and support as the product. Stripe Connect, or a payment company plus a payouts rail, are tools for that path. A payout rail does not move card risk. The take rate is the fee; 100% of GMV is the exposure. The only way customer service sits with the worker is to charge the worker’s own merchant account. The real off-ramp is a software or intro fee on the worker’s card or invoice — selling the introduction.",
    },
    {
      failure_mode_id: "legal-and-contractable",
      text: "License gate by trade and ZIP before the card is charged. Small deposit tied to work. Payout delay plus proof the job was done. No stored-value wallet. Do not keep homeowner funds in the operating account.",
    },
    {
      failure_mode_id: "legal-and-contractable",
      text: "Receipt test: the same legal person on the card statement, who took the funds, who pays the worker, and who the homeowner hired. If those split, you have two stories. Marketplace facilitator is a sales-tax label, not a way out of being the merchant.",
    },
    {
      failure_mode_id: "vetting",
      text: "A signup and a “verified” badge is not a first-job check. Pause payout until the work is confirmed. “We have reviews” is not that loop.",
    },
    {
      failure_mode_id: "off-platform-repeat",
      text: "Keep the next job on the platform — warranty, materials, the follow-up visit booked in-app — or stop sitting in the charge and sell the introduction only.",
    },
  ],
  notes:
    "Until those are true, the 18% marketplace is a sketch: you hold the homeowner’s payment without the three checks. This inferred fiction assumes those checks are missing. If the operator had them, this would not be the dominant break. Evidence on this sample is inferred. Porchlist is labeled fiction.",
};

function jargonLine(row: { jargon?: JargonDef[] }): string {
  if (!row.jargon?.length) return "";
  return row.jargon.map((item) => `${item.term} — ${item.definition}`).join(" ");
}

function tripwireMarkdown(section: TripwireSection): string {
  const items = section.items
    .map((item) => `- **${item.lead}.** ${item.body}`)
    .join("\n");
  const tail = section.closer ? ["", `*${section.closer}*`, ""] : [""];
  return [`## ${section.title}`, "", section.intro, "", items, ...tail].join(
    "\n",
  );
}

export function sampleReportMarkdown(): string {
  const r = sampleReport;
  const binds = planBinds(r);
  const glanceEvidenceNote = r.failure_modes.find(
    (row) => row.evidence_note,
  )?.evidence_note;

  const glanceBlock = [
    "```",
    `dominant_break: ${r.glance.dominant_break}`,
    `time_to_break: ${r.glance.time_to_break}`,
    `evidence: ${r.glance.evidence}`,
    `model_condition: ${r.glance.model_condition}`,
    "```",
    ...(glanceEvidenceNote ? ["", glanceEvidenceNote] : []),
  ].join("\n");

  const failureHeader =
    "| Break | How the model breaks | time_to_break | evidence |";
  const failureDivider = "| --- | --- | --- | --- |";
  const failureRows = r.failure_modes
    .map((row) => {
      const gloss = jargonLine(row);
      const how = gloss
        ? `${gloss} ${row.how_the_model_breaks}`
        : row.how_the_model_breaks;
      return `| ${row.failure_mode} | ${how} | ${row.time_to_break} | ${row.evidence} |`;
    })
    .join("\n");

  const tripwires = r.tripwire_sections.map(tripwireMarkdown).join("\n");

  const plan = r.if_this_model_is_to_hold
    .map((item, index) => {
      const bind = binds.find((row) => row.id === item.failure_mode_id);
      const prevId =
        index > 0 ? r.if_this_model_is_to_hold[index - 1].failure_mode_id : null;
      const bound = bind && bind.id !== prevId ? ` (${bind.label})` : "";
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
    tripwires.trimEnd(),
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
