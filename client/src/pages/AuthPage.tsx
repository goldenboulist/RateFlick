import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedDots } from "../components/auth/AnimatedDots";
import { LoginForm, type LoginValues } from "../components/auth/LoginForm";
import { RegisterForm, type RegisterValues } from "../components/auth/RegisterForm";
import { ThemeSelector } from "../components/ui/ThemeSelector";
import { useTheme } from "../hooks/useTheme";
import { apiFetch } from "../services/api";
import { useAuthStore } from "../store/authStore";

const slide = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

const transition = { duration: 0.25, ease: "easeInOut" as const };

export function AuthPage() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  async function handleLogin(data: LoginValues) {
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<{
        user: { id: string; email: string };
        accessToken: string;
        refreshToken: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });
      setAuth(res.user, res.accessToken, res.refreshToken);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(data: RegisterValues) {
    setError(null);
    setLoading(true);
    try {
      const res = await apiFetch<{
        user: { id: string; email: string };
        accessToken: string;
        refreshToken: string;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      setAuth(res.user, res.accessToken, res.refreshToken);
      navigate("/", { replace: true });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <AnimatedDots />
      <div className="absolute right-4 top-4 z-10">
        <ThemeSelector value={theme} onChange={setTheme} />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden interactive relative z-10 w-full max-w-md rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-xl hover:-translate-y-1 hover:shadow-2xl"
      >
        <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-[var(--fg)]">
          RateFlick
        </h1>
        <p className="mb-8 text-center text-sm text-[var(--muted)]">
          Notez vos films et séries
        </p>
        {error && (
          <p className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <div className="relative min-h-[320px] overflow-visible">
          <AnimatePresence mode="wait" initial={false}>
            {mode === "login" ? (
              <motion.div
                key="login"
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="flex justify-center"
              >
                <LoginForm
                  onSubmit={handleLogin}
                  loading={loading}
                  onSwitchRegister={() => setMode("register")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={slide}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={transition}
                className="flex justify-center"
              >
                <RegisterForm
                  onSubmit={handleRegister}
                  loading={loading}
                  onSwitchLogin={() => setMode("login")}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
