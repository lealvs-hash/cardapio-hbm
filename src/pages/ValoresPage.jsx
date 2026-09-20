import React, { useState } from 'react'
import { Plus, Trash2, Edit2, Check, X, Search, DollarSign } from 'lucide-react'

export default function ValoresPage({ store, onOpenFicha }) {
  const { state, adicionarInsumo, editarInsumo, excluirInsumo } = store
  const { insumos = [], fichasTecnicas = [] } = state

  const [busca, setBusca] = useState('')
  const [modalNovo, setModalNovo] = useState(false)
  const [editandoId, setEditandoId] = useState(null)
  const [formEdit, setFormEdit] = useState({})

  const [novoInsumo, setNovoInsumo] = useState({
    nome: '',
    un: 'KG',
    valorUnitario: '',
    fatorCorrecao: 1.000,
  })

  const listaFiltrada = insumos.filter(i =>
    (i.nome || '').toLowerCase().includes(busca.toLowerCase())
  )

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
    })

    setNovoInsumo({ nome: '', un: 'KG', valorUnitario: '', fatorCorrecao: 1.000 })
    setModalNovo(false)
  }

  const handleIniciarEdicao = (item) => {
    setEditandoId(item.id)
    setFormEdit({
      nome: item.nome,
      un: item.un,
      valorUnitario: item.valorUnitario,
      fatorCorrecao: item.fatorCorrecao,
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
    })
    setEditandoId(null)
  }

  return (
    <div className="page no-print">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2><DollarSign size={22} style={{ verticalAlign: 'middle', marginRight: 6, color: '#2e7d32' }} />Tabela de Valores & Insumos</h2>
          <p className="page-sub">
            Cadastre os preços unitários (R$) e fatores de correção dos insumos e matérias-primas para cálculo automático do custo das Fichas Técnicas.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setModalNovo(true)}>
          <Plus size={16} /> + Novo Insumo
        </button>
      </div>

      <div style={{ margin: '16px 0', display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 380 }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
          <input
            type="text"
            className="date-input"
            style={{ width: '100%', paddingLeft: 32 }}
            placeholder="Buscar por nome do insumo..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <span style={{ fontSize: '13px', color: '#666', fontWeight: 600 }}>
          {listaFiltrada.length} item(ns) encontrado(s)
        </span>
      </div>

      <div className="edit-table-wrapper" style={{ background: '#fff' }}>
        <table className="cardapio-table">
          <thead>
            <tr>
              <th style={{ background: '#2e7d32', color: '#fff', padding: '8px 10px', textAlign: 'left', width: '28%' }}>ITEM / INSUMO</th>
              <th style={{ background: '#2e7d32', color: '#fff', padding: '8px 10px', textAlign: 'center', width: '10%' }}>UNIDADE</th>
              <th style={{ background: '#2e7d32', color: '#fff', padding: '8px 10px', textAlign: 'right', width: '16%' }}>VALOR UNITÁRIO (R$)</th>
              <th style={{ background: '#2e7d32', color: '#fff', padding: '8px 10px', textAlign: 'right', width: '16%' }}>FATOR CORREÇÃO (FC)</th>
              <th style={{ background: '#2e7d32', color: '#fff', padding: '8px 10px', textAlign: 'center', width: '18%' }}>USO EM FICHAS</th>
              <th style={{ background: '#2e7d32', color: '#fff', padding: '8px 10px', textAlign: 'center', width: '12%' }}>AÇÕES</th>
            </tr>
          </thead>
          <tbody>
            {listaFiltrada.map((item, idx) => {
              const editando = editandoId === item.id
              const fichasQueUsam = (fichasTecnicas || []).filter(f =>
                (f.insumos || []).some(ins => (ins.item || '').trim().toUpperCase() === item.nome.trim().toUpperCase())
              )
              return (
                <tr key={item.id} style={{ background: idx % 2 === 0 ? '#fdfdfd' : '#f7fbf7' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 700, borderBottom: '1px solid #e0e0e0' }}>
                    {editando ? (
                      <input
                        type="text"
                        value={formEdit.nome}
                        onChange={e => setFormEdit({ ...formEdit, nome: e.target.value })}
                        style={{ width: '100%', padding: '4px 6px', fontSize: '13px', textTransform: 'uppercase' }}
                      />
                    ) : (
                      item.nome
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
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
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700, borderBottom: '1px solid #e0e0e0', color: '#1b5e20' }}>
                    {editando ? (
                      <input
                        type="number"
                        step="0.01"
                        value={formEdit.valorUnitario}
                        onChange={e => setFormEdit({ ...formEdit, valorUnitario: e.target.value })}
                        style={{ width: '90px', padding: '4px 6px', fontSize: '13px', textAlign: 'right' }}
                      />
                    ) : (
                      `R$ ${(Number(item.valorUnitario) || 0).toFixed(2).replace('.', ',')}`
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', borderBottom: '1px solid #e0e0e0' }}>
                    {editando ? (
                      <input
                        type="number"
                        step="0.001"
                        value={formEdit.fatorCorrecao}
                        onChange={e => setFormEdit({ ...formEdit, fatorCorrecao: e.target.value })}
                        style={{ width: '90px', padding: '4px 6px', fontSize: '13px', textAlign: 'right' }}
                      />
                    ) : (
                      (Number(item.fatorCorrecao) || 1).toFixed(3).replace('.', ',')
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid #e0e0e0', fontSize: '11px' }}>
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
                    ) : (
                      <span style={{ color: '#aaa', fontSize: '11px' }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
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
                        <button className="btn-icon" title="Editar valor" onClick={() => handleIniciarEdicao(item)}>
                          <Edit2 size={15} />
                        </button>
                        <button
                          className="btn-icon btn-danger-soft"
                          title="Excluir insumo"
                          onClick={() => {
                            if (window.confirm(`Excluir o insumo "${item.nome}"?`)) {
                              excluirInsumo(item.id)
                            }
                          }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
            {listaFiltrada.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#888' }}>
                  Nenhum insumo encontrado. Clique em <strong>+ Novo Insumo</strong> para cadastrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Novo Insumo */}
      {modalNovo && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3><Plus size={16} /> Novo Insumo / Matéria-Prima</h3>
              <button className="icon-btn" onClick={() => setModalNovo(false)}><X size={15} /></button>
            </div>
            <div className="modal-body" style={{ padding: 18 }}>
              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Nome do Item / Insumo *</label>
                <input
                  type="text"
                  placeholder="Ex: FRANGO - FILÉ, ALHO, CEBOLA..."
                  value={novoInsumo.nome}
                  onChange={e => setNovoInsumo({ ...novoInsumo, nome: e.target.value.toUpperCase() })}
                />
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
                    type="number"
                    step="0.01"
                    placeholder="Ex: 11.20"
                    value={novoInsumo.valorUnitario}
                    onChange={e => setNovoInsumo({ ...novoInsumo, valorUnitario: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Fator Corr. (FC)</label>
                  <input
                    type="number"
                    step="0.001"
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
