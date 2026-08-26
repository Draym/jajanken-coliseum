'use client'

type PersistedConnections = {
    __type?: 'Map'
    value?: [unknown, unknown][]
}

type PersistedWagmiStore = {
    state?: {
        current?: string | null
        connections?: PersistedConnections | Map<unknown, unknown>
    }
}

const GAME_SHELL_ROUTES = ['/game', '/arena', '/duel', '/tournament'] as const

export function isGameShellRoute(pathname: string): boolean {
    return GAME_SHELL_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`),
    )
}

export function hasPersistedWalletConnection(): boolean {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        const raw = window.sessionStorage.getItem('wagmi.store')
        if (!raw) {
            return false
        }

        const parsed = JSON.parse(raw) as PersistedWagmiStore
        const state = parsed.state
        if (!state) {
            return false
        }

        if (state.current) {
            return true
        }

        const connections = state.connections
        if (connections && typeof connections === 'object' && '__type' in connections) {
            return Array.isArray(connections.value) && connections.value.length > 0
        }

        return false
    } catch {
        return false
    }
}
