"use client";

import { useRouter } from "next/navigation";
import { signOutMock } from "@/lib/local-store";

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-xl px-10 py-12">
      <p className="text-[13px] text-text-faint">Account</p>
      <h1 className="font-brand mt-1.5 text-[28px] font-bold text-text">
        Settings
      </h1>

      <div className="mt-8 space-y-4 rounded-2xl border border-border bg-bg-panel p-5">
        <div>
          <p className="text-xs font-semibold text-text-muted">Storage</p>
          <p className="mt-1 text-sm text-text">
            Local only — media, projects, and exports stay on this device. No
            cloud media sync in MVP.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold text-text-muted">Auth</p>
          <p className="mt-1 text-sm text-text">
            Mock session via localStorage. Supabase Auth will replace this when
            the backend lands.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            signOutMock();
            router.replace("/login");
          }}
          className="rounded-xl border border-border-strong px-4 py-2.5 text-[13px] text-text"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
