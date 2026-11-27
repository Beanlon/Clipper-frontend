"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthGate } from "@/components/AuthGate";
import { formatTimecode } from "@/lib/format";

const TOOLS = [
  { id: "media", icon: "▦", label: "Media" },
  { id: "text", icon: "Aa", label: "Text" },
  { id: "captions", icon: "Cc", label: "Captions" },
  { id: "overlay", icon: "▣", label: "Overlay" },
  { id: "effects", icon: "✦", label: "Effects" },
  { id: "split", icon: "✂", label: "Split" },
] as const;

const INSPECTOR_TABS = ["Captions", "Framing", "Audio", "Speed"] as const;
const CAPTION_STYLES = ["Clean", "Highlight", "Pop", "Box"] as const;

export default function ClipEditorPage() {
  return (
    <AuthGate>
      <ClipEditorShell />
    </AuthGate>
  );
}

function ClipEditorShell() {
  const [tool, setTool] = useState<(typeof TOOLS)[number]["id"]>("captions");
  const [tab, setTab] = useState<(typeof INSPECTOR_TABS)[number]>("Captions");
  const [style, setStyle] = useState<(typeof CAPTION_STYLES)[number]>("Clean");
  const [playing, setPlaying] = useState(false);
  const playhead = 2.4;
  const duration = 17.8;

  return (
    <div className="flex h-screen flex-col bg-editor-bg text-[#F5F5F5]">
      <header className="flex h-11 shrink-0 items-center justify-between border-b border-[#2A2A2A] bg-editor-chrome px-3.5">
        <div className="flex items-center gap-3.5">
          <span className="font-brand text-[15px] font-bold">Clipper</span>
          <span className="h-4 w-px bg-[#333]" />
          <Link href="/library" className="text-xs text-[#AAA]">
            ← Library
          </Link>
          <span className="text-xs font-medium">interview-cut · Scene 2</span>
          <span className="rounded border border-accent/40 bg-[#1F3D32] px-2 py-0.5 text-[10px] text-accent">
            Local · this device
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="text-[11px] text-[#888]">Autosaved locally</span>
          <button
            type="button"
            className="rounded-md border border-[#333] px-2.5 py-1.5 text-xs text-[#CCC]"
          >
            Undo
          </button>
          <button
            type="button"
            className="rounded-md bg-accent px-4 py-1.5 text-xs font-bold text-[#111]"
          >
            Export
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-14 shrink-0 flex-col items-center gap-0.5 border-r border-[#2A2A2A] bg-editor-chrome pt-2">
          {TOOLS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTool(t.id)}
              className={
                tool === t.id
                  ? "mb-0.5 w-12 rounded-lg bg-[#1F3D32] py-2 text-center"
                  : "w-12 rounded-lg py-2 text-center hover:bg-[#222]"
              }
            >
              <div
                className={`text-sm ${tool === t.id ? "" : "opacity-50"}`}
              >
                {t.icon}
              </div>
              <div
                className={`mt-0.5 text-[9px] ${tool === t.id ? "font-semibold text-accent" : "text-[#888]"}`}
              >
                {t.label}
              </div>
            </button>
          ))}
        </aside>

        <aside className="flex w-[220px] shrink-0 flex-col border-r border-[#2A2A2A] bg-editor-panel">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] px-3 py-2.5">
            <span className="text-xs font-semibold">Media</span>
            <span className="text-[11px] text-accent">+ Import</span>
          </div>
          <div className="flex flex-col gap-2 p-2.5">
            <div className="flex gap-2 rounded-lg border border-accent/40 bg-[#222] p-2">
              <div className="h-[54px] w-9 shrink-0 rounded bg-bg-stage" />
              <div>
                <p className="text-[11px] font-semibold">clip-scene-2.mp4</p>
                <p className="mt-1 text-[10px] text-[#888]">
                  17.8s · 9:16 · local
                </p>
              </div>
            </div>
            <div className="flex gap-2 rounded-lg border border-[#2A2A2A] bg-[#1A1A1A] p-2">
              <div className="h-[54px] w-9 shrink-0 rounded bg-bg-stage" />
              <div>
                <p className="text-[11px] font-semibold">source-fetch.mp4</p>
                <p className="mt-1 text-[10px] text-[#888]">12:48 · on disk</p>
              </div>
            </div>
          </div>
          <div className="mt-auto border-t border-[#2A2A2A] px-3 py-2.5">
            <p className="text-[10px] text-[#666]">
              Files stay in browser local storage / device — not uploaded to
              cloud.
            </p>
          </div>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col border-r border-[#2A2A2A] bg-[#0F0F0F]">
          <div className="relative flex flex-1 items-center justify-center p-3">
            <div className="relative aspect-[9/16] w-[200px] overflow-hidden rounded border border-[#333] bg-black shadow-[0_0_0_1px_#333]">
              <div className="preview-gradient absolute inset-0" />
              <div className="pointer-events-none absolute inset-[8%] border border-dashed border-accent/20" />
              <div className="absolute inset-x-2.5 bottom-14 text-center">
                <span className="inline-block px-1.5 py-0.5 text-sm font-semibold text-white outline outline-1 outline-offset-4 outline-accent [text-shadow:0_2px_8px_#000]">
                  this line hits hard
                </span>
              </div>
              <div className="absolute left-2 top-2 rounded bg-black/50 px-1.5 py-0.5 text-[9px] text-accent">
                9:16 · Safe area
              </div>
            </div>
          </div>
          <div className="flex h-12 shrink-0 items-center justify-center gap-4 border-t border-[#2A2A2A] bg-editor-chrome">
            <span className="text-sm text-[#666]">⏮</span>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-accent font-bold text-[#111]"
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <span className="text-sm text-[#666]">⏭</span>
            <span className="ml-3 font-mono text-xs tabular-nums text-accent">
              {formatTimecode(playhead)}
            </span>
            <span className="text-xs text-[#666]">/</span>
            <span className="font-mono text-xs tabular-nums text-[#888]">
              {formatTimecode(duration)}
            </span>
            <span className="ml-5 text-[11px] text-[#666]">1×</span>
          </div>
        </section>

        <aside className="flex w-[260px] shrink-0 flex-col bg-editor-panel">
          <div className="flex border-b border-[#2A2A2A]">
            {INSPECTOR_TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={
                  tab === t
                    ? "flex-1 border-b-2 border-accent px-1 py-2.5 text-center text-[11px] font-semibold text-accent"
                    : "flex-1 px-1 py-2.5 text-center text-[11px] text-[#888]"
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-hidden p-3">
            {tab === "Captions" && (
              <>
                <p className="mb-2 text-[10px] font-semibold tracking-wide text-[#888]">
                  STYLE
                </p>
                <div className="mb-3 grid grid-cols-2 gap-1.5">
                  {CAPTION_STYLES.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={
                        style === s
                          ? "rounded-md border border-accent bg-[#1F3D32] py-2 text-center text-[10px] font-semibold text-accent"
                          : "rounded-md border border-[#333] bg-[#222] py-2 text-center text-[10px] text-[#888]"
                      }
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <p className="mb-1.5 text-[10px] font-semibold text-[#888]">
                  TEXT
                </p>
                <div className="mb-2.5 rounded-md border border-accent bg-[#1F3D32] p-2 text-xs">
                  this line hits hard
                </div>
                <div className="mb-2.5 grid grid-cols-2 gap-1.5">
                  <div>
                    <p className="text-[9px] text-[#666]">In</p>
                    <div className="mt-1 rounded border border-[#333] bg-[#111] px-1.5 py-1.5 text-[11px]">
                      00:01.20
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-[#666]">Out</p>
                    <div className="mt-1 rounded border border-[#333] bg-[#111] px-1.5 py-1.5 text-[11px]">
                      00:03.80
                    </div>
                  </div>
                </div>
                <p className="mb-1.5 text-[10px] font-semibold text-[#888]">
                  POSITION
                </p>
                <div className="relative mb-3.5 h-1.5 rounded bg-[#111]">
                  <div className="absolute top-[-3px] left-[55%] h-3 w-3 rounded-full bg-accent" />
                </div>
                <p className="text-[11px] font-medium text-accent">
                  Split at playhead · Delete
                </p>
              </>
            )}
            {tab !== "Captions" && (
              <p className="text-xs text-[#888]">
                {tab} controls stub — CapCut NLE shell for P1.
              </p>
            )}
          </div>
        </aside>
      </div>

      <footer className="flex h-[200px] shrink-0 flex-col border-t border-[#2A2A2A] bg-editor-chrome">
        <div className="flex h-7 items-center justify-between border-b border-[#2A2A2A] px-3">
          <div className="flex items-center gap-3 text-[11px] text-[#888]">
            <span className="font-semibold text-[#EEE]">Timeline</span>
            <span>🧲 Snap</span>
            <span>−</span>
            <div className="relative h-[3px] w-[70px] rounded bg-[#2A2A2A]">
              <div className="absolute top-[-4px] left-[48%] h-2.5 w-2.5 rounded-full bg-accent" />
            </div>
            <span>+</span>
            <span className="text-[#666]">Fit</span>
          </div>
          <span className="text-[11px] text-accent">
            Playhead {formatTimecode(playhead)}
          </span>
        </div>

        <div className="relative flex flex-1 overflow-hidden py-1.5 pr-2.5">
          <div className="flex w-16 shrink-0 flex-col gap-1 pt-[18px]">
            <div className="flex h-9 items-center pl-2.5 text-[10px] text-[#888]">
              V1
            </div>
            <div className="flex h-7 items-center pl-2.5 text-[10px] text-[#888]">
              A1
            </div>
            <div className="flex h-9 items-center pl-2.5 text-[10px] text-[#888]">
              Text
            </div>
          </div>
          <div className="relative min-w-0 flex-1">
            <div className="mb-0.5 flex h-4 justify-between px-1 text-[9px] text-[#555]">
              <span>0s</span>
              <span>4s</span>
              <span>8s</span>
              <span>12s</span>
              <span>16s</span>
            </div>
            <div className="relative mb-1 h-9 rounded-sm bg-[#0A0A0A]">
              <div className="absolute inset-y-[3px] left-0 w-[92%] rounded-sm border border-accent/40 bg-gradient-to-r from-[#1a4a3c] to-[#00C48A88] px-2">
                <span className="text-[9px] font-semibold text-[#E8FBF4]">
                  scene-2 · 9:16
                </span>
              </div>
            </div>
            <div className="relative mb-1 h-7 rounded-sm bg-[#0A0A0A]">
              <div className="absolute inset-y-1 left-0 flex w-[92%] items-center justify-center rounded-sm bg-[#2A3340]">
                <div className="h-2.5 w-[90%] opacity-70 [background:repeating-linear-gradient(90deg,#4A90D9_0,#4A90D9_2px,transparent_2px,transparent_4px)]" />
              </div>
            </div>
            <div className="relative h-9 rounded-sm bg-[#0A0A0A]">
              <div className="absolute inset-y-1 left-[7%] flex w-[13%] items-center justify-center rounded-sm border border-accent bg-white/20 shadow-[0_0_0_1px_#00C48A44]">
                <span className="text-[8px] font-semibold text-accent">
                  hits hard
                </span>
              </div>
              <div className="absolute inset-y-1 left-[24%] flex w-[16%] items-center justify-center rounded-sm bg-[#333]">
                <span className="text-[8px] text-[#CCC]">punchline</span>
              </div>
              <div className="absolute inset-y-1 left-[44%] flex w-[14%] items-center justify-center rounded-sm bg-[#333]">
                <span className="text-[8px] text-[#CCC]">subscribe</span>
              </div>
            </div>
            <div
              className="absolute top-0 bottom-0 z-[5] w-0.5 bg-accent"
              style={{ left: "18%" }}
            >
              <div className="absolute top-0 -left-[5px] h-2.5 w-3 bg-accent [clip-path:polygon(50%_100%,0_0,100%_0)]" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
