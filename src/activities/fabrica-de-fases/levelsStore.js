// Acesso às FASES compartilhadas da turma (Firestore). A UI nunca importa
// `firebase` direto: usa só estas funções. Se o Firebase não estiver configurado
// (db === null), degradam graciosamente (lista vazia / erro claro ao salvar).
//
// Coleção `creationLevels`: { name, author, code, createdAt, playCount }.
// Obs.: as regras de segurança do Firestore precisam permitir leitura/escrita
// nesta coleção (igual já acontece com `scores` do Personagem Saltador).
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const COLLECTION = 'creationLevels';
export const NAME_MAX = 24;
export const AUTHOR_MAX = 24;

export const levelsEnabled = db !== null;

function mapDocs(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data(), playCount: d.data().playCount ?? 0 }));
}

// Lista as fases da turma, ordenadas por jogadas (mais jogadas primeiro).
// O fetch usa createdAt para garantir que fases antigas (sem playCount) apareçam;
// a ordenação por popularidade é feita client-side.
export async function listLevels(n = 60) {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(n));
  const levels = mapDocs(await getDocs(q));
  return levels.sort((a, b) => b.playCount - a.playCount);
}

// Incrementa o contador de jogadas de uma fase. Fire-and-forget — erros são silenciosos.
export async function incrementPlayCount(levelId) {
  if (!db) return;
  await updateDoc(doc(db, COLLECTION, levelId), { playCount: increment(1) });
}

// Cria (publica) uma nova fase. Retorna o id do documento criado.
// `code` já deve ter sido validado/jogado com sucesso pela UI antes de salvar.
export async function createLevel({ name, author, code }) {
  if (!db) throw new Error('Compartilhamento indisponível');
  const cleanName = String(name).trim().slice(0, NAME_MAX);
  const cleanAuthor = String(author).trim().slice(0, AUTHOR_MAX);
  if (!cleanName) throw new Error('Nome da fase obrigatório');
  const ref = await addDoc(collection(db, COLLECTION), {
    name: cleanName,
    author: cleanAuthor,
    code: String(code),
    createdAt: serverTimestamp(),
    playCount: 0,
  });
  return ref.id;
}
