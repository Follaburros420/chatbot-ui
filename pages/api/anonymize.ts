import { NextApiRequest, NextApiResponse } from 'next'
import { anonymize, AnonymizeResult } from '@/lib/pii'

export interface AnonymizeRequest {
  text: string
}

export interface AnonymizeResponse extends AnonymizeResult {
  success: boolean
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnonymizeResponse>
) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
      anonymizedText: '',
      piiList: []
    })
  }

  try {
    const { text }: AnonymizeRequest = req.body

    // Validar entrada
    if (!text || typeof text !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Text is required and must be a string',
        anonymizedText: '',
        piiList: []
      })
    }

    // Verificar variables de entorno requeridas
    if (!process.env.HMAC_SECRET) {
      console.error('HMAC_SECRET environment variable is missing')
      return res.status(500).json({
        success: false,
        error: 'Server configuration error',
        anonymizedText: '',
        piiList: []
      })
    }

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase configuration is missing')
      return res.status(500).json({
        success: false,
        error: 'Database configuration error',
        anonymizedText: '',
        piiList: []
      })
    }

    // Procesar anonimización
    const result = await anonymize(text)

    // Log para debugging (sin datos sensibles)
    console.log(`PII anonymization completed: ${result.piiList.length} items detected`)

    return res.status(200).json({
      success: true,
      ...result
    })

  } catch (error) {
    console.error('Anonymization error:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Internal server error during anonymization',
      anonymizedText: '',
      piiList: []
    })
  }
}
