import type {
  Evidence,
  Glance,
  ModelCondition,
  TimeToBreak,
} from "@/lib/glance";
import type {
  FailureModeRow,
  FitModule,
  HoldPlanItem,
  Report,
  TripwireSection,
} from "@/lib/report";
import {
  isHomeServices,
  isMarketplace,
  LICENSE_CAN_DO_HELPER,
  theyCharge,
} from "./questions";
import {
  askedAnswers,
  getAnswer,
  isMeasured,
  measuredValue,
  type AnswerMap,
} from "./schema";

type Miss = {
  id: string;
  priority: number;
  glance: string;
  title: string;
  body: string;
  plan: string;
  time_to_break: TimeToBreak;
  evidence: Evidence;
  jargon?: FailureModeRow["jargon"];
};

function party(answers: AnswerMap): { customer: string; provider: string } {
  if (isHomeServices(answers)) {
    return { customer: "homeowner", provider: "worker" };
  }
  return { customer: "customer", provider: "provider" };
}

function cycle(answers: AnswerMap): "live" | "pre_launch" | null {
  const value = measuredValue(answers, "q_this_cycle");
  if (value === "live" || value === "pre_launch") return value;
  return null;
}

function timeForMiss(answers: AnswerMap, live: TimeToBreak): TimeToBreak {
  return cycle(answers) === "pre_launch" ? "this_cycle" : live;
}

function conditionForMiss(answers: AnswerMap): ModelCondition {
  return cycle(answers) === "pre_launch" ? "contingent" : "breaking";
}

function joinAnd(parts: string[]): string {
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function threeCheckLine(answers: AnswerMap): string {
  const { provider } = party(answers);
  const who = measuredValue(answers, "q_provider_who");
  const can = measuredValue(answers, "q_provider_can");
  const done = measuredValue(answers, "q_work_got_done");
  const missing: string[] = [];
  if (who === "not_yet") missing.push(`who the ${provider} is`);
  if (can === "not_yet") missing.push("whether they can do this job here");
  if (done === "not_yet") missing.push("whether the work got done");
  const held = `You hold 100% of the payment; card in, ${provider} paid later.`;
  if (!missing.length) {
    return `${held} The three checks are who they are, whether they can do this job here, and whether the work got done.`;
  }
  return `${held} You have not checked ${joinAnd(missing)}.`;
}

function collectMisses(answers: AnswerMap): Miss[] {
  const { customer, provider } = party(answers);
  const misses: Miss[] = [];
  const marketplace = isMarketplace(answers);
  const charges = theyCharge(answers);
  const who = measuredValue(answers, "q_provider_who");
  const can = measuredValue(answers, "q_provider_can");
  const done = measuredValue(answers, "q_work_got_done");
  const instant =
    isMeasured(answers, "q_when_pay_provider", "instant_before_confirm") &&
    isMeasured(answers, "q_charge_timing", "before_exists");
  const contradiction =
    marketplace && isMeasured(answers, "q_statement_name", "providers");

  if (charges && who === "not_yet") {
    misses.push({
      id: "psp-balance-sheet",
      priority: 1,
      glance: `You charged the ${customer} without checking the ${provider}`,
      title: `You charged the ${customer} without checking the ${provider}`,
      body: threeCheckLine(answers),
      plan: `Check who the ${provider} is, that they can do this job here, and that the work got done — before payout.`,
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (instant) {
    misses.push({
      id: "cash-leak",
      priority: 2,
      glance: `You pay the ${provider} before the job is confirmed`,
      title: `You pay the ${provider} before the job is confirmed`,
      body: "Instant payout before confirm is a cash leak. It is not why a processor account is impossible. You charged before the thing exists, then paid out.",
      plan: "Hold payout until the job is confirmed. Capitalize in cash that can cover the days between charge and job done, then the dispute tail.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (contradiction) {
    misses.push({
      id: "funds-flow-contradiction",
      priority: 3,
      glance: "You take the payment and the statement names the provider",
      title: "You take the payment and the statement names the provider",
      body: "You take the customer payment, then pay providers, and the statement names the provider. Receipt test: the same legal person should be on the card statement, who took the funds, who pays the provider, and who the customer hired. If those split, you have two stories.",
      plan: "Pick one story. If you take 100% of the payment, the statement is yours. If the provider is merchant of record, the customer pays their account and you take a fee.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (marketplace && can === "not_yet" && who !== "not_yet") {
    misses.push({
      id: "can-do-here",
      priority: 10,
      glance: "You charge before you know they can do this job here",
      title: "You charge before you know they can do this job here",
      body: threeCheckLine(answers),
      plan: "Match who can do this job here before you charge. For licensed trades, that is an active license class for this job ZIP, not a number collected once at signup.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (
    marketplace &&
    done === "not_yet" &&
    who !== "not_yet" &&
    can !== "not_yet"
  ) {
    misses.push({
      id: "work-got-done",
      priority: 11,
      glance: "You pay out without proof the work got done",
      title: "You pay out without proof the work got done",
      body: threeCheckLine(answers),
      plan: "Pause payout until the work is confirmed. “We have reviews” is not that loop.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (isMeasured(answers, "q_license_at_zip", "not_yet")) {
    misses.push({
      id: "license-at-zip",
      priority: 12,
      glance: "You charge without matching a license to this job ZIP",
      title: "You charge without matching a license to this job ZIP",
      body: LICENSE_CAN_DO_HELPER,
      plan: "License gate by trade and ZIP before the card is charged. “Vetted” without that file is a claim.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (isMeasured(answers, "q_charge_timing", "before_exists") && !instant) {
    misses.push({
      id: "charge-before-exists",
      priority: 13,
      glance: "You charge before the thing exists",
      title: "You charge before the thing exists",
      body: "Money now for work later is exposure until the work exists. Days between charge and fulfillment times volume, then the dispute tail.",
      plan: "Small charge tied to work, or wait until the thing exists. Hold cash for the gap.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (
    isMeasured(answers, "q_negative_option", "yes") &&
    isMeasured(answers, "q_cancel_path", "not_yet")
  ) {
    misses.push({
      id: "cancel-path",
      priority: 14,
      glance: "Customers cannot cancel on the same path they signed up",
      title: "Customers cannot cancel on the same path they signed up",
      body: "A repeating charge that starts unless they cancel needs a cancel path on the same site or app. Without it, the money path is a trap.",
      plan: "Same-path cancel before the next charge. State the terms where they signed up.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (isMeasured(answers, "q_holding_funds", "yes")) {
    misses.push({
      id: "holding-funds",
      priority: 15,
      glance: "You hold customer money until the job is done",
      title: "You hold customer money until the job is done",
      body: "Holding funds until the job is done can be money transmission or stored value. Do not keep customer funds in the operating account.",
      plan: "Do not keep customer funds in the operating account. No stored-value wallet without counsel.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (isMeasured(answers, "q_refund", "not_yet") && charges) {
    misses.push({
      id: "refund-path",
      priority: 16,
      glance: "You charge without a posted refund path",
      title: "You charge without a posted refund path",
      body: "Whoever is merchant of record owns refunds. A site without a refund path is a break in the money file, not a copy issue.",
      plan: "Post who refunds, how, and from which name before you charge.",
      time_to_break: timeForMiss(answers, "this_cycle"),
      evidence: "measured",
    });
  }

  if (isMeasured(answers, "q_off_platform_repeat", "they_leave")) {
    misses.push({
      id: "off-platform-repeat",
      priority: 20,
      glance: "After the first job they stop paying the platform",
      title: "After the first job they stop paying the platform",
      body: "After the first job, the provider and the customer deal with each other directly and stop paying the platform. This leak is later than the money-path breaks: you have to finish a first job before anyone can go around you.",
      plan: "Keep the next job on the platform, or stop sitting in the charge and sell the introduction only.",
      time_to_break: "later",
      evidence: "measured",
    });
  }

  return misses.sort((a, b) => a.priority - b.priority);
}

function attestedControls(answers: AnswerMap): boolean {
  if (isMarketplace(answers)) {
    return (
      measuredValue(answers, "q_provider_who") === "yes" &&
      measuredValue(answers, "q_provider_can") === "yes" &&
      measuredValue(answers, "q_work_got_done") === "yes"
    );
  }
  if (measuredValue(answers, "q_who_pays_whom") === "they_pay_provider") {
    return true;
  }
  if (theyCharge(answers)) {
    const timing = measuredValue(answers, "q_charge_timing");
    return timing === "when_exists" || timing === "after_confirm";
  }
  return false;
}

function glanceFrom(answers: AnswerMap, misses: Miss[]): Glance {
  const moneyPath = misses.filter((miss) => miss.priority <= 16);
  if (moneyPath.length) {
    const top = moneyPath[0];
    return {
      dominant_break: top.glance,
      time_to_break: top.time_to_break,
      evidence: "measured",
      model_condition: conditionForMiss(answers),
    };
  }
  const later = misses.find((miss) => miss.priority > 16);
  if (later) {
    return {
      dominant_break: later.glance,
      time_to_break: later.time_to_break,
      evidence: "measured",
      model_condition: "fragile",
    };
  }
  if (attestedControls(answers)) {
    return {
      dominant_break: "No measured break in this file",
      time_to_break: "unbounded_if_holds",
      evidence: "measured",
      model_condition: "contingent",
    };
  }
  return {
    dominant_break: "This file does not name a break",
    time_to_break: "this_cycle",
    evidence: "unknown",
    model_condition: "insufficient_evidence",
  };
}

function morRow(answers: AnswerMap): FailureModeRow | null {
  if (!theyCharge(answers)) return null;
  if (
    isMarketplace(answers) &&
    isMeasured(answers, "q_statement_name", "providers")
  ) {
    return null;
  }
  const { customer, provider } = party(answers);
  return {
    id: "merchant-of-record",
    failure_mode: `Charging the ${customer} is being the merchant of record`,
    how_the_model_breaks: isMarketplace(answers)
      ? `You are merchant of record because you accept 100% of the ${customer}’s payment, then pay the ${provider} their share after the charge. The take rate is the fee, not the test; 100% of GMV is the exposure. Tools for that path include Stripe Connect, or a payment company plus a payouts rail. A payout rail KYCs payees and sends money. It does not move card risk if you already charged the ${customer}. Marketplace facilitator is a sales-tax label. Saying you are a facilitator does not mean you are not the merchant.`
      : `You take 100% of the ${customer} payment for what you sell. That is merchant of record: refunds and chargebacks sit with you. A guarantee is not merchant of record.`,
    time_to_break: timeForMiss(answers, "this_cycle"),
    evidence: "measured",
    jargon: [
      {
        term: "merchant of record",
        definition:
          "The company the customer paid — the name on the card statement. They take the payment, issue refunds, and fight chargebacks.",
      },
    ],
  };
}

function failureRows(answers: AnswerMap, misses: Miss[]): FailureModeRow[] {
  const rows: FailureModeRow[] = misses.map((miss) => ({
    id: miss.id,
    failure_mode: miss.title,
    how_the_model_breaks: miss.body,
    time_to_break: miss.time_to_break,
    evidence: miss.evidence,
    jargon: miss.jargon,
  }));

  const mor = morRow(answers);
  if (mor && !rows.some((row) => row.id === mor.id)) {
    const after = rows.findIndex((row) => row.id === "psp-balance-sheet");
    if (after >= 0) rows.splice(after + 1, 0, mor);
    else rows.push(mor);
  }

  return rows;
}

function tripwires(answers: AnswerMap): TripwireSection[] {
  const sections: TripwireSection[] = [];

  if (isMarketplace(answers) || theyCharge(answers)) {
    sections.push({
      id: "psp-underwrite-tripwires",
      title: "PSP underwrite tripwires",
      plan_label: "PSP underwrite tripwires",
      intro:
        "A processor is not grading whether this is a good business. They are deciding whether to let you take cards, and on what leash. Sitting in the money is a named product they sell. What they fail or condition is the three checks, not the funds flow itself.",
      items: [
        {
          lead: "Underwritten once",
          body: "A marketplace that sits in the money is underwritten once, the same way a merchant selling their own goods or services is underwritten once. Restricted, not prohibited. Extra work a single-MoR shop does not have: provider KYC, proof they can do the advertised job, and a post-job quality loop you own.",
        },
        {
          lead: "Instant payout",
          body: "Instant payout before the job is confirmed is how platform cash gets eaten, not why a MID (the processor’s account number for you) is impossible.",
        },
        {
          lead: "What fails",
          body: "No provider KYC. Cannot perform the advertised service. No quality or dispute loop while sitting in the money. Sitting in the money is not the fail. Missing that extra work is.",
        },
      ],
    });
  }

  if (isMarketplace(answers) || isHomeServices(answers)) {
    const items = [
      {
        lead: "Receipt test",
        body: "Receipt test: the same legal person should be on the card statement, who took the funds, who pays the provider, and who the customer hired. If those split, you have two stories. That test was asked as statement name; it is not asked again here.",
      },
      {
        lead: "Facilitator is not merchant of record",
        body: "Marketplace facilitator is a sales-tax label. Merchant of record is your name on the statement.",
      },
    ];
    if (getAnswer(answers, "q_deposits").asked) {
      items.push({
        lead: "Deposits and prepaid",
        body: "Home-improvement rules often cap down payments and require a written contract. If you are merchant of record, checkout is the down payment.",
      });
    }
    if (getAnswer(answers, "q_holding_funds").asked) {
      items.push({
        lead: "Holding customer money",
        body: "Holding funds until the job is done can be money transmission or stored value. Do not keep customer funds in the operating account.",
      });
    }
    if (getAnswer(answers, "q_classification").asked) {
      items.push({
        lead: "Worker classification",
        body: "Prop 22 is rideshare, not cleaners and plumbers. Independent contractors still get litigated.",
      });
    }
    items.push({
      lead: "“Vetted / insured / bonded” is a claim",
      body: LICENSE_CAN_DO_HELPER,
    });
    sections.push({
      id: "legal-and-contractable",
      title: "Legal and contractable",
      plan_label: "Legal and contractable",
      intro: isHomeServices(answers)
        ? `US home-services ${isMarketplace(answers) ? "marketplace" : "file"}. Short, not a treatise.`
        : "What a first-time operator misses when they sit in the money.",
      items,
      closer: "Needs a lawyer before the first charge. This is not legal advice.",
    });
  }

  return sections;
}

function planItems(
  answers: AnswerMap,
  misses: Miss[],
  rows: FailureModeRow[],
  sections: TripwireSection[],
): HoldPlanItem[] {
  const items: HoldPlanItem[] = [];
  const seen = new Set<string>();

  for (const miss of misses) {
    items.push({ failure_mode_id: miss.id, text: miss.plan });
    seen.add(miss.id);
  }

  if (
    rows.some((row) => row.id === "merchant-of-record") &&
    !seen.has("merchant-of-record")
  ) {
    const { customer, provider } = party(answers);
    items.push({
      failure_mode_id: "merchant-of-record",
      text: isMarketplace(answers)
        ? `If the ${customer} books and pays on your site, app, or brand, you are the merchant of record: you accept 100% of the payment, pay the ${provider} their share after the charge, and staff refunds as the product. A payout rail does not move card risk.`
        : "You take the customer payment for what you sell. Staff refunds and chargebacks as the product.",
    });
  }

  if (sections.some((section) => section.id === "psp-underwrite-tripwires")) {
    items.push({
      failure_mode_id: "psp-underwrite-tripwires",
      text: "Apply with one honest funds flow — take the card and pay providers, or a lead fee only, not both.",
    });
  }

  if (sections.some((section) => section.id === "legal-and-contractable")) {
    items.push({
      failure_mode_id: "legal-and-contractable",
      text: "Receipt test: the same legal person on the card statement, who took the funds, who pays the provider, and who the customer hired. License gate by trade and ZIP before the card is charged if this is licensed work.",
    });
  }

  return items;
}

function namedTool(
  answers: AnswerMap,
  id: Parameters<typeof measuredValue>[1],
): string | null {
  return measuredValue(answers, id);
}

function fitModule(answers: AnswerMap): FitModule {
  const items: FitModule["items"] = [];
  const storefront = namedTool(answers, "q_tools_storefront");
  items.push({
    id: "web",
    title: "Web",
    body: storefront
      ? `You named ${storefront} as the storefront. Fit is a site that states who charges, what is delivered, and how refunds work — not a theme.`
      : "A site that states who charges, what is delivered, and how refunds work.",
  });

  const who = measuredValue(answers, "q_who_pays_whom");
  const statement = measuredValue(answers, "q_statement_name");
  const card = namedTool(answers, "q_tools_card");
  let psp =
    "Honest funds flow first: you take the card, or you do not. A processor shape comes after the plan.";
  if (who === "take_then_pay" && statement === "mine_one_stack") {
    psp =
      "One underwrite on you as merchant of record. Destination-charge stacks exist as a shape (Stripe Connect, PayPal Complete Payments). That is not a default and not an endorsement.";
  } else if (who === "take_then_pay" && statement === "mine_bank_fbo_payouts") {
    psp =
      "Card acquiring plus a payouts rail is the shape: acquiring on one side, Hyperwallet / Payoneer / Tipalti-class rails on the other. The rail does not move card risk.";
  } else if (who === "they_pay_provider") {
    psp =
      "A fee on the provider’s own merchant account. You are not sitting in the customer payment.";
  } else if (who === "i_sell") {
    psp = "A single merchant account for what you sell. One underwrite.";
  } else if (who === "take_then_pay" && statement === "providers") {
    psp =
      "This file has two stories. Fit cannot pick a stack until the statement matches who took the payment.";
  }
  if (card) {
    psp += ` You named ${card} for the card. That is a fact in the file, not approval.`;
  }
  items.push({ id: "psp", title: "PSP shape", body: psp });

  const fraud = namedTool(answers, "q_tools_fraud");
  items.push({
    id: "fraud",
    title: "Fraud scoring vs guarantee",
    body: fraud
      ? `You named ${fraud}. Scoring is not a guarantee. A guarantee is not merchant of record.`
      : "Scoring is not a guarantee. A guarantee is not merchant of record.",
  });

  const payouts = namedTool(answers, "q_tools_payouts");
  items.push({
    id: "payouts",
    title: "Payouts rail",
    body: payouts
      ? `You named ${payouts}. A payouts rail KYCs payees and sends money after you already took the card. Instant payout before confirm is a cash leak, not a MID veto.`
      : isMarketplace(answers)
        ? "A payouts rail KYCs payees and sends money after you already took the card. Instant payout before confirm is a cash leak, not a MID veto."
        : "A payouts rail is only in this file if you pay providers. It does not move card risk.",
  });

  return {
    intro:
      "Fit is not approval. Follow the plan first. What follows tends to match this file only if they follow the plan.",
    only_if_they_follow_the_plan: true,
    items,
  };
}

function claimedModel(answers: AnswerMap): Report["company"] {
  const entity = measuredValue(answers, "q_entity");
  const site = measuredValue(answers, "q_site");
  const name = entity || "This file";
  const who = measuredValue(answers, "q_who_pays_whom");
  const home = isHomeServices(answers);
  let form = "An internet/app money path, from the evidence file.";
  if (who === "take_then_pay" && home) {
    form =
      "Two-sided marketplace matching customers with independent tradespeople for jobs in the home.";
  } else if (who === "take_then_pay") {
    form =
      "Two-sided marketplace. The operator takes the customer payment, then pays providers.";
  } else if (who === "i_sell" && home) {
    form = "A home-services operator selling their own work.";
  } else if (who === "i_sell") {
    form = "A merchant selling their own goods or services.";
  } else if (who === "they_pay_provider") {
    form = "An introduction or software fee. The customer pays the provider.";
  }

  const bits: string[] = [];
  if (site) bits.push(`Site named: ${site}.`);
  if (who === "take_then_pay") {
    bits.push("The customer pays the operator. Providers are paid after.");
  } else if (who === "i_sell") {
    bits.push("The operator takes the customer payment for what they sell.");
  } else if (who === "they_pay_provider") {
    bits.push("The customer pays the provider. The operator takes a fee.");
  } else {
    bits.push("Funds flow was not named.");
  }
  const statement = measuredValue(answers, "q_statement_name");
  if (statement === "mine_one_stack") {
    bits.push("Statement name is the operator, one stack.");
  }
  if (statement === "mine_bank_fbo_payouts") {
    bits.push(
      "Statement name is the operator, with a bank FBO and a payouts rail.",
    );
  }
  if (statement === "providers") bits.push("Statement name is the provider.");

  return { name, form, claimed_model: bits.join(" ") };
}

function notesFor(glance: Glance): string {
  if (glance.model_condition === "insufficient_evidence") {
    return "Skip means unknown, not no. This file did not name a measured missing control for this money path, so the glance will not guess a break. Tools named in the file do not set the glance.";
  }
  return "Dominant break is the first measured missing control for this money path. The three checks sit in the first row when they apply, not in the glance. Tools do not set the glance. Skip remains unknown.";
}

export function compileReport(id: string, answers: AnswerMap): Report {
  const misses = collectMisses(answers);
  const glance = glanceFrom(answers, misses);
  const failure_modes = failureRows(answers, misses);
  const tripwire_sections = tripwires(answers);
  const if_this_model_is_to_hold = planItems(
    answers,
    misses,
    failure_modes,
    tripwire_sections,
  );

  return {
    id,
    access: "free",
    truncated: true,
    company: claimedModel(answers),
    glance,
    failure_modes,
    tripwire_sections,
    if_this_model_is_to_hold,
    notes: notesFor(glance),
    fit: fitModule(answers),
  };
}

export function compileReportJson(id: string, answers: AnswerMap) {
  return {
    ...compileReport(id, answers),
    answers: askedAnswers(answers),
  };
}
