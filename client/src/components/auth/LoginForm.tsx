import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordField } from "../ui/PasswordField";
import { TextField } from "../ui/TextField";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

export type LoginValues = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginValues) => Promise<void>;
  loading?: boolean;
  onSwitchRegister: () => void;
}

export function LoginForm({ onSubmit, loading, onSwitchRegister }: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  const emailReg = register("email");
  const pwReg = register("password");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
    >
      <TextField
        ref={emailReg.ref}
        id="login-email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        onChange={emailReg.onChange}
        onBlur={emailReg.onBlur}
        name={emailReg.name}
      />
      <PasswordField
        ref={pwReg.ref}
        id="login-password"
        label="Mot de passe"
        autoComplete="current-password"
        error={errors.password?.message}
        onChange={pwReg.onChange}
        onBlur={pwReg.onBlur}
        name={pwReg.name}
      />
      <button
        type="submit"
        disabled={loading}
        className="interactive rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-[var(--on-accent)] shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-lg"
      >
        {loading ? "Connexion…" : "Se connecter"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        Pas encore de compte ?{" "}
        <button
          type="button"
          onClick={onSwitchRegister}
          className="interactive font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:opacity-90"
        >
          Créer un compte
        </button>
      </p>
    </form>
  );
}
