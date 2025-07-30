"use client"

import { useState, useCallback } from 'react'
import { PIIItem } from '@/lib/pii'
import { AnonymizeResponse } from '@/pages/api/anonymize'
import { DeanonymizeResponse } from '@/pages/api/deanonymize'

interface UsePIIReturn {
  // Estados
  isAnonymizing: boolean
  isDeanonymizing: boolean
  piiList: PIIItem[]
  anonymizedText: string
  error: string | null
  
  // Funciones
  anonymizeText: (text: string) => Promise<AnonymizeResponse | null>
  deanonymizeText: (text: string) => Promise<string | null>
  clearPII: () => void
  reset: () => void
}

export const usePII = (): UsePIIReturn => {
  const [isAnonymizing, setIsAnonymizing] = useState(false)
  const [isDeanonymizing, setIsDeanonymizing] = useState(false)
  const [piiList, setPiiList] = useState<PIIItem[]>([])
  const [anonymizedText, setAnonymizedText] = useState('')
  const [error, setError] = useState<string | null>(null)

  const anonymizeText = useCallback(async (text: string): Promise<AnonymizeResponse | null> => {
    if (!text.trim()) {
      setError('El texto no puede estar vacío')
      return null
    }

    setIsAnonymizing(true)
    setError(null)

    try {
      const response = await fetch('/api/anonymize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: AnonymizeResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error en la anonimización')
      }

      // Actualizar estado local
      setPiiList(result.piiList)
      setAnonymizedText(result.anonymizedText)

      return result

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en la anonimización'
      setError(errorMessage)
      console.error('Anonymization error:', err)
      return null

    } finally {
      setIsAnonymizing(false)
    }
  }, [])

  const deanonymizeText = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim()) {
      setError('El texto no puede estar vacío')
      return null
    }

    setIsDeanonymizing(true)
    setError(null)

    try {
      const response = await fetch('/api/deanonymize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result: DeanonymizeResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Error en la desanonimización')
      }

      return result.text

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido en la desanonimización'
      setError(errorMessage)
      console.error('Deanonymization error:', err)
      return null

    } finally {
      setIsDeanonymizing(false)
    }
  }, [])

  const clearPII = useCallback(() => {
    setPiiList([])
    setAnonymizedText('')
  }, [])

  const reset = useCallback(() => {
    setIsAnonymizing(false)
    setIsDeanonymizing(false)
    setPiiList([])
    setAnonymizedText('')
    setError(null)
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

// Hook para validar configuración PII
export const usePIIConfig = () => {
  const [isConfigValid, setIsConfigValid] = useState<boolean | null>(null)
  const [configError, setConfigError] = useState<string | null>(null)

  const validateConfig = useCallback(async () => {
    try {
      const response = await fetch('/api/anonymize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: 'test' }),
      })

      if (response.status === 500) {
        const result = await response.json()
        if (result.error?.includes('configuration')) {
          setConfigError(result.error)
          setIsConfigValid(false)
          return
        }
      }

      setIsConfigValid(true)
      setConfigError(null)

    } catch (err) {
      setConfigError('No se pudo validar la configuración PII')
      setIsConfigValid(false)
    }
  }, [])

  return {
    isConfigValid,
    configError,
    validateConfig
  }
}
