export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-6">
      <main className="w-full max-w-xl rounded-lg bg-white p-8 shadow">
        <h1 className="mb-3 text-3xl font-bold">SMSEdu</h1>
        <p className="mb-6 text-gray-600">
          School Management System dashboard starter.
        </p>
        <a
          href="/login"
          className="inline-block rounded px-4 py-2 text-white"
        >
          Go to Login
        </a>
      </main>
    </div>
  );
}
