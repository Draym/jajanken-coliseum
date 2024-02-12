import styles from "./landing.module.css"
import GroupComponent from "./components/group-component"
import JoinGameComponent from "./components/join-game-component"
import RulesLeftTextComponent from "./components/rules-left-text-component"
import PlayerCardComponent from "./components/player-card-component"
import QuestsComponent from "./components/quests-component"
import FooterComponent from "./components/footer-component"
import JoinGameComponent2 from "@/views/landing/components/join-game2-component";
import FaqComponent from "@/views/landing/components/faq-component";
import {Flex} from "@chakra-ui/react";

export default function Landing() {
    return (
        <div className={styles.homepage} id='toplanding'>
            <img className={styles.unionIcon} alt="" src="/union.svg"/>
            <section className={styles.vectorParent}>
                <img className={styles.frameChild} alt="" src="/rectangle-18@2x.png"/>
                <GroupComponent/>
                <JoinGameComponent/>
                <div className={styles.seeMoreParent}>
                    <div className={styles.seeMore}>see more</div>
                    <img
                        className={styles.arrowsDiagramsarrowIcon}
                        loading="eager"
                        alt=""
                        src="/arrows-diagramsarrow.svg"
                    />
                </div>
            </section>
            <section className={styles.ellipseParent}>
                <div className={styles.frameItem}/>
                <div className={styles.frameInner}/>
            </section>
            <img className={styles.image20Icon} alt="" src="/image-20@2x.png"/>
            <section className={styles.frameParent}>
                <div className={styles.maskGroupParent}>
                    <img className={styles.maskGroupIcon} alt="" src="/mask-group.svg"/>
                    <Flex direction="row">
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


                    <Flex direction="row">
                        <div className={styles.frameParent3}>
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
                            <div className={styles.rule1ImgWrapper}>
                                <img
                                    className={styles.rule1ImgWrapperChild}
                                    alt=""
                                    src="/group-45.svg"
                                />
                            </div>
                        </div>
                    </Flex>


                    <Flex direction="row">
                        <img className={styles.image22Icon} alt="" src='/rules-player-duel.png'/>
                        <div className={styles.frameDiv}>
                            <div className={styles.frameGroup}>
                                <div className={styles.duelThemAllWrapper}>
                                    <h2 className={styles.duelThemAll}>Duel them all</h2>
                                </div>
                                <div className={styles.frameParent1}>
                                    <div className={styles.frameChild1}/>
                                    <div className={styles.inTheEndlessContainer1}>
                                        <p className={styles.inTheEndlessBattleRoyaleA1}>
                                        <span
                                            className={styles.inTheEndless1}>{`In the endless battle royale arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                            <span className={styles.coins2}>{`coins `}</span>
                                            <span>while losers risk elimination</span>
                                        </p>
                                        <p className={styles.blankLine1}>&nbsp;</p>
                                        <p className={styles.toExitAndClaimRewardsPla1}>
                                            <span>{`To exit and claim rewards, players must strategically manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                            <span className={styles.coins3}>coins</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Flex>


                    <Flex direction="row">
                        <div className={styles.frameWrapper2}>
                            <div className={styles.frameParent4}>
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
                            </div>
                            <img className={styles.image21Icon} alt="" src='/rules-player-data.png'/>
                        </div>
                    </Flex>


                    <Flex direction="row">
                        <div className={styles.frameDiv}>
                            <div className={styles.instanceParent}>
                                <div className={styles.instanceWrapper}>
                                </div>
                                <div className={styles.matchmakingParent}>
                                    <h2 className={styles.matchmaking}>Matchmaking</h2>
                                    <div className={styles.lineParent}>
                                        <div className={styles.frameChild2}/>
                                        <div className={styles.inTheEndlessContainer2}>
                                            <p className={styles.inTheEndlessBattleRoyaleA2}>
                                            <span
                                                className={styles.inTheEndless2}>{`In the endless battle royale arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                                <span className={styles.coins4}>{`coins `}</span>
                                                <span>while losers risk elimination</span>
                                            </p>
                                            <p className={styles.blankLine2}>&nbsp;</p>
                                            <p className={styles.toExitAndClaimRewardsPla2}>
                                                <span>{`To exit and claim rewards, players must strategically manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                                <span className={styles.coins5}>coins</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Flex>

                    <Flex direction="row">
                        <div className={styles.frameWrapper2}>
                            <div className={styles.frameParent4}>
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
                                    </p></RulesLeftTextComponent>
                                <div className={styles.groupDiv}>
                                    <div className={styles.ellipseGroup}>
                                        <div className={styles.frameChild4}/>
                                        <img className={styles.image21Icon1} alt="" src="/rectangle-21@2x.png"/>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Flex>


                    <div className={styles.wrapperRectangle18Parent}>
                        <div className={styles.wrapperRectangle18}>
                            <img
                                className={styles.wrapperRectangle18Child}
                                alt=""
                                src="/rectangle-18.svg"
                            />
                        </div>
                        <div className={styles.ellipseDiv}/>
                        <div className={styles.frameChild3}/>
                        <img
                            className={styles.image16Icon}
                            loading="eager"
                            alt=""
                            src="/image-16@2x.png"
                        />
                    </div>
                </div>
                <PlayerCardComponent
                    rectangle19="/rectangle-19-1@2x.png"
                    pseudo="Anubis"
                    score="1V - 1L"
                    prop="6"
                    prop1="2"
                />
                <PlayerCardComponent
                    rectangle19="/rectangle-19@2x.png"
                    pseudo="Cerberus"
                    score="2V - 0L"
                    prop="6"
                    prop1="2"
                    propBottom="888px"
                    propLeft="481px"
                    propMargin="0 !important"
                    propPosition="absolute"
                    propBackgroundColor="rgba(0, 0, 0, 0.3)"
                    propBorder="1px solid var(--color-gray-200)"
                    propBoxShadow="unset"
                />
            </section>
            <QuestsComponent/>
            <section className={styles.frameSection}>
                <JoinGameComponent2/>
                <FaqComponent/>
            </section>
            <FooterComponent/>
            <section className={styles.unionParent}>
                <img className={styles.unionIcon1} alt="" src="/union-2.svg"/>
            </section>
        </div>
    );
}