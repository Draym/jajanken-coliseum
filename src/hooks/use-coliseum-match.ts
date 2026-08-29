'use client'

import {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import type {Address} from 'viem'
import {zeroAddress} from 'viem'
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
import {clearMatchCommit, getMatchCommit, clearRevealSubmitted, pruneStaleMatchCommits} from '@/lib/match/match-storage'
import {
    bothPlayersCommitted,
    getMatchFingerprint,
    getOpponentAddress,
    getOpponentAddressFromMatchEnd,
    getOpponentTechniqueFromEnd,
    getSelfTechniqueFromEnd,
    hasPlayableResolution,
    hasPlayerCommitted,
    hasPlayerRevealed,
    isMatchSlotActive,
    parseOnChainMatch,
    type OnChainMatch,
} from '@/lib/match/parse-match'
import type {ParsedMatchEnd} from '@/lib/match/parse-match'
import {getPostMatchScreenFromStatus, totalTechniques, type PostMatchScreen} from '@/lib/match/player-status'
import type {TechniqueId} from '@/lib/techniques'

export type OpponentSnapshot = {
    address: Address
    nen: number
    totalTechniques: number
}

type MatchSessionSnapshot = {
    matchId: Address
    opponent: OpponentSnapshot
    selfNen: number
    selfTechniques: number
}

function isValidOpponentSnapshot(opponent: OpponentSnapshot | undefined): opponent is OpponentSnapshot {
    return Boolean(opponent?.address && opponent.address !== zeroAddress)
}

function deriveChainMatchPhase(params: {
    matchId: Address | null
    self: Address | undefined
    match: OnChainMatch | undefined
    hasLocalCommit: boolean
    isPlayMatchLoading: boolean
    isRevealMatchLoading: boolean
}): MatchUiPhase {
    const {matchId, self, match, hasLocalCommit, isPlayMatchLoading, isRevealMatchLoading} = params

    if (!matchId || !self) return 'select'
    if (!isMatchSlotActive(match)) return 'select'
    if (isPlayMatchLoading) return 'commit_pending'
    if (isRevealMatchLoading) return 'reveal_pending'

    const hasCommittedOnChain = hasPlayerCommitted(match!, self, matchId)
    const hasCommitted = hasCommittedOnChain || hasLocalCommit

    if (!hasCommitted) return 'select'
    if (!bothPlayersCommitted(match!)) return 'waiting_commit'

    const hasRevealedOnChain = hasPlayerRevealed(match!, self, matchId)
    if (hasRevealedOnChain) return 'waiting_reveal'

    // On-chain commit exists but reveal secret is gone (storage wipe / other device).
    if (!hasLocalCommit) return 'reveal_blocked'

    return 'reveal_ready'
}

function isMatchEndForSession(end: ParsedMatchEnd, sessionMatchId: Address, self: Address) {
    const involved =
        end.p1.toLowerCase() === self.toLowerCase() || end.p2.toLowerCase() === self.toLowerCase()
    if (!involved) return false

    return (
        end.p1.toLowerCase() === sessionMatchId.toLowerCase() ||
        end.p2.toLowerCase() === sessionMatchId.toLowerCase()
    )
}

export type ColiseumMatchState = ReturnType<typeof useColiseumMatch>

export function useColiseumMatch() {
    const {address} = useAccount()
    const {profile, hasProfileData, refetchAll, refetchPlayer, refetchProfile} = useColiseumPlayer()
    const {
        activeMatchId,
        setActiveMatchId,
        lastMatchEnd,
        clearLastMatchEnd,
        isPlayMatchLoading,
        isRevealMatchLoading,
        isForfeitMatchLoading,
        playMatch,
        revealMatch,
        skipAfkDuringPlay,
        skipAfkDuringReveal,
        forfeitMatch,
        isSkipAfkLoading,
    } = useColiseumChain()

    const [uiPhase, setUiPhase] = useState<MatchUiPhase>('select')
    const [postMatchScreen, setPostMatchScreen] = useState<PostMatchScreen | null>(null)
    const [selectedTechnique, setSelectedTechnique] = useState<TechniqueId | null>(null)
    const [resolutionData, setResolutionData] = useState<ParsedMatchEnd | null>(null)
    const [matchSession, setMatchSession] = useState<MatchSessionSnapshot | null>(null)
    const prevChainMatchIdRef = useRef<Address | null>(null)
    const prevMatchFingerprintRef = useRef<string>('')

    const chainMatchId = activeMatchId ?? (profile && isPlayerInMatch(profile) ? profile.inMatch : null)

    const clearMatchSession = useCallback(() => {
        setMatchSession(null)
    }, [])

    useEffect(() => {
        if (!hasProfileData || !address) {
            return
        }

        if (!profile || !isPlayerInMatch(profile)) {
            setActiveMatchId(null)
            if (uiPhase !== 'resolution' && uiPhase !== 'post_match') {
                clearLastMatchEnd()
                setResolutionData(null)
                setPostMatchScreen(null)
                setSelectedTechnique(null)
                clearMatchSession()
                setUiPhase('select')
            }
            // Do not wipe reveal secrets on a transient !inMatch flicker.
            return
        }

        const onChainMatchId = profile.inMatch
        if (activeMatchId?.toLowerCase() !== onChainMatchId.toLowerCase()) {
            setActiveMatchId(onChainMatchId)
        }
        pruneStaleMatchCommits(onChainMatchId)
    }, [
        activeMatchId,
        address,
        clearLastMatchEnd,
        clearMatchSession,
        hasProfileData,
        profile,
        setActiveMatchId,
        uiPhase,
    ])

    useEffect(() => {
        const prevChainMatchId = prevChainMatchIdRef.current

        if (chainMatchId === prevChainMatchId) {
            return
        }

        const switchedMatch =
            Boolean(chainMatchId && prevChainMatchId && prevChainMatchId !== chainMatchId)
        const enteringWithStaleSession =
            Boolean(chainMatchId && !prevChainMatchId && (resolutionData || lastMatchEnd || uiPhase === 'resolution' || uiPhase === 'post_match'))

        if (switchedMatch || enteringWithStaleSession) {
            setResolutionData(null)
            setPostMatchScreen(null)
            setSelectedTechnique(null)
            setMatchSession(null)
            clearLastMatchEnd()
            setUiPhase('select')
            prevMatchFingerprintRef.current = ''
        }

        if (!chainMatchId && prevChainMatchId) {
            prevMatchFingerprintRef.current = ''
        }

        prevChainMatchIdRef.current = chainMatchId
    }, [chainMatchId, clearLastMatchEnd, lastMatchEnd, resolutionData, uiPhase])

    const displayMatchId =
        (uiPhase === 'resolution' || uiPhase === 'post_match') && matchSession?.matchId
            ? matchSession.matchId
            : chainMatchId

    const {data: matchRaw, refetch: refetchMatch, isLoading: isMatchLoading, isFetching: isMatchFetching, isError: isMatchError} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'matches',
        args: chainMatchId ? [chainMatchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(chainMatchId) && uiPhase !== 'resolution' && uiPhase !== 'post_match',
            refetchOnMount: 'always',
            refetchInterval:
                uiPhase === 'waiting_commit' ||
                uiPhase === 'waiting_reveal' ||
                uiPhase === 'reveal_ready' ||
                uiPhase === 'reveal_blocked' ||
                uiPhase === 'select'
                    ? 3000
                    : false,
        },
    })

    const match = useMemo(() => {
        if (!matchRaw) return undefined
        return parseOnChainMatch(matchRaw as readonly unknown[])
    }, [matchRaw])

    // Match ids are p1 addresses and get reused — reset local UI when the slot content changes.
    useEffect(() => {
        if (!chainMatchId || !match) return
        if (uiPhase === 'resolution' || uiPhase === 'post_match') return

        const fingerprint = getMatchFingerprint(match)
        const prevFingerprint = prevMatchFingerprintRef.current

        if (!prevFingerprint) {
            prevMatchFingerprintRef.current = fingerprint
            return
        }

        if (fingerprint === prevFingerprint) return

        const prevP2 = prevFingerprint.split(':')[0] ?? ''
        const p2Changed = match.p2.toLowerCase() !== prevP2
        const slotLooksFresh =
            isMatchSlotActive(match) &&
            !bothPlayersCommitted(match) &&
            !hasPlayerCommitted(match, chainMatchId, chainMatchId)

        prevMatchFingerprintRef.current = fingerprint

        if (p2Changed || slotLooksFresh) {
            clearMatchCommit(chainMatchId)
            clearRevealSubmitted(chainMatchId)
            setSelectedTechnique(null)
            setUiPhase('select')
        }
    }, [chainMatchId, match, uiPhase])

    const opponentAddress = useMemo(() => {
        if (!chainMatchId || !match || !address) return undefined
        return getOpponentAddress(chainMatchId, match.p2, address)
    }, [address, chainMatchId, match])

    const {data: opponentRaw} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'getPlayer',
        args: getPlayerAddressArg(opponentAddress),
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(opponentAddress) && uiPhase !== 'resolution' && uiPhase !== 'post_match',
            refetchOnMount: 'always',
        },
    })

    const chainOpponent = useMemo<OpponentSnapshot | undefined>(() => {
        if (!opponentAddress || !opponentRaw) return undefined
        const parsed = parsePlayerArenaStatus(opponentRaw as Parameters<typeof parsePlayerArenaStatus>[0])
        return {
            address: opponentAddress,
            nen: parsed.nen,
            totalTechniques: parsed.techniques,
        }
    }, [opponentAddress, opponentRaw])

    const opponent =
        (uiPhase === 'resolution' || uiPhase === 'post_match') && matchSession?.opponent
            ? matchSession.opponent
            : chainOpponent

    useEffect(() => {
        if (uiPhase === 'resolution' || uiPhase === 'post_match') return
        if (!chainMatchId || !profile || !isValidOpponentSnapshot(chainOpponent)) return

        setMatchSession({
            matchId: chainMatchId,
            opponent: chainOpponent,
            selfNen: profile.nen,
            selfTechniques: totalTechniques(profile),
        })
    }, [chainMatchId, chainOpponent, profile, uiPhase])

    const {data: canSkipPlay} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'waitingForOpponentToPlay',
        args: chainMatchId ? [chainMatchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(chainMatchId) && uiPhase === 'waiting_commit',
            refetchInterval: 5000,
        },
    })

    const {data: canSkipReveal} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'waitingForOpponentToReveal',
        args: chainMatchId ? [chainMatchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(chainMatchId) && uiPhase === 'waiting_reveal',
            refetchInterval: 5000,
        },
    })

    const committedTechnique = chainMatchId ? getMatchCommit(chainMatchId)?.technique ?? null : null
    const hasLocalCommit = Boolean(chainMatchId && getMatchCommit(chainMatchId))

    const chainPhase = useMemo(() => {
        return deriveChainMatchPhase({
            matchId: chainMatchId,
            self: address,
            match,
            hasLocalCommit,
            isPlayMatchLoading,
            isRevealMatchLoading,
        })
    }, [address, chainMatchId, hasLocalCommit, isPlayMatchLoading, isRevealMatchLoading, match])

    const isChainMatchReady = !chainMatchId || matchRaw !== undefined || isMatchError

    const wasPlayLoadingRef = useRef(false)
    const wasRevealLoadingRef = useRef(false)

    // Keep profile.inMatch in sync so ended matches drop back to lobby even if MatchEnd was missed.
    useEffect(() => {
        if (!chainMatchId) return
        if (uiPhase === 'resolution' || uiPhase === 'post_match') return

        const interval = window.setInterval(() => {
            void refetchProfile()
            void refetchMatch()
        }, 4000)

        return () => window.clearInterval(interval)
    }, [chainMatchId, refetchMatch, refetchProfile, uiPhase])

    useEffect(() => {
        if (!chainMatchId || !address || !isChainMatchReady || !match) {
            return
        }

        if (hasPlayerRevealed(match, address, chainMatchId)) {
            clearRevealSubmitted(chainMatchId)
        }

        if (
            !isRevealMatchLoading &&
            !isPlayMatchLoading &&
            getMatchCommit(chainMatchId) &&
            !hasPlayerCommitted(match, address, chainMatchId)
        ) {
            clearMatchCommit(chainMatchId)
        }
    }, [address, chainMatchId, isChainMatchReady, isPlayMatchLoading, isRevealMatchLoading, match])

    useEffect(() => {
        if (!isChainMatchReady) return
        if (uiPhase === 'resolution' || uiPhase === 'post_match') return
        setUiPhase(chainPhase)
    }, [chainPhase, isChainMatchReady, uiPhase])

    useEffect(() => {
        if (wasPlayLoadingRef.current && !isPlayMatchLoading) {
            void refetchMatch()
        }
        wasPlayLoadingRef.current = isPlayMatchLoading
    }, [isPlayMatchLoading, refetchMatch])

    useEffect(() => {
        if (wasRevealLoadingRef.current && !isRevealMatchLoading) {
            void refetchMatch()
        }
        wasRevealLoadingRef.current = isRevealMatchLoading
    }, [isRevealMatchLoading, refetchMatch])

    useEffect(() => {
        if (!lastMatchEnd || !address) return
        if (resolutionData === lastMatchEnd) return

        const sessionMatchId = chainMatchId ?? activeMatchId
        if (!sessionMatchId) return

        if (!isMatchEndForSession(lastMatchEnd, sessionMatchId, address)) {
            clearLastMatchEnd()
            return
        }

        // Forfeit / incomplete ends have no playable techniques — skip clash, return to lobby.
        if (!hasPlayableResolution(lastMatchEnd)) {
            void (async () => {
                clearLastMatchEnd()
                clearMatchCommit(sessionMatchId)
                await refetchAll()
                const result = (await refetchPlayer()) as {data?: unknown}
                const freshStatus = result.data
                    ? parsePlayerArenaStatus(result.data as Parameters<typeof parsePlayerArenaStatus>[0])
                    : undefined

                setResolutionData(null)
                setActiveMatchId(null)
                setSelectedTechnique(null)
                clearMatchSession()
                prevMatchFingerprintRef.current = ''

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
            })()
            return
        }

        const opponentAddr = getOpponentAddressFromMatchEnd(lastMatchEnd, address)

        setResolutionData(lastMatchEnd)
        setUiPhase('resolution')

        if (opponentAddr === zeroAddress) return

        setMatchSession((prev) => {
            const nextOpponent =
                prev?.opponent.address.toLowerCase() === opponentAddr.toLowerCase()
                    ? prev.opponent
                    : isValidOpponentSnapshot(chainOpponent) &&
                        chainOpponent.address.toLowerCase() === opponentAddr.toLowerCase()
                      ? chainOpponent
                      : {
                            address: opponentAddr,
                            nen: prev?.opponent.nen ?? 0,
                            totalTechniques: prev?.opponent.totalTechniques ?? 0,
                        }

            return {
                matchId: sessionMatchId,
                opponent: nextOpponent,
                selfNen: prev?.selfNen ?? profile?.nen ?? 0,
                selfTechniques: prev?.selfTechniques ?? (profile ? totalTechniques(profile) : 0),
            }
        })
    }, [
        activeMatchId,
        address,
        chainMatchId,
        chainOpponent,
        clearLastMatchEnd,
        clearMatchSession,
        lastMatchEnd,
        profile,
        refetchAll,
        refetchPlayer,
        resolutionData,
        setActiveMatchId,
    ])

    const isInMatch = Boolean(
        displayMatchId &&
            (uiPhase === 'resolution' ||
                uiPhase === 'post_match' ||
                (profile &&
                    isPlayerInMatch(profile) &&
                    // Empty/cleared match slots should not keep the match UI open.
                    (uiPhase === 'reveal_blocked' || isMatchSlotActive(match) || isMatchLoading || isMatchFetching))),
    )

    const selfTechnique = useMemo(() => {
        if (committedTechnique) return committedTechnique
        if (uiPhase === 'resolution' && resolutionData && address && displayMatchId) {
            return getSelfTechniqueFromEnd(resolutionData, address, displayMatchId)
        }
        return selectedTechnique
    }, [address, committedTechnique, displayMatchId, resolutionData, selectedTechnique, uiPhase])

    const opponentTechnique = useMemo(() => {
        if (uiPhase === 'resolution' && resolutionData && address && displayMatchId) {
            return getOpponentTechniqueFromEnd(resolutionData, address, displayMatchId)
        }
        return null
    }, [address, displayMatchId, resolutionData, uiPhase])

    const finishResolution = useCallback(async () => {
        const resolvedMatchId = displayMatchId
        clearLastMatchEnd()
        if (resolvedMatchId) clearMatchCommit(resolvedMatchId)

        await refetchAll()
        const result = (await refetchPlayer()) as {data?: unknown}
        const freshStatus = result.data
            ? parsePlayerArenaStatus(result.data as Parameters<typeof parsePlayerArenaStatus>[0])
            : undefined

        setResolutionData(null)
        setActiveMatchId(null)
        setSelectedTechnique(null)
        clearMatchSession()

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
    }, [clearLastMatchEnd, clearMatchSession, displayMatchId, refetchAll, refetchPlayer, setActiveMatchId])

    const dismissPostMatch = useCallback(() => {
        setPostMatchScreen(null)
        setUiPhase('select')
        setSelectedTechnique(null)
        clearMatchSession()
    }, [clearMatchSession])

    const commitPlay = useCallback(
        async (technique: TechniqueId) => {
            if (!chainMatchId || !address) {
                return
            }
            if (isPlayMatchLoading || isRevealMatchLoading) {
                return
            }
            if (getMatchCommit(chainMatchId)) {
                return
            }
            if (match && hasPlayerCommitted(match, address, chainMatchId)) {
                return
            }

            await playMatch(technique)
        },
        [address, chainMatchId, isPlayMatchLoading, isRevealMatchLoading, match, playMatch],
    )

    const submitReveal = useCallback(async () => {
        if (!chainMatchId || !address || isRevealMatchLoading || isPlayMatchLoading) {
            return
        }
        if (!getMatchCommit(chainMatchId)) {
            return
        }
        if (match && hasPlayerRevealed(match, address, chainMatchId)) {
            return
        }

        await revealMatch()
    }, [address, chainMatchId, isPlayMatchLoading, isRevealMatchLoading, match, revealMatch])

    return {
        isInMatch,
        matchId: displayMatchId,
        match,
        isMatchLoading: isMatchLoading || isMatchFetching,
        opponent,
        sessionSelf: matchSession
            ? {nen: matchSession.selfNen, totalTechniques: matchSession.selfTechniques}
            : null,
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
        isForfeitMatchLoading,
        playMatch: commitPlay,
        revealMatch: submitReveal,
        skipAfkDuringPlay,
        skipAfkDuringReveal,
        forfeitMatch,
        finishResolution,
        dismissPostMatch,
        refetchMatch,
    }
}
