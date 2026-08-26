'use client'

import {useCallback, useState} from 'react'
import {useRouter} from 'next/navigation'
import {useAccount} from 'wagmi'
import {useColiseumChain} from '@/contexts/coliseum-chain-context'
import {useColiseumPlayer} from '@/contexts/coliseum-player-context'
import {formatEther} from 'viem'
import {getWalletErrorMessage} from '@/lib/wallet-errors'
import {gameModes, type GameMode} from '@/lib/game-modes'
import ModeSelectionCarousel, {type ModeRuntimeState} from '@/views/game/components/mode-selection-carousel'

function formatEthAmount(value: bigint) {
    const raw = formatEther(value)
    return raw.replace(/(\.\d*?[1-9])0+$/u, '$1').replace(/\.0+$/u, '')
}

export default function GameContent() {
    const router = useRouter()
    const {isConnected} = useAccount()
    const [activeModeIndex, setActiveModeIndex] = useState(0)
    const {entranceFee, isFeeLoading, isPlayerInArena, arenaStatus, isPlayerLoading} = useColiseumPlayer()
    const {joinArena, isActionPending, error} = useColiseumChain()

    const formattedFee = entranceFee !== undefined ? formatEthAmount(entranceFee) : null
    const formattedMaxCashout = entranceFee !== undefined ? formatEthAmount(entranceFee * BigInt(12)) : null
    const isJoiningArena = isActionPending('join_arena')

    const getModeRuntime = useCallback(
        (modeId: GameMode['id']): ModeRuntimeState => {
            if (modeId !== 'arena') {
                return {
                    feeLabel: null,
                    maxCashoutLabel: null,
                    isFeeLoading: false,
                    isPlayerActive: false,
                    isPlayerLoading: false,
                    livesRemaining: null,
                    isActionLoading: false,
                }
            }

            return {
                feeLabel: isFeeLoading ? null : formattedFee,
                maxCashoutLabel: isFeeLoading ? null : formattedMaxCashout,
                isFeeLoading,
                isPlayerActive: isPlayerInArena,
                isPlayerLoading,
                livesRemaining: arenaStatus?.nen ?? null,
                isActionLoading: isJoiningArena,
            }
        },
        [
            arenaStatus?.nen,
            formattedFee,
            formattedMaxCashout,
            isFeeLoading,
            isJoiningArena,
            isPlayerInArena,
            isPlayerLoading,
        ],
    )

    const handleModeAction = useCallback(
        (mode: GameMode) => {
            if (mode.disabled || isJoiningArena) {
                return
            }

            if (mode.id === 'arena') {
                if (isPlayerInArena) {
                    router.push(mode.route)
                    return
                }

                void joinArena({
                    onSettled: () => {
                        router.push('/arena')
                    },
                })
                return
            }

            router.push(mode.route)
        },
        [isJoiningArena, isPlayerInArena, joinArena, router],
    )

    const walletErrorMessage = getWalletErrorMessage(error)

    if (!isConnected) {
        return null
    }

    return (
        <div className="relative z-[2] flex w-full flex-col items-center">
            <ModeSelectionCarousel
                modes={gameModes}
                activeIndex={activeModeIndex}
                onActiveIndexChange={setActiveModeIndex}
                getModeRuntime={getModeRuntime}
                onModeAction={handleModeAction}
            />

            {walletErrorMessage && (
                <p className="mt-5 max-w-md px-6 text-center text-sm leading-6 text-[#ffb4b4]" role="alert">
                    {walletErrorMessage}
                </p>
            )}
        </div>
    )
}
