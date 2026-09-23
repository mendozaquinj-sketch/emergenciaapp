"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/components/AuthProvider";
import { Profile, ProfileType } from "@/lib/types";
import QRCode from "@/components/QRCode";
import { getBaseUrl } from "@/lib/site";

export default function ProfileForm() {
  const { user } = useAuth();
  const router = useRouter();

  const [type, setType] = useState<ProfileType>("persona");
  const [name, setName] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [breed, setBreed] = useState("");
  const [marks, setMarks] = useState("");
  const [vet, setVet] = useState("");
  const [reward, setReward] = useState("");
  const [saving, setSaving] = useState(false);
  const [qrUrl, setQrUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const nuevoPerfil: Profile = {
        ownerId: user.uid,
        type,
        name,
        bloodType,
        allergies,
        emergencyContacts: [{ name: contactName, phone: contactPhone }],
        languageDefault: "es",
        ...(type === "mascota" ? { breed, marks, vet, reward } : {}),
      };

      const docRef = await addDoc(collection(db, "profiles"), {
        ...nuevoPerfil,
        createdAt: serverTimestamp(),
      });

      const url = `${getBaseUrl()}/p/${docRef.id}`;
      setQrUrl(url);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el perfil.");
    } finally {
      setSaving(false);
    }
  }

  if (qrUrl) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-green-700 font-medium">
          Perfil creado. Este es su código QR:
        </p>
        <QRCode url={qrUrl} />
        <button
          onClick={() => router.push("/dashboard")}
          className="text-brand underline text-sm"
        >
          Volver al panel
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
      <div className="flex gap-3">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "persona"}
            onChange={() => setType("persona")}
          />
          Persona
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            checked={type === "mascota"}
            onChange={() => setType("mascota")}
          />
          Mascota
        </label>
      </div>

      <input
        required
        placeholder={type === "mascota" ? "Nombre de la mascota" : "Nombre completo"}
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />

      {type === "persona" && (
        <>
          <input
            placeholder="Grupo sanguíneo (ej. O+)"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <textarea
            placeholder="Alergias o condiciones médicas"
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </>
      )}

      {type === "mascota" && (
        <>
          <input
            placeholder="Raza"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Señas particulares"
            value={marks}
            onChange={(e) => setMarks(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Veterinario / clínica de contacto"
            value={vet}
            onChange={(e) => setVet(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
          <input
            placeholder="Recompensa (opcional)"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            className="border rounded-lg px-3 py-2"
          />
        </>
      )}

      <input
        required
        placeholder="Nombre del contacto de emergencia"
        value={contactName}
        onChange={(e) => setContactName(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />
      <input
        required
        placeholder="Teléfono con código de país, ej. 5215512345678"
        value={contactPhone}
        onChange={(e) => setContactPhone(e.target.value)}
        className="border rounded-lg px-3 py-2"
      />

      <button
        type="submit"
        disabled={saving}
        className="bg-brand text-white rounded-lg py-2 font-medium disabled:opacity-50"
      >
        {saving ? "Guardando..." : "Guardar perfil y generar QR"}
      </button>
    </form>
  );
}
