import { ChatSettings } from "@/types"
import { StreamingTextResponse } from "ai"

export const runtime = "edge"

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const response = await fetch(
      "https://webhook.coinestate.com.co/webhook/650eeee5-d47c-4336-8476-4c77b9bb5460",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ chatSettings, messages })
      }
    )

    const text = await response.text()

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(text))
        controller.close()
      }
    })

    return new StreamingTextResponse(stream)
  } catch (error: any) {
    const errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500
    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
