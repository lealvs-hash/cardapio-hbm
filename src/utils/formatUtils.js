/**
 * Utilitários para formatação e higienização de nomes de pratos e consistências
 */

/**
 * Remove sufixos duplicados de molho (ex: "AO MOLHO AO MOLHO", "AO MOLHO FERRUGEM AO MOLHO", etc.)
 */
export function limparDuplicidadeMolho(str) {
  if (!str || typeof str !== 'string') return ''
  let res = str.trim()

  // Se termina com " AO MOLHO", " COM MOLHO" ou " C/ MOLHO" mas já continha menção a molho antes:
  if (/\s+AO MOLHO$/i.test(res)) {
    const semFinal = res.replace(/\s+AO MOLHO$/i, '').trim()
    if (/MOLHO|SUGO/i.test(semFinal)) {
      res = semFinal
    }
  } else if (/\s+COM MOLHO$/i.test(res)) {
    const semFinal = res.replace(/\s+COM MOLHO$/i, '').trim()
    if (/MOLHO|SUGO/i.test(semFinal)) {
      res = semFinal
    }
  } else if (/\s+C\/\s*MOLHO$/i.test(res)) {
    const semFinal = res.replace(/\s+C\/\s*MOLHO$/i, '').trim()
    if (/MOLHO|SUGO/i.test(semFinal)) {
      res = semFinal
    }
  }

  // Casos repetidos colados: "AO MOLHO AO MOLHO"
  res = res.replace(/\bAO MOLHO\s+AO MOLHO\b/gi, 'AO MOLHO')
  res = res.replace(/\bCOM MOLHO\s+COM MOLHO\b/gi, 'COM MOLHO')
  res = res.replace(/\bC\/\s*MOLHO\s+AO MOLHO\b/gi, 'C/ MOLHO')
  res = res.replace(/\bAO MOLHO\s+COM MOLHO\b/gi, 'AO MOLHO')

  return res.trim()
}

/**
 * Retorna o nome formatado para a opção pastosa de uma proteína ou prato,
 * garantindo que não ocorram duplicações de "AO MOLHO".
 */
export function formatarNomePastosa(p) {
  if (!p) return ''
  if (typeof p === 'string') {
    return limparDuplicidadeMolho(p)
  }
  if (p.nomePastosa && p.nomePastosa.trim()) {
    return limparDuplicidadeMolho(p.nomePastosa.trim())
  }
  const base = (p.nomeAbrev || p.nome || '').trim()
  const sufixo = (p.sufixoPastosa || '').trim()
  if (!sufixo) return limparDuplicidadeMolho(base)

  const baseUpper = base.toUpperCase()
  const sufixoUpper = sufixo.toUpperCase()

  // Se a base já contém exatamente o sufixo
  if (baseUpper.includes(sufixoUpper)) {
    return limparDuplicidadeMolho(base)
  }

  // Se o sufixo é uma variação de molho e a base já contém 'MOLHO' ou 'SUGO'
  if (sufixoUpper.includes('MOLHO') && (baseUpper.includes('MOLHO') || baseUpper.includes('SUGO'))) {
    return limparDuplicidadeMolho(base)
  }

  return limparDuplicidadeMolho(`${base} ${sufixo}`)
}
