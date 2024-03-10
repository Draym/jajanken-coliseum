import type {NextPage} from "next"
import FooterMemberComponent from "./footer-member-component"
import styles from "./footer-component.module.css"
import ScrollLink from "@/front/components/scroll-link"

const FooterComponent: NextPage = () => {
    return (
        <footer className={styles.frameParent}>
            <div className={styles.vectorParent}>
                <img className={styles.vectorIcon} alt="" src="/vector.svg"/>
                <div className={styles.aboutTheGameParent}>
                    <div className={styles.aboutTheGame}>About the game</div>
                    <ScrollLink target={"explore"} className={styles.explore}><span>Explore</span></ScrollLink>
                    <ScrollLink target={"rules"} className={styles.rules}><span>Rules</span></ScrollLink>
                    <ScrollLink target={"quests"} className={styles.quests}><span>Quests</span></ScrollLink>
                </div>
                <div className={styles.moreParent}>
                    <div className={styles.more}>More</div>
                    <ScrollLink target={"faq"} className={styles.faq}><span>FAQ</span></ScrollLink>
                </div>
                <FooterMemberComponent
                    name="Kevin"
                    title="Developper"
                    logo1={{img: "/github-black.svg", redirection: "https://github.com/Draym"}}
                    logo2={{img: "/twitter-black@2x.png", redirection: "https://twitter.com/kevdrym"}}
                />
                <FooterMemberComponent
                    name="Clement"
                    title="Product Designer"
                    logo1={{img: "/behance-black@2x.png", redirection: "https://www.behance.net/resand"}}
                    logo2={{img: "/dribbble-black@2x.png", redirection: "https://dribbble.com/resand"}}
                    logo3={{img: "/linkedin-black@2x.png", redirection: "https://www.linkedin.com/in/cl%C3%A9ment-andres-9416b6107/"}}
                    propFlex="unset"
                    propMinWidth="unset"
                />
            </div>
            <div className={styles.allRightsReservedUnauthoriWrapper}>
                <div className={styles.allRightsReserved}>
                    © 2024 All rights reserved. Unauthorized reproduction or distribution
                    of JaJanken
                </div>
            </div>
        </footer>
    );
};

export default FooterComponent;
