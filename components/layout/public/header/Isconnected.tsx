// /components/layout/public/Isconnected.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogIn,
  LogOut,
  ChevronDown,
  Clock,
  ShoppingBag,
  UserCircle,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth/auth-client";
import { Skeleton } from "@/components/ui/skeleton";

interface IsconnectedProps {
  className?: string;
}

export default function Isconnected({
  className = "",
}: IsconnectedProps) {
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /*
   * ============================================================
   * BETTER AUTH
   * ============================================================
   *
   * La session est maintenant la source de vérité.
   *
   * session === null
   *      → utilisateur non connecté
   *
   * session?.user
   *      → utilisateur connecté
   */
  const { data: session, isPending } =
    authClient.useSession();

  const currentUser = session?.user;

  /*
   * ============================================================
   * FERMETURE DU MENU AU CLIC EXTÉRIEUR
   * ============================================================
   */

  useEffect(() => {
    if (!isMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handlePointerDown,
      true,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handlePointerDown,
        true,
      );
    };
  }, [isMenuOpen]);

  /*
   * ============================================================
   * MENU
   * ============================================================
   */

  const handleToggleMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    setIsMenuOpen((previous) => !previous);
  };

  const handleCloseMenu = () => {
    setIsMenuOpen(false);
  };

  /*
   * ============================================================
   * DÉCONNEXION BETTER AUTH
   * ============================================================
   */

  const handleLogout = async () => {
    setIsMenuOpen(false);

    try {
      await authClient.signOut();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(
        "Erreur lors de la déconnexion :",
        error,
      );
    }
  };

  /*
   * ============================================================
   * INITIALLES
   * ============================================================
   */

  const getInitials = (name?: string | null) => {
    if (!name?.trim()) return "??";

    return name
      .trim()
      .split(/\s+/)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  /*
   * ============================================================
   * AVATAR
   * ============================================================
   */

  const avatarUrl = currentUser?.image;

  /*
   * ============================================================
   * ÉTAT DE CHARGEMENT
   * ============================================================
   *
   * Pendant que Better Auth récupère la session,
   * on évite d'afficher temporairement "Connexion".
   */

if (isPending) {
  return (
    <div className={className}>
      <Skeleton
        className="h-12 w-32 rounded-xl"
        aria-hidden="true"
      />
    </div>
  );
}
  /*
   * ============================================================
   * UTILISATEUR CONNECTÉ
   * ============================================================
   */

  if (currentUser) {
    return (
      <div className={className}>
        <div
          className="relative"
          ref={menuRef}
        >
          {/* ===================================================
              BOUTON UTILISATEUR
              =================================================== */}

          <button
            type="button"
            onClick={handleToggleMenu}
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            className="flex h-12 items-center gap-2 rounded-xl border-2 border-orange-200 bg-white px-2 shadow-sm transition-all duration-200 hover:bg-orange-50 hover:shadow-md"
          >
            {/* Avatar */}

            <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={
                    currentUser.name ||
                    "Avatar utilisateur"
                  }
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-sm font-bold">
                  {getInitials(currentUser.name)}
                </span>
              )}
            </div>

            <ChevronDown
              className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                isMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* ===================================================
              MENU
              =================================================== */}

          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-gray-200 bg-white py-2 shadow-2xl"
            >
              {/* =================================================
                  HEADER UTILISATEUR
                  ================================================= */}

              <div className="border-b border-gray-100 px-4 py-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-md">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={
                          currentUser.name ||
                          "Avatar utilisateur"
                        }
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="font-bold">
                        {getInitials(currentUser.name)}
                      </span>
                    )}
                  </div>

                  {/* Informations */}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {currentUser.name ||
                        "Utilisateur"}
                    </p>

                    <p className="truncate text-xs text-gray-500">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* =================================================
                  NAVIGATION
                  ================================================= */}

              <div className="py-1">
                <Link
                  href="/user/profil"
                  onClick={handleCloseMenu}
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  <UserCircle className="h-4 w-4" />

                  <span>
                    Mon profil
                  </span>
                </Link>

                <Link
                  href="/user/commandes"
                  onClick={handleCloseMenu}
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  <ShoppingBag className="h-4 w-4" />

                  <span>
                    Mes commandes
                  </span>
                </Link>

                <Link
                  href="/user/loyalty"
                  onClick={handleCloseMenu}
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-orange-50 hover:text-orange-600"
                >
                  <Clock className="h-4 w-4" />

                  <span>
                    Carte de fidèlité
                  </span>
                </Link>
              </div>

              {/* =================================================
                  DÉCONNEXION
                  ================================================= */}

              <div className="border-t border-gray-100 px-3 pb-1 pt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />

                  <span>
                    Déconnexion
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  /*
   * ============================================================
   * UTILISATEUR NON CONNECTÉ
   * ============================================================
   */

  return (
    <div className={className}>
      <Link
        href="/auth/login"
        className="inline-flex h-12 items-center justify-center gap-2 whitespace-nowrap rounded-xl border-2 border-orange-500 bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:border-orange-600 hover:from-orange-600 hover:to-orange-700 hover:shadow-md"
      >
        <LogIn className="h-4 w-4" />

        <span>
          Connexion
        </span>
      </Link>
    </div>
  );
}
