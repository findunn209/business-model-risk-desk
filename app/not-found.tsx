import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-measure flex-1 px-6 py-20">
      <h1 className="font-serif text-4xl font-medium tracking-tight">
        Not found
      </h1>
      <p className="mt-4 max-w-measure text-muted">
        No page at this URL. Assessments of live sites are not available yet.
      </p>
      <p className="mt-6">
        <Link href="/">Home</Link>
      </p>
    </main>
  );
}
