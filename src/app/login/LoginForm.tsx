"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signInMock } from "@/lib/local-store";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/library";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const finish = () => {
    signInMock(email);
    router.push(next.startsWith("/") ? next : "/library");
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    finish();
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <section className="flex flex-col justify-center bg-[radial-gradient(ellipse_at_20%_20%,#0A2E24_0%,#0B0D10_55%)] px-10 py-16 md:px-16">
        <span className="font-brand text-[32px] font-bold text-text">
          Clipper
        </span>
        <p className="mt-4 max-w-[400px] text-[22px] font-semibold leading-snug text-text">
          Drop in a long video. Get back captioned clips.
        </p>
        <p className="mt-3 max-w-[380px] text-sm text-text-muted">
          Dark web app · SupoClip workflow · CapCut editor · local storage on
          your device.
        </p>
      </section>

      <section className="flex items-center justify-center border-l border-border bg-bg-sidebar px-6 py-16">
        <form onSubmit={onSubmit} className="w-full max-w-[340px]">
          <p className="text-xl font-semibold text-text">Sign in</p>
          <p className="mt-2 mb-5 text-[13px] text-text-muted">
            Continue to your local library
          </p>

          <label className="sr-only" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-2.5 w-full rounded-xl border border-border-strong bg-bg-app px-3 py-3 text-[13px] text-text placeholder:text-text-faint outline-none focus:border-accent"
          />

          <label className="sr-only" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded-xl border border-border-strong bg-bg-app px-3 py-3 text-[13px] text-text placeholder:text-text-faint outline-none focus:border-accent"
          />

          <button
            type="submit"
            className="mb-2.5 w-full rounded-xl bg-accent py-3 text-center text-sm font-semibold text-accent-ink transition hover:brightness-110"
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={finish}
            className="w-full rounded-xl border border-border-strong py-3 text-center text-[13px] text-text transition hover:bg-bg-panel"
          >
            Continue with Google
          </button>

          <p className="mt-4 text-center text-[11px] text-text-faint">
            Auth is mocked until Supabase is wired. Any credentials work.
          </p>
        </form>
      </section>
    </div>
  );
}
