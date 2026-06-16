// Inicialização do Firebase (apenas Firestore). A config vem de variáveis de
// ambiente do Vite (VITE_FIREBASE_*). Se estiver ausente, `db` é null e a UI
// degrada graciosamente (mostra "ranking indisponível") em vez de quebrar.
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Considera configurado se as chaves essenciais existem.
const isConfigured = Boolean(config.apiKey && config.projectId && config.appId);

export const db = isConfigured ? getFirestore(initializeApp(config)) : null;
