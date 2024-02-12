import type {NextPage} from "next"
import FooterMemberComponent from "./footer-member-component"
import styles from "./footer-component.module.css"
import ScrollLink from "@/components/scroll-link"

const FooterComponent: NextPage = () => {
    return (
        <footer className={styles.frameParent}>
            <div className={styles.vectorParent}>
                <img className={styles.vectorIcon} alt="" src="/vector.svg"/>
                <div className={styles.aboutTheGameParent}>
                    <div className={styles.aboutTheGame}>About the game</div>
                    <ScrollLink target={"explore"} className={styles.faq}><span>Explore</span></ScrollLink>
                    <ScrollLink target={"rules"} className={styles.rules}><span>Rules</span></ScrollLink>
                    <ScrollLink target={"quests"} className={styles.quests}><span>Quests</span></ScrollLink>
                </div>
                <div className={styles.moreParent}>
                    <div className={styles.more}>More</div>
                    <ScrollLink target={""} className={styles.faq}><span>FAQ</span></ScrollLink>
                </div>
                <FooterMemberComponent
                    name="Kévin"
                    title="Developper"
                    logo1={{img: "/github-black.svg", redirection: "https://github.com/Draym"}}
                    logo2={{img: "/twitter-black@2x.png", redirection: "https://twitter.com/kevdrym"}}
                />
                <FooterMemberComponent
                    name="Clément"
                    title="Product Designer"
                    logo1={{img: "/behance-black@2x.png", redirection: "google.com"}}
                    logo2={{img: "/dribbble-black@2x.png", redirection: "google.com"}}
                    logo3={{img: "/instagram-black@2x.png", redirection: "google.com"}}
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
