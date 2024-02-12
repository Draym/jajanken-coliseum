import type { NextPage } from "next"
import styles from "./join-game-component.module.css"

const JoinGameComponent: NextPage = () => {
  return (
    <div className={styles.frameWrapper}>
      <div className={styles.frameContainer}>
        <div className={styles.rectangleParent}>
          <div className={styles.frameChild} />
          <div className={styles.frameParent}>
            <div className={styles.frameGroup}>
              <div className={styles.ellipseParent}>
                <div className={styles.frameItem} />
                <div className={styles.frameInner} />
              </div>
              <h1 className={styles.stepIntoThe}>Step into the Battle Arena</h1>
            </div>
            <div className={styles.welcomeToThe}>
              Welcome to the depths of the purgatory, where souls battle for
              survival under the watchful eye of the devil himself
            </div>
          </div>
          <div className={styles.ellipseGroup}>
            <div className={styles.ellipseDiv} />
            <div className={styles.frameDiv}>
              <div className={styles.btnParent}>
                <div className={styles.btn}>
                  <div className={styles.al3Btntext}>
                    <b className={styles.enterTheArena}>enter the arena</b>
                  </div>
                  <img
                    className={styles.btnbgIcon}
                    loading="eager"
                    alt=""
                    src="/btnbg@2x.png"
                  />
                </div>
                <div className={styles.aMetamaskWallet}>
                  A Metamask wallet is required to play
                </div>
              </div>
            </div>
            <div className={styles.frameChild1} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinGameComponent;
