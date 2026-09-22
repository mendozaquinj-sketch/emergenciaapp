# Emergencia App — código base (versión sin fotos)

Proyecto listo para correr: registro/login, crear perfiles (persona o
mascota) sin foto, generar QR, página pública multi-idioma con registro
de escaneo y reglas de seguridad. **No usa Firebase Storage, así que no
necesitas el plan Blaze ni dar una tarjeta — todo corre en el plan
gratuito Spark.**

## Qué pegar en cada app

### 1) Terminal / VS Code (este proyecto)
```bash
npm install
cp .env.local.example .env.local   # y llena los valores (paso 2)
npm run dev
```
Abre http://localhost:3000

### 2) Firebase Console (console.firebase.google.com)
1. Crear proyecto nuevo (déjalo en el plan Spark, gratis).
2. Authentication → Sign-in method → activar "Correo electrónico/contraseña".
3. Firestore Database → crear base de datos → pestaña **Reglas** → pega el
   contenido de `firestore.rules` → Publicar.
4. Configuración del proyecto (ícono de engranaje) → desplázate a
   "Tus apps" → crea una app web → copia los valores que te da
   (apiKey, authDomain, etc.) y pégalos en tu archivo `.env.local`
   (mismos nombres que están en `.env.local.example`).

No hace falta entrar a la sección "Storage" en ningún momento.

### 3) Cloud Functions (notificación al escanear — opcional, sí requiere plan Blaze)
Este módulo es opcional y es la única parte del proyecto que pide plan de
pago (aunque el uso real siga siendo gratis dentro de la cuota). Solo
actívalo si ya decidiste vincular una tarjeta:
```bash
npm install -g firebase-tools
firebase login
cp .firebaserc.example .firebaserc   # y reemplaza tu-proyecto-id
cd functions && npm install && cd ..
firebase deploy --only functions,firestore:rules
```
Si no lo activas, la app funciona igual, solo no llega el aviso push al
tutor cuando alguien escanea el QR.

### 4) GitHub
```bash
git init
git add .
git commit -m "Proyecto inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/emergencia-app.git
git push -u origin main
```

### 5) Vercel (vercel.com)
1. "Add New Project" → importar el repositorio de GitHub.
2. En Settings → Environment Variables, pega las mismas variables que
   tienes en tu `.env.local`.
3. Deploy. Cada `git push` a `main` vuelve a desplegar automáticamente.

## Estructura
```
app/                 páginas (App Router de Next.js)
  page.tsx           landing
  login/ register/   autenticación
  dashboard/         panel privado del tutor (protegido)
  p/[id]/             perfil público (el que abre el QR)
components/          UI reutilizable + lógica de formulario/QR
lib/                 conexión a Firebase, tipos
functions/           Cloud Function opcional de notificación al tutor
firestore.rules      reglas de seguridad de la base de datos
```

## Si más adelante quieres agregar fotos sin usar Firebase Storage
Puedes usar un servicio externo gratuito que no pide tarjeta, como
Cloudinary, y solo guardar la URL de la imagen resultante en el campo
`photoUrl` del perfil (habría que volver a agregar ese campo en
`lib/types.ts`). Avísame si llegas a ese punto y te preparo esa versión.
