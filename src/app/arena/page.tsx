import GameShell from '@/views/game/game-shell'
import ArenaView from '@/views/arena/arena-view'

export default function ArenaPage() {
    return (
        <GameShell mainClassName="game-main--arena" variant="arena">
            <ArenaView/>
        </GameShell>
    )
}
