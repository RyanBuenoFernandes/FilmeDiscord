import { cert, getApps, initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

const hasFirebaseEnv =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY

let app;

if (hasFirebaseEnv) {
  app =
    getApps()[0] ??
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })
} else {
  // Durante o build do Next.js, caso as variáveis não estejam prontas, evita quebrar a compilação
  console.warn('Aviso: Variáveis de ambiente do Firebase Admin não encontradas.')
}

export const db = app ? getFirestore(app) : (null as any)

