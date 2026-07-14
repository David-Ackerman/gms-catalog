import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button, Input, Panel, Select } from "./ui";
import {
  GenreBadges,
  PlatformIcons,
  ScoreLabel,
  ScoreOrb,
} from "./game-presenters";
import type { Game, GameFilters } from "../lib/types";

type GameBrowserProps = {
  games: Game[];
  filters: GameFilters;
  onFiltersChange: (next: GameFilters) => void;
  showAdminStatusFilter?: boolean;
  viewMode: "grid" | "list";
  onViewModeChange: (mode: "grid" | "list") => void;
  actions?: (game: Game) => ReactNode;
  getGameHref?: (game: Game) => string | undefined;
};

function GameCardFrame({
  href,
  className,
  children,
}: {
  href?: string;
  className: string;
  children: ReactNode;
}) {
  if (href) {
    return (
      <Link
        to={href}
        className={`${className} group block transition duration-200 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-[0_24px_60px_rgba(8,145,178,0.18)] focus:outline-none focus-visible:border-cyan-300/50`}
      >
        {children}
      </Link>
    );
  }

  return <div className={className}>{children}</div>;
}

function GridCard({
  game,
  actions,
  href,
}: {
  game: Game;
  actions?: ReactNode;
  href?: string;
}) {
  return (
    <Panel className="overflow-hidden">
      <GameCardFrame
        href={href}
        className="flex flex-col h-full justify-between"
      >
        <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
          <ScoreOrb score={game.averageScore} />
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={game.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-3 p-4">
          <h3 className="min-w-0 text-lg font-semibold leading-6 text-zinc-50 [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {game.title}
          </h3>
          <p className="text-sm leading-5 text-zinc-500 [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {game.developer || "Unknown studio"}
          </p>
          <p className="overflow-hidden text-sm leading-6 text-zinc-400 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {game.synopsis || game.description}
          </p>
          <div className="flex flex-col gap-4 justify-end-safe flex-1">
            <div className="flex flex-wrap content-start gap-2 overflow-hidden">
              <GenreBadges genres={game.genres} />
            </div>
            <div className="flex items-center justify-between gap-3">
              <PlatformIcons platforms={game.platforms} />
              {href ? (
                <span className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                  View
                </span>
              ) : null}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 p-4 border-t border-zinc-900 pt-4">
          <div className="text-xs text-zinc-500">
            {game.playedCount ?? 0} played • {game.reviewCount ?? 0} reviews
          </div>
          <div className="flex gap-2">{actions}</div>
        </div>
      </GameCardFrame>
    </Panel>
  );
}

function ListCard({
  game,
  actions,
  href,
}: {
  game: Game;
  actions?: ReactNode;
  href?: string;
}) {
  return (
    <Panel>
      <GameCardFrame
        href={href}
        className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center"
      >
        <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-zinc-900 lg:max-w-44">
          {game.coverUrl ? (
            <img
              src={game.coverUrl}
              alt={game.title}
              className="h-full w-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-zinc-50">
                {game.title}
              </h3>
              <p className="text-sm text-zinc-500">
                {game.developer || "Unknown studio"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ScoreLabel score={game.averageScore} />
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  game.isActive
                    ? "bg-emerald-500/15 text-emerald-300"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {game.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <p className="text-sm leading-6 text-zinc-400 [display:-webkit-box] overflow-hidden [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
            {game.synopsis || game.description}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex flex-wrap gap-2">
              <GenreBadges genres={game.genres} />
            </div>
            <PlatformIcons platforms={game.platforms} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-zinc-500">
              {game.playedCount ?? 0} played • {game.reviewCount ?? 0} reviews
            </div>
            <div className="flex items-center gap-3">
              {href ? (
                <span className="text-xs uppercase tracking-[0.24em] text-cyan-300/80">
                  Open details
                </span>
              ) : null}
              <div className="flex gap-2">{actions}</div>
            </div>
          </div>
        </div>
      </GameCardFrame>
    </Panel>
  );
}

export function GameBrowser({
  games,
  filters,
  onFiltersChange,
  showAdminStatusFilter,
  viewMode,
  onViewModeChange,
  actions,
  getGameHref,
}: GameBrowserProps) {
  return (
    <div className="space-y-5">
      <Panel className="p-5">
        <div className="grid gap-4 lg:grid-cols-6">
          <Input
            label="Title"
            value={filters.title ?? ""}
            onChange={(event) =>
              onFiltersChange({ ...filters, title: event.target.value })
            }
            placeholder="Search title"
          />
          <Input
            label="Developer"
            value={filters.developer ?? ""}
            onChange={(event) =>
              onFiltersChange({ ...filters, developer: event.target.value })
            }
            placeholder="Studio"
          />
          <Input
            label="Genres"
            value={filters.genres ?? ""}
            onChange={(event) =>
              onFiltersChange({ ...filters, genres: event.target.value })
            }
            placeholder="Action, RPG..."
          />
          <Select
            label="Sort by"
            value={filters.sortBy ?? "createdAt"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                sortBy: value as GameFilters["sortBy"],
              })
            }
          >
            <option value="createdAt">Recently added</option>
            <option value="releaseDate">Release date</option>
            <option value="averageScore">Average score</option>
          </Select>
          <Select
            label="Order"
            value={filters.order ?? "desc"}
            onValueChange={(value) =>
              onFiltersChange({
                ...filters,
                order: value as GameFilters["order"],
              })
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
          {showAdminStatusFilter ? (
            <Select
              label="Status"
              value={
                typeof filters.isActive === "boolean"
                  ? String(filters.isActive)
                  : "all"
              }
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  includeInactive: true,
                  isActive:
                    value === "all"
                      ? undefined
                      : value === "true",
                })
              }
            >
              <option value="all">All games</option>
              <option value="true">Active only</option>
              <option value="false">Inactive only</option>
            </Select>
          ) : (
            <div className="flex items-end justify-end gap-2">
              <Button
                variant={viewMode === "list" ? "primary" : "secondary"}
                onClick={() => onViewModeChange("list")}
                type="button"
              >
                List
              </Button>
              <Button
                variant={viewMode === "grid" ? "primary" : "secondary"}
                onClick={() => onViewModeChange("grid")}
                type="button"
              >
                Grid
              </Button>
            </div>
          )}
        </div>
        {showAdminStatusFilter ? (
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant={viewMode === "list" ? "primary" : "secondary"}
              onClick={() => onViewModeChange("list")}
              type="button"
            >
              List
            </Button>
            <Button
              variant={viewMode === "grid" ? "primary" : "secondary"}
              onClick={() => onViewModeChange("grid")}
              type="button"
            >
              Grid
            </Button>
          </div>
        ) : null}
      </Panel>
      <div
        className={
          viewMode === "grid"
            ? "grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3"
            : "space-y-4"
        }
      >
        {games.map((game) =>
          viewMode === "grid" ? (
            <GridCard
              key={game.id}
              game={game}
              actions={actions?.(game)}
              href={getGameHref?.(game)}
            />
          ) : (
            <ListCard
              key={game.id}
              game={game}
              actions={actions?.(game)}
              href={getGameHref?.(game)}
            />
          ),
        )}
      </div>
    </div>
  );
}
