import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Profile } from "@/lib/types";
import PublicProfileView from "@/components/PublicProfileView";

export const dynamic = "force-dynamic"; // siempre leer datos frescos

export default async function PerfilPublico({
  params,
}: {
  params: { id: string };
}) {
  const snap = await getDoc(doc(db, "profiles", params.id));

  if (!snap.exists()) {
    return (
      <main className="min-h-screen flex items-center justify-center p-8">
        <p>Este perfil no existe o fue eliminado.</p>
      </main>
    );
  }

  const profile = { id: snap.id, ...(snap.data() as Profile) };

  return <PublicProfileView profile={profile} />;
}

// Evita que el perfil sea indexado por buscadores (privacidad)
export async function generateMetadata() {
  return { robots: { index: false, follow: false } };
}
