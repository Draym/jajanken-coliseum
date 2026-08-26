import type {Address} from 'viem'
import {zeroAddress} from 'viem'
import coliseumAbiJson from '@/abis/JaJankenColiseum.json'
import {coliseumContractAddress} from '@/config/coliseum'

export const coliseumAbi = coliseumAbiJson
export const coliseumAddress = coliseumContractAddress
export const emptyMatchId = zeroAddress

export type PlayerArenaStatus = {
    nen: number
    techniques: number
}

export type PlayerProfile = {
    guu: number
    paa: number
    chi: number
    nen: number
    inMatch: `0x${string}`
}

type PlayerArenaStatusResult =
    | PlayerArenaStatus
    | readonly [bigint | number, bigint | number]

type PlayerProfileResult =
    | PlayerProfile
    | readonly [bigint | number, bigint | number, bigint | number, bigint | number, `0x${string}`]

function toNumber(value: unknown) {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

export function parsePlayerArenaStatus(result: PlayerArenaStatusResult): PlayerArenaStatus {
    if (Array.isArray(result)) {
        return {
            nen: toNumber(result[0]),
            techniques: toNumber(result[1]),
        }
    }

    const status = result as PlayerArenaStatus
    return {
        nen: toNumber(status.nen),
        techniques: toNumber(status.techniques),
    }
}

export function parsePlayerProfile(result: PlayerProfileResult): PlayerProfile {
    if (Array.isArray(result)) {
        return {
            guu: toNumber(result[0]),
            paa: toNumber(result[1]),
            chi: toNumber(result[2]),
            nen: toNumber(result[3]),
            inMatch: result[4],
        }
    }

    const profile = result as PlayerProfile
    return {
        guu: toNumber(profile.guu),
        paa: toNumber(profile.paa),
        chi: toNumber(profile.chi),
        nen: toNumber(profile.nen),
        inMatch: profile.inMatch,
    }
}

export function isPlayerInArena(status: PlayerArenaStatus | undefined) {
    return Boolean(status && status.nen > 0)
}

export function isPlayerInMatch(profile: PlayerProfile | undefined) {
    return Boolean(profile?.inMatch && profile.inMatch !== emptyMatchId)
}

export function getMatchIdFromEventArgs(args: Record<string, unknown>) {
    const matchId = args.matchId
    return typeof matchId === 'string' ? (matchId as Address) : undefined
}

export function getPlayerAddressArg(address: Address | undefined) {
    return address ? ([address] as const) : undefined
}
