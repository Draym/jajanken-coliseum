import type {NextPage} from "next"
import styles from "./matchmaking-battle-component.module.css"
import PlayerCardComponent from "./player-card-component"

const MatchmakingBattleComponent: NextPage = () => {
    return (
        <div className={styles.battleArena} aria-hidden="true">
            <div className={styles.battleGlow}/>

            <div className={styles.playerTopLeft}>
                <PlayerCardComponent
                    className={styles.playerCard}
                    avatar="/rectangle-19-1@2x.png"
                    pseudo="Anubis"
                    score="1V - 1L"
                    cardRed="2"
                    cardGreen="2"
                    cardBlue="3"
                />
            </div>

            <img className={styles.vsImage} alt="" src="/rule4-img.png"/>

            <div className={styles.playerBottomRight}>
                <PlayerCardComponent
                    className={styles.playerCard}
                    avatar="/rectangle-19@2x.png"
                    pseudo="Cerberus"
                    score="3V - 0L"
                    cardRed="3"
                    cardGreen="2"
                    cardBlue="1"
                />
            </div>
        </div>
    )
}

export default MatchmakingBattleComponent
