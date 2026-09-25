import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X, Search, DollarSign, ChevronDown, ChevronRight } from 'lucide-react'

// Hierarquia de categorias: grupo pai → subcategorias ou lista plana
const GRUPOS = [
  {
    grupo: 'CARNES / PROTEÍNAS',
    cor: '#b71c1c',
    corFundo: '#ffebee',
    corBorda: '#ef9a9a',
    icone: '🥩',
    subcats: ['AVES', 'BOVINOS', 'SUÍNOS', 'PEIXES', 'OVOS'],
  },
  {
    grupo: 'HORTIFRÚTI',
    cor: '#1b5e20',
    corFundo: '#e8f5e9',
    corBorda: '#a5d6a7',
    icone: '🥦',
    subcats: ['HORTIFRÚTI'],
  },
  {
    grupo: 'SECOS / CEREAIS / LEGUMINOSAS',
    cor: '#e65100',
    corFundo: '#fff3e0',
    corBorda: '#ffcc80',
    icone: '🌾',
    subcats: ['SECOS'],
  },
  {
    grupo: 'CONDIMENTOS / TEMPEROS',
    cor: '#4a148c',
    corFundo: '#f3e5f5',
    corBorda: '#ce93d8',
    icone: '🧂',
    subcats: ['CONDIMENTOS'],
  },
  {
    grupo: 'LATICÍNIOS',
    cor: '#0277bd',
    corFundo: '#e1f5fe',
    corBorda: '#81d4fa',
    icone: '🥛',
    subcats: ['LATICÍNIOS'],
  },
  {
    grupo: 'OUTROS',
    cor: '#37474f',
    corFundo: '#eceff1',
    corBorda: '#b0bec5',
    icone: '📦',
    subcats: ['OUTROS'],
  },
]

// Lista plana de todas as categorias possíveis para o select
const TODAS_CATEGORIAS = [
  'AVES', 'BOVINOS', 'SUÍNOS', 'PEIXES', 'OVOS',
  'HORTIFRÚTI',
  'SECOS',
  'CONDIMENTOS',
  'LATICÍNIOS',
  'OUTROS',
]

function getGrupo(categoria) {
  const cat = (categoria || 'OUTROS').toUpperCase()
  return GRUPOS.find(g => g.subcats.includes(cat)) || GRUPOS[GRUPOS.length - 1]
}

export default function ValoresPage({ store, onOpenFicha }) {
  const { state, adicionarInsumo, editarInsumo, excluirInsumo } = store
  const { insumos = [], fichasTecnicas = [] } = state

  const [busca, setBusca] = useState('')
  const [modalNovo, setModalNovo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [formEdit, setFormEdit] = useState({})
  const [gruposAbertos, setGruposAbertos] = useState({})   // grupo → bool (aberto por padrão)

  const [novoInsumo, setNovoInsumo] = useState({
    nome: '',
    un: 'KG',
    valorUnitario: '',
    fatorCorrecao: 1.000,
    categoria: 'OUTROS',
  })

  const listaFiltrada = insumos.filter(i =>
    (i.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (i.categoria || '').toLowerCase().includes(busca.toLowerCase())
  )

  // Agrupa itens filtrados por grupo pai
  const agrupadoPorGrupo = GRUPOS.map(g => ({
    ...g,
    itens: listaFiltrada.filter(i => g.subcats.includes((i.categoria || 'OUTROS').toUpperCase())),
  })).filter(g => g.itens.length > 0)

  const toggleGrupo = (grupo) =>
    setGruposAbertos(prev => ({ ...prev, [grupo]: !prev[grupo] }))

  const isAberto = (grupo) =>
    gruposAbertos[grupo] === undefined ? true : gruposAbertos[grupo]  // aberto por padrão

  const handleSalvarNovo = () => {
    if (!novoInsumo.nome.trim()) {
      alert('Informe o nome do item/insumo.')
      return
    }
    const valorUnitario = parseFloat(String(novoInsumo.valorUnitario).replace(',', '.')) || 0
    const fatorCorrecao = parseFloat(String(novoInsumo.fatorCorrecao).replace(',', '.')) || 1.000

    adicionarInsumo({
      nome: novoInsumo.nome.trim().toUpperCase(),
      un: novoInsumo.un.trim().toUpperCase() || 'KG',
      valorUnitario,
      fatorCorrecao,
      categoria: (novoInsumo.categoria || 'OUTROS').toUpperCase(),
    })

    setNovoInsumo({ nome: '', un: 'KG', valorUnitario: '', fatorCorrecao: 1.000, categoria: 'OUTROS' })
    setModalNovo(false)
  }

  const handleIniciarEdicao = (item) => {
    setEditandoId(item.id)
    setFormEdit({
      nome: item.nome,
      un: item.un,
      valorUnitario: item.valorUnitario,
      fatorCorrecao: item.fatorCorrecao,
      categoria: item.categoria || 'OUTROS',
    })
  }

  const handleSalvarEdicao = (id) => {
    const valorUnitario = parseFloat(String(formEdit.valorUnitario).replace(',', '.')) || 0
    const fatorCorrecao = parseFloat(String(formEdit.fatorCorrecao).replace(',', '.')) || 1.000

    editarInsumo(id, {
      nome: (formEdit.nome || '').trim().toUpperCase(),
      un: (formEdit.un || 'KG').trim().toUpperCase(),
      valorUnitario,
      fatorCorrecao,
      categoria: (formEdit.categoria || 'OUTROS').toUpperCase(),
    })
    setEditandoId(null)
  }

  const thStyle = (extra = {}) => ({
    background: '#2e7d32',
    color: '#fff',
    padding: '8px 10px',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.3px',
    ...extra,
  })

  const renderLinhaItem = (item, idx) => {
    const editando = editandoId === item.id
    const fichasQueUsam = (fichasTecnicas || []).filter(f =>
      (f.insumos || []).some(ins => (ins.item || '').trim().toUpperCase() === item.nome.trim().toUpperCase())
    )
    return (
      <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fdfdfd' : '#f7fbf7' }}>
        {/* NOME */}
        <td style={{ padding: '7px 10px', fontWeight: 700, borderBottom: '1px solid #e8e8e8', fontSize: '13px' }}>
          {editando ? (
            <input
              type="text"
              value={formEdit.nome}
              onChange={e => setFormEdit({ ...formEdit, nome: e.target.value })}
              style={{ width: '100%', padding: '4px 6px', fontSize: '13px', textTransform: 'uppercase' }}
            />
          ) : item.nome}
        </td>

        {/* CATEGORIA (somente edição) */}
        <td style={{ padding: '7px 10px', textAlign: 'center', borderBottom: '1px solid #e8e8e8', fontSize: '11px' }}>
          {editando ? (
            <select
              value={formEdit.categoria}
              onChange={e => setFormEdit({ ...formEdit, categoria: e.target.value })}
              style={{ padding: '4px 6px', fontSize: '12px', borderRadius: 4, border: '1px solid #ccc' }}
            >
              {TODAS_CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          ) : (
            <span style={{
              background: getGrupo(item.categoria).corFundo,
              color: getGrupo(item.categoria).cor,
              border: `1px solid ${getGrupo(item.categoria).corBorda}`,
              borderRadius: 4,
              padding: '2px 7px',
              fontWeight: 700,
              fontSize: '10px',
            }}>
              {item.categoria || 'OUTROS'}
            </span>
          )}
        </td>

        {/* UNIDADE */}
        <td style={{ padding: '7px 10px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
          {editando ? (
            <input
              type="text"
              value={formEdit.un}
              onChange={e => setFormEdit({ ...formEdit, un: e.target.value })}
              style={{ width: '60px', padding: '4px 6px', fontSize: '13px', textAlign: 'center', textTransform: 'uppercase' }}
            />
          ) : (
            <span className="badge-saved" style={{ background: '#e8f5e9', color: '#2e7d32' }}>{item.un}</span>
          )}
        </td>

        {/* VALOR */}
        <td style={{ padding: '7px 10px', textAlign: 'right', fontWeight: 700, borderBottom: '1px solid #e8e8e8', color: '#1b5e20' }}>
          {editando ? (
            <input
              type="number" step="0.01"
              value={formEdit.valorUnitario}
              onChange={e => setFormEdit({ ...formEdit, valorUnitario: e.target.value })}
              style={{ width: '90px', padding: '4px 6px', fontSize: '13px', textAlign: 'right' }}
            />
          ) : `R$ ${(Number(item.valorUnitario) || 0).toFixed(2).replace('.', ',')}`}
        </td>

        {/* FC */}
        <td style={{ padding: '7px 10px', textAlign: 'right', borderBottom: '1px solid #e8e8e8' }}>
          {editando ? (
            <input
              type="number" step="0.001"
              value={formEdit.fatorCorrecao}
              onChange={e => setFormEdit({ ...formEdit, fatorCorrecao: e.target.value })}
              style={{ width: '90px', padding: '4px 6px', fontSize: '13px', textAlign: 'right' }}
            />
          ) : (Number(item.fatorCorrecao) || 1).toFixed(3).replace('.', ',')}
        </td>

        {/* USO EM FICHAS */}
        <td style={{ padding: '7px 10px', textAlign: 'center', borderBottom: '1px solid #e8e8e8', fontSize: '11px' }}>
          {fichasQueUsam.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center' }}>
              {fichasQueUsam.map(f => (
                <button
                  key={f.id}
                  type="button"
                  className="btn btn-xs"
                  style={{ background: '#e8f5e9', color: '#1b5e20', border: '1px solid #81c784', fontSize: '11px', padding: '2px 7px', cursor: 'pointer', borderRadius: 4, fontWeight: 600 }}
                  onClick={() => onOpenFicha && onOpenFicha({ nomeAbrev: f.nomePreparacao, id: f.pratoId })}
                  title={`Abrir Ficha Técnica: ${f.nomePreparacao}`}
                >
                  📄 {f.nomePreparacao}
                </button>
              ))}
            </div>
          ) : <span style={{ color: '#aaa', fontSize: '11px' }}>—</span>}
        </td>

        {/* AÇÕES */}
        <td style={{ padding: '7px 10px', textAlign: 'center', borderBottom: '1px solid #e8e8e8' }}>
          {editando ? (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button className="btn btn-primary" style={{ padding: '4px 8px' }} onClick={() => handleSalvarEdicao(item.id)}>
                <Check size={14} />
              </button>
              <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setEditandoId(null)}>
                <X size={14} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
              <button className="btn-icon" title="Editar" onClick={() => handleIniciarEdicao(item)}>
                <Edit2 size={15} />
              </button>
              <button
                className="btn-icon btn-danger-soft"
                title="Excluir"
                onClick={() => {
                  if (window.confirm(`Excluir o insumo "${item.nome}"?`)) excluirInsumo(item.id)
                }}
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </td>
      </tr>
    )
  }

  return (
    <div className="page no-print">
      {/* Cabeçalho */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2><DollarSign size={22} style={{ verticalAlign: 'middle', marginRight: 6, color: '#2e7d32' }} />Tabela de Valores & Insumos</h2>
          <p className="page-sub">
            Cadastre os preços unitários (R\$) e fatores de correção. Os itens são organizados por categoria para facilitar a gestão.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
          <Plus size={16} /> + Novo Insumo
        </button>
      </div>

      {/* Busca */}
      <div style={{ margin: '16px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            className="date-input"
            style={{ width: '100%', paddingLeft: 32 }}
            placeholder="Buscar por nome ou categoria..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>
          {listaFiltrada.length} item(ns)
        </span>
      </div>

      {/* Tabela por grupo */}
      {agrupadoPorGrupo.length === 0 && (
        <div style={{ padding: 32, textAlign: 'center', color: '#888', background: '#fff', borderRadius: 8, border: '1px solid #e0e0e0' }}>
          Nenhum insumo encontrado. Clique em <strong>+ Novo Insumo</strong> para cadastrar.
        </div>
      )}

      {agrupadoPorGrupo.map(g => (
        <div key={g.grupo} style={{ marginBottom: 16, borderRadius: 8, overflow: 'hidden', border: `1.5px solid ${g.corBorda}` }}>
          {/* Cabeçalho do grupo (clicável para recolher) */}
          <button
            type="button"
            onClick={() => toggleGrupo(g.grupo)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              background: g.corFundo,
              border: 'none',
              borderBottom: isAberto(g.grupo) ? `1.5px solid ${g.corBorda}` : 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            {isAberto(g.grupo)
              ? <ChevronDown size={16} color={g.cor} />
              : <ChevronRight size={16} color={g.cor} />}
            <span style={{ fontSize: '14px', fontWeight: 800, color: g.cor, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {g.icone} &nbsp;{g.grupo}
            </span>
            <span style={{
              marginLeft: 'auto',
              background: g.cor,
              color: '#fff',
              borderRadius: 10,
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 8px',
            }}>
              {g.itens.length}
            </span>
          </button>

          {/* Subcategorias e itens */}
          {isAberto(g.grupo) && (() => {
            // Agrupa dentro do grupo por subcategoria
            const subcats = [...new Set(g.itens.map(i => (i.categoria || 'OUTROS').toUpperCase()))]

            return (
              <div className="edit-table-wrapper" style={{ background: '#fff', margin: 0 }}>
                <table className="cardapio-table" style={{ marginBottom: 0 }}>
                  <thead>
                    <tr>
                      <th style={thStyle({ textAlign: 'left', width: '28%' })}>ITEM / INSUMO</th>
                      <th style={thStyle({ textAlign: 'center', width: '10%' })}>CATEGORIA</th>
                      <th style={thStyle({ textAlign: 'center', width: '8%' })}>UN.</th>
                      <th style={thStyle({ textAlign: 'right', width: '14%' })}>VALOR UNIT. (R$)</th>
                      <th style={thStyle({ textAlign: 'right', width: '12%' })}>FC</th>
                      <th style={thStyle({ textAlign: 'center', width: '17%' })}>USO EM FICHAS</th>
                      <th style={thStyle({ textAlign: 'center', width: '11%' })}>AÇÕES</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subcats.map(subcat => {
                      const itensSubcat = g.itens.filter(i => (i.categoria || 'OUTROS').toUpperCase() === subcat)
                      return (
                        <React.Fragment key={subcat}>
                          {/* Linha separadora de subcategoria (só aparece se há mais de 1 subcat no grupo) */}
                          {subcats.length > 1 && (
                            <tr>
                              <td colSpan={7} style={{
                                padding: '5px 12px',
                                background: g.corFundo,
                                color: g.cor,
                                fontWeight: 800,
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                borderBottom: `1px solid ${g.corBorda}`,
                              }}>
                                {g.icone} {subcat}
                              </td>
                            </tr>
                          )}
                          {itensSubcat.map((item, idx) => renderLinhaItem(item, idx))}
                        </React.Fragment>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })()}
        </div>
      ))}

      {/* Modal Novo Insumo */}
      {modalNovo && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3><Plus size={16} /> Novo Insumo / Matéria-Prima</h3>
              <button className="icon-btn" onClick={() => setModalNovo(false)}><X size={15} /></button>
            </div>
            <div className="modal-body" style={{ padding: 18 }}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Nome do Item / Insumo *</label>
                <input
                  type="text"
                  placeholder="Ex: PEITO DE FRANGO, CENOURA, ARROZ..."
                  value={novoInsumo.nome}
                  onChange={e => setNovoInsumo({ ...novoInsumo, nome: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Categoria *</label>
                <select
                  value={novoInsumo.categoria}
                  onChange={e => setNovoInsumo({ ...novoInsumo, categoria: e.target.value })}
                  style={{ width: '100%', padding: '7px 10px', fontSize: '13px', borderRadius: 4, border: '1px solid var(--gray-300)' }}
                >
                  <optgroup label="🥩 Carnes / Proteínas">
                    <option value="AVES">AVES</option>
                    <option value="BOVINOS">BOVINOS</option>
                    <option value="SUÍNOS">SUÍNOS</option>
                    <option value="PEIXES">PEIXES</option>
                    <option value="OVOS">OVOS</option>
                  </optgroup>
                  <optgroup label="🥦 Hortifrúti">
                    <option value="HORTIFRÚTI">HORTIFRÚTI</option>
                  </optgroup>
                  <optgroup label="🌾 Secos / Cereais / Leguminosas">
                    <option value="SECOS">SECOS</option>
                  </optgroup>
                  <optgroup label="🧂 Condimentos / Temperos">
                    <option value="CONDIMENTOS">CONDIMENTOS</option>
                  </optgroup>
                  <optgroup label="🥛 Laticínios">
                    <option value="LATICÍNIOS">LATICÍNIOS</option>
                  </optgroup>
                  <optgroup label="📦 Outros">
                    <option value="OUTROS">OUTROS</option>
                  </optgroup>
                </select>
              </div>

              <div className="form-grid form-grid-3" style={{ gap: 10 }}>
                <div className="form-group">
                  <label>Unidade</label>
                  <input
                    type="text"
                    placeholder="KG, ML, UN"
                    value={novoInsumo.un}
                    onChange={e => setNovoInsumo({ ...novoInsumo, un: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label>Preço (R$) *</label>
                  <input
                    type="number" step="0.01"
                    placeholder="Ex: 11.20"
                    value={novoInsumo.valorUnitario}
                    onChange={e => setNovoInsumo({ ...novoInsumo, valorUnitario: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fator Corr. (FC)</label>
                  <input
                    type="number" step="0.001"
                    placeholder="Ex: 1.000"
                    value={novoInsumo.fatorCorrecao}
                    onChange={e => setNovoInsumo({ ...novoInsumo, fatorCorrecao: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalNovo(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSalvarNovo}>
                <Check size={14} /> Cadastrar Insumo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
