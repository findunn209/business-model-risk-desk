"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  LICENSE_CAN_DO_HELPER,
  REVIEW_IDS,
  REVIEW_QUIET,
  isHomeServices,
  isMarketplace,
  reviewRows,
  screenQuestionIds,
  visibleScreens,
  type Screen,
} from "@/lib/intake/questions";
import {
  SKIP,
  getAnswer,
  type AnswerMap,
  type IntakeAnswer,
  type QuestionId,
} from "@/lib/intake/schema";

const SKIP_LABEL = "I don’t know yet";

function setAnswer(map: AnswerMap, id: QuestionId, value: string): AnswerMap {
  const next: IntakeAnswer = {
    question_id: id,
    value: value.trim() || SKIP,
    evidence: value.trim() && value !== SKIP ? "measured" : "unknown",
    asked: true,
  };
  const merged: AnswerMap = { ...map, [id]: next };
  const keep = new Set<QuestionId>([
    ...visibleScreens(merged).flatMap(screenQuestionIds),
    ...REVIEW_IDS,
  ]);
  const pruned: AnswerMap = {};
  for (const [key, answer] of Object.entries(merged)) {
    if (keep.has(key as QuestionId) && answer) {
      pruned[key as QuestionId] = answer;
    }
  }
  pruned[id] = next;
  return pruned;
}

function skipScreen(map: AnswerMap, screen: Screen): AnswerMap {
  let next = map;
  for (const id of screenQuestionIds(screen)) {
    next = setAnswer(next, id, SKIP);
  }
  return next;
}

export function IntakeFlow() {
  const router = useRouter();
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [history, setHistory] = useState<number[]>([0]);
  const [returnToReview, setReturnToReview] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const screens = useMemo(() => visibleScreens(answers), [answers]);
  const index = history[history.length - 1] ?? 0;
  const screen = screens[Math.min(index, screens.length - 1)] ?? screens[0];

  function goTo(nextIndex: number) {
    setHistory((prev) => [...prev, nextIndex]);
  }

  function advance(nextAnswers: AnswerMap) {
    const nextScreens = visibleScreens(nextAnswers);
    if (returnToReview) {
      const reviewIndex = nextScreens.findIndex((item) => item.kind === "review");
      setReturnToReview(false);
      goTo(reviewIndex >= 0 ? reviewIndex : nextScreens.length - 1);
      return;
    }
    const currentId = screen.id;
    const currentAt = nextScreens.findIndex((item) => item.id === currentId);
    goTo(Math.min(currentAt + 1, nextScreens.length - 1));
  }

  function choose(id: QuestionId, value: string) {
    const next = setAnswer(answers, id, value);
    setAnswers(next);
    advance(next);
  }

  function skip() {
    const next = skipScreen(answers, screen);
    setAnswers(next);
    advance(next);
  }

  function back() {
    setReturnToReview(false);
    setHistory((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  }

  function edit(screenId: string) {
    const at = screens.findIndex((item) => item.id === screenId);
    if (at < 0) return;
    setReturnToReview(true);
    goTo(at);
  }

  async function writeReport() {
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/v1/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: Object.values(answers).filter((item) => item.asked),
        }),
      });
      if (!response.ok) {
        setError("Could not write the report.");
        setPending(false);
        return;
      }
      const body = (await response.json()) as { report_id?: string };
      if (!body.report_id) {
        setError("Could not write the report.");
        setPending(false);
        return;
      }
      router.push(`/r/${body.report_id}`);
    } catch {
      setError("Could not write the report.");
      setPending(false);
    }
  }

  const canBack = history.length > 1;

  return (
    <div className="mx-auto flex w-full max-w-measure flex-1 flex-col px-6 py-12">
      {canBack ? (
        <p className="mb-8">
          <button type="button" className="quiet-action" onClick={back}>
            Back
          </button>
        </p>
      ) : null}
      <ScreenView
        screen={screen}
        answers={answers}
        onChoose={choose}
        onSkip={skip}
        onSet={(id, value) => setAnswers(setAnswer(answers, id, value))}
        onContinue={() => {
          if (screen.kind === "chips") {
            let next = answers;
            for (const id of screenQuestionIds(screen)) {
              if (!getAnswer(next, id).asked) next = setAnswer(next, id, SKIP);
            }
            setAnswers(next);
            advance(next);
            return;
          }
          if (screen.kind === "text") {
            const id = screen.id;
            const next = getAnswer(answers, id).asked
              ? answers
              : setAnswer(answers, id, SKIP);
            setAnswers(next);
            advance(next);
            return;
          }
          advance(answers);
        }}
        onEdit={edit}
        onWrite={writeReport}
        pending={pending}
        error={error}
      />
    </div>
  );
}

function ScreenView({
  screen,
  answers,
  onChoose,
  onSkip,
  onSet,
  onContinue,
  onEdit,
  onWrite,
  pending,
  error,
}: {
  screen: Screen;
  answers: AnswerMap;
  onChoose: (id: QuestionId, value: string) => void;
  onSkip: () => void;
  onSet: (id: QuestionId, value: string) => void;
  onContinue: () => void;
  onEdit: (screenId: string) => void;
  onWrite: () => void;
  pending: boolean;
  error: string | null;
}) {
  if (screen.kind === "door") {
    return <Door onStart={onContinue} />;
  }
  if (screen.kind === "review") {
    return (
      <Review
        answers={answers}
        onEdit={onEdit}
        onSet={onSet}
        onWrite={onWrite}
        pending={pending}
        error={error}
      />
    );
  }
  if (screen.kind === "chips") {
    return (
      <Chips
        screen={screen}
        answers={answers}
        onSet={onSet}
        onSkip={onSkip}
        onContinue={onContinue}
      />
    );
  }
  if (screen.kind === "text") {
    return (
      <TextQuestion
        screen={screen}
        answers={answers}
        onSet={onSet}
        onSkip={onSkip}
        onContinue={onContinue}
      />
    );
  }
  return (
    <Choice
      screen={screen}
      onChoose={onChoose}
      onSkip={onSkip}
    />
  );
}

function Door({ onStart }: { onStart: () => void }) {
  return (
    <div>
      <h1 className="font-serif text-4xl font-medium tracking-tight">
        This is an evidence file
      </h1>
      <p className="mt-5 leading-relaxed">
        One fact per screen. If you do not know yet, say so. That is unknown, not
        no.
      </p>
      <p className="mt-3 leading-relaxed">
        We name where this money path breaks. We do not score you.
      </p>
      <p className="mt-10">
        <button type="button" className="primary-action" onClick={onStart}>
          Start the file
        </button>
      </p>
    </div>
  );
}

function Choice({
  screen,
  onChoose,
  onSkip,
}: {
  screen: Extract<Screen, { kind: "choice" }>;
  onChoose: (id: QuestionId, value: string) => void;
  onSkip: () => void;
}) {
  return (
    <div>
      {screen.quiet ? <p className="kicker mb-3">Quiet</p> : null}
      <h1 className="font-serif text-[2rem] font-medium leading-[1.15] tracking-tight">
        {screen.question}
      </h1>
      {screen.helper ? (
        <p className="mt-4 leading-relaxed text-muted">{screen.helper}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-3">
        {screen.choices.map((choice) => (
          <button
            key={choice.value}
            type="button"
            className="paper-card"
            onClick={() => onChoose(screen.id, choice.value)}
          >
            <span className="font-serif text-xl font-medium leading-snug">
              {choice.title}
            </span>
            {choice.body ? (
              <span className="mt-2 block text-sm leading-relaxed text-muted">
                {choice.body}
              </span>
            ) : null}
            {choice.examples ? (
              <span className="mt-3 block font-mono text-[11px] leading-relaxed tracking-wide text-muted">
                {choice.examples}
              </span>
            ) : null}
          </button>
        ))}
      </div>
      <p className="mt-6">
        <button type="button" className="quiet-action" onClick={onSkip}>
          {SKIP_LABEL}
        </button>
      </p>
    </div>
  );
}

function Chips({
  screen,
  answers,
  onSet,
  onSkip,
  onContinue,
}: {
  screen: Extract<Screen, { kind: "chips" }>;
  answers: AnswerMap;
  onSet: (id: QuestionId, value: string) => void;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const showLicense = isMarketplace(answers) || isHomeServices(answers);
  return (
    <div>
      <h1 className="font-serif text-[2rem] font-medium leading-[1.15] tracking-tight">
        {screen.question}
      </h1>
      {screen.helper ? (
        <p className="mt-4 leading-relaxed text-muted">{screen.helper}</p>
      ) : null}
      <div className="mt-8 flex flex-col gap-5">
        {screen.chips.map((chip) => {
          const current = getAnswer(answers, chip.id);
          const helper =
            chip.id === "q_provider_can" && showLicense
              ? LICENSE_CAN_DO_HELPER
              : chip.helper;
          return (
            <div key={chip.id} className="paper-card cursor-default">
              <p className="font-serif text-xl font-medium leading-snug">
                {chip.label}
              </p>
              {helper ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {helper}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  { value: "yes", label: "Yes" },
                  { value: "not_yet", label: "Not yet" },
                  { value: SKIP, label: SKIP_LABEL },
                ].map((option) => {
                  const pressed =
                    current.asked && current.value === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className="chip-action"
                      aria-pressed={pressed}
                      onClick={() => onSet(chip.id, option.value)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <button type="button" className="primary-action" onClick={onContinue}>
          Continue
        </button>
        <button type="button" className="quiet-action" onClick={onSkip}>
          {SKIP_LABEL}
        </button>
      </p>
    </div>
  );
}

function TextQuestion({
  screen,
  answers,
  onSet,
  onSkip,
  onContinue,
}: {
  screen: Extract<Screen, { kind: "text" }>;
  answers: AnswerMap;
  onSet: (id: QuestionId, value: string) => void;
  onSkip: () => void;
  onContinue: () => void;
}) {
  const current = getAnswer(answers, screen.id);
  const value = current.asked && current.value !== SKIP ? current.value : "";
  return (
    <div>
      {screen.quiet ? <p className="kicker mb-3">Quiet</p> : null}
      <h1 className="font-serif text-[2rem] font-medium leading-[1.15] tracking-tight">
        {screen.question}
      </h1>
      {screen.helper ? (
        <p className="mt-4 leading-relaxed text-muted">{screen.helper}</p>
      ) : null}
      <label className="mt-8 block">
        <span className="sr-only">{screen.question}</span>
        <input
          type="text"
          value={value}
          placeholder={screen.placeholder}
          maxLength={200}
          onChange={(event) => onSet(screen.id, event.target.value)}
          className="w-full border-0 border-b border-rule bg-transparent px-0 py-1.5 text-sm outline-none placeholder:text-faint"
        />
      </label>
      <p className="mt-8 flex flex-wrap items-baseline gap-x-5 gap-y-2">
        <button type="button" className="primary-action" onClick={onContinue}>
          Continue
        </button>
        <button type="button" className="quiet-action" onClick={onSkip}>
          {SKIP_LABEL}
        </button>
      </p>
    </div>
  );
}

function Review({
  answers,
  onEdit,
  onSet,
  onWrite,
  pending,
  error,
}: {
  answers: AnswerMap;
  onEdit: (screenId: string) => void;
  onSet: (id: QuestionId, value: string) => void;
  onWrite: () => void;
  pending: boolean;
  error: string | null;
}) {
  const rows = reviewRows(answers);
  const entity = getAnswer(answers, "q_entity");
  const site = getAnswer(answers, "q_site");
  const refund = getAnswer(answers, "q_refund");
  const cycle = getAnswer(answers, "q_this_cycle");

  return (
    <div>
      <h1 className="font-serif text-[2rem] font-medium leading-[1.15] tracking-tight">
        Review
      </h1>
      <p className="mt-4 leading-relaxed text-muted">
        Skip stays unknown. Edit a line to change it.
      </p>
      <div className="manila-sheet mt-8">
        <ol className="divide-y divide-[#d3c6ab]">
          {rows.map((row) => (
            <li
              key={`${row.screenId}-${row.question}`}
              className="flex flex-wrap items-baseline justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div>
                <p className="font-serif text-lg leading-snug">{row.question}</p>
                <p className="mt-1 text-sm text-muted">{row.valueLabel}</p>
              </div>
              <button
                type="button"
                className="quiet-action"
                onClick={() => onEdit(row.screenId)}
              >
                Edit
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-10">
        <p className="kicker">Quiet</p>
        <label className="mt-4 block">
          <span className="text-sm">{REVIEW_QUIET.q_entity.question}</span>
          <input
            type="text"
            value={
              entity.asked && entity.value !== SKIP ? entity.value : ""
            }
            placeholder={REVIEW_QUIET.q_entity.placeholder}
            maxLength={200}
            onChange={(event) => onSet("q_entity", event.target.value)}
            className="mt-1 w-full border-0 border-b border-rule bg-transparent px-0 py-1.5 text-sm outline-none placeholder:text-faint"
          />
        </label>
        <label className="mt-5 block">
          <span className="text-sm">{REVIEW_QUIET.q_site.question}</span>
          <input
            type="url"
            value={site.asked && site.value !== SKIP ? site.value : ""}
            placeholder={REVIEW_QUIET.q_site.placeholder}
            maxLength={200}
            onChange={(event) => onSet("q_site", event.target.value)}
            className="mt-1 w-full border-0 border-b border-rule bg-transparent px-0 py-1.5 text-sm outline-none placeholder:text-faint"
          />
        </label>
        <fieldset className="mt-6">
          <legend className="text-sm">{REVIEW_QUIET.q_refund.question}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REVIEW_QUIET.q_refund.choices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                className="chip-action"
                aria-pressed={refund.asked && refund.value === choice.value}
                onClick={() => onSet("q_refund", choice.value)}
              >
                {choice.title}
              </button>
            ))}
            <button
              type="button"
              className="chip-action"
              aria-pressed={refund.asked && refund.value === SKIP}
              onClick={() => onSet("q_refund", SKIP)}
            >
              {SKIP_LABEL}
            </button>
          </div>
        </fieldset>
        <fieldset className="mt-6">
          <legend className="text-sm">{REVIEW_QUIET.q_this_cycle.question}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REVIEW_QUIET.q_this_cycle.choices.map((choice) => (
              <button
                key={choice.value}
                type="button"
                className="chip-action"
                aria-pressed={cycle.asked && cycle.value === choice.value}
                onClick={() => onSet("q_this_cycle", choice.value)}
              >
                {choice.title}
              </button>
            ))}
            <button
              type="button"
              className="chip-action"
              aria-pressed={cycle.asked && cycle.value === SKIP}
              onClick={() => onSet("q_this_cycle", SKIP)}
            >
              {SKIP_LABEL}
            </button>
          </div>
        </fieldset>
      </div>

      {error ? (
        <p className="mt-6 text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}

      <p className="mt-10">
        <button
          type="button"
          className="primary-action"
          onClick={onWrite}
          disabled={pending}
        >
          {pending ? "Writing…" : "Write the report"}
        </button>
      </p>
    </div>
  );
}

