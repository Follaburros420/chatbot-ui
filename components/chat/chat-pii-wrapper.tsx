"use client"

import { useState, useCallback } from 'react'
import { PIIPreview } from '@/components/pii/pii-preview'
import { usePII } from '@/lib/hooks/use-pii'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { IconAlertTriangle } from '@tabler/icons-react'

interface ChatPIIWrapperProps {
  children: React.ReactNode
  onMessageSend?: (message: string, isAnonymized: boolean) => void
  onMessageReceive?: (message: string) => Promise<string>
}

export const ChatPIIWrapper: React.FC<ChatPIIWrapperProps> = ({
  children,
  onMessageSend,
  onMessageReceive
}) => {
  const [showPIIPreview, setShowPIIPreview] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  const [isProcessingChat, setIsProcessingChat] = useState(false)
  
  const {
    isAnonymizing,
    isDeanonymizing,
    piiList,
    anonymizedText,
    error,
    anonymizeText,
    deanonymizeText,
    clearPII,
    reset
  } = usePII()

  // Interceptar envío de mensajes para verificar PII
  const handleMessageSend = useCallback(async (message: string) => {
    if (!message.trim()) return

    try {
      // Intentar anonimizar el mensaje
      const result = await anonymizeText(message)
      
      if (!result) {
        // Error en anonimización, enviar mensaje original
        onMessageSend?.(message, false)
        return
      }

      if (result.piiList.length > 0) {
        // Se detectó PII, mostrar preview
        setPendingMessage(message)
        setShowPIIPreview(true)
      } else {
        // No hay PII, enviar mensaje directamente
        onMessageSend?.(message, false)
        clearPII()
      }

    } catch (err) {
      console.error('Error processing message for PII:', err)
      // En caso de error, enviar mensaje original
      onMessageSend?.(message, false)
    }
  }, [anonymizeText, onMessageSend, clearPII])

  // Confirmar envío con PII anonimizado
  const handlePIIConfirm = useCallback(() => {
    if (anonymizedText && onMessageSend) {
      setIsProcessingChat(true)
      onMessageSend(anonymizedText, true)
      setShowPIIPreview(false)
      setPendingMessage('')
      // No limpiar PII aquí, se necesita para desanonimizar la respuesta
    }
  }, [anonymizedText, onMessageSend])

  // Cancelar envío con PII
  const handlePIICancel = useCallback(() => {
    setShowPIIPreview(false)
    setPendingMessage('')
    clearPII()
  }, [clearPII])

  // Procesar respuesta del chat para desanonimizar
  const handleMessageReceive = useCallback(async (message: string): Promise<string> => {
    try {
      // Si hay PII en el contexto y el mensaje contiene tokens, desanonimizar
      if (piiList.length > 0) {
        const deanonymizedMessage = await deanonymizeText(message)
        if (deanonymizedMessage) {
          // Limpiar PII después de desanonimizar
          clearPII()
          setIsProcessingChat(false)
          return deanonymizedMessage
        }
      }

      // Si no hay PII o falló la desanonimización, devolver mensaje original
      setIsProcessingChat(false)
      return onMessageReceive ? await onMessageReceive(message) : message

    } catch (err) {
      console.error('Error deanonymizing message:', err)
      setIsProcessingChat(false)
      clearPII()
      return message
    }
  }, [piiList, deanonymizeText, clearPII, onMessageReceive])

  // Renderizar preview de PII si es necesario
  if (showPIIPreview) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background/50 backdrop-blur-sm">
        <div className="w-full max-w-2xl mx-auto p-6">
          <PIIPreview
            piiList={piiList}
            onConfirm={handlePIIConfirm}
            onCancel={handlePIICancel}
            loading={isProcessingChat}
          />
        </div>
      </div>
    )
  }

  // Mostrar error si existe
  if (error) {
    return (
      <div className="p-4">
        <Alert className="border-red-200 bg-red-50">
          <IconAlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Error de PII:</strong> {error}
          </AlertDescription>
        </Alert>
        {children}
      </div>
    )
  }

  // Clonar children y pasar props modificados
  return (
    <div className="relative">
      {/* Indicador de procesamiento PII */}
      {(isAnonymizing || isDeanonymizing || isProcessingChat) && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-orange-100 border-b border-orange-200 p-2">
          <div className="flex items-center justify-center space-x-2 text-orange-800">
            <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">
              {isAnonymizing && "Protegiendo datos sensibles..."}
              {isDeanonymizing && "Restaurando información personal..."}
              {isProcessingChat && "Procesando mensaje protegido..."}
            </span>
          </div>
        </div>
      )}

      {/* Renderizar children con props modificados */}
      {React.cloneElement(children as React.ReactElement, {
        onMessageSend: handleMessageSend,
        onMessageReceive: handleMessageReceive,
        isPIIProcessing: isAnonymizing || isDeanonymizing || isProcessingChat
      })}
    </div>
  )
}

export default ChatPIIWrapper
