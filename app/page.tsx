import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <main className="w-full max-w-2xl rounded-2xl border border-blue-200 bg-white p-10 shadow-lg shadow-blue-200/50">
        <p className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
          Production-ready foundation
        </p>
        <h1 className="mb-3 text-4xl font-black text-blue-950">SMSEdu</h1>
        <p className="mb-8 text-slate-600">
          A role-based school management experience with validated login,
          personalized dashboards, and a consistent blue-first visual system.
        </p>

        <Link
          href="/login"
          className="inline-flex rounded-lg bg-blue-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800"
        >
          Launch Login
        </Link>
      </main>
    </div>
  );
}
