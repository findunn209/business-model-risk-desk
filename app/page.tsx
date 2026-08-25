import Link from "next/link";
import { PageKicker } from "@/components/PageKicker";
import { DISPLAY_PROMISE, DISPLAY_SUB } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-measure flex-1 flex-col justify-center px-6 py-16">
      <h1 className="font-serif text-[2.15rem] font-medium leading-[1.15] tracking-tight text-ink sm:text-5xl">
        {DISPLAY_PROMISE}
      </h1>
      <p className="mt-5 max-w-measure text-[1.05rem] leading-snug text-muted">
        {DISPLAY_SUB}
      </p>
      <PageKicker className="mt-6" />

      <p className="mt-12">
        <Link
          href="/intake"
          className="font-serif text-xl font-medium no-underline"
        >
          Start the evidence file
        </Link>
      </p>

      <form className="mt-12" aria-label="Assessments next">
        <label htmlFor="url" className="kicker block">
          Assessments next
        </label>
        <input
          id="url"
          name="url"
          type="url"
          disabled
          placeholder="https://"
          autoComplete="off"
          className="mt-1.5 w-full max-w-sm cursor-not-allowed border-0 border-b border-rule bg-transparent px-0 py-1.5 text-sm text-faint outline-none placeholder:text-faint"
        />
      </form>

      <p className="mt-10">
        <Link href="/r/sample">Read the Porchlist sample</Link>
      </p>
      <p className="mt-3 text-[13px]">
        <Link href="/method">Method</Link>
        <span className="text-faint"> · </span>
        <Link href="/r/sample.md">Markdown twin</Link>
      </p>
      <p className="mt-8 max-w-measure text-[13px] text-muted">
        If you use an agent, add{" "}
        <span className="font-mono text-[12px]">/mcp</span> in the agent host.
        It is optional.
      </p>
    </main>
  );
}
