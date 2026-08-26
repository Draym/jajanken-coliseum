import type {Address} from 'viem'
import {zeroAddress, zeroHash} from 'viem'
import {contractToTechniqueId} from '@/lib/match/technique-enum'
import type {TechniqueId} from '@/lib/techniques'

export type OnChainMatch = {
    p2: Address
    p1Hidden: `0x${string}`
    p2Hidden: `0x${string}`
    p1Revealed: number
    p2Revealed: number
    playTime: bigint
    revealTime: bigint
}

export type ParsedMatchEnd = {
    p1: Address
    p2: Address
    p1Played: TechniqueId | null
    p2Played: TechniqueId | null
    winner: Address
    isDraw: boolean
}

export function parseOnChainMatch(raw: readonly unknown[]): OnChainMatch {
    return {
        p2: raw[0] as Address,
        p1Hidden: raw[1] as `0x${string}`,
        p2Hidden: raw[2] as `0x${string}`,
        p1Revealed: Number(raw[3]),
        p2Revealed: Number(raw[4]),
        playTime: raw[5] as bigint,
        revealTime: raw[6] as bigint,
    }
}

export function isZeroBytes32(value: `0x${string}`) {
    return value === zeroHash
}

export function bothPlayersCommitted(match: OnChainMatch) {
    return !isZeroBytes32(match.p1Hidden) && !isZeroBytes32(match.p2Hidden)
}

export function getPlayerCommitment(match: OnChainMatch, player: Address, matchId: Address) {
    if (player.toLowerCase() === matchId.toLowerCase()) {
        return match.p1Hidden
    }
    return match.p2Hidden
}

export function hasPlayerCommitted(match: OnChainMatch, player: Address, matchId: Address) {
    const commitment = getPlayerCommitment(match, player, matchId)
    return !isZeroBytes32(commitment)
}

export function hasPlayerRevealed(match: OnChainMatch, player: Address, matchId: Address) {
    const revealed = player.toLowerCase() === matchId.toLowerCase() ? match.p1Revealed : match.p2Revealed
    return revealed !== 0
}

export function parseMatchEndArgs(args: Record<string, unknown>): ParsedMatchEnd {
    const winner = (args.winner as Address) ?? zeroAddress
    return {
        p1: args.p1 as Address,
        p2: args.p2 as Address,
        p1Played: contractToTechniqueId(Number(args.p1Played)),
        p2Played: contractToTechniqueId(Number(args.p2Played)),
        winner,
        isDraw: winner === zeroAddress,
    }
}

export function getOpponentAddress(matchId: Address, p2: Address, self: Address): Address {
    if (self.toLowerCase() === matchId.toLowerCase()) {
        return p2
    }
    return matchId
}

export function getOpponentAddressFromMatchEnd(end: ParsedMatchEnd, self: Address): Address {
    if (self.toLowerCase() === end.p1.toLowerCase()) {
        return end.p2
    }
    return end.p1
}

export function getSelfTechniqueFromEnd(end: ParsedMatchEnd, self: Address, matchId: Address): TechniqueId | null {
    if (self.toLowerCase() === matchId.toLowerCase()) {
        return end.p1Played
    }
    return end.p2Played
}

export function getOpponentTechniqueFromEnd(end: ParsedMatchEnd, self: Address, matchId: Address): TechniqueId | null {
    if (self.toLowerCase() === matchId.toLowerCase()) {
        return end.p2Played
    }
    return end.p1Played
}

export function didPlayerWin(end: ParsedMatchEnd, self: Address): boolean | null {
    if (end.isDraw) {
        return null
    }
    return end.winner.toLowerCase() === self.toLowerCase()
}
