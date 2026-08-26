'use client'

import {appChainName, isAppTestnet} from '@/config/chain'
import {useEnsureAppChain} from '@/hooks/use-ensure-app-chain'
import {useAccount} from 'wagmi'

function PhantomTestnetSteps() {
    return (
        <ol className="mt-4 list-decimal space-y-2.5 pl-5 text-left text-sm leading-6 text-white/70">
            <li>Open the Phantom extension.</li>
            <li>
                Go to <span className="font-semibold text-white">Settings</span> →{' '}
                <span className="font-semibold text-white">Developer settings</span>.
            </li>
            <li>
                Turn on <span className="font-semibold text-white">Testnet mode</span>.
            </li>
            <li>Return here and press “Switch network” again.</li>
        </ol>
    )
}

export default function AppChainGuard({children}: {children: React.ReactNode}) {
    const {isConnected} = useAccount()
    const {isWrongChain, isSwitching, switchFailed, isPhantom, switchToAppChain} = useEnsureAppChain()

    if (!isConnected || !isWrongChain) {
        return children
    }

    const showPhantomHelp = isPhantom && switchFailed && isAppTestnet

    return (
        <>
            {children}
            <div className="fixed inset-0 z-[180] flex items-center justify-center bg-[rgba(6,7,17,0.82)] p-6 backdrop-blur-[8px]">
                <div className="w-full max-w-md rounded-[20px] border border-white/10 bg-brand-surface px-6 py-7 text-center shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
                    <p className="m-0 text-[11px] font-bold uppercase tracking-[0.2em] text-brand-gold/80">
                        Wrong network
                    </p>
                    <h2 className="mt-3 text-2xl font-black uppercase text-white">Switch network</h2>

                    {showPhantomHelp ? (
                        <div className="mt-3 pl-4 text-left">
                            <p className="text-sm leading-6 text-white/65">
                                Phantom must be in testnet mode before it can switch to {appChainName}. Set it up
                                first — we will not ask again until you retry.
                            </p>
                            <PhantomTestnetSteps />
                        </div>
                    ) : (
                        <p className="mt-3 text-sm leading-6 text-white/65">
                            JaJanken Coliseum runs on {appChainName}. Approve the network switch in your wallet to
                            continue.
                        </p>
                    )}

                    <button
                        type="button"
                        className="mt-6 w-full rounded-xl bg-brand-gold px-4 py-3.5 text-sm font-black uppercase tracking-[0.08em] text-brand-bg transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                        onClick={() => void switchToAppChain()}
                        disabled={isSwitching}
                    >
                        {isSwitching ? 'Switching...' : `Switch to ${appChainName}`}
                    </button>

                    {switchFailed && !showPhantomHelp && (
                        <p className="mt-3 text-xs leading-5 text-white/45">
                            Network switch was declined or failed. Update your wallet settings, then try again.
                        </p>
                    )}
                </div>
            </div>
        </>
    )
}
