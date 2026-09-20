// Utilitários de Calendário Semanal e Detecção de Repetições de Cardápio

export const DIAS_SEMANA_COMPLETO = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
]

export const DIAS_SEMANA_SIGLA = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB', 'DOM']

export const MESES_NOMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

/**
 * Converte 'YYYY-MM-DD' para objeto Date local (ao meio-dia para evitar fuso horário)
 */
export function parseLocalDate(dateStr) {
  if (!dateStr) return new Date()
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d, 12, 0, 0)
}

/**
 * Formata Date para 'YYYY-MM-DD'
 */
export function formatISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * Formata 'YYYY-MM-DD' para 'DD/MM/YYYY'
 */
export function formatDateBR(dateStr) {
  if (!dateStr) return ''
  const [y, m, d] = dateStr.split('-')
  return `${d}/${m}/${y}`
}

/**
 * Formata 'YYYY-MM-DD' para 'DD/MM'
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  return `${parts[2]}/${parts[1]}`
}

/**
 * Retorna a Segunda-feira da semana de uma determinada data
 */
export function getMondayOfWeek(dateStr) {
  const d = parseLocalDate(dateStr)
  const day = d.getDay() // 0 = Domingo, 1 = Segunda, ...
  const diff = day === 0 ? -6 : 1 - day // Se Domingo, volta 6 dias; senão volta para Segunda (1)
  d.setDate(d.getDate() + diff)
  return formatISODate(d)
}

/**
 * Retorna os 7 dias da semana (Segunda a Domingo) em formato ISO 'YYYY-MM-DD'
 */
export function getDaysOfWeek(mondayStr) {
  const monday = parseLocalDate(mondayStr)
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(formatISODate(d))
  }
  return days
}

/**
 * Retorna o número da semana no ano (ISO week)
 */
export function getWeekNumber(dateStr) {
  const d = parseLocalDate(dateStr)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7))
  const yearStart = new Date(d.getFullYear(), 0, 1)
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
}

/**
 * Retorna as semanas de um determinado mês e ano (Segunda a Domingo de cada semana)
 */
export function getSemanasDoMes(ano, mesIndex) {
  const primeiroDia = new Date(ano, mesIndex, 1, 12, 0, 0)
  const ultimoDia = new Date(ano, mesIndex + 1, 0, 12, 0, 0)

  const semanas = []
  let seg = parseLocalDate(getMondayOfWeek(formatISODate(primeiroDia)))

  while (seg <= ultimoDia || semanas.length < 4) {
    const segStr = formatISODate(seg)
    const dom = new Date(seg.getTime() + 6 * 86400000)
    const domStr = formatISODate(dom)

    semanas.push({
      numeroSemanaMes: semanas.length + 1,
      segundaStr: segStr,
      domingoStr: domStr,
      label: `Semana ${semanas.length + 1} (${formatDateShort(segStr)} a ${formatDateShort(domStr)})`,
    })

    seg = new Date(seg.getTime() + 7 * 86400000)
    if (seg.getMonth() !== mesIndex && seg > ultimoDia) break
  }
  return semanas
}

/**
 * Retorna as informações detalhadas da semana do mês para uma data
 */
export function getInfoSemanaMes(mondayStr) {
  const d = parseLocalDate(mondayStr)
  // Usamos a quarta-feira da semana para definir a qual mês a semana majoritariamente pertence
  const quarta = new Date(d.getTime() + 2 * 86400000)
  const mesIdx = quarta.getMonth()
  const mesNome = MESES_NOMES[mesIdx]
  const ano = quarta.getFullYear()

  const semanas = getSemanasDoMes(ano, mesIdx)
  const idx = semanas.findIndex(s => s.segundaStr === mondayStr)
  const numSemana = idx >= 0 ? idx + 1 : Math.min(Math.ceil(d.getDate() / 7), 4)

  return {
    ano,
    mesIdx,
    mesNome,
    numSemana,
    semanasDoMes: semanas,
    tituloFormatado: `${mesNome} / ${ano} — Semana ${numSemana}`
  }
}

/**
 * Verifica se um prato (por ID ou Nome) foi servido recentemente em relação a uma data de referência
 * @param {string} pratoId - ID da proteína ou guarnição
 * @param {string} pratoNome - Nome ou NomeAbrev do prato
 * @param {string} dataReferencia - 'YYYY-MM-DD' da refeição atual sendo montada
 * @param {object} cardapios - Dicionário de cardápios salvos
 * @returns {object} { servidoAntes: boolean, ultimaData: string, diasAtras: number, nivelAlerta: 'ok'|'atencao'|'repetido', mensagem: string }
 */
export function verificarRepeticaoPrato(pratoId, pratoNome, dataReferencia, cardapios = {}) {
  if (!pratoId && !pratoNome) {
    return { servidoAntes: false, nivelAlerta: 'ok', mensagem: '' }
  }

  const refDate = parseLocalDate(dataReferencia)
  const datasOcorrencias = []

  Object.entries(cardapios).forEach(([dateStr, cardapio]) => {
    // Não comparar com o mesmo dia em que está sendo cadastrado
    if (dateStr === dataReferencia) return

    const d = parseLocalDate(dateStr)
    const meals = [cardapio.almoco, cardapio.jantar].filter(Boolean)

    const usouNestaData = meals.some(meal => {
      const matchId = (pratoId && (meal.proteinaId === pratoId || meal.guarnicaoId === pratoId))
      const matchNome = pratoNome && (
        (meal.proteinaAbrev && meal.proteinaAbrev.toUpperCase() === pratoNome.toUpperCase()) ||
        (meal.guarnicaoAbrev && meal.guarnicaoAbrev.toUpperCase() === pratoNome.toUpperCase())
      )
      return matchId || matchNome
    })

    if (usouNestaData) {
      datasOcorrencias.push(dateStr)
    }
  })

  if (datasOcorrencias.length === 0) {
    return {
      servidoAntes: false,
      diasAtras: null,
      nivelAlerta: 'ok',
      mensagem: 'Primeira vez no ciclo recente',
    }
  }

  // Ordenar decrescente (mais recente primeiro)
  datasOcorrencias.sort((a, b) => b.localeCompare(a))
  const ultimaData = datasOcorrencias[0]
  const diffTime = refDate.getTime() - parseLocalDate(ultimaData).getTime()
  const diasAtras = Math.round(diffTime / (1000 * 60 * 60 * 24))

  // Calcular alerta com base nos dias de intervalo
  let nivelAlerta = 'ok'
  let mensagem = ''

  if (diasAtras <= 0) {
    nivelAlerta = 'repetido'
    mensagem = `⚠️ Servido em data posterior ou futura (${formatDateBR(ultimaData)})`
  } else if (diasAtras <= 3) {
    nivelAlerta = 'repetido' // Vermelho
    mensagem = `🚨 REPETIDO: Servido há apenas ${diasAtras} dia(s) atrás (${formatDateBR(ultimaData)})`
  } else if (diasAtras <= 6) {
    nivelAlerta = 'atencao' // Amarelo
    mensagem = `⚠️ Atenção: Servido há ${diasAtras} dias (${formatDateBR(ultimaData)})`
  } else {
    nivelAlerta = 'ok' // Verde
    mensagem = `✓ Ótima rotatividade: Última vez há ${diasAtras} dias (${formatDateBR(ultimaData)})`
  }

  return {
    servidoAntes: true,
    ultimaData,
    diasAtras,
    totalVezes: datasOcorrencias.length,
    nivelAlerta,
    mensagem,
  }
}

/**
 * Calcula a distribuição e equilíbrio de cortes de proteínas de uma semana específica
 */
export function calcularEquilibrioSemanal(cardapios = {}, diasSemana = [], proteinas = []) {
  const grupos = {
    Bovina: 0,
    Frango: 0,
    Suíno: 0,
    Peixe: 0,
    Mistos: 0,
    Outros: 0,
  }

  let totalProteinasServidas = 0

  diasSemana.forEach(d => {
    const c = cardapios[d]
    if (!c) return
    ;[c.almoco?.proteinaId, c.jantar?.proteinaId].forEach(pid => {
      if (!pid) return
      totalProteinasServidas++
      const p = proteinas.find(x => x.id === pid)
      const cat = (p?.categoria || '').toLowerCase()
      if (cat.includes('bovina')) grupos.Bovina++
      else if (cat.includes('frango')) grupos.Frango++
      else if (cat.includes('suíno') || cat.includes('suino')) grupos.Suíno++
      else if (cat.includes('peixe')) grupos.Peixe++
      else if (cat.includes('base')) grupos.Mistos++
      else grupos.Outros++
    })
  })

  return { grupos, totalProteinasServidas }
}
