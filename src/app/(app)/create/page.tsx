"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { greetingForHour } from "@/lib/format";
import {
  DEFAULT_SETTINGS,
  loadSettings,
  saveSettings,
  saveSourceStub,
  type CreateSettings,
} from "@/lib/local-store";

type SettingsTab = "Captions" | "Framing" | "Language" | "Scenes";

export default function CreatePage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const [url, setUrl] = useState("");
  const [settings, setSettings] = useState<CreateSettings>(DEFAULT_SETTINGS);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<SettingsTab>("Language");
  const [greeting, setGreeting] = useState("Good afternoon");

  useEffect(() => {
    setSettings(loadSettings());
    setGreeting(greetingForHour());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current?.contains(target) ||
        chipRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  const persist = (next: CreateSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const summary = `Captions: ${settings.captions} · Framing: ${settings.framing} · ${settings.language === "English" ? "EN" : "Fil"}`;

  const goScenes = (kind: "youtube" | "file", label: string) => {
    saveSourceStub({ kind, label });
    router.push("/scenes");
  };

  return (
    <div className="px-10 py-12 md:px-14">
      <h1 className="font-brand text-[34px] font-bold tracking-[-0.02em] text-text">
        {greeting}, Jeric
      </h1>
      <p className="mt-2.5 mb-7 text-[15px] text-text-muted">
        Drop in a long video. Get back captioned, ready-to-post clips.
      </p>

      <div className="mb-7 max-w-[720px] rounded-xl border border-[#3D3520] bg-[#1A1810] px-3.5 py-3 text-xs text-[#C4B06A]">
        <b className="text-[#E6D48A]">Local mode</b> — media stays on this
        device. YouTube fetch caches locally before you set scenes.
      </div>

      <div className="relative max-w-[720px]">
        <div className="rounded-2xl border border-border bg-bg-panel px-4 py-3.5">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube link or upload a file"
            className="mb-3.5 w-full bg-transparent px-1 py-2 text-sm text-text placeholder:text-text-faint outline-none"
          />
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="rounded-[10px] border border-border-strong bg-bg-app px-3 py-2 text-xs font-medium text-text"
              >
                Upload
              </button>
              <button
                ref={chipRef}
                type="button"
                aria-expanded={open}
                onClick={() => {
                  setOpen((v) => !v);
                  setTab("Language");
                }}
                className="rounded-full border border-border-strong bg-bg-nav-active px-3 py-2 text-xs text-[#B0B8C0]"
              >
                {summary}
              </button>
            </div>
            <button
              type="button"
              aria-label="Continue"
              onClick={() => {
                if (url.trim()) {
                  goScenes("youtube", url.trim());
                } else {
                  fileRef.current?.click();
                }
              }}
              className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-accent text-base font-bold text-accent-ink"
            >
              ↑
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) goScenes("file", file.name);
            }}
          />
        </div>

        {open && (
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Generation settings"
            className="absolute left-0 top-[calc(100%+10px)] z-30 flex w-full max-w-[520px] overflow-hidden rounded-2xl border border-border-strong bg-bg-panel shadow-[0_16px_48px_rgba(0,0,0,.45)] sm:left-8"
          >
            <div className="w-40 shrink-0 border-r border-border bg-bg-sidebar p-2.5">
              {(
                [
                  ["Captions", settings.captions],
                  ["Framing", `Auto ${settings.framing}`],
                  ["Language", settings.language],
                  ["Scenes", settings.scenesMode],
                ] as const
              ).map(([key, value]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  className={
                    tab === key
                      ? "w-full rounded-[10px] border border-accent/40 bg-bg-app px-3 py-2.5 text-left text-xs font-semibold text-text"
                      : "w-full rounded-[10px] px-3 py-2.5 text-left text-xs text-text-muted"
                  }
                >
                  {key}
                  <span
                    className={`mt-0.5 block text-[11px] ${tab === key ? "text-accent" : "text-text-faint"}`}
                  >
                    {value}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => persist(DEFAULT_SETTINGS)}
                className="mt-6 px-3 py-2 text-left text-[11px] text-text-faint"
              >
                Reset all settings
              </button>
            </div>

            <div className="min-w-0 flex-1 p-[18px]">
              {tab === "Language" && (
                <>
                  <p className="text-[15px] font-semibold text-text">
                    Subtitle language
                  </p>
                  <p className="mt-1.5 mb-4 text-xs text-text-muted">
                    Choose the language for auto-generated captions.
                  </p>
                  <div className="mb-[18px] flex gap-2">
                    {(["English", "Filipino"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => persist({ ...settings, language: lang })}
                        className={
                          settings.language === lang
                            ? "flex-1 rounded-xl bg-accent py-3 text-center text-[13px] font-semibold text-accent-ink"
                            : "flex-1 rounded-xl border border-border-strong py-3 text-center text-[13px] text-text-muted"
                        }
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {tab === "Captions" && (
                <>
                  <p className="text-[15px] font-semibold text-text">
                    Caption style
                  </p>
                  <p className="mt-1.5 mb-4 text-xs text-text-muted">
                    Burn-in style for auto-subs.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(["Clean", "Highlight", "Pop", "Box"] as const).map(
                      (c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => persist({ ...settings, captions: c })}
                          className={
                            settings.captions === c
                              ? "rounded-xl bg-accent py-3 text-[13px] font-semibold text-accent-ink"
                              : "rounded-xl border border-border-strong py-3 text-[13px] text-text-muted"
                          }
                        >
                          {c}
                        </button>
                      ),
                    )}
                  </div>
                </>
              )}

              {tab === "Framing" && (
                <>
                  <p className="text-[15px] font-semibold text-text">Framing</p>
                  <p className="mt-1.5 mb-4 text-xs text-text-muted">
                    Output aspect ratio for short-form clips.
                  </p>
                  <div className="flex gap-2">
                    {(["9:16", "16:9", "1:1"] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => persist({ ...settings, framing: f })}
                        className={
                          settings.framing === f
                            ? "flex-1 rounded-xl bg-accent py-3 text-[13px] font-semibold text-accent-ink"
                            : "flex-1 rounded-xl border border-border-strong py-3 text-[13px] text-text-muted"
                        }
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {tab === "Scenes" && (
                <>
                  <p className="text-[15px] font-semibold text-text">Scenes</p>
                  <p className="mt-1.5 mb-4 text-xs text-text-muted">
                    Multi-scene via filmstrip In/Out slider (not typed
                    timestamps).
                  </p>
                  <div className="rounded-xl border border-accent/40 bg-bg-accent-soft px-3 py-3 text-[13px] font-semibold text-accent">
                    Manual slider
                  </div>
                </>
              )}

              <p className="mt-4 text-xs text-text-muted">
                Next: set each scene with a timeline slider and live preview.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
