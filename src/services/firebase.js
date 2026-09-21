// Serviço de integração com o Firebase Realtime Database
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, set, onValue, get } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'AIzaSyA5Q9EpYeCSC6Kv3zqDfjZ82N_BTwoaBcg',
  authDomain: 'dietas-hospital-brigada.firebaseapp.com',
  projectId: 'dietas-hospital-brigada',
  storageBucket: 'dietas-hospital-brigada.firebasestorage.app',
  messagingSenderId: '1073488384765',
  appId: '1:1073488384765:web:7683434699089bd5d4a494',
  databaseURL: 'https://dietas-hospital-brigada-default-rtdb.firebaseio.com',
}

let app = null
let db = null
let isFirebaseConfigured = false

try {
  app = initializeApp(firebaseConfig)
  db = getDatabase(app)
  isFirebaseConfigured = true
  console.log('🔥 Firebase Realtime Database conectado com sucesso ao projeto:', firebaseConfig.projectId)
} catch (err) {
  console.warn('⚠️ Erro ao inicializar Firebase Realtime Database:', err)
}

const DB_NODE = 'hbm_cardapios_app'

/**
 * Salva os dados no nó principal do Firebase Realtime Database
 */
export async function salvarDadosBD(dados) {
  if (!db || !isFirebaseConfigured) return false
  try {
    const dbRef = ref(db, DB_NODE)
    // Sanitização para remover valores undefined que o Firebase rejeita
    const payload = JSON.parse(JSON.stringify(dados))
    await set(dbRef, payload)
    return true
  } catch (e) {
    console.warn('⚠️ Erro ao salvar dados no Firebase BD:', e)
    return false
  }
}

/**
 * Escuta atualizações em tempo real do nó principal do Firebase
 */
export function escutarDadosBD(onData) {
  if (!db || !isFirebaseConfigured) return () => {}
  try {
    const dbRef = ref(db, DB_NODE)
    return onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          onData(snapshot.val(), true)
        } else {
          onData(null, false)
        }
      },
      (err) => {
        console.warn('⚠️ Erro na sincronização em tempo real do Firebase:', err)
      }
    )
  } catch (e) {
    console.warn('⚠️ Erro ao conectar listener do Firebase:', e)
    return () => {}
  }
}

/**
 * Carrega dados uma única vez do Firebase
 */
export async function carregarDadosBD() {
  if (!db || !isFirebaseConfigured) return null
  try {
    const dbRef = ref(db, DB_NODE)
    const snap = await get(dbRef)
    if (snap.exists()) return snap.val()
  } catch (e) {
    console.warn('⚠️ Erro ao carregar dados do Firebase:', e)
  }
  return null
}

export { app, db, isFirebaseConfigured, firebaseConfig }
