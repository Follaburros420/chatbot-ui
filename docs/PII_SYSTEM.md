# Sistema de Anonimización PII - ALI Chatbot

## 📋 Resumen

Este sistema implementa anonimización y desanonimización completa de datos sensibles (PII) para el chatbot ALI, ejecutándose enteramente en Vercel sin servicios externos adicionales.

## 🏗️ Arquitectura

```
Usuario → UI → Anonimización → LLM/RAG → Desanonimización → Usuario
                     ↓                           ↑
                Supabase (pii_mapping)    Supabase (pii_mapping)
```

## 📁 Estructura de Archivos

```
├── lib/
│   ├── pii.ts                     # Lógica principal de PII
│   └── hooks/
│       └── use-pii.ts             # Hook React para PII
├── pages/api/
│   ├── anonymize.ts               # API endpoint para anonimización
│   └── deanonymize.ts             # API endpoint para desanonimización
├── components/
│   ├── pii/
│   │   └── pii-preview.tsx        # Componente de vista previa PII
│   └── chat/
│       └── chat-pii-wrapper.tsx   # Wrapper para integración con chat
├── supabase/migrations/
│   └── 20241201000000_create_pii_mapping.sql  # Migración de BD
└── docs/
    └── PII_SYSTEM.md              # Esta documentación
```

## 🔧 Configuración

### 1. Variables de Entorno

```bash
# Supabase (requerido)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# PII Anonimización (requerido)
HMAC_SECRET=your_32_char_minimum_secret_key
```

### 2. Base de Datos

Ejecutar la migración SQL:

```sql
-- Crear tabla pii_mapping
CREATE TABLE pii_mapping (
    token TEXT PRIMARY KEY,
    original TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Despliegue en Vercel

1. Configurar variables de entorno en Vercel Dashboard
2. Asegurar que `HMAC_SECRET` sea diferente por ambiente
3. Verificar que `SUPABASE_SERVICE_ROLE_KEY` tenga permisos

## 🔍 Tipos de PII Detectados

| Tipo | Patrón | Ejemplo |
|------|--------|---------|
| EMAIL | Correos electrónicos | `usuario@ejemplo.com` |
| PHONE | Teléfonos colombianos | `+57 300 123 4567` |
| CEDULA | Cédulas de ciudadanía | `CC: 12345678` |
| CREDIT_CARD | Tarjetas de crédito | `4532 1234 5678 9012` |
| NAME | Nombres con títulos | `Dr. Juan Pérez` |
| ADDRESS | Direcciones | `Calle 123 #45-67` |

## 🔐 Flujo de Anonimización

### 1. Detección y Anonimización

```typescript
// Input del usuario
const userMessage = "Mi email es juan@ejemplo.com y mi cédula es CC: 12345678"

// Llamada a API
const result = await fetch('/api/anonymize', {
  method: 'POST',
  body: JSON.stringify({ text: userMessage })
})

// Resultado
{
  "anonymizedText": "Mi email es <PII_EMAIL_a1b2c3d4> y mi cédula es <PII_CEDULA_e5f6g7h8>",
  "piiList": [
    {
      "type": "EMAIL",
      "original": "juan@ejemplo.com",
      "token": "<PII_EMAIL_a1b2c3d4>",
      "startIndex": 12,
      "endIndex": 28
    }
  ]
}
```

### 2. Almacenamiento en Supabase

```sql
INSERT INTO pii_mapping (token, original) VALUES 
  ('<PII_EMAIL_a1b2c3d4>', 'juan@ejemplo.com')
ON CONFLICT (token) DO NOTHING;
```

### 3. Desanonimización

```typescript
// Respuesta del LLM con tokens
const llmResponse = "Hemos procesado la información de <PII_EMAIL_a1b2c3d4>"

// Llamada a API
const result = await fetch('/api/deanonymize', {
  method: 'POST',
  body: JSON.stringify({ text: llmResponse })
})

// Resultado final
{
  "text": "Hemos procesado la información de juan@ejemplo.com",
  "tokensProcessed": 1
}
```

## 🎨 Integración con UI

### Uso del Hook

```typescript
import { usePII } from '@/lib/hooks/use-pii'

function ChatComponent() {
  const { anonymizeText, deanonymizeText, piiList, isAnonymizing } = usePII()
  
  const handleSendMessage = async (message: string) => {
    const result = await anonymizeText(message)
    
    if (result && result.piiList.length > 0) {
      // Mostrar PIIPreview
      setShowPIIPreview(true)
    } else {
      // Enviar mensaje directamente
      sendToLLM(message)
    }
  }
}
```

### Componente PIIPreview

```typescript
import { PIIPreview } from '@/components/pii/pii-preview'

<PIIPreview
  piiList={piiList}
  onConfirm={() => sendToLLM(anonymizedText)}
  onCancel={() => clearMessage()}
  loading={isProcessing}
/>
```

## 🔒 Seguridad

### Características de Seguridad

1. **Tokens Deterministas**: Mismo valor → mismo token
2. **HMAC-SHA256**: Criptográficamente seguro
3. **No Logging**: Valores originales nunca se loguean
4. **RLS Policies**: Acceso controlado en Supabase
5. **Service Role**: Solo operaciones server-side

### Mejores Prácticas

1. **Rotar HMAC_SECRET** periódicamente
2. **Monitorear tabla** `pii_mapping` por tamaño
3. **Limpiar tokens antiguos** regularmente
4. **Usar HTTPS** siempre
5. **Validar entrada** en todos los endpoints

## 🚀 Integración con Chat Existente

### Wrapper Automático

```typescript
import { ChatPIIWrapper } from '@/components/chat/chat-pii-wrapper'

function ChatPage() {
  return (
    <ChatPIIWrapper
      onMessageSend={(message, isAnonymized) => {
        // Enviar al LLM
      }}
      onMessageReceive={async (response) => {
        // Procesar respuesta
        return response
      }}
    >
      <ExistingChatComponent />
    </ChatPIIWrapper>
  )
}
```

### Modificación Mínima

El wrapper intercepta automáticamente:
- ✅ Mensajes salientes (anonimización)
- ✅ Respuestas entrantes (desanonimización)
- ✅ Estados de carga
- ✅ Manejo de errores

## 📊 Monitoreo y Mantenimiento

### Estadísticas de Uso

```sql
SELECT * FROM get_pii_stats();
-- Retorna: total_tokens, tokens_today, tokens_this_week, tokens_this_month
```

### Limpieza de Datos Antiguos

```sql
SELECT cleanup_old_pii_mappings(30); -- Eliminar tokens > 30 días
```

### Logs de Aplicación

```typescript
// Solo se loguean estadísticas, nunca valores originales
console.log(`PII anonymization completed: ${piiList.length} items detected`)
console.log(`Deanonymizing ${tokens.length} PII tokens`)
```

## 🐛 Troubleshooting

### Errores Comunes

1. **"HMAC_SECRET is required"**
   - Verificar variable de entorno
   - Debe tener mínimo 32 caracteres

2. **"Database configuration error"**
   - Verificar `SUPABASE_SERVICE_ROLE_KEY`
   - Verificar `NEXT_PUBLIC_SUPABASE_URL`

3. **"No mapping found for token"**
   - Token puede haber expirado
   - Verificar conectividad con Supabase

### Debug Mode

```typescript
// Habilitar logs detallados
process.env.DEBUG_PII = 'true'
```

## 📈 Rendimiento

### Optimizaciones

1. **Índices de BD**: Búsquedas O(log n)
2. **Caching**: Tokens reutilizables
3. **Batch Processing**: Múltiples tokens por request
4. **Lazy Loading**: Componentes bajo demanda

### Métricas Esperadas

- **Anonimización**: ~100-500ms
- **Desanonimización**: ~50-200ms
- **Almacenamiento**: ~10-50ms por token
- **UI Response**: <100ms para preview

## 🔄 Flujo Completo de Ejemplo

```
1. Usuario: "Mi email es juan@ejemplo.com, necesito ayuda legal"
2. Sistema: Detecta EMAIL PII
3. UI: Muestra PIIPreview con "Correo Electrónico: ju***@ejemplo.com"
4. Usuario: Confirma protección
5. Sistema: Envía "Mi email es <PII_EMAIL_a1b2c3d4>, necesito ayuda legal"
6. LLM: Procesa y responde "Hemos recibido tu consulta de <PII_EMAIL_a1b2c3d4>"
7. Sistema: Desanonimiza a "Hemos recibido tu consulta de juan@ejemplo.com"
8. Usuario: Ve respuesta con sus datos reales
```

## ✅ Checklist de Implementación

- [ ] Configurar variables de entorno
- [ ] Ejecutar migración SQL
- [ ] Probar endpoints `/api/anonymize` y `/api/deanonymize`
- [ ] Integrar `ChatPIIWrapper` en componente de chat
- [ ] Verificar detección de PII en desarrollo
- [ ] Probar flujo completo end-to-end
- [ ] Configurar monitoreo en producción
- [ ] Documentar para el equipo

---

**⚠️ Importante**: Este sistema maneja datos sensibles. Siempre seguir las mejores prácticas de seguridad y cumplir con regulaciones de privacidad aplicables (GDPR, CCPA, etc.).
