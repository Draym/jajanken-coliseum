import {decodeEventLog, type Log} from 'viem'
import {coliseumAbi} from '@/lib/coliseum-contract'

export const coliseumEventNames = [
    'PlayerJoin',
    'MatchStart',
    'MatchPlayed',
    'MatchEnd',
    'WithdrawRewards',
] as const

export type ColiseumEventName = (typeof coliseumEventNames)[number]

export type ParsedColiseumEvent = {
    eventName: ColiseumEventName
    args: Record<string, unknown>
}

export function parseColiseumEvents(logs: readonly Log[]): ParsedColiseumEvent[] {
    const events: ParsedColiseumEvent[] = []

    for (const log of logs) {
        try {
            const decoded = decodeEventLog({
                abi: coliseumAbi,
                data: log.data,
                topics: log.topics,
            })

            const eventName = decoded.eventName
            if (!eventName || !coliseumEventNames.includes(eventName as ColiseumEventName)) {
                continue
            }

            events.push({
                eventName: eventName as ColiseumEventName,
                args: decoded.args as unknown as Record<string, unknown>,
            })
        } catch {
            /* unrelated log */
        }
    }

    return events
}
