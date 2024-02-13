import styles from "./landing.module.css"
import HeaderComponent from "./components/header-component"
import JoinGameComponent from "./components/join-game-component"
import RulesLeftTextComponent from "./components/rules-left-text-component"
import RulesRightTextComponent from "./components/rules-right-text-component"
import PlayerCardComponent from "./components/player-card-component"
import QuestsComponent from "./components/quests-component"
import FooterComponent from "./components/footer-component"
import JoinGameComponent2 from "@/views/landing/components/join-game2-component";
import FaqComponent from "@/views/landing/components/faq-component";
import {Box, Flex} from "@chakra-ui/react";
import ScrollLink from "@/components/scroll-link";

export default function Landing() {
    return (
        <div>
            <HeaderComponent/>
            <div className={styles.homepage} id='toplanding'>
                <img className={styles.unionIcon} alt="" src="/union.svg"/>
                <img className={styles.frameChild} alt="" src="/rectangle-18@2x.png"/>
                <section className={styles.vectorParent}>
                    <JoinGameComponent/>
                    <div className={styles.seeMoreParent}>
                        <div className={styles.seeMore}>
                            <ScrollLink target={'explore'}><b>see more</b></ScrollLink>
                        </div>
                        <img
                            className={styles.arrowsDiagramsarrowIcon}
                            loading="eager"
                            alt=""
                            src="/arrows-diagramsarrow.svg"
                        />
                    </div>
                </section>
                <section className={styles.frameParent}>
                    <div className={styles.maskGroupParent}>
                        <img className={styles.maskGroupIcon} alt="" src="/mask-group.svg"/>
                        <Flex direction="row" id='explore'>
                            <div className={styles.frameWrapper}>
                                <div className={styles.rectangleParent}>
                                    <img
                                        className={styles.rectangleIcon}
                                        loading="eager"
                                        alt=""
                                        src="/rectangle-20@2x.png"
                                    />
                                    <div className={styles.findFortuneOrDieParent}>
                                        <h2 className={styles.findFortuneOr}>Find fortune... or die</h2>
                                        <div className={styles.loremIpsumDolor}>
                                            Lorem ipsum dolor sit amet consectetur. Velit lacus nulla
                                            neque in id senectus. Libero blandit orci in elementum sit
                                            cras egestas quam. Nulla vivamus amet integer molestie arcu.
                                            Nunc quis semper scelerisque id. Egestas pellentesque odio
                                            justo condimentum sagittis. Sit at faucibus lectus at elit
                                            pharetra etiam posuere sed. Sapien euismod cursus accumsan
                                            tristique mauris augue gravida sed vel. Dolor nisi mauris
                                            placerat euismod donec. Augue tempus dignissim facilisi
                                            interdum.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Flex>
                        <div id='rules' className={styles.container}>
                            <Flex direction="row" id='rule1' className={styles.rules}>
                                <Box flex="2"></Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <RulesLeftTextComponent title="9 cards to rules them">
                                        <p className={styles.inTheEndlessBattleRoyaleA}>
                                            <span
                                                className={styles.inTheEndless}>{`In the endless battle royal arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                            <span className={styles.souls}>{'souls '}</span>
                                            <span>while losers risk elimination</span>
                                        </p>
                                        <p className={styles.blankLine}>&nbsp;</p>
                                        <p className={styles.toExitAndClaimRewardsPla}>
                                            <span>{`To exit and claim rewards, players must manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                            <span className={styles.souls}>souls</span>
                                        </p>
                                    </RulesLeftTextComponent>
                                </Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <div className={styles.rule1BlueBG}/>
                                    <div className={styles.rule1GreenBG}/>
                                    <div className={styles.rule1RedBG}/>
                                    <img className={styles.rule1Img} alt="" src='/rule1-img.png'/>
                                </Box>
                                <Box flex="2"></Box>
                            </Flex>


                            <Flex direction="row" id='rule2' className={styles.rules}>
                                <Box flex="2"></Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <div className={styles.rule2OrangeBG}/>
                                    <img className={styles.rule2Img} alt="" src='/rule2-img.png'/>
                                </Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <RulesRightTextComponent
                                        title="duel them all"
                                        propPadding="0px 0px var(--padding-6xs)"
                                        propMinWidth="384px"
                                    ><p className={styles.inTheEndlessBattleRoyaleA}>
                                            <span
                                                className={styles.inTheEndless}>{`In the endless battle royal arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                        <span className={styles.souls}>{'souls '}</span>
                                        <span>while losers risk elimination</span>
                                    </p>
                                        <p className={styles.blankLine}>&nbsp;</p>
                                        <p className={styles.toExitAndClaimRewardsPla}>
                                            <span>{`To exit and claim rewards, players must manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                            <span className={styles.souls}>souls</span>
                                        </p>
                                    </RulesRightTextComponent>
                                </Box>
                                <Box flex="2"></Box>
                            </Flex>


                            <Flex direction="row" id='rule3' className={styles.rules}>
                                <Box flex="2"></Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <RulesLeftTextComponent title="outsmart your Luck">
                                        <p className={styles.inTheEndlessBattleRoyaleA}>
                                                <span
                                                    className={styles.inTheEndless}>{`In the endless battle royal arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                            <span className={styles.souls}>{'souls '}</span>
                                            <span>while losers risk elimination</span>
                                        </p>
                                        <p className={styles.blankLine}>&nbsp;</p>
                                        <p className={styles.toExitAndClaimRewardsPla}>
                                            <span>{`To exit and claim rewards, players must manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                            <span className={styles.souls}>souls</span>
                                        </p>
                                    </RulesLeftTextComponent>
                                </Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <img className={styles.rule3Img} alt="" src='/rule3-img.png'/>
                                </Box>
                                <Box flex="2"></Box>
                            </Flex>


                            <Flex direction="row" id='rule4' className={styles.rules}>
                                <Box flex="2"></Box>
                                <Box flex="4" position="relative" display="flex" alignItems="center"
                                     justifyContent="center">
                                    <img className={styles.rule4Img} alt="" src='/rule4-img.png'/>
                                    <Box position="absolute" top="0" left="0">
                                        <PlayerCardComponent
                                            avatar="/rectangle-19-1@2x.png"
                                            pseudo="Anubis"
                                            score="1V - 1L"
                                            cardRed="2"
                                            cardGreen="2"
                                            cardBlue="3"
                                        />
                                    </Box>
                                    <Box position="absolute" bottom="140" right="230">
                                        <PlayerCardComponent
                                            avatar="/rectangle-19@2x.png"
                                            pseudo="Cerberus"
                                            score="3V - 0L"
                                            cardRed="3"
                                            cardGreen="2"
                                            cardBlue="1"
                                        />
                                    </Box>
                                    <div className={styles.rule4BGRed}/>
                                </Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <RulesRightTextComponent
                                        title="matchmaking"
                                        propPadding="0px 0px var(--padding-6xs)"
                                        propMinWidth="384px"
                                    ><p className={styles.inTheEndlessBattleRoyaleA}>
                                            <span
                                                className={styles.inTheEndless}>{`In the endless battle royal arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                        <span className={styles.souls}>{'souls '}</span>
                                        <span>while losers risk elimination</span>
                                    </p>
                                        <p className={styles.blankLine}>&nbsp;</p>
                                        <p className={styles.toExitAndClaimRewardsPla}>
                                            <span>{`To exit and claim rewards, players must manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                            <span className={styles.souls}>souls</span>
                                        </p>
                                    </RulesRightTextComponent>
                                </Box>
                                <Box flex="2"></Box>
                            </Flex>

                            <Flex direction="row" id='rule5' className={styles.rules}>
                                <Box flex="2"></Box>
                                <Box flex="4" display="flex" alignItems="center" justifyContent="center">
                                    <RulesLeftTextComponent
                                        title="Get Rewarded"
                                        propPadding="0px 0px var(--padding-6xs)"
                                        propMinWidth="384px"
                                    ><p className={styles.inTheEndlessBattleRoyaleA}>
                                            <span
                                                className={styles.inTheEndless}>{`In the endless battle royal arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                        <span className={styles.souls}>{'souls '}</span>
                                        <span>while losers risk elimination</span>
                                    </p>
                                        <p className={styles.blankLine}>&nbsp;</p>
                                        <p className={styles.toExitAndClaimRewardsPla}>
                                            <span>{`To exit and claim rewards, players must manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                            <span className={styles.souls}>souls</span>
                                        </p>
                                    </RulesLeftTextComponent>
                                </Box>

                                <Box flex="4" position="relative" display="flex" alignItems="center"
                                     justifyContent="center">
                                    <img className={styles.rule5Img} alt="" src="/rule5-img.png"/>

                                    <Box position="absolute" top="4" left="97">
                                        <div className={styles.frameParent5}>
                                            <div className={styles.rectangleGroup}>
                                                <img
                                                    className={styles.frameChild5}
                                                    alt=""
                                                    src="/rectangle-19@2x.png"
                                                />
                                                <h3 className={styles.cerberus}>Cerberus</h3>
                                            </div>
                                            <div className={styles.youReceived35Wrapper}>
                                                <div className={styles.youReceived35}>
                                                    You received 350$
                                                </div>
                                            </div>
                                        </div>
                                    </Box>
                                </Box>
                                <Box flex="2"></Box>
                            </Flex>
                        </div>

                        <div className={styles.wrapperRectangle18Parent}>
                            <div className={styles.wrapperRectangle18}>
                                <img
                                    className={styles.wrapperRectangle18Child}
                                    alt=""
                                    src="/rectangle-18.svg"
                                />
                            </div>
                            <img
                                className={styles.image16Icon}
                                loading="eager"
                                alt=""
                                src="/image-16@2x.png"
                            />
                        </div>
                    </div>
                </section>
                <Flex direction="row" id='quests'>
                    <QuestsComponent/>
                </Flex>
                <section className={styles.frameSection}>
                    <JoinGameComponent2/>
                    <Flex direction='row' id='faq'>
                        <FaqComponent/>
                    </Flex>
                </section>
                <FooterComponent/>
                {/*<section className={styles.unionParent}>*/}
                {/*    <img className={styles.unionIcon1} alt="" src="/union-2.svg"/>*/}
                {/*</section>*/}
            </div>
        </div>
    );
}