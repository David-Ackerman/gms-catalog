import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { AppShell } from "../components/app-shell";
import { PlayedGameModal } from "../components/played-game-modal";
import { GenreBadges, PlatformIcons, ScoreOrb } from "../components/game-presenters";
import { Button, Panel } from "../components/ui";
import { createPlayedGame, getGame, myPlayedGames, updatePlayedGame } from "../lib/api";
import { useAuth } from "../lib/auth";
import { GAME_CACHE_TIME_MS } from "../lib/query";
import type { PlayedGameInput } from "../lib/types";

export function GameDetailsPage() {
  const { gameId } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  const gameQuery = useQuery({
    queryKey: ["game", gameId],
    queryFn: () => getGame(gameId!),
    enabled: Boolean(gameId),
    staleTime: GAME_CACHE_TIME_MS,
    gcTime: GAME_CACHE_TIME_MS,
  });

  const playedGamesQuery = useQuery({
    queryKey: ["played-games", "mine"],
    queryFn: myPlayedGames,
    enabled: user?.role === "USER",
    staleTime: GAME_CACHE_TIME_MS,
    gcTime: GAME_CACHE_TIME_MS,
  });

  const game = gameQuery.data ?? null;
  const playedEntry = useMemo(
    () => (playedGamesQuery.data ?? []).find((entry) => entry.gameId === game?.id) ?? null,
    [game?.id, playedGamesQuery.data],
  );

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["games"] }),
      queryClient.invalidateQueries({ queryKey: ["game", gameId] }),
      queryClient.invalidateQueries({ queryKey: ["played-games"] }),
    ]);

  const createMutation = useMutation({
    mutationFn: ({ gameId: id, data }: { gameId: string; data: PlayedGameInput }) =>
      createPlayedGame(id, data),
    onSuccess: async () => {
      await invalidate();
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlayedGameInput }) =>
      updatePlayedGame(id, data),
    onSuccess: async () => {
      await invalidate();
      setModalOpen(false);
    },
  });

  if (!gameId) {
    return <Navigate to="/" replace />;
  }

  if (gameQuery.isLoading) {
    return (
      <AppShell title="Game details" subtitle="Loading game information.">
        <Panel className="p-6 text-sm text-zinc-400">Loading...</Panel>
      </AppShell>
    );
  }

  if (!gameQuery.data) {
    return (
      <AppShell title="Game details" subtitle="The requested game was not found.">
        <Panel className="space-y-4 p-6">
          <p className="text-sm text-zinc-400">This game is unavailable or no longer visible.</p>
          <Link
            to="/"
            className="inline-flex rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 transition hover:border-zinc-700"
          >
            Back to catalog
          </Link>
        </Panel>
      </AppShell>
    );
  }

  const resolvedGame = gameQuery.data;

  return (
    <AppShell title={resolvedGame.title} subtitle={resolvedGame.developer || "Game details"}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/"
          className="inline-flex rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-100 transition hover:border-zinc-700"
        >
          Back
        </Link>
        {user?.role === "USER" ? (
          <Button
            onClick={() => setModalOpen(true)}
            variant={playedEntry ? "secondary" : "primary"}
          >
            {playedEntry ? "Edit my entry" : "Mark as played"}
          </Button>
        ) : null}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <Panel className="overflow-hidden">
          <div className="relative h-72 bg-zinc-900 sm:h-96">
            <ScoreOrb score={resolvedGame.averageScore} />
            {resolvedGame.coverUrl ? (
              <img src={resolvedGame.coverUrl} alt={resolvedGame.title} className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="space-y-6 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-cyan-300/80">
                {resolvedGame.publisher || "Independent release"}
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-zinc-50">{resolvedGame.title}</h2>
            </div>
            <p className="text-base leading-7 text-zinc-300">
              {resolvedGame.synopsis || resolvedGame.description}
            </p>
            <div className="space-y-3">
              <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">Genres</div>
              <div className="flex flex-wrap gap-2">
                <GenreBadges genres={resolvedGame.genres} />
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">Platforms</div>
              <PlatformIcons platforms={resolvedGame.platforms} />
            </div>
          </div>
        </Panel>
        <div className="space-y-6">
          <Panel className="p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">Catalog stats</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Note</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-50">
                  {resolvedGame.averageScore == null ? "N/A" : Math.round(resolvedGame.averageScore)}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Played</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-50">
                  {resolvedGame.playedCount ?? 0}
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-900 bg-zinc-950/70 p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-zinc-500">Reviews</div>
                <div className="mt-2 text-2xl font-semibold text-zinc-50">
                  {resolvedGame.reviewCount ?? 0}
                </div>
              </div>
            </div>
          </Panel>
          <Panel className="p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">Release</div>
            <div className="mt-3 text-lg text-zinc-200">
              {resolvedGame.releaseDate
                ? new Date(resolvedGame.releaseDate).toLocaleDateString()
                : "No release date"}
            </div>
          </Panel>
          {playedEntry?.reviewNote ? (
            <Panel className="p-6">
              <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">My review note</div>
              <p className="mt-3 text-sm leading-7 text-zinc-300">{playedEntry.reviewNote}</p>
              {playedEntry.personalScore != null ? (
                <div className="mt-4 text-xs uppercase tracking-[0.2em] text-zinc-500">
                  My score {playedEntry.personalScore}
                </div>
              ) : null}
            </Panel>
          ) : null}
          <Panel className="p-6">
            <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">Description</div>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{resolvedGame.description}</p>
          </Panel>
        </div>
      </div>
      <PlayedGameModal
        open={modalOpen}
        game={resolvedGame}
        playedGame={playedEntry}
        onClose={() => setModalOpen(false)}
        onCreate={async (id, data) => {
          await createMutation.mutateAsync({ gameId: id, data });
        }}
        onUpdate={async (id, data) => {
          await updateMutation.mutateAsync({ id, data });
        }}
        saving={createMutation.isPending || updateMutation.isPending}
      />
    </AppShell>
  );
}
