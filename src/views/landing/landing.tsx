import styles from "./landing.module.css"
import GroupComponent from "./components/group-component"
import JoinGameComponent from "./components/join-game-component"
import FrameComponent5 from "./components/frame-component5"
import FrameComponent7 from "./components/frame-component7"
import QuestsComponent from "./components/quests-component"
import FooterComponent from "./components/footer-component"

export default function Landing() {
    return (
        <div className={styles.homepage} id='toplanding'>
            <img className={styles.unionIcon} alt="" src="/union.svg" />
            <section className={styles.vectorParent}>
                <img className={styles.frameChild} alt="" src="/rectangle-18@2x.png" />
                <GroupComponent />
                <JoinGameComponent />
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
                <div className={styles.frameItem} />
                <div className={styles.frameInner} />
            </section>
            <img className={styles.image20Icon} alt="" src="/image-20@2x.png" />
            <section className={styles.frameParent}>
                <div className={styles.maskGroupParent}>
                    <img className={styles.maskGroupIcon} alt="" src="/mask-group.svg" />
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
                    <div className={styles.frameContainer}>
                        <div className={styles.cardsToRulesThemParent}>
                            <h2 className={styles.cardsToRules}>9 cards to rules them</h2>
                            <div className={styles.inTheEndlessBattleRoyaleAParent}>
                                <div className={styles.inTheEndlessContainer}>
                                    <p className={styles.inTheEndlessBattleRoyaleA}>
                    <span
                        className={styles.inTheEndless}
                    >{`In the endless battle royale arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
                                        <span className={styles.coins}>{`coins `}</span>
                                        <span>while losers risk elimination</span>
                                    </p>
                                    <p className={styles.blankLine}>&nbsp;</p>
                                    <p className={styles.toExitAndClaimRewardsPla}>
                                        <span>{`To exit and claim rewards, players must strategically manage their cards and coins, aiming to reach zero cards and maintain at least three `}</span>
                                        <span className={styles.coins1}>coins</span>
                                    </p>
                                </div>
                                <div className={styles.lineDiv} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.frameDiv}>
                        <div className={styles.frameGroup}>
                            <div className={styles.duelThemAllWrapper}>
                                <h2 className={styles.duelThemAll}>Duel them all</h2>
                            </div>
                            <div className={styles.frameParent1}>
                                <div className={styles.frameWrapper1}>
                                    <div className={styles.frameParent2}>
                                        <img
                                            className={styles.groupIcon}
                                            loading="eager"
                                            alt=""
                                            src="/group-32@2x.png"
                                        />
                                        <div className={styles.div}>
                                            <span>+</span>
                                            <span className={styles.span}>1</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.frameChild1} />
                                <div className={styles.inTheEndlessContainer1}>
                                    <p className={styles.inTheEndlessBattleRoyaleA1}>
                    <span
                        className={styles.inTheEndless1}
                    >{`In the endless battle royale arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
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
                    <div className={styles.frameParent3}>
                        <FrameComponent5 outsmartYourLuck=" outsmart your Luck" />
                        <div className={styles.instanceParent}>
                            <FrameComponent7
                                rectangle19="/rectangle-19@2x.png"
                                anubis="Cerberus"
                                v7L="5V - 7L"
                                prop="0"
                                prop1="0"
                                propBottom="unset"
                                propLeft="unset"
                                propMargin="unset"
                                propPosition="unset"
                                propBackgroundColor="rgba(248, 23, 12, 0.1)"
                                propBorder="1px solid #f8170c"
                                propBoxShadow="0px 0px 10px #f8170c inset"
                            />
                            <div className={styles.instanceWrapper}>
                                <FrameComponent7
                                    rectangle19="/rectangle-19-1@2x.png"
                                    anubis="Anubis"
                                    v7L="6V - 7L"
                                    prop="6"
                                    prop1="2"
                                    propBottom="unset"
                                    propLeft="unset"
                                    propMargin="unset"
                                    propPosition="unset"
                                    propBackgroundColor="rgba(97, 242, 43, 0.1)"
                                    propBorder="1px solid #61f22b"
                                    propBoxShadow="0px 0px 10px #61f22b inset"
                                />
                            </div>
                            <div className={styles.matchmakingParent}>
                                <h2 className={styles.matchmaking}>Matchmaking</h2>
                                <div className={styles.lineParent}>
                                    <div className={styles.frameChild2} />
                                    <div className={styles.inTheEndlessContainer2}>
                                        <p className={styles.inTheEndlessBattleRoyaleA2}>
                      <span
                          className={styles.inTheEndless2}
                      >{`In the endless battle royale arena, players pay an entry fee to engage in relentless combat. By playing cards against opponents, winners earn `}</span>
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
                    <div className={styles.wrapperRectangle18Parent}>
                        <div className={styles.wrapperRectangle18}>
                            <img
                                className={styles.wrapperRectangle18Child}
                                alt=""
                                src="/rectangle-18.svg"
                            />
                        </div>
                        <div className={styles.wrapperRectangle17Parent}>
                            <div className={styles.wrapperRectangle17}>
                                <img
                                    className={styles.wrapperRectangle17Child}
                                    alt=""
                                    src="/rectangle-17@2x.png"
                                />
                            </div>
                            <div className={styles.wrapperRectangle16}>
                                <img
                                    className={styles.wrapperRectangle16Child}
                                    alt=""
                                    src="/rectangle-16@2x.png"
                                />
                            </div>
                            <div className={styles.image10Parent}>
                                <img
                                    className={styles.image10Icon}
                                    alt=""
                                    src="/image-10@2x.png"
                                />
                                <img className={styles.image11Icon} alt="" />
                            </div>
                            <div className={styles.div1}>
                                <span>{`- `}</span>
                                <span className={styles.span1}>1</span>
                            </div>
                        </div>
                        <div className={styles.wrapperGroup45}>
                            <img
                                className={styles.wrapperGroup45Child}
                                alt=""
                                src="/group-45.svg"
                            />
                        </div>
                        <div className={styles.ellipseDiv} />
                        <div className={styles.frameChild3} />
                        <img
                            className={styles.image16Icon}
                            loading="eager"
                            alt=""
                            src="/image-16@2x.png"
                        />
                        <img className={styles.image21Icon} alt="" />
                        <img className={styles.image5Icon} alt="" />
                    </div>
                    <div className={styles.frameWrapper2}>
                        <div className={styles.frameParent4}>
                            <FrameComponent5
                                outsmartYourLuck="Get Rewarded"
                                propPadding="0px 0px var(--padding-6xs)"
                                propMinWidth="384px"
                            />
                            <div className={styles.groupDiv}>
                                <div className={styles.ellipseGroup}>
                                    <div className={styles.frameChild4} />
                                    <img className={styles.image21Icon1} alt="" />
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
                                                You received 35$
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <FrameComponent7
                    rectangle19="/rectangle-19-1@2x.png"
                    anubis="Anubis"
                    v7L="6V - 7L"
                    prop="6"
                    prop1="2"
                />
                <FrameComponent7
                    rectangle19="/rectangle-19@2x.png"
                    anubis="Cerberus"
                    v7L="5V - 7L"
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
            <QuestsComponent />
            <section className={styles.frameSection}>
                <div className={styles.frameWrapper3}>
                    <div className={styles.rectangleContainer}>
                        <div className={styles.rectangleDiv} />
                        <div className={styles.frameParent6}>
                            <div className={styles.frameParent7}>
                                <div className={styles.ellipseContainer}>
                                    <div className={styles.frameChild6} />
                                    <div className={styles.frameChild7} />
                                </div>
                                <h1 className={styles.findFortuneOr1}>
                                    Find fortune... or die
                                </h1>
                            </div>
                            <div className={styles.welcomeToThe}>
                                Welcome to the depths of the purgatory, where souls battle for
                                survival under the watchful eye of the devil himself
                            </div>
                        </div>
                        <div className={styles.ellipseParent1}>
                            <div className={styles.frameChild8} />
                            <div className={styles.frameWrapper4}>
                                <div className={styles.btnParent}>
                                    <div className={styles.btn}>
                                        <div className={styles.al3Btntext}>
                                            <b className={styles.enterTheArena}>enter the arena</b>
                                        </div>
                                        <img
                                            className={styles.btnbgIcon}
                                            alt=""
                                            src="/btnbg@2x.png"
                                        />
                                    </div>
                                    <div className={styles.aMetamaskWallet}>
                                        A Metamask wallet is required to play
                                    </div>
                                </div>
                            </div>
                            <div className={styles.frameChild9} />
                        </div>
                    </div>
                </div>
                <div className={styles.frequentlyAskedQuestionsParent}>
                    <h1 className={styles.frequentlyAskedQuestions}>
                        frequently asked questions
                    </h1>
                    <div className={styles.instanceGroup}>
                        <div className={styles.whatCryptocurrencieJajankenParent}>
                            <div className={styles.whatCryptocurrencieJajanken}>
                                What cryptocurrencie Jajanken use ?
                            </div>
                            <img className={styles.arrowsDiagramsarrowIcon1} alt="" />
                        </div>
                        <div className={styles.whatCryptocurrencieJajankenGroup}>
                            <div className={styles.whatCryptocurrencieJajanken1}>
                                What cryptocurrencie Jajanken use ?
                            </div>
                            <img
                                className={styles.arrowsDiagramsarrowIcon2}
                                alt=""
                                src="/arrows-diagramsarrow.svg"
                            />
                        </div>
                        <div className={styles.whatCryptocurrencieJajankenContainer}>
                            <div className={styles.whatCryptocurrencieJajanken2}>
                                What cryptocurrencie Jajanken use ?
                            </div>
                            <img
                                className={styles.arrowsDiagramsarrowIcon3}
                                alt=""
                                src="/arrows-diagramsarrow.svg"
                            />
                        </div>
                        <div className={styles.whatCryptocurrencieJajankenParent1}>
                            <div className={styles.whatCryptocurrencieJajanken3}>
                                What cryptocurrencie Jajanken use ?
                            </div>
                            <img
                                className={styles.arrowsDiagramsarrowIcon4}
                                alt=""
                                src="/arrows-diagramsarrow.svg"
                            />
                        </div>
                        <div className={styles.whatCryptocurrencieJajankenParent2}>
                            <div className={styles.whatCryptocurrencieJajanken4}>
                                What cryptocurrencie Jajanken use ?
                            </div>
                            <img
                                className={styles.arrowsDiagramsarrowIcon5}
                                alt=""
                                src="/arrows-diagramsarrow.svg"
                            />
                        </div>
                        <div className={styles.whatCryptocurrencieJajankenParent3}>
                            <div className={styles.whatCryptocurrencieJajanken5}>
                                What cryptocurrencie Jajanken use ?
                            </div>
                            <img
                                className={styles.arrowsDiagramsarrowIcon6}
                                alt=""
                                src="/arrows-diagramsarrow.svg"
                            />
                        </div>
                    </div>
                </div>
            </section>
            <FooterComponent />
            <section className={styles.unionParent}>
                <img className={styles.unionIcon1} alt="" src="/union-2.svg" />
                <img
                    className={styles.frameChild10}
                    loading="eager"
                    alt=""
                    src="/group-86@2x.png"
                />
            </section>
        </div>
    );
}