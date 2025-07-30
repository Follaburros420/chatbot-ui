"use client"

import { useState, useCallback } from 'react'
import { PIIItem, anonymizeDemo, deanonymizeDemo, clearDemoMappings } from '@/lib/pii-demo'

interface UsePIIDemoReturn {
  // Estados
  isAnonymizing: boolean
  isDeanonymizing: boolean
  piiList: PIIItem[]
  anonymizedText: string
  error: string | null
  
  // Funciones
  anonymizeText: (text: string) => Promise<{ anonymizedText: string; piiList: PIIItem[] } | null>
  deanonymizeText: (text: string) => Promise<string | null>
  clearPII: () => void
  reset: () => void
}

export const usePIIDemo = (): UsePIIDemoReturn => {
  const [isAnonymizing, setIsAnonymizing] = useState(false)
  const [isDeanonymizing, setIsDeanonymizing] = useState(false)
  const [piiList, setPiiList] = useState<PIIItem[]>([])
  const [anonymizedText, setAnonymizedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const anonymizeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('El texto no puede estar vacío')
      return null
    }

    setIsAnonymizing(true)
    setError(null)

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const result = anonymizeDemo(text)
      
      // Actualizar estado local
      setPiiList(result.piiList)
      setAnonymizedText(result.anonymizedText)

      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en la anonimización'
      setError(errorMessage)
      console.error('Demo anonymization error:', err)
      return null

    } finally {
      setIsAnonymizing(false)
    }
  }, [])

  const deanonymizeText = useCallback(async (text: string) => {
    if (!text.trim()) {
      setError('El texto no puede estar vacío')
      return null
    }

    setIsDeanonymizing(true)
    setError(null)

    try {
      // Simular delay de red
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const result = deanonymizeDemo(text)
      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en la desanonimización'
      setError(errorMessage)
      console.error('Demo deanonymization error:', err)
      return null

    } finally {
      setIsDeanonymizing(false)
    }
  }, [])

  const clearPII = useCallback(() => {
    setPiiList([])
    setAnonymizedText('')
    clearDemoMappings()
  }, [])

  const reset = useCallback(() => {
    setIsAnonymizing(false)
    setIsDeanonymizing(false)
    setPiiList([])
    setAnonymizedText('')
    setError(null)
    clearDemoMappings()
  }, [])

  return {
    // Estados
    isAnonymizing,
    isDeanonymizing,
    piiList,
    anonymizedText,
    error,
    
    // Funciones
    anonymizeText,
    deanonymizeText,
    clearPII,
    reset
  }
}
