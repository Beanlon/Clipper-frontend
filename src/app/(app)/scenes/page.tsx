"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SceneRangeSlider } from "@/components/SceneRangeSlider";
import { formatTimecode } from "@/lib/format";
import {
  DEFAULT_SCENES,
  SOURCE_DURATION_SEC,
  loadScenes,
  loadSettings,
  saveScenes,
  type CreateSettings,
  type SceneRange,
} from "@/lib/local-store";

export default function ScenesPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<SceneRange[]>(DEFAULT_SCENES);
  const [activeId, setActiveId] = useState(DEFAULT_SCENES[1]?.id ?? "s1");
  const [playhead, setPlayhead] = useState(DEFAULT_SCENES[1]?.inSec ?? 0);
  const [playing, setPlaying] = useState(false);
  const [settings, setSettings] = useState<CreateSettings | null>(null);

  useEffect(() => {
    const loaded = loadScenes();
    setScenes(loaded);
    setActiveId(loaded[loaded.length - 1]?.id ?? loaded[0]?.id);
    setPlayhead(loaded[loaded.length - 1]?.inSec ?? 0);
    setSettings(loadSettings());
  }, []);

  const active = useMemo(
    () => scenes.find((s) => s.id === activeId) ?? scenes[0],
    [scenes, activeId],
  );

  useEffect(() => {
    if (!playing || !active) return;
    const id = window.setInterval(() => {
      setPlayhead((p) => {
        if (p >= active.outSec) {
          setPlaying(false);
          return active.outSec;
        }
        return Math.min(active.outSec, p + 0.1);
      });
    }, 100);
    return () => window.clearInterval(id);
  }, [playing, active]);

  const updateActive = (next: { inSec: number; outSec: number }) => {
    setScenes((prev) => {
      const updated = prev.map((s) =>
        s.id === activeId ? { ...s, ...next } : s,
      );
      saveScenes(updated);
      return updated;
    });
  };

  const addScene = () => {
    const last = scenes[scenes.length - 1];
    const inSec = Math.min(
      SOURCE_DURATION_SEC - 15,
      (last?.outSec ?? 0) + 5,
    );
    const outSec = Math.min(SOURCE_DURATION_SEC, inSec + 15);
    const scene: SceneRange = {
      id: `s${Date.now()}`,
      label: `Scene ${scenes.length + 1}`,
      inSec,
      outSec,
    };
    const next = [...scenes, scene];
    setScenes(next);
    saveScenes(next);
    setActiveId(scene.id);
    setPlayhead(inSec);
  };

  if (!active) return null;

  const chip = settings
    ? `${settings.captions} · ${settings.framing} · ${settings.language === "English" ? "EN" : "Fil"}`
    : "Clean · 9:16 · EN";

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex items-center justify-between px-7 pt-5">
        <div>
          <p className="text-xs text-text-faint">New generation · local source</p>
          <p className="mt-1 text-xl font-semibold text-text">Choose scenes</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-border-strong bg-bg-panel px-3 py-1.5 text-xs text-text-muted">
            {chip}
          </span>
          <button
            type="button"
            onClick={() => router.push("/result")}
            className="rounded-xl bg-accent px-4 py-2.5 text-[13px] font-semibold text-accent-ink"
          >
            Generate clips
          </button>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 px-7 py-4 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="flex min-h-0 flex-col rounded-2xl border border-border bg-bg-panel p-4">
          <div className="relative flex min-h-[280px] flex-1 items-center justify-center rounded-xl bg-bg-stage">
            <div className="preview-gradient relative aspect-[9/16] w-[150px] overflow-hidden rounded-lg border border-border-strong shadow-[0_8px_32px_rgba(0,0,0,.5)]">
              <div className="absolute inset-x-2 bottom-10 text-center text-[11px] text-white [text-shadow:0_1px_4px_#000]">
                Preview @ {formatTimecode(playhead).slice(0, 5)}
              </div>
              <button
                type="button"
                onClick={() => setPlaying((p) => !p)}
                className="absolute bottom-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-ink"
              >
                {playing ? "❚❚" : "▶"}
              </button>
            </div>
            <div className="absolute left-3 top-3 rounded-md border border-accent/40 bg-bg-accent-soft px-2 py-1 text-[11px] text-accent">
              {active.label} selected
            </div>
          </div>

          <div className="mt-3 mb-2 flex items-center gap-3">
            <button
              type="button"
              className="text-xs text-text-faint"
              onClick={() => setPlayhead(active.inSec)}
            >
              ⏮
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-ink"
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <button
              type="button"
              className="text-xs text-text-faint"
              onClick={() => setPlayhead(active.outSec)}
            >
              ⏭
            </button>
            <span className="font-mono text-xs font-semibold tabular-nums text-accent">
              {formatTimecode(playhead)}
            </span>
            <span className="text-xs text-text-faint">/</span>
            <span className="font-mono text-xs tabular-nums text-text-muted">
              {formatTimecode(SOURCE_DURATION_SEC)}
            </span>
          </div>

          <SceneRangeSlider
            duration={SOURCE_DURATION_SEC}
            inSec={active.inSec}
            outSec={active.outSec}
            playhead={playhead}
            onChange={updateActive}
            onPlayheadChange={setPlayhead}
          />
        </section>

        <aside className="flex flex-col rounded-2xl border border-border bg-bg-panel p-4">
          <p className="mb-3 text-[13px] font-semibold text-text">
            Scenes in this generation
          </p>
          <div className="mb-3 flex flex-col gap-2">
            {scenes.map((scene) => {
              const selected = scene.id === activeId;
              const dur = (scene.outSec - scene.inSec).toFixed(1);
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => {
                    setActiveId(scene.id);
                    setPlayhead(scene.inSec);
                    setPlaying(false);
                  }}
                  className={
                    selected
                      ? "flex items-center gap-2.5 rounded-xl border border-accent bg-bg-accent-soft px-3 py-2.5 text-left"
                      : "flex items-center gap-2.5 rounded-xl border border-border-strong bg-bg-sidebar px-3 py-2.5 text-left"
                  }
                >
                  <div className="h-12 w-7 shrink-0 rounded bg-bg-stage" />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-semibold ${selected ? "text-accent" : "text-text"}`}
                    >
                      {scene.label}
                      {selected ? " · editing" : ""}
                    </p>
                    <p
                      className={`mt-0.5 text-[11px] ${selected ? "text-accent" : "text-text-muted"}`}
                    >
                      {formatTimecode(scene.inSec)} –{" "}
                      {formatTimecode(scene.outSec)} · {dur}s
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={addScene}
            className="mb-3 rounded-xl border border-dashed border-accent px-3 py-3 text-center text-[13px] font-semibold text-accent"
          >
            + Clip another scene
          </button>
          <p className="text-[11px] text-text-faint">
            Adds a new range on the same slider. Scrub to preview before locking
            In/Out.
          </p>
          <Link
            href="/create"
            className="mt-auto pt-4 text-[11px] text-text-muted hover:text-text"
          >
            ← Back to Create
          </Link>
        </aside>
      </div>
    </div>
  );
}
