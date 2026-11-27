"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/create", label: "Create" },
  { href: "/library", label: "Library" },
  { href: "/settings", label: "Settings" },
] as const;

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-[220px] shrink-0 flex-col border-r border-border bg-bg-sidebar">
      <div className="px-[18px] pb-3 pt-5">
        <Link href="/create" className="font-brand text-lg font-bold text-text">
          Clipper
        </Link>
      </div>

      <Link
        href="/create"
        className="mx-3.5 mb-4 rounded-xl bg-accent px-3 py-2.5 text-center text-[13px] font-semibold text-accent-ink transition hover:brightness-110"
      >
        + New generation
      </Link>

      <nav className="flex flex-col gap-0.5 px-2.5">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                active
                  ? "rounded-[10px] border border-border-strong bg-bg-nav-active px-3 py-2.5 text-[13px] font-semibold text-text"
                  : "rounded-[10px] px-3 py-2.5 text-[13px] text-text-muted transition hover:text-text"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto p-3.5">
        <div className="rounded-[10px] border border-border-strong bg-bg-app px-3 py-2 text-xs text-text-faint">
          Search
        </div>
        <p className="mt-2.5 text-[10px] text-text-faint">
          Local storage · this device
        </p>
      </div>
    </aside>
  );
}
