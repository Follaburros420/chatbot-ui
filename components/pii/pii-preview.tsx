"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  IconShield, 
  IconEye, 
  IconEyeOff, 
  IconCheck, 
  IconX, 
  IconAlertTriangle,
  IconLock
} from "@tabler/icons-react"
import { PIIItem, formatPIIType, getPIIStats } from "@/lib/pii-demo"

interface PIIPreviewProps {
  piiList: PIIItem[]
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export const PIIPreview: React.FC<PIIPreviewProps> = ({
  piiList,
  onConfirm,
  onCancel,
  loading = false
}) => {
  const [showOriginalValues, setShowOriginalValues] = useState(false)
  const stats = getPIIStats(piiList)
  const totalItems = piiList.length

  if (totalItems === 0) {
    return null
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      EMAIL: "bg-blue-100 text-blue-800 border-blue-200",
      PHONE: "bg-green-100 text-green-800 border-green-200",
      CEDULA: "bg-yellow-100 text-yellow-800 border-yellow-200",
      CREDIT_CARD: "bg-red-100 text-red-800 border-red-200",
      NAME: "bg-purple-100 text-purple-800 border-purple-200",
      ADDRESS: "bg-orange-100 text-orange-800 border-orange-200"
    }
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const maskValue = (value: string, type: string) => {
    switch (type) {
      case 'EMAIL':
        const [user, domain] = value.split('@')
        return `${user.substring(0, 2)}***@${domain}`
      case 'PHONE':
        return `***-***-${value.slice(-4)}`
      case 'CEDULA':
        return `***${value.slice(-3)}`
      case 'CREDIT_CARD':
        return `****-****-****-${value.slice(-4)}`
      default:
        return `${value.substring(0, 2)}***`
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-2 border-orange-200 bg-orange-50/50">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-2">
          <IconShield className="w-6 h-6 text-orange-600" />
          <CardTitle className="text-lg font-semibold text-orange-800">
            Datos Sensibles Detectados
          </CardTitle>
        </div>
        <CardDescription className="text-orange-700">
          Se han detectado {totalItems} elemento{totalItems !== 1 ? 's' : ''} de información personal. 
          Estos datos serán protegidos antes de enviar tu consulta.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Estadísticas */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(stats).map(([type, count]) => {
            if (count === 0) return null
            return (
              <Badge 
                key={type} 
                variant="outline" 
                className={getTypeColor(type)}
              >
                {formatPIIType(type as any)}: {count}
              </Badge>
            )
          })}
        </div>

        {/* Lista de elementos PII */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {piiList.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
            >
              <div className="flex items-center space-x-3">
                <Badge 
                  variant="outline" 
                  className={`${getTypeColor(item.type)} text-xs`}
                >
                  {formatPIIType(item.type)}
                </Badge>
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {showOriginalValues ? item.original : maskValue(item.original, item.type)}
                </code>
              </div>
              <IconLock className="w-4 h-4 text-orange-600" />
            </div>
          ))}
        </div>

        {/* Toggle para mostrar valores originales */}
        <div className="flex items-center justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowOriginalValues(!showOriginalValues)}
            className="text-orange-700 hover:text-orange-800 hover:bg-orange-100"
          >
            {showOriginalValues ? (
              <>
                <IconEyeOff className="w-4 h-4 mr-2" />
                Ocultar valores
              </>
            ) : (
              <>
                <IconEye className="w-4 h-4 mr-2" />
                Mostrar valores
              </>
            )}
          </Button>
        </div>

        {/* Información de seguridad */}
        <Alert className="border-blue-200 bg-blue-50">
          <IconShield className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Protección de Privacidad:</strong> Tus datos personales serán reemplazados por 
            tokens seguros antes de procesarse. Solo tú podrás ver los valores originales en la respuesta final.
          </AlertDescription>
        </Alert>

        {/* Botones de acción */}
        <div className="flex space-x-3 pt-4">
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Procesando...
              </>
            ) : (
              <>
                <IconCheck className="w-4 h-4 mr-2" />
                Continuar con Protección
              </>
            )}
          </Button>
          
          <Button
            onClick={onCancel}
            variant="outline"
            disabled={loading}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <IconX className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
        </div>

        {/* Advertencia adicional */}
        <div className="text-xs text-orange-600 text-center pt-2">
          <IconAlertTriangle className="w-3 h-3 inline mr-1" />
          Al continuar, confirmas que deseas proteger estos datos sensibles
        </div>
      </CardContent>
    </Card>
  )
}

export default PIIPreview
