const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getMessaging } = require("firebase-admin/messaging");

initializeApp();
const db = getFirestore();

// Se dispara cada vez que se crea un documento en la colección "scans",
// es decir, cada vez que alguien abre el perfil público de un QR.
exports.notificarEscaneo = onDocumentCreated("scans/{scanId}", async (event) => {
  const scan = event.data.data();
  if (!scan?.profileId) return;

  const perfilSnap = await db.collection("profiles").doc(scan.profileId).get();
  if (!perfilSnap.exists) return;
  const perfil = perfilSnap.data();

  const userSnap = await db.collection("users").doc(perfil.ownerId).get();
  const fcmToken = userSnap.exists ? userSnap.data().fcmToken : null;
  if (!fcmToken) return; // el tutor no ha activado notificaciones

  const ubicacion =
    scan.approxLat && scan.approxLng
      ? ` cerca de (${scan.approxLat}, ${scan.approxLng})`
      : "";

  await getMessaging().send({
    token: fcmToken,
    notification: {
      title: "Se escaneó el código de " + perfil.name,
      body: `Alguien acaba de ver el perfil de emergencia${ubicacion}.`,
    },
  });
});
