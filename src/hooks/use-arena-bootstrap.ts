'use client'

import {useAccount, useReadContract} from 'wagmi'
import {appChainId} from '@/config/chain'
import {isColiseumConfigured} from '@/config/coliseum'
import {useAwaitingArenaEntrySync} from '@/hooks/use-awaiting-arena-entry-sync'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import {
    coliseumAbi,
    coliseumAddress,
    isPlayerInMatch,
} from '@/lib/coliseum-contract'

export function useArenaBootstrap() {
    const {isConnected} = useAccount()
    const {
        profile,
        isPlayerInArena,
        isPlayerLoading,
        isProfileLoading,
        hasPlayerData,
        hasProfileData,
    } = useColiseumPlayer()
    const isSyncingEntry = useAwaitingArenaEntrySync(isPlayerInArena)

    const profileMatchId = profile && isPlayerInMatch(profile) ? profile.inMatch : null

    const {
        data: matchData,
        isLoading: isMatchLoading,
        isSuccess: isMatchSuccess,
    } = useReadContract({
        address: coliseumAddress,
        abi: coliseumAbi,
        functionName: 'matches',
        args: profileMatchId ? [profileMatchId] : undefined,
        chainId: appChainId,
        query: {
            enabled: isColiseumConfigured && Boolean(profileMatchId),
            refetchOnMount: 'always',
        },
    })

    const isPlayerReady =
        !isConnected || (hasPlayerData && !isPlayerLoading)

    const isProfileReady =
        !isConnected ||
        !isPlayerInArena ||
        (hasProfileData && !isProfileLoading)

    const isMatchReady =
        !profileMatchId || (isMatchSuccess && matchData !== undefined && !isMatchLoading)

    const isBootstrapping =
        isSyncingEntry ||
        (isConnected && (!isPlayerReady || !isProfileReady || !isMatchReady))

    const loadingMessage = isSyncingEntry ? 'Syncing your arena entry' : 'Loading arena'

    return {
        isBootstrapping,
        isConnected,
        isSyncingEntry,
        loadingMessage,
    }
}
