# Clipper

Local-first AI video clipper web app — dark SupoClip-style create flow + CapCut-inspired clip editor.

**Stack:** Next.js (App Router) · React · TypeScript · Tailwind CSS  
**UI SoT:** [Miro board](https://miro.com/app/board/uXjVEIiP4mA=/) · `docs/ui-design.md` (project store)

## Screens (P0)

| Route | Screen |
|---|---|
| `/login` | Sign in (mock auth → localStorage) |
| `/library` | Local library grid (ready / processing / draft) |
| `/create` | Paste YouTube / upload + settings popover |
| `/scenes` | Filmstrip In/Out slider + 9:16 live preview |
| `/result` | Preview · Save to device · Open clip editor |
| `/editor` | CapCut NLE shell (tools · bin · preview · inspector · V1/A1/Text) |
| `/settings` | Local storage notes + sign out |

## Dark tokens

| Token | Value |
|---|---|
| `bg/app` | `#0B0D10` |
| `bg/sidebar` | `#11151A` |
| `bg/panel` | `#151A1E` |
| `bg/stage` | `#0A0F12` |
| `accent` | `#00C48A` |
| Fonts | Syne (brand) · DM Sans (UI) |

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with any email/password (mock).

```bash
npm run build   # production build
npm start       # serve production build
```

## Local storage (MVP)

- Auth session, create settings, and scene ranges use `localStorage`.
- Upload / YouTube ingest are UX stubs — no cloud media.
- **Save to device** downloads a placeholder text file (real MP4 export lands with the backend worker).

## Flow

```
Login → Library → Create (source + Captions/Framing/Language)
  → Scenes (slider) → Generate → Result
  → Save to device | Open ClipEditor → Library
```
