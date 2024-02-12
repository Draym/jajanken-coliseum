import type { NextPage } from "next"
import { useMemo, type CSSProperties } from "react"
import styles from "./frame-component5.module.css"

export type FrameComponent5Type = {
  outsmartYourLuck?: string;

  /** Style props */
  propPadding?: CSSProperties["padding"];
  propMinWidth?: CSSProperties["minWidth"];
};

const FrameComponent5: NextPage<FrameComponent5Type> = ({
  outsmartYourLuck,
  propPadding,
  propMinWidth,
}) => {
  const frameDivStyle: CSSProperties = useMemo(() => {
    return {
      padding: propPadding,
      minWidth: propMinWidth,
    };
  }, [propPadding, propMinWidth]);

  return (
    <div className={styles.frameWrapper} style={frameDivStyle}>
      <div className={styles.outsmartYourLuckParent}>
        <h2 className={styles.outsmartYourLuck}>{outsmartYourLuck}</h2>
        <div className={styles.inTheEndlessBattleRoyaleAParent}>
          <div className={styles.inTheEndlessContainer}>
            <p className={styles.inTheEndlessBattleRoyaleA}>
              <span
                className={styles.inTheEndless}
              >{`In the endless battle royale arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
              <span className={styles.coins}>{`coins `}</span>
              <span>while losers risk elimination</span>
            </p>
            <p className={styles.blankLine}>&nbsp;</p>
            <p className={styles.toExitAndClaimRewardsPla}>
              <span>{`To exit and claim rewards, players must strategically manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
              <span className={styles.coins1}>coins</span>
            </p>
          </div>
          <div className={styles.frameChild} />
        </div>
      </div>
    </div>
  );
};

export default FrameComponent5;
