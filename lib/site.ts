// Devuelve siempre la URL pública real de tu app (nunca una URL
// de "preview" de Vercel, que pide iniciar sesión con Vercel).
// Si defines NEXT_PUBLIC_APP_URL, esa es la que se usa siempre.
// Si no, cae de vuelta a la URL actual del navegador (útil en localhost).
export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}
