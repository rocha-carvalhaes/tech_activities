// Ranking de TEMPO da Caça ao Tesouro (Firestore). Mesmo molde dos outros
// rankings: a UI só usa estas funções; se o Firebase não estiver configurado
// (db === null), tudo degrada graciosamente. Menor tempo = melhor.
//
// Coleção `treasureHuntScores`: { name, timeMs, category, createdAt }.
// A "categoria" é o TEMA do circuito (themeId): 'sports' | 'school' | 'computer'.
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const COLLECTION = 'treasureHuntScores';
export const NAME_MAX = 20;

export const rankingEnabled = db !== null;

function mapDocs(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Registra o tempo do circuito. Retorna o id do documento criado.
export async function submitTime({ name, timeMs, themeId }) {
  if (!db) throw new Error('Ranking indisponível');
  const cleanName = String(name).trim().slice(0, NAME_MAX);
  if (!cleanName) throw new Error('Nome obrigatório');
  if (!themeId) throw new Error('Tema inválido');
  const ref = await addDoc(collection(db, COLLECTION), {
    name: cleanName,
    timeMs: Math.max(0, Math.round(Number(timeMs))) || 0,
    category: String(themeId),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Top N geral (menores tempos primeiro; índice de campo único, automático).
export async function getTopGeneral(n = 5) {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy('timeMs', 'asc'), limit(n));
  return mapDocs(await getDocs(q));
}

// Top N do tema. Filtra por igualdade no servidor e ordena/corta no cliente —
// evita exigir índice composto manual no Firestore.
export async function getTopCategory(themeId, n = 5) {
  if (!db || !themeId) return [];
  const q = query(
    collection(db, COLLECTION),
    where('category', '==', String(themeId)),
    limit(50)
  );
  const rows = mapDocs(await getDocs(q));
  rows.sort((a, b) => a.timeMs - b.timeMs);
  return rows.slice(0, n);
}
