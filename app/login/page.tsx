"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(email, password);

    if (email === "admin@test.com") router.push("/dashboard/admin");
    if (email === "teacher@test.com") router.push("/dashboard/teacher");
    if (email === "student@test.com") router.push("/dashboard/student");
    if (email === "parent@test.com") router.push("/dashboard/parent");
    if (email === "super@test.com") router.push("/dashboard/super-admin");
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-96 rounded-lg bg-white p-6 shadow-lg">
        <h1 className="mb-4 text-xl font-bold">School Login</h1>

        <input
          className="mb-3 w-full border p-2"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="mb-4 w-full border p-2"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full rounded bg-blue-600 p-2 text-white"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}
