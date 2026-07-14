import type { ReactNode, SVGProps } from "react";

type ScoreTone = {
  text: string;
  stroke: string;
  track: string;
  fill: string;
  panel: string;
  glow: string;
};

function iconClassName(active: boolean) {
  return active
    ? "border-cyan-400/40 bg-cyan-400/12 text-cyan-100"
    : "border-zinc-800 bg-zinc-950/70 text-zinc-500";
}

function PlatformChip({
  label,
  active,
  children,
}: {
  label: string;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <span
      title={label}
      aria-label={label}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${iconClassName(active)}`}
    >
      {children}
    </span>
  );
}

function ScreenIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="4" y="5" width="16" height="10" rx="2" />
      <path d="M10 19h4" />
      <path d="M12 15v4" />
    </svg>
  );
}

function PlaystationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path d="M7.5 8.2c1.6-1.2 3.2-1.8 4.5-1.8 2.3 0 4.1 1.8 4.1 4v1.7" />
      <path d="M9 16.3c.8.8 1.8 1.3 3 1.3 2.4 0 4.4-2 4.4-4.4" />
      <path d="M6 10.9V8.7h2.2" />
      <path d="M18 13.1v2.2h-2.2" />
    </svg>
  );
}

function XboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 8c1.5.5 2.6 1.4 4 3 1.4-1.6 2.5-2.5 4-3" />
      <path d="M8 16c1.4-1.7 2.6-2.8 4-4.2 1.4 1.4 2.6 2.5 4 4.2" />
    </svg>
  );
}

function NintendoSwitchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="5" y="4.5" width="6.5" height="15" rx="2.5" />
      <rect x="12.5" y="4.5" width="6.5" height="15" rx="2.5" />
      <circle cx="8.2" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="15.8" cy="14.8" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

const platformDefinitions = [
  {
    label: "PC",
    matches: ["pc", "windows", "steam"],
    icon: ScreenIcon,
  },
  {
    label: "PlayStation",
    matches: ["playstation", "ps4", "ps5", "ps3"],
    icon: PlaystationIcon,
  },
  {
    label: "Xbox",
    matches: ["xbox", "series x", "series s", "xone"],
    icon: XboxIcon,
  },
  {
    label: "Switch",
    matches: ["switch", "nintendo"],
    icon: NintendoSwitchIcon,
  },
] as const;

export function splitMetadata(value?: string | null) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export function getScoreTone(score?: number | null): ScoreTone {
  if (score == null) {
    return {
      text: "text-zinc-400",
      stroke: "stroke-zinc-500",
      track: "stroke-zinc-800/80",
      fill: "bg-zinc-950/90",
      panel: "border-zinc-800 bg-zinc-950/70 text-zinc-400",
      glow: "",
    };
  }

  if (score >= 100) {
    return {
      text: "bg-gradient-to-r from-zinc-100 via-sky-200 to-zinc-100 bg-clip-text text-transparent",
      stroke: "stroke-cyan-200",
      track: "stroke-cyan-900",
      fill: "bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.95),_rgba(191,219,254,0.72)_38%,_rgba(34,211,238,0.25)_72%,_rgba(9,9,11,0.96)_100%)]",
      panel: "border-cyan-200/35 bg-cyan-100/10 text-cyan-100",
      glow: "shadow-[0_0_28px_rgba(186,230,253,0.4)]",
    };
  }

  if (score >= 70) {
    return {
      text: "text-emerald-300",
      stroke: "stroke-emerald-300",
      track: "stroke-zinc-800",
      fill: "bg-zinc-950/92",
      panel: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
      glow: "",
    };
  }

  if (score >= 40) {
    return {
      text: "text-amber-300",
      stroke: "stroke-amber-300",
      track: "stroke-zinc-800",
      fill: "bg-zinc-950/92",
      panel: "border-amber-400/20 bg-amber-500/10 text-amber-300",
      glow: "",
    };
  }

  return {
    text: "text-rose-300",
    stroke: "stroke-rose-300",
    track: "stroke-zinc-800",
    fill: "bg-zinc-950/92",
    panel: "border-rose-400/20 bg-rose-500/10 text-rose-300",
    glow: "",
  };
}

export function ScoreOrb({ score }: { score?: number | null }) {
  if (score == null) {
    return null;
  }

  const tone = getScoreTone(score);
  const value = Math.max(0, Math.min(100, Math.round(score)));
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (value / 100) * circumference;

  return (
    <div
      className={`absolute top-4 right-4 z-10 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full ${tone.fill} ${tone.glow}`}
    >
      <svg
        viewBox="0 0 64 64"
        className="-rotate-90 absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="6"
          className={tone.track}
        />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          className={tone.stroke}
        />
      </svg>
      <span className={`relative z-10 text-base font-semibold ${tone.text}`}>
        {value}
      </span>
    </div>
  );
}

export function ScoreLabel({ score }: { score?: number | null }) {
  if (score == null) {
    return null;
  }

  const tone = getScoreTone(score);

  return (
    <span className={`text-sm font-semibold ${tone.text}`}>
      Note {Math.round(score)}
    </span>
  );
}

export function GenreBadges({ genres }: { genres?: string | null }) {
  const items = splitMetadata(genres);

  if (!items.length) {
    return <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-500">No genres</span>;
  }

  return (
    <>
      {items.map((genre) => (
        <span
          key={genre}
          className="rounded-full border border-zinc-800 bg-zinc-950/70 px-3 py-1 text-xs text-zinc-300"
        >
          {genre}
        </span>
      ))}
    </>
  );
}

export function PlatformIcons({ platforms }: { platforms?: string | null }) {
  const items = splitMetadata(platforms).map((platform) => platform.toLowerCase());

  return (
    <div className="flex flex-wrap gap-2">
      {platformDefinitions.map(({ label, matches, icon: Icon }) => {
        const active = items.some((item) =>
          matches.some((match) => item.includes(match)),
        );

        return (
          <PlatformChip key={label} label={label} active={active}>
            <Icon className="h-5 w-5" />
          </PlatformChip>
        );
      })}
    </div>
  );
}
