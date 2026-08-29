'use client'

import dynamic from 'next/dynamic'
import {useCallback, useEffect, useRef, useState, type FormEvent} from 'react'
import {useArenaChat} from '@/contexts/arena-chat-context'
import {
    ARENA_CHAT_MAX_LENGTH,
    chatNameColorClass,
    clampChatDraft,
    formatChatDisplayName,
    insertChatTextAt,
} from '@/lib/chat'

const ArenaChatEmojiPicker = dynamic(() => import('@/views/arena/components/arena-chat-emoji-picker'), {
    ssr: false,
})

function statusLabel(status: ReturnType<typeof useArenaChat>['status']) {
    switch (status) {
        case 'connecting':
            return 'Connecting…'
        case 'connected':
            return null
        case 'disconnected':
            return 'Reconnecting…'
        case 'failed':
            return 'Chat unavailable'
        case 'unavailable':
            return 'Chat unavailable'
        case 'idle':
            return 'Connect wallet to chat'
        default:
            return null
    }
}

export default function ArenaChat() {
    const {messages, status, selfClientId, canSend, sendMessage} = useArenaChat()
    const [draft, setDraft] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [isEmojiOpen, setIsEmojiOpen] = useState(false)
    const listRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const hint = statusLabel(status)

    useEffect(() => {
        const node = listRef.current
        if (!node) return
        node.scrollTop = node.scrollHeight
    }, [messages])

    const closeEmojiPicker = useCallback(() => {
        setIsEmojiOpen(false)
    }, [])

    const insertEmoji = useCallback(
        (emoji: string) => {
            const input = inputRef.current
            const start = input?.selectionStart ?? draft.length
            const end = input?.selectionEnd ?? draft.length
            const {value, caret} = insertChatTextAt(draft, emoji, start, end, ARENA_CHAT_MAX_LENGTH)
            setDraft(value)
            setIsEmojiOpen(false)

            requestAnimationFrame(() => {
                const node = inputRef.current
                if (!node) return
                node.focus()
                node.setSelectionRange(caret, caret)
            })
        },
        [draft],
    )

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault()
        if (!canSend || isSending) return

        const text = draft
        setIsSending(true)
        const ok = await sendMessage(text)
        setIsSending(false)
        if (ok) {
            setDraft('')
            setIsEmojiOpen(false)
        }
    }

    return (
        <section className="flex min-h-0 flex-1 flex-col">
            <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-2.5 sm:px-5">
                <p className="m-0 text-[11px] font-black uppercase tracking-[0.04em] text-white/70 sm:text-xs">
                    Arena chat
                </p>
                {hint ? (
                    <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-white/35">
                        {hint}
                    </span>
                ) : (
                    <span className="text-[10px] font-bold uppercase tracking-[0.06em] text-[#b8f04a]/70">
                        Live
                    </span>
                )}
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                {messages.length === 0 ? (
                    <p className="m-0 text-sm leading-5 text-white/35">
                        No messages yet. Discuss strategy — lobby and matches share this room.
                    </p>
                ) : (
                    messages.map((entry) => {
                        const isSelf =
                            selfClientId !== null &&
                            entry.clientId.toLowerCase() === selfClientId.toLowerCase()

                        return (
                            <div
                                key={entry.id}
                                className={
                                    isSelf
                                        ? 'rounded-xl border border-[#b8f04a]/25 bg-[#b8f04a]/[0.04] px-3 py-2.5'
                                        : 'px-1 py-1'
                                }
                            >
                                <p className="m-0 text-sm leading-5 text-white/70">
                                    <span className={`font-black ${chatNameColorClass(entry.clientId)}`}>
                                        {formatChatDisplayName(entry.clientId)}
                                    </span>
                                    <span className="break-words text-[15px] leading-5 text-white/55">
                                        {' '}
                                        {entry.text}
                                    </span>
                                </p>
                            </div>
                        )
                    })
                )}
            </div>

            <form className="border-t border-white/[0.06] p-4" onSubmit={(event) => void onSubmit(event)}>
                <div className="flex gap-2">
                    <div className="relative min-w-0 flex-1">
                        {isEmojiOpen && canSend ? (
                            <ArenaChatEmojiPicker onSelect={insertEmoji} onClose={closeEmojiPicker} />
                        ) : null}

                        <div className="flex items-center rounded-xl border border-white/10 bg-[#0a0812] pr-1.5">
                            <input
                                ref={inputRef}
                                className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2.5 text-sm text-white outline-none placeholder:text-white/35 disabled:text-white/35"
                                placeholder={canSend ? 'Send a message' : 'Chat offline'}
                                value={draft}
                                disabled={!canSend || isSending}
                                onChange={(event) => setDraft(clampChatDraft(event.target.value, ARENA_CHAT_MAX_LENGTH))}
                                onKeyDown={(event) => {
                                    if (event.key === 'Escape' && isEmojiOpen) {
                                        event.preventDefault()
                                        closeEmojiPicker()
                                    }
                                }}
                                autoComplete="off"
                                enterKeyHint="send"
                            />
                            <button
                                type="button"
                                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-[15px] leading-none text-white/45 transition hover:bg-white/5 hover:text-white/80 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={isEmojiOpen ? 'Close emoji picker' : 'Open emoji picker'}
                                aria-expanded={isEmojiOpen}
                                disabled={!canSend || isSending}
                                onClick={() => setIsEmojiOpen((open) => !open)}
                            >
                                <span aria-hidden="true" className="block translate-y-px leading-none">
                                    ☺
                                </span>
                            </button>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="shrink-0 self-stretch rounded-xl border border-[#b8f04a]/50 bg-[#b8f04a]/15 px-4 text-xs font-black uppercase tracking-[0.08em] text-[#d7ff7a] disabled:cursor-not-allowed disabled:opacity-40"
                        disabled={!canSend || isSending || !draft.trim()}
                    >
                        Chat
                    </button>
                </div>
            </form>
        </section>
    )
}
