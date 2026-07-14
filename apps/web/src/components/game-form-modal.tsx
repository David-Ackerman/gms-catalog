import { useEffect, useState } from "react";
import { Button, Input, Modal, Select, Textarea } from "./ui";
import type { Game, GameInput } from "../lib/types";

const emptyForm: GameInput = {
  title: "",
  slug: "",
  description: "",
  synopsis: "",
  developer: "",
  publisher: "",
  releaseDate: "",
  genres: "",
  platforms: "",
  coverUrl: "",
  isActive: true,
};

export function GameFormModal({
  open,
  game,
  onClose,
  onSave,
  saving,
}: {
  open: boolean;
  game?: Game | null;
  onClose: () => void;
  onSave: (data: GameInput) => Promise<void>;
  saving: boolean;
}) {
  const [form, setForm] = useState<GameInput>(emptyForm);

  useEffect(() => {
    if (!game) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: game.title,
      slug: game.slug,
      description: game.description,
      synopsis: game.synopsis ?? "",
      developer: game.developer ?? "",
      publisher: game.publisher ?? "",
      releaseDate: game.releaseDate?.slice(0, 10) ?? "",
      genres: game.genres ?? "",
      platforms: game.platforms ?? "",
      coverUrl: game.coverUrl ?? "",
      isActive: game.isActive,
    });
  }, [game, open]);

  return (
    <Modal
      open={open}
      title={game ? `Edit ${game.title}` : "Add new game"}
      description="Manage the catalog entry metadata shown across the app."
      onClose={onClose}
    >
      <form
        className="space-y-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await onSave(form);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Title"
            required
            value={form.title}
            onChange={(event) => setForm({ ...form, title: event.target.value })}
          />
          <Input
            label="Slug"
            required
            value={form.slug}
            onChange={(event) => setForm({ ...form, slug: event.target.value })}
          />
          <Input
            label="Developer"
            value={form.developer}
            onChange={(event) =>
              setForm({ ...form, developer: event.target.value })
            }
          />
          <Input
            label="Publisher"
            value={form.publisher}
            onChange={(event) =>
              setForm({ ...form, publisher: event.target.value })
            }
          />
          <Input
            label="Release date"
            type="date"
            value={form.releaseDate}
            onChange={(event) =>
              setForm({ ...form, releaseDate: event.target.value })
            }
          />
          <Select
            label="Catalog status"
            value={String(form.isActive)}
            onValueChange={(value) =>
              setForm({ ...form, isActive: value === "true" })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </Select>
          <Input
            label="Genres"
            value={form.genres}
            onChange={(event) => setForm({ ...form, genres: event.target.value })}
          />
          <Input
            label="Platforms"
            value={form.platforms}
            onChange={(event) =>
              setForm({ ...form, platforms: event.target.value })
            }
          />
          <div className="md:col-span-2">
            <Input
              label="Cover image URL"
              value={form.coverUrl}
              onChange={(event) =>
                setForm({ ...form, coverUrl: event.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Synopsis"
              value={form.synopsis}
              onChange={(event) =>
                setForm({ ...form, synopsis: event.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <Textarea
              label="Description"
              required
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : game ? "Update game" : "Create game"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
