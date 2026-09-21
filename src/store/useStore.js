import { useState, useEffect, useCallback, useRef } from 'react'
import {
  PROTEINAS_INICIAIS,
  LEGUMINOSAS_INICIAIS,
  GUARNICOES_INICIAIS,
  SALADAS_INICIAIS,
  INSUMOS_INICIAIS,
  FICHAS_TECNICAS_INICIAIS,
} from '../data/initialData'
import {
  salvarDadosBD,
  escutarDadosBD,
  isFirebaseConfigured,
} from '../services/firebase'
import { limparDuplicidadeMolho } from '../utils/formatUtils'

const STORAGE_KEY = 'hbm_cardapios_v1'
const BACKUP_KEY = 'hbm_cardapios_backup_v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') return parsed
    }
  } catch (e) {
    console.warn('Erro ao carregar dados principais:', e)
  }

  // Se o dado principal não estiver presente ou falhar, tenta restaurar o backup automático
  try {
    const backupRaw = localStorage.getItem(BACKUP_KEY)
    if (backupRaw) {
      const parsedBackup = JSON.parse(backupRaw)
      if (parsedBackup && typeof parsedBackup === 'object') {
        console.info('🛡️ Restaurando dados a partir do backup automático local.')
        return parsedBackup
      }
    }
  } catch (e) {
    console.warn('Erro ao carregar backup:', e)
  }

  return null
}

const PADRAO_LIQUIDA_PROTEINA = 'CARNE COM CALDO/MOLHO LIQUIDIFICADA'

const mapIniciais = new Map(PROTEINAS_INICIAIS.map(item => [item.id, item]))

function normalizarProteinas(prots = []) {
  if (!Array.isArray(prots)) return []
  return prots
    .filter(p => p && typeof p === 'object')
    .map(p => {
      let sufixoPastosa = p.sufixoPastosa || ''
      const baseUpper = (p.nomeAbrev || p.nome || '').toUpperCase()
      const sufUpper = (sufixoPastosa || '').toUpperCase().trim()
      if (sufUpper.includes('MOLHO') && (baseUpper.includes('MOLHO') || baseUpper.includes('SUGO'))) {
        sufixoPastosa = ''
      }
      const inicial = mapIniciais.get(p.id)
      return {
        ...p,
        sufixoPastosa,
        nomeBranda: p.nomeBranda || inicial?.nomeBranda || p.nomeAbrev || p.nome || '',
        nomePastosa: p.nomePastosa ? limparDuplicidadeMolho(p.nomePastosa) : (inicial?.nomePastosa ? limparDuplicidadeMolho(inicial.nomePastosa) : p.nomePastosa),
        nomeLiquida: p.nomeLiquida !== undefined && p.nomeLiquida !== '' ? p.nomeLiquida : PADRAO_LIQUIDA_PROTEINA,
      }
    })
}

function normalizarCardapios(cardapios = {}) {
  const res = {}
  for (const [data, c] of Object.entries(cardapios)) {
    if (!c) continue
    const novoC = { ...c }
    for (const refKey of ['almoco', 'jantar']) {
      if (novoC[refKey]) {
        const ref = { ...novoC[refKey] }
        if (ref.proteinaPastosaManual) {
          ref.proteinaPastosaManual = limparDuplicidadeMolho(ref.proteinaPastosaManual)
        }
        novoC[refKey] = ref
      }
    }
    res[data] = novoC
  }
  return res
}

function createInitialState() {
  return {
    proteinas: normalizarProteinas(PROTEINAS_INICIAIS),
    leguminosas: LEGUMINOSAS_INICIAIS,
    guarnicoes: GUARNICOES_INICIAIS,
    saladas: SALADAS_INICIAIS,
    insumos: INSUMOS_INICIAIS,
    fichasTecnicas: FICHAS_TECNICAS_INICIAIS,
    cardapios: {}, // { 'YYYY-MM-DD': { diaSemana, almoco, jantar, observacoes } }
    rascunhosCardapio: {}, // { 'YYYY-MM-DD': { diaSemana, almoco, jantar, observacoes } }
  }
}

export function useStore() {
  const [dbStatus, setDbStatus] = useState('conectando') // 'conectado' | 'salvando' | 'offline'
  const isInitialLoadRef = useRef(true)
  const isRemoteUpdateRef = useRef(false)

  const [state, setState] = useState(() => {
    const saved = loadFromStorage()
    if (saved) {
      return {
        proteinas: normalizarProteinas(saved.proteinas ?? PROTEINAS_INICIAIS),
        leguminosas: saved.leguminosas ?? LEGUMINOSAS_INICIAIS,
        guarnicoes: saved.guarnicoes ?? GUARNICOES_INICIAIS,
        saladas: saved.saladas ?? SALADAS_INICIAIS,
        insumos: saved.insumos ?? INSUMOS_INICIAIS,
        fichasTecnicas: saved.fichasTecnicas ?? FICHAS_TECNICAS_INICIAIS,
        cardapios: normalizarCardapios(saved.cardapios ?? {}),
        rascunhosCardapio: normalizarCardapios(saved.rascunhosCardapio ?? {}),
      }
    }
    return createInitialState()
  })

  // Sincronização em tempo real com o Firebase Realtime Database
  useEffect(() => {
    if (!isFirebaseConfigured) {
      setDbStatus('offline')
      return
    }

    const unsubscribe = escutarDadosBD((remoto, exists) => {
      if (exists && remoto) {
        isRemoteUpdateRef.current = true
        setState(prev => ({
          proteinas: normalizarProteinas(remoto.proteinas ?? prev.proteinas),
          leguminosas: remoto.leguminosas ?? prev.leguminosas,
          guarnicoes: remoto.guarnicoes ?? prev.guarnicoes,
          saladas: remoto.saladas ?? prev.saladas,
          insumos: remoto.insumos ?? prev.insumos,
          fichasTecnicas: remoto.fichasTecnicas ?? prev.fichasTecnicas,
          cardapios: normalizarCardapios(remoto.cardapios ?? prev.cardapios),
          rascunhosCardapio: normalizarCardapios(prev.rascunhosCardapio), // rascunhos locais preservados
        }))
        setDbStatus('conectado')
      } else if (!exists && isInitialLoadRef.current) {
        // Se o nó ainda não existe no Firebase, envia o estado inicial/local
        salvarDadosBD(state).then(ok => {
          if (ok) setDbStatus('conectado')
        })
      }
      isInitialLoadRef.current = false
    })

    return () => unsubscribe && unsubscribe()
  }, [])

  // Persistir no localStorage e no Firebase Realtime Database a cada alteração
  useEffect(() => {
    try {
      const currentRaw = localStorage.getItem(STORAGE_KEY)
      if (currentRaw) {
        localStorage.setItem(BACKUP_KEY, currentRaw)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Erro ao salvar dados localmente:', e)
    }

    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false
      return
    }

    if (isFirebaseConfigured && !isInitialLoadRef.current) {
      setDbStatus('salvando')
      const timer = setTimeout(() => {
        salvarDadosBD(state).then(ok => {
          if (ok) setDbStatus('conectado')
        })
      }, 350)
      return () => clearTimeout(timer)
    }
  }, [state])

  // ──── Cardápio actions ────

  const salvarCardapio = useCallback((data, cardapio) => {
    setState(prev => {
      const { [data]: _, ...restRascunhos } = prev.rascunhosCardapio || {}
      return {
        ...prev,
        cardapios: {
          ...prev.cardapios,
          [data]: cardapio,
        },
        rascunhosCardapio: restRascunhos, // ao salvar definitivamente, limpa o rascunho
      }
    })
  }, [])

  const salvarRascunhoCardapio = useCallback((data, cardapio) => {
    setState(prev => ({
      ...prev,
      rascunhosCardapio: {
        ...(prev.rascunhosCardapio || {}),
        [data]: cardapio,
      },
    }))
  }, [])

  const excluirCardapio = useCallback((data) => {
    setState(prev => {
      const { [data]: _, ...rest } = prev.cardapios
      const { [data]: _r, ...restRascunhos } = prev.rascunhosCardapio || {}
      return { ...prev, cardapios: rest, rascunhosCardapio: restRascunhos }
    })
  }, [])

  // ──── Proteínas actions ────

  const adicionarProteina = useCallback((proteina) => {
    setState(prev => ({
      ...prev,
      proteinas: [...prev.proteinas, { id: `custom_p_${Date.now()}`, ...proteina }],
    }))
  }, [])

  const editarProteina = useCallback((id, dados) => {
    setState(prev => ({
      ...prev,
      proteinas: prev.proteinas.map(p => p.id === id ? { ...p, ...dados } : p),
    }))
  }, [])

  const excluirProteina = useCallback((id) => {
    setState(prev => ({
      ...prev,
      proteinas: prev.proteinas.filter(p => p.id !== id),
    }))
  }, [])

  // ──── Leguminosas actions ────

  const adicionarLeguminosa = useCallback((leg) => {
    setState(prev => ({
      ...prev,
      leguminosas: [...prev.leguminosas, { id: `custom_l_${Date.now()}`, ...leg }],
    }))
  }, [])

  const editarLeguminosa = useCallback((id, dados) => {
    setState(prev => ({
      ...prev,
      leguminosas: prev.leguminosas.map(l => l.id === id ? { ...l, ...dados } : l),
    }))
  }, [])

  const excluirLeguminosa = useCallback((id) => {
    setState(prev => ({
      ...prev,
      leguminosas: prev.leguminosas.filter(l => l.id !== id),
    }))
  }, [])

  // ──── Guarnições actions ────

  const adicionarGuarnicao = useCallback((g) => {
    setState(prev => ({
      ...prev,
      guarnicoes: [...prev.guarnicoes, { id: `custom_g_${Date.now()}`, ...g }],
    }))
  }, [])

  const editarGuarnicao = useCallback((id, dados) => {
    setState(prev => ({
      ...prev,
      guarnicoes: prev.guarnicoes.map(g => g.id === id ? { ...g, ...dados } : g),
    }))
  }, [])

  const excluirGuarnicao = useCallback((id) => {
    setState(prev => ({
      ...prev,
      guarnicoes: prev.guarnicoes.filter(g => g.id !== id),
    }))
  }, [])

  // ──── Saladas actions ────

  const adicionarSalada = useCallback((s) => {
    setState(prev => ({
      ...prev,
      saladas: [...(prev.saladas || []), { id: `custom_s_${Date.now()}`, ...s }],
    }))
  }, [])

  const editarSalada = useCallback((id, dados) => {
    setState(prev => ({
      ...prev,
      saladas: (prev.saladas || []).map(s => s.id === id ? { ...s, ...dados } : s),
    }))
  }, [])

  const excluirSalada = useCallback((id) => {
    setState(prev => ({
      ...prev,
      saladas: (prev.saladas || []).filter(s => s.id !== id),
    }))
  }, [])

  // ──── Insumos (Valores) actions ────

  const adicionarInsumo = useCallback((insumo) => {
    setState(prev => ({
      ...prev,
      insumos: [...(prev.insumos || []), { id: `custom_ins_${Date.now()}`, ...insumo }],
    }))
  }, [])

  const editarInsumo = useCallback((id, dados) => {
    setState(prev => ({
      ...prev,
      insumos: (prev.insumos || []).map(item => item.id === id ? { ...item, ...dados } : item),
    }))
  }, [])

  const excluirInsumo = useCallback((id) => {
    setState(prev => ({
      ...prev,
      insumos: (prev.insumos || []).filter(item => item.id !== id),
    }))
  }, [])

  // ──── Fichas Técnicas actions ────

  const salvarFichaTecnica = useCallback((ficha) => {
    setState(prev => {
      const lista = prev.fichasTecnicas || []
      const existe = lista.some(f => f.id === ficha.id)
      const novoItem = {
        ...ficha,
        id: ficha.id || `custom_ft_${Date.now()}`,
      }
      return {
        ...prev,
        fichasTecnicas: existe
          ? lista.map(f => f.id === ficha.id ? novoItem : f)
          : [...lista, novoItem],
      }
    })
  }, [])

  const excluirFichaTecnica = useCallback((id) => {
    setState(prev => ({
      ...prev,
      fichasTecnicas: (prev.fichasTecnicas || []).filter(f => f.id !== id),
    }))
  }, [])

  // ──── Export / Import ────

  const exportarDados = useCallback(() => {
    const json = JSON.stringify(state, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cardapio_hbm_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [state])

  const importarDados = useCallback((file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          setState({
            proteinas: normalizarProteinas(imported.proteinas ?? PROTEINAS_INICIAIS),
            leguminosas: imported.leguminosas ?? LEGUMINOSAS_INICIAIS,
            guarnicoes: imported.guarnicoes ?? GUARNICOES_INICIAIS,
            saladas: imported.saladas ?? SALADAS_INICIAIS,
            insumos: imported.insumos ?? INSUMOS_INICIAIS,
            fichasTecnicas: imported.fichasTecnicas ?? FICHAS_TECNICAS_INICIAIS,
            cardapios: normalizarCardapios(imported.cardapios ?? {}),
            rascunhosCardapio: normalizarCardapios(imported.rascunhosCardapio ?? {}),
          })
          resolve()
        } catch (err) {
          reject(new Error('Arquivo inválido'))
        }
      }
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    })
  }, [])

  const resetarDados = useCallback(() => {
    setState(createInitialState())
  }, [])

  return {
    state,
    // Cardápios
    salvarCardapio,
    salvarRascunhoCardapio,
    excluirCardapio,
    // Proteínas
    adicionarProteina,
    editarProteina,
    excluirProteina,
    // Leguminosas
    adicionarLeguminosa,
    editarLeguminosa,
    excluirLeguminosa,
    // Guarnições
    adicionarGuarnicao,
    editarGuarnicao,
    excluirGuarnicao,
    // Saladas
    adicionarSalada,
    editarSalada,
    excluirSalada,
    // Insumos (Valores)
    adicionarInsumo,
    editarInsumo,
    excluirInsumo,
    // Fichas Técnicas
    salvarFichaTecnica,
    excluirFichaTecnica,
    // Backup
    exportarDados,
    importarDados,
    resetarDados,
    // Status do Banco de Dados
    dbStatus,
  }
}

