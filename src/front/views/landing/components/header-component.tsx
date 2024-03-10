import type {NextPage} from "next"
import styles from "./header-component.module.css"
import ScrollLink from "@/front/components/scroll-link"
import DisplayWallet from "@/front/components/wallet/display-wallet"

const HeaderComponent: NextPage = () => {
    return (
        <header className={styles.headerContainer}>
            <img
                className={styles.vectorIcon}
                loading="eager"
                alt=""
                src="/vector.svg"
            />
            <div className={styles.headerParent}>
                <div className={styles.exploreParent}>
                    <ScrollLink target={"explore"} className={styles.explore}><span>Explore</span></ScrollLink>
                    <ScrollLink target={"rules"} className={styles.rules}><span>Rules</span></ScrollLink>
                    <img className={styles.unionIcon} alt="" src="/union-1.svg"/>
                </div>
                <ScrollLink target={"quests"} className={styles.quests}><span>Quests</span></ScrollLink>
                <ScrollLink target={"faq"} className={styles.faq}><span>FAQ</span></ScrollLink>
            </div>
            <DisplayWallet/>
        </header>
    );
};

export default HeaderComponent;
