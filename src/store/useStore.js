import { useState, useEffect, useCallback } from 'react'
import {
  PROTEINAS_INICIAIS,
  LEGUMINOSAS_INICIAIS,
  GUARNICOES_INICIAIS,
  SALADAS_INICIAIS,
  INSUMOS_INICIAIS,
  FICHAS_TECNICAS_INICIAIS,
} from '../data/initialData'
import {
  salvarDocumentoFirestore,
  escutarDocumentoFirestore,
  isFirebaseConfigured,
} from '../services/firebase'

const STORAGE_KEY = 'hbm_cardapios_v1'

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Erro ao carregar dados:', e)
  }
  return null
}

function createInitialState() {
  return {
    proteinas: PROTEINAS_INICIAIS,
    leguminosas: LEGUMINOSAS_INICIAIS,
    guarnicoes: GUARNICOES_INICIAIS,
    saladas: SALADAS_INICIAIS,
    insumos: INSUMOS_INICIAIS,
    fichasTecnicas: FICHAS_TECNICAS_INICIAIS,
    cardapios: {}, // { 'YYYY-MM-DD': { diaSemana, almoco, jantar, observacoes } }
  }
}

export function useStore() {
  const [state, setState] = useState(() => {
    const saved = loadFromStorage()
    if (saved) {
      return {
        proteinas: saved.proteinas ?? PROTEINAS_INICIAIS,
        leguminosas: saved.leguminosas ?? LEGUMINOSAS_INICIAIS,
        guarnicoes: saved.guarnicoes ?? GUARNICOES_INICIAIS,
        saladas: saved.saladas ?? SALADAS_INICIAIS,
        insumos: saved.insumos ?? INSUMOS_INICIAIS,
        fichasTecnicas: saved.fichasTecnicas ?? FICHAS_TECNICAS_INICIAIS,
        cardapios: saved.cardapios ?? {},
      }
    }
    return createInitialState()
  })

  // Sincronização em tempo real com o Firestore (quando ativado no .env.local)
  useEffect(() => {
    if (!isFirebaseConfigured) return
    const unsubscribe = escutarDocumentoFirestore('hbm_dados', 'sistema', (remoto) => {
      if (remoto) {
        setState(prev => ({
          proteinas: remoto.proteinas ?? prev.proteinas,
          leguminosas: remoto.leguminosas ?? prev.leguminosas,
          guarnicoes: remoto.guarnicoes ?? prev.guarnicoes,
          saladas: remoto.saladas ?? prev.saladas,
          insumos: remoto.insumos ?? prev.insumos,
          fichasTecnicas: remoto.fichasTecnicas ?? prev.fichasTecnicas,
          cardapios: remoto.cardapios ?? prev.cardapios,
        }))
      }
    })
    return () => unsubscribe && unsubscribe()
  }, [])

  // Persistir no localStorage e no Firestore a cada alteração
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Erro ao salvar dados localmente:', e)
    }

    if (isFirebaseConfigured) {
      salvarDocumentoFirestore('hbm_dados', 'sistema', state)
    }
  }, [state])

  // ──── Cardápio actions ────

  const salvarCardapio = useCallback((data, cardapio) => {
    setState(prev => ({
      ...prev,
      cardapios: {
        ...prev.cardapios,
        [data]: cardapio,
      },
    }))
  }, [])

  const excluirCardapio = useCallback((data) => {
    setState(prev => {
      const { [data]: _, ...rest } = prev.cardapios
      return { ...prev, cardapios: rest }
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
    a.download = `hbm_cardapios_backup_${new Date().toISOString().slice(0, 10)}.json`
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
            proteinas: imported.proteinas ?? PROTEINAS_INICIAIS,
            leguminosas: imported.leguminosas ?? LEGUMINOSAS_INICIAIS,
            guarnicoes: imported.guarnicoes ?? GUARNICOES_INICIAIS,
            saladas: imported.saladas ?? SALADAS_INICIAIS,
            insumos: imported.insumos ?? INSUMOS_INICIAIS,
            fichasTecnicas: imported.fichasTecnicas ?? FICHAS_TECNICAS_INICIAIS,
            cardapios: imported.cardapios ?? {},
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
  }
}

