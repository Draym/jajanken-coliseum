export type TechniqueId = 'guu' | 'chi' | 'paa'

export type TechniqueDefinition = {
    id: TechniqueId
    name: string
    image: string
    imageUsed: string
    accent: string
}

/** guu > chi > paa (rock > paper > scissors) */
export const techniques: Record<TechniqueId, TechniqueDefinition> = {
    guu: {
        id: 'guu',
        name: 'GUU',
        image: '/red.webp',
        imageUsed: '/red-bw.webp',
        accent: '#ff6b6b',
    },
    chi: {
        id: 'chi',
        name: 'CHI',
        image: '/green.webp',
        imageUsed: '/green-bw.webp',
        accent: '#6bffb8',
    },
    paa: {
        id: 'paa',
        name: 'PAA',
        image: '/blue.webp',
        imageUsed: '/blue-bw.webp',
        accent: '#6bb8ff',
    },
}

export const techniqueIds: TechniqueId[] = ['guu', 'chi', 'paa']

/** Native technique card art dimensions (8235×11779px). */
export const TECHNIQUE_IMAGE_WIDTH = 8235
export const TECHNIQUE_IMAGE_HEIGHT = 11779
export const techniqueCardAspectClass = 'aspect-[8235/11779]' as const

const techniqueBeatsMap: Record<TechniqueId, TechniqueId> = {
    guu: 'chi',
    chi: 'paa',
    paa: 'guu',
}

export function techniqueBeats(winner: TechniqueId, loser: TechniqueId) {
    return techniqueBeatsMap[winner] === loser
}

export function getTechniqueImage(id: TechniqueId, remainingCount: number) {
    return remainingCount > 0 ? techniques[id].image : techniques[id].imageUsed
}

export function getTechniqueCounts(counts: Partial<Record<TechniqueId, number>>) {
    return techniqueIds.map((id) => ({
        id,
        count: counts[id] ?? 0,
    }))
}
