/* Firebase (Authentication + Firestore) for login and book records.
   Cover images and PDFs are committed to the GitHub repo (uploads/...) through the GitHub API. */
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js';
import { firebaseConfig, ADMIN_EMAIL, GITHUB } from './firebase-config.js';

export { ADMIN_EMAIL };
export const configured = !String(firebaseConfig.apiKey).startsWith('YOUR_');

let auth, db;
if (configured) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app); db = getFirestore(app);
}

export const onAuth = cb => configured ? onAuthStateChanged(auth, cb) : cb(null);
export const login = (email, pass) => signInWithEmailAndPassword(auth, email, pass);
export const logout = () => { sessionStorage.removeItem(TOKEN_KEY); return configured ? signOut(auth) : Promise.resolve(); };

const books = () => collection(db, 'books');

export async function listBooks() {
  if (!configured) return [];
  const snap = await getDocs(query(books(), orderBy('createdAt', 'desc')));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/* ---------- GitHub storage ---------- */
const TOKEN_KEY = 'cta-gh-token';               // kept only for this browser session
export const getGhToken = () => sessionStorage.getItem(TOKEN_KEY) || '';
export const setGhToken = t => sessionStorage.setItem(TOKEN_KEY, t);

const gh = async (path, token, init = {}) => {
  const res = await fetch(`https://api.github.com/repos/${GITHUB.owner}/${GITHUB.repo}/contents/${path}`, {
    ...init,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
  });
  if (res.status === 401 || res.status === 403) throw new Error('GitHub token is invalid or has no write access to this repository.');
  if (res.status === 404 && init.method === 'PUT') throw new Error('GitHub repository or branch not found (check GITHUB in js/firebase-config.js).');
  return res;
};

const toBase64 = file => new Promise((res, rej) => {
  const r = new FileReader();
  r.onload = () => res(String(r.result).split(',')[1]);
  r.onerror = () => rej(r.error);
  r.readAsDataURL(file);
});

const rand = () => [...crypto.getRandomValues(new Uint8Array(12))].map(b => b.toString(16).padStart(2, '0')).join('');
const IMG_EXT = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

async function commitFile(file, folder, ext, token) {
  const path = `uploads/${folder}/${rand()}.${ext}`;
  const res = await gh(path, token, {
    method: 'PUT',
    body: JSON.stringify({ message: `Upload ${path}`, content: await toBase64(file), branch: GITHUB.branch })
  });
  if (!res.ok) throw new Error(`GitHub upload failed (${res.status}): ${(await res.json().catch(() => ({}))).message || ''}`);
  return path;
}

async function deleteFiles(paths, token) {
  for (const p of paths) {
    if (!/^uploads\/(covers|pdfs)\/[\w.-]+$/.test(p)) continue;
    const info = await gh(`${p}?ref=${encodeURIComponent(GITHUB.branch)}`, token);
    if (!info.ok) continue;                      // already gone
    const { sha } = await info.json();
    const res = await gh(p, token, { method: 'DELETE', body: JSON.stringify({ message: `Delete ${p}`, sha, branch: GITHUB.branch }) });
    if (!res.ok) throw new Error(`GitHub delete failed (${res.status})`);
  }
}

export async function addBook({ title, description, image, pdf, ghToken }) {
  const imgExt = IMG_EXT[image.type];
  if (!imgExt) throw new Error('Cover image must be JPG, PNG, WebP or GIF.');
  const magic = await pdf.slice(0, 5).text();
  if (magic !== '%PDF-') throw new Error('The selected file is not a valid PDF.');

  const imageUrl = await commitFile(image, 'covers', imgExt, ghToken);
  let pdfUrl;
  try {
    pdfUrl = await commitFile(pdf, 'pdfs', 'pdf', ghToken);
    const ref = await addDoc(books(), { title, description, imageUrl, pdfUrl, createdAt: Date.now() });
    setGhToken(ghToken);
    return ref;
  } catch (e) {
    await deleteFiles([imageUrl, pdfUrl].filter(Boolean), ghToken).catch(() => {});   // no orphan files
    throw e;
  }
}

// Used once to import the two original issues (they reference existing image/PDF URLs).
export const addRaw = data => addDoc(books(), data);

export async function removeBook(b, ghToken) {
  const local = [b.imageUrl, b.pdfUrl].filter(p => /^uploads\//.test(p || ''));
  if (local.length) { await deleteFiles(local, ghToken); setGhToken(ghToken); }   // files first, so a bad token leaves the book intact
  await deleteDoc(doc(db, 'books', b.id));
}
