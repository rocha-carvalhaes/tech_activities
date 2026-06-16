// Camada de acesso ao ranking (Firestore). A UI nunca importa `firebase` direto:
// usa só estas funções. Se o Firebase não estiver configurado (db === null),
// elas se comportam de forma graciosa (retornam vazio / lançam erro claro).
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

const COLLECTION = 'scores';
export const NAME_MAX = 20;

// Chave normalizada da categoria = combinação exata dos 4 atributos da run.
// Ex.: { size:3, color:'teal', jump:8, speed:3.0 } → "s3|cteal|j8|v3".
export function categoryKey(attrs) {
  const size = Math.trunc(Number(attrs.size));
  const jump = Math.trunc(Number(attrs.jump));
  const color = String(attrs.color).trim().toLowerCase();
  const speed = Number(attrs.speed).toString();
  return `s${size}|c${color}|j${jump}|v${speed}`;
}

// Rótulo amigável dos atributos da run (para a aba "Categoria").
export function categoryLabel(attrs) {
  return [
    `size ${Math.trunc(Number(attrs.size))}`,
    String(attrs.color).trim().toLowerCase(),
    `jump ${Math.trunc(Number(attrs.jump))}`,
    `speed ${Number(attrs.speed)}`,
  ];
}

export const rankingEnabled = db !== null;

// Envia a run para o ranking. Retorna o id do documento criado.
export async function submitScore({ name, score, attrs }) {
  if (!db) throw new Error('Ranking indisponível');
  const cleanName = String(name).trim().slice(0, NAME_MAX);
  if (!cleanName) throw new Error('Nome obrigatório');
  const ref = await addDoc(collection(db, COLLECTION), {
    name: cleanName,
    score: Math.trunc(Number(score)) || 0,
    size: Math.trunc(Number(attrs.size)),
    color: String(attrs.color).trim().toLowerCase(),
    jump: Math.trunc(Number(attrs.jump)),
    speed: Number(attrs.speed),
    category: categoryKey(attrs),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

function mapDocs(snap) {
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Top N geral (ordenado no servidor; usa índice de campo único, automático).
export async function getTopGeneral(n = 5) {
  if (!db) return [];
  const q = query(collection(db, COLLECTION), orderBy('score', 'desc'), limit(n));
  return mapDocs(await getDocs(q));
}

// Top N da categoria exata. Filtra por igualdade no servidor e ordena/corta no
// cliente — evita exigir índice composto manual no Firestore.
export async function getTopCategory(attrs, n = 5) {
  if (!db) return [];
  const q = query(
    collection(db, COLLECTION),
    where('category', '==', categoryKey(attrs)),
    limit(50)
  );
  const rows = mapDocs(await getDocs(q));
  rows.sort((a, b) => b.score - a.score);
  return rows.slice(0, n);
}
