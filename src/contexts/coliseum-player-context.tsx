'use client'

import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    type ReactNode,
} from 'react'
import {useAccount, useReadContract} from 'wagmi'
import {appChainId} from '@/config/chain'
import {isColiseumConfigured} from '@/config/coliseum'
import {
    coliseumAbi,
    coliseumAddress,
    getPlayerAddressArg,
    isPlayerInArena,
    parsePlayerArenaStatus,
    parsePlayerProfile,
    type PlayerArenaStatus,
    type PlayerProfile,
} from '@/lib/coliseum-contract'

type ColiseumPlayerContextValue = {
    arenaStatus: PlayerArenaStatus | undefined
    profile: PlayerProfile | undefined
    entranceFee: bigint | undefined
    isPlayerLoading: boolean
    isProfileLoading: boolean
    isFeeLoading: boolean
    isPlayerInArena: boolean
    refetchPlayer: () => Promise<{data?: unknown}>
    refetchProfile: () => Promise<unknown>
    refetchAll: () => Promise<void>
}

const ColiseumPlayerContext = createContext<ColiseumPlayerContextValue | null>(null)

export function ColiseumPlayerProvider({children}: {children: ReactNode}) {
    const {address, isConnected} = useAccount()
    const canReadPlayer = isColiseumConfigured && isConnected && Boolean(address)

    const {data: entranceFee, isLoading: isFeeLoading} = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'entranceTicketFee',
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured,
        },
    })

    const {
        data: playerResult,
        refetch: refetchPlayer,
        isLoading: isPlayerLoading,
    } = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'getPlayer',
        args: getPlayerAddressArg(address),
        chainId: appChainId,
        query: {
            enabled: canReadPlayer,
        },
    })

    const arenaStatus = useMemo<PlayerArenaStatus | undefined>(() => {
        if (!playerResult) {
            return undefined
        }
        return parsePlayerArenaStatus(playerResult as Parameters<typeof parsePlayerArenaStatus>[0])
    }, [playerResult])

    const playerIsInArena = isPlayerInArena(arenaStatus)

    const {
        data: profileResult,
        refetch: refetchProfile,
        isLoading: isProfileLoading,
    } = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'getProfile',
        account: address,
        chainId: appChainId,
        query: {
            enabled: canReadPlayer && playerIsInArena,
        },
    })

    const profile = useMemo<PlayerProfile | undefined>(() => {
        if (!profileResult) {
            return undefined
        }
        return parsePlayerProfile(profileResult as Parameters<typeof parsePlayerProfile>[0])
    }, [profileResult])

    const refetchAll = useCallback(async () => {
        const playerUpdate = (await refetchPlayer()) as {data?: unknown}
        if (playerUpdate.data) {
            const status = parsePlayerArenaStatus(
                playerUpdate.data as Parameters<typeof parsePlayerArenaStatus>[0],
            )
            if (isPlayerInArena(status)) {
                await refetchProfile()
                return
            }
        }
    }, [refetchPlayer, refetchProfile])

    const value = useMemo<ColiseumPlayerContextValue>(
        () => ({
            arenaStatus,
            profile,
            entranceFee: entranceFee as bigint | undefined,
            isPlayerLoading,
            isProfileLoading,
            isFeeLoading,
            isPlayerInArena: playerIsInArena,
            refetchPlayer: refetchPlayer as () => Promise<{data?: unknown}>,
            refetchProfile,
            refetchAll,
        }),
        [
            arenaStatus,
            entranceFee,
            isFeeLoading,
            isPlayerLoading,
            isProfileLoading,
            playerIsInArena,
            profile,
            refetchAll,
            refetchPlayer,
            refetchProfile,
        ],
    )

    return <ColiseumPlayerContext.Provider value={value}>{children}</ColiseumPlayerContext.Provider>
}

export function useColiseumPlayer() {
    const context = useContext(ColiseumPlayerContext)
    if (!context) {
        throw new Error('useColiseumPlayer must be used within ColiseumPlayerProvider')
    }
    return context
}
