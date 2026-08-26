'use client'

import Image from 'next/image'
import type {Address} from 'viem'

type MatchProfileBarProps = {
    address: Address | string
    lives: number
    totalTechniques?: number
}

function truncateAddress(address: string) {
    return `${address.slice(0, 5)}..`
}

export default function MatchProfileBar({address, lives, totalTechniques}: MatchProfileBarProps) {
    const displayName = truncateAddress(address)

    return (
        <div className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-[#120f1c]/70 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:gap-3 sm:px-4 sm:py-2.5 lg:py-3">
            <div
                className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-[#1a1528] text-[8px] font-bold uppercase tracking-[0.08em] text-white/30 sm:size-11 sm:text-[9px] lg:size-12"
                aria-hidden="true"
            >
                Avatar
            </div>
            <p className="m-0 min-w-0 flex-1 truncate text-sm font-black uppercase tracking-[0.04em] text-white sm:text-base">
                {displayName}
            </p>
            <span className="hidden shrink-0 text-[10px] font-bold text-white/40 min-[400px]:inline sm:text-xs">
                0W - 0L
            </span>
            {totalTechniques !== undefined && (
                <span className="hidden shrink-0 text-[10px] font-bold text-white/45 min-[400px]:inline sm:text-xs">
                    Cards {totalTechniques}
                </span>
            )}
            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                <span className="relative size-6 shrink-0 sm:size-8">
                    <Image className="object-contain" src="/image-16@2x.png" alt="" fill sizes="32px" />
                </span>
                <span className="text-xl font-black leading-none text-white sm:text-2xl lg:text-3xl">{lives}</span>
            </div>
        </div>
    )
}
