"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  ImagePlus,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { signUp } from "@/lib/auth/auth-client";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [avatar, setAvatar] = useState<string | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* =========================================================
     AVATAR → BASE64
     ========================================================= */

  const handleAvatarChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 2 Mo.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAvatar(reader.result);
        setError("");
      }
    };

    reader.readAsDataURL(file);
  };

  const removeAvatar = () => {
    setAvatar(null);
  };

  /* =========================================================
     INSCRIPTION
     ========================================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Veuillez renseigner votre nom.");
      return;
    }

    if (!email.trim()) {
      setError("Veuillez renseigner votre adresse email.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Les deux mots de passe ne correspondent pas.");
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

      const result = await signUp.email({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,

        /*
         * Better Auth stocke normalement l'avatar
         * dans le champ image.
         *
         * Ici nous transmettons directement la chaîne
         * Base64 générée par FileReader.
         */
        image: avatar ?? undefined,
      });

      if (result.error) {
        setError(
          result.error.message ||
            "Impossible de créer votre compte.",
        );
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError(
        "Une erreur est survenue lors de la création du compte.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-orange-50 via-background to-pink-50 px-4 py-10 dark:from-orange-950/20 dark:to-pink-950/20">
      {/* Décoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 size-80 rounded-full bg-orange-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 size-96 rounded-full bg-pink-400/20 blur-3xl" />

      <div className="relative w-full max-w-md">
        {/* Logo / marque */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-xl shadow-orange-500/20">
            <span className="text-2xl font-black">R</span>
          </div>

          <h1 className="text-3xl font-black tracking-tight">
            Créer votre compte
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Rejoignez-nous et faites-vous livrer facilement.
          </p>
        </div>

        {/* Carte */}
        <div className="rounded-3xl border bg-background/95 p-6 shadow-2xl backdrop-blur sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="flex size-24 items-center justify-center overflow-hidden rounded-full border-4 border-background bg-gradient-to-br from-orange-100 to-pink-100 shadow-lg dark:from-orange-950 dark:to-pink-950">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="Avatar"
                      className="size-full object-cover"
                    />
                  ) : (
                    <ImagePlus className="size-8 text-orange-500" />
                  )}
                </div>

                {avatar && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -right-1 -top-1 flex size-7 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md"
                    aria-label="Supprimer l'avatar"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </div>

              <label className="mt-3 cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700 dark:text-orange-400">
                {avatar
                  ? "Modifier la photo"
                  : "Ajouter une photo"}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>

              <p className="mt-1 text-xs text-muted-foreground">
                JPG, PNG ou WEBP · 2 Mo maximum
              </p>
            </div>

            {/* Nom */}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-sm font-medium"
              >
                Nom
              </label>

              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Jean Dupont"
                className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

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
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="vous@example.com"
                className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium"
              >
                Mot de passe
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 caractères"
                  className="h-11 w-full rounded-xl border bg-background px-4 pr-11 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
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

            {/* Confirmation */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium"
              >
                Confirmer le mot de passe
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Retapez votre mot de passe"
                  className="h-11 w-full rounded-xl border bg-background px-4 pr-11 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (value) => !value,
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Masquer le mot de passe"
                      : "Afficher le mot de passe"
                  }
                >
                  {showConfirmPassword ? (
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

            {/* Bouton */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-600 hover:to-pink-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Création du compte...
                </>
              ) : (
                <>
                  <UserPlus className="size-5" />
                  Créer mon compte
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
            Vous avez déjà un compte ?{" "}
            <Link
              href="/login"
              className="font-semibold text-orange-600 hover:underline dark:text-orange-400"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

