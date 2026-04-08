import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, User as UserIcon, Star, History, TrendingUp } from "lucide-react";
import { Header } from "../components/layout/Header";
import { StatsDashboard } from "../components/layout/StatsDashboard";
import { useAuthStore } from "../store/authStore";
import { useEntriesStore } from "../store/entriesStore";
import { useTheme } from "../hooks/useTheme";
import { apiFetchLogout } from "../services/api";
import { useEntriesLoader } from "../hooks/useEntries";
import { AnimatedDots } from "../components/auth/AnimatedDots";
import { useMemo } from "react";

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const logoutStore = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const entries = useEntriesStore((s) => s.entries);

  useEntriesLoader(!!user);

  const topRated = useMemo(() => {
    return [...entries]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }, [entries]);

  const recentEntries = useMemo(() => {
    return [...entries]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [entries]);

  async function handleLogout() {
    await apiFetchLogout();
    logoutStore();
    navigate("/auth", { replace: true });
  }

  if (!user) return null;

  return (
    <div className="mx-auto max-w-8xl px-4 py-8">
      <AnimatedDots />
      <Header
        email={user.email}
        theme={theme}
        onThemeChange={setTheme}
        onLogout={() => void handleLogout()}
      />

      <div className="mb-8">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--fg)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour à la liste</span>
        </motion.button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: User Info & Top Rated */}
        <div className="lg:col-span-1 space-y-8">
          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-24 w-24 items-center justify-center rounded-full text-3xl font-bold shadow-inner"
                style={{
                  background: "var(--accent)",
                  color: "var(--on-accent)",
                }}
              >
                {user.email.slice(0, 1).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-[var(--fg)] mb-1">Mon Profil</h2>
              <p className="text-[var(--muted)] mb-6 text-sm">Membre RateFlick</p>
              
              <div className="w-full space-y-4 text-left">
                <div className="flex items-center gap-3 rounded-xl bg-[var(--bg)] p-3 border border-[var(--border)]">
                  <Mail className="h-5 w-5 text-[var(--muted)]" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-[var(--muted)] uppercase font-semibold">Email</p>
                    <p className="text-[var(--fg)] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl bg-[var(--bg)] p-3 border border-[var(--border)]">
                  <UserIcon className="h-5 w-5 text-[var(--muted)]" />
                  <div className="overflow-hidden">
                    <p className="text-xs text-[var(--muted)] uppercase font-semibold">ID Utilisateur</p>
                    <p className="text-[var(--fg)] truncate">#{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Top Rated Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
          >
            <h3 className="text-lg font-bold text-[var(--fg)] mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-yellow-500" />
              Vos pépites
            </h3>
            <div className="space-y-4">
              {topRated.length > 0 ? (
                topRated.map((movie) => (
                  <div key={movie.id} className="flex items-center gap-3 group">
                    {movie.posterUrl ? (
                      <img src={movie.posterUrl} alt={movie.title} className="h-12 w-9 rounded object-cover shadow-sm" />
                    ) : (
                      <div className="h-12 w-9 rounded bg-[var(--bg)] flex items-center justify-center border border-[var(--border)]">
                        <Star className="h-4 w-4 text-[var(--muted)]" />
                      </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="font-medium text-[var(--fg)] truncate group-hover:text-[var(--accent)] transition-colors">{movie.title}</p>
                      <div className="flex items-center gap-1 text-sm text-yellow-500">
                        {Array.from({ length: Math.floor(movie.rating) }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                        <span className="ml-1 text-[var(--muted)] font-mono">{movie.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)] italic text-center py-4">Aucun film noté</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Stats & Recent Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <h3 className="text-xl font-bold text-[var(--fg)] mb-6 flex items-center gap-2">
              Mes Statistiques
            </h3>
            <StatsDashboard entries={entries} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm"
          >
            <h3 className="text-xl font-bold text-[var(--fg)] mb-6 flex items-center gap-2">
              <History className="h-5 w-5 text-blue-500" />
              Activité récente
            </h3>
            <div className="space-y-6">
              {recentEntries.length > 0 ? (
                recentEntries.map((entry, idx) => (
                  <div key={entry.id} className="relative flex gap-4">
                    {idx !== recentEntries.length - 1 && (
                      <div className="absolute left-2.5 top-6 bottom-[-24px] w-0.5 bg-[var(--border)] opacity-50" />
                    )}
                    <div className="z-10 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] shadow-sm">
                      <div className="h-2 w-2 rounded-full bg-[var(--on-accent)]" />
                    </div>
                    <div className="flex-1 pb-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-[var(--fg)]">
                            A noté <span className="font-bold text-[var(--accent)]">{entry.title}</span>
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {entry.genres.slice(0, 2).map(g => (
                              <span key={g} className="text-[10px] px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--muted)]">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold text-yellow-500">{entry.rating} ★</span>
                          <p className="text-[10px] text-[var(--muted)]">
                            {new Date(entry.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[var(--muted)] py-4">Pas encore d'activité.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

