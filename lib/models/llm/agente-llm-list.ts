import { LLM } from "@/types"

const AGENTE_PLATFORM_LINK = "https://webhook.coinestate.com.co"

const AGENTE_ESPECIALIZADO: LLM = {
  modelId: "agente-especializado",
  modelName: "Agente especializado",
  provider: "agente",
  hostedId: "agente-especializado",
  platformLink: AGENTE_PLATFORM_LINK,
  imageInput: false
}

export const AGENTE_LLM_LIST: LLM[] = [AGENTE_ESPECIALIZADO]
