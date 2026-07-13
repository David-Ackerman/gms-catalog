import test from "node:test";
import assert from "node:assert/strict";

const calculateGameStats = (
  playedGames: Array<{ personalScore: number | null }>,
) => {
  const scores = playedGames
    .map((playedGame) => playedGame.personalScore)
    .filter((score): score is number => score != null);

  return {
    playedCount: playedGames.length,
    averageScore: scores.length
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length
      : null,
    reviewCount: scores.length,
  };
};

test("calculateGameStats returns played count, average score, and review count", () => {
  const stats = calculateGameStats([
    { personalScore: 8 },
    { personalScore: 10 },
    { personalScore: null },
  ]);

  assert.deepEqual(stats, {
    playedCount: 3,
    averageScore: 9,
    reviewCount: 2,
  });
});

test("calculateGameStats handles empty played games gracefully", () => {
  const stats = calculateGameStats([]);

  assert.deepEqual(stats, {
    playedCount: 0,
    averageScore: null,
    reviewCount: 0,
  });
});
