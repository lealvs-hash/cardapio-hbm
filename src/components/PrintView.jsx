import React from 'react'
import { formatarNomePastosa } from '../utils/formatUtils'

function deriveData(refeicao, proteinas, leguminosas, guarnicoes = []) {
  const prot  = proteinas.find(p => p.id === refeicao?.proteinaId)
  const altProtBranda = proteinas.find(p => p.id === refeicao?.proteinaBrandaId)
  const altProtPastosa = proteinas.find(p => p.id === refeicao?.proteinaPastosaId)
  const leg   = leguminosas.find(l => l.id === refeicao?.leguminosaId)
  const guard = guarnicoes.find(g => g.id === refeicao?.guarnicaoId)

  const protNome = prot?.nomeAbrev || prot?.nome || ''
  // null = usuário deixou explicitamente em branco; undefined = usar derivado do prato
  let protBranda = ''
  if (refeicao?.proteinaBrandaManual === null) {
    protBranda = '' // Explicitamente em branco
  } else if (refeicao?.proteinaBrandaManual !== undefined && refeicao.proteinaBrandaManual !== '') {
    protBranda = refeicao.proteinaBrandaManual
  } else if (altProtBranda) {
    protBranda = altProtBranda.nomeBranda || altProtBranda.nomeAbrev || altProtBranda.nome || ''
  } else if (prot) {
    protBranda = prot.nomeBranda || protNome
  }

  let protPastosa = ''
  if (refeicao?.proteinaPastosaManual === null) {
    protPastosa = '' // Explicitamente em branco
  } else if (refeicao?.proteinaPastosaManual !== undefined && refeicao.proteinaPastosaManual !== '') {
    protPastosa = formatarNomePastosa(refeicao.proteinaPastosaManual)
  } else if (altProtPastosa) {
    protPastosa = formatarNomePastosa(altProtPastosa)
  } else if (prot) {
    protPastosa = formatarNomePastosa(prot)
  }
  
  let protLiquida = ''
  if (refeicao?.proteinaLiquidaManual !== undefined && refeicao.proteinaLiquidaManual !== '') {
    protLiquida = refeicao.proteinaLiquidaManual
  } else if (prot?.nomeLiquida) {
    protLiquida = prot.nomeLiquida
  } else if (prot) {
    protLiquida = 'CARNE COM CALDO/MOLHO LIQUIDIFICADA'
  }

  const legNome    = leg?.nomeAbrev   || ''
  const legBranda  = leg?.nomeBranda  || ''
  const legPastosa = leg?.nomePastosa || ''
  const legLiquida = leg?.nomeLiquida || ''

  const guardNome = guard?.nomeAbrev || refeicao?.guarnicaoAbrev || ''
  const guardBranda = refeicao?.guarnicaoBranda !== undefined ? refeicao.guarnicaoBranda : (guard?.nomeBranda || guardNome)
  const guardPastosa = refeicao?.guarnicaoPastosa !== undefined ? refeicao.guarnicaoPastosa : (guard?.nomePastosa || '')
  const guardLiquida = refeicao?.guarnicaoLiquida !== undefined ? refeicao.guarnicaoLiquida : (guard?.nomeLiquida || '')
  const salada = refeicao?.saladaAbrev    || ''

  return {
    base: {
      geralDL: refeicao?.baseGeralDL || '',
      dm:      refeicao?.baseDM      || '',
      branda:  refeicao?.baseBranda  || '',
      pastosa: refeicao?.basePastosa || '',
      liquida: refeicao?.baseLiquida || '',
    },
    leg:   { geralDL: legNome, dm: legNome, branda: legBranda, pastosa: legPastosa, liquida: legLiquida },
    prot:  { geralDL: protNome, dm: protNome, branda: protBranda, pastosa: protPastosa, liquida: protLiquida },
    guard: { geralDL: guardNome, dm: guardNome, branda: guardBranda, pastosa: guardPastosa, liquida: guardLiquida },
    salada:{ geralDL: salada, dm: salada, branda: '', pastosa: '', liquida: '' },
  }
}

const COLS = [
  { key: 'geralDL', label: 'DIETA LIVRE'          },
  { key: 'dm',      label: 'DM'                   },
  { key: 'branda',  label: 'BRANDA'               },
  { key: 'pastosa', label: 'DIETA PASTOSA'        },
  { key: 'liquida', label: 'DIETA LÍQ. PASTOSA'  },
]

function MealTable({ title, refeicao, proteinas, leguminosas, guarnicoes, showSalada = false }) {
  const d = deriveData(refeicao, proteinas, leguminosas, guarnicoes)

  const Td = ({ val, cls }) => (
    <td className={`cardapio-td ${cls || ''}`}>{val}</td>
  )

  return (
    <table className="cardapio-table">
      <colgroup>
        <col style={{ width: '12%' }} />
        <col /><col /><col /><col /><col />
      </colgroup>
      <thead>
        <tr>
          <th className="col-label-header">{title}</th>
          {COLS.map(col => (
            <th key={col.key} className="col-diet-header">
              <span className="th-diet">{col.label}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {/* ── PRATO-BASE (Carboidrato) ── */}
        <tr className="row-base">
          <td className="row-label-cell">
            <span className="row-label-main">PRATO-BASE</span>
            <span className="row-label-sub">CARBOIDRATO</span>
          </td>
          {COLS.map(col => <Td key={col.key} val={d.base[col.key]} />)}
        </tr>

        {/* ── PRATO-BASE (Leguminosa) ── */}
        <tr className="row-leguminosa">
          <td className="row-label-cell">
            <span className="row-label-main">PRATO-BASE</span>
            <span className="row-label-sub">LEGUMINOSA</span>
          </td>
          {COLS.map(col => <Td key={col.key} val={d.leg[col.key]} />)}
        </tr>

        {/* ── PROTEÍNA ── */}
        <tr className="row-principal">
          <td className="row-label-cell">
            <span className="row-label-main">PROTEÍNA</span>
          </td>
          {COLS.map(col => <Td key={col.key} val={d.prot[col.key]} />)}
        </tr>

        {/* ── GUARNIÇÃO ── */}
        <tr className="row-guarnicao">
          <td className="row-label-cell">
            <span className="row-label-main">GUARNIÇÃO</span>
          </td>
          {COLS.map(col => <Td key={col.key} val={d.guard[col.key]} />)}
        </tr>

        {/* ── SALADA — só almoço ── */}
        {showSalada && (
          <tr className="row-salada">
            <td className="row-label-cell">
              <span className="row-label-main">SALADA</span>
            </td>
            {COLS.map(col => <Td key={col.key} val={d.salada[col.key]} />)}
          </tr>
        )}
      </tbody>
    </table>
  )
}

export default function PrintView({ cardapio, proteinas, leguminosas, guarnicoes, dataFormatada, diaSemana }) {
  if (!cardapio) return null

  return (
    <div className="print-area">
      <div className="print-header">
        <span className="ph-cardapio">CARDÁPIO</span>
        <span className="ph-sep">—</span>
        <span className="ph-dia">{diaSemana}</span>
        <span className="ph-sep">—</span>
        <span className="ph-data">{dataFormatada}</span>
        <span className="ph-ns">NS: {cardapio?.ns ? cardapio.ns : ''}</span>
      </div>

      <div className="meal-block">
        <MealTable title="ALMOÇO" refeicao={cardapio.almoco}
          proteinas={proteinas} leguminosas={leguminosas} guarnicoes={guarnicoes} showSalada={true} />
      </div>

      <div className="meal-block">
        <MealTable title="JANTAR" refeicao={cardapio.jantar}
          proteinas={proteinas} leguminosas={leguminosas} guarnicoes={guarnicoes} showSalada={false} />
      </div>

      <div className="print-obs">
        <span className="obs-item">
          <strong>LÍQUIDA COMPLETA:</strong>&nbsp;{cardapio.observacoes?.liquidaCompleta || '—'}
        </span>
        <span className="obs-sep">•</span>
        <span className="obs-item">
          <strong>LÍQ. SEM RESÍDUOS:</strong>&nbsp;{cardapio.observacoes?.liquidaSemResiduos || '—'}
        </span>
      </div>
    </div>
  )
}
