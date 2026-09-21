// Serviço de integração com o Firebase Firestore
import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc, onSnapshot, getDoc } from 'firebase/firestore'

// Configuração do Firebase dedicada ao projeto cardapio-hbm
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDUG1_6EaPjgudwLziskTj_TB5gdvQV0pQ',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'cardapio-hbm.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'cardapio-hbm',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'cardapio-hbm.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '109930712177',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:109930712177:web:ce125d8f05fdb01644c5d0',
}

let app = null
let db = null
let isFirebaseConfigured = false

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  isFirebaseConfigured = true
  console.log('🔥 Firebase Firestore conectado com sucesso ao projeto:', firebaseConfig.projectId)
} catch (err) {
  console.warn('⚠️ Erro ao inicializar Firebase Firestore:', err)
}

const COLECAO = 'hbm_dados'
const DOC_ID = 'sistema'

/**
 * Salva os dados no documento principal do Firestore
 */
export async function salvarDadosBD(dados) {
  if (!db || !isFirebaseConfigured) return false
  try {
    const docRef = doc(db, COLECAO, DOC_ID)
    // Sanitização para remover valores undefined que o Firestore rejeita
    const payload = JSON.parse(JSON.stringify(dados))
    await setDoc(docRef, payload, { merge: true })
    return true
  } catch (e) {
    console.warn('⚠️ Erro ao salvar dados no Firestore:', e)
    return false
  }
}

/**
 * Escuta atualizações em tempo real do documento principal do Firestore
 */
export function escutarDadosBD(onData) {
  if (!db || !isFirebaseConfigured) return () => {}
  try {
    const docRef = doc(db, COLECAO, DOC_ID)
    return onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.data(), true)
        } else {
          onData(null, false)
        }
      },
      (err) => {
        console.warn('⚠️ Erro na sincronização em tempo real do Firestore:', err)
      }
    )
  } catch (e) {
    console.warn('⚠️ Erro ao conectar listener do Firestore:', e)
    return () => {}
  }
}

/**
 * Carrega dados uma única vez do Firestore
 */
export async function carregarDadosBD() {
  if (!db || !isFirebaseConfigured) return null
  try {
    const docRef = doc(db, COLECAO, DOC_ID)
    const snap = await getDoc(docRef)
    if (snap.exists()) return snap.data()
  } catch (e) {
    console.warn('⚠️ Erro ao carregar dados do Firestore:', e)
  }
  return null
}

export { app, db, isFirebaseConfigured, firebaseConfig }
