'use client'

import type {PlayerProfile} from '@/lib/coliseum-contract'
import type {TechniqueId} from '@/lib/techniques'
import MatchActionButton from '@/views/arena/components/match/match-action-button'
import SelectableTechniqueHand from '@/views/arena/components/match/selectable-technique-hand'

type MatchPickScreenProps = {
    profile: PlayerProfile
    selectedTechnique: TechniqueId | null
    onSelect: (techniqueId: TechniqueId | null) => void
    onFight: () => void
    isFightLoading: boolean
}

export default function MatchPickScreen({
    profile,
    selectedTechnique,
    onSelect,
    onFight,
    isFightLoading,
}: MatchPickScreenProps) {
    return (
        <div className="flex w-full flex-col items-center">
            <h2 className="m-0 mb-5 text-center text-xl font-black uppercase tracking-wider text-white sm:mb-10 lg:mb-12 lg:text-2xl">
                Pick your move
            </h2>
            <div className="flex w-full flex-col items-center gap-5 sm:gap-7 lg:gap-8">
                <SelectableTechniqueHand
                    counts={{guu: profile.guu, paa: profile.paa, chi: profile.chi}}
                    selected={selectedTechnique}
                    onSelect={onSelect}
                    disabled={isFightLoading}
                />
                <MatchActionButton
                    label="Fight!"
                    isLoading={isFightLoading}
                    disabled={!selectedTechnique}
                    onClick={onFight}
                    className={selectedTechnique ? '!mt-0' : 'invisible pointer-events-none !mt-0'}
                />
            </div>
        </div>
    )
}
