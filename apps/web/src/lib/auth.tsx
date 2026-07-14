import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQuery } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { getCurrentUser, login, register } from "./api";
import type { AuthPayload, User } from "./types";

const TOKEN_KEY = "gms.token";
const REFRESH_KEY = "gms.refreshToken";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithPassword: (email: string, password: string) => Promise<User>;
  registerWithPassword: (
    name: string,
    email: string,
    password: string,
  ) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistSession(payload: AuthPayload) {
  window.localStorage.setItem(TOKEN_KEY, payload.token);
  window.localStorage.setItem(REFRESH_KEY, payload.refreshToken);
}

function clearSession() {
  window.localStorage.removeItem(TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
}

export function AuthProvider({
  children,
  queryClient,
}: {
  children: ReactNode;
  queryClient: QueryClient;
}) {
  const [token, setToken] = useState<string | null>(() => {
    return window.localStorage.getItem(TOKEN_KEY);
  });

  const meQuery = useQuery({
    queryKey: ["auth", "me", token],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    staleTime: 60_000,
  });

  useEffect(() => {
    if (meQuery.isError) {
      clearSession();
      setToken(null);
      queryClient.clear();
    }
  }, [meQuery.isError, queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user: meQuery.data ?? null,
      token,
      isAuthenticated: Boolean(token && meQuery.data),
      isLoading: Boolean(token) && meQuery.isLoading,
      async loginWithPassword(email, password) {
        const payload = await login(email, password);
        persistSession(payload);
        setToken(payload.token);
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        const user = await queryClient.fetchQuery({
          queryKey: ["auth", "me", payload.token],
          queryFn: getCurrentUser,
        });

        return user;
      },
      async registerWithPassword(name, email, password) {
        const payload = await register(name, email, password);
        persistSession(payload);
        setToken(payload.token);
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        const user = await queryClient.fetchQuery({
          queryKey: ["auth", "me", payload.token],
          queryFn: getCurrentUser,
        });

        return user;
      },
      logout() {
        clearSession();
        setToken(null);
        queryClient.clear();
      },
    };
  }, [meQuery.data, meQuery.isLoading, queryClient, token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
}
