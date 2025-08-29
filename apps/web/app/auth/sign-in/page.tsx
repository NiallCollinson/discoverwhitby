"use client";
import { useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <form method="post" action="/api/auth/signin/email" className="mt-6 space-y-4">
        <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-md border px-3 py-2" />
        <button className="w-full rounded-md bg-black px-3 py-2 text-white">Send magic link</button>
      </form>
      <div className="mt-6">
        <a href="/api/auth/signin/google" className="inline-flex w-full items-center justify-center rounded-md border px-3 py-2">Sign in with Google</a>
      </div>
    </main>
  );
}


