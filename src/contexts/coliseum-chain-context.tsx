'use client'

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ReactNode,
} from 'react'
import type {Address} from 'viem'
import {zeroAddress} from 'viem'
import {useAccount, useReadContract, useWaitForTransactionReceipt, useWatchContractEvent, useWriteContract} from 'wagmi'
import {appChainId} from '@/config/chain'
import {isColiseumConfigured} from '@/config/coliseum'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import {handleColiseumEvents} from '@/lib/coliseum-event-handlers'
import {markAwaitingArenaSync} from '@/lib/coliseum-player-sync'
import type {ColiseumChainAction, ColiseumChainPhase, ColiseumMatchmakingPhase} from '@/lib/coliseum-chain-types'
import {parseColiseumEvents} from '@/lib/coliseum-events'
import {
    coliseumAbi,
    coliseumAddress,
    getMatchIdFromEventArgs,
    isPlayerInMatch,
    parsePlayerProfile,
} from '@/lib/coliseum-contract'
import {encodeActionLocally, generateRevealKey} from '@/lib/match/commitment'
import {clearMatchCommit, getMatchCommit, saveMatchCommit} from '@/lib/match/match-storage'
import {parseMatchEndArgs} from '@/lib/match/parse-match'
import type {ParsedMatchEnd} from '@/lib/match/parse-match'
import {techniqueIdToContract} from '@/lib/match/technique-enum'
import type {TechniqueId} from '@/lib/techniques'

type SettleCallback = () => void | Promise<void>

type SubmitActionOptions = {
    onSettled?: SettleCallback
}

type ColiseumChainContextValue = {
    activeAction: ColiseumChainAction | null
    phase: ColiseumChainPhase
    matchmakingPhase: ColiseumMatchmakingPhase
    activeMatchId: Address | null
    lastMatchEnd: ParsedMatchEnd | null
    isActionPending: (action?: ColiseumChainAction) => boolean
    isJoinMatchButtonLoading: boolean
    isSearchingForMatch: boolean
    isPlayMatchLoading: boolean
    isRevealMatchLoading: boolean
    isSkipAfkLoading: boolean
    setActiveMatchId: (matchId: Address | null) => void
    clearLastMatchEnd: () => void
    joinArena: (options?: SubmitActionOptions) => Promise<void>
    joinMatch: (options?: SubmitActionOptions) => Promise<void>
    playMatch: (technique: TechniqueId) => Promise<void>
    revealMatch: () => Promise<void>
    skipAfkDuringPlay: () => Promise<void>
    skipAfkDuringReveal: () => Promise<void>
    withdrawGains: (options?: SubmitActionOptions) => Promise<void>
    reset: () => void
    error: Error | null
}

const ColiseumChainContext = createContext<ColiseumChainContextValue | null>(null)

function isUserInMatchStartEvent(args: Record<string, unknown>, userAddress: Address) {
    return args.p1 === userAddress || args.p2 === userAddress
}

export function ColiseumChainProvider({children}: {children: ReactNode}) {
    const {address} = useAccount()
    const {entranceFee, profile, refetchAll, refetchPlayer, refetchProfile} = useColiseumPlayer()
    const [activeAction, setActiveAction] = useState<ColiseumChainAction | null>(null)
    const [phase, setPhase] = useState<ColiseumChainPhase>('idle')
    const [matchmakingPhase, setMatchmakingPhase] = useState<ColiseumMatchmakingPhase>('idle')
    const [activeMatchId, setActiveMatchId] = useState<Address | null>(null)
    const [lastMatchEnd, setLastMatchEnd] = useState<ParsedMatchEnd | null>(null)
    const settleCallbackRef = useRef<SettleCallback | null>(null)
    const handledReceiptRef = useRef<string | null>(null)

    const {
        writeContractAsync,
        data: txHash,
        isPending: isSigning,
        error: submitError,
        reset: resetWrite,
    } = useWriteContract()

    const {
        data: receipt,
        isLoading: isConfirming,
        isSuccess: isReceiptSuccess,
        error: confirmError,
    } = useWaitForTransactionReceipt({hash: txHash})

    const {data: queuedAddress} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'queued',
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(address),
        },
    })

    const resetTransactionState = useCallback(() => {
        setActiveAction(null)
        setPhase('idle')
        settleCallbackRef.current = null
        handledReceiptRef.current = null
        resetWrite()
    }, [resetWrite])

    const reset = useCallback(() => {
        resetTransactionState()
        setMatchmakingPhase('idle')
        setActiveMatchId(null)
        setLastMatchEnd(null)
    }, [resetTransactionState])

    const failAction = useCallback(() => {
        resetTransactionState()
    }, [resetTransactionState])

    const clearLastMatchEnd = useCallback(() => {
        setLastMatchEnd(null)
    }, [])

    const captureMatchEndFromEvents = useCallback((events: ReturnType<typeof parseColiseumEvents>) => {
        const matchEnded = events.find((event) => event.eventName === 'MatchEnd')
        if (matchEnded) {
            setLastMatchEnd(parseMatchEndArgs(matchEnded.args))
        }
    }, [])

    const completeMatchStart = useCallback(
        async (matchId: Address) => {
            setActiveMatchId(matchId)
            setMatchmakingPhase('idle')

            const settle = settleCallbackRef.current
            settleCallbackRef.current = null

            await refetchAll()
            await settle?.()
            resetTransactionState()
        },
        [refetchAll, resetTransactionState],
    )

    useEffect(() => {
        if (!activeAction) return
        if (isSigning) {
            setPhase('signing')
            return
        }
        if (txHash && (isConfirming || !isReceiptSuccess)) {
            setPhase('confirming')
        }
    }, [activeAction, isSigning, txHash, isConfirming, isReceiptSuccess])

    useEffect(() => {
        if (!activeAction || !isReceiptSuccess || !receipt || !txHash) return
        if (handledReceiptRef.current === receipt.transactionHash) return

        handledReceiptRef.current = receipt.transactionHash
        const settle = settleCallbackRef.current
        const action = activeAction

        const processReceipt = async () => {
            try {
                setPhase('syncing')
                if (action === 'join_arena') {
                    markAwaitingArenaSync()
                }
                const events = parseColiseumEvents(receipt.logs)
                await handleColiseumEvents(action, events, {refetchAll, refetchPlayer, refetchProfile})

                if (action === 'join_match') {
                    const matchStarted = events.find((event) => event.eventName === 'MatchStart')
                    const matchId = matchStarted ? getMatchIdFromEventArgs(matchStarted.args) : undefined

                    if (matchId) {
                        await completeMatchStart(matchId)
                        return
                    }

                    setMatchmakingPhase('searching')
                    resetTransactionState()
                    return
                }

                if (action === 'play_match' || action === 'reveal_match' || action === 'skip_afk_play' || action === 'skip_afk_reveal') {
                    captureMatchEndFromEvents(events)
                }

                if (action === 'reveal_match' || action === 'skip_afk_play' || action === 'skip_afk_reveal') {
                    await refetchAll()
                }

                setPhase('settling')
                await settle?.()
                resetTransactionState()
            } catch (error) {
                console.error('[coliseum] failed to process transaction receipt', error)
                failAction()
            }
        }

        void processReceipt()
    }, [
        activeAction,
        captureMatchEndFromEvents,
        completeMatchStart,
        failAction,
        isReceiptSuccess,
        receipt,
        refetchAll,
        refetchPlayer,
        refetchProfile,
        resetTransactionState,
        txHash,
    ])

    useWatchContractEvent({
        address: coliseumAddress,
        abi: coliseumAbi,
        eventName: 'MatchStart',
        chainId: appChainId,
        enabled: matchmakingPhase === 'searching' && Boolean(address) && isColiseumConfigured,
        onLogs(logs) {
            if (!address) return

            for (const log of logs) {
                const events = parseColiseumEvents([log])
                const matchStarted = events.find((event) => event.eventName === 'MatchStart')
                if (!matchStarted || !isUserInMatchStartEvent(matchStarted.args, address)) continue

                const matchId = getMatchIdFromEventArgs(matchStarted.args)
                if (matchId) void completeMatchStart(matchId)
                break
            }
        },
    })

    useWatchContractEvent({
        address: coliseumAddress,
        abi: coliseumAbi,
        eventName: 'MatchEnd',
        chainId: appChainId,
        enabled: Boolean(activeMatchId) && isColiseumConfigured,
        onLogs(logs) {
            if (!address || !activeMatchId) return

            for (const log of logs) {
                const events = parseColiseumEvents([log])
                const matchEnded = events.find((event) => event.eventName === 'MatchEnd')
                if (!matchEnded) continue

                const parsed = parseMatchEndArgs(matchEnded.args)
                const inMatch =
                    parsed.p1.toLowerCase() === address.toLowerCase() ||
                    parsed.p2.toLowerCase() === address.toLowerCase()
                if (inMatch) {
                    setLastMatchEnd(parsed)
                }
            }
        },
    })

    useEffect(() => {
        if (matchmakingPhase !== 'searching') return

        const interval = window.setInterval(() => {
            void (async () => {
                const result = (await refetchProfile()) as {data?: unknown}
                if (!result.data) return

                const profile = parsePlayerProfile(result.data as Parameters<typeof parsePlayerProfile>[0])
                if (isPlayerInMatch(profile)) {
                    await completeMatchStart(profile.inMatch)
                }
            })()
        }, 3000)

        return () => window.clearInterval(interval)
    }, [completeMatchStart, matchmakingPhase, refetchProfile])

    useEffect(() => {
        if (!address || queuedAddress === undefined) return
        if (activeMatchId || activeAction === 'join_match') return
        if (profile && isPlayerInMatch(profile)) return

        const queued = queuedAddress as Address
        const isUserQueued = queued !== zeroAddress && queued.toLowerCase() === address.toLowerCase()

        if (isUserQueued && matchmakingPhase !== 'searching') {
            setMatchmakingPhase('searching')
        }
    }, [activeAction, activeMatchId, address, matchmakingPhase, profile, queuedAddress])

    const submitAction = useCallback(
        async (action: ColiseumChainAction, options: SubmitActionOptions | undefined, write: () => Promise<unknown>) => {
            if (!coliseumAddress || !isColiseumConfigured) return

            settleCallbackRef.current = options?.onSettled ?? null
            handledReceiptRef.current = null
            resetWrite()
            setActiveAction(action)
            setPhase('signing')

            try {
                await write()
            } catch {
                failAction()
            }
        },
        [failAction, resetWrite],
    )

    const joinArena = useCallback(
        async (options?: SubmitActionOptions) => {
            if (entranceFee === undefined) return

            await submitAction('join_arena', options, () =>
                writeContractAsync({
                    address: coliseumAddress!,
                    abi: coliseumAbi,
                    functionName: 'joinGame',
                    chainId: appChainId,
                    value: entranceFee,
                }),
            )
        },
        [entranceFee, submitAction, writeContractAsync],
    )

    const joinMatch = useCallback(async (options?: SubmitActionOptions) => {
        await submitAction('join_match', options, () =>
            writeContractAsync({
                address: coliseumAddress!,
                abi: coliseumAbi,
                functionName: 'joinMatch',
                chainId: appChainId,
            }),
        )
    }, [submitAction, writeContractAsync])

    const playMatch = useCallback(
        async (technique: TechniqueId) => {
            if (!address || !activeMatchId) return

            const revealKey = generateRevealKey()
            saveMatchCommit({matchId: activeMatchId, technique, revealKey})
            const commitment = encodeActionLocally(address, technique, revealKey)

            await submitAction('play_match', undefined, () =>
                writeContractAsync({
                    address: coliseumAddress!,
                    abi: coliseumAbi,
                    functionName: 'playMatch',
                    args: [commitment, activeMatchId],
                    chainId: appChainId,
                }),
            )
        },
        [activeMatchId, address, submitAction, writeContractAsync],
    )

    const revealMatch = useCallback(async () => {
        if (!activeMatchId) return

        const commit = getMatchCommit(activeMatchId)
        if (!commit) return

        await submitAction('reveal_match', undefined, () =>
            writeContractAsync({
                address: coliseumAddress!,
                abi: coliseumAbi,
                functionName: 'revealMatch',
                args: [techniqueIdToContract(commit.technique), commit.revealKey, activeMatchId],
                chainId: appChainId,
            }),
        )
    }, [activeMatchId, submitAction, writeContractAsync])

    const skipAfkDuringPlay = useCallback(async () => {
        if (!activeMatchId) return

        await submitAction('skip_afk_play', undefined, () =>
            writeContractAsync({
                address: coliseumAddress!,
                abi: coliseumAbi,
                functionName: 'skipAfkDuringPlay',
                args: [activeMatchId],
                chainId: appChainId,
            }),
        )
    }, [activeMatchId, submitAction, writeContractAsync])

    const skipAfkDuringReveal = useCallback(async () => {
        if (!activeMatchId) return

        await submitAction('skip_afk_reveal', undefined, () =>
            writeContractAsync({
                address: coliseumAddress!,
                abi: coliseumAbi,
                functionName: 'skipAfkDuringReveal',
                args: [activeMatchId],
                chainId: appChainId,
            }),
        )
    }, [activeMatchId, submitAction, writeContractAsync])

    const withdrawGains = useCallback(async (options?: SubmitActionOptions) => {
        await submitAction('withdraw_gains', options, () =>
            writeContractAsync({
                address: coliseumAddress!,
                abi: coliseumAbi,
                functionName: 'withdrawGains',
                chainId: appChainId,
            }),
        )
    }, [submitAction, writeContractAsync])

    const isJoinMatchButtonLoading =
        activeAction === 'join_match' && (phase === 'signing' || phase === 'confirming' || phase === 'syncing')

    const isPlayMatchLoading =
        activeAction === 'play_match' && (phase === 'signing' || phase === 'confirming' || phase === 'syncing')

    const isRevealMatchLoading =
        activeAction === 'reveal_match' && (phase === 'signing' || phase === 'confirming' || phase === 'syncing')

    const isSkipAfkLoading =
        (activeAction === 'skip_afk_play' || activeAction === 'skip_afk_reveal') &&
        (phase === 'signing' || phase === 'confirming' || phase === 'syncing')

    const value = useMemo<ColiseumChainContextValue>(
        () => ({
            activeAction,
            phase,
            matchmakingPhase,
            activeMatchId,
            lastMatchEnd,
            isActionPending: (action) => {
                if (phase === 'idle' || !activeAction) return false
                return action ? activeAction === action : true
            },
            isJoinMatchButtonLoading,
            isSearchingForMatch: matchmakingPhase === 'searching',
            isPlayMatchLoading,
            isRevealMatchLoading,
            isSkipAfkLoading,
            setActiveMatchId,
            clearLastMatchEnd,
            joinArena,
            joinMatch,
            playMatch,
            revealMatch,
            skipAfkDuringPlay,
            skipAfkDuringReveal,
            withdrawGains,
            reset,
            error: submitError ?? confirmError ?? null,
        }),
        [
            activeAction,
            activeMatchId,
            clearLastMatchEnd,
            confirmError,
            isJoinMatchButtonLoading,
            isPlayMatchLoading,
            isRevealMatchLoading,
            isSkipAfkLoading,
            joinArena,
            joinMatch,
            lastMatchEnd,
            matchmakingPhase,
            phase,
            playMatch,
            reset,
            revealMatch,
            skipAfkDuringPlay,
            skipAfkDuringReveal,
            submitError,
            withdrawGains,
        ],
    )

    return <ColiseumChainContext.Provider value={value}>{children}</ColiseumChainContext.Provider>
}

export function useColiseumChain() {
    const context = useContext(ColiseumChainContext)
    if (!context) {
        throw new Error('useColiseumChain must be used within ColiseumChainProvider')
    }
    return context
}
