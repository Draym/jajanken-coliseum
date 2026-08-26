import type {Address, Hex} from 'viem'
import type {TechniqueId} from '@/lib/techniques'

const STORAGE_KEY = 'jajanken-match-commit'

export type StoredMatchCommit = {
    matchId: Address
    technique: TechniqueId
    revealKey: Hex
    revealSubmitted?: boolean
}

function readAll(): StoredMatchCommit[] {
    if (typeof window === 'undefined') {
        return []
    }

    try {
        const raw = sessionStorage.getItem(STORAGE_KEY)
        if (!raw) {
            return []
        }
        const parsed = JSON.parse(raw) as StoredMatchCommit[]
        return Array.isArray(parsed) ? parsed : []
    } catch {
        return []
    }
}

function writeAll(entries: StoredMatchCommit[]) {
    if (typeof window === 'undefined') {
        return
    }
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function saveMatchCommit(commit: StoredMatchCommit) {
    const entries = readAll().filter((entry) => entry.matchId.toLowerCase() !== commit.matchId.toLowerCase())
    entries.push(commit)
    writeAll(entries)
}

export function getMatchCommit(matchId: Address): StoredMatchCommit | undefined {
    return readAll().find((entry) => entry.matchId.toLowerCase() === matchId.toLowerCase())
}

export function clearMatchCommit(matchId: Address) {
    writeAll(readAll().filter((entry) => entry.matchId.toLowerCase() !== matchId.toLowerCase()))
}

export function markRevealSubmitted(matchId: Address) {
    const commit = getMatchCommit(matchId)
    if (!commit) {
        return
    }

    saveMatchCommit({...commit, revealSubmitted: true})
}

export function clearRevealSubmitted(matchId: Address) {
    const commit = getMatchCommit(matchId)
    if (!commit?.revealSubmitted) {
        return
    }

    saveMatchCommit({...commit, revealSubmitted: false})
}

export function hasRevealSubmitted(matchId: Address) {
    return Boolean(getMatchCommit(matchId)?.revealSubmitted)
}

export function clearAllMatchCommits() {
    if (typeof window === 'undefined') {
        return
    }
    sessionStorage.removeItem(STORAGE_KEY)
}

/** Drop commits for matches other than the active on-chain match (or all if none). */
export function pruneStaleMatchCommits(activeMatchId: Address | null) {
    if (typeof window === 'undefined') {
        return
    }

    if (!activeMatchId) {
        clearAllMatchCommits()
        return
    }

    writeAll(
        readAll().filter((entry) => entry.matchId.toLowerCase() === activeMatchId.toLowerCase()),
    )
}
