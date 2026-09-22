"use client";

import { useEffect, useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Profile } from "@/lib/types";

const TEXTOS = {
  es: {
    aviso: "Usa estos datos solo en caso de emergencia.",
    sangre: "Grupo sanguíneo",
    alergias: "Alergias / condiciones",
    raza: "Raza",
    senas: "Señas particulares",
    veterinario: "Veterinario",
    recompensa: "Recompensa",
    contacto: "Contacto de emergencia",
    llamar: "Llamar",
    whatsapp: "WhatsApp",
  },
  en: {
    aviso: "Use this information only in case of emergency.",
    sangre: "Blood type",
    alergias: "Allergies / conditions",
    raza: "Breed",
    senas: "Distinctive marks",
    veterinario: "Veterinarian",
    recompensa: "Reward",
    contacto: "Emergency contact",
    llamar: "Call",
    whatsapp: "WhatsApp",
  },
  pt: {
    aviso: "Use estes dados apenas em caso de emergência.",
    sangre: "Tipo sanguíneo",
    alergias: "Alergias / condições",
    raza: "Raça",
    senas: "Sinais particulares",
    veterinario: "Veterinário",
    recompensa: "Recompensa",
    contacto: "Contato de emergência",
    llamar: "Ligar",
    whatsapp: "WhatsApp",
  },
} as const;

type Idioma = keyof typeof TEXTOS;

export default function PublicProfileView({ profile }: { profile: Profile }) {
  const [idioma, setIdioma] = useState<Idioma>(
    (profile.languageDefault as Idioma) || "es"
  );
  const t = TEXTOS[idioma];

  // Registrar el evento de escaneo una sola vez al cargar la página
  useEffect(() => {
    async function registrarEscaneo() {
      const evento: Record<string, any> = {
        profileId: profile.id,
        timestamp: serverTimestamp(),
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            evento.approxLat = Math.round(pos.coords.latitude * 100) / 100;
            evento.approxLng = Math.round(pos.coords.longitude * 100) / 100;
            await addDoc(collection(db, "scans"), evento);
          },
          async () => {
            // Si no autoriza ubicación, igual se registra el escaneo sin ubicación
            await addDoc(collection(db, "scans"), evento);
          },
          { timeout: 4000 }
        );
      } else {
        await addDoc(collection(db, "scans"), evento);
      }
    }
    registrarEscaneo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contacto = profile.emergencyContacts?.[0];

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-4 max-w-md mx-auto text-center">
      <div className="flex gap-2 self-end">
        {(Object.keys(TEXTOS) as Idioma[]).map((code) => (
          <button
            key={code}
            onClick={() => setIdioma(code)}
            className={`text-xs px-2 py-1 rounded border ${
              idioma === code ? "bg-brand text-white" : "text-gray-500"
            }`}
          >
            {code.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-24 h-24 rounded-full bg-brand-light border-4 border-brand-light flex items-center justify-center text-3xl font-bold text-brand-dark">
        {profile.name?.charAt(0).toUpperCase() || "?"}
      </div>

      <h1 className="text-xl font-bold">{profile.name}</h1>
      <span className="text-xs uppercase bg-red-100 text-red-700 px-2 py-1 rounded-full">
        {profile.type === "mascota" ? "Mascota" : "Perfil de emergencia"}
      </span>
      <p className="text-sm text-gray-500">{t.aviso}</p>

      <div className="w-full text-left border rounded-xl p-4 flex flex-col gap-2">
        {profile.type === "persona" && (
          <>
            {profile.bloodType && (
              <p><strong>{t.sangre}:</strong> {profile.bloodType}</p>
            )}
            {profile.allergies && (
              <p><strong>{t.alergias}:</strong> {profile.allergies}</p>
            )}
          </>
        )}
        {profile.type === "mascota" && (
          <>
            {profile.breed && <p><strong>{t.raza}:</strong> {profile.breed}</p>}
            {profile.marks && <p><strong>{t.senas}:</strong> {profile.marks}</p>}
            {profile.vet && (
              <p><strong>{t.veterinario}:</strong> {profile.vet}</p>
            )}
            {profile.reward && (
              <p><strong>{t.recompensa}:</strong> {profile.reward}</p>
            )}
          </>
        )}
        {contacto && (
          <p><strong>{t.contacto}:</strong> {contacto.name}</p>
        )}
      </div>

      {contacto && (
        <div className="flex gap-3 w-full">
          <a
            href={`tel:${contacto.phone}`}
            className="flex-1 py-2 rounded-lg bg-brand-dark text-white font-medium"
          >
            {t.llamar}
          </a>
          <a
            href={`https://wa.me/${contacto.phone}`}
            target="_blank"
            className="flex-1 py-2 rounded-lg bg-green-600 text-white font-medium"
          >
            {t.whatsapp}
          </a>
        </div>
      )}
    </main>
  );
}
