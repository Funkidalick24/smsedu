"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { roleToDashboardPath } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const result = await login(email, password);
    if (!result.ok) {
      setError(result.message ?? "Unable to login");
      return;
    }

    const sessionResponse = await fetch("/api/auth/session", { cache: "no-store" });
    const data = (await sessionResponse.json()) as { user: { role: Parameters<typeof roleToDashboardPath>[0] } | null };
    if (!data.user) {
      setError("Unable to determine dashboard destination.");
      return;
    }
    router.push(roleToDashboardPath(data.user.role));
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="grid w-full max-w-4xl gap-6 rounded-2xl border border-blue-200 bg-white p-6 shadow-lg shadow-blue-200/50 md:grid-cols-2">
        <section className="rounded-xl bg-blue-700 p-6 text-white">
          <h1 className="text-2xl font-bold">Welcome to SMSEdu</h1>
          <p className="mt-2 text-sm text-blue-100">
            Secure role-based sign in for administrators, teachers, students,
            parents, and super admins.
          </p>
          <div className="mt-6 space-y-2 text-xs">
            <p className="font-semibold uppercase tracking-wide">Development default</p>
            <p className="rounded bg-blue-800/70 px-2 py-1">
              `admin@smsedu.local` / `Admin123!`
            </p>
            <p className="text-blue-200">
              Change `DEFAULT_PASSWORD` in env for non-production seed users.
            </p>
          </div>
        </section>

        <form className="rounded-xl border border-blue-100 p-6" onSubmit={handleLogin}>
          <h2 className="mb-4 text-xl font-bold text-blue-950">Sign in</h2>

          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            className="mb-4 w-full rounded-lg border border-blue-200 px-3 py-2"
            placeholder="name@school.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
          <input
            type="password"
            className="mb-4 w-full rounded-lg border border-blue-200 px-3 py-2"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

          <button className="w-full rounded-lg bg-blue-700 p-2 font-medium text-white hover:bg-blue-800" type="submit">
            Login
          </button>

          <a href="/forgot-password" className="mt-3 block text-center text-sm text-blue-700 hover:underline">
            Forgot password?
          </a>
        </form>
      </div>
    </div>
  );
}
