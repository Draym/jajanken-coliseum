'use client'

import {motion} from 'framer-motion'
import {walletOptions, type WalletOptionId} from '@/lib/wagmi'

type WalletConnectingOverlayProps = {
    walletId: WalletOptionId
}

function getWalletMeta(walletId: WalletOptionId) {
    return walletOptions.find((wallet) => wallet.id === walletId)!
}

export default function WalletConnectingOverlay({walletId}: WalletConnectingOverlayProps) {
    const wallet = getWalletMeta(walletId)

    return (
        <div
            className="relative flex min-h-[380px] flex-col items-center justify-center overflow-hidden px-6 py-10"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="pointer-events-none absolute inset-0 opacity-30" aria-hidden="true">
                <div className="absolute left-1/2 top-1/2 h-[min(120%,480px)] w-[min(120%,480px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_70%)]"/>
            </div>

            <motion.div
                className="relative flex flex-col items-center"
                initial={{opacity: 0, y: 8}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.28, ease: [0.4, 0, 0.2, 1]}}
            >
                <div className="relative flex h-44 w-44 items-center justify-center">
                    <motion.div
                        className="relative size-[5.5rem]"
                        animate={{y: [0, -3, 0]}}
                        transition={{duration: 2.8, repeat: Infinity, ease: 'easeInOut'}}
                    >
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                className="pointer-events-none absolute inset-0 rounded-full border-2 border-white/20"
                                style={{transformOrigin: 'center center'}}
                                initial={false}
                                animate={{
                                    scale: [1, 2.35],
                                    opacity: [0.38, 0],
                                }}
                                transition={{
                                    duration: 2.35,
                                    repeat: Infinity,
                                    ease: [0.22, 1, 0.36, 1],
                                    delay: index * 0.78,
                                }}
                            />
                        ))}

                        <motion.div
                            className="relative z-10 flex size-full items-center justify-center rounded-[22px] bg-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.28),inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                            initial={{scale: 0.88, opacity: 0}}
                            animate={{scale: 1, opacity: 1}}
                            transition={{type: 'spring', stiffness: 380, damping: 28, delay: 0.06}}
                        >
                            <div
                                className={`flex size-14 items-center justify-center overflow-hidden rounded-[14px] ${wallet.id === 'metamask' ? 'bg-white' : ''}`}
                            >
                                <img
                                    className="h-full w-full max-w-none object-contain"
                                    src={wallet.icon}
                                    alt=""
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                </div>

                <motion.div
                    className="mt-2 max-w-[17rem] text-center"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    transition={{delay: 0.12, duration: 0.35, ease: [0.4, 0, 0.2, 1]}}
                >
                    <p className="m-0 text-xl font-bold leading-[26px] text-white">Waiting for {wallet.name}</p>
                    <p className="mt-2.5 text-sm leading-[22px] text-white/60">
                        Check the wallet extension or popup and approve the connection when it appears.
                    </p>
                </motion.div>

                <motion.div
                    className="mt-6 flex items-center gap-2 text-xs font-medium text-white/50"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.35}}
                >
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-statusPing rounded-full bg-white/45 opacity-75"/>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white/70"/>
                    </span>
                    Listening for wallet…
                </motion.div>
            </motion.div>
        </div>
    )
}
