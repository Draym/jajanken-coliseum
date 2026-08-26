'use client'

import TechniqueHandCard from '@/components/technique-hand-card'
import type {TechniqueId} from '@/lib/techniques'

type ArenaTechniqueHandProps = {
    counts: Partial<Record<TechniqueId, number>>
}

const handOrder: TechniqueId[] = ['guu', 'paa', 'chi']

export default function ArenaTechniqueHand({counts}: ArenaTechniqueHandProps) {
    return (
        <div className="flex w-full flex-col items-center">
            <p className="m-0 text-base font-black uppercase tracking-[0.18em] text-white sm:text-lg">My cards</p>
            <div className="mt-6 flex items-end gap-3 pb-4 sm:mt-10 sm:justify-center sm:gap-8 sm:pb-2 md:gap-12">
                {handOrder.map((techniqueId) => (
                    <TechniqueHandCard
                        key={techniqueId}
                        techniqueId={techniqueId}
                        count={counts[techniqueId] ?? 0}
                        size="arena"
                    />
                ))}
            </div>
        </div>
    )
}
