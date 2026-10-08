import React from 'react'

export default function CeiaPrintView({ ceia = {}, dataFormatada, diaSemana }) {
  const diaSemanaUpper = (diaSemana || '').toUpperCase()

  return (
    <div className="ceia-print-sheet">
      <div className="ceia-print-header">
        <h1 className="ceia-print-title">
          <u><em>CEIA - DATA: {diaSemanaUpper} : {dataFormatada}</em></u>
        </h1>
      </div>

      <div className="ceia-print-body">
        <div className="ceia-print-row">
          <span className="ceia-print-label">PSIQUIATRIA:</span>
          <span className="ceia-print-val">{ceia.psiquiatria || ''}</span>
        </div>

        <div className="ceia-print-row">
          <span className="ceia-print-label">DIETA LIVRE:</span>
          <span className="ceia-print-val">{ceia.dietaLivre || ''}</span>
        </div>

        <div className="ceia-print-row">
          <span className="ceia-print-label">DIETA DM:</span>
          <span className="ceia-print-val">{ceia.dietaDM || ''}</span>
        </div>

        <div className="ceia-print-row">
          <span className="ceia-print-label">DIETA BRANDA:</span>
          <span className="ceia-print-val">{ceia.dietaBranda || ''}</span>
        </div>

        <div className="ceia-print-row">
          <span className="ceia-print-label">DIETA PASTOSA E LÍQUIDA PASTOSA:</span>
          <span className="ceia-print-val">{ceia.dietaPastosaLiquida || ''}</span>
        </div>

        <div className="ceia-print-row">
          <span className="ceia-print-label">DIETA LÍQUIDA:</span>
          <span className="ceia-print-val">{ceia.dietaLiquida || ''}</span>
        </div>
      </div>

      <div className="ceia-print-footer">
        {diaSemanaUpper} :{dataFormatada}
      </div>
    </div>
  )
}
