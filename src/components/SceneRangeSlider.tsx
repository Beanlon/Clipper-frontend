"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { formatTimecode } from "@/lib/format";

type Props = {
  duration: number;
  inSec: number;
  outSec: number;
  playhead: number;
  onChange: (next: { inSec: number; outSec: number }) => void;
  onPlayheadChange: (sec: number) => void;
};

type DragKind = "in" | "out" | "range" | "playhead" | null;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function SceneRangeSlider({
  duration,
  inSec,
  outSec,
  playhead,
  onChange,
  onPlayheadChange,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    kind: DragKind;
    startX: number;
    startIn: number;
    startOut: number;
  } | null>(null);
  const [dragging, setDragging] = useState<DragKind>(null);

  const pct = useCallback(
    (sec: number) => (duration > 0 ? (sec / duration) * 100 : 0),
    [duration],
  );

  const secFromClientX = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el || duration <= 0) return 0;
      const rect = el.getBoundingClientRect();
      const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
      return ratio * duration;
    },
    [duration],
  );

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const drag = dragRef.current;
      if (!drag?.kind) return;
      const sec = secFromClientX(e.clientX);
      if (drag.kind === "in") {
        onChange({ inSec: clamp(sec, 0, outSec - 0.1), outSec });
        onPlayheadChange(clamp(sec, 0, outSec - 0.1));
      } else if (drag.kind === "out") {
        onChange({ inSec, outSec: clamp(sec, inSec + 0.1, duration) });
        onPlayheadChange(clamp(sec, inSec + 0.1, duration));
      } else if (drag.kind === "playhead") {
        onPlayheadChange(clamp(sec, 0, duration));
      } else if (drag.kind === "range") {
        const el = trackRef.current;
        if (!el) return;
        const dx = e.clientX - drag.startX;
        const dSec = (dx / el.getBoundingClientRect().width) * duration;
        const span = drag.startOut - drag.startIn;
        let nextIn = drag.startIn + dSec;
        let nextOut = drag.startOut + dSec;
        if (nextIn < 0) {
          nextIn = 0;
          nextOut = span;
        }
        if (nextOut > duration) {
          nextOut = duration;
          nextIn = duration - span;
        }
        onChange({ inSec: nextIn, outSec: nextOut });
      }
    };

    const onUp = () => {
      dragRef.current = null;
      setDragging(null);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [duration, inSec, outSec, onChange, onPlayheadChange, secFromClientX]);

  const startDrag = (kind: DragKind, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragRef.current = {
      kind,
      startX: e.clientX,
      startIn: inSec,
      startOut: outSec,
    };
    setDragging(kind);
  };

  const selected = outSec - inSec;

  return (
    <div className="rounded-xl border border-border bg-bg-sidebar px-3.5 pb-3.5 pt-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold text-[#B0B8C0]">
          Scene range
        </span>
        <span className="text-[11px] font-semibold text-accent">
          {selected.toFixed(1)}s selected
        </span>
      </div>

      <div
        ref={trackRef}
        className="filmstrip-track relative h-12 cursor-pointer overflow-hidden rounded-lg select-none"
        onPointerDown={(e) => {
          const sec = secFromClientX(e.clientX);
          onPlayheadChange(sec);
          startDrag("playhead", e);
        }}
      >
        {/* Dim outside selection */}
        <div
          className="pointer-events-none absolute inset-y-0 left-0 bg-black/55"
          style={{ width: `${pct(inSec)}%` }}
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 bg-black/55"
          style={{ width: `${100 - pct(outSec)}%` }}
        />

        {/* Selection window — handles are wide hit targets for short ranges */}
        <div
          className="absolute inset-y-0 box-border cursor-grab rounded border-2 border-accent active:cursor-grabbing"
          style={{
            left: `${pct(inSec)}%`,
            width: `${Math.max(pct(outSec) - pct(inSec), 0.8)}%`,
          }}
          onPointerDown={(e) => startDrag("range", e)}
        >
          <button
            type="button"
            aria-label="In handle"
            className="absolute top-0 bottom-0 -left-2 z-[3] w-4 cursor-ew-resize rounded-l bg-accent"
            onPointerDown={(e) => startDrag("in", e)}
          />
          <button
            type="button"
            aria-label="Out handle"
            className="absolute top-0 bottom-0 -right-2 z-[3] w-4 cursor-ew-resize rounded-r bg-accent"
            onPointerDown={(e) => startDrag("out", e)}
          />
        </div>

        {/* Playhead */}
        <div
          className="pointer-events-none absolute inset-y-[-2px] z-[2] w-0.5 bg-text"
          style={{ left: `${pct(playhead)}%` }}
        >
          <div className="absolute top-0 -left-1 h-2 w-2.5 rounded-sm bg-text" />
        </div>
      </div>

      <div className="mt-2 flex justify-between font-mono text-[11px] tabular-nums text-text-muted">
        <span>In {formatTimecode(inSec)}</span>
        <span>Out {formatTimecode(outSec)}</span>
      </div>
      <p className="mt-2 text-[11px] text-text-faint">
        Drag green handles for start/end
        {dragging ? ` · dragging ${dragging}` : ""}. Preview follows the
        playhead.
      </p>
    </div>
  );
}
