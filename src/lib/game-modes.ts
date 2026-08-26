export type GameModeId = 'arena' | 'duel' | 'tournament'

export type GameMode = {
    id: GameModeId
    name: string
    tagline: string
    description: string
    accent: string
    route: `/${GameModeId}`
    disabled: boolean
}

export const gameModes: GameMode[] = [
    {
        id: 'arena',
        name: 'Arena',
        tagline: 'Coliseum',
        description: 'Pay the entrance fee, draw your hand, and fight for lives in the main coliseum.',
        accent: '#f7d436',
        route: '/arena',
        disabled: false,
    },
    {
        id: 'duel',
        name: 'Duel',
        tagline: '1v1',
        description: 'Challenge a rival directly in a fast, high-stakes head-to-head match.',
        accent: '#ff6b4a',
        route: '/duel',
        disabled: true,
    },
    {
        id: 'tournament',
        name: 'Tournament',
        tagline: 'Bracket',
        description: 'Survive the bracket and climb the leaderboard for bigger rewards.',
        accent: '#5ce1ff',
        route: '/tournament',
        disabled: true,
    },
]

export function getGameMode(id: GameModeId) {
    return gameModes.find((mode) => mode.id === id)
}
