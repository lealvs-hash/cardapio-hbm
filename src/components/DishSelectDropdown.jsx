import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown, Search, Plus, X, Pencil, Check } from 'lucide-react'

export default function DishSelectDropdown({
  value,
  onChange,
  onAdd,
  onEdit,
  options = [],
  groupBy = 'categoria',
  placeholder = '— Selecionar —',
  defaultLabel = '',
  defaultItemId = '',
  formatOptionName,
  formatOptionSecondary,
  title = '',
  style = {},
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 320, openUp: false })

  // Encontra o item atualmente selecionado (apenas se value for válido e não vazio)
  const selectedItem = (value !== undefined && value !== null && value !== '')
    ? options.find(o => o && o.id && o.id === value)
    : null

  // Texto a ser exibido no botão gatilho
  let triggerText = placeholder
  let isDefault = false

  if (selectedItem) {
    triggerText = formatOptionName ? formatOptionName(selectedItem) : (selectedItem.nomeAbrev || selectedItem.nome)
  } else if (defaultLabel && typeof defaultLabel === 'string' && defaultLabel.trim()) {
    triggerText = defaultLabel.trim()
    isDefault = true
  }

  // Atualizar coordenadas de posicionamento
  const updatePosition = () => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const dropdownHeight = 360
    const spaceBelow = window.innerHeight - rect.bottom
    const openUp = spaceBelow < dropdownHeight && rect.top > spaceBelow

    const left = Math.max(8, Math.min(rect.left, window.innerWidth - Math.max(rect.width, 340) - 8))
    const top = openUp ? Math.max(8, rect.top - dropdownHeight - 4) : rect.bottom + 4

    setCoords({
      top,
      left,
      width: Math.max(rect.width, 340),
      maxHeight: openUp ? Math.min(360, rect.top - 16) : Math.min(360, window.innerHeight - rect.bottom - 16),
      openUp,
    })
  }

  // Abre e fecha
  const toggleDropdown = () => {
    if (!isOpen) {
      updatePosition()
      setSearchTerm('')
    }
    setIsOpen(prev => !prev)
  }

  // Fechar ao clicar fora ou rolar
  useEffect(() => {
    if (!isOpen) return

    const handleMouseDown = (e) => {
      if (
        triggerRef.current && triggerRef.current.contains(e.target) ||
        dropdownRef.current && dropdownRef.current.contains(e.target)
      ) {
        return
      }
      setIsOpen(false)
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    const handleScrollOrResize = (e) => {
      // Se o scroll acontecer dentro do próprio menu dropdown, não fecha
      if (dropdownRef.current && dropdownRef.current.contains(e.target)) return
      updatePosition()
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleScrollOrResize)
    window.addEventListener('scroll', handleScrollOrResize, true)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, true)
    }
  }, [isOpen])

  // Filtragem de opções pelo termo de busca
  const filteredOptions = options.filter(item => {
    if (!searchTerm.trim()) return true
    const term = searchTerm.toLowerCase()
    const formatted = formatOptionName ? (formatOptionName(item) || '').toLowerCase() : ''
    return (
      (item.nome || '').toLowerCase().includes(term) ||
      (item.nomeAbrev || '').toLowerCase().includes(term) ||
      (item.categoria || '').toLowerCase().includes(term) ||
      formatted.includes(term)
    )
  })

  // Agrupamento por categoria se aplicável
  let grouped = {}
  if (groupBy) {
    filteredOptions.forEach(item => {
      const cat = item[groupBy] || 'Outra'
      if (!grouped[cat]) grouped[cat] = []
      grouped[cat].push(item)
    })
  }

  // Renderiza uma linha de item da lista
  const renderItemRow = (item) => {
    const isExplicitlySelected = item.id === value
    const isDefaultItem = !value && Boolean(defaultItemId) && item.id === defaultItemId
    const isHighlighted = isExplicitlySelected || isDefaultItem

    const primaryName = formatOptionName ? formatOptionName(item) : (item.nomeAbrev || item.nome)
    const subText = formatOptionSecondary
      ? formatOptionSecondary(item)
      : (item.nomeAbrev && item.nome && item.nomeAbrev.trim().toUpperCase() !== item.nome.trim().toUpperCase() ? `DL/DM: ${item.nomeAbrev}` : '')

    return (
      <div
        key={item.id}
        onClick={() => {
          onChange(item.id)
          setIsOpen(false)
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 10px',
          cursor: 'pointer',
          backgroundColor: isExplicitlySelected ? '#e3f2fd' : (isDefaultItem ? '#f1f8e9' : 'transparent'),
          borderLeft: isExplicitlySelected ? '3px solid #1565c0' : (isDefaultItem ? '3px solid #4caf50' : '3px solid transparent'),
          borderBottom: '1px solid #f8fafc',
          transition: 'background-color 0.1s ease',
        }}
        onMouseEnter={e => {
          if (!isHighlighted) e.currentTarget.style.backgroundColor = '#f8fafc'
        }}
        onMouseLeave={e => {
          if (!isHighlighted) e.currentTarget.style.backgroundColor = 'transparent'
        }}
      >
        <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
          <div style={{
            fontSize: '11px',
            fontWeight: isHighlighted ? 800 : 600,
            color: isExplicitlySelected ? '#0d47a1' : (isDefaultItem ? '#2e7d32' : '#1e293b'),
            textTransform: 'uppercase',
            lineHeight: 1.25,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}>
            <span>{primaryName}</span>
            {isDefaultItem && (
              <span style={{
                background: '#e8f5e9',
                color: '#2e7d32',
                border: '1px solid #c8e6c9',
                fontSize: '8.5px',
                padding: '0 4px',
                borderRadius: 3,
                fontWeight: 700,
                textTransform: 'none',
              }}>
                ✓ Padrão Dieta Livre
              </span>
            )}
            {isExplicitlySelected && (
              <span style={{
                background: '#e3f2fd',
                color: '#1565c0',
                border: '1px solid #bbdefb',
                fontSize: '8.5px',
                padding: '0 4px',
                borderRadius: 3,
                fontWeight: 700,
                textTransform: 'none',
              }}>
                ✓ Selecionado
              </span>
            )}
          </div>
          {subText && (
            <div style={{ fontSize: '9.5px', color: '#64748b', marginTop: 1 }}>
              {subText}
            </div>
          )}
        </div>

        {/* Botão Ícone de Lápis para editar nesta parte! */}
        {onEdit && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              setIsOpen(false)
              onEdit(item)
            }}
            title={`Editar "${item.nome}"`}
            style={{
              padding: '3px 7px',
              background: '#ffffff',
              border: '1px solid #90caf9',
              borderRadius: 4,
              color: '#1565c0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 3,
              fontSize: '10px',
              fontWeight: 700,
              flexShrink: 0,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = '#1565c0'
              e.currentTarget.style.color = '#ffffff'
              e.currentTarget.style.borderColor = '#0d47a1'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = '#ffffff'
              e.currentTarget.style.color = '#1565c0'
              e.currentTarget.style.borderColor = '#90caf9'
            }}
          >
            <Pencil size={11} />
            <span>Editar</span>
          </button>
        )}
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', width: '100%', ...style }}>
      {/* Botão Gatilho (Visual idêntico ao select da tabela) */}
      <button
        type="button"
        ref={triggerRef}
        onClick={toggleDropdown}
        className="table-select"
        title={title || triggerText}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          paddingRight: 20,
          cursor: 'pointer',
          width: '100%',
          color: selectedItem ? '#0d47a1' : (isDefault ? '#2e7d32' : '#555'),
          borderColor: isOpen ? '#0d47a1' : undefined,
          background: isOpen ? '#ffffff' : undefined,
        }}
      >
        <span style={{
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          fontSize: '7.5pt',
          fontWeight: selectedItem ? 800 : 700,
        }}>
          {triggerText}
        </span>
        <ChevronDown
          size={13}
          style={{
            position: 'absolute',
            right: 4,
            top: '50%',
            transform: `translateY(-50%) rotate(${isOpen ? '180deg' : '0deg'})`,
            transition: 'transform 0.15s ease',
            color: '#666',
          }}
        />
      </button>

      {/* Menu suspenso (Renderizado no body via portal para nunca ser cortado pelo overflow da tabela) */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="dish-select-portal"
          style={{
            position: 'fixed',
            top: coords.top,
            left: coords.left,
            width: coords.width,
            maxHeight: coords.maxHeight || 360,
            backgroundColor: '#ffffff',
            border: '1.5px solid #1565c0',
            borderRadius: '6px',
            boxShadow: '0 8px 28px rgba(0, 0, 0, 0.28)',
            zIndex: 99999,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: 'inherit',
          }}
        >
          {/* Cabeçalho de Ações: + NOVO PRATO e Limpar */}
          <div style={{
            padding: '6px 8px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            {onAdd && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false)
                  onAdd()
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 5,
                  background: '#1565c0',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 4,
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  letterSpacing: '0.3px',
                }}
              >
                <Plus size={14} /> + NOVO PRATO
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                onChange(defaultLabel ? '__padrao__' : '')
                setIsOpen(false)
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: '6px 10px',
                fontSize: '10.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {defaultLabel ? '— PADRÃO —' : '— LIMPAR —'}
            </button>
          </div>

          {/* Campo de Busca Rápida */}
          <div style={{
            padding: '6px 8px',
            background: '#ffffff',
            borderBottom: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <Search size={14} color="#64748b" />
            <input
              type="text"
              autoFocus
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Filtrar prato pelo nome..."
              style={{
                flex: 1,
                border: '1px solid #cbd5e1',
                borderRadius: 4,
                padding: '4px 8px',
                fontSize: '11px',
                outline: 'none',
              }}
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Lista com scroll e itens com botão de lápis */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '4px 0',
            maxHeight: 280,
          }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '16px 12px', textAlign: 'center', color: '#94a3b8', fontSize: '11.5px' }}>
                Nenhum prato encontrado com "{searchTerm}"
              </div>
            ) : groupBy ? (
              Object.entries(grouped).map(([categoria, itens]) => (
                <div key={categoria} style={{ marginBottom: 4 }}>
                  {/* Cabeçalho da Categoria */}
                  <div style={{
                    padding: '4px 10px',
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#0d47a1',
                    background: '#f1f5f9',
                    borderTop: '1px solid #e2e8f0',
                    borderBottom: '1px solid #e2e8f0',
                    letterSpacing: '0.4px',
                  }}>
                    {categoria} ({itens.length})
                  </div>

                  {/* Itens da Categoria */}
                  {itens.map(renderItemRow)}
                </div>
              ))
            ) : (
              filteredOptions.map(renderItemRow)
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
