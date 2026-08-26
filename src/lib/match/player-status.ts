import type {PlayerArenaStatus, PlayerProfile} from '@/lib/coliseum-contract'
import {MINIMUM_NEN_TO_EARN} from '@/lib/match/technique-enum'

export type PostMatchScreen = 'arena' | 'eliminated' | 'cashout'

export function totalTechniques(profile: PlayerProfile) {
    return profile.guu + profile.paa + profile.chi
}

export function isPlayerEliminatedFromStatus(status: PlayerArenaStatus) {
    if (status.nen <= 0) {
        return true
    }
    return status.techniques <= 0 && status.nen < MINIMUM_NEN_TO_EARN
}

export function canPlayerCashOutFromStatus(status: PlayerArenaStatus) {
    return status.nen >= MINIMUM_NEN_TO_EARN && status.techniques <= 0
}

export function isPlayerEliminated(profile: PlayerProfile) {
    if (profile.nen <= 0) {
        return true
    }

    const cards = totalTechniques(profile)
    return cards <= 0 && profile.nen < MINIMUM_NEN_TO_EARN
}

export function canPlayerCashOut(profile: PlayerProfile) {
    return profile.nen >= MINIMUM_NEN_TO_EARN && totalTechniques(profile) <= 0
}

export function getPostMatchScreenFromStatus(status: PlayerArenaStatus): PostMatchScreen {
    if (isPlayerEliminatedFromStatus(status)) {
        return 'eliminated'
    }
    if (canPlayerCashOutFromStatus(status)) {
        return 'cashout'
    }
    return 'arena'
}

export function getPostMatchScreen(profile: PlayerProfile): PostMatchScreen {
    if (isPlayerEliminated(profile)) {
        return 'eliminated'
    }
    if (canPlayerCashOut(profile)) {
        return 'cashout'
    }
    return 'arena'
}
