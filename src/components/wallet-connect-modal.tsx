'use client'

import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {AnimatePresence, motion} from 'framer-motion'
import {useConnect, useConnectors, type Connector} from 'wagmi'
import {walletOptions, type WalletOptionId} from '@/lib/wagmi'
import {useWalletModal} from '@/contexts/wallet-modal-context'
import WalletConnectingOverlay from '@/components/wallet-connecting-overlay'

type ConnectorLike = {
    id: string
    name: string
}

function findConnector(connectors: readonly ConnectorLike[], walletId: WalletOptionId) {
    const normalized = (value: string) => value.toLowerCase()

    switch (walletId) {
        case 'metamask':
            return connectors.find((connector) =>
                connector.id === 'metaMask' ||
                normalized(connector.name).includes('metamask'),
            )
        case 'phantom':
            return connectors.find((connector) =>
                connector.id === 'phantom' ||
                normalized(connector.name).includes('phantom'),
            )
        case 'coinbase':
            return connectors.find((connector) =>
                connector.id.includes('coinbase') ||
                normalized(connector.name).includes('coinbase'),
            )
    }
}

export default function WalletConnectModal() {
    const {isModalOpen, isModalDismissible, closeModal} = useWalletModal()
    const {connectAsync, isPending, error} = useConnect()
    const connectors = useConnectors() as readonly ConnectorLike[]
    const [mounted, setMounted] = useState(false)
    const [pendingWalletId, setPendingWalletId] = useState<WalletOptionId | null>(null)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isPending) {
            setPendingWalletId(null)
        }
    }, [isPending])

    if (!mounted) {
        return null
    }

    const isConnecting = pendingWalletId !== null

    const handleConnect = async (walletId: WalletOptionId) => {
        const targetConnector = findConnector(connectors, walletId)
        if (!targetConnector) {
            return
        }

        setPendingWalletId(walletId)
        try {
            await connectAsync({connector: targetConnector as Connector})
            closeModal({force: true})
        } catch {
            /* error surfaced via useConnect().error */
        }
    }

    const modal = (
        <AnimatePresence>
            {isModalOpen && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-[rgba(6,7,17,0.78)] p-6 backdrop-blur-[10px] max-sm:items-end max-sm:p-4"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.2}}
                    onClick={isModalDismissible ? () => closeModal() : undefined}
                    role="presentation"
                >
                    <motion.div
                        className={`relative w-full max-w-[440px] overflow-hidden rounded-[20px] border border-white/10 bg-brand-surface/95 shadow-[0_24px_80px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)] max-sm:rounded-b-2xl ${isConnecting ? 'p-0' : 'px-7 pb-6 pt-8 max-sm:px-5 max-sm:pb-5 max-sm:pt-7'}`}
                        initial={{opacity: 0, y: 24, scale: 0.96}}
                        animate={{opacity: 1, y: 0, scale: 1}}
                        exit={{opacity: 0, y: 16, scale: 0.98}}
                        transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Choose a wallet"
                    >
                        {isConnecting && pendingWalletId ? (
                            <WalletConnectingOverlay walletId={pendingWalletId}/>
                        ) : (
                            <>
                                {isModalDismissible && (
                                    <button
                                        type="button"
                                        className="absolute right-[18px] top-[18px] flex size-6 items-center justify-center border-none bg-transparent p-0 text-white/30 transition-colors hover:text-white/65 disabled:cursor-not-allowed disabled:opacity-25"
                                        onClick={() => closeModal()}
                                        aria-label="Close wallet modal"
                                    >
                                        <svg
                                            className="size-[18px]"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M6 6L18 18M18 6L6 18"
                                                stroke="currentColor"
                                                strokeWidth="1.75"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </button>
                                )}

                                <div className="mb-6 flex justify-center pb-4">
                                    <img className="h-[90px] w-24 max-w-none" src="/vector.svg" alt="JaJanken Coliseum"/>
                                </div>

                                <div className="mb-6 text-center">
                                    <p className="m-0 text-sm leading-[22px] text-white/70">
                                        Choose your wallet to join the arena and start battling.
                                    </p>
                                </div>

                                <ul className="m-0 flex list-none flex-col gap-3 p-0">
                                    {walletOptions.map((wallet) => (
                                        <li key={wallet.id}>
                                            <button
                                                type="button"
                                                className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-3.5 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-3.5 text-left transition-all hover:-translate-y-px hover:border-white/15 hover:bg-brand-panel hover:shadow-[0_8px_20px_rgba(0,0,0,0.28)]"
                                                onClick={() => handleConnect(wallet.id)}
                                            >
                                                <span className={`size-11 shrink-0 overflow-hidden rounded-xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] ${wallet.id === 'metamask' ? 'bg-white shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]' : ''}`}>
                                                    <img
                                                        className="size-full max-w-none object-contain"
                                                        src={wallet.icon}
                                                        alt=""
                                                    />
                                                </span>
                                                <span className="flex min-w-0 flex-col gap-0.5">
                                                    <span className="text-base font-bold leading-[22px] text-white">{wallet.name}</span>
                                                    <span className="text-xs leading-[18px] text-white/60">{wallet.description}</span>
                                                </span>
                                                <span className="flex size-6 shrink-0 items-center justify-center text-white/55 transition-colors group-hover:text-white/85" aria-hidden="true">
                                                    <svg
                                                        className="size-5"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M9 6L15 12L9 18"
                                                            stroke="currentColor"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>

                                {error && (
                                    <p className="mt-3.5 rounded-[10px] border border-brand-danger/30 bg-brand-danger/10 px-3 py-2.5 text-[13px] leading-[18px] text-[#ffb4b4]" role="alert">
                                        {error.message.split('\n')[0]}
                                    </p>
                                )}

                                <p className="mt-[18px] text-center text-xs leading-[18px] text-white/40">
                                    New to Web3 wallets? Install one of the options above to get started.
                                </p>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return createPortal(modal, document.body)
}
