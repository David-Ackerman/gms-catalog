import type { ReactNode } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Panel } from "./ui";
import { useAuth } from "../lib/auth";

function getInitials(name?: string | null) {
  const parts = (name ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "?";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen px-4 py-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Panel className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-indigo-300">
              GMS Catalog
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-zinc-50">{title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{subtitle}</p>
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button
                type="button"
                className="flex items-center gap-3 rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-2 text-left transition hover:border-zinc-700 focus:outline-none focus-visible:border-indigo-500"
                aria-label="Open user menu"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold text-white">
                  {getInitials(user?.name)}
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-zinc-50">{user?.name}</div>
                  {user?.role === "ADMIN" ? (
                    <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                      Admin
                    </div>
                  ) : null}
                </div>
                <svg
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-4 w-4 text-zinc-500"
                  aria-hidden="true"
                >
                  <path d="m5 7.5 5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                align="end"
                sideOffset={10}
                className="z-50 min-w-44 rounded-xl border border-zinc-800 bg-zinc-950 p-1 shadow-2xl shadow-black/40"
              >
                <DropdownMenu.Item
                  onSelect={logout}
                  className="cursor-default rounded-lg px-3 py-2 text-sm text-zinc-200 outline-none transition focus:bg-zinc-900 focus:text-zinc-50"
                >
                  Logout
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </Panel>
        {children}
      </div>
    </div>
  );
}
