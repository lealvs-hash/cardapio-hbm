import React, { useState } from 'react'
import {
  Calendar, ChevronLeft, ChevronRight, Eye, Trash2, Printer, Plus,
  AlertTriangle, CheckCircle2, RotateCcw, Edit3, UtensilsCrossed,
  TrendingUp, Sparkles, Filter
} from 'lucide-react'
import PrintView from '../components/PrintView'
import {
  getMondayOfWeek,
  getDaysOfWeek,
  formatDateBR,
  formatDateShort,
  parseLocalDate,
  formatISODate,
  getWeekNumber,
  verificarRepeticaoPrato,
  calcularEquilibrioSemanal,
  getInfoSemanaMes,
  DIAS_SEMANA_COMPLETO,
  DIAS_SEMANA_SIGLA
} from '../utils/repetitionUtils'

export default function Historico({ store, onNavigateToDate, onOpenFicha }) {
  const { state, excluirCardapio } = store
  const { cardapios = {}, proteinas = [], guarnicoes = [], fichasTecnicas = [] } = state

  const todayISO = new Date().toISOString().slice(0, 10)
  const currentMonday = getMondayOfWeek(todayISO)

  // Estado da semana visualizada (inicia na semana atual)
  const [activeMonday, setActiveMonday] = useState(currentMonday)
  const [viewingDate, setViewingDate] = useState(null)
  const [filtroAlerta, setFiltroAlerta] = useState('TODOS') // 'TODOS' | 'REPETIDOS'

  // Informações detalhadas do mês e das 4 semanas do mês
  const infoMes = getInfoSemanaMes(activeMonday)

  // Dias da semana ativa (7 dias: Segunda a Domingo)
  const diasDaSemana = getDaysOfWeek(activeMonday)
  const domingoStr = diasDaSemana[6]
  const semanaNum = getWeekNumber(activeMonday)
  const anoStr = activeMonday.slice(0, 4)

  // Navegação de Semanas
  const handleSemanaAnterior = () => {
    const d = parseLocalDate(activeMonday)
    d.setDate(d.getDate() - 7)
    setActiveMonday(formatISODate(d))
  }

  const handleProximaSemana = () => {
    const d = parseLocalDate(activeMonday)
    d.setDate(d.getDate() + 7)
    setActiveMonday(formatISODate(d))
  }

  const handleIrParaHoje = () => {
    setActiveMonday(currentMonday)
  }

  // Helpers de custo e prato
  const getProteina = (id) => proteinas.find(p => p.id === id)
  const getGuarnicao = (id) => guarnicoes.find(g => g.id === id)

  const getFichaCusto = (pratoId, pratoNome) => {
    const ficha = fichasTecnicas.find(f =>
      (pratoId && f.pratoId === pratoId) ||
      (f.nomePreparacao && pratoNome && f.nomePreparacao.trim().toUpperCase() === pratoNome.trim().toUpperCase())
    )
    if (!ficha) return null
    const total = (ficha.insumos || []).reduce((acc, ins) => {
      const pb = Number(ins.pesoBruto) || 0
      const vu = Number(ins.valorUnitario) || 0
      return acc + (pb * vu)
    }, 0)
    const rend = Number(ficha.rendimentoPorcoes) || 1
    return rend > 0 ? (total / rend) : 0
  }

  // Equilíbrio semanal de cortes
  const equilibrio = calcularEquilibrioSemanal(cardapios, diasDaSemana, proteinas)

  // Identificar todas as repetições na semana ativa
  const repeticoesNaSemana = []
  diasDaSemana.forEach(d => {
    const c = cardapios[d]
    if (!c) return
    const meals = [
      { tipo: 'Almoço', meal: c.almoco },
      { tipo: 'Jantar', meal: c.jantar },
    ]
    meals.forEach(({ tipo, meal }) => {
      if (meal?.proteinaId || meal?.proteinaAbrev) {
        const check = verificarRepeticaoPrato(meal.proteinaId, meal.proteinaAbrev, d, cardapios)
        if (check.nivelAlerta === 'repetido' || check.nivelAlerta === 'atencao') {
          const p = getProteina(meal.proteinaId)
          repeticoesNaSemana.push({
            data: d,
            diaSemana: c.diaSemana,
            refeicao: tipo,
            pratoNome: meal.proteinaAbrev || p?.nomeAbrev || p?.nome || 'Proteína',
            ...check,
          })
        }
      }
    })
  })

  // Se o usuário estiver no modo de visualização / impressão de um dia
  if (viewingDate) {
    const c = cardapios[viewingDate]
    return (
      <div className="page">
        <div className="page-toolbar no-print">
          <button className="btn btn-secondary" onClick={() => setViewingDate(null)}>
            ← Voltar à Tabela Semanal
          </button>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={16} /> Imprimir A4
          </button>
        </div>
        <div className="no-print preview-section">
          <h4>Cardápio — {c?.diaSemana} {formatDateBR(viewingDate)}</h4>
        </div>
        <div className="print-only">
          {c && (
            <PrintView
              cardapio={c}
              proteinas={proteinas}
              leguminosas={state.leguminosas}
              dataFormatada={formatDateBR(viewingDate)}
              diaSemana={c.diaSemana}
            />
          )}
        </div>
        <div className="no-print preview-wrapper">
          {c && (
            <PrintView
              cardapio={c}
              proteinas={proteinas}
              leguminosas={state.leguminosas}
              dataFormatada={formatDateBR(viewingDate)}
              diaSemana={c.diaSemana}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="page no-print">
      {/* ── Cabeçalho da Página ── */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2><Calendar size={22} style={{ verticalAlign: 'middle', marginRight: 6, color: '#1565c0' }} />Histórico Semanal & Controle de Rotatividade</h2>
          <p className="page-sub">
            Visualize o ciclo de 7 dias de cada semana, acompanhe a variedade de carnes e monitore o intervalo entre pratos repetidos.
          </p>
        </div>

        {/* ── Navegador de Semanas ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fff', padding: '4px 8px', borderRadius: 8, border: '1px solid #ddd', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
          <button className="btn-icon" onClick={handleSemanaAnterior} title="Semana Anterior">
            <ChevronLeft size={18} />
          </button>

          <div style={{ padding: '0 8px', textAlign: 'center' }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#1565c0' }}>
              Semana {semanaNum} ({anoStr})
            </div>
            <div style={{ fontSize: '11px', color: '#555', fontWeight: 600 }}>
              {formatDateShort(activeMonday)} a {formatDateShort(domingoStr)}/{anoStr}
            </div>
          </div>

          <button className="btn-icon" onClick={handleProximaSemana} title="Próxima Semana">
            <ChevronRight size={18} />
          </button>

          <button
            className="btn btn-xs btn-secondary"
            style={{ marginLeft: 4, padding: '4px 8px', fontSize: '11px' }}
            onClick={handleIrParaHoje}
            title="Ir para a semana atual"
          >
            Esta Semana
          </button>
        </div>
      </div>

      {/* ── Seletor do Mês e das 4 Semanas do Ciclo ── */}
      <div style={{
        background: '#fff',
        border: '1px solid #dcdcdc',
        borderRadius: 8,
        padding: '10px 14px',
        margin: '12px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            className="btn-icon"
            title="Mês Anterior"
            onClick={() => {
              const d = parseLocalDate(activeMonday)
              d.setMonth(d.getMonth() - 1)
              setActiveMonday(getMondayOfWeek(formatISODate(d)))
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '13px', fontWeight: 800, color: '#1565c0', minWidth: 150, textAlign: 'center' }}>
            🗓️ {infoMes.mesNome} de {infoMes.ano}
          </span>
          <button
            className="btn-icon"
            title="Próximo Mês"
            onClick={() => {
              const d = parseLocalDate(activeMonday)
              d.setMonth(d.getMonth() + 1)
              setActiveMonday(getMondayOfWeek(formatISODate(d)))
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Abas das Semanas do Mês (Semana 1, Semana 2, Semana 3, Semana 4, etc.) */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#666', fontWeight: 700, marginRight: 2 }}>
            Semanas do Mês:
          </span>
          {infoMes.semanasDoMes.map(sem => {
            const ativa = sem.segundaStr === activeMonday
            return (
              <button
                key={sem.segundaStr}
                className={`btn btn-sm ${ativa ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  fontSize: '11px',
                  padding: '4px 10px',
                  fontWeight: ativa ? 800 : 600,
                  borderRadius: 6,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
                onClick={() => setActiveMonday(sem.segundaStr)}
              >
                <span>{sem.label}</span>
                {sem.segundaStr <= todayISO && todayISO <= sem.domingoStr && (
                  <span style={{ background: ativa ? '#fff' : '#1976d2', color: ativa ? '#1976d2' : '#fff', fontSize: '8px', padding: '1px 3px', borderRadius: 3, fontWeight: 900 }}>HOJE</span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Painel de Equilíbrio Nutricional de Carnes da Semana ── */}
      <div style={{
        background: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: 8,
        padding: '12px 16px',
        margin: '14px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <TrendingUp size={18} style={{ color: '#2e7d32' }} />
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#333', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Distribuição de Cortes na Semana:
            </span>
            <span style={{ fontSize: '11px', color: '#777', marginLeft: 6 }}>
              ({equilibrio.totalProteinasServidas} refeições com carne registradas)
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: '#fbe9e7', color: '#d84315', border: '1px solid #ffccbc', padding: '4px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700 }}>
            🥩 Bovina: {equilibrio.grupos.Bovina}x
          </span>
          <span className="badge" style={{ background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082', padding: '4px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700 }}>
            🍗 Frango / Aves: {equilibrio.grupos.Frango}x
          </span>
          <span className="badge" style={{ background: '#f3e5f5', color: '#6a1b9a', border: '1px solid #e1bee7', padding: '4px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700 }}>
            🐖 Suíno: {equilibrio.grupos.Suíno}x
          </span>
          <span className="badge" style={{ background: '#e0f7fa', color: '#00838f', border: '1px solid #b2ebf2', padding: '4px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700 }}>
            🐟 Peixe: {equilibrio.grupos.Peixe}x
          </span>
          {equilibrio.grupos.Mistos > 0 && (
            <span className="badge" style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', padding: '4px 8px', borderRadius: 6, fontSize: '11px', fontWeight: 700 }}>
              🥣 Base / Ovos: {equilibrio.grupos.Mistos}x
            </span>
          )}
        </div>
      </div>

      {/* ── Alerta de Repetição se houver ── */}
      {repeticoesNaSemana.length > 0 && (
        <div style={{
          background: '#fff3e0',
          borderLeft: '4px solid #ff9800',
          padding: '10px 14px',
          borderRadius: 6,
          marginBottom: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={18} style={{ color: '#e65100' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#e65100' }}>
              Atenção: {repeticoesNaSemana.length} prato(s) servido(s) com intervalo curto nesta semana!
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#666' }}>
            {repeticoesNaSemana.map((r, i) => (
              <span key={i} style={{ marginRight: 10 }}>
                • <strong>{r.pratoNome}</strong> ({r.diaSemana}, {r.refeicao}: {r.diasAtras}d atrás)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── TABELA PANORÂMICA SEMANAL (7 DIAS: SEGUNDA A DOMINGO) ── */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        overflowX: 'auto',
        marginBottom: 24
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          tableLayout: 'fixed',
          minWidth: 980,
          fontSize: '12px'
        }}>
          <thead>
            <tr>
              <th style={{
                width: '90px',
                background: '#f5f5f5',
                borderRight: '2px solid #e0e0e0',
                borderBottom: '2px solid #e0e0e0',
                padding: '10px 8px',
                textAlign: 'center',
                fontWeight: 800,
                color: '#555',
                fontSize: '11px'
              }}>
                REFEIÇÃO
              </th>
              {diasDaSemana.map((dStr, idx) => {
                const cardapioDia = cardapios[dStr]
                const ehHoje = dStr === todayISO
                return (
                  <th
                    key={dStr}
                    style={{
                      background: ehHoje ? '#e3f2fd' : '#fafafa',
                      borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none',
                      borderBottom: '2px solid #e0e0e0',
                      padding: '8px 6px',
                      textAlign: 'center',
                      verticalAlign: 'top',
                    }}
                  >
                    <div style={{
                      fontWeight: 800,
                      color: ehHoje ? '#0d47a1' : '#333',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {DIAS_SEMANA_SIGLA[idx]}
                      {ehHoje && <span style={{ fontSize: '9px', marginLeft: 4, background: '#1976d2', color: '#fff', padding: '1px 4px', borderRadius: 3 }}>HOJE</span>}
                    </div>
                    <div style={{ fontSize: '11px', color: ehHoje ? '#1565c0' : '#666', fontWeight: 600, marginTop: 2 }}>
                      {formatDateShort(dStr)}
                    </div>

                    {/* Ações rápidas no cabeçalho do dia */}
                    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 6 }}>
                      {cardapioDia ? (
                        <>
                          <button
                            className="btn-icon"
                            style={{ padding: 2, color: '#1565c0' }}
                            title={`Visualizar / Imprimir ${formatDateBR(dStr)}`}
                            onClick={() => setViewingDate(dStr)}
                          >
                            <Eye size={13} />
                          </button>
                          {onNavigateToDate && (
                            <button
                              className="btn-icon"
                              style={{ padding: 2, color: '#2e7d32' }}
                              title={`Editar no Cardápio`}
                              onClick={() => onNavigateToDate(dStr)}
                            >
                              <Edit3 size={13} />
                            </button>
                          )}
                          <button
                            className="btn-icon btn-danger-soft"
                            style={{ padding: 2 }}
                            title="Excluir cardápio deste dia"
                            onClick={() => {
                              if (window.confirm(`Excluir o cardápio de ${formatDateBR(dStr)}?`)) {
                                excluirCardapio(dStr)
                              }
                            }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      ) : (
                        onNavigateToDate && (
                          <button
                            className="btn btn-xs btn-outline"
                            style={{ fontSize: '10px', padding: '2px 6px', borderColor: '#90caf9', color: '#1565c0' }}
                            onClick={() => onNavigateToDate(dStr)}
                            title="Montar cardápio para este dia"
                          >
                            <Plus size={10} /> Planejar
                          </button>
                        )
                      )}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {/* ── LINHA 1: ALMOÇO ── */}
            <tr style={{ borderBottom: '1px solid #e0e0e0' }}>
              <td style={{
                background: '#f8f9fa',
                borderRight: '2px solid #e0e0e0',
                padding: '12px 6px',
                textAlign: 'center',
                fontWeight: 800,
                color: '#1b5e20',
                fontSize: '11px',
                letterSpacing: 0.5
              }}>
                <UtensilsCrossed size={14} style={{ display: 'block', margin: '0 auto 4px', color: '#2e7d32' }} />
                ALMOÇO
              </td>
              {diasDaSemana.map((dStr, idx) => {
                const cardapio = cardapios[dStr]
                const meal = cardapio?.almoco
                if (!meal || (!meal.proteinaId && !meal.guarnicaoId)) {
                  return (
                    <td key={dStr} style={{
                      borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none',
                      padding: 10,
                      textAlign: 'center',
                      color: '#bbb',
                      background: '#fdfdfd',
                      fontSize: '11px'
                    }}>
                      —
                    </td>
                  )
                }

                const prot = getProteina(meal.proteinaId)
                const guard = getGuarnicao(meal.guarnicaoId)
                const checkProt = verificarRepeticaoPrato(meal.proteinaId, meal.proteinaAbrev, dStr, cardapios)
                const custoProt = getFichaCusto(meal.proteinaId, meal.proteinaAbrev || prot?.nomeAbrev)

                return (
                  <td key={dStr} style={{
                    borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none',
                    padding: '10px 8px',
                    verticalAlign: 'top',
                    background: checkProt.nivelAlerta === 'repetido' ? '#fff8f6' : '#fff'
                  }}>
                    {/* Proteína */}
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: '10px', color: '#777', fontWeight: 700, textTransform: 'uppercase' }}>
                        Carne / Proteína:
                      </div>
                      <div style={{ fontWeight: 700, color: '#0d47a1', fontSize: '11px', lineHeight: 1.2 }}>
                        {meal.proteinaAbrev || prot?.nomeAbrev || prot?.nome || '—'}
                      </div>

                      {/* Alerta de Repetição */}
                      {checkProt.servidoAntes && (
                        <div style={{ marginTop: 3 }}>
                          {checkProt.nivelAlerta === 'repetido' ? (
                            <span style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '9px', fontWeight: 800, padding: '1px 4px', borderRadius: 3 }}>
                              🚨 Servido há {checkProt.diasAtras}d
                            </span>
                          ) : checkProt.nivelAlerta === 'atencao' ? (
                            <span style={{ background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082', fontSize: '9px', fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>
                              ⚠️ Há {checkProt.diasAtras}d
                            </span>
                          ) : (
                            <span style={{ color: '#2e7d32', fontSize: '9px', fontWeight: 600 }}>
                              ✓ Há {checkProt.diasAtras}d
                            </span>
                          )}
                        </div>
                      )}

                      {/* Custo da Ficha */}
                      {custoProt !== null && onOpenFicha && (
                        <button
                          type="button"
                          className="btn btn-xs"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            marginTop: 4,
                            padding: '1px 5px',
                            background: '#e8f5e9',
                            color: '#1b5e20',
                            border: '1px solid #a5d6a7',
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: 3,
                            cursor: 'pointer'
                          }}
                          onClick={() => onOpenFicha(prot || { id: meal.proteinaId, nomeAbrev: meal.proteinaAbrev })}
                          title="Ver Ficha Técnica"
                        >
                          R$ {custoProt.toFixed(2).replace('.', ',')}
                        </button>
                      )}
                    </div>

                    {/* Guarnição */}
                    {(meal.guarnicaoAbrev || guard) && (
                      <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 4 }}>
                        <div style={{ fontSize: '10px', color: '#777', fontWeight: 700, textTransform: 'uppercase' }}>
                          Guarnição:
                        </div>
                        <div style={{ fontSize: '11px', color: '#333', fontWeight: 600, lineHeight: 1.2 }}>
                          {meal.guarnicaoAbrev || guard?.nomeAbrev || guard?.nome}
                        </div>
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* ── LINHA 2: JANTAR ── */}
            <tr>
              <td style={{
                background: '#f8f9fa',
                borderRight: '2px solid #e0e0e0',
                padding: '12px 6px',
                textAlign: 'center',
                fontWeight: 800,
                color: '#e65100',
                fontSize: '11px',
                letterSpacing: 0.5
              }}>
                <UtensilsCrossed size={14} style={{ display: 'block', margin: '0 auto 4px', color: '#f57c00' }} />
                JANTAR
              </td>
              {diasDaSemana.map((dStr, idx) => {
                const cardapio = cardapios[dStr]
                const meal = cardapio?.jantar
                if (!meal || (!meal.proteinaId && !meal.guarnicaoId)) {
                  return (
                    <td key={dStr} style={{
                      borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none',
                      padding: 10,
                      textAlign: 'center',
                      color: '#bbb',
                      background: '#fdfdfd',
                      fontSize: '11px'
                    }}>
                      —
                    </td>
                  )
                }

                const prot = getProteina(meal.proteinaId)
                const guard = getGuarnicao(meal.guarnicaoId)
                const checkProt = verificarRepeticaoPrato(meal.proteinaId, meal.proteinaAbrev, dStr, cardapios)
                const custoProt = getFichaCusto(meal.proteinaId, meal.proteinaAbrev || prot?.nomeAbrev)

                return (
                  <td key={dStr} style={{
                    borderRight: idx < 6 ? '1px solid #e0e0e0' : 'none',
                    padding: '10px 8px',
                    verticalAlign: 'top',
                    background: checkProt.nivelAlerta === 'repetido' ? '#fff8f6' : '#fff'
                  }}>
                    {/* Proteína */}
                    <div style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: '10px', color: '#777', fontWeight: 700, textTransform: 'uppercase' }}>
                        Carne / Proteína:
                      </div>
                      <div style={{ fontWeight: 700, color: '#e65100', fontSize: '11px', lineHeight: 1.2 }}>
                        {meal.proteinaAbrev || prot?.nomeAbrev || prot?.nome || '—'}
                      </div>

                      {/* Alerta de Repetição */}
                      {checkProt.servidoAntes && (
                        <div style={{ marginTop: 3 }}>
                          {checkProt.nivelAlerta === 'repetido' ? (
                            <span style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '9px', fontWeight: 800, padding: '1px 4px', borderRadius: 3 }}>
                              🚨 Servido há {checkProt.diasAtras}d
                            </span>
                          ) : checkProt.nivelAlerta === 'atencao' ? (
                            <span style={{ background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082', fontSize: '9px', fontWeight: 700, padding: '1px 4px', borderRadius: 3 }}>
                              ⚠️ Há {checkProt.diasAtras}d
                            </span>
                          ) : (
                            <span style={{ color: '#2e7d32', fontSize: '9px', fontWeight: 600 }}>
                              ✓ Há {checkProt.diasAtras}d
                            </span>
                          )}
                        </div>
                      )}

                      {/* Custo da Ficha */}
                      {custoProt !== null && onOpenFicha && (
                        <button
                          type="button"
                          className="btn btn-xs"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            marginTop: 4,
                            padding: '1px 5px',
                            background: '#e8f5e9',
                            color: '#1b5e20',
                            border: '1px solid #a5d6a7',
                            fontSize: '9px',
                            fontWeight: 700,
                            borderRadius: 3,
                            cursor: 'pointer'
                          }}
                          onClick={() => onOpenFicha(prot || { id: meal.proteinaId, nomeAbrev: meal.proteinaAbrev })}
                          title="Ver Ficha Técnica"
                        >
                          R$ {custoProt.toFixed(2).replace('.', ',')}
                        </button>
                      )}
                    </div>

                    {/* Guarnição */}
                    {(meal.guarnicaoAbrev || guard) && (
                      <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: 4 }}>
                        <div style={{ fontSize: '10px', color: '#777', fontWeight: 700, textTransform: 'uppercase' }}>
                          Guarnição:
                        </div>
                        <div style={{ fontSize: '11px', color: '#333', fontWeight: 600, lineHeight: 1.2 }}>
                          {meal.guarnicaoAbrev || guard?.nomeAbrev || guard?.nome}
                        </div>
                      </div>
                    )}
                  </td>
                )
              })}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Rodapé Informativo sobre o Firebase ── */}
      <div style={{
        padding: '12px 16px',
        background: '#f5f5f5',
        borderRadius: 8,
        border: '1px dashed #ccc',
        fontSize: '12px',
        color: '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div>
          <span style={{ fontWeight: 700, color: '#333' }}>☁️ Armazenamento em Nuvem (Firebase Firestore):</span>
          <span style={{ marginLeft: 6 }}>
            O sistema está preparado para sincronizar o histórico completo com a sua nova conta do Firebase.
          </span>
        </div>
        <div style={{ fontSize: '11px', color: '#1565c0', fontWeight: 600 }}>
          {Object.keys(cardapios).length} dia(s) salvo(s) no histórico total
        </div>
      </div>
    </div>
  )
}
