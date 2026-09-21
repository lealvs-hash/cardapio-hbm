import React from 'react'
import { UtensilsCrossed, BookOpen, History, Download, Upload, RotateCcw, FileText, DollarSign } from 'lucide-react'

export default function NavBar({ activePage, setActivePage, exportarDados, importarDados, resetarDados, dbStatus = 'conectado' }) {
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
        {/* Status do Banco de Dados em Nuvem */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            padding: '3px 8px',
            borderRadius: 12,
            fontSize: '10.5px',
            fontWeight: 700,
            background: dbStatus === 'conectado' ? '#e8f5e9' : dbStatus === 'salvando' ? '#fff8e1' : '#f5f5f5',
            color: dbStatus === 'conectado' ? '#1b5e20' : dbStatus === 'salvando' ? '#f57f17' : '#616161',
            border: `1px solid ${dbStatus === 'conectado' ? '#a5d6a7' : dbStatus === 'salvando' ? '#ffe082' : '#e0e0e0'}`,
            marginRight: 4,
          }}
          title="Conexão ativa e em tempo real com o Cloud Firestore (projeto: cardapio-hbm)"
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: dbStatus === 'conectado' ? '#2e7d32' : dbStatus === 'salvando' ? '#f57f17' : '#9e9e9e',
              display: 'inline-block',
            }}
          />
          <span>
            {dbStatus === 'conectado' ? 'BD Conectado (cardapio-hbm)' : dbStatus === 'salvando' ? 'Gravando no BD...' : dbStatus === 'conectando' ? 'Conectando...' : 'Modo Local'}
          </span>
        </div>

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
