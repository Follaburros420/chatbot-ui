// Versión demo del sistema PII que funciona sin Supabase
// Solo para demostración - no almacena datos realmente

export type PIIType = 'EMAIL' | 'PHONE' | 'CEDULA' | 'CREDIT_CARD' | 'NAME' | 'ADDRESS'

export interface PIIItem {
  type: PIIType
  original: string
  token: string
  startIndex: number
  endIndex: number
}

export interface AnonymizeResult {
  anonymizedText: string
  piiList: PIIItem[]
}

// Expresiones regulares para detectar PII
const PII_PATTERNS: Record<PIIType, RegExp> = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /(?:\+?57\s?)?(?:\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/g,
  CEDULA: /\b(?:CC|C\.C\.?|Cédula|cedula)\s*:?\s*(\d{6,12})\b/gi,
  CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  NAME: /\b(?:Sr\.|Sra\.|Dr\.|Dra\.|Abogado|Abogada)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)/g,
  ADDRESS: /\b(?:Calle|Carrera|Avenida|Av\.|Cr\.|Cl\.)\s+\d+[A-Za-z0-9\s#-]*\b/gi
}

// Almacén temporal en memoria para el demo
const demoMappings = new Map<string, string>()

/**
 * Genera un token determinista para un valor PII (versión demo)
 */
function generateDemoToken(type: PIIType, value: string): string {
  // Generar hash simple para demo (no usar en producción)
  let hash = 0
  const str = `${type}:${value}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  const hashStr = Math.abs(hash).toString(16).substring(0, 8).padStart(8, '0')
  
  return `<PII_${type}_${hashStr}>`
}

/**
 * Detecta y anonimiza PII en un texto (versión demo)
 */
export function anonymizeDemo(text: string): AnonymizeResult {
  const piiList: PIIItem[] = []
  let anonymizedText = text
  let offset = 0

  // Procesar cada tipo de PII
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const piiType = type as PIIType
    const matches = Array.from(text.matchAll(pattern))
    
    for (const match of matches) {
      if (!match[0] || match.index === undefined) continue
      
      const original = match[0].trim()
      const startIndex = match.index
      const endIndex = startIndex + original.length
      
      // Generar token determinista
      const token = generateDemoToken(piiType, original)
      
      // Almacenar mapeo en memoria (solo para demo)
      demoMappings.set(token, original)
      
      // Agregar a la lista de PII detectado
      piiList.push({
        type: piiType,
        original,
        token,
        startIndex: startIndex + offset,
        endIndex: endIndex + offset
      })
      
      // Reemplazar en el texto
      const beforeToken = anonymizedText.substring(0, startIndex + offset)
      const afterToken = anonymizedText.substring(endIndex + offset)
      anonymizedText = beforeToken + token + afterToken
      
      // Ajustar offset para próximas sustituciones
      offset += token.length - original.length
    }
  }

  return {
    anonymizedText,
    piiList
  }
}

/**
 * Desanonimiza tokens PII en un texto (versión demo)
 */
export function deanonymizeDemo(text: string): string {
  // Buscar todos los tokens PII en el texto
  const tokenPattern = /<PII_[A-Z_]+_[a-f0-9]{8}>/g
  const tokens = Array.from(text.matchAll(tokenPattern))
  
  let deanonymizedText = text
  
  // Procesar cada token encontrado
  for (const tokenMatch of tokens) {
    const token = tokenMatch[0]
    const original = demoMappings.get(token)
    
    if (original) {
      // Reemplazar token con valor original
      deanonymizedText = deanonymizedText.replace(token, original)
    } else {
      console.warn(`No mapping found for token: ${token}`)
    }
  }
  
  return deanonymizedText
}

/**
 * Valida si un texto contiene tokens PII
 */
export function containsPIITokens(text: string): boolean {
  const tokenPattern = /<PII_[A-Z_]+_[a-f0-9]{8}>/g
  return tokenPattern.test(text)
}

/**
 * Obtiene estadísticas de PII detectado
 */
export function getPIIStats(piiList: PIIItem[]): Record<PIIType, number> {
  const stats: Record<PIIType, number> = {
    EMAIL: 0,
    PHONE: 0,
    CEDULA: 0,
    CREDIT_CARD: 0,
    NAME: 0,
    ADDRESS: 0
  }
  
  piiList.forEach(item => {
    stats[item.type]++
  })
  
  return stats
}

/**
 * Formatea el tipo de PII para mostrar al usuario
 */
export function formatPIIType(type: PIIType): string {
  const labels: Record<PIIType, string> = {
    EMAIL: 'Correo Electrónico',
    PHONE: 'Teléfono',
    CEDULA: 'Cédula',
    CREDIT_CARD: 'Tarjeta de Crédito',
    NAME: 'Nombre',
    ADDRESS: 'Dirección'
  }
  
  return labels[type] || type
}

/**
 * Limpia el almacén temporal (solo para demo)
 */
export function clearDemoMappings(): void {
  demoMappings.clear()
}
