import type { AnswerMap, QuestionId } from "./schema";
import { getAnswer, isMeasured, measuredValue } from "./schema";

export type Choice = {
  value: string;
  title: string;
  body?: string;
  examples?: string;
};

export type Screen =
  | {
      id: "door";
      kind: "door";
    }
  | {
      id: QuestionId;
      kind: "choice";
      question: string;
      helper?: string;
      quiet?: boolean;
      skippable?: boolean;
      choices: Choice[];
      when: (answers: AnswerMap) => boolean;
    }
  | {
      id: "q_three_checks";
      kind: "chips";
      question: string;
      helper?: string;
      chips: {
        id: "q_provider_who" | "q_provider_can" | "q_work_got_done";
        label: string;
        helper?: string;
      }[];
      when: (answers: AnswerMap) => boolean;
    }
  | {
      id: QuestionId;
      kind: "text";
      question: string;
      helper?: string;
      quiet?: boolean;
      placeholder?: string;
      when: (answers: AnswerMap) => boolean;
    }
  | {
      id: "review";
      kind: "review";
    };

function who(answers: AnswerMap) {
  return measuredValue(answers, "q_who_pays_whom");
}

export function isMarketplace(answers: AnswerMap): boolean {
  return who(answers) === "take_then_pay";
}

export function theyCharge(answers: AnswerMap): boolean {
  const value = who(answers);
  return value === "take_then_pay" || value === "i_sell";
}

export function isHomeServices(answers: AnswerMap): boolean {
  return isMeasured(answers, "q_home_services", "yes");
}

export function showLicenseLegal(answers: AnswerMap): boolean {
  return isMarketplace(answers) || isHomeServices(answers);
}

export function chargeEarly(answers: AnswerMap): boolean {
  return isMeasured(answers, "q_charge_timing", "before_exists");
}

export function repeatingCharge(answers: AnswerMap): boolean {
  return isMeasured(answers, "q_negative_option", "yes");
}

export const LICENSE_CAN_DO_HELPER =
  "For licensed trades (plumbing, electrical, HVAC, roofing, locksmith) you match an active license class to this job ZIP before you charge, not a number collected once at signup. “Vetted” without that file is a claim.";

export const SCREENS: Screen[] = [
  { id: "door", kind: "door" },
  {
    id: "q_who_pays_whom",
    kind: "choice",
    question: "Who takes the customer’s payment?",
    helper:
      "Merchant of record is later. This is only who sits in the money.",
    when: () => true,
    choices: [
      {
        value: "i_sell",
        title: "I sell",
        body: "I take the payment for what I sell.",
      },
      {
        value: "take_then_pay",
        title: "I take, then pay providers",
        body: "The customer pays me. I pay the provider their share after.",
      },
      {
        value: "they_pay_provider",
        title: "They pay the provider; I take a fee",
        body: "The customer pays the provider. I charge a fee or a lead.",
      },
    ],
  },
  {
    id: "q_home_services",
    kind: "choice",
    quiet: true,
    skippable: true,
    question: "Is this home services?",
    helper:
      "Work in the customer’s home or yard: plumbing, electrical, HVAC, roofing, locksmith, cleaning, and the like.",
    when: () => true,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "no", title: "No" },
    ],
  },
  {
    id: "q_statement_name",
    kind: "choice",
    question: "Whose name is on the card statement?",
    helper:
      "Merchant of record is who took 100% of the customer payment. The statement name should match that person. This is not a default to Connect.",
    when: () => true,
    choices: [
      {
        value: "mine_one_stack",
        title: "Mine, one stack",
        body: "The customer pays my merchant account. One processor.",
        examples: "Stripe Connect, PayPal Complete Payments.",
      },
      {
        value: "mine_bank_fbo_payouts",
        title: "Mine; bank FBO and a payouts rail",
        body: "The charge is mine. Payouts leave a bank account for benefit of others.",
        examples: "Adyen vs Hyperwallet, Payoneer, Tipalti.",
      },
      {
        value: "providers",
        title: "The provider’s",
        body: "The statement names the worker or seller, not me.",
      },
    ],
  },
  {
    id: "q_charge_timing",
    kind: "choice",
    question: "When do you charge?",
    when: () => true,
    choices: [
      {
        value: "before_exists",
        title: "Before the thing exists",
        body: "Prepaid, a deposit, or a job that has not happened yet.",
      },
      {
        value: "when_exists",
        title: "When they buy what already exists",
        body: "Goods in hand, a session that starts now, a file they get now.",
      },
      {
        value: "after_confirm",
        title: "After the work is confirmed",
        body: "You charge once someone says the job is done.",
      },
    ],
  },
  {
    id: "q_time_until_exists",
    kind: "choice",
    question: "How long until it exists?",
    when: chargeEarly,
    choices: [
      { value: "days", title: "Days" },
      { value: "weeks", title: "Weeks" },
      { value: "months", title: "Months" },
    ],
  },
  {
    id: "q_when_pay_provider",
    kind: "choice",
    question: "When do you pay the provider?",
    helper:
      "Instant payout before the job is confirmed is a cash leak, not a reason a processor account is impossible.",
    when: isMarketplace,
    choices: [
      {
        value: "instant_before_confirm",
        title: "Instant, before confirm",
        body: "They get paid before the customer confirms the work.",
      },
      {
        value: "after_confirm",
        title: "After the job is confirmed",
        body: "Payout waits until the work is confirmed.",
      },
    ],
  },
  {
    id: "q_three_checks",
    kind: "chips",
    question: "The three checks",
    helper:
      "Who they are, whether they can do this job here, and whether the work got done. Hidden is unknown. not_yet on a shown chip can be the break.",
    when: isMarketplace,
    chips: [
      {
        id: "q_provider_who",
        label: "Who they are",
        helper: "You know the person you will pay, for this job.",
      },
      {
        id: "q_provider_can",
        label: "Can do this job here",
      },
      {
        id: "q_work_got_done",
        label: "Work got done",
        helper: "You have a file that the job was done before payout.",
      },
    ],
  },
  {
    id: "q_license_at_zip",
    kind: "choice",
    skippable: true,
    question: "Do you match an active license to this job ZIP before you charge?",
    helper: LICENSE_CAN_DO_HELPER,
    when: showLicenseLegal,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "not_yet", title: "Not yet" },
    ],
  },
  {
    id: "q_off_platform_repeat",
    kind: "choice",
    quiet: true,
    skippable: true,
    question: "After the first job, do they come back through you?",
    when: isMarketplace,
    choices: [
      {
        value: "they_stay",
        title: "The next job stays on the platform",
      },
      {
        value: "they_leave",
        title: "They deal with each other directly",
      },
    ],
  },
  {
    id: "q_who_sets_price",
    kind: "choice",
    quiet: true,
    skippable: true,
    question: "Who sets the price the customer pays?",
    when: isMarketplace,
    choices: [
      { value: "platform", title: "I do" },
      { value: "provider", title: "The provider does" },
    ],
  },
  {
    id: "q_deposits",
    kind: "choice",
    quiet: true,
    skippable: true,
    question: "Do you take a deposit or prepaid job credit before the work?",
    when: showLicenseLegal,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "no", title: "No" },
    ],
  },
  {
    id: "q_holding_funds",
    kind: "choice",
    quiet: true,
    skippable: true,
    question: "Do you hold the customer’s money until the job is done?",
    helper:
      "Holding other people’s money as a business can be money transmission. Do not keep it in the operating account.",
    when: showLicenseLegal,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "no", title: "No" },
    ],
  },
  {
    id: "q_classification",
    kind: "choice",
    quiet: true,
    skippable: true,
    question: "Do you treat providers as independent contractors?",
    when: showLicenseLegal,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "no", title: "No" },
    ],
  },
  {
    id: "q_negative_option",
    kind: "choice",
    question: "Do you start a repeating charge unless they cancel?",
    when: theyCharge,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "no", title: "No" },
    ],
  },
  {
    id: "q_cancel_path",
    kind: "choice",
    question: "Can they cancel on the same path they signed up?",
    when: repeatingCharge,
    choices: [
      { value: "yes", title: "Yes" },
      { value: "not_yet", title: "Not yet" },
    ],
  },
  {
    id: "q_tools_card",
    kind: "text",
    quiet: true,
    question: "What takes the card, if you know?",
    helper: "A tool is not merchant of record. Skip if you have not picked one.",
    placeholder: "Processor, PayFac, or not yet",
    when: () => true,
  },
  {
    id: "q_tools_payouts",
    kind: "text",
    quiet: true,
    question: "What pays providers, if you know?",
    helper: "A payouts rail KYCs payees and sends money. It does not move card risk.",
    placeholder: "Payouts rail, or not yet",
    when: () => true,
  },
  {
    id: "q_tools_fraud",
    kind: "text",
    quiet: true,
    question: "What fraud tool do you use, if any?",
    helper:
      "Scoring is not a guarantee. A guarantee is not merchant of record.",
    placeholder: "Scoring, a guarantee, or none",
    when: () => true,
  },
  {
    id: "q_tools_storefront",
    kind: "text",
    quiet: true,
    question: "Where does the customer buy?",
    helper: "A site, an app, or a page. Not a score.",
    placeholder: "Site, app, or not yet",
    when: () => true,
  },
  { id: "review", kind: "review" },
];

export function visibleScreens(answers: AnswerMap): Screen[] {
  return SCREENS.filter((screen) => {
    if (screen.kind === "door" || screen.kind === "review") return true;
    return screen.when(answers);
  });
}

export function screenQuestionIds(screen: Screen): QuestionId[] {
  if (screen.kind === "chips") return screen.chips.map((chip) => chip.id);
  if (screen.kind === "choice" || screen.kind === "text") return [screen.id];
  return [];
}

export function reviewRows(answers: AnswerMap): {
  screenId: string;
  question: string;
  valueLabel: string;
  quiet?: boolean;
}[] {
  const rows: {
    screenId: string;
    question: string;
    valueLabel: string;
    quiet?: boolean;
  }[] = [];

  for (const screen of visibleScreens(answers)) {
    if (screen.kind === "door" || screen.kind === "review") continue;
    if (screen.kind === "chips") {
      for (const chip of screen.chips) {
        const answer = getAnswer(answers, chip.id);
        rows.push({
          screenId: screen.id,
          question: chip.label,
          valueLabel: labelFor(chip.id, answer.asked ? answer.value : "skip"),
        });
      }
      continue;
    }
    const answer = getAnswer(answers, screen.id);
    rows.push({
      screenId: screen.id,
      question: screen.question,
      valueLabel: labelFor(screen.id, answer.asked ? answer.value : "skip"),
      quiet: screen.quiet,
    });
  }

  return rows;
}

function labelFor(id: QuestionId, value: string): string {
  if (value === "skip") return "I don’t know yet";
  if (id === "q_tools_card" || id === "q_tools_payouts" || id === "q_tools_fraud" || id === "q_tools_storefront" || id === "q_entity" || id === "q_site") {
    return value;
  }
  const screen = SCREENS.find(
    (item) => item.kind === "choice" && item.id === id,
  );
  if (screen && screen.kind === "choice") {
    const choice = screen.choices.find((item) => item.value === value);
    if (choice) return choice.title;
  }
  if (id === "q_provider_who" || id === "q_provider_can" || id === "q_work_got_done") {
    if (value === "yes") return "Yes";
    if (value === "not_yet") return "Not yet";
  }
  if (id === "q_this_cycle") {
    if (value === "live") return "Live";
    if (value === "pre_launch") return "Pre-launch";
  }
  if (id === "q_refund") {
    if (value === "yes") return "Posted";
    if (value === "not_yet") return "Not yet";
  }
  return value;
}

export const REVIEW_IDS = [
  "q_entity",
  "q_site",
  "q_refund",
  "q_this_cycle",
] as const satisfies readonly QuestionId[];

export const REVIEW_QUIET = {
  q_entity: {
    question: "Legal name, if you want it on the file",
    placeholder: "Entity name",
  },
  q_site: {
    question: "Site",
    placeholder: "https://",
  },
  q_refund: {
    question: "Is a refund path posted?",
    choices: [
      { value: "yes", title: "Yes" },
      { value: "not_yet", title: "Not yet" },
    ],
  },
  q_this_cycle: {
    question: "This cycle",
    choices: [
      { value: "live", title: "Live" },
      { value: "pre_launch", title: "Pre-launch" },
    ],
  },
} as const;
