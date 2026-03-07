"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setResetToken(null);

    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = (await response.json()) as { ok: boolean; message?: string; resetToken?: string };
    if (!response.ok || !data.ok) {
      setError(data.message ?? "Failed to request password reset.");
      return;
    }

    setMessage(data.message ?? "If the account exists, reset instructions have been sent.");
    if (data.resetToken) {
      setResetToken(data.resetToken);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-blue-950">Forgot Password</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your account email to request a reset link.</p>

        <form className="mt-6" onSubmit={submit}>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            className="mb-4 w-full rounded-lg border border-blue-200 px-3 py-2"
            placeholder="name@school.edu"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button className="w-full rounded-lg bg-blue-700 p-2 font-medium text-white hover:bg-blue-800" type="submit">
            Request Reset
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {resetToken ? (
          <p className="mt-4 rounded bg-blue-50 p-3 text-xs text-blue-900">
            Development reset token: <code>{resetToken}</code>
          </p>
        ) : null}

        <Link href="/reset-password" className="mt-5 block text-sm text-blue-700 hover:underline">
          Already have a token? Reset password
        </Link>
        <Link href="/login" className="mt-2 block text-sm text-blue-700 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
