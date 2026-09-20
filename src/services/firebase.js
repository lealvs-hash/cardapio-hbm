// Serviço de integração com o Firebase Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let db = null

const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  !firebaseConfig.projectId.includes('SEU_') &&
  !firebaseConfig.apiKey.includes('sua_')
)

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    console.log('🔥 Firebase conectado com sucesso ao projeto:', firebaseConfig.projectId)
  } catch (err) {
    console.warn('⚠️ Erro ao inicializar Firebase:', err)
  }
} else {
  console.info('ℹ️ Firebase não configurado no .env.local. Executando em modo local seguro (localStorage).')
}

/**
 * Salva ou atualiza um documento no Firestore
 */
export async function salvarDocumentoFirestore(colecao, docId, dados) {
  if (!db) return
  try {
    const docRef = doc(db, colecao, docId)
    await setDoc(docRef, dados, { merge: true })
  } catch (e) {
    console.warn('Erro ao salvar no Firestore:', e)
  }
}

/**
 * Escuta atualizações em tempo real de um documento no Firestore
 */
export function escutarDocumentoFirestore(colecao, docId, onData) {
  if (!db) return () => {}
  try {
    const docRef = doc(db, colecao, docId)
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        onData(snap.data())
      }
    }, (err) => {
      console.warn('Erro no snapshot do Firestore:', err)
    })
  } catch (e) {
    console.warn('Erro ao escutar Firestore:', e)
    return () => {}
  }
}

export { app, db, isFirebaseConfigured, firebaseConfig }
