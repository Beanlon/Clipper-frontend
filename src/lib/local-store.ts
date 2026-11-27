/**
 * Local-file UX stubs — IndexedDB / localStorage for media metadata.
 * No cloud media uploads in MVP.
 */

export type ClipStatus = "ready" | "processing" | "draft";

export type LibraryItem = {
  id: string;
  title: string;
  status: ClipStatus;
  scenes: number;
  captionStyle: string;
  framing: string;
  language: string;
  local: true;
};

export type CreateSettings = {
  captions: "Clean" | "Highlight" | "Pop" | "Box";
  framing: "9:16" | "16:9" | "1:1";
  language: "English" | "Filipino";
  scenesMode: "Manual slider";
};

export type SceneRange = {
  id: string;
  label: string;
  inSec: number;
  outSec: number;
};

const AUTH_KEY = "clipper.auth";
const SETTINGS_KEY = "clipper.createSettings";
const SCENES_KEY = "clipper.scenes";
const SOURCE_KEY = "clipper.source";

export const DEFAULT_SETTINGS: CreateSettings = {
  captions: "Clean",
  framing: "9:16",
  language: "English",
  scenesMode: "Manual slider",
};

export const MOCK_LIBRARY: LibraryItem[] = [
  {
    id: "1",
    title: "interview-cut",
    status: "ready",
    scenes: 2,
    captionStyle: "Clean",
    framing: "9:16",
    language: "EN",
    local: true,
  },
  {
    id: "2",
    title: "podcast bite",
    status: "ready",
    scenes: 1,
    captionStyle: "Bold",
    framing: "9:16",
    language: "Filipino",
    local: true,
  },
  {
    id: "3",
    title: "vlog highlight",
    status: "processing",
    scenes: 3,
    captionStyle: "Clean",
    framing: "9:16",
    language: "EN",
    local: true,
  },
  {
    id: "4",
    title: "hook test",
    status: "draft",
    scenes: 1,
    captionStyle: "Pop",
    framing: "9:16",
    language: "EN",
    local: true,
  },
];

export const DEFAULT_SCENES: SceneRange[] = [
  { id: "s1", label: "Scene 1", inSec: 12, outSec: 28.5 },
  { id: "s2", label: "Scene 2", inSec: 64.2, outSec: 82 },
];

export const SOURCE_DURATION_SEC = 12 * 60 + 48;

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export function signInMock(_email?: string): void {
  localStorage.setItem(AUTH_KEY, "1");
}

export function signOutMock(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function loadSettings(): CreateSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: CreateSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function loadScenes(): SceneRange[] {
  if (typeof window === "undefined") return DEFAULT_SCENES;
  try {
    const raw = localStorage.getItem(SCENES_KEY);
    if (!raw) return DEFAULT_SCENES;
    return JSON.parse(raw) as SceneRange[];
  } catch {
    return DEFAULT_SCENES;
  }
}

export function saveScenes(scenes: SceneRange[]): void {
  localStorage.setItem(SCENES_KEY, JSON.stringify(scenes));
}

export function saveSourceStub(payload: {
  kind: "youtube" | "file";
  label: string;
}): void {
  localStorage.setItem(SOURCE_KEY, JSON.stringify({ ...payload, at: Date.now() }));
}

export function loadSourceStub(): { kind: string; label: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SOURCE_KEY);
    return raw ? (JSON.parse(raw) as { kind: string; label: string }) : null;
  } catch {
    return null;
  }
}

/** Stub: "save to device" creates a local download of a placeholder text file. */
export function saveClipToDevice(filename = "clipper-export.txt"): void {
  const blob = new Blob(
    [
      "Clipper local export stub\n",
      "Media stays on this device — no cloud upload.\n",
      `Generated: ${new Date().toISOString()}\n`,
    ],
    { type: "text/plain" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
