"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    // Fake auth — any credentials work in demo mode
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-[var(--color-text)] mb-1">Sign in</h1>
        <p className="text-sm text-[var(--color-text-muted)] mb-5">
          Enter your credentials to access the fleet manager.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@rentacar.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              error={!!error && !email}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              error={!!error && !password}
            />
          </div>

          {error && (
            <p className="text-xs text-[var(--color-danger)]">{error}</p>
          )}

          <Button type="submit" className="w-full" loading={loading}>
            Sign in
          </Button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-[var(--color-text-muted)]">
        Demo mode — any credentials accepted
      </p>
    </div>
  );
}
