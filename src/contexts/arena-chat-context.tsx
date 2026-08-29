'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'
import type * as Ably from 'ably'
import {useAccount} from 'wagmi'
import {
    ARENA_CHAT_CHANNEL,
    ARENA_CHAT_EVENT,
    ARENA_CHAT_HISTORY_LIMIT,
    ARENA_CHAT_HISTORY_WINDOW_MS,
    ARENA_CHAT_MAX_LENGTH,
    createArenaChatRealtime,
    getArenaChatChannel,
    mergeChatMessages,
    parseArenaChatMessage,
    sanitizeChatText,
    type ArenaChatConnectionStatus,
    type ArenaChatMessage,
} from '@/lib/chat'

type ArenaChatContextValue = {
    messages: ArenaChatMessage[]
    status: ArenaChatConnectionStatus
    selfClientId: string | null
    canSend: boolean
    sendMessage: (rawText: string) => Promise<boolean>
}

const ArenaChatContext = createContext<ArenaChatContextValue | null>(null)

function mapConnectionState(state: string): ArenaChatConnectionStatus {
    switch (state) {
        case 'connecting':
        case 'initialized':
            return 'connecting'
        case 'connected':
            return 'connected'
        case 'disconnected':
        case 'suspended':
        case 'closing':
        case 'closed':
            return 'disconnected'
        case 'failed':
            return 'failed'
        default:
            return 'connecting'
    }
}

export function ArenaChatProvider({children}: {children: ReactNode}) {
    const {address} = useAccount()
    const selfClientId = address ?? null

    const [messages, setMessages] = useState<ArenaChatMessage[]>([])
    const [status, setStatus] = useState<ArenaChatConnectionStatus>('idle')
    const realtimeRef = useRef<Ably.Realtime | null>(null)
    const channelRef = useRef<Ably.RealtimeChannel | null>(null)

    useEffect(() => {
        if (!selfClientId) {
            setStatus('idle')
            setMessages([])
            return
        }

        let cancelled = false
        const realtime = createArenaChatRealtime(selfClientId)
        realtimeRef.current = realtime
        setStatus('connecting')

        const onConnectionUpdate = () => {
            if (cancelled) return
            setStatus(mapConnectionState(realtime.connection.state))
        }

        realtime.connection.on(onConnectionUpdate)
        onConnectionUpdate()

        const channel = getArenaChatChannel(realtime, ARENA_CHAT_CHANNEL)
        channelRef.current = channel

        const onMessage = (message: Ably.InboundMessage) => {
            const parsed = parseArenaChatMessage(message)
            if (!parsed) return
            setMessages((prev) => mergeChatMessages(prev, [parsed]))
        }

        const bootstrap = async () => {
            try {
                await channel.subscribe(ARENA_CHAT_EVENT, onMessage)
                if (cancelled) return

                const historySince = Date.now() - ARENA_CHAT_HISTORY_WINDOW_MS
                const historyPage = await channel.history({
                    limit: ARENA_CHAT_HISTORY_LIMIT,
                    start: historySince,
                })
                if (cancelled) return

                const historical = historyPage.items
                    .map((item) => parseArenaChatMessage(item))
                    .filter((item): item is ArenaChatMessage => Boolean(item))
                    .filter((item) => item.timestamp >= historySince)
                    .reverse()

                setMessages((prev) => mergeChatMessages(historical, prev))
            } catch (error) {
                // React Strict Mode remounts in dev and closes the first client mid-bootstrap.
                if (cancelled) return
                console.error('[chat] failed to attach arena channel', error)
                setStatus('failed')
            }
        }

        void bootstrap()

        return () => {
            cancelled = true
            channelRef.current = null
            realtimeRef.current = null

            try {
                channel.unsubscribe(ARENA_CHAT_EVENT, onMessage)
            } catch {
                /* ignore */
            }

            try {
                realtime.connection.off(onConnectionUpdate)
            } catch {
                /* ignore */
            }

            // Defer close so Strict Mode's immediate remount doesn't surface Ably's
            // "Connection closed" as an overlay error on this effect frame.
            const state = realtime.connection.state
            if (state === 'closing' || state === 'closed') return

            queueMicrotask(() => {
                try {
                    const next = realtime.connection.state
                    if (next !== 'closing' && next !== 'closed') {
                        realtime.close()
                    }
                } catch {
                    /* ignore */
                }
            })
        }
    }, [selfClientId])

    const sendMessage = useCallback(
        async (rawText: string) => {
            const channel = channelRef.current
            const text = sanitizeChatText(rawText, ARENA_CHAT_MAX_LENGTH)
            if (!channel || !selfClientId || !text) return false
            if (realtimeRef.current?.connection.state !== 'connected') return false

            try {
                await channel.publish(ARENA_CHAT_EVENT, {text})
                return true
            } catch (error) {
                console.error('[chat] failed to publish message', error)
                return false
            }
        },
        [selfClientId],
    )

    const canSend = Boolean(selfClientId) && status === 'connected'

    const value = useMemo<ArenaChatContextValue>(
        () => ({
            messages,
            status,
            selfClientId,
            canSend,
            sendMessage,
        }),
        [canSend, messages, selfClientId, sendMessage, status],
    )

    return <ArenaChatContext.Provider value={value}>{children}</ArenaChatContext.Provider>
}

export function useArenaChat() {
    const context = useContext(ArenaChatContext)
    if (!context) {
        throw new Error('useArenaChat must be used within ArenaChatProvider')
    }
    return context
}
