"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MOCK_LIBRARY, type ClipStatus } from "@/lib/local-store";

const FILTERS: Array<"All" | "Ready" | "Processing" | "Draft"> = [
  "All",
  "Ready",
  "Processing",
  "Draft",
];

function statusLabel(status: ClipStatus) {
  if (status === "processing") return "Processing…";
  if (status === "draft") return "Draft";
  return null;
}

export default function LibraryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const items = useMemo(() => {
    if (filter === "All") return MOCK_LIBRARY;
    const map: Record<string, ClipStatus> = {
      Ready: "ready",
      Processing: "processing",
      Draft: "draft",
    };
    return MOCK_LIBRARY.filter((i) => i.status === map[filter]);
  }, [filter]);

  return (
    <div className="px-10 py-9">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <p className="text-[13px] text-text-faint">Stored on this device</p>
          <h1 className="font-brand mt-1.5 text-[28px] font-bold text-text">
            Library
          </h1>
        </div>
        <Link
          href="/create"
          className="rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-accent-ink transition hover:brightness-110"
        >
          + New generation
        </Link>
      </div>

      <div className="mb-[18px] flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={
              filter === f
                ? "rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-accent-ink"
                : "rounded-full border border-border-strong bg-bg-panel px-3 py-1.5 text-xs text-text-muted"
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => {
          const meta =
            statusLabel(item.status) ??
            `${item.scenes} scenes · ${item.captionStyle} · ${item.framing} · local`;
          return (
            <Link
              key={item.id}
              href={item.status === "ready" ? "/result" : "/scenes"}
              className="overflow-hidden rounded-[14px] border border-border bg-bg-panel transition hover:border-border-strong"
            >
              <div className="relative h-[140px] bg-bg-stage">
                <div className="preview-gradient absolute inset-y-2.5 left-10 right-10 rounded-md" />
                {item.status === "processing" && (
                  <span className="absolute left-3 top-3 rounded bg-bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
                    Processing
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-[13px] font-semibold text-text">
                  {item.title}
                </p>
                <p className="mt-1 text-[11px] text-text-muted">{meta}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
