import { useEffect, useState } from "react";
import { Button, Input, Modal, Panel, Select, Textarea } from "./ui";
import type { Game, PlayedGame, PlayedGameInput, PlayedStatus } from "../lib/types";

const statuses: Array<{ value: PlayedStatus; label: string }> = [
  { value: "PLAYED", label: "Played" },
  { value: "PLAYING", label: "Playing" },
  { value: "WANT_TO_PLAY", label: "Want to play" },
  { value: "DROPPED", label: "Dropped" },
];

export function PlayedGameModal({
  open,
  game,
  playedGame,
  onClose,
  onCreate,
  onUpdate,
  saving,
}: {
  open: boolean;
  game?: Game | null;
  playedGame?: PlayedGame | null;
  onClose: () => void;
  onCreate: (gameId: string, data: PlayedGameInput) => Promise<void>;
  onUpdate: (id: string, data: PlayedGameInput) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<PlayedGameInput>({
    status: "PLAYED",
    personalScore: 80,
    reviewNote: "",
    notes: "",
  });

  useEffect(() => {
    if (playedGame) {
      setForm({
        status: playedGame.status,
        personalScore: playedGame.personalScore ?? undefined,
        reviewNote: playedGame.reviewNote ?? "",
        notes: playedGame.notes ?? "",
      });
      return;
    }

    setForm({
      status: "PLAYED",
      personalScore: 80,
      reviewNote: "",
      notes: "",
    });
  }, [playedGame, open]);

  const selectedGame = playedGame?.game ?? game;

  return (
    <Modal
      open={open}
      title={playedGame ? "Edit played game" : "Add played game"}
      description={
        playedGame
          ? "Update your rating, progress state, and notes."
          : "Rate this game and add your notes."
      }
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();

          if (playedGame) {
            await onUpdate(playedGame.id, form);
            return;
          }

          if (!selectedGame) {
            return;
          }

          await onCreate(selectedGame.id, form);
        }}
      >
        {selectedGame ? (
          <Panel className="p-4">
            <div className="text-sm text-zinc-400">Selected game</div>
            <div className="mt-1 text-lg font-semibold text-zinc-50">
              {selectedGame.title}
            </div>
            <div className="text-sm text-zinc-500">{selectedGame.developer}</div>
          </Panel>
        ) : null}
        <div className="grid gap-4 md:grid-cols-2">
          <Select
            label="Status"
            value={form.status}
            onValueChange={(value) =>
              setForm({
                ...form,
                status: value as PlayedStatus,
              })
            }
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
          <Input
            label="Personal score"
            type="number"
            min="0"
            max="100"
            step="1"
            value={form.personalScore ?? ""}
            onChange={(event) =>
              setForm({
                ...form,
                personalScore: event.target.value
                  ? Math.max(0, Math.min(100, Number(event.target.value)))
                  : undefined,
              })
            }
          />
          <div className="md:col-span-2">
            <Textarea
              label="Review note"
              value={form.reviewNote ?? ""}
              onChange={(event) =>
                setForm({ ...form, reviewNote: event.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Personal notes"
              value={form.notes ?? ""}
              onChange={(event) => setForm({ ...form, notes: event.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="submit" disabled={saving || !selectedGame}>
            {saving ? "Saving..." : playedGame ? "Update entry" : "Save entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
