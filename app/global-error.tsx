//@/app/global-error.tsx
/*
 role : Gestion des erreurs du layout racine (plus haut niveau que error.tsx).
        Affiche un fallback même si le layout est cassé (HTML minimal).
 import: Aucun (doit contenir les balises <html> et <body>)
 useBy : Layout racine en cas d'erreur critique
*/

'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #fef2f2, #fff7ed)',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Erreur critique
            </h1>
            <p style={{ color: '#666', marginBottom: '2rem' }}>
              L'application a rencontré une erreur grave.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #dc2626, #ea580c)',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}