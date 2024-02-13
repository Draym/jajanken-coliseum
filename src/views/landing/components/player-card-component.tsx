import type {NextPage} from "next"
import {useMemo, type CSSProperties} from "react"
import styles from "./player-card-component.module.css"

export type PlayerCardComponentType = {
    avatar?: string;
    pseudo?: string;
    score?: string;
    cardRed?: string;
    cardGreen?: string;
    cardBlue?: string;
};

const PlayerCardComponent: NextPage<PlayerCardComponentType> = ({
                                                                    avatar,
                                                                    pseudo,
                                                                    score,
                                                                    cardRed,
                                                                    cardGreen,
                                                                    cardBlue
                                                                }) => {
    return (
        <div className={styles.frameParent}>
            <div className={styles.rectangleParent}>
                <img className={styles.frameChild} alt="" src={avatar}/>
                <div className={styles.pseudoParent}>
                    <h3 className={styles.pseudo}>{pseudo}</h3>
                    <div className={styles.score}>{score}</div>
                </div>
            </div>
            <div className={styles.frameGroup}>
                <div className={styles.parent}>
                    <div className={styles.div}>{cardRed}</div>
                    <img className={styles.imageCardFire} alt="" src="/image-5@2x.png"/>
                </div>
                <div className={styles.container}>
                    <div className={styles.div2}>{cardGreen}</div>
                    <img className={styles.imageCardGreen} alt="" src="/image-5-2@2x.png"/>
                </div>
                <div className={styles.group}>
                    <div className={styles.div1}>{cardBlue}</div>
                    <img className={styles.imageCardBlue} alt="" src="/image-5-1@2x.png"/>
                </div>
            </div>
        </div>
    );
};

export default PlayerCardComponent;
