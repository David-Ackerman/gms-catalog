import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createGame,
  deleteGame,
  listGames,
  updateGame,
} from "../lib/api";
import { GAME_CACHE_TIME_MS } from "../lib/query";
import type { Game, GameFilters, GameInput } from "../lib/types";
import { AppShell } from "../components/app-shell";
import { GameBrowser } from "../components/game-browser";
import { GameFormModal } from "../components/game-form-modal";
import { Button, Panel } from "../components/ui";

export function AdminDashboard() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<GameFilters>({
    sortBy: "createdAt",
    order: "desc",
    includeInactive: true,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const gamesQuery = useQuery({
    queryKey: ["games", "admin", filters],
    queryFn: () => listGames(filters),
    staleTime: GAME_CACHE_TIME_MS,
    gcTime: GAME_CACHE_TIME_MS,
  });

  const invalidate = () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: ["games"] }),
      queryClient.invalidateQueries({ queryKey: ["played-games"] }),
    ]);

  const createMutation = useMutation({
    mutationFn: createGame,
    onSuccess: async () => {
      await invalidate();
      setModalOpen(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GameInput> }) =>
      updateGame(id, data),
    onSuccess: async () => {
      await invalidate();
      setModalOpen(false);
      setEditingGame(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGame,
    onSuccess: invalidate,
  });

  async function handleSave(data: GameInput) {
    if (editingGame) {
      await updateMutation.mutateAsync({ id: editingGame.id, data });
      return;
    }

    await createMutation.mutateAsync(data);
  }

  return (
    <AppShell
      title="Catalog administration"
      subtitle="Create, update, and retire games while monitoring review activity."
    >
      <Panel className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="text-sm text-zinc-500">
            {gamesQuery.data?.length ?? 0} games visible
          </div>
          <div className="text-lg font-medium text-zinc-50">
            Admin landing page shows the full catalog.
          </div>
        </div>
        <Button
          onClick={() => {
            setEditingGame(null);
            setModalOpen(true);
          }}
        >
          Add new game
        </Button>
      </Panel>
      <GameBrowser
        games={gamesQuery.data ?? []}
        filters={filters}
        onFiltersChange={setFilters}
        showAdminStatusFilter
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        actions={(game) => (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setEditingGame(game);
                setModalOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              onClick={() => deleteMutation.mutate(game.id)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </>
        )}
      />
      <GameFormModal
        open={modalOpen}
        game={editingGame}
        onClose={() => {
          setModalOpen(false);
          setEditingGame(null);
        }}
        onSave={handleSave}
        saving={createMutation.isPending || updateMutation.isPending}
      />
    </AppShell>
  );
}
