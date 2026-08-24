'use client'

import styles from "../landing.module.css"
import RulesLeftTextComponent from "./rules-left-text-component"
import RulesRightTextComponent from "./rules-right-text-component"
import MatchmakingBattleComponent from "./matchmaking-battle-component"
import ScrollReveal from "./scroll-reveal"
import {Box, Flex} from "@chakra-ui/react"

function RuleParagraph() {
    return (
        <>
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
        </>
    )
}

export default function HowToPlaySection() {
    return (
        <div id="explore" className={styles.howToPlaySection}>
            <div id="rules" className={styles.rulesContainer}>
                <Flex direction="row" width="100%" className={`${styles.rule1} ${styles.ruleRow}`}>
                    <Box flex="2" className={styles.ruleGutter}/>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleTextCol}>
                        <ScrollReveal from="left" className={styles.ruleRevealContents}>
                            <RulesLeftTextComponent title="9 cards to rules them">
                                <RuleParagraph/>
                            </RulesLeftTextComponent>
                        </ScrollReveal>
                    </Box>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleVisualCol}>
                        <ScrollReveal from="right" delay={0.08}>
                            <div className={styles.ruleVisual}>
                                <div className={styles.rule1BlueBG}/>
                                <div className={styles.rule1GreenBG}/>
                                <div className={styles.rule1RedBG}/>
                                <img className={styles.rule1Img} alt="" src='/rule1-img.png'/>
                            </div>
                        </ScrollReveal>
                    </Box>
                    <Box flex="2" className={styles.ruleGutter}/>
                </Flex>

                <Flex direction="row" width="100%" className={`${styles.rule2} ${styles.ruleRow}`}>
                    <Box flex="2" className={styles.ruleGutter}/>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleVisualCol}>
                        <ScrollReveal from="left">
                            <div className={styles.ruleVisual}>
                                <div className={styles.rule2OrangeBG}/>
                                <img className={styles.rule2Img} alt="" src='/rule2-img.png'/>
                            </div>
                        </ScrollReveal>
                    </Box>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleTextCol}>
                        <ScrollReveal from="right" delay={0.08} className={styles.ruleRevealContents}>
                            <RulesRightTextComponent
                                title="duel them all"
                                propPadding="0px 0px var(--padding-6xs)"
                                propMinWidth="384px"
                            >
                                <RuleParagraph/>
                            </RulesRightTextComponent>
                        </ScrollReveal>
                    </Box>
                    <Box flex="2" className={styles.ruleGutter}/>
                </Flex>

                <Flex direction="row" width="100%" className={`${styles.rule3} ${styles.ruleRow}`}>
                    <Box flex="2" className={styles.ruleGutter}/>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleTextCol}>
                        <ScrollReveal from="left" className={styles.ruleRevealContents}>
                            <RulesLeftTextComponent title="outsmart your Luck">
                                <RuleParagraph/>
                            </RulesLeftTextComponent>
                        </ScrollReveal>
                    </Box>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleVisualCol}>
                        <ScrollReveal from="right" delay={0.08}>
                            <div className={`${styles.ruleVisual} ${styles.rule3Visual}`}>
                                <img className={styles.rule3Img} alt="" src='/rule3-img.png'/>
                            </div>
                        </ScrollReveal>
                    </Box>
                    <Box flex="2" className={styles.ruleGutter}/>
                </Flex>

                <Flex direction="row" width="100%" className={`${styles.rule4} ${styles.ruleRow}`}>
                    <Box flex="2" className={styles.ruleGutter}/>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleVisualCol}>
                        <ScrollReveal from="left">
                            <MatchmakingBattleComponent/>
                        </ScrollReveal>
                    </Box>
                    <Box flex="4" display="flex" alignItems="center" justifyContent="center" className={styles.ruleTextCol}>
                        <ScrollReveal from="right" delay={0.08} className={styles.ruleRevealContents}>
                            <RulesRightTextComponent
                                title="matchmaking"
                                propPadding="0px 0px var(--padding-6xs)"
                                propMinWidth="384px"
                            >
                                <RuleParagraph/>
                            </RulesRightTextComponent>
                        </ScrollReveal>
                    </Box>
                    <Box flex="2" className={styles.ruleGutter}/>
                </Flex>

                <Flex direction="row" width="100%" className={`${styles.rule5} ${styles.ruleRow}`}>
                    <Box flex="2" className={styles.ruleGutter}/>
                    <Box flex="8" className={styles.rule5Main}>
                        <img className={styles.rule5RedBg} alt="" src="/mask-group.svg"/>
                        <Flex direction="row" width="100%" className={`${styles.rule5Columns} ${styles.ruleRow}`}>
                            <Box flex="1" display="flex" alignItems="center" justifyContent="center" className={styles.ruleTextCol}>
                                <ScrollReveal from="left" className={styles.ruleRevealContents}>
                                    <RulesLeftTextComponent
                                        title="Get Rewarded"
                                        propPadding="0px 0px var(--padding-6xs)"
                                        propMinWidth="384px"
                                    >
                                        <RuleParagraph/>
                                    </RulesLeftTextComponent>
                                </ScrollReveal>
                            </Box>
                            <Box flex="1" position="relative" display="flex" alignItems="center" justifyContent="center" className={styles.ruleVisualCol}>
                                <ScrollReveal from="right" delay={0.08}>
                                    <div className={`${styles.ruleVisual} ${styles.rule5Visual}`}>
                                        <div className={styles.rule5ImageWrap}>
                                            <img className={styles.rule5Img} alt="" src="/rule5-img.png"/>
                                            <div className={styles.rule5RewardCard}>
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
                                </ScrollReveal>
                            </Box>
                        </Flex>
                    </Box>
                    <Box flex="2" className={styles.ruleGutter}/>
                </Flex>
            </div>
        </div>
    )
}
