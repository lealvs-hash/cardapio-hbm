import React, { useState, useEffect } from 'react'
import { Printer, Save, Plus, X, Check, ChevronDown } from 'lucide-react'
import PrintView from '../components/PrintView'
import { DIAS_SEMANA, BASES_DIETA, OBS_LIQUIDA_PADRAO } from '../data/initialData'
import { verificarRepeticaoPrato } from '../utils/repetitionUtils'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

function getDiaSemana(dateStr) {
  const date = new Date(dateStr + 'T12:00:00')
  return DIAS_SEMANA[date.getDay() === 0 ? 6 : date.getDay() - 1]
}

function emptyRefeicao(tipo = 'almoco') {
  return {
    baseGeralDL: BASES_DIETA.geralDL[0],
    baseDM:      BASES_DIETA.dm[0],
    baseBranda:  BASES_DIETA.branda[0],
    basePastosa: BASES_DIETA.pastosa[0],   // independente: ARROZ BRANCO PAPA
    baseLiquida: BASES_DIETA.liquidaPastosa[0],
    proteinaId:    '',
    proteinaBrandaId: undefined,
    proteinaBrandaManual: undefined,
    proteinaPastosaId: undefined,
    proteinaPastosaManual: undefined,
    proteinaLiquidaManual: undefined,
    leguminosaId:  tipo === 'almoco' ? 'leg1' : '', // Feijão Preto pré-selecionado no Almoço
    guarnicaoId:   '',
    guarnicaoAbrev: '',
    guarnicaoBranda: '',
    guarnicaoPastosa: '',
    guarnicaoLiquida: '',
    saladaId:      '',
    saladaAbrev:   '',
  }
}

const COLS = [
  { key: 'geralDL', label: 'DIETA LIVRE'         },
  { key: 'dm',      label: 'DM'                  },
  { key: 'branda',  label: 'BRANDA'              },
  { key: 'pastosa', label: 'DIETA PASTOSA'       },
  { key: 'liquida', label: 'LÍQ. PASTOSA'        },
]

const CATEGORIAS_RAPIDAS = {
  proteina:  [
    'Prato Base',
    'Frango — Peito', 'Frango — Sobrecoxa', 'Frango — Moído',
    'Bovina — Moída', 'Bovina — Coxão de Dentro', 'Bovina — Patinho', 'Bovina — Vazio',
    'Suíno — Pernil', 'Peixe — Filé', 'Outra',
  ],
  leguminosa: ['Leguminosa'],
  guarnicao:  ['Guarnição'],
  salada:     ['Salada'],
  base:       ['Prato Base'],
}

// ─────────────────────────────────────────────
// Modal de criação rápida
// ─────────────────────────────────────────────
function QuickCreateModal({ tipo, onSave, onClose }) {
  const categorias = CATEGORIAS_RAPIDAS[tipo] || ['Outra']
  const [form, setForm] = useState({
    categoria: categorias[0],
    nome: '', nomeAbrev: '',
    nomeBranda: '', nomePastosa: '', nomeLiquida: '',
    sufixoPastosa: '', sufixoLiquida: 'LIQUIDIFICADO',
  })
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))
  const upper = k => e => setForm(p => ({ ...p, [k]: e.target.value.toUpperCase() }))

  const labels = { proteina: 'Proteína / Prato', leguminosa: 'Leguminosa', guarnicao: 'Guarnição', salada: 'Salada', base: 'Prato Base' }

  const handleSave = () => {
    if (!form.nome.trim() || !form.nomeAbrev.trim()) {
      alert('Preencha o Nome e o Nome Abreviado.')
      return
    }
    onSave(form)
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <h3><Plus size={15} /> + Novo {labels[tipo]}</h3>
          <button className="icon-btn" onClick={onClose}><X size={14} /></button>
        </div>
        <div className="modal-body" style={{ padding: 16 }}>
          {tipo === 'proteina' && (
            <div className="form-group" style={{ marginBottom: 12 }}>
              <label>Categoria</label>
              <div className="select-wrapper">
                <select value={form.categoria} onChange={set('categoria')}>
                  {categorias.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="select-icon" />
              </div>
            </div>
          )}
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label>Nome Completo</label>
            <input type="text" value={form.nome} onChange={set('nome')} placeholder="Ex: Frango ao Molho de Milho" />
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label>Opção DIETA LIVRE e DM (Nome Abreviado) *</label>
            <input type="text" value={form.nomeAbrev} onChange={upper('nomeAbrev')} placeholder="Ex: PEITO DE FRANGO AO MOLHO CREMOSO DE MILHO" />
            <span className="field-hint" style={{ fontSize: '10px', color: '#666' }}>Aparece na Dieta Livre e repete idêntico na Dieta DM</span>
          </div>

          {/* Adaptações para Proteína */}
          {tipo === 'proteina' && (
            <>
              <div className="modal-section-title" style={{ marginTop: 12, marginBottom: 8, fontSize: '11px', fontWeight: 800, color: '#1565c0' }}>
                🥣 Adaptações da Receita por Dieta
              </div>
              <div className="form-grid form-grid-2" style={{ gap: 8 }}>
                <div className="form-group">
                  <label>Opção DIETA BRANDA</label>
                  <input type="text" value={form.nomeBranda} onChange={upper('nomeBranda')} placeholder="Ex: PEITO DE FRANGO EM CUBOS" />
                  <span className="field-hint" style={{ fontSize: '10px', color: '#666' }}>Se vazio, repete a Dieta Livre</span>
                </div>
                <div className="form-group">
                  <label>Opção DIETA PASTOSA</label>
                  <input type="text" value={form.nomePastosa} onChange={upper('nomePastosa')} placeholder="Ex: FRANGO DESFIADO COM CALDO/MOLHO" />
                  <span className="field-hint" style={{ fontSize: '10px', color: '#666' }}>Carne picada ou desfiada c/ caldo</span>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 8 }}>
                <label>Opção LÍQ. PASTOSA <span style={{ fontWeight: 400, color: '#888' }}>(Padrão: CARNE C/ CALDO LIQUIDIFICADA — ou deixe vazio)</span></label>
                <input type="text" value={form.nomeLiquida} onChange={upper('nomeLiquida')} placeholder="Ex: CARNE C/ CALDO LIQUIDIFICADA" />
              </div>
            </>
          )}

          {/* Adaptações para Guarnição */}
          {tipo === 'guarnicao' && (
            <>
              <div className="modal-section-title" style={{ marginTop: 12, marginBottom: 8, fontSize: '11px', fontWeight: 800, color: '#1565c0' }}>
                🥣 Adaptações da Guarnição por Dieta
              </div>
              <div className="form-grid form-grid-3" style={{ gap: 8 }}>
                <div className="form-group">
                  <label>Opção BRANDA</label>
                  <input type="text" value={form.nomeBranda} onChange={upper('nomeBranda')} placeholder="Ex: BATATA COZIDA" />
                  <span className="field-hint" style={{ fontSize: '10px', color: '#666' }}>Se vazio, usa a Dieta Livre</span>
                </div>
                <div className="form-group">
                  <label>Opção PASTOSA</label>
                  <input type="text" value={form.nomePastosa} onChange={upper('nomePastosa')} placeholder="Ex: PURÊ DE BATATA" />
                  <span className="field-hint" style={{ fontSize: '10px', color: '#666' }}>Purês, cremes, etc.</span>
                </div>
                <div className="form-group">
                  <label>Opção LÍQ. PASTOSA</label>
                  <input type="text" value={form.nomeLiquida} onChange={upper('nomeLiquida')} placeholder="Ou deixe em branco" />
                  <span className="field-hint" style={{ fontSize: '10px', color: '#666' }}>Opcional</span>
                </div>
              </div>
            </>
          )}

          {tipo === 'leguminosa' && (
            <div className="form-grid form-grid-3" style={{ marginTop: 8, gap: 6 }}>
              <div className="form-group">
                <label>Branda</label>
                <input type="text" value={form.nomeBranda} onChange={upper('nomeBranda')} placeholder="CALDO DE FEIJÃO" />
              </div>
              <div className="form-group">
                <label>Pastosa</label>
                <input type="text" value={form.nomePastosa} onChange={upper('nomePastosa')} placeholder="FEIJÃO LIQUIDIFICADO" />
              </div>
              <div className="form-group">
                <label>Líquida</label>
                <input type="text" value={form.nomeLiquida} onChange={upper('nomeLiquida')} placeholder="CALDO COADO" />
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            <Check size={14} /> Salvar e Selecionar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// Tabela interativa de uma refeição
// ─────────────────────────────────────────────
function EditableRefeicaoTable({ title, r, onChange, proteinas, leguminosas, guarnicoes, saladas = [], showSalada, store, onOpenFicha, dataRef, cardapios = {} }) {
  const [qc, setQC] = useState(null) // { tipo, field }

  const prot  = proteinas.find(p  => p.id  === r.proteinaId)
  const leg   = leguminosas.find(l => l.id === r.leguminosaId)
  const guard = guarnicoes.find(g  => g.id  === r.guarnicaoId)
  const sal   = saladas.find(s    => s.id   === r.saladaId)

  // Verificação de repetição de pratos em tempo real
  const repProt = verificarRepeticaoPrato(r.proteinaId, r.proteinaAbrev || prot?.nomeAbrev || prot?.nome, dataRef, cardapios)
  const repGuard = verificarRepeticaoPrato(r.guarnicaoId, r.guarnicaoAbrev || guard?.nomeAbrev || guard?.nome, dataRef, cardapios)

  const cats = [...new Set(proteinas.map(p => p.categoria))]
  const pratosBase = proteinas.filter(p => p.categoria === 'Prato Base')

  // ── Quick-create handler ──
  const handleQCSave = (tipo, data) => {
    const id = `qc_${Date.now()}`
    const item = { ...data, id }
    if (tipo === 'proteina' || tipo === 'base') {
      store.adicionarProteina(item)
      // If tipo=base, field is a base key; if proteina, field is proteinaId
      if (qc.field === 'proteinaId') {
        onChange({ ...r, proteinaId: id })
      } else {
        // base field: store nomeAbrev as value
        onChange({ ...r, [qc.field]: item.nomeAbrev })
      }
    } else if (tipo === 'leguminosa') {
      store.adicionarLeguminosa(item)
      onChange({ ...r, leguminosaId: id })
    } else if (tipo === 'guarnicao') {
      store.adicionarGuarnicao(item)
      onChange({
        ...r,
        guarnicaoId: id,
        guarnicaoAbrev: item.nomeAbrev,
        guarnicaoBranda: item.nomeBranda || item.nomeAbrev,
        guarnicaoPastosa: item.nomePastosa || '',
        guarnicaoLiquida: item.nomeLiquida || '',
      })
    } else if (tipo === 'salada') {
      store.adicionarSalada(item)
      onChange({ ...r, saladaId: id, saladaAbrev: item.nomeAbrev })
    }
    setQC(null)
  }

  // ── Select com opção + Prato ──
  const BaseSelect = ({ field, options }) => {
    const val = r[field]
    const handleChange = (e) => {
      if (e.target.value === '__add__') {
        setQC({ tipo: 'base', field })
      } else {
        onChange({ ...r, [field]: e.target.value })
      }
    }
    return (
      <select className="table-select" value={val} onChange={handleChange}>
        <option value="__add__">+ Prato</option>
        {options.map(b => <option key={b} value={b}>{b}</option>)}
        {pratosBase.length > 0 && (
          <optgroup label="── Pratos Especiais ──">
            {pratosBase.map(p => <option key={p.id} value={p.nomeAbrev}>{p.nome}</option>)}
          </optgroup>
        )}
      </select>
    )
  }

  const handleProteinaChange = (e) => {
    if (e.target.value === '__add__') { setQC({ tipo: 'proteina', field: 'proteinaId' }); return }
    onChange({ ...r, proteinaId: e.target.value })
  }
  const handleLegChange = (e) => {
    if (e.target.value === '__add__') { setQC({ tipo: 'leguminosa', field: 'leguminosaId' }); return }
    onChange({ ...r, leguminosaId: e.target.value })
  }
  const handleGuardChange = (e) => {
    if (e.target.value === '__add__') { setQC({ tipo: 'guarnicao', field: 'guarnicaoId' }); return }
    const g = guarnicoes.find(x => x.id === e.target.value)
    onChange({
      ...r,
      guarnicaoId: e.target.value,
      guarnicaoAbrev: g?.nomeAbrev || '',
      guarnicaoBranda: g ? (g.nomeBranda || g.nomeAbrev) : '',
      guarnicaoPastosa: g ? (g.nomePastosa || '') : '',
      guarnicaoLiquida: g ? (g.nomeLiquida || '') : '',
    })
  }
  const handleSaladaChange = (e) => {
    if (e.target.value === '__add__') { setQC({ tipo: 'salada', field: 'saladaId' }); return }
    const s = saladas.find(x => x.id === e.target.value)
    onChange({ ...r, saladaId: e.target.value, saladaAbrev: s?.nomeAbrev || '' })
  }

  // Derived display values
  const protNome = prot?.nomeAbrev || ''
  const protBranda = r.proteinaBrandaManual !== undefined ? r.proteinaBrandaManual : (prot?.nomeBranda || protNome)
  const protPastosa = r.proteinaPastosaManual !== undefined ? r.proteinaPastosaManual : (prot?.nomePastosa || (prot ? `${prot.nomeAbrev}${prot.sufixoPastosa ? ' ' + prot.sufixoPastosa : ''}` : ''))
  
  let protLiquida = ''
  if (r.proteinaLiquidaManual !== undefined) {
    protLiquida = r.proteinaLiquidaManual
  } else if (prot?.nomeLiquida) {
    protLiquida = prot.nomeLiquida
  } else if (prot) {
    protLiquida = 'CARNE C/ CALDO LIQUIDIFICADA'
  }

  const guardNome = guard?.nomeAbrev || ''
  const guardBranda = r.guarnicaoBranda !== undefined ? r.guarnicaoBranda : (guard?.nomeBranda || guardNome)
  const guardPastosa = r.guarnicaoPastosa !== undefined ? r.guarnicaoPastosa : (guard?.nomePastosa || '')
  const guardLiquida = r.guarnicaoLiquida !== undefined ? r.guarnicaoLiquida : (guard?.nomeLiquida || '')

  const derived = {
    legGeralDL: leg?.nomeAbrev   || '',
    legDM:      leg?.nomeAbrev   || '',
    legBranda:  leg?.nomeBranda  || '',
    legPastosa: leg?.nomePastosa || '',
    legLiquida: leg?.nomeLiquida || '',
    protGeralDL: protNome,
    protDM:      protNome,
    protBranda:  protBranda,
    protPastosa: protPastosa,
    protLiquida: protLiquida,
    guardGeralDL: guardNome,
    guardDM:      guardNome,
    guardBranda:  guardBranda,
    guardPastosa: guardPastosa,
    guardLiquida: guardLiquida,
    salGeralDL: sal?.nomeAbrev || '',
    salDM:      sal?.nomeAbrev || '',
  }

  const DCell = ({ val, empty }) => (
    <td className={`cardapio-td derived-cell ${empty ? 'cell-empty' : ''}`}>{val}</td>
  )

  return (
    <div className="edit-table-wrapper no-print">
      {qc && (
        <QuickCreateModal
          tipo={qc.tipo}
          onSave={data => handleQCSave(qc.tipo, data)}
          onClose={() => setQC(null)}
        />
      )}
      <table className="cardapio-table">
        <colgroup>
          <col style={{ width: '12%' }} />
          <col /><col /><col /><col /><col />
        </colgroup>
        <thead>
          <tr>
            <th className="col-label-header">{title}</th>
            {COLS.map(c => (
              <th key={c.key} className="col-diet-header">
                <span className="th-diet">{c.label}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* PRATO-BASE Cereal — 5 selects */}
          <tr className="row-base">
            <td className="row-label-cell">
              <span className="row-label-main">PRATO-BASE</span>
              <span className="row-label-sub">CEREAL</span>
            </td>
            <td className="cardapio-td edit-cell">
              <BaseSelect field="baseGeralDL" options={BASES_DIETA.geralDL} />
            </td>
            <td className="cardapio-td edit-cell">
              <BaseSelect field="baseDM" options={BASES_DIETA.dm} />
            </td>
            <td className="cardapio-td edit-cell">
              <BaseSelect field="baseBranda" options={BASES_DIETA.branda} />
            </td>
            <td className="cardapio-td edit-cell">
              <BaseSelect field="basePastosa" options={BASES_DIETA.pastosa} />
            </td>
            <td className="cardapio-td edit-cell">
              <BaseSelect field="baseLiquida" options={BASES_DIETA.liquidaPastosa} />
            </td>
          </tr>

          {/* PRATO-BASE Leguminosa — 1 select + 4 derivados */}
          <tr className="row-leguminosa">
            <td className="row-label-cell">
              <span className="row-label-main">PRATO-BASE</span>
              <span className="row-label-sub">LEGUMINOSA</span>
            </td>
            <td className="cardapio-td edit-cell">
              <select className="table-select" value={r.leguminosaId} onChange={handleLegChange}>
                <option value="__add__">+ Prato</option>
                <option value="">— Selecionar —</option>
                {leguminosas.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
              </select>
            </td>
            <DCell val={derived.legDM}      />
            <DCell val={derived.legBranda}  />
            <DCell val={derived.legPastosa} />
            <DCell val={derived.legLiquida} />
          </tr>

          {/* PROTEÍNA — 1 select + 4 derivados/editáveis */}
          <tr className="row-principal">
            <td className="row-label-cell">
              <span className="row-label-main">PROTEÍNA</span>
              {prot && onOpenFicha && (
                <button
                  type="button"
                  className="no-print"
                  style={{
                    display: 'block',
                    margin: '3px auto 0',
                    fontSize: '8.5px',
                    padding: '2px 5px',
                    background: '#e8f5e9',
                    color: '#1b5e20',
                    border: '1px solid #81c784',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                  onClick={() => onOpenFicha(prot)}
                  title="Abrir Ficha Técnica e Custos desta proteína"
                >
                  📋 FICHA
                </button>
              )}
            </td>
            <td className="cardapio-td edit-cell">
              <select className="table-select" value={r.proteinaId} onChange={handleProteinaChange}>
                <option value="__add__">+ Prato</option>
                <option value="">— Selecionar —</option>
                {cats.map(cat => (
                  <optgroup key={cat} label={cat}>
                    {proteinas.filter(p => p.categoria === cat).map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
              {repProt.servidoAntes && (
                <div className="no-print" style={{ marginTop: 2, textAlign: 'left' }}>
                  {repProt.nivelAlerta === 'repetido' ? (
                    <span style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '8.5px', padding: '1px 4px', borderRadius: 3, fontWeight: 800, display: 'inline-block' }}>
                      {repProt.mensagem}
                    </span>
                  ) : repProt.nivelAlerta === 'atencao' ? (
                    <span style={{ background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082', fontSize: '8.5px', padding: '1px 4px', borderRadius: 3, fontWeight: 700, display: 'inline-block' }}>
                      {repProt.mensagem}
                    </span>
                  ) : (
                    <span style={{ color: '#2e7d32', fontSize: '8.5px', fontWeight: 600, display: 'inline-block' }}>
                      {repProt.mensagem}
                    </span>
                  )}
                </div>
              )}
            </td>
            <DCell val={derived.protDM} />
            <td className="cardapio-td edit-cell" title="Proteína para Dieta Branda (por padrão adapta da Dieta Livre ou escolha outra)">
              <select
                className="table-select"
                value={r.proteinaBrandaId !== undefined ? r.proteinaBrandaId : ''}
                onChange={e => {
                  const val = e.target.value
                  if (val === '__padrao__') {
                    onChange({ ...r, proteinaBrandaId: undefined, proteinaBrandaManual: undefined })
                  } else {
                    const p = proteinas.find(x => x.id === val)
                    onChange({
                      ...r,
                      proteinaBrandaId: val,
                      proteinaBrandaManual: p ? (p.nomeBranda || p.nomeAbrev) : '',
                    })
                  }
                }}
              >
                <option value="__padrao__">
                  {derived.protBranda ? derived.protBranda : '— Selecionar —'}
                </option>
                {cats.map(cat => (
                  <optgroup key={cat} label={cat}>
                    {proteinas.filter(p => p.categoria === cat).map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </td>
            <td className="cardapio-td edit-cell" title="Proteína para Dieta Pastosa (por padrão adapta da Dieta Livre ou escolha outra)">
              <select
                className="table-select"
                value={r.proteinaPastosaId !== undefined ? r.proteinaPastosaId : ''}
                onChange={e => {
                  const val = e.target.value
                  if (val === '__padrao__') {
                    onChange({ ...r, proteinaPastosaId: undefined, proteinaPastosaManual: undefined })
                  } else {
                    const p = proteinas.find(x => x.id === val)
                    const pastosaStr = p ? (p.nomePastosa || `${p.nomeAbrev}${p.sufixoPastosa ? ' ' + p.sufixoPastosa : ''}`) : ''
                    onChange({
                      ...r,
                      proteinaPastosaId: val,
                      proteinaPastosaManual: pastosaStr,
                    })
                  }
                }}
              >
                <option value="__padrao__">
                  {derived.protPastosa ? derived.protPastosa : '— Selecionar —'}
                </option>
                {cats.map(cat => (
                  <optgroup key={cat} label={cat}>
                    {proteinas.filter(p => p.categoria === cat).map(p => (
                      <option key={p.id} value={p.id}>{p.nome}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </td>
            <td className="cardapio-td edit-cell" title="Líquida Pastosa (Carne com caldo liquidificada — pode alterar ou deixar em branco)">
              <input
                type="text"
                className="table-select"
                style={{ textAlign: 'center', fontSize: '7pt', height: '100%' }}
                value={r.proteinaLiquidaManual !== undefined ? r.proteinaLiquidaManual : derived.protLiquida}
                onChange={e => onChange({ ...r, proteinaLiquidaManual: e.target.value.toUpperCase() })}
                placeholder="Vazio"
              />
            </td>
          </tr>

          {/* GUARNIÇÃO — 1 select (DL) + DM (repete DL) + Branda/Pastosa/Líq (auto-adaptadas e editáveis) */}
          <tr className="row-guarnicao">
            <td className="row-label-cell">
              <span className="row-label-main">GUARNIÇÃO</span>
              {guard && onOpenFicha && (
                <button
                  type="button"
                  className="no-print"
                  style={{
                    display: 'block',
                    margin: '3px auto 0',
                    fontSize: '8.5px',
                    padding: '2px 5px',
                    background: '#e8f5e9',
                    color: '#1b5e20',
                    border: '1px solid #81c784',
                    borderRadius: 3,
                    cursor: 'pointer',
                    fontWeight: 700
                  }}
                  onClick={() => onOpenFicha(guard)}
                  title="Abrir Ficha Técnica e Custos desta guarnição"
                >
                  📋 FICHA
                </button>
              )}
            </td>
            <td className="cardapio-td edit-cell">
              <select className="table-select" value={r.guarnicaoId} onChange={handleGuardChange}>
                <option value="__add__">+ Prato</option>
                <option value="">— Sem guarnição —</option>
                {guarnicoes.map(g => <option key={g.id} value={g.id}>{g.nome}</option>)}
              </select>
              {repGuard.servidoAntes && (
                <div className="no-print" style={{ marginTop: 2, textAlign: 'left' }}>
                  {repGuard.nivelAlerta === 'repetido' ? (
                    <span style={{ background: '#ffebee', color: '#c62828', border: '1px solid #ffcdd2', fontSize: '8.5px', padding: '1px 4px', borderRadius: 3, fontWeight: 800, display: 'inline-block' }}>
                      {repGuard.mensagem}
                    </span>
                  ) : repGuard.nivelAlerta === 'atencao' ? (
                    <span style={{ background: '#fff8e1', color: '#f57f17', border: '1px solid #ffe082', fontSize: '8.5px', padding: '1px 4px', borderRadius: 3, fontWeight: 700, display: 'inline-block' }}>
                      {repGuard.mensagem}
                    </span>
                  ) : (
                    <span style={{ color: '#2e7d32', fontSize: '8.5px', fontWeight: 600, display: 'inline-block' }}>
                      {repGuard.mensagem}
                    </span>
                  )}
                </div>
              )}
            </td>
            {/* DM repete a Guarnição da Dieta Livre */}
            <DCell val={derived.guardDM} />
            <td className="cardapio-td edit-cell" title="Guarnição Branda (adapta automaticamente ou altere)">
              <input
                type="text"
                className="table-select"
                style={{ textAlign: 'center', fontSize: '7pt', height: '100%' }}
                value={derived.guardBranda}
                onChange={e => onChange({ ...r, guarnicaoBranda: e.target.value.toUpperCase() })}
                placeholder="—"
              />
            </td>
            <td className="cardapio-td edit-cell" title="Guarnição Pastosa (adapta automaticamente ou altere)">
              <input
                type="text"
                className="table-select"
                style={{ textAlign: 'center', fontSize: '7pt', height: '100%' }}
                value={derived.guardPastosa}
                onChange={e => onChange({ ...r, guarnicaoPastosa: e.target.value.toUpperCase() })}
                placeholder="—"
              />
            </td>
            <td className="cardapio-td edit-cell" title="Guarnição Líquida (opcional)">
              <input
                type="text"
                className="table-select"
                style={{ textAlign: 'center', fontSize: '7pt', height: '100%' }}
                value={derived.guardLiquida}
                onChange={e => onChange({ ...r, guarnicaoLiquida: e.target.value.toUpperCase() })}
                placeholder="—"
              />
            </td>
          </tr>

          {/* SALADA — só almoço */}
          {showSalada && (
            <tr className="row-salada">
              <td className="row-label-cell">
                <span className="row-label-main">SALADA</span>
              </td>
              <td className="cardapio-td edit-cell">
                <select className="table-select" value={r.saladaId} onChange={handleSaladaChange}>
                  <option value="__add__">+ Prato</option>
                  <option value="">— Sem salada —</option>
                  {saladas.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
                </select>
              </td>
              <DCell val={derived.salDM} />
              <DCell val="" empty />
              <DCell val="" empty />
              <DCell val="" empty />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ─────────────────────────────────────────────
// Página principal
// ─────────────────────────────────────────────
export default function CardapioPage({ store, onOpenFicha, selectedDate: propSelectedDate, setSelectedDate: propSetSelectedDate }) {
  const { state, salvarCardapio } = store
  const { proteinas, leguminosas, guarnicoes, saladas = [], cardapios } = state

  const todayStr = new Date().toISOString().slice(0, 10)
  const [internalDate, setInternalDate] = useState(todayStr)
  const selectedDate = propSelectedDate !== undefined ? propSelectedDate : internalDate
  const setSelectedDate = propSetSelectedDate || setInternalDate
 
  const [almoco, setAlmoco] = useState(() => emptyRefeicao('almoco'))
  const [jantar, setJantar] = useState(() => emptyRefeicao('jantar'))
  const [obsLiquidaCompleta, setObsLiquidaCompleta] = useState(OBS_LIQUIDA_PADRAO.liquidaCompleta)
  const [obsLiquidaSemResiduos, setObsLiquidaSemResiduos] = useState(OBS_LIQUIDA_PADRAO.liquidaSemResiduos)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existing = cardapios[selectedDate]
    if (existing) {
      setAlmoco({ ...emptyRefeicao('almoco'), ...(existing.almoco ?? {}) })
      setJantar({ ...emptyRefeicao('jantar'), ...(existing.jantar ?? {}) })
      setObsLiquidaCompleta(existing.observacoes?.liquidaCompleta ?? OBS_LIQUIDA_PADRAO.liquidaCompleta)
      setObsLiquidaSemResiduos(existing.observacoes?.liquidaSemResiduos ?? OBS_LIQUIDA_PADRAO.liquidaSemResiduos)
    } else {
      setAlmoco(emptyRefeicao('almoco'))
      setJantar(emptyRefeicao('jantar'))
      setObsLiquidaCompleta(OBS_LIQUIDA_PADRAO.liquidaCompleta)
      setObsLiquidaSemResiduos(OBS_LIQUIDA_PADRAO.liquidaSemResiduos)
    }
    setSaved(false)
  }, [selectedDate, cardapios])

  const handleSalvar = () => {
    salvarCardapio(selectedDate, {
      diaSemana: getDiaSemana(selectedDate),
      almoco,
      jantar,
      observacoes: { liquidaCompleta: obsLiquidaCompleta, liquidaSemResiduos: obsLiquidaSemResiduos },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const cardapioParaPrint = {
    almoco, jantar,
    observacoes: { liquidaCompleta: obsLiquidaCompleta, liquidaSemResiduos: obsLiquidaSemResiduos },
  }

  return (
    <div className="page">

      {/* ── Toolbar ── */}
      <div className="page-toolbar no-print">
        <div className="toolbar-left">
          <input type="date" className="date-input" value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)} />
          <div className="dia-semana-badge">{getDiaSemana(selectedDate)}</div>
          {cardapios[selectedDate] && <span className="badge-saved">✓ Salvo</span>}
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={handleSalvar}>
            <Save size={15} /> {saved ? '✓ Salvo!' : 'Salvar Cardápio'}
          </button>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={15} /> Imprimir
          </button>
        </div>
      </div>

      {/* ── Tabela interativa: ALMOÇO ── */}
      <EditableRefeicaoTable
        title="ALMOÇO"
        r={almoco} onChange={setAlmoco}
        proteinas={proteinas} leguminosas={leguminosas}
        guarnicoes={guarnicoes} saladas={saladas}
        showSalada={true} store={store}
        onOpenFicha={onOpenFicha}
        dataRef={selectedDate}
        cardapios={cardapios}
      />

      {/* ── Tabela interativa: JANTAR ── */}
      <EditableRefeicaoTable
        title="JANTAR"
        r={jantar} onChange={setJantar}
        proteinas={proteinas} leguminosas={leguminosas}
        guarnicoes={guarnicoes} saladas={saladas}
        showSalada={false} store={store}
        onOpenFicha={onOpenFicha}
        dataRef={selectedDate}
        cardapios={cardapios}
      />

      {/* ── Observações de dieta líquida ── */}
      <div className="obs-section no-print">
        <h4>💧 Dieta Líquida</h4>
        <div className="form-grid form-grid-2">
          <div className="form-group">
            <label>Líquida Completa</label>
            <input type="text" value={obsLiquidaCompleta}
              onChange={e => setObsLiquidaCompleta(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Líquida Sem Resíduos</label>
            <input type="text" value={obsLiquidaSemResiduos}
              onChange={e => setObsLiquidaSemResiduos(e.target.value)} />
          </div>
        </div>
      </div>

      {/* ── Print-only ── */}
      <div className="print-only">
        <PrintView
          cardapio={cardapioParaPrint}
          proteinas={proteinas} leguminosas={leguminosas} guarnicoes={guarnicoes}
          dataFormatada={formatDate(selectedDate)}
          diaSemana={getDiaSemana(selectedDate)}
        />
      </div>
    </div>
  )
}
