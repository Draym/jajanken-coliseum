import GameShell from '@/views/game/game-shell'
import ModeComingSoonView from '@/views/modes/mode-coming-soon-view'
import {getGameMode} from '@/lib/game-modes'

const tournamentMode = getGameMode('tournament')!

export default function TournamentPage() {
    return (
        <GameShell>
            <ModeComingSoonView mode={tournamentMode}/>
        </GameShell>
    )
}
