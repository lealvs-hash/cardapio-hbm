import React from 'react'

const DIETAS_CONFIG = [
  { key: 'psiquiatria', label: 'PSIQUIATRIA', cor: '#4338ca', bg: '#eef2ff', borda: '#c7d2fe', icon: '🧠' },
  { key: 'dietaLivre', label: 'DIETA LIVRE', cor: '#065f46', bg: '#ecfdf5', borda: '#a7f3d0', icon: '🍽️' },
  { key: 'dietaDM', label: 'DIETA DM', cor: '#9a3412', bg: '#fff7ed', borda: '#fed7aa', icon: '🥗' },
  { key: 'dietaBranda', label: 'DIETA BRANDA', cor: '#0e7490', bg: '#ecfeff', borda: '#a5f3fc', icon: '🥣' },
  { key: 'dietaPastosaLiquida', label: 'PASTOSA E LÍQ. PASTOSA', cor: '#854d0e', bg: '#fefce8', borda: '#fef08a', icon: '🥄' },
  { key: 'dietaLiquida', label: 'DIETA LÍQUIDA', cor: '#1e40af', bg: '#eff6ff', borda: '#bfdbfe', icon: '💧' },
]

export default function CeiaPrintView({ ceia = {}, dataFormatada, diaSemana, modelo = 'moderno' }) {
  const diaSemanaUpper = (diaSemana || '').toUpperCase()

  // ── MODELO 1: MODERNO / EXECUTIVO (Design profissional hospitalar, data APENAS embaixo) ──
  if (modelo === 'moderno') {
    return (
      <div className="ceia-print-sheet ceia-modern-sheet">
        {/* Topo institucional sem repetição de data */}
        <div className="ceia-modern-header">
          <div className="ceia-modern-brand">
            <div className="ceia-modern-brand-title">🏥 HBM NUTRIÇÃO</div>
            <div className="ceia-modern-brand-sub">SERVIÇO DE NUTRIÇÃO E DIETÉTICA</div>
          </div>

          <div className="ceia-modern-center">
            <h1 className="ceia-modern-title">CEIA</h1>
          </div>

          <div className="ceia-modern-header-tag">
            <span className="ceia-modern-tag-title">MAPA DE PRODUÇÃO</span>
            <span className="ceia-modern-tag-sub">DISTRIBUIÇÃO NOTURNA</span>
          </div>
        </div>

        {/* Tabela de dietas com crachás coloridos e tipografia destacada */}
        <div className="ceia-modern-body">
          <table className="ceia-modern-table">
            <tbody>
              {DIETAS_CONFIG.map(({ key, label, cor, bg, borda, icon }) => {
                const valor = (ceia[key] || '').trim()
                return (
                  <tr key={key} className="ceia-modern-row">
                    <td className="ceia-modern-badge-cell">
                      <div
                        className="ceia-modern-badge"
                        style={{
                          backgroundColor: bg,
                          color: cor,
                          borderColor: borda,
                        }}
                      >
                        <span className="ceia-modern-badge-icon">{icon}</span>
                        <span className="ceia-modern-badge-text">{label}</span>
                      </div>
                    </td>
                    <td className="ceia-modern-val-cell">
                      <div className="ceia-modern-val-text">
                        {valor || <span className="ceia-modern-empty">—</span>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Rodapé moderno com assinatura e data única */}
        <div className="ceia-modern-footer">
          <div className="ceia-modern-footer-left">
            <span className="ceia-modern-footer-obs">
              ⚠️ Conferir identificação do paciente e consistência antes da distribuição.
            </span>
          </div>
          <div className="ceia-modern-footer-right">
            <div className="ceia-modern-signature-line">
              <span className="ceia-modern-sig-label">Nutricionista Responsável:</span>
              <span className="ceia-modern-sig-dots">________________________________</span>
            </div>
            <div className="ceia-modern-footer-date">
              {diaSemanaUpper} : {dataFormatada}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── MODELO 2: CLÁSSICO (Fiel ao modelo Word original, data APENAS embaixo) ──
  return (
    <div className="ceia-print-sheet ceia-classic-sheet">
      <div className="ceia-print-header">
        <h1 className="ceia-print-title">
          <u><em>CEIA</em></u>
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
