import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deletePlayedGame,
  listGames,
  myPlayedGames,
  updatePlayedGame,
} from "../lib/api";
import type { GameFilters, PlayedGame, PlayedGameInput } from "../lib/types";
import { AppShell } from "../components/app-shell";
import { GameBrowser } from "../components/game-browser";
import { PlayedGameModal } from "../components/played-game-modal";
import { Button, Panel } from "../components/ui";
import { GAME_CACHE_TIME_MS } from "../lib/query";

export function UserDashboard() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"played" | "games">("played");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [filters, setFilters] = useState<GameFilters>({
    sortBy: "createdAt",
    order: "desc",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlayedGame, setEditingPlayedGame] = useState<PlayedGame | null>(null);

  const playedGamesQuery = useQuery({
    queryKey: ["played-games", "mine"],
    queryFn: myPlayedGames,
    staleTime: GAME_CACHE_TIME_MS,
    gcTime: GAME_CACHE_TIME_MS,
  });

  const gamesQuery = useQuery({
    queryKey: ["games", "user", filters],
    queryFn: () => listGames(filters),
    staleTime: GAME_CACHE_TIME_MS,
    gcTime: GAME_CACHE_TIME_MS,
  });

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["games"] }),
      queryClient.invalidateQueries({ queryKey: ["played-games"] }),
    ]);

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlayedGameInput }) =>
      updatePlayedGame(id, data),
    onSuccess: async () => {
      await invalidate();
      setEditingPlayedGame(null);
      setModalOpen(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deletePlayedGame,
    onSuccess: invalidate,
  });

  return (
    <AppShell
      title="My library"
      subtitle="Track what you played, rate it, and browse the full active catalog."
    >
      <Panel className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={tab === "played" ? "primary" : "secondary"}
            onClick={() => setTab("played")}
          >
            Played games
          </Button>
          <Button
            variant={tab === "games" ? "primary" : "secondary"}
            onClick={() => setTab("games")}
          >
            All games
          </Button>
        </div>
      </Panel>
      {tab === "played" ? (
        <div className="grid gap-4">
          {(playedGamesQuery.data ?? []).map((entry) => (
            <Panel key={entry.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-start">
              <div className="h-32 w-full max-w-48 rounded-2xl bg-zinc-900">
                {entry.game?.coverUrl ? (
                  <img
                    src={entry.game.coverUrl}
                    alt={entry.game.title}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                ) : null}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-zinc-50">
                      {entry.game?.title}
                    </h3>
                    <p className="text-sm text-zinc-500">{entry.game?.developer}</p>
                  </div>
                  <span className="rounded-full border border-zinc-800 px-3 py-1 text-xs text-zinc-300">
                    {entry.status.replaceAll("_", " ")}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                  <span className="rounded-full border border-zinc-800 px-3 py-1">
                    Score {entry.personalScore ?? "N/A"}
                  </span>
                  <span className="rounded-full border border-zinc-800 px-3 py-1">
                    Added {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {entry.reviewNote ? (
                  <p className="text-sm leading-6 text-zinc-300">
                    {entry.reviewNote}
                  </p>
                ) : null}
                {entry.notes ? (
                  <p className="text-sm leading-6 text-zinc-500">{entry.notes}</p>
                ) : null}
              </div>
              <div className="flex shrink-0 gap-2 lg:ml-auto lg:self-start">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setEditingPlayedGame(entry);
                    setModalOpen(true);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => deleteMutation.mutate(entry.id)}
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      ) : (
        <GameBrowser
          games={gamesQuery.data ?? []}
          filters={filters}
          onFiltersChange={setFilters}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          getGameHref={(game) => `/games/${game.id}`}
        />
      )}
      <PlayedGameModal
        open={modalOpen}
        game={editingPlayedGame?.game}
        playedGame={editingPlayedGame}
        onClose={() => {
          setModalOpen(false);
          setEditingPlayedGame(null);
        }}
        onCreate={async (gameId, data) => {
          void gameId;
          void data;
        }}
        onUpdate={async (id, data) => {
          await updateMutation.mutateAsync({ id, data });
        }}
        saving={updateMutation.isPending}
      />
    </AppShell>
  );
}
