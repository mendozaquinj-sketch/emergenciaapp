"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import ProfileForm from "@/components/ProfileForm";

export default function NuevoPerfilPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  if (loading || !user) return <p className="p-8">Cargando...</p>;

  return (
    <main className="max-w-lg mx-auto p-8">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Nuevo perfil</h1>
      <ProfileForm />
    </main>
  );
}
