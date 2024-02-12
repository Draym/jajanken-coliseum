import type { NextPage } from "next"
import { useMemo, type CSSProperties } from "react"
import styles from "./quest-component.module.css"

export type FrameComponent3Type = {
  img?: string;
  text?: string;

  /** Style props */
  propMargin?: CSSProperties["margin"];
};

const QuestComponent: NextPage<FrameComponent3Type> = ({
  img,
  text,
  propMargin,
}) => {
  const winStreakStyle: CSSProperties = useMemo(() => {
    return {
      margin: propMargin,
    };
  }, [propMargin]);

  return (
    <div className={styles.rectangleParent}>
      <img className={styles.frameChild} alt="" src={img} />
      <div className={styles.winStreakParent}>
        <div className={styles.winStreak} style={winStreakStyle}>
          {text}
        </div>
        <div className={styles.loremIpsumDolor}>
          Lorem ipsum dolor sit amet consectetur. Velit lacus nulla neque in id
          senectus. Libero blandit orci in elementum sit cras egestas quam.
        </div>
      </div>
    </div>
  );
};

export default QuestComponent;
