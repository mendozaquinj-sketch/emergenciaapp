importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js");

// Pega aquí la misma configuración que usas en lib/firebase.ts
// (Solo necesario si activas el módulo opcional de notificaciones push, que requiere plan Blaze)
firebase.initializeApp({
  apiKey: "REEMPLAZA_CON_TU_API_KEY",
  authDomain: "REEMPLAZA.firebaseapp.com",
  projectId: "REEMPLAZA",
  messagingSenderId: "REEMPLAZA",
  appId: "REEMPLAZA",
});

const messaging = firebase.messaging();
