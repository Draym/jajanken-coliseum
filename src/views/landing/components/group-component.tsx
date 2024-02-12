import type { NextPage } from "next"
import { Button, IconButton } from "@chakra-ui/react"
import styles from "./group-component.module.css"

const GroupComponent: NextPage = () => {
  return (
    <header className={styles.rectangleParent}>
      <div className={styles.frameChild} />
      <img
        className={styles.vectorIcon}
        loading="eager"
        alt=""
        src="/vector.svg"
      />
      <div className={styles.frameParent}>
        <div className={styles.exploreParent}>
          <div className={styles.explore}>Explore</div>
          <div className={styles.rules}>Rules</div>
          <img className={styles.unionIcon} alt="" src="/union-1.svg" />
        </div>
        <div className={styles.quests}>Quests</div>
        <div className={styles.faqWrapper}>
          <div className={styles.faq}>FAQ</div>
        </div>
        <Button className={styles.btn} variant="outline" colorScheme="teal" />
      </div>
    </header>
  );
};

export default GroupComponent;
