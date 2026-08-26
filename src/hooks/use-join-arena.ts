'use client'

import {useColiseumChain} from '@/contexts/coliseum-chain-context'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import {formatEther} from 'viem'

function formatEthAmount(value: bigint) {
    const raw = formatEther(value)
    return raw.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0+$/u, '')
}

/** @deprecated Prefer useColiseumPlayer + useColiseumChain */
export function useJoinArena() {
    const player = useColiseumPlayer()
    const chain = useColiseumChain()

    const feeWei = player.entranceFee
    const formattedFee = feeWei !== undefined ? formatEthAmount(feeWei) : null
    const formattedMaxCashout = feeWei !== undefined ? formatEthAmount(feeWei * BigInt(12)) : null

    return {
        entranceFee: feeWei,
        formattedFee,
        formattedMaxCashout,
        profile: player.profile,
        arenaStatus: player.arenaStatus,
        isFeeLoading: player.isFeeLoading,
        isProfileLoading: player.isProfileLoading,
        isPlayerLoading: player.isPlayerLoading,
        isPlayerActive: player.isPlayerInArena,
        refetchProfile: player.refetchProfile,
        refetchPlayer: player.refetchPlayer,
        refetchAll: player.refetchAll,
        joinArena: chain.joinArena,
        isJoining: chain.isActionPending('join_arena'),
        isConfirmed: false,
        error: chain.error,
    }
}
