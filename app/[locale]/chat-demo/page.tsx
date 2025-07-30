"use client"

import { useState, useRef, useEffect } from "react"
import { Brand } from "@/components/ui/brand"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  IconSend, 
  IconUser, 
  IconRobot, 
  IconSparkles, 
  IconArrowLeft,
  IconShield,
  IconCopy,
  IconCheck
} from "@tabler/icons-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

export default function ChatDemoPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy ALI, tu Asistente Legal Inteligente. Estoy aquí para ayudarte con consultas legales, análisis de documentos, investigación jurídica y redacción de escritos. ¿En qué puedo asistirte hoy?',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simular respuesta del chatbot (reemplazar con llamada real a la API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: generateDemoResponse(userMessage.content),
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const generateDemoResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    if (input.includes('contrato') || input.includes('acuerdo')) {
      return `Entiendo que necesitas ayuda con contratos. Como asistente legal, puedo ayudarte con:

• **Análisis de contratos**: Revisar cláusulas, identificar riesgos y sugerir mejoras
• **Redacción de contratos**: Crear borradores basados en tus necesidades específicas
• **Tipos de contratos**: Laborales, comerciales, arrendamiento, compraventa, etc.

¿Podrías contarme más detalles sobre el tipo de contrato que necesitas? Por ejemplo:
- ¿Es un contrato nuevo o necesitas revisar uno existente?
- ¿Qué tipo de contrato es (laboral, comercial, etc.)?
- ¿Cuáles son las partes involucradas?

Esto me permitirá brindarte una asistencia más precisa y personalizada.`
    }
    
    if (input.includes('demanda') || input.includes('proceso') || input.includes('judicial')) {
      return `Te puedo asistir con procesos judiciales y demandas. Mi experiencia incluye:

• **Análisis de casos**: Evaluación de fortalezas y debilidades legales
• **Redacción de demandas**: Estructura, fundamentos de hecho y de derecho
• **Estrategia procesal**: Recomendaciones sobre el mejor curso de acción
• **Jurisprudencia**: Búsqueda de precedentes relevantes

Para ayudarte mejor, necesito conocer:
- ¿Qué tipo de proceso judicial estás considerando?
- ¿Cuál es la naturaleza del conflicto?
- ¿Ya tienes documentos o evidencias relacionadas?

Recuerda que esta es una consulta informativa y siempre debes validar con un abogado colegiado para casos específicos.`
    }
    
    if (input.includes('derecho laboral') || input.includes('trabajo') || input.includes('empleado')) {
      return `El derecho laboral es una de mis especialidades. Puedo ayudarte con:

• **Contratos laborales**: Redacción, revisión y modificaciones
• **Terminación laboral**: Procedimientos, indemnizaciones y causales
• **Derechos del trabajador**: Salarios, prestaciones, vacaciones
• **Acoso laboral**: Procedimientos y protecciones legales
• **Seguridad social**: Afiliaciones, pensiones y riesgos laborales

¿Tienes alguna situación laboral específica que necesites consultar? Puedo orientarte sobre:
- Tus derechos como empleado o empleador
- Procedimientos legales aplicables
- Documentación necesaria
- Pasos a seguir según tu caso

¿En qué aspecto del derecho laboral necesitas asistencia?`
    }
    
    if (input.includes('empresa') || input.includes('sociedad') || input.includes('comercial')) {
      return `Perfecto, el derecho comercial y empresarial es fundamental. Te puedo asistir con:

• **Constitución de empresas**: SAS, LTDA, SA y otros tipos societarios
• **Contratos comerciales**: Compraventa, distribución, franquicias
• **Derecho societario**: Juntas, reformas estatutarias, fusiones
• **Propiedad intelectual**: Marcas, patentes, derechos de autor
• **Regulación comercial**: Cumplimiento normativo y licencias

Para brindarte la mejor asesoría, cuéntame:
- ¿Estás creando una nueva empresa o tienes una existente?
- ¿Qué tipo de actividad comercial desarrollas?
- ¿Tienes socios o trabajas independientemente?
- ¿Hay algún aspecto legal específico que te preocupe?

Con esta información podré darte recomendaciones más precisas y útiles.`
    }
    
    // Respuesta general
    return `Gracias por tu consulta. Como ALI, tu Asistente Legal Inteligente, estoy aquí para ayudarte con una amplia gama de temas legales:

**Mis especialidades incluyen:**
• Derecho Civil y Comercial
• Derecho Laboral
• Derecho Penal
• Derecho Administrativo
• Contratos y Obligaciones
• Derecho de Familia
• Propiedad Intelectual

**Servicios que ofrezco:**
• Análisis de documentos legales
• Redacción de contratos y escritos
• Investigación jurisprudencial
• Consultas sobre procedimientos legales
• Orientación sobre derechos y obligaciones

Para brindarte la mejor asistencia, ¿podrías ser más específico sobre tu consulta legal? Por ejemplo:
- ¿Qué área del derecho te interesa?
- ¿Tienes algún documento que necesites revisar?
- ¿Hay alguna situación legal particular que te preocupe?

Estoy aquí para ayudarte de la manera más efectiva posible. 🏛️⚖️`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/es">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                  <IconArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              <Brand variant="compact" />
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Demo Activo
              </Badge>
              <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                <IconShield className="w-3 h-3 mr-1" />
                PII Protegido
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Demo Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <IconSparkles className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Modo Demo:</strong> Esta es una versión de demostración de ALI. 
            Las respuestas son simuladas para mostrar las capacidades del sistema. 
            Para acceso completo, <Link href="/es/login" className="underline font-medium">inicia sesión aquí</Link>.
          </AlertDescription>
        </Alert>

        {/* Messages */}
        <Card className="mb-6 min-h-[500px] max-h-[600px] overflow-hidden">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <IconRobot className="w-5 h-5 mr-2 text-legal-blue" />
              Chat con ALI - Asistente Legal Inteligente
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[500px] overflow-y-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-legal-blue text-white'
                      : 'bg-muted border border-border'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.role === 'assistant' && (
                      <IconRobot className="w-5 h-5 text-legal-blue mt-0.5 flex-shrink-0" />
                    )}
                    {message.role === 'user' && (
                      <IconUser className="w-5 h-5 text-white mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">
                        {message.content}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className={`text-xs ${
                          message.role === 'user' ? 'text-white/70' : 'text-muted-foreground'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                        {message.role === 'assistant' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(message.content, message.id)}
                            className="h-6 px-2 text-muted-foreground hover:text-foreground"
                          >
                            {copiedMessageId === message.id ? (
                              <IconCheck className="w-3 h-3" />
                            ) : (
                              <IconCopy className="w-3 h-3" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg p-4 bg-muted border border-border">
                  <div className="flex items-center space-x-2">
                    <IconRobot className="w-5 h-5 text-legal-blue" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-legal-blue rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-legal-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-legal-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">ALI está escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </CardContent>
        </Card>

        {/* Input */}
        <Card>
          <CardContent className="p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu consulta legal aquí... (Ej: Necesito ayuda con un contrato laboral)"
                className="flex-1 h-12"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="ali-button-primary h-12 px-6"
              >
                <IconSend className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-center">
              Presiona Enter para enviar • Shift + Enter para nueva línea
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            <IconShield className="w-4 h-4 inline mr-1" />
            Tus datos están protegidos con anonimización PII automática
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Esta es una demostración. Para consultas reales, consulta siempre con un abogado colegiado.
          </p>
        </div>
      </div>
    </div>
  )
}
