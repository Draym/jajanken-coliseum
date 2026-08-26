'use client'

import Image from 'next/image'
import {useAccount} from 'wagmi'

type ArenaGameHeaderProps = {
    lives: number
}

function truncateAddress(address: string) {
    return `${address.slice(0, 6)}…${address.slice(-4)}`
}

function truncateAddressCompact(address: string) {
    return `${address.slice(0, 5)}..`
}

export default function ArenaGameHeader({lives}: ArenaGameHeaderProps) {
    const {address} = useAccount()
    const displayName = address ? truncateAddress(address) : 'Fighter'
    const compactDisplayName = address ? truncateAddressCompact(address) : 'Fighter'

    return (
        <header className="relative flex w-full items-center justify-center lg:justify-center">
            <div className="flex w-full max-w-[min(520px,calc(100%-1rem))] items-center gap-2 rounded-lg border border-white/10 bg-[#120f1c]/70 px-2.5 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:max-w-[520px] sm:gap-3 sm:px-3 sm:py-2.5 lg:w-[520px]">
                <div
                    className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#1a1528] text-[8px] font-bold uppercase tracking-[0.1em] text-white/30 sm:size-11"
                    aria-hidden="true"
                >
                    Avatar
                </div>
                <p className="m-0 min-w-0 truncate text-sm font-black uppercase tracking-[0.04em] text-white sm:text-base">
                    <span className="lg:hidden">{compactDisplayName}</span>
                    <span className="hidden lg:inline">{displayName}</span>
                </p>
                <span className="shrink-0 text-[10px] font-bold text-white/40 sm:text-xs">0W - 0L</span>
                <div className="ml-auto flex shrink-0 items-center gap-2 lg:gap-2.5">
                    <span className="relative size-8 shrink-0 lg:size-8">
                        <Image className="object-contain" src="/image-16@2x.png" alt="" fill sizes="(max-width: 1023px) 32px, 32px" />
                    </span>
                    <span className="text-2xl font-black leading-none text-white lg:text-2xl">{lives}</span>
                </div>
            </div>

            <div className="absolute inset-y-0 right-0 hidden items-center lg:flex">
                <button
                    type="button"
                    className="rounded-lg border border-[#b8f04a] bg-[#b8f04a] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-[#0a1204] shadow-[0_0_16px_rgba(184,240,74,0.2)] sm:px-4 sm:py-2.5 sm:text-xs"
                    disabled
                >
                    History
                </button>
            </div>
        </header>
    )
}
