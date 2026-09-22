import { getMessaging, getToken } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import app, { db } from "@/lib/firebase";

// Llamar esta función desde un botón en el dashboard, ej:
// <button onClick={() => activarNotificaciones(user.uid)}>Activar avisos</button>
export async function activarNotificaciones(userId: string) {
  try {
    const permiso = await Notification.requestPermission();
    if (permiso !== "granted") return false;

    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    await setDoc(doc(db, "users", userId), { fcmToken: token }, { merge: true });
    return true;
  } catch (err) {
    console.error("No se pudo activar notificaciones:", err);
    return false;
  }
}
