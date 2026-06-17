// Acesso às FASES compartilhadas da turma (Firestore). A UI nunca importa
// `firebase` direto: usa só estas funções. Se o Firebase não estiver configurado
// (db === null), degradam graciosamente (lista vazia / erro claro ao salvar).
//
// Coleção `creationLevels`: { name, author, code, createdAt }.
// Obs.: as regras de segurança do Firestore precisam permitir leitura/escrita
// nesta coleção (igual já acontece com `scores` do Personagem Saltador).
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../lib/firebase';

const COLLECTION = 'creationLevels';
export const NAME_MAX = 24;
export const AUTHOR_MAX = 24;

export const levelsEnabled = db !== null;

function mapDocs(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Lista as fases mais recentes da turma (ordenadas no servidor por data).
export async function listLevels(n = 60) {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'), limit(n));
  return mapDocs(await getDocs(q));
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
  });
  return ref.id;
}
