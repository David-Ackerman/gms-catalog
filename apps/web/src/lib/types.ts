export type UserRole = "ADMIN" | "USER";
export type PlayedStatus = "WANT_TO_PLAY" | "PLAYING" | "PLAYED" | "DROPPED";

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthPayload = {
  token: string;
  refreshToken: string;
  user: User;
};

export type Game = {
  id: string;
  title: string;
  slug: string;
  description: string;
  synopsis?: string | null;
  developer?: string | null;
  publisher?: string | null;
  releaseDate?: string | null;
  genres?: string | null;
  platforms?: string | null;
  coverUrl?: string | null;
  averageScore?: number | null;
  reviewCount?: number | null;
  playedCount?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type PlayedGame = {
  id: string;
  userId: string;
  gameId: string;
  status: PlayedStatus;
  personalScore?: number | null;
  reviewNote?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  game?: Game | null;
};

export type GameFilters = {
  title?: string;
  developer?: string;
  genres?: string;
  sortBy?: "averageScore" | "releaseDate" | "createdAt";
  order?: "asc" | "desc";
  isActive?: boolean;
  includeInactive?: boolean;
};

export type GameInput = {
  title: string;
  slug: string;
  description: string;
  synopsis?: string;
  developer?: string;
  publisher?: string;
  releaseDate?: string;
  genres?: string;
  platforms?: string;
  coverUrl?: string;
  isActive?: boolean;
};

export type PlayedGameInput = {
  status?: PlayedStatus;
  personalScore?: number;
  reviewNote?: string;
  notes?: string;
};
