import type {ColiseumChainAction} from '@/lib/coliseum-chain-types'
import type {ParsedColiseumEvent} from '@/lib/coliseum-events'
import {clearAwaitingArenaSync, pollUntilPlayerInArena} from '@/lib/coliseum-player-sync'

export type ColiseumEventHandlerDeps = {
    refetchAll: () => Promise<void>
    refetchPlayer: () => Promise<{data?: unknown}>
    refetchProfile: () => Promise<unknown>
}

export async function handleColiseumEvents(
    action: ColiseumChainAction,
    events: ParsedColiseumEvent[],
    deps: ColiseumEventHandlerDeps,
): Promise<void> {
    switch (action) {
        case 'join_arena': {
            const playerJoined = events.some((event) => event.eventName === 'PlayerJoin')
            if (!playerJoined) {
                console.warn('[coliseum] join_arena confirmed without PlayerJoin event')
            }

            const synced = await pollUntilPlayerInArena(deps.refetchPlayer)
            if (synced) {
                clearAwaitingArenaSync()
                await deps.refetchProfile()
            } else {
                await deps.refetchAll()
            }
            break
        }
        case 'join_match': {
            const matchStarted = events.find((event) => event.eventName === 'MatchStart')
            if (matchStarted) {
                await deps.refetchAll()
            }
            break
        }
        case 'play_match': {
            await deps.refetchAll()
            break
        }
        case 'reveal_match':
        case 'skip_afk_play':
        case 'skip_afk_reveal': {
            await deps.refetchAll()
            break
        }
        case 'withdraw_gains': {
            const withdrew = events.find((event) => event.eventName === 'WithdrawRewards')
            if (withdrew) {
                await deps.refetchAll()
            }
            break
        }
    }
}
