import type {NextPage} from "next"
import {Button} from "@chakra-ui/react"
import styles from "./header-component.module.css"
import ScrollLink from "@/components/scroll-link";

const HeaderComponent: NextPage = () => {
    return (
        <header className={styles.rectangleParent}>
            <div className={styles.frameChild}/>
            <img
                className={styles.vectorIcon}
                loading="eager"
                alt=""
                src="/vector.svg"
            />
            <div className={styles.frameParent}>
                <div className={styles.exploreParent}>
                    <ScrollLink target={"explore"} className={styles.explore}><span>Explore</span></ScrollLink>
                    <ScrollLink target={"rules"} className={styles.rules}><span>Rules</span></ScrollLink>
                    <img className={styles.unionIcon} alt="" src="/union-1.svg"/>
                </div>
                <ScrollLink target={"quests"} className={styles.quests}><span>Quests</span></ScrollLink>
                <ScrollLink target={"faq"} className={styles.faq}><span>FAQ</span></ScrollLink>
                <Button className={styles.btn} variant="outline" colorScheme="teal"/>
            </div>
        </header>
    );
};

export default HeaderComponent;
