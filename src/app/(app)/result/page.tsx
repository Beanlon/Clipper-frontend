"use client";

import Link from "next/link";
import { saveClipToDevice } from "@/lib/local-store";

export default function ResultPage() {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="flex items-center justify-center border-r border-border bg-bg-stage py-12">
        <div className="preview-gradient relative aspect-[9/16] w-[200px] rounded-xl border border-border-strong">
          <div className="absolute inset-x-2.5 bottom-12 text-center text-xs text-white">
            this line hits hard
          </div>
          <div className="absolute bottom-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-accent font-bold text-accent-ink">
            ▶
          </div>
        </div>
      </section>

      <section className="flex flex-col justify-center bg-bg-app px-12 py-12">
        <p className="text-xs font-semibold text-accent">READY · LOCAL</p>
        <h1 className="font-brand mt-2 text-[28px] font-bold text-text">
          Your clips are ready
        </h1>
        <p className="mt-3 mb-6 max-w-[400px] text-sm text-text-muted">
          Preview on the left. Save to this device or open the CapCut-style clip
          editor.
        </p>
        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => saveClipToDevice("interview-cut-scene-2.txt")}
            className="rounded-xl bg-accent px-[18px] py-3 text-sm font-semibold text-accent-ink"
          >
            Save to device
          </button>
          <Link
            href="/editor"
            className="rounded-xl border border-border-strong bg-bg-panel px-[18px] py-3 text-sm text-text"
          >
            Open clip editor
          </Link>
        </div>
        <Link
          href="/library"
          className="mt-8 text-[13px] text-text-muted hover:text-text"
        >
          ← Back to Library
        </Link>
      </section>
    </div>
  );
}
