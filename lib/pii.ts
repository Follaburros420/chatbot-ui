import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// Tipos para PII
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

// Cliente Supabase server-side
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Expresiones regulares para detectar PII
const PII_PATTERNS: Record<PIIType, RegExp> = {
  EMAIL: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
  PHONE: /(?:\+?57\s?)?(?:\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/g,
  CEDULA: /\b(?:CC|C\.C\.?|Cédula|cedula)\s*:?\s*(\d{6,12})\b/gi,
  CREDIT_CARD: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
  NAME: /\b(?:Sr\.|Sra\.|Dr\.|Dra\.|Abogado|Abogada)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s+[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*)/g,
  ADDRESS: /\b(?:Calle|Carrera|Avenida|Av\.|Cr\.|Cl\.)\s+\d+[A-Za-z0-9\s#-]*\b/gi
}

/**
 * Genera un token determinista para un valor PII
 */
function generateToken(type: PIIType, value: string): string {
  const hmacSecret = process.env.HMAC_SECRET
  if (!hmacSecret) {
    throw new Error('HMAC_SECRET environment variable is required')
  }
  
  const hmac = crypto.createHmac('sha256', hmacSecret)
  hmac.update(`${type}:${value}`)
  const hash = hmac.digest('hex').substring(0, 8)
  
  return `<PII_${type}_${hash}>`
}

/**
 * Almacena el mapeo PII en Supabase (solo si no existe)
 */
async function storePIIMapping(token: string, original: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('pii_mapping')
      .insert({ token, original })
      .select()
      .single()
    
    // Ignorar error de conflicto (token ya existe)
    if (error && !error.message.includes('duplicate key')) {
      console.error('Error storing PII mapping:', error)
      throw error
    }
  } catch (error) {
    console.error('Failed to store PII mapping:', error)
    throw error
  }
}

/**
 * Recupera el valor original de un token desde Supabase
 */
async function retrievePIIMapping(token: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('pii_mapping')
      .select('original')
      .eq('token', token)
      .single()
    
    if (error) {
      console.error('Error retrieving PII mapping:', error)
      return null
    }
    
    return data?.original || null
  } catch (error) {
    console.error('Failed to retrieve PII mapping:', error)
    return null
  }
}

/**
 * Detecta y anonimiza PII en un texto
 */
export async function anonymize(text: string): Promise<AnonymizeResult> {
  const piiList: PIIItem[] = []
  let anonymizedText = text
  let offset = 0

  // Procesar cada tipo de PII
  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    const piiType = type as PIIType
    const matches = Array.from(text.matchAll(pattern))
    
    for (const match of matches) {
      if (!match[0] || !match.index) continue
      
      const original = match[0].trim()
      const startIndex = match.index
      const endIndex = startIndex + original.length
      
      // Generar token determinista
      const token = generateToken(piiType, original)
      
      // Almacenar mapeo en Supabase
      try {
        await storePIIMapping(token, original)
      } catch (error) {
        console.error(`Failed to store PII mapping for ${piiType}:`, error)
        continue
      }
      
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
 * Desanonimiza tokens PII en un texto
 */
export async function deanonymize(text: string): Promise<string> {
  // Buscar todos los tokens PII en el texto
  const tokenPattern = /<PII_[A-Z_]+_[a-f0-9]{8}>/g
  const tokens = Array.from(text.matchAll(tokenPattern))
  
  let deanonymizedText = text
  
  // Procesar cada token encontrado
  for (const tokenMatch of tokens) {
    const token = tokenMatch[0]
    
    try {
      const original = await retrievePIIMapping(token)
      
      if (original) {
        // Reemplazar token con valor original
        deanonymizedText = deanonymizedText.replace(token, original)
      } else {
        console.warn(`No mapping found for token: ${token}`)
      }
    } catch (error) {
      console.error(`Failed to deanonymize token ${token}:`, error)
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
 * Extrae todos los tokens PII de un texto
 */
export function extractPIITokens(text: string): string[] {
  const tokenPattern = /<PII_[A-Z_]+_[a-f0-9]{8}>/g
  return Array.from(text.matchAll(tokenPattern)).map(match => match[0])
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
