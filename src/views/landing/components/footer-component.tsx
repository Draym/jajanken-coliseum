import type {NextPage} from "next"
import FooterMemberComponent from "./footer-member-component"
import styles from "./footer-component.module.css"
import ScrollLink from "@/components/scroll-link"

const FooterComponent: NextPage<{ embedded?: boolean; showNavLinks?: boolean }> = ({ embedded = false, showNavLinks = true }) => {
    return (
        <footer className={`${styles.frameParent} ${embedded ? styles.frameParentEmbedded : ''}`.trim()}>
            <div className={`${styles.vectorParent} ${embedded ? styles.vectorParentEmbedded : ''}`.trim()}>
                <div className={styles.footerBrand}>
                    <img className={styles.vectorIcon} alt="" src="/vector.svg"/>
                    {showNavLinks && (
                        <div className={styles.aboutTheGameParent}>
                            <ScrollLink target={"hero"} className={styles.aboutTheGame}><span>About the game</span></ScrollLink>
                            <ScrollLink target={"rules"} className={styles.rules}><span>Rules</span></ScrollLink>
                            <ScrollLink target={"quests"} className={styles.quests}><span>Quests</span></ScrollLink>
                        </div>
                    )}
                </div>
                <div className={styles.footerTeam}>
                    <FooterMemberComponent
                        name="Kevin"
                        title="Developper"
                        logo1={{img: "/github-black.svg", redirection: "https://github.com/Draym"}}
                        logo2={{img: "/twitter-black@2x.png", redirection: "https://twitter.com/kevdrym"}}
                        propFlex="unset"
                        propMinWidth="unset"
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
