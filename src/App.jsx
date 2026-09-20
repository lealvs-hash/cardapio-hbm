import React, { useState } from 'react'
import { useStore } from './store/useStore'
import NavBar from './components/NavBar'
import CardapioPage from './pages/CardapioPage'
import BancoPratos from './pages/BancoPratos'
import FichaTecnicaPage from './pages/FichaTecnicaPage'
import ValoresPage from './pages/ValoresPage'
import Historico from './pages/Historico'

export default function App() {
  const [activePage, setActivePage] = useState('cardapio')
  const [selectedFichaId, setSelectedFichaId] = useState(null)
  const [cardapioDate, setCardapioDate] = useState(() => new Date().toISOString().slice(0, 10))
  const store = useStore()

  const handleNavigateToDate = (dateStr) => {
    setCardapioDate(dateStr)
    setActivePage('cardapio')
  }

  const handleOpenFicha = (prato) => {
    if (!prato) {
      setActivePage('ficha')
      return
    }

    const fichas = store.state.fichasTecnicas || []
    const insumos = store.state.insumos || []

    // Procura se já existe ficha técnica associada a este prato por pratoId ou por nome
    const existing = fichas.find(f =>
      (prato.id && f.pratoId === prato.id) ||
      (f.nomePreparacao && prato.nomeAbrev && f.nomePreparacao.trim().toUpperCase() === prato.nomeAbrev.trim().toUpperCase()) ||
      (f.nomePreparacao && prato.nome && f.nomePreparacao.trim().toUpperCase() === prato.nome.trim().toUpperCase())
    )

    if (existing) {
      setSelectedFichaId(existing.id)
    } else {
      // Cria automaticamente uma ficha técnica vinculada a este prato com valores de insumos
      const newId = `ft_${Date.now()}`
      const baseInsumo = insumos.find(i =>
        (prato.nome || '').toUpperCase().includes(i.nome.toUpperCase()) ||
        (prato.categoria || '').toUpperCase().includes(i.nome.toUpperCase()) ||
        i.nome.toUpperCase().includes((prato.categoria || '').toUpperCase().split('—')[0].trim())
      ) || insumos[0]

      const novaFicha = {
        id: newId,
        pratoId: prato.id,
        nomePreparacao: (prato.nomeAbrev || prato.nome).toUpperCase(),
        profissional: 'Nutricionista HBM',
        fotoUrl: '',
        rendimentoPorcoes: 20,
        modoPreparo: prato.metodoPreparo || `1. Higienização e separação dos insumos de ${prato.nome}.\n2. Realizar corte e pré-preparo conforme a consistência necessária.\n3. Cocção e controle de temperatura.\n4. Ajustar temperos e servir em temperatura adequada.`,
        insumos: baseInsumo ? [
          {
            item: baseInsumo.nome,
            un: baseInsumo.un || 'KG',
            pesoBruto: 2.000,
            pesoLiquido: 1.800,
            fatorCorrecao: baseInsumo.fatorCorrecao || 1.000,
            valorUnitario: baseInsumo.valorUnitario || 0,
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
        ] : [],
      }

      store.salvarFichaTecnica(novaFicha)
      setSelectedFichaId(newId)
    }

    setActivePage('ficha')
  }

  return (
    <div className="app">
      <NavBar
        activePage={activePage}
        setActivePage={setActivePage}
        exportarDados={store.exportarDados}
        importarDados={store.importarDados}
        resetarDados={store.resetarDados}
      />
      <main className="main-content">
        {activePage === 'cardapio' && (
          <CardapioPage
            store={store}
            onOpenFicha={handleOpenFicha}
            selectedDate={cardapioDate}
            setSelectedDate={setCardapioDate}
          />
        )}
        {activePage === 'banco' && <BancoPratos store={store} onOpenFicha={handleOpenFicha} />}
        {activePage === 'ficha' && (
          <FichaTecnicaPage
            store={store}
            selectedFichaId={selectedFichaId}
            setSelectedFichaId={setSelectedFichaId}
          />
        )}
        {activePage === 'valores' && <ValoresPage store={store} onOpenFicha={handleOpenFicha} />}
        {activePage === 'historico' && (
          <Historico
            store={store}
            onNavigateToDate={handleNavigateToDate}
            onOpenFicha={handleOpenFicha}
          />
        )}
      </main>
    </div>
  )
}
