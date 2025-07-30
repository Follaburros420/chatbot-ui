import { NextApiRequest, NextApiResponse } from 'next'
import { deanonymize, containsPIITokens, extractPIITokens } from '@/lib/pii'

export interface DeanonymizeRequest {
  text: string
}

export interface DeanonymizeResponse {
  success: boolean
  text: string
  tokensProcessed: number
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeanonymizeResponse>
) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      text: '',
      tokensProcessed: 0,
      error: 'Method not allowed'
    })
  }

  try {
    const { text }: DeanonymizeRequest = req.body

    // Validar entrada
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        text: '',
        tokensProcessed: 0,
        error: 'Text is required and must be a string'
      })
    }

    // Verificar si el texto contiene tokens PII
    if (!containsPIITokens(text)) {
      // No hay tokens para procesar, devolver texto original
      return res.status(200).json({
        success: true,
        text,
        tokensProcessed: 0
      })
    }

    // Verificar configuración de Supabase
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase configuration is missing')
      return res.status(500).json({
        success: false,
        text: '',
        tokensProcessed: 0,
        error: 'Database configuration error'
      })
    }

    // Extraer tokens para logging
    const tokens = extractPIITokens(text)
    console.log(`Deanonymizing ${tokens.length} PII tokens`)

    // Procesar desanonimización
    const deanonymizedText = await deanonymize(text)

    return res.status(200).json({
      success: true,
      text: deanonymizedText,
      tokensProcessed: tokens.length
    })

  } catch (error) {
    console.error('Deanonymization error:', error)
    
    return res.status(500).json({
      success: false,
      text: '',
      tokensProcessed: 0,
      error: 'Internal server error during deanonymization'
    })
  }
}
