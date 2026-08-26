'use client'

import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {useColiseumChain} from '@/contexts/coliseum-chain-context'
import MatchActionButton from '@/views/arena/components/match/match-action-button'

type PostMatchEliminatedProps = {
    onDismiss?: () => void
}

export function PostMatchEliminated({onDismiss}: PostMatchEliminatedProps) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="m-0 text-3xl font-black uppercase tracking-[0.12em] text-[#ff6b6b]">Eliminated</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                Your fighter has fallen in the coliseum. Pay the entrance fee to enter again.
            </p>
            <Link
                href="/game"
                onClick={onDismiss}
                className="mt-8 inline-flex rounded-xl border-2 border-[#b8f04a] bg-[#b8f04a] px-8 py-2.5 text-sm font-black uppercase tracking-[0.12em] text-[#0a1204]"
            >
                Play again
            </Link>
        </div>
    )
}

export function PostMatchCashout({onDismiss}: {onDismiss?: () => void}) {
    const router = useRouter()
    const {withdrawGains, isActionPending} = useColiseumChain()
    const isLoading = isActionPending('withdraw_gains')

    return (
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <p className="m-0 text-3xl font-black uppercase tracking-[0.12em] text-[#b8f04a]">Cash out</p>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/55">
                You cleared the coliseum with enough lives and no cards left. Withdraw your rewards.
            </p>
            <MatchActionButton
                label="Withdraw gains"
                isLoading={isLoading}
                disabled={isLoading}
                onClick={() => {
                    void withdrawGains({
                        onSettled: () => {
                            onDismiss?.()
                            router.push('/game')
                        },
                    })
                }}
            />
        </div>
    )
}
