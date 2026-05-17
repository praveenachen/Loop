"use client";

import { FormEvent, Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";

import { GooseImage } from "@/components/brand/goose-image";
import { Button } from "@/components/ui/button";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    setLoading(false);
    if (result?.error) {
      setError("Invalid credentials or non-UW email.");
      return;
    }
    router.push(callbackUrl);
  }

  return (
    <div className="w-full max-w-md rounded-3xl border border-stroke bg-gradient-to-br from-white to-surface-soft p-6 shadow-lift">
      <div className="mb-4 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 rounded-full border border-stroke bg-white px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-ink-soft">
          <Sparkles className="h-3.5 w-3.5" />
          Student Access
        </span>
        <GooseImage src="/geese/goose-backpack.png" alt="Loop goose mascot" className="h-14 w-14" fallbackClassName="h-14 w-14" />
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink">Sign in to Loop</h1>
      <p className="mt-2 text-sm text-ink-soft">Use your `@uwaterloo.ca` credentials to enter the verified network.</p>
      <form className="mt-5 space-y-3" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="name@uwaterloo.ca"
          className="w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm font-semibold shadow-sm"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full rounded-2xl border border-stroke bg-white px-4 py-3 text-sm font-semibold shadow-sm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error ? <p className="text-sm font-semibold text-study">{error}</p> : null}
        <Button type="submit" className="w-full text-base" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>
      <p className="mt-4 rounded-xl bg-white/80 px-3 py-2 text-xs font-semibold text-ink-soft">
        Seed login: `avery@uwaterloo.ca` / `LoopPass123!`
      </p>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInForm />
    </Suspense>
  );
}
