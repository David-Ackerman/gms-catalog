import { useState, type SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input, Panel } from "./ui";
import { useAuth } from "../lib/auth";

export function AuthPage({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const { loginWithPassword, registerWithPassword } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isLogin = mode === "login";

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        await loginWithPassword(email, password);
      } else {
        await registerWithPassword(name, email, password);
      }

      navigate("/");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Request failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Panel className="relative overflow-hidden p-8 lg:p-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.2),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.16),transparent_30%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-indigo-300">
                GMS Catalog
              </span>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-zinc-50 lg:text-6xl">
                Track every game, rating, and note in one place.
              </h1>
              <p className="max-w-xl text-base leading-7 text-zinc-400">
                Admins curate the catalog. Players build their personal history
                with scores, status, and review notes.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Role-based entry flows",
                "Catalog in list or grid mode",
                "Personal played log with notes",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <Panel className="p-6 lg:p-8">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-2xl font-semibold text-zinc-50">
                {isLogin ? "Welcome back" : "Create your account"}
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                {isLogin
                  ? "Sign in to access your dashboard."
                  : "New registrations become normal users. Use the seeded admin account for catalog management."}
              </p>
            </div>
            {!isLogin ? (
              <Input
                label="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
            ) : null}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {error ? (
              <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
            <Button className="w-full" type="submit" disabled={submitting}>
              {submitting
                ? "Please wait..."
                : isLogin
                  ? "Sign in"
                  : "Create account"}
            </Button>
            <p className="text-sm text-zinc-400">
              {isLogin ? "Need an account?" : "Already registered?"}{" "}
              <Link
                className="text-indigo-300 transition hover:text-indigo-200"
                to={isLogin ? "/register" : "/login"}
              >
                {isLogin ? "Register" : "Login"}
              </Link>
            </p>
          </form>
        </Panel>
      </div>
    </div>
  );
}
