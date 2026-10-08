import React, { useState, useEffect, useMemo } from 'react'
import { Moon, Printer, Save, Calendar, Search, Trash2, Edit3, ChevronLeft, ChevronRight, Check, Sparkles } from 'lucide-react'
import CeiaPrintView from '../components/CeiaPrintView'
import { DIAS_SEMANA } from '../data/initialData'

const PADRAO_DIETA_LIQUIDA = 'CHÁ + GELATINA + SUCO CX + ÁGUA'

function formatDate(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function getDiaSemana(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr + 'T12:00:00')
  return DIAS_SEMANA[date.getDay() === 0 ? 6 : date.getDay() - 1]
}

function emptyCeia() {
  return {
    psiquiatria: '',
    dietaLivre: '',
    dietaDM: '',
    dietaBranda: '',
    dietaPastosaLiquida: '',
    dietaLiquida: PADRAO_DIETA_LIQUIDA,
  }
}

export default function CeiaPage({ store }) {
  const { state, salvarCeia, excluirCeia } = store
  const { cardapios = {}, ceias = {} } = state

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [activeTab, setActiveTab] = useState('editor') // 'editor' | 'historico'
  const [buscaHistorico, setBuscaHistorico] = useState('')
  const [saved, setSaved] = useState(false)
  const [printDate, setPrintDate] = useState(todayStr)

  // Consolida todas as ceias gravadas (seja em state.ceias ou dentro de state.cardapios[data].ceia)
  const todasCeias = useMemo(() => {
    const map = {}
    // 1. Carrega do nó cardapios
    Object.entries(cardapios || {}).forEach(([data, c]) => {
      if (c?.ceia && typeof c.ceia === 'object') {
        const temConteudo = Object.values(c.ceia).some(v => typeof v === 'string' && v.trim())
        if (temConteudo) map[data] = c.ceia
      }
    })
    // 2. Mescla com o nó dedicado de ceias
    Object.entries(ceias || {}).forEach(([data, ceiaItem]) => {
      if (ceiaItem && typeof ceiaItem === 'object') {
        const temConteudo = Object.values(ceiaItem).some(v => typeof v === 'string' && v.trim())
        if (temConteudo) map[data] = ceiaItem
      }
    })
    return map
  }, [cardapios, ceias])

  // Estado dos campos da Ceia do dia selecionado
  const [form, setForm] = useState(() => {
    const gravada = todasCeias[todayStr]
    return gravada ? { ...emptyCeia(), ...gravada } : emptyCeia()
  })

  // Ao trocar de data, carrega os dados gravados para aquele dia ou inicia o padrão
  useEffect(() => {
    const gravada = todasCeias[selectedDate]
    if (gravada) {
      setForm({
        ...emptyCeia(),
        ...gravada,
        // Mantém a pré-seleção da dieta líquida se estiver vazia
        dietaLiquida: gravada.dietaLiquida?.trim() ? gravada.dietaLiquida : PADRAO_DIETA_LIQUIDA,
      })
    } else {
      setForm(emptyCeia())
    }
    setSaved(false)
  }, [selectedDate, todasCeias])

  const handleFieldChange = (field) => (e) => {
    const val = e.target.value.toUpperCase()
    setForm(prev => ({ ...prev, [field]: val }))
  }

  const handleSalvar = () => {
    salvarCeia(selectedDate, form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleImprimir = (dataParaImprimir = selectedDate, dadosCeia = form) => {
    setPrintDate(dataParaImprimir)
    const cleanup = () => {
      document.body.classList.remove('print-ceia-only')
      window.removeEventListener('afterprint', cleanup)
    }
    window.addEventListener('afterprint', cleanup)
    document.body.classList.add('print-ceia-only')
    setTimeout(() => {
      window.print()
    }, 50)
  }

  const handleReplicarLivre = () => {
    if (!form.dietaLivre) return
    setForm(prev => ({
      ...prev,
      psiquiatria: prev.psiquiatria || prev.dietaLivre,
      dietaDM: prev.dietaDM || prev.dietaLivre,
    }))
  }

  const handleLimpar = () => {
    if (window.confirm('Limpar todos os campos da ceia deste dia?')) {
      setForm(emptyCeia())
    }
  }

  const handleExcluirGravada = (dataParaExcluir) => {
    if (window.confirm(`Deseja excluir a Ceia do dia ${formatDate(dataParaExcluir)} (${getDiaSemana(dataParaExcluir)})?`)) {
      if (excluirCeia) excluirCeia(dataParaExcluir)
      if (dataParaExcluir === selectedDate) {
        setForm(emptyCeia())
      }
    }
  }

  const handleNavegarData = (offset) => {
    const d = new Date(selectedDate + 'T12:00:00')
    d.setDate(d.getDate() + offset)
    setSelectedDate(d.toISOString().slice(0, 10))
  }

  // Lista para o Histórico, ordenada por data decrescente
  const listaHistorico = useMemo(() => {
    const entries = Object.entries(todasCeias)
    entries.sort((a, b) => b[0].localeCompare(a[0])) // mais recente primeiro
    if (!buscaHistorico.trim()) return entries

    const termo = buscaHistorico.toLowerCase()
    return entries.filter(([data, c]) => {
      const dataBr = formatDate(data)
      const diaSem = getDiaSemana(data).toLowerCase()
      const texto = Object.values(c).join(' ').toLowerCase()
      return data.includes(termo) || dataBr.includes(termo) || diaSem.includes(termo) || texto.includes(termo)
    })
  }, [todasCeias, buscaHistorico])

  const ceiaParaPrint = printDate === selectedDate ? form : (todasCeias[printDate] || emptyCeia())

  return (
    <div className="page">
      {/* ── Toolbar Superior ── */}
      <div className="page-toolbar no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '5px 8px' }}
              onClick={() => handleNavegarData(-1)}
              title="Dia anterior"
            >
              <ChevronLeft size={16} />
            </button>

            <input
              type="date"
              className="date-input"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              style={{ fontWeight: 700 }}
            />

            <button
              className="btn btn-secondary btn-sm"
              style={{ padding: '5px 8px' }}
              onClick={() => handleNavegarData(1)}
              title="Próximo dia"
            >
              <ChevronRight size={16} />
            </button>

            {selectedDate !== todayStr && (
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setSelectedDate(todayStr)}
                style={{ fontSize: '11px', padding: '4px 8px' }}
              >
                Hoje
              </button>
            )}
          </div>

          <div className="dia-semana-badge" style={{ fontSize: '12px', padding: '5px 12px', textTransform: 'uppercase' }}>
            {getDiaSemana(selectedDate)}
          </div>

          {todasCeias[selectedDate] && (
            <span className="badge-saved">✓ Ceia Gravada</span>
          )}
        </div>

        {/* Abas Editor / Histórico */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            type="button"
            className={`btn ${activeTab === 'editor' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => setActiveTab('editor')}
          >
            <Edit3 size={14} /> Editor da Ceia
          </button>
          <button
            type="button"
            className={`btn ${activeTab === 'historico' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: '12px', padding: '6px 12px' }}
            onClick={() => setActiveTab('historico')}
          >
            <Calendar size={14} /> Histórico ({Object.keys(todasCeias).length})
          </button>
        </div>
      </div>

      {/* ── ABA 1: EDITOR DA CEIA ── */}
      {activeTab === 'editor' && (
        <div className="ceia-editor-card no-print" style={{ marginTop: 8 }}>
          <div className="ceia-editor-header">
            <div className="ceia-editor-title-wrap">
              <h3 className="ceia-editor-title">
                <Moon size={20} style={{ color: '#4338ca' }} />
                CEIA — DATA: {getDiaSemana(selectedDate).toUpperCase()} : {formatDate(selectedDate)}
              </h3>
              <span className="ceia-editor-sub">
                Preencha os itens para cada dieta. Os dados são gravados e impressos de forma exclusiva nesta aba.
              </span>
            </div>

            <div className="ceia-editor-actions">
              {form.dietaLivre && (
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '11px', padding: '6px 10px' }}
                  onClick={handleReplicarLivre}
                  title="Copia o conteúdo da Dieta Livre para Psiquiatria e DM"
                >
                  <Sparkles size={13} style={{ marginRight: 4 }} />
                  Replicar Livre → Psiq/DM
                </button>
              )}
              <button
                type="button"
                className="btn btn-outline"
                style={{ fontSize: '11px', padding: '6px 10px' }}
                onClick={handleLimpar}
                title="Limpar campos da ceia deste dia"
              >
                Limpar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSalvar}
                style={{ background: '#4338ca', borderColor: '#3730a3' }}
              >
                <Save size={15} /> {saved ? '✓ Ceia Salva!' : 'Gravar Ceia'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => handleImprimir(selectedDate, form)}
                title="Imprimir folha A4 da Ceia sem quebras"
              >
                <Printer size={15} /> Imprimir Ceia
              </button>
            </div>
          </div>

          <div className="ceia-fields-grid" style={{ marginTop: 14 }}>
            <div className="ceia-field-row">
              <label className="ceia-field-label">PSIQUIATRIA:</label>
              <input
                type="text"
                className="ceia-field-input"
                value={form.psiquiatria || ''}
                onChange={handleFieldChange('psiquiatria')}
                placeholder="Ex: BOLO SEMI INTEGRAL DE MILHO + SUCO NATURAL DE LARANJA"
              />
            </div>

            <div className="ceia-field-row">
              <label className="ceia-field-label">DIETA LIVRE:</label>
              <input
                type="text"
                className="ceia-field-input"
                value={form.dietaLivre || ''}
                onChange={handleFieldChange('dietaLivre')}
                placeholder="Ex: BOLO SEMI INTEGRAL DE MILHO + SUCO NATURAL DE LARANJA"
              />
            </div>

            <div className="ceia-field-row">
              <label className="ceia-field-label">DIETA DM:</label>
              <input
                type="text"
                className="ceia-field-input"
                value={form.dietaDM || ''}
                onChange={handleFieldChange('dietaDM')}
                placeholder="Ex: BOLO SEMI INTEGRAL DE MILHO + SUCO NATURAL DE LARANJA"
              />
            </div>

            <div className="ceia-field-row">
              <label className="ceia-field-label">DIETA BRANDA:</label>
              <input
                type="text"
                className="ceia-field-input"
                value={form.dietaBranda || ''}
                onChange={handleFieldChange('dietaBranda')}
                placeholder="Ex: BISCOITO DOCE + SUCO DE CX"
              />
            </div>

            <div className="ceia-field-row">
              <label className="ceia-field-label">DIETA PASTOSA E LÍQUIDA PASTOSA:</label>
              <input
                type="text"
                className="ceia-field-input"
                value={form.dietaPastosaLiquida || ''}
                onChange={handleFieldChange('dietaPastosaLiquida')}
                placeholder="Ex: MINGAU DE AVEIA COM CANELA + SUCO NATURAL DE LARANJA"
              />
            </div>

            <div className="ceia-field-row">
              <label className="ceia-field-label" style={{ color: '#1e40af' }}>DIETA LÍQUIDA:</label>
              <input
                type="text"
                className="ceia-field-input"
                value={form.dietaLiquida || ''}
                onChange={handleFieldChange('dietaLiquida')}
                placeholder="Ex: CHÁ + GELATINA + SUCO CX + ÁGUA"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── ABA 2: HISTÓRICO DE CEIAS ── */}
      {activeTab === 'historico' && (
        <div className="ceia-editor-card no-print" style={{ marginTop: 8 }}>
          <div className="ceia-editor-header">
            <div>
              <h3 className="ceia-editor-title">
                <Calendar size={20} style={{ color: '#4338ca' }} />
                Histórico de Ceias Gravadas
              </h3>
              <span className="ceia-editor-sub">
                Consulte, visualize, edite ou imprima as ceias salvas no sistema.
              </span>
            </div>

            <div style={{ position: 'relative', width: 280 }}>
              <Search size={15} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="date-input"
                style={{ width: '100%', paddingLeft: 30, fontSize: '12px' }}
                placeholder="Buscar por data, dia ou item..."
                value={buscaHistorico}
                onChange={e => setBuscaHistorico(e.target.value)}
              />
            </div>
          </div>

          {listaHistorico.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: 8 }}>
              Nenhuma ceia gravada encontrada {buscaHistorico ? 'com o termo pesquisado' : 'ainda'}.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
                    <th style={{ padding: '10px 12px', width: 130 }}>Data</th>
                    <th style={{ padding: '10px 12px', width: 140 }}>Dia da Semana</th>
                    <th style={{ padding: '10px 12px' }}>Dieta Livre</th>
                    <th style={{ padding: '10px 12px' }}>Psiquiatria</th>
                    <th style={{ padding: '10px 12px' }}>Branda</th>
                    <th style={{ padding: '10px 12px', textAlign: 'center', width: 180 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {listaHistorico.map(([data, itemCeia], idx) => (
                    <tr
                      key={data}
                      style={{
                        background: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                        borderBottom: '1px solid #e2e8f0',
                      }}
                    >
                      <td style={{ padding: '8px 12px', fontWeight: 700, color: '#1e293b' }}>
                        {formatDate(data)}
                      </td>
                      <td style={{ padding: '8px 12px', fontWeight: 600, color: '#475569', textTransform: 'uppercase' }}>
                        {getDiaSemana(data)}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#334155' }}>
                        {itemCeia.dietaLivre || <span style={{ color: '#aaa' }}>—</span>}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#334155' }}>
                        {itemCeia.psiquiatria || <span style={{ color: '#aaa' }}>—</span>}
                      </td>
                      <td style={{ padding: '8px 12px', color: '#334155' }}>
                        {itemCeia.dietaBranda || <span style={{ color: '#aaa' }}>—</span>}
                      </td>
                      <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                            onClick={() => {
                              setSelectedDate(data)
                              setActiveTab('editor')
                            }}
                            title="Carregar no editor"
                          >
                            <Edit3 size={13} /> Editar
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                            onClick={() => handleImprimir(data, itemCeia)}
                            title="Imprimir folha A4"
                          >
                            <Printer size={13} /> Imprimir
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-danger-soft"
                            style={{ padding: '4px' }}
                            onClick={() => handleExcluirGravada(data)}
                            title="Excluir ceia deste dia"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Documento de Impressão Exclusivo (A4 sem quebras) ── */}
      <div className="print-only">
        <CeiaPrintView
          ceia={ceiaParaPrint}
          dataFormatada={formatDate(printDate)}
          diaSemana={getDiaSemana(printDate)}
        />
      </div>
    </div>
  )
}
