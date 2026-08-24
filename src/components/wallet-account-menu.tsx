'use client'

import {useEffect, useState} from 'react'
import {createPortal} from 'react-dom'
import {AnimatePresence, motion} from 'framer-motion'
import {useAccount, useDisconnect} from 'wagmi'
import {useWalletModal} from '@/contexts/wallet-modal-context'

export default function WalletAccountMenu() {
    const {isAccountMenuOpen, closeAccountMenu} = useWalletModal()
    const {address, connector} = useAccount()
    const {disconnectAsync, isPending: isDisconnecting} = useDisconnect()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!isAccountMenuOpen) {
            return
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeAccountMenu()
            }
        }

        document.body.style.overflow = 'hidden'
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            document.body.style.overflow = ''
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isAccountMenuOpen, closeAccountMenu])

    if (!mounted || !address) {
        return null
    }

    const handleDisconnect = async () => {
        await disconnectAsync()
        closeAccountMenu()
    }

    const menu = (
        <AnimatePresence>
            {isAccountMenuOpen && (
                <motion.div
                    className="fixed inset-0 z-[210] bg-brand-bg/60 backdrop-blur-sm"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.2}}
                    onClick={closeAccountMenu}
                    role="presentation"
                >
                    <motion.aside
                        className="fixed right-0 top-0 z-[211] flex h-dvh w-full max-w-[360px] flex-col border-l border-white/10 bg-brand-bg shadow-[-16px_0_48px_rgba(0,0,0,0.35)] max-sm:max-w-[320px]"
                        initial={{x: '100%'}}
                        animate={{x: 0}}
                        exit={{x: '100%'}}
                        transition={{duration: 0.28, ease: [0.22, 1, 0.36, 1]}}
                        onClick={(event) => event.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="wallet-account-title"
                    >
                        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 pb-4 pt-5">
                            <h2 id="wallet-account-title" className="m-0 text-xl font-black uppercase leading-[26px] text-white">
                                Player
                            </h2>
                            <button
                                type="button"
                                className="flex size-6 items-center justify-center border-none bg-transparent p-0 text-white/30 transition-colors hover:text-white/65"
                                onClick={closeAccountMenu}
                                aria-label="Close account menu"
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
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-6">
                            <section className="flex flex-col gap-2.5 rounded-[14px] border border-white/10 bg-white/[0.03] px-4 py-[18px]">
                                <p className="m-0 text-[11px] font-bold uppercase leading-4 tracking-[0.14em] text-white/50">
                                    Wallet address
                                </p>
                                <p className="m-0 break-all font-mono text-sm font-medium leading-[22px] text-white">
                                    {address}
                                </p>
                                {connector?.name && (
                                    <p className="m-0 text-[13px] leading-[18px] text-white/60">
                                        Connected with {connector.name}
                                    </p>
                                )}
                            </section>
                        </div>

                        <div className="border-t border-white/10 px-5 pb-6 pt-4">
                            <button
                                type="button"
                                className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-[18px] py-3.5 text-sm font-bold uppercase tracking-[0.06em] text-white transition-colors hover:border-brand-danger/35 hover:bg-brand-danger/10 disabled:cursor-wait disabled:opacity-70"
                                onClick={handleDisconnect}
                                disabled={isDisconnecting}
                            >
                                {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
                            </button>
                        </div>
                    </motion.aside>
                </motion.div>
            )}
        </AnimatePresence>
    )

    return createPortal(menu, document.body)
}
