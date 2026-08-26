import {
    isPlayerInArena,
    parsePlayerArenaStatus,
    type PlayerArenaStatus,
} from '@/lib/coliseum-contract'

type PlayerArenaStatusResult = Parameters<typeof parsePlayerArenaStatus>[0]

export const AWAITING_ARENA_SYNC_KEY = 'jajanken-awaiting-arena-sync'

const POLL_INTERVAL_MS = 2000
const MAX_POLL_ATTEMPTS = 15

function sleep(ms: number) {
    return new Promise((resolve) => {
        window.setTimeout(resolve, ms)
    })
}

export function markAwaitingArenaSync() {
    if (typeof window === 'undefined') {
        return
    }
    sessionStorage.setItem(AWAITING_ARENA_SYNC_KEY, '1')
}

export function clearAwaitingArenaSync() {
    if (typeof window === 'undefined') {
        return
    }
    sessionStorage.removeItem(AWAITING_ARENA_SYNC_KEY)
}

export function isAwaitingArenaSync() {
    if (typeof window === 'undefined') {
        return false
    }
    return sessionStorage.getItem(AWAITING_ARENA_SYNC_KEY) === '1'
}

export async function pollUntilPlayerInArena(
    refetchPlayer: () => Promise<{data?: unknown}>,
): Promise<boolean> {
    for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt++) {
        const {data} = await refetchPlayer()
        if (data) {
            const status = parsePlayerArenaStatus(data as PlayerArenaStatusResult)
            if (isPlayerInArena(status)) {
                return true
            }
        }

        if (attempt < MAX_POLL_ATTEMPTS - 1) {
            await sleep(POLL_INTERVAL_MS)
        }
    }

    return false
}
