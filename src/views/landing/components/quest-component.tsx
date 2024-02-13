import type { NextPage } from "next"
import styles from "./quest-component.module.css"

export type FrameComponent3Type = {
  img?: string
  text?: string
};

const QuestComponent: NextPage<FrameComponent3Type> = ({
  img,
  text,
}) => {

  return (
    <div className={styles.questContainer}>
      <img className={styles.questImg} alt="" src={img} />
      <div className={styles.questParent}>
        <div className={styles.questTitle}>
          {text}
        </div>
        <div className={styles.questText}>
          Lorem ipsum dolor sit amet consectetur. Velit lacus nulla neque in id
          senectus. Libero blandit orci in elementum sit cras egestas quam.
        </div>
      </div>
    </div>
  );
};

export default QuestComponent;
