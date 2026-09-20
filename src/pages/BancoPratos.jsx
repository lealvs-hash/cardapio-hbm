import React, { useState } from 'react'
import { Plus, Pencil, Trash2, X, Check, FileText, ChevronDown, Filter, Search } from 'lucide-react'

// ── Modal for creating/editing a dish with consistency options and ficha técnica ──
function ModalPreparacao({ initial, onSave, onClose, titulo, tipo = 'proteina', onOpenFicha }) {
  const [form, setForm] = useState(initial || {
    categoria: tipo === 'guarnicao' ? 'Guarnição' : '',
    subcategoria: '',
    nome: '',
    nomeAbrev: '',
    nomeBranda: '',
    nomePastosa: '',
    nomeLiquida: tipo === 'guarnicao' ? '' : 'CARNE C/ CALDO LIQUIDIFICADA',
    sufixoPastosa: '',
    sufixoLiquida: 'LIQUIDIFICADO',
    perCapita: '',
    metodoPreparo: '',
    observacoes: '',
  })

  const handleChange = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value }))

  const CATEGORIAS_PROTEINA = [
    'Bovina — Coxão de Dentro',
    'Bovina — Patinho',
    'Bovina — Vazio',
    'Bovina — Moída',
    'Frango — Peito',
    'Frango — Sobrecoxa',
    'Frango — Moído',
    'Suíno — Pernil',
    'Peixe — Filé',
    'Prato Base',
    'Outra',
  ]

  const CATEGORIAS_GUARNICAO = [
    'Purê / Creme',
    'Legumes / Tubérculos',
    'Massa / Farofa',
    'Refogado / Cozido',
    'Guarnição Geral',
  ]

  const categoriasDisponiveis = tipo === 'guarnicao' ? CATEGORIAS_GUARNICAO : CATEGORIAS_PROTEINA

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <h3><FileText size={18} /> {titulo}</h3>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          <div className="modal-section-title">📋 Identificação da Receita</div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Tipo / Categoria *</label>
              <div className="select-wrapper">
                <select value={form.categoria} onChange={handleChange('categoria')}>
                  <option value="">— Selecionar Grupo —</option>
                  {categoriasDisponiveis.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown size={14} className="select-icon" />
              </div>
            </div>
            <div className="form-group">
              <label>Subcategoria / Tag</label>
              <input type="text" value={form.subcategoria || ''} onChange={handleChange('subcategoria')} placeholder="Ex: Forno, Pressão, Grelhado, Purê..." />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Nome Completo da Preparação *</label>
              <input type="text" value={form.nome} onChange={handleChange('nome')} placeholder={tipo === 'guarnicao' ? 'Ex: Batata Assada no Forno com Ervas' : 'Ex: Strogonoff de Frango em Iscas'} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label>Opção DIETA LIVRE e DM (Nome para Impressão) *</label>
              <input type="text" value={form.nomeAbrev} onChange={e => handleChange('nomeAbrev')({ target: { value: e.target.value.toUpperCase() } })} placeholder={tipo === 'guarnicao' ? 'Ex: BATATA ASSADA C/ ERVAS' : 'Ex: PEITO DE FRANGO AO MOLHO CREMOSO DE MILHO'} />
              <span className="field-hint">Aparece na Dieta Livre e repete idêntico na Dieta DM</span>
            </div>
          </div>

          <div className="modal-section-title" style={{ marginTop: 14 }}>🥣 Adaptações da Receita por Dieta e Consistência</div>
          <div className="form-grid form-grid-3">
            <div className="form-group">
              <label>Opção DIETA BRANDA</label>
              <input type="text" value={form.nomeBranda || ''} onChange={e => handleChange('nomeBranda')({ target: { value: e.target.value.toUpperCase() } })} placeholder={tipo === 'guarnicao' ? 'Ex: BATATA COZIDA' : 'Ex: PEITO DE FRANGO EM CUBOS'} />
              <span className="field-hint">Se vazio, repete a Dieta Livre</span>
            </div>
            <div className="form-group">
              <label>Opção DIETA PASTOSA</label>
              <input type="text" value={form.nomePastosa || ''} onChange={e => handleChange('nomePastosa')({ target: { value: e.target.value.toUpperCase() } })} placeholder={tipo === 'guarnicao' ? 'Ex: PURÊ DE BATATA' : 'Ex: FRANGO DESFIADO COM CALDO/MOLHO'} />
              <span className="field-hint">{tipo === 'guarnicao' ? 'Purê, creme, etc.' : 'Carne picada ou desfiada'}</span>
            </div>
            <div className="form-group">
              <label>Opção LÍQ. PASTOSA</label>
              <input type="text" value={form.nomeLiquida || ''} onChange={e => handleChange('nomeLiquida')({ target: { value: e.target.value.toUpperCase() } })} placeholder={tipo === 'guarnicao' ? 'Ou deixe em branco' : 'Ex: CARNE C/ CALDO LIQUIDIFICADA'} />
              <span className="field-hint">{tipo === 'guarnicao' ? 'Opcional (ou deixe vazio)' : 'Padrão: Carne liquidificada'}</span>
            </div>
          </div>

          <div className="modal-section-title" style={{ marginTop: 14 }}>📊 Parâmetros Técnicos & Preparo</div>
          <div className="form-grid form-grid-2">
            <div className="form-group">
              <label>Porção Per Capita (g)</label>
              <input type="number" value={form.perCapita || ''} onChange={handleChange('perCapita')} placeholder="Ex: 150" />
            </div>
          </div>
          <div className="form-group" style={{ marginTop: 10 }}>
            <label>Modo de Preparo</label>
            <textarea
              rows={3}
              value={form.metodoPreparo || ''}
              onChange={handleChange('metodoPreparo')}
              placeholder="Descreva o modo de preparo, temperos, tempo de cocção..."
              style={{ width: '100%', resize: 'vertical', padding: '8px 10px', border: '1px solid #e0e0e0', borderRadius: 6, fontFamily: 'inherit', fontSize: 13 }}
            />
          </div>
        </div>
        <div className="modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {initial?.id && onOpenFicha && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#1b5e20', background: '#e8f5e9', borderColor: '#a5d6a7', fontWeight: 600 }}
                onClick={() => {
                  onClose()
                  onOpenFicha(initial)
                }}
              >
                <FileText size={14} /> Abrir Ficha Técnica & Insumos
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!form.nome || !form.nomeAbrev || !form.categoria) {
                  alert('Preencha: Tipo/Categoria, Nome Completo e Nome Abreviado.')
                  return
                }
                onSave(form)
              }}
            >
              <Check size={16} /> Salvar Preparação
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Generic inline edit row ──
function EditRow({ fields, item, onSave, onCancel }) {
  const [form, setForm] = useState(item)
  const handleChange = (key) => (e) => setForm(prev => ({ ...prev, [key]: e.target.value.toUpperCase() }))

  return (
    <tr className="edit-row">
      {fields.map(f => (
        <td key={f.key}>
          <input className="inline-input" value={form[f.key] || ''} onChange={handleChange(f.key)} placeholder={f.label} />
        </td>
      ))}
      <td>
        <button className="icon-btn green" onClick={() => onSave(form)} title="Salvar"><Check size={14} /></button>
        <button className="icon-btn red" onClick={onCancel} title="Cancelar"><X size={14} /></button>
      </td>
    </tr>
  )
}

// ── Simple two-field table (Guarnições, Saladas, Leguminosas) ──
function SimpleTable({ titulo, emoji, items = [], onAdd, onEdit, onDelete, emptyItem, fields }) {
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <div className="banco-section">
      <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
          {emoji} {titulo} <span className="count" style={{ fontSize: '12px', color: '#666' }}>({items.length})</span>
        </h3>
        <button className="btn btn-sm btn-primary" onClick={() => setAdding(true)}>
          <Plus size={14} /> Adicionar
        </button>
      </div>
      <div className="table-scroll">
        <table className="banco-table">
          <thead>
            <tr>
              {fields.map(f => <th key={f.key}>{f.label}</th>)}
              <th style={{ width: 80, textAlign: 'center' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {adding && (
              <EditRow
                fields={fields}
                item={emptyItem}
                onSave={(data) => { onAdd(data); setAdding(false) }}
                onCancel={() => setAdding(false)}
              />
            )}
            {items.map(item => editingId === item.id ? (
              <EditRow
                key={item.id}
                fields={fields}
                item={item}
                onSave={(data) => { onEdit(item.id, data); setEditingId(null) }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <tr key={item.id}>
                {fields.map(f => (
                  <td key={f.key} className={f.mono ? 'mono' : ''}>{item[f.key]}</td>
                ))}
                <td style={{ textAlign: 'center' }}>
                  <button className="icon-btn" onClick={() => setEditingId(item.id)} title="Editar"><Pencil size={14} /></button>
                  <button
                    className="icon-btn red"
                    onClick={() => {
                      if (window.confirm(`Excluir "${item.nome}"?`)) onDelete(item.id)
                    }}
                    title="Excluir"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
            {items.length === 0 && !adding && (
              <tr>
                <td colSpan={fields.length + 1} style={{ textAlign: 'center', padding: 20, color: '#888' }}>
                  Nenhum item cadastrado. Clique em <strong>Adicionar</strong> acima.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// Helper para localizar e calcular custos da Ficha Técnica vinculada ao prato
function getFichaDoPrato(prato, fichas = []) {
  if (!prato) return null
  return fichas.find(f =>
    (prato.id && f.pratoId === prato.id) ||
    (f.nomePreparacao && prato.nomeAbrev && f.nomePreparacao.trim().toUpperCase() === prato.nomeAbrev.trim().toUpperCase()) ||
    (f.nomePreparacao && prato.nome && f.nomePreparacao.trim().toUpperCase() === prato.nome.trim().toUpperCase())
  )
}

function calcularCustoPorcao(ficha) {
  if (!ficha) return null
  const total = (ficha.insumos || []).reduce((acc, ins) => {
    const pb = Number(ins.pesoBruto) || 0
    const vu = Number(ins.valorUnitario) || 0
    return acc + (pb * vu)
  }, 0)
  const rend = Number(ficha.rendimentoPorcoes) || 1
  return rend > 0 ? (total / rend) : 0
}

// Grupos de Carnes e Alimentos para a navegação organizada por categorias
const GRUPOS_CARNES = [
  { key: 'TODOS', label: 'Todas as Proteínas' },
  { key: 'BOVINA', label: 'Carne Bovina' },
  { key: 'FRANGO', label: 'Aves / Frango' },
  { key: 'SUINO', label: 'Carne Suína' },
  { key: 'PEIXE', label: 'Peixes' },
  { key: 'BASE', label: 'Pratos Base / Mistos' },
]

export default function BancoPratos({ store, onOpenFicha }) {
  const {
    state,
    adicionarProteina, editarProteina, excluirProteina,
    adicionarLeguminosa, editarLeguminosa, excluirLeguminosa,
    adicionarGuarnicao, editarGuarnicao, excluirGuarnicao,
    adicionarSalada, editarSalada, excluirSalada,
  } = store

  const { proteinas = [], leguminosas = [], guarnicoes = [], saladas = [], fichasTecnicas = [] } = state

  // Aba principal de tipo de alimento: Carnes | Leguminosas | Guarnições | Saladas
  const [tipoAtivo, setTipoAtivo] = useState('proteinas')
  // Sub-filtro dentro de Proteínas (Bovina, Frango, Suíno, Peixe, Todos)
  const [subGrupoCarne, setSubGrupoCarne] = useState('TODOS')
  const [busca, setBusca] = useState('')

  // Modal de Proteína e Guarnição
  const [modalProteina, setModalProteina] = useState(null) // null | 'new' | item
  const [modalGuarnicao, setModalGuarnicao] = useState(null) // null | 'new' | item

  // Filtro de Proteínas
  const proteinasFiltradas = proteinas.filter(p => {
    const matchBusca = (p.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
                       (p.nomeAbrev || '').toLowerCase().includes(busca.toLowerCase()) ||
                       (p.categoria || '').toLowerCase().includes(busca.toLowerCase())
    if (!matchBusca) return false

    if (subGrupoCarne === 'BOVINA') return (p.categoria || '').toLowerCase().includes('bovina')
    if (subGrupoCarne === 'FRANGO') return (p.categoria || '').toLowerCase().includes('frango')
    if (subGrupoCarne === 'SUINO') return (p.categoria || '').toLowerCase().includes('suíno') || (p.categoria || '').toLowerCase().includes('suino')
    if (subGrupoCarne === 'PEIXE') return (p.categoria || '').toLowerCase().includes('peixe')
    if (subGrupoCarne === 'BASE') return (p.categoria || '').toLowerCase().includes('base')
    return true
  })

  // Agrupamento por subcategoria específica para exibição limpa (ex: Coxão de dentro, Patinho, etc)
  const categoriasUnicas = [...new Set(proteinasFiltradas.map(p => p.categoria || 'Outra'))]

  return (
    <div className="page">
      <div className="page-header no-print">
        <h2>🍽️ Pratos & Preparações</h2>
        <p className="page-sub">
          Gerencie e cadastre o cardápio de proteínas organizadas por tipo de corte/carne, além das leguminosas, guarnições e saladas.
        </p>
      </div>

      {/* Navegação por Grandes Grupos */}
      <div style={{ display: 'flex', gap: 8, margin: '14px 0 16px', borderBottom: '2px solid #e0e0e0', paddingBottom: 8, flexWrap: 'wrap' }}>
        <button
          className={`btn ${tipoAtivo === 'proteinas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTipoAtivo('proteinas')}
        >
          🥩 Carnes & Proteínas ({proteinas.length})
        </button>
        <button
          className={`btn ${tipoAtivo === 'leguminosas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTipoAtivo('leguminosas')}
        >
          🫘 Leguminosas ({leguminosas.length})
        </button>
        <button
          className={`btn ${tipoAtivo === 'guarnicoes' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTipoAtivo('guarnicoes')}
        >
          🥗 Guarnições ({guarnicoes.length})
        </button>
        <button
          className={`btn ${tipoAtivo === 'saladas' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setTipoAtivo('saladas')}
        >
          🥬 Saladas ({saladas.length})
        </button>
      </div>

      {/* SEÇÃO PROTEÍNAS */}
      {tipoAtivo === 'proteinas' && (
        <div>
          {/* Sub-categorias de Carnes */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {GRUPOS_CARNES.map(g => (
                <button
                  key={g.key}
                  style={{
                    padding: '5px 12px',
                    borderRadius: 16,
                    border: '1px solid',
                    borderColor: subGrupoCarne === g.key ? '#1565c0' : '#ccc',
                    background: subGrupoCarne === g.key ? '#e3f2fd' : '#fff',
                    color: subGrupoCarne === g.key ? '#0d47a1' : '#444',
                    fontWeight: subGrupoCarne === g.key ? 800 : 500,
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                  onClick={() => setSubGrupoCarne(g.key)}
                >
                  {g.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                <Search size={15} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Buscar preparação..."
                  value={busca}
                  onChange={e => setBusca(e.target.value)}
                  style={{ padding: '5px 10px 5px 28px', fontSize: '12px', borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}
                />
              </div>
              <button className="btn btn-primary" onClick={() => setModalProteina('new')}>
                <Plus size={15} /> + Nova Proteína
              </button>
            </div>
          </div>

          {/* Modal de Proteína */}
          {modalProteina && (
            <ModalPreparacao
              titulo={modalProteina === 'new' ? 'Cadastrar Nova Proteína' : 'Editar Proteína'}
              initial={modalProteina !== 'new' ? modalProteina : undefined}
              onClose={() => setModalProteina(null)}
              onOpenFicha={onOpenFicha}
              onSave={(data) => {
                if (modalProteina === 'new') adicionarProteina(data)
                else editarProteina(modalProteina.id, data)
                setModalProteina(null)
              }}
            />
          )}

          {/* Tabela Agrupada por Tipo de Carne */}
          {categoriasUnicas.map(cat => {
            const itensCat = proteinasFiltradas.filter(p => (p.categoria || 'Outra') === cat)
            if (itensCat.length === 0) return null
            return (
              <div key={cat} className="banco-section" style={{ marginBottom: 18 }}>
                <div className="section-header" style={{ background: '#f5f5f5', padding: '6px 12px', borderRadius: 4 }}>
                  <h4 style={{ margin: 0, fontSize: '13px', fontWeight: 800, color: '#1565c0', textTransform: 'uppercase' }}>
                    🥩 {cat} <span className="count" style={{ fontSize: '11px', color: '#666' }}>({itensCat.length})</span>
                  </h4>
                </div>
                <div className="table-scroll">
                  <table className="banco-table">
                    <thead>
                      <tr>
                        <th style={{ width: '28%' }}>Nome Completo</th>
                        <th style={{ width: '20%' }}>Opção DL / DM</th>
                        <th style={{ width: '16%' }}>Opção Branda</th>
                        <th style={{ width: '16%' }}>Opção Pastosa</th>
                        <th style={{ width: '13%', textAlign: 'center' }}>Ficha / Custo</th>
                        <th style={{ width: '7%', textAlign: 'center' }}>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itensCat.map(p => {
                        const ficha = getFichaDoPrato(p, fichasTecnicas)
                        const custo = calcularCustoPorcao(ficha)
                        return (
                          <tr key={p.id}>
                            <td style={{ fontWeight: 600 }}>{p.nome}</td>
                            <td className="mono" style={{ color: '#0d47a1', fontWeight: 700 }}>{p.nomeAbrev}</td>
                            <td className="mono" style={{ color: '#2e7d32' }}>{p.nomeBranda || p.nomeAbrev}</td>
                            <td className="mono" style={{ color: '#e65100' }}>{p.nomePastosa || `${p.nomeAbrev}${p.sufixoPastosa ? ' ' + p.sufixoPastosa : ''}`}</td>
                            <td style={{ textAlign: 'center' }}>
                              {ficha ? (
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  style={{
                                    background: '#e8f5e9',
                                    color: '#1b5e20',
                                    border: '1px solid #81c784',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 4,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => onOpenFicha && onOpenFicha(p)}
                                  title="Ver Ficha Técnica, Insumos e Modo de Preparo"
                                >
                                  <FileText size={12} />
                                  <span>R$ {custo !== null ? custo.toFixed(2).replace('.', ',') : '0,00'}</span>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-sm"
                                  style={{
                                    background: '#fafafa',
                                    color: '#555',
                                    border: '1px dashed #bbb',
                                    fontSize: '11px',
                                    padding: '3px 6px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 3,
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                  }}
                                  onClick={() => onOpenFicha && onOpenFicha(p)}
                                  title="Criar Ficha Técnica para este prato"
                                >
                                  <Plus size={11} />
                                  <span>Criar Ficha</span>
                                </button>
                              )}
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              <button className="icon-btn" onClick={() => setModalProteina(p)} title="Editar"><Pencil size={14} /></button>
                              <button
                                className="icon-btn red"
                                onClick={() => {
                                  if (window.confirm(`Excluir "${p.nome}"?`)) excluirProteina(p.id)
                                }}
                                title="Excluir"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
          {proteinasFiltradas.length === 0 && (
            <div style={{ textAlign: 'center', padding: 24, color: '#777' }}>
              Nenhuma proteína encontrada para este filtro.
            </div>
          )}
        </div>
      )}

      {/* SEÇÃO LEGUMINOSAS */}
      {tipoAtivo === 'leguminosas' && (
        <SimpleTable
          titulo="Leguminosas"
          emoji="🫘"
          items={leguminosas}
          onAdd={adicionarLeguminosa}
          onEdit={editarLeguminosa}
          onDelete={excluirLeguminosa}
          emptyItem={{ nome: '', nomeAbrev: '', nomeBranda: '', nomePastosa: '', nomeLiquida: '' }}
          fields={[
            { key: 'nome', label: 'Nome' },
            { key: 'nomeAbrev', label: 'Abreviado', mono: true },
            { key: 'nomeBranda', label: 'Nome Branda', mono: true },
            { key: 'nomePastosa', label: 'Nome Pastosa', mono: true },
          ]}
        />
      )}

      {/* SEÇÃO GUARNIÇÕES (com modelo de criação idêntico às carnes: DL/DM, Branda, Pastosa e Líquida) */}
      {tipoAtivo === 'guarnicoes' && (
        <div className="banco-section">
          <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800 }}>
              🥗 Guarnições <span className="count" style={{ fontSize: '12px', color: '#666' }}>({guarnicoes.length})</span>
            </h3>
            <button className="btn btn-sm btn-primary" onClick={() => setModalGuarnicao('new')}>
              <Plus size={14} /> + Nova Guarnição
            </button>
          </div>

          {modalGuarnicao && (
            <ModalPreparacao
              tipo="guarnicao"
              titulo={modalGuarnicao === 'new' ? 'Cadastrar Nova Guarnição' : 'Editar Guarnição'}
              initial={modalGuarnicao !== 'new' ? modalGuarnicao : undefined}
              onClose={() => setModalGuarnicao(null)}
              onOpenFicha={onOpenFicha}
              onSave={(data) => {
                if (modalGuarnicao === 'new') adicionarGuarnicao(data)
                else editarGuarnicao(modalGuarnicao.id, data)
                setModalGuarnicao(null)
              }}
            />
          )}

          <div className="table-scroll">
            <table className="banco-table">
              <thead>
                <tr>
                  <th style={{ width: '28%' }}>Nome Completo</th>
                  <th style={{ width: '20%' }}>Opção DL / DM</th>
                  <th style={{ width: '16%' }}>Opção Branda</th>
                  <th style={{ width: '16%' }}>Opção Pastosa</th>
                  <th style={{ width: '13%', textAlign: 'center' }}>Ficha / Custo</th>
                  <th style={{ width: '7%', textAlign: 'center' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {guarnicoes.map(g => {
                  const ficha = getFichaDoPrato(g, fichasTecnicas)
                  const custo = calcularCustoPorcao(ficha)
                  return (
                    <tr key={g.id}>
                      <td style={{ fontWeight: 600 }}>{g.nome}</td>
                      <td className="mono" style={{ color: '#0d47a1', fontWeight: 700 }}>{g.nomeAbrev}</td>
                      <td className="mono" style={{ color: '#2e7d32' }}>{g.nomeBranda || g.nomeAbrev}</td>
                      <td className="mono" style={{ color: '#e65100' }}>{g.nomePastosa || '—'}</td>
                      <td style={{ textAlign: 'center' }}>
                        {ficha ? (
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              background: '#e8f5e9',
                              color: '#1b5e20',
                              border: '1px solid #81c784',
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 8px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              borderRadius: 4,
                              cursor: 'pointer',
                            }}
                            onClick={() => onOpenFicha && onOpenFicha(g)}
                            title="Ver Ficha Técnica, Insumos e Modo de Preparo"
                          >
                            <FileText size={12} />
                            <span>R$ {custo !== null ? custo.toFixed(2).replace('.', ',') : '0,00'}</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-sm"
                            style={{
                              background: '#fafafa',
                              color: '#555',
                              border: '1px dashed #bbb',
                              fontSize: '11px',
                              padding: '3px 6px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 3,
                              borderRadius: 4,
                              cursor: 'pointer',
                            }}
                            onClick={() => onOpenFicha && onOpenFicha(g)}
                            title="Criar Ficha Técnica para esta guarnição"
                          >
                            <Plus size={11} />
                            <span>Criar Ficha</span>
                          </button>
                        )}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button className="icon-btn" onClick={() => setModalGuarnicao(g)} title="Editar"><Pencil size={14} /></button>
                        <button
                          className="icon-btn red"
                          onClick={() => {
                            if (window.confirm(`Excluir "${g.nome}"?`)) excluirGuarnicao(g.id)
                          }}
                          title="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
                {guarnicoes.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 20, color: '#888' }}>
                      Nenhuma guarnição cadastrada. Clique em <strong>+ Nova Guarnição</strong> acima.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SEÇÃO SALADAS */}
      {tipoAtivo === 'saladas' && (
        <SimpleTable
          titulo="Saladas"
          emoji="🥬"
          items={saladas}
          onAdd={adicionarSalada}
          onEdit={editarSalada}
          onDelete={excluirSalada}
          emptyItem={{ nome: '', nomeAbrev: '' }}
          fields={[
            { key: 'nome', label: 'Nome Completo' },
            { key: 'nomeAbrev', label: 'Nome Abreviado (impresso)', mono: true },
          ]}
        />
      )}
    </div>
  )
}
