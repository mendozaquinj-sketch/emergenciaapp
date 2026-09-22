"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { Profile } from "@/lib/types";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "profiles"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setProfiles(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Profile) }))
      );
    });
    return () => unsub();
  }, [user]);

  if (loading || !user) return <p className="p-8">Cargando...</p>;

  return (
    <main className="max-w-2xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">Mis perfiles</h1>
        <button
          onClick={() => signOut(auth)}
          className="text-sm text-gray-600 underline"
        >
          Cerrar sesión
        </button>
      </div>

      <Link
        href="/dashboard/nuevo"
        className="inline-block mb-6 px-4 py-2 bg-brand text-white rounded-lg font-medium"
      >
        + Nuevo perfil
      </Link>

      <div className="flex flex-col gap-3">
        {profiles.length === 0 && (
          <p className="text-gray-500">Aún no tienes perfiles creados.</p>
        )}
        {profiles.map((p) => (
          <Link
            key={p.id}
            href={`/p/${p.id}`}
            target="_blank"
            className="border rounded-lg p-4 flex justify-between items-center hover:bg-brand-light"
          >
            <div>
              <p className="font-medium">{p.name}</p>
              <p className="text-xs text-gray-500 uppercase">{p.type}</p>
            </div>
            <span className="text-brand text-sm">Ver perfil público →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
