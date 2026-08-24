import { PROMISE, SITE_NAME } from "@/lib/site";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-6 py-20">
      <h1 className="max-w-xl font-serif text-4xl font-medium tracking-tight text-ink sm:text-5xl">
        {SITE_NAME}
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-snug text-ink sm:text-xl">
        {PROMISE}
      </p>

      <form className="mt-14 max-w-xl" aria-describedby="url-helper">
        <label htmlFor="url" className="block text-sm text-muted">
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          disabled
          placeholder="https://"
          autoComplete="off"
          className="mt-2 w-full cursor-not-allowed border-0 border-b border-rule bg-transparent px-0 py-2 text-lg text-faint outline-none placeholder:text-faint"
        />
        <p id="url-helper" className="mt-3 text-sm text-muted">
          Assessments next
        </p>
      </form>
    </main>
  );
}
