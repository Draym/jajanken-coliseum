import styles from "./landing.module.css"
import HeaderComponent from "./components/header-component"
import JoinGameComponent from "./components/join-game-component"
import QuestsComponent from "./components/quests-component"
import FooterComponent from "./components/footer-component"
import JoinGameComponent2 from "@/views/landing/components/join-game2-component";
import SeeMoreTrigger from "@/views/landing/components/see-more-trigger";
import HowToPlaySection from "@/views/landing/components/how-to-play-section";
import {FullPageScroll, FullPageSlide} from "@/views/landing/components/full-page-scroll";

export default function Landing() {
    return (
        <FullPageScroll header={<HeaderComponent/>}>
            <FullPageSlide id="hero" className={styles.heroSlide}>
                <JoinGameComponent/>
                <SeeMoreTrigger/>
            </FullPageSlide>

            <FullPageSlide id="how-to-play" variant="flow" className={styles.contentSlide}>
                <HowToPlaySection/>

                <div id="quests" className={styles.questsSlide}>
                    <QuestsComponent/>
                </div>

                <section id="cta" className={styles.ctaSection}>
                    <div className={styles.ctaSlideContent}>
                        <JoinGameComponent2/>
                    </div>
                    <div className={styles.ctaSlideFooter} id="footer">
                        <FooterComponent embedded/>
                    </div>
                </section>
            </FullPageSlide>
        </FullPageScroll>
    );
}
