'use client'
import styles from "./join-game2-component.module.css"
import {useRouter} from 'next/navigation'
import Button1 from "@/components/button-1"

const JoinGameComponent2 = () => {
    const router = useRouter()

    function joinGame() {
        router.push('/game')
    }

    return (
        <div className={styles.frameWrapper3}>
            <div className={styles.rectangleContainer}>
                <div className={styles.rectangleDiv}/>
                <div className={styles.frameParent6}>
                    <div className={styles.frameParent7}>
                        <div className={styles.ellipseContainer}>
                            <div className={styles.frameChild6}/>
                            <div className={styles.frameChild7}/>
                        </div>
                        <h1 className={styles.findFortuneOr1}>
                            Find fortune... or die
                        </h1>
                    </div>
                    <div className={styles.welcomeToThe}>
                        Welcome to the depths of the purgatory, where souls battle for
                        survival under the watchful eye of the devil himself
                    </div>
                </div>
                <div className={styles.ellipseParent1}>
                    <div className={styles.frameChild8}/>
                    <div className={styles.frameWrapper4}>
                        <div className={styles.btnParent}>
                            <Button1 altText="enter the arena" onClick={joinGame}/>
                            <div className={styles.aMetamaskWallet}>
                                ETH wallet required to play
                            </div>
                        </div>
                    </div>
                    <div className={styles.frameChild9}/>
                </div>
            </div>
        </div>
    );
}
export default JoinGameComponent2;