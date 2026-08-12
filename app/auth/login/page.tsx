"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  LogIn,
  ShieldCheck,
} from "lucide-react";
import { signIn } from "@/lib/auth/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Veuillez renseigner votre adresse email.");
      return;
    }

    if (!password) {
      setError("Veuillez renseigner votre mot de passe.");
      return;
    }

    if (!acceptedTerms) {
      setError(
        "Vous devez accepter les conditions générales.",
      );
      return;
    }

    try {
      setLoading(true);

      const result = await signIn.email({
        email: email.trim().toLowerCase(),
        password,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Email ou mot de passe incorrect.",
        );
        return;
      }

      window.location.href = "/";
    } catch {
      setError(
        "Une erreur est survenue lors de la connexion.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-background to-pink-50 px-4 py-10 dark:from-orange-950/20 dark:to-pink-950/20">
      {/* Décoration */}
      <div className="pointer-events-none absolute -left-40 top-1/4 size-96 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-1/4 size-96 rounded-full bg-pink-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-xl shadow-orange-500/20">
            <span className="text-2xl font-black">R</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Bon retour !
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Connectez-vous pour retrouver vos commandes.
          </p>
        </div>

        {/* Carte */}
        <div className="rounded-3xl border bg-background/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium"
              >
                Adresse email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="vous@example.com"
                className="h-12 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Mot de passe
                </label>

                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-orange-600 hover:underline dark:text-orange-400"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Votre mot de passe"
                  className="h-12 w-full rounded-xl border bg-background px-4 pr-11 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Conditions */}
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border bg-muted/30 p-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) =>
                  setAcceptedTerms(event.target.checked)
                }
                className="mt-1 size-4 accent-orange-500"
              />

              <span className="text-sm leading-5 text-muted-foreground">
                J'accepte les{" "}
                <Link
                  href="/terms"
                  target="_blank"
                  className="font-semibold text-orange-600 underline-offset-4 hover:underline dark:text-orange-400"
                >
                  conditions générales
                </Link>
                .
              </span>
            </label>

            {/* Erreur */}
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </div>
            )}

            {/* Connexion */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  <LogIn className="size-5" />
                  Se connecter
                </>
              )}
            </button>
          </form>

          {/* Sécurité */}
          <div className="mt-6 flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
              <ShieldCheck className="size-5 text-green-600" />
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              Votre session est protégée et vos informations
              personnelles restent confidentielles.
            </p>
          </div>

          {/* Register */}
          <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
            Vous n'avez pas encore de compte ?{" "}
            <Link
              href="/auth/register"
              className="font-semibold text-orange-600 hover:underline dark:text-orange-400"
            >
              Créer un compte
            </Link>
          </div>
        </div>

        {/* CGU */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          En continuant, vous acceptez nos{" "}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-foreground"
          >
            conditions générales
          </Link>
          .
        </p>
      </div>
    </main>
  );
}

