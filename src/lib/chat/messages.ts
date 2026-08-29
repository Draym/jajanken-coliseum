import type {InboundMessage, Message} from 'ably'
import {ARENA_CHAT_MAX_LENGTH} from '@/lib/chat/constants'
import {isWalletClientId, sanitizeChatText} from '@/lib/chat/format'
import type {ArenaChatMessage} from '@/lib/chat/types'

function readTextPayload(data: unknown): string | null {
    if (typeof data === 'string') {
        return sanitizeChatText(data, ARENA_CHAT_MAX_LENGTH)
    }

    if (data && typeof data === 'object' && 'text' in data) {
        const text = (data as {text?: unknown}).text
        if (typeof text === 'string') {
            return sanitizeChatText(text, ARENA_CHAT_MAX_LENGTH)
        }
    }

    return null
}

export function parseArenaChatMessage(message: Message | InboundMessage): ArenaChatMessage | null {
    if (!isWalletClientId(message.clientId)) return null

    const text = readTextPayload(message.data)
    if (!text) return null

    const id = message.id ?? `${message.clientId}:${message.timestamp ?? Date.now()}:${text}`
    const timestamp = typeof message.timestamp === 'number' ? message.timestamp : Date.now()

    return {
        id,
        clientId: message.clientId,
        text,
        timestamp,
    }
}

export function sortChatMessages(messages: ArenaChatMessage[]) {
    return [...messages].sort((a, b) => a.timestamp - b.timestamp || a.id.localeCompare(b.id))
}

export function mergeChatMessages(existing: ArenaChatMessage[], incoming: ArenaChatMessage[]) {
    const byId = new Map<string, ArenaChatMessage>()
    for (const message of existing) byId.set(message.id, message)
    for (const message of incoming) byId.set(message.id, message)
    return sortChatMessages([...byId.values()])
}
