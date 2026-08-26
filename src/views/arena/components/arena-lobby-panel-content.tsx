'use client'

import Image from 'next/image'
import {formatArenaCount} from '@/hooks/use-coliseum-arena'
import {techniqueCardAspectClass, techniqueIds, techniques, type TechniqueId} from '@/lib/techniques'

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

const chatPlaceholders = [
    {name: 'PlayerOne', color: 'text-[#b8f04a]', message: 'Lorem ipsum dolor sit amet consectetur.'},
    {name: 'RivalX', color: 'text-[#5ce1ff]', message: 'Waiting for the next match to start.'},
    {name: 'VenomSlicer', color: 'text-[#f7d436]', message: 'Good luck in the coliseum.', featured: true},
    {name: 'GhostHand', color: 'text-[#ff6b6b]', message: 'Anyone up for a duel after this?'},
]

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

            <section className="flex min-h-0 flex-1 flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5">
                    {chatPlaceholders.map((entry) => (
                        <div
                            key={entry.name}
                            className={
                                entry.featured
                                    ? 'rounded-xl border border-[#f7d436]/35 bg-[#f7d436]/[0.04] px-3 py-2.5'
                                    : 'px-1 py-1'
                            }
                        >
                            <p className="m-0 text-sm leading-5 text-white/70">
                                {entry.featured && (
                                    <span className="mr-1.5 inline-block text-[#f7d436]" aria-hidden="true">
                                        ♛
                                    </span>
                                )}
                                <span className={`font-black ${entry.color}`}>{entry.name}</span>
                                <span className="text-white/55"> {entry.message}</span>
                            </p>
                        </div>
                    ))}
                </div>

                <div className="border-t border-white/[0.06] p-4">
                    <div className="flex gap-2">
                        <div className="relative min-w-0 flex-1">
                            <input
                                className="w-full rounded-xl border border-white/10 bg-[#0a0812] px-3 py-2.5 pr-10 text-sm text-white/35 outline-none"
                                placeholder="Send a message"
                                disabled
                                readOnly
                            />
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/25" aria-hidden="true">
                                ☺
                            </span>
                        </div>
                        <button
                            type="button"
                            className="shrink-0 rounded-xl border border-[#b8f04a]/50 bg-[#b8f04a]/15 px-4 py-2.5 text-xs font-black uppercase tracking-[0.08em] text-[#d7ff7a]"
                            disabled
                        >
                            Chat
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}
