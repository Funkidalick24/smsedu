"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    const data = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !data.ok) {
      setError(data.message ?? "Password reset failed.");
      return;
    }
    setMessage(data.message ?? "Password reset complete.");
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-blue-100 bg-white p-6 shadow-sm">
        <h1 className="text-xl font-bold text-blue-950">Reset Password</h1>
        <p className="mt-2 text-sm text-slate-600">Use the reset token and choose a new password.</p>

        <form className="mt-6" onSubmit={submit}>
          <label className="mb-2 block text-sm font-medium text-slate-700">Reset token</label>
          <input
            className="mb-4 w-full rounded-lg border border-blue-200 px-3 py-2"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />

          <label className="mb-2 block text-sm font-medium text-slate-700">New password</label>
          <input
            type="password"
            className="mb-4 w-full rounded-lg border border-blue-200 px-3 py-2"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            required
            minLength={8}
          />

          <button className="w-full rounded-lg bg-blue-700 p-2 font-medium text-white hover:bg-blue-800" type="submit">
            Reset Password
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-green-700">{message}</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <Link href="/login" className="mt-5 block text-sm text-blue-700 hover:underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}
