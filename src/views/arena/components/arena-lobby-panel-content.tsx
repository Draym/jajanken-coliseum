'use client'

import Image from 'next/image'
import {formatArenaCount} from '@/hooks/use-coliseum-arena'
import {techniqueCardAspectClass, techniqueIds, techniques, type TechniqueId} from '@/lib/techniques'
import ArenaChat from '@/views/arena/components/arena-chat'

export type ArenaLobbyPanelContentProps = {
    alivePlayers?: number
    techniqueSupply: Partial<Record<TechniqueId, number>>
    isLoading?: boolean
}

const supplyGlow: Record<TechniqueId, string> = {
    guu: 'shadow-[0_0_14px_rgba(255,90,70,0.55)]',
    chi: 'shadow-[0_0_14px_rgba(90,255,140,0.5)]',
    paa: 'shadow-[0_0_14px_rgba(90,150,255,0.5)]',
}

function SupplyIcon({techniqueId}: {techniqueId: TechniqueId}) {
    const technique = techniques[techniqueId]

    return (
        <span
            className={`relative inline-flex w-9 shrink-0 overflow-hidden rounded-lg border border-white/15 bg-black/30 sm:w-10 ${techniqueCardAspectClass} ${supplyGlow[techniqueId]}`}
        >
            <Image className="object-cover" src={technique.image} alt="" fill sizes="40px" />
            <span className="sr-only">{technique.name}</span>
        </span>
    )
}

export function ArenaLobbyPanelContent({
    alivePlayers,
    techniqueSupply,
    isLoading,
}: ArenaLobbyPanelContentProps) {
    return (
        <>
            <section className="border-b border-white/[0.06] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                    <p className="m-0 whitespace-nowrap text-[11px] font-black uppercase tracking-[0.04em] text-white sm:text-xs md:text-sm">
                        Lobby informations
                    </p>
                    <div className="flex items-center gap-1.5 text-white">
                        <svg className="size-4 shrink-0 text-white/55" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path d="M12 12a4 4 0 1 0-0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 1 1 14 0H5Z" />
                        </svg>
                        <span className="text-xs font-black tracking-[0.02em] sm:text-sm">
                            {isLoading ? '—' : formatArenaCount(alivePlayers)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-3 sm:mt-5 sm:gap-x-5">
                    {techniqueIds.map((techniqueId) => (
                        <div key={techniqueId} className="flex items-center gap-2">
                            <SupplyIcon techniqueId={techniqueId} />
                            <span className="text-xs font-bold text-white/75 sm:text-sm">
                                x{isLoading ? '—' : formatArenaCount(techniqueSupply[techniqueId])}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-3 text-[10px] leading-4 text-white/35 sm:mt-4 sm:text-[11px]">
                    Total count of card available in the lobby
                </p>
            </section>

            <ArenaChat />
        </>
    )
}
