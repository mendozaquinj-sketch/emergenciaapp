"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import Link from "next/link";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(traducirError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm flex flex-col gap-4 border rounded-xl p-6"
      >
        <h1 className="text-xl font-bold text-brand-dark">Crear cuenta</h1>

        <input
          type="email"
          required
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-brand text-white rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Creando..." : "Crear cuenta"}
        </button>

        <p className="text-sm text-gray-600 text-center">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="text-brand font-medium">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}

function traducirError(code: string) {
  const mapa: Record<string, string> = {
    "auth/email-already-in-use": "Ese correo ya está registrado.",
    "auth/invalid-email": "Correo inválido.",
    "auth/weak-password": "La contraseña es muy débil.",
  };
  return mapa[code] || "Ocurrió un error, intenta de nuevo.";
}
