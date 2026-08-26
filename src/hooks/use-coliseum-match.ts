'use client'

import {useCallback, useEffect, useMemo, useState} from 'react'
import type {Address} from 'viem'
import {useAccount, useReadContract} from 'wagmi'
import {appChainId} from '@/config/chain'
import {isColiseumConfigured} from '@/config/coliseum'
import {useColiseumChain} from '@/contexts/coliseum-chain-context'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import type {MatchUiPhase} from '@/lib/coliseum-chain-types'
import {
    coliseumAbi,
    coliseumAddress,
    getPlayerAddressArg,
    isPlayerInMatch,
    parsePlayerArenaStatus,
} from '@/lib/coliseum-contract'
import {clearMatchCommit, getMatchCommit} from '@/lib/match/match-storage'
import {
    bothPlayersCommitted,
    getOpponentAddress,
    getOpponentTechniqueFromEnd,
    getSelfTechniqueFromEnd,
    hasPlayerCommitted,
    hasPlayerRevealed,
    parseOnChainMatch,
} from '@/lib/match/parse-match'
import type {ParsedMatchEnd} from '@/lib/match/parse-match'
import {getPostMatchScreenFromStatus, type PostMatchScreen} from '@/lib/match/player-status'
import type {TechniqueId} from '@/lib/techniques'

export type OpponentSnapshot = {
    address: Address
    nen: number
    totalTechniques: number
}

function deriveChainMatchPhase(params: {
    matchId: Address | null
    self: Address | undefined
    hasCommitted: boolean
    bothCommitted: boolean
    hasRevealed: boolean
    isPlayMatchLoading: boolean
    isRevealMatchLoading: boolean
}): MatchUiPhase {
    const {matchId, self, hasCommitted, bothCommitted, hasRevealed, isPlayMatchLoading, isRevealMatchLoading} = params

    if (!matchId || !self) return 'select'
    if (isPlayMatchLoading) return 'commit_pending'
    if (isRevealMatchLoading) return 'reveal_pending'
    if (!hasCommitted) return 'select'
    if (!bothCommitted) return 'waiting_commit'
    if (!hasRevealed) return 'reveal_ready'
    return 'waiting_reveal'
}

export function useColiseumMatch() {
    const {address} = useAccount()
    const {profile, refetchAll, refetchPlayer} = useColiseumPlayer()
    const {
        activeMatchId,
        setActiveMatchId,
        lastMatchEnd,
        clearLastMatchEnd,
        isPlayMatchLoading,
        isRevealMatchLoading,
        playMatch,
        revealMatch,
        skipAfkDuringPlay,
        skipAfkDuringReveal,
        isSkipAfkLoading,
    } = useColiseumChain()

    const [uiPhase, setUiPhase] = useState<MatchUiPhase>('select')
    const [postMatchScreen, setPostMatchScreen] = useState<PostMatchScreen | null>(null)
    const [selectedTechnique, setSelectedTechnique] = useState<TechniqueId | null>(null)
    const [resolutionData, setResolutionData] = useState<ParsedMatchEnd | null>(null)

    const matchId = activeMatchId ?? (profile && isPlayerInMatch(profile) ? profile.inMatch : null)

    useEffect(() => {
        if (profile && isPlayerInMatch(profile) && !activeMatchId) {
            setActiveMatchId(profile.inMatch)
        }
    }, [activeMatchId, profile, setActiveMatchId])

    const {data: matchRaw, refetch: refetchMatch} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'matches',
        args: matchId ? [matchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(matchId),
            refetchInterval: uiPhase === 'waiting_commit' || uiPhase === 'waiting_reveal' ? 3000 : false,
        },
    })

    const match = useMemo(() => {
        if (!matchRaw) return undefined
        return parseOnChainMatch(matchRaw as readonly unknown[])
    }, [matchRaw])

    const opponentAddress = useMemo(() => {
        if (!matchId || !match || !address) return undefined
        return getOpponentAddress(matchId, match.p2, address)
    }, [address, match, matchId])

    const {data: opponentRaw} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'getPlayer',
        args: getPlayerAddressArg(opponentAddress),
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(opponentAddress),
        },
    })

    const opponent = useMemo<OpponentSnapshot | undefined>(() => {
        if (!opponentAddress || !opponentRaw) return undefined
        const parsed = parsePlayerArenaStatus(opponentRaw as Parameters<typeof parsePlayerArenaStatus>[0])
        return {
            address: opponentAddress,
            nen: parsed.nen,
            totalTechniques: parsed.techniques,
        }
    }, [opponentAddress, opponentRaw])

    const {data: canSkipPlay} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'waitingForOpponentToPlay',
        args: matchId ? [matchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(matchId) && uiPhase === 'waiting_commit',
            refetchInterval: 5000,
        },
    })

    const {data: canSkipReveal} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'waitingForOpponentToReveal',
        args: matchId ? [matchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(matchId) && uiPhase === 'waiting_reveal',
            refetchInterval: 5000,
        },
    })

    const committedTechnique = matchId ? getMatchCommit(matchId)?.technique ?? null : null

    const chainPhase = useMemo(() => {
        if (!matchId || !address || !match) return 'select' as MatchUiPhase

        return deriveChainMatchPhase({
            matchId,
            self: address,
            hasCommitted: hasPlayerCommitted(match, address, matchId),
            bothCommitted: bothPlayersCommitted(match),
            hasRevealed: hasPlayerRevealed(match, address, matchId),
            isPlayMatchLoading,
            isRevealMatchLoading,
        })
    }, [address, isPlayMatchLoading, isRevealMatchLoading, match, matchId])

    useEffect(() => {
        if (uiPhase === 'resolution' || uiPhase === 'post_match') return
        setUiPhase(chainPhase)
    }, [chainPhase, uiPhase])

    useEffect(() => {
        if (!lastMatchEnd || !address || !matchId) return

        const involved =
            lastMatchEnd.p1.toLowerCase() === address.toLowerCase() ||
            lastMatchEnd.p2.toLowerCase() === address.toLowerCase()

        if (involved) {
            setResolutionData(lastMatchEnd)
            setUiPhase('resolution')
        }
    }, [address, lastMatchEnd, matchId])

    const isInMatch = Boolean(matchId && profile && isPlayerInMatch(profile))

    const selfTechnique = useMemo(() => {
        if (committedTechnique) return committedTechnique
        if (resolutionData && address && matchId) {
            return getSelfTechniqueFromEnd(resolutionData, address, matchId)
        }
        return selectedTechnique
    }, [address, committedTechnique, matchId, resolutionData, selectedTechnique])

    const opponentTechnique = useMemo(() => {
        if (resolutionData && address && matchId) {
            return getOpponentTechniqueFromEnd(resolutionData, address, matchId)
        }
        return null
    }, [address, matchId, resolutionData])

    const finishResolution = useCallback(async () => {
        clearLastMatchEnd()
        setResolutionData(null)
        if (matchId) clearMatchCommit(matchId)

        await refetchAll()
        const result = (await refetchPlayer()) as {data?: unknown}
        const freshStatus = result.data
            ? parsePlayerArenaStatus(result.data as Parameters<typeof parsePlayerArenaStatus>[0])
            : undefined

        setActiveMatchId(null)
        setSelectedTechnique(null)

        if (freshStatus) {
            const screen = getPostMatchScreenFromStatus(freshStatus)
            if (screen === 'arena') {
                setUiPhase('select')
                setPostMatchScreen(null)
            } else {
                setUiPhase('post_match')
                setPostMatchScreen(screen)
            }
            return
        }

        setUiPhase('select')
        setPostMatchScreen(null)
    }, [clearLastMatchEnd, matchId, refetchAll, refetchPlayer, setActiveMatchId])

    const dismissPostMatch = useCallback(() => {
        setPostMatchScreen(null)
        setUiPhase('select')
        setSelectedTechnique(null)
    }, [])

    return {
        isInMatch,
        matchId,
        match,
        opponent,
        uiPhase,
        postMatchScreen,
        selectedTechnique,
        setSelectedTechnique,
        committedTechnique,
        selfTechnique,
        opponentTechnique,
        resolutionData,
        canSkipPlay: Boolean(canSkipPlay),
        canSkipReveal: Boolean(canSkipReveal),
        isPlayMatchLoading,
        isRevealMatchLoading,
        isSkipAfkLoading,
        playMatch,
        revealMatch,
        skipAfkDuringPlay,
        skipAfkDuringReveal,
        finishResolution,
        dismissPostMatch,
        refetchMatch,
    }
}
