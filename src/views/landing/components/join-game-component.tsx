'use client'

import styles from "./join-game-component.module.css"
import {useRouter} from 'next/navigation'
import ButtonGreen from "@/components/button-green"

const JoinGameComponent = () => {
    const router = useRouter()

    function joinGame() {
        router.push('/game')
    }

    return (
        <div className={styles.frameWrapper}>
            <div className={styles.frameContainer}>
                <div className={styles.rectangleParent}>
                    <div className={styles.frameChild}/>
                    <div className={styles.frameParent}>
                        <div className={styles.frameGroup}>
                            <div className={styles.ellipseParent}>
                                <div className={styles.frameItem}/>
                                <div className={styles.frameInner}/>
                            </div>
                            <h1 className={styles.stepIntoThe}>Step into the Battle Arena</h1>
                        </div>
                        <div className={styles.welcomeToThe}>
                            Welcome to the depths of the purgatory, where souls battle for survival under the watchful eye of the devil himself
                        </div>
                    </div>
                    <div className={styles.ellipseGroup}>
                        <div className={styles.ellipseDiv}/>
                        <div className={styles.frameDiv}>
                            <div className={styles.btnParent}>
                                <ButtonGreen text="enter the arena" onClick={joinGame}/>
                                <div className={styles.aMetamaskWallet}>
                                    ETH wallet required to play
                                </div>
                            </div>
                        </div>
                        <div className={styles.frameChild1}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinGameComponent;
