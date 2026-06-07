"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { IS_DEMO } from "@/lib/firebase";
import { auth } from "@/lib/firebase-client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (IS_DEMO) {
      if (email === "admin@demo.com" && password === "demo1234") {
        sessionStorage.setItem("admin_demo", "true");
        router.push("/admin");
      } else {
        setError("Modo Demo: usa admin@demo.com / demo1234");
      }
      return;
    }

    if (!auth) {
      setError("Firebase no está configurado.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code ?? "";
      const messages: Record<string, string> = {
        "auth/invalid-email": "El formato del email es inválido.",
        "auth/user-not-found": "No existe una cuenta con ese email.",
        "auth/wrong-password": "Contraseña incorrecta.",
        "auth/invalid-credential": "Email o contraseña incorrectos.",
        "auth/too-many-requests": "Demasiados intentos. Esperá unos minutos.",
        "auth/user-disabled": "Esta cuenta está deshabilitada.",
        "auth/operation-not-allowed": "El método Email/Password no está habilitado en Firebase Console → Authentication → Sign-in method.",
        "auth/network-request-failed": "Error de red. Verificá tu conexión.",
        "auth/api-not-enabled": "La API de autenticación no está habilitada para este proyecto.",
      };
      setError(messages[code] ?? `Error (${code || "desconocido"}): intentá de nuevo.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <p className="login-kicker">Acceso restringido</p>
        <h1 className="login-title">Panel Admin</h1>
        <p className="login-subtitle">シーワースハウス · SEAWORTHOUSE</p>

        {IS_DEMO && (
          <div className="admin-notice admin-notice--magenta login-notice">
            Modo demo — <strong>admin@demo.com</strong> / <strong>demo1234</strong>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-email">
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="form-input"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="login-error">{error}</p>}
          <button type="submit" className="btn btn-cyan btn-full" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <Link href="/" className="login-back-link">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
