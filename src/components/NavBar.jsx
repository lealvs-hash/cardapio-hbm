import React from 'react'
import { UtensilsCrossed, BookOpen, History, Download, Upload, RotateCcw, FileText, DollarSign } from 'lucide-react'

export default function NavBar({ activePage, setActivePage, exportarDados, importarDados, resetarDados }) {
  const fileInputRef = React.useRef(null)

  const handleImport = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      await importarDados(file)
      alert('✅ Dados importados com sucesso!')
    } catch {
      alert('❌ Erro ao importar. Verifique o arquivo.')
    }
    e.target.value = ''
  }

  const handleReset = () => {
    if (window.confirm('⚠️ Isso apagará TODOS os cardápios salvos e restaurará o banco original. Deseja continuar?')) {
      resetarDados()
      alert('✅ Dados restaurados para o padrão.')
    }
  }

  const navItems = [
    { key: 'cardapio', label: 'Cardápio do Dia', Icon: UtensilsCrossed },
    { key: 'banco', label: 'Pratos', Icon: BookOpen },
    { key: 'ficha', label: 'Ficha Técnica', Icon: FileText },
    { key: 'valores', label: 'Valores', Icon: DollarSign },
    { key: 'historico', label: 'Histórico', Icon: History },
  ]

  return (
    <nav className="navbar no-print">
      <div className="navbar-brand">
        <span className="brand-icon">🏥</span>
        <div>
          <div className="brand-title">HBM Nutrição</div>
          <div className="brand-sub">Gestão de Cardápios</div>
        </div>
      </div>

      <div className="navbar-nav">
        {navItems.map(({ key, label, Icon }) => (
          <button
            key={key}
            className={`nav-btn ${activePage === key ? 'active' : ''}`}
            onClick={() => setActivePage(key)}
          >
            <Icon size={16} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className="navbar-actions">
        <button className="btn-icon" title="Exportar backup" onClick={exportarDados}>
          <Download size={16} />
          <span>Backup</span>
        </button>
        <button className="btn-icon" title="Importar backup" onClick={() => fileInputRef.current?.click()}>
          <Upload size={16} />
          <span>Importar</span>
        </button>
        <button className="btn-icon btn-danger-soft" title="Restaurar padrão" onClick={handleReset}>
          <RotateCcw size={16} />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>
    </nav>
  )
}
