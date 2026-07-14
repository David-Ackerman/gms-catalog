import { gql } from "@apollo/client";
import { apolloClient } from "./apollo";
import type {
  AuthPayload,
  Game,
  GameFilters,
  GameInput,
  PlayedGame,
  PlayedGameInput,
  User,
} from "./types";

function normalizeOptional(value?: string | null) {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function normalizeDateTime(value?: string | null) {
  const normalized = normalizeOptional(value);

  if (!normalized) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return `${normalized}T00:00:00.000Z`;
  }

  return normalized;
}

function normalizeGameInput(data: Partial<GameInput>) {
  return {
    ...data,
    title: data.title?.trim(),
    slug: data.slug?.trim(),
    description: data.description?.trim(),
    synopsis: normalizeOptional(data.synopsis),
    developer: normalizeOptional(data.developer),
    publisher: normalizeOptional(data.publisher),
    releaseDate: normalizeDateTime(data.releaseDate),
    genres: normalizeOptional(data.genres),
    platforms: normalizeOptional(data.platforms),
    coverUrl: normalizeOptional(data.coverUrl),
  };
}

const USER_FIELDS = gql`
  fragment UserFields on UserModel {
    id
    name
    email
    role
  }
`;

const GAME_FIELDS = gql`
  fragment GameFields on GameModel {
    id
    title
    slug
    description
    synopsis
    developer
    publisher
    releaseDate
    genres
    platforms
    coverUrl
    averageScore
    reviewCount
    playedCount
    isActive
    createdAt
    updatedAt
  }
`;

const PLAYED_GAME_FIELDS = gql`
  fragment PlayedGameFields on PlayedGameModel {
    id
    userId
    gameId
    status
    personalScore
    reviewNote
    notes
    createdAt
    updatedAt
    game {
      ...GameFields
    }
  }
  ${GAME_FIELDS}
`;

export async function login(email: string, password: string) {
  const { data } = await apolloClient.mutate<{
    login: AuthPayload;
  }>({
    mutation: gql`
      mutation Login($data: LoginInput!) {
        login(data: $data) {
          token
          refreshToken
          user {
            ...UserFields
          }
        }
      }
      ${USER_FIELDS}
    `,
    variables: {
      data: {
        email,
        password,
      },
    },
  });

  return data!.login;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await apolloClient.mutate<{
    register: AuthPayload;
  }>({
    mutation: gql`
      mutation Register($data: RegisterInput!) {
        register(data: $data) {
          token
          refreshToken
          user {
            ...UserFields
          }
        }
      }
      ${USER_FIELDS}
    `,
    variables: {
      data: {
        name,
        email,
        password,
      },
    },
  });

  return data!.register;
}

export async function getCurrentUser() {
  const { data } = await apolloClient.query<{
    me: User;
  }>({
    query: gql`
      query Me {
        me {
          ...UserFields
        }
      }
      ${USER_FIELDS}
    `,
    fetchPolicy: "network-only",
  });

  return data.me;
}

export async function listGames(filters: GameFilters) {
  const { data } = await apolloClient.query<{
    listGames: Game[];
  }>({
    query: gql`
      query ListGames($filters: GameListFilterInput) {
        listGames(filters: $filters) {
          ...GameFields
        }
      }
      ${GAME_FIELDS}
    `,
    variables: { filters },
    fetchPolicy: "no-cache",
  });

  return data.listGames;
}

export async function getGame(id: string) {
  const { data } = await apolloClient.query<{
    game: Game | null;
  }>({
    query: gql`
      query Game($id: String!) {
        game(id: $id) {
          ...GameFields
        }
      }
      ${GAME_FIELDS}
    `,
    variables: { id },
    fetchPolicy: "no-cache",
  });

  return data.game;
}

export async function createGame(data: GameInput) {
  const response = await apolloClient.mutate<{ createGame: Game }>({
    mutation: gql`
      mutation CreateGame($data: CreateGameInput!) {
        createGame(data: $data) {
          ...GameFields
        }
      }
      ${GAME_FIELDS}
    `,
    variables: { data: normalizeGameInput(data) },
  });

  return response.data!.createGame;
}

export async function updateGame(id: string, data: Partial<GameInput>) {
  const response = await apolloClient.mutate<{ updateGame: Game }>({
    mutation: gql`
      mutation UpdateGame($id: String!, $data: UpdateGameInput!) {
        updateGame(id: $id, data: $data) {
          ...GameFields
        }
      }
      ${GAME_FIELDS}
    `,
    variables: { id, data: normalizeGameInput(data) },
  });

  return response.data!.updateGame;
}

export async function deleteGame(id: string) {
  const response = await apolloClient.mutate<{ deleteGame: boolean }>({
    mutation: gql`
      mutation DeleteGame($id: String!) {
        deleteGame(id: $id)
      }
    `,
    variables: { id },
  });

  return response.data!.deleteGame;
}

export async function myPlayedGames() {
  const { data } = await apolloClient.query<{
    myPlayedGames: PlayedGame[];
  }>({
    query: gql`
      query MyPlayedGames {
        myPlayedGames {
          ...PlayedGameFields
        }
      }
      ${PLAYED_GAME_FIELDS}
    `,
    fetchPolicy: "no-cache",
  });

  return data.myPlayedGames;
}

export async function createPlayedGame(gameId: string, data: PlayedGameInput) {
  const response = await apolloClient.mutate<{ createPlayedGame: PlayedGame }>({
    mutation: gql`
      mutation CreatePlayedGame($gameId: String!, $data: CreatePlayedGameInput) {
        createPlayedGame(gameId: $gameId, data: $data) {
          ...PlayedGameFields
        }
      }
      ${PLAYED_GAME_FIELDS}
    `,
    variables: { gameId, data },
  });

  return response.data!.createPlayedGame;
}

export async function updatePlayedGame(
  id: string,
  data: PlayedGameInput,
) {
  const response = await apolloClient.mutate<{ updatePlayedGame: PlayedGame }>({
    mutation: gql`
      mutation UpdatePlayedGame($id: String!, $data: UpdatePlayedGameInput!) {
        updatePlayedGame(id: $id, data: $data) {
          ...PlayedGameFields
        }
      }
      ${PLAYED_GAME_FIELDS}
    `,
    variables: { id, data },
  });

  return response.data!.updatePlayedGame;
}

export async function deletePlayedGame(id: string) {
  const response = await apolloClient.mutate<{ deletePlayedGame: boolean }>({
    mutation: gql`
      mutation DeletePlayedGame($id: String!) {
        deletePlayedGame(id: $id)
      }
    `,
    variables: { id },
  });

  return response.data!.deletePlayedGame;
}
