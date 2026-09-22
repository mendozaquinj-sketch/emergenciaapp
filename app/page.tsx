import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-bold text-brand-dark">Emergencia App</h1>
      <p className="max-w-md text-gray-600">
        Crea el perfil de emergencia de tus hijos, familiares o mascotas y
        genera su código QR para pulsera, placa o etiqueta.
      </p>
      <div className="flex gap-4">
        <Link
          href="/login"
          className="px-5 py-2 rounded-lg bg-brand text-white font-medium"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/register"
          className="px-5 py-2 rounded-lg border border-brand text-brand font-medium"
        >
          Crear cuenta
        </Link>
      </div>
    </main>
  );
}
