import type {TechniqueId} from '@/lib/techniques'

/** On-chain enum JaJanken.Technique */
export const contractTechnique = {
    none: 0,
    guu: 1,
    paa: 2,
    chi: 3,
} as const

export type ContractTechnique = (typeof contractTechnique)[keyof typeof contractTechnique]

const idToContract: Record<TechniqueId, ContractTechnique> = {
    guu: contractTechnique.guu,
    paa: contractTechnique.paa,
    chi: contractTechnique.chi,
}

const contractToId: Record<ContractTechnique, TechniqueId | null> = {
    [contractTechnique.none]: null,
    [contractTechnique.guu]: 'guu',
    [contractTechnique.paa]: 'paa',
    [contractTechnique.chi]: 'chi',
}

export function techniqueIdToContract(id: TechniqueId): ContractTechnique {
    return idToContract[id]
}

export function contractToTechniqueId(value: number): TechniqueId | null {
    return contractToId[value as ContractTechnique] ?? null
}

/** Minimum nen required to cash out (JaJankenColiseum constructor). */
export const MINIMUM_NEN_TO_EARN = 3

/** AFK window in seconds (contract uses playTime/revealTime + 2 minutes). */
export const MATCH_AFK_SECONDS = 2 * 60
