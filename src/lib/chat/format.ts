import {isAddress} from 'viem'
import {truncateByGrapheme} from '@/lib/chat/grapheme'

const NAME_COLORS = [
    'text-[#b8f04a]',
    'text-[#5ce1ff]',
    'text-[#f7d436]',
    'text-[#ff6b6b]',
    'text-[#c4a1ff]',
    'text-[#ffa86b]',
] as const

export function isWalletClientId(value: string | undefined | null): value is string {
    return Boolean(value && isAddress(value))
}

export function formatChatDisplayName(address: string) {
    return `${address.slice(0, 6)}…${address.slice(-4)}`
}

export function chatNameColorClass(address: string) {
    let hash = 0
    for (let i = 0; i < address.length; i += 1) {
        hash = (hash * 31 + address.charCodeAt(i)) >>> 0
    }
    return NAME_COLORS[hash % NAME_COLORS.length]
}

export function sanitizeChatText(raw: string, maxLength: number) {
    return truncateByGrapheme(raw.replace(/\s+/g, ' ').trim(), maxLength)
}

export function clampChatDraft(raw: string, maxLength: number) {
    return truncateByGrapheme(raw, maxLength)
}

export function insertChatTextAt(
    value: string,
    insert: string,
    start: number,
    end: number,
    maxLength: number,
) {
    const next = `${value.slice(0, start)}${insert}${value.slice(end)}`
    const clamped = truncateByGrapheme(next, maxLength)
    const idealCaret = start + insert.length

    return {
        value: clamped,
        caret: Math.min(idealCaret, clamped.length),
    }
}
