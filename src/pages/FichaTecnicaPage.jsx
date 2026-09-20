import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Printer, Save, Check, X, Image as ImageIcon, Calculator, FileSpreadsheet, RefreshCw, ChevronDown } from 'lucide-react'

export default function FichaTecnicaPage({ store, selectedFichaId, setSelectedFichaId }) {
  const { state, salvarFichaTecnica, excluirFichaTecnica } = store
  const { fichasTecnicas = [], insumos = [], proteinas = [], guarnicoes = [] } = state

  const [fichaSelecionadaId, setFichaSelecionadaId] = useState(
    selectedFichaId || fichasTecnicas[0]?.id || ''
  )
  const [modalNova, setModalNova] = useState(false)
  const [modoEdicao, setModoEdicao] = useState(false)

  // Sincroniza se o App mudar o selectedFichaId externamente (vindo de Pratos ou Valores)
  useEffect(() => {
    if (selectedFichaId) {
      setFichaSelecionadaId(selectedFichaId)
      setModoEdicao(false)
      setFormFicha(null)
    }
  }, [selectedFichaId])

  const fichaAtiva = fichasTecnicas.find(f => f.id === fichaSelecionadaId) || fichasTecnicas[0]

  // Estado da Ficha em edição
  const [formFicha, setFormFicha] = useState(null)

  // Ao trocar de ficha ou entrar em edição
  const iniciarEdicao = (ficha) => {
    setFormFicha(JSON.parse(JSON.stringify(ficha)))
    setModoEdicao(true)
  }

  const cancelarEdicao = () => {
    setModoEdicao(false)
    setFormFicha(null)
  }

  const salvarEdicao = () => {
    if (!formFicha.nomePreparacao.trim()) {
      alert('Informe o nome da preparação.')
      return
    }
    salvarFichaTecnica(formFicha)
    setFichaSelecionadaId(formFicha.id)
    if (setSelectedFichaId) setSelectedFichaId(formFicha.id)
    setModoEdicao(false)
    setFormFicha(null)
  }

  // Sincroniza os ingredientes desta ficha técnica com a tabela mais atual de Valores (preços e fatores de correção)
  const sincronizarComValores = () => {
    const fichaAlvo = modoEdicao ? formFicha : fichaAtiva
    if (!fichaAlvo) return
    let atualizados = 0
    const novosInsumos = (fichaAlvo.insumos || []).map(ins => {
      const match = insumos.find(i => (i.nome || '').trim().toUpperCase() === (ins.item || '').trim().toUpperCase())
      if (match) {
        atualizados++
        return {
          ...ins,
          un: match.un || ins.un,
          valorUnitario: match.valorUnitario,
          fatorCorrecao: match.fatorCorrecao !== undefined ? match.fatorCorrecao : ins.fatorCorrecao,
        }
      }
      return ins
    })

    if (modoEdicao) {
      setFormFicha({ ...formFicha, insumos: novosInsumos })
    } else {
      salvarFichaTecnica({ ...fichaAlvo, insumos: novosInsumos })
    }
    alert(`Sincronização concluída! ${atualizados} insumo(s) tiveram seus preços e fatores de correção atualizados com a Tabela de Valores.`)
  }

  const criarNovaFicha = (nome, pratoId = null) => {
    const id = `ft_${Date.now()}`
    const prato = pratoId ? [...proteinas, ...guarnicoes].find(p => p.id === pratoId) : null
    const baseInsumo = insumos.find(i =>
      nome.toUpperCase().includes(i.nome.toUpperCase())
    ) || insumos[0] || { nome: 'FRANGO - FILÉ', un: 'KG', valorUnitario: 11.20, fatorCorrecao: 1.0 }

    const nova = {
      id,
      pratoId: pratoId || undefined,
      nomePreparacao: nome.toUpperCase(),
      profissional: 'Nutricionista HBM',
      fotoUrl: '',
      rendimentoPorcoes: 20,
      modoPreparo: prato?.metodoPreparo || `1. Higienização e pesagem dos ingredientes.\n2. Pré-preparo e cortes.\n3. Cocção até ponto seguro e saboroso.\n4. Ajustar sal e servir em temperatura adequada.`,
      insumos: [
        {
          item: baseInsumo.nome,
          un: baseInsumo.un || 'KG',
          pesoBruto: 2.000,
          pesoLiquido: 1.800,
          fatorCorrecao: baseInsumo.fatorCorrecao || 1.000,
          valorUnitario: baseInsumo.valorUnitario || 0
        },
        {
          item: 'CEBOLA',
          un: 'KG',
          pesoBruto: 0.300,
          pesoLiquido: 0.250,
          fatorCorrecao: 1.000,
          valorUnitario: insumos.find(i => i.nome === 'CEBOLA')?.valorUnitario || 3.20,
        },
        {
          item: 'ALHO',
          un: 'KG',
          pesoBruto: 0.050,
          pesoLiquido: 0.040,
          fatorCorrecao: 1.000,
          valorUnitario: insumos.find(i => i.nome === 'ALHO')?.valorUnitario || 20.99,
        },
        {
          item: 'SAL REFINADO',
          un: 'KG',
          pesoBruto: 0.050,
          pesoLiquido: 0.050,
          fatorCorrecao: 1.000,
          valorUnitario: insumos.find(i => i.nome === 'SAL REFINADO')?.valorUnitario || 2.00,
        }
      ],
    }
    salvarFichaTecnica(nova)
    setFichaSelecionadaId(id)
    if (setSelectedFichaId) setSelectedFichaId(id)
    setModalNova(false)
    iniciarEdicao(nova)
  }

  // Cálculos da Ficha
  const fichaAtual = modoEdicao ? formFicha : fichaAtiva

  const insumosCalculados = (fichaAtual?.insumos || []).map(ins => {
    const pb = Number(ins.pesoBruto) || 0
    const pl = Number(ins.pesoLiquido) || 0
    const fc = pl > 0 && pb > 0 ? (pb / pl) : (Number(ins.fatorCorrecao) || 1.000)
    const vu = Number(ins.valorUnitario) || 0
    const vt = pb * vu
    return {
      ...ins,
      fcCalculado: Number(ins.fatorCorrecao) || fc,
      valorTotal: vt,
    }
  })

  const totalInsumos = insumosCalculados.reduce((acc, curr) => acc + curr.valorTotal, 0)
  const rendimento = Number(fichaAtual?.rendimentoPorcoes) || 1
  const custoPorcao = rendimento > 0 ? totalInsumos / rendimento : 0

  // Manipulação de Insumos durante Edição
  const handleAddInsumoLinha = () => {
    const defaultInsumo = insumos[0] || { nome: 'NOVO ITEM', un: 'KG', valorUnitario: 0, fatorCorrecao: 1.0 }
    const novaLinha = {
      item: defaultInsumo.nome,
      un: defaultInsumo.un || 'KG',
      pesoBruto: 0.100,
      pesoLiquido: 0.100,
      fatorCorrecao: defaultInsumo.fatorCorrecao || 1.000,
      valorUnitario: defaultInsumo.valorUnitario || 0.0,
    }
    setFormFicha({
      ...formFicha,
      insumos: [...(formFicha.insumos || []), novaLinha],
    })
  }

  const handleRemoveInsumoLinha = (idx) => {
    const list = [...formFicha.insumos]
    list.splice(idx, 1)
    setFormFicha({ ...formFicha, insumos: list })
  }

  const handleInsumoChange = (idx, field, val) => {
    const list = [...formFicha.insumos]
    list[idx] = { ...list[idx], [field]: val }

    // Se mudou o nome para algum dos insumos cadastrados, atualiza preço e unidade automaticamente
    if (field === 'item') {
      const match = insumos.find(i => i.nome.toUpperCase() === val.toUpperCase())
      if (match) {
        list[idx].un = match.un
        list[idx].valorUnitario = match.valorUnitario
        list[idx].fatorCorrecao = match.fatorCorrecao
      }
    }
    setFormFicha({ ...formFicha, insumos: list })
  }

  return (
    <div className="page">
      {/* Barra superior de seleção de ficha */}
      <div className="page-toolbar no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div className="toolbar-left" style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <label style={{ fontWeight: 700, fontSize: '12px', color: '#1565c0', textTransform: 'uppercase' }}>
            Ficha Técnica:
          </label>
          <div className="select-wrapper" style={{ minWidth: 260 }}>
            <select
              value={fichaAtual?.id || ''}
              onChange={e => {
                if (modoEdicao && !window.confirm('Descartar alterações não salvas?')) return
                setFichaSelecionadaId(e.target.value)
                setModoEdicao(false)
              }}
            >
              {fichasTecnicas.map(f => (
                <option key={f.id} value={f.id}>{f.nomePreparacao}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-secondary" style={{ padding: '6px 12px' }} onClick={() => setModalNova(true)}>
            <Plus size={15} /> Nova Ficha
          </button>
        </div>

        <div className="toolbar-right" style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, color: '#2e7d32', borderColor: '#a5d6a7', fontWeight: 600 }}
            onClick={sincronizarComValores}
            title="Atualiza os preços unitários e fatores de correção com base na Tabela de Valores"
          >
            <RefreshCw size={14} /> Sincronizar com Valores
          </button>

          {modoEdicao ? (
            <>
              <button className="btn btn-primary" onClick={salvarEdicao}>
                <Check size={16} /> Salvar Ficha
              </button>
              <button className="btn btn-secondary" onClick={cancelarEdicao}>
                <X size={16} /> Cancelar
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-primary" onClick={() => iniciarEdicao(fichaAtual)}>
                <Edit2 size={16} /> Editar Ficha
              </button>
              <button
                className="btn-icon btn-danger-soft"
                title="Excluir Ficha"
                onClick={() => {
                  if (fichasTecnicas.length <= 1) {
                    alert('Você deve manter ao menos uma ficha técnica.')
                    return
                  }
                  if (window.confirm(`Excluir a ficha "${fichaAtual.nomePreparacao}"?`)) {
                    excluirFichaTecnica(fichaAtual.id)
                    setFichaSelecionadaId(fichasTecnicas.find(f => f.id !== fichaAtual.id)?.id || '')
                  }
                }}
              >
                <Trash2 size={16} />
              </button>
              <button className="btn btn-secondary" onClick={() => window.print()}>
                <Printer size={16} /> Imprimir A4
              </button>
            </>
          )}
        </div>
      </div>

      {/* DOCUMENTO DA FICHA TÉCNICA - MODELO ANEXO EXATO */}
      <div className="ficha-tecnica-doc" style={{
        maxWidth: 820,
        margin: '0 auto 40px',
        background: '#fff',
        padding: '16px 20px',
        border: '1px solid #000',
        fontFamily: 'Arial, sans-serif',
        boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
      }}>
        {/* Título Principal */}
        <div style={{
          background: '#2e7d32',
          color: '#fff',
          textAlign: 'center',
          fontWeight: 800,
          fontSize: '13pt',
          padding: '4px 0',
          letterSpacing: '0.5px',
          border: '1.5px solid #000',
          borderBottom: 'none'
        }}>
          FICHA TÉCNICA DE PREPARAÇÃO
        </div>

        {/* Cabeçalho com Nome da Preparação e Foto */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', border: '1.5px solid #000' }}>
          {/* Lado Esquerdo: Nome e Profissional */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              borderBottom: '1.5px solid #000',
              padding: '6px 8px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '11pt'
            }}>
              NOME DA PREPARAÇÃO:
            </div>
            <div style={{
              borderBottom: '1.5px solid #000',
              padding: '10px 8px',
              textAlign: 'center',
              fontWeight: 900,
              fontSize: '14pt',
              color: '#000',
              minHeight: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {modoEdicao ? (
                <input
                  type="text"
                  value={formFicha.nomePreparacao}
                  onChange={e => setFormFicha({ ...formFicha, nomePreparacao: e.target.value.toUpperCase() })}
                  style={{ width: '90%', textAlign: 'center', fontWeight: 900, fontSize: '13pt', padding: 4 }}
                />
              ) : (
                fichaAtual?.nomePreparacao
              )}
            </div>
            <div style={{
              borderBottom: '1.5px solid #000',
              padding: '5px 8px',
              textAlign: 'center',
              fontWeight: 800,
              fontSize: '10pt'
            }}>
              PROFISSIONAL:
            </div>
            <div style={{
              padding: '8px',
              textAlign: 'center',
              fontSize: '10pt',
              fontWeight: 600,
              color: '#333'
            }}>
              {modoEdicao ? (
                <input
                  type="text"
                  value={formFicha.profissional}
                  onChange={e => setFormFicha({ ...formFicha, profissional: e.target.value })}
                  style={{ width: '80%', textAlign: 'center', padding: 3 }}
                />
              ) : (
                fichaAtual?.profissional || '------------------------------'
              )}
            </div>
          </div>

          {/* Lado Direito: Imagem Ilustrativa da Receita */}
          <div style={{
            borderLeft: '1.5px solid #000',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 6,
            background: '#fafafa',
            position: 'relative',
            minHeight: 140
          }}>
            {fichaAtual?.fotoUrl ? (
              <img
                src={fichaAtual.fotoUrl}
                alt={fichaAtual.nomePreparacao}
                style={{ width: '100%', height: '100%', maxHeight: 150, objectFit: 'cover', borderRadius: 4 }}
              />
            ) : (
              <div style={{ textAlign: 'center', color: '#888', padding: 12 }}>
                <ImageIcon size={44} style={{ opacity: 0.4, margin: '0 auto 6px' }} />
                <div style={{ fontSize: '9pt' }}>Foto do Prato</div>
              </div>
            )}
            {modoEdicao && (
              <div style={{ width: '100%', marginTop: 6 }}>
                <input
                  type="text"
                  placeholder="URL da foto (opcional)"
                  value={formFicha.fotoUrl || ''}
                  onChange={e => setFormFicha({ ...formFicha, fotoUrl: e.target.value })}
                  style={{ width: '100%', fontSize: '8pt', padding: 3 }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Faixa Título INSUMOS */}
        <div style={{
          textAlign: 'center',
          fontWeight: 900,
          fontSize: '11pt',
          padding: '4px 0',
          letterSpacing: '1px',
          border: '1.5px solid #000',
          borderTop: 'none',
          background: '#fff'
        }}>
          INSUMOS
        </div>

        {/* Tabela de Insumos */}
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1.5px solid #000',
          tableLayout: 'fixed',
          fontSize: '8.5pt'
        }}>
          <thead>
            <tr style={{ background: '#2e7d32', color: '#fff', textAlign: 'center', fontWeight: 800 }}>
              <th style={{ border: '1px solid #000', padding: '5px 4px', width: '38%', textAlign: 'left' }}>ITEM</th>
              <th style={{ border: '1px solid #000', padding: '5px 2px', width: '8%' }}>UN</th>
              <th style={{ border: '1px solid #000', padding: '5px 2px', width: '13%' }}>Peso Bruto</th>
              <th style={{ border: '1px solid #000', padding: '5px 2px', width: '13%' }}>Peso Líquido</th>
              <th style={{ border: '1px solid #000', padding: '5px 2px', width: '12%' }}>Fator Correção</th>
              <th style={{ border: '1px solid #000', padding: '5px 2px', width: '13%' }}>Valor Unitário</th>
              <th style={{ border: '1px solid #000', padding: '5px 2px', width: '13%' }}>Valor Total</th>
              {modoEdicao && <th className="no-print" style={{ border: '1px solid #000', width: '6%' }}></th>}
            </tr>
          </thead>
          <tbody>
            {insumosCalculados.map((ins, idx) => (
              <tr key={idx} style={{ textAlign: 'center', borderBottom: '1px solid #000' }}>
                <td style={{ border: '1px solid #000', padding: '4px 6px', textAlign: 'left', fontWeight: 700 }}>
                  {modoEdicao ? (
                    <input
                      type="text"
                      list="insumos-sugestoes"
                      value={ins.item}
                      onChange={e => handleInsumoChange(idx, 'item', e.target.value.toUpperCase())}
                      style={{ width: '100%', fontSize: '8pt', padding: '2px 4px', fontWeight: 700 }}
                    />
                  ) : (
                    ins.item
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 2px' }}>
                  {modoEdicao ? (
                    <input
                      type="text"
                      value={ins.un}
                      onChange={e => handleInsumoChange(idx, 'un', e.target.value.toUpperCase())}
                      style={{ width: '100%', textAlign: 'center', fontSize: '8pt', padding: 2 }}
                    />
                  ) : (
                    ins.un
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 2px', textAlign: 'right' }}>
                  {modoEdicao ? (
                    <input
                      type="number"
                      step="0.001"
                      value={ins.pesoBruto}
                      onChange={e => handleInsumoChange(idx, 'pesoBruto', e.target.value)}
                      style={{ width: '100%', textAlign: 'right', fontSize: '8pt', padding: 2 }}
                    />
                  ) : (
                    Number(ins.pesoBruto).toFixed(3).replace('.', ',')
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 2px', textAlign: 'right' }}>
                  {modoEdicao ? (
                    <input
                      type="number"
                      step="0.001"
                      value={ins.pesoLiquido}
                      onChange={e => handleInsumoChange(idx, 'pesoLiquido', e.target.value)}
                      style={{ width: '100%', textAlign: 'right', fontSize: '8pt', padding: 2 }}
                    />
                  ) : (
                    Number(ins.pesoLiquido).toFixed(3).replace('.', ',')
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 2px', textAlign: 'right' }}>
                  {modoEdicao ? (
                    <input
                      type="number"
                      step="0.001"
                      value={ins.fatorCorrecao}
                      onChange={e => handleInsumoChange(idx, 'fatorCorrecao', e.target.value)}
                      style={{ width: '100%', textAlign: 'right', fontSize: '8pt', padding: 2 }}
                    />
                  ) : (
                    Number(ins.fatorCorrecao || 1).toFixed(3).replace('.', ',')
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 2px', textAlign: 'right' }}>
                  {modoEdicao ? (
                    <input
                      type="number"
                      step="0.01"
                      value={ins.valorUnitario}
                      onChange={e => handleInsumoChange(idx, 'valorUnitario', e.target.value)}
                      style={{ width: '100%', textAlign: 'right', fontSize: '8pt', padding: 2 }}
                    />
                  ) : (
                    Number(ins.valorUnitario).toFixed(2).replace('.', ',')
                  )}
                </td>
                <td style={{ border: '1px solid #000', padding: '4px 4px', textAlign: 'right', fontWeight: 800 }}>
                  {ins.valorTotal.toFixed(2).replace('.', ',')}
                </td>
                {modoEdicao && (
                  <td className="no-print" style={{ border: '1px solid #000', padding: 2 }}>
                    <button
                      className="btn-icon btn-danger-soft"
                      style={{ padding: 2 }}
                      title="Remover linha"
                      onClick={() => handleRemoveInsumoLinha(idx)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Datalist para autocompletar com valores da tabela de Valores */}
        <datalist id="insumos-sugestoes">
          {insumos.map(i => (
            <option key={i.id} value={i.nome} />
          ))}
        </datalist>

        {modoEdicao && (
          <div className="no-print" style={{ margin: '6px 0', textAlign: 'left' }}>
            <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={handleAddInsumoLinha}>
              <Plus size={13} /> Adicionar Insumo à Receita
            </button>
          </div>
        )}

        {/* Linha TOTAL DOS INSUMOS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 140px',
          border: '1.5px solid #000',
          borderTop: 'none',
          padding: '6px 12px',
          fontSize: '10pt',
          fontWeight: 800,
          background: '#fafafa'
        }}>
          <div style={{ textAlign: 'right', textTransform: 'uppercase', paddingRight: 16 }}>
            TOTAL DOS INSUMOS:
          </div>
          <div style={{ textAlign: 'right', fontWeight: 900 }}>
            R$ {totalInsumos.toFixed(2).replace('.', ',')}
          </div>
        </div>

        {/* Bloco MODO DE PREPARO */}
        <div style={{
          border: '1.5px solid #000',
          borderTop: 'none',
          padding: '8px 10px',
          fontSize: '9pt',
          lineHeight: 1.4
        }}>
          <div style={{ fontWeight: 900, textDecoration: 'underline', marginBottom: 6 }}>
            Modo de Preparo:
          </div>
          {modoEdicao ? (
            <textarea
              rows={6}
              value={formFicha.modoPreparo || ''}
              onChange={e => setFormFicha({ ...formFicha, modoPreparo: e.target.value })}
              style={{ width: '100%', padding: 8, fontSize: '9pt', fontFamily: 'inherit', resize: 'vertical' }}
              placeholder="Descreva o passo a passo da receita..."
            />
          ) : (
            <div style={{ whiteSpace: 'pre-line', color: '#222' }}>
              {fichaAtual?.modoPreparo || 'Nenhum modo de preparo informado.'}
            </div>
          )}
        </div>

        {/* Rodapé com Rendimento e Custos */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          border: '1.5px solid #000',
          borderTop: 'none',
          fontSize: '9.5pt',
          fontWeight: 800,
          background: '#fff'
        }}>
          <div style={{ borderRight: '1.5px solid #000', padding: '6px 8px' }}>
            Rendimento:{' '}
            {modoEdicao ? (
              <input
                type="number"
                value={formFicha.rendimentoPorcoes}
                onChange={e => setFormFicha({ ...formFicha, rendimentoPorcoes: e.target.value })}
                style={{ width: 65, textAlign: 'center', padding: 2, fontWeight: 800 }}
              />
            ) : (
              `${rendimento} porções`
            )}
          </div>
          <div style={{ borderRight: '1.5px solid #000', padding: '6px 8px', textAlign: 'center' }}>
            Custo total: R$ {totalInsumos.toFixed(2).replace('.', ',')}
          </div>
          <div style={{ padding: '6px 8px', textAlign: 'center', color: '#1b5e20', background: '#f1f8e9' }}>
            Custo/porção R$: {custoPorcao.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      {/* Modal Criar Nova Ficha */}
      {modalNova && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModalNova(false)}>
          <div className="modal-box" style={{ maxWidth: 480 }}>
            <div className="modal-header">
              <h3><Plus size={16} /> Nova Ficha Técnica de Preparação</h3>
              <button className="icon-btn" onClick={() => setModalNova(false)}><X size={15} /></button>
            </div>
            <div className="modal-body" style={{ padding: 18 }}>
              <div className="form-group" style={{ marginBottom: 14 }}>
                <label>Vincular a um Prato do Cardápio (Opcional):</label>
                <div className="select-wrapper">
                  <select
                    id="select-prato-nova-ficha"
                    defaultValue=""
                    onChange={e => {
                      const pId = e.target.value
                      if (!pId) return
                      const p = [...proteinas, ...guarnicoes].find(x => x.id === pId)
                      if (p) {
                        const inp = document.getElementById('nome-nova-ficha-input')
                        if (inp) inp.value = (p.nomeAbrev || p.nome).toUpperCase()
                      }
                    }}
                  >
                    <option value="">— Digitar nome livremente ou selecione abaixo —</option>
                    <optgroup label="🥩 Proteínas & Carnes">
                      {proteinas.map(p => (
                        <option key={p.id} value={p.id}>{p.nomeAbrev || p.nome} ({p.categoria || 'Proteína'})</option>
                      ))}
                    </optgroup>
                    <optgroup label="🥗 Guarnições">
                      {guarnicoes.map(g => (
                        <option key={g.id} value={g.id}>{g.nomeAbrev || g.nome}</option>
                      ))}
                    </optgroup>
                  </select>
                  <ChevronDown size={14} className="select-icon" />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 12 }}>
                <label>Nome do Prato / Preparação *</label>
                <input
                  type="text"
                  placeholder="Ex: STROGONOFF DE FRANGO, ARROZ INTEGRAL..."
                  id="nome-nova-ficha-input"
                  onKeyDown={e => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      const pratoId = document.getElementById('select-prato-nova-ficha')?.value || null
                      criarNovaFicha(e.target.value.trim(), pratoId)
                    }
                  }}
                />
              </div>
              <div className="field-hint">
                Os insumos utilizados puxam os preços unitários e fatores de correção diretamente da aba <strong>Valores</strong>.
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setModalNova(false)}>Cancelar</button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  const val = document.getElementById('nome-nova-ficha-input')?.value || ''
                  if (!val.trim()) {
                    alert('Informe o nome da preparação.')
                    return
                  }
                  const pratoId = document.getElementById('select-prato-nova-ficha')?.value || null
                  criarNovaFicha(val.trim(), pratoId)
                }}
              >
                <Check size={14} /> Criar Ficha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
