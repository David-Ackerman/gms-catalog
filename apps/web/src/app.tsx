import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AuthPage } from "./components/auth-page";
import { useAuth } from "./lib/auth";
import { AdminDashboard } from "./pages/admin-dashboard";
import { GameDetailsPage } from "./pages/game-details-page";
import { UserDashboard } from "./pages/user-dashboard";

function ProtectedHome() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-400">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return user?.role === "ADMIN" ? <AdminDashboard /> : <UserDashboard />;
}

function ProtectedGameDetails() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-400">
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <GameDetailsPage />;
}

function PublicRoute({ mode }: { mode: "login" | "register" }) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated && user) {
    return <Navigate to="/" replace />;
  }

  return <AuthPage mode={mode} />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ProtectedHome />} />
      <Route path="/games/:gameId" element={<ProtectedGameDetails />} />
      <Route path="/login" element={<PublicRoute mode="login" />} />
      <Route path="/register" element={<PublicRoute mode="register" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
