import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { PasswordField } from "../ui/PasswordField";
import { TextField } from "../ui/TextField";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "8 caractères minimum"),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type RegisterValues = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterValues) => Promise<void>;
  loading?: boolean;
  onSwitchLogin: () => void;
}

export function RegisterForm({ onSubmit, loading, onSwitchLogin }: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const emailReg = register("email");
  const pwReg = register("password");
  const confirmReg = register("confirmPassword");

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full max-w-sm flex-col gap-4"
      noValidate
    >
      <TextField
        ref={emailReg.ref}
        id="register-email"
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
        id="register-password"
        label="Mot de passe"
        autoComplete="new-password"
        error={errors.password?.message}
        onChange={pwReg.onChange}
        onBlur={pwReg.onBlur}
        name={pwReg.name}
      />
      <PasswordField
        ref={confirmReg.ref}
        id="register-confirm"
        label="Confirmer"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        onChange={confirmReg.onChange}
        onBlur={confirmReg.onBlur}
        name={confirmReg.name}
      />
      <button
        type="submit"
        disabled={loading}
        className="interactive rounded-xl bg-[var(--accent)] px-4 py-3 font-medium text-[var(--on-accent)] shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-lg"
      >
        {loading ? "Inscription…" : "S'inscrire"}
      </button>
      <p className="text-center text-sm text-[var(--muted)]">
        Déjà un compte ?{" "}
        <button
          type="button"
          onClick={onSwitchLogin}
          className="interactive font-medium text-[var(--accent)] underline-offset-4 hover:underline hover:opacity-90"
        >
          Se connecter
        </button>
      </p>
    </form>
  );
}
