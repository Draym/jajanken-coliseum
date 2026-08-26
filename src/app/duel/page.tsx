import GameShell from '@/views/game/game-shell'
import ModeComingSoonView from '@/views/modes/mode-coming-soon-view'
import {getGameMode} from '@/lib/game-modes'

const duelMode = getGameMode('duel')!

export default function DuelPage() {
    return (
        <GameShell>
            <ModeComingSoonView mode={duelMode}/>
        </GameShell>
    )
}
