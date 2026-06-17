// Ranking de TEMPO por fase (Firestore). Mesmo espírito do ranking do Personagem
// Saltador, mas a "categoria" é a fase (levelId) e o melhor tempo é o MENOR.
//
// Coleção `creationScores`: { levelId, name, timeMs, createdAt }.
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const COLLECTION = 'creationScores';
export const NAME_MAX = 20;

export const rankingEnabled = db !== null;

function mapDocs(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Registra um tempo para uma fase. Retorna o id do documento criado.
export async function submitTime({ levelId, name, timeMs }) {
  if (!db) throw new Error('Ranking indisponível');
  const cleanName = String(name).trim().slice(0, NAME_MAX);
  if (!cleanName) throw new Error('Nome obrigatório');
  if (!levelId) throw new Error('Fase inválida');
  const ref = await addDoc(collection(db, COLLECTION), {
    levelId: String(levelId),
    name: cleanName,
    timeMs: Math.max(0, Math.round(Number(timeMs))) || 0,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Top N tempos (menores primeiro) de uma fase. Filtra por igualdade no servidor
// e ordena/corta no cliente — evita exigir índice composto manual no Firestore.
export async function getTopTimes(levelId, n = 5) {
  if (!db || !levelId) return [];
  const q = query(
    collection(db, COLLECTION),
    where('levelId', '==', String(levelId)),
    limit(100)
  );
  const rows = mapDocs(await getDocs(q));
  rows.sort((a, b) => a.timeMs - b.timeMs);
  return rows.slice(0, n);
}
