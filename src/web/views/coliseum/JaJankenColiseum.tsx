import React, {Component} from "react"
import {RouteComponentProps, withRouter} from "react-router-dom"
import ContractLoader from "../../../blockchain/ContractLoader"
import Web3Utils from "../../../blockchain/Web3Utils"
import JaJanken from "../../../game/JaJanken"
import ColiseumMatch from "./ColiseumMatch"
import {CurrentMatch} from "../../../game/data/CurrentMatch"
import {PlayerStats} from "../../../game/data/PlayerStats"
import {GameStats} from "../../../game/data/GameStats"
import Lina from "../../../blockchain/Lina"
import {TechniqueImg} from "../../../resources/images"

enum GameState {
    NotValid,
    Loading,
    NeedPay,
    Lobby,
    LookingMatch,
    InMatch
}

interface JaJankenColiseumProperties extends RouteComponentProps {
    account: string,
    network: number
}

interface JaJankenColiseumState {
    account: string,
    jajankenColiseum: any,
    player: PlayerStats,
    game: GameStats,
    gameState: GameState,
    currentMatch: CurrentMatch | null
}

class JaJankenColiseum extends Component<JaJankenColiseumProperties, JaJankenColiseumState> {

    constructor(props: JaJankenColiseumProperties) {
        super(props)
        this.state = {
            account: props.account,
            jajankenColiseum: null,
            player: {
                inQueue: false,
                inMatch: null,
                nen: 0,
                guu: 0,
                paa: 0,
                chi: 0
            },
            game: {
                alivePlayers: 0,
                totalGuu: 0,
                totalPaa: 0,
                totalChi: 0
            },
            gameState: GameState.Loading,
            currentMatch: null
        }
    }

    async componentDidMount() {
        await this.loadColiseumData()
        await this.subscribeToGameEvents()
    }

    async componentWillReceiveProps(nextProps: JaJankenColiseumProperties) {
        this.setState({account: nextProps.account})
        await this.loadColiseumData()
        await this.subscribeToGameEvents()
    }

    async loadColiseumData() {
        const coliseum = await ContractLoader.instantiateColiseum()

        if (coliseum != null) {
            Web3Utils.setDefaultAccount(this.state.account)

            this.setState({jajankenColiseum: coliseum})

            JaJanken.getGameStats(coliseum).then(game => {
                    console.log("[init] game", game)
                    this.setState({
                        game: game
                    })
                }
            )

            JaJanken.getMyProfile(coliseum).then(profile => {
                console.log("[init] profile", profile)
                if (profile) {
                    if (profile.nen === 0) {
                        window.alert(`Account ${Lina.account()} has previously lost all his nen, please re-join the game first!`)
                        this.setState({gameState: GameState.NeedPay})
                    } else if (profile.inMatch != null) {
                        JaJanken.getMatch(coliseum, profile.inMatch).then(match => {
                            console.log("[init] match: ", match)
                            if (match != null) {
                                let opponentId = profile.inMatch === Lina.account() ? match.p2 : profile.inMatch
                                JaJanken.getOpponent(coliseum, opponentId).then(opponent => {
                                    console.log("[init] opponent: ", opponent)
                                    this.setState({
                                        player: profile,
                                        gameState: GameState.InMatch,
                                        currentMatch: {p1: profile.inMatch!, p2: match.p2, matchId: profile.inMatch!}
                                    })
                                })
                            }
                        })
                    } else if (profile.inQueue) {
                        this.setState({player: profile, gameState: GameState.LookingMatch})
                    } else {
                        this.setState({player: profile, gameState: GameState.Lobby})
                    }
                } else {
                    window.alert(`Account ${Lina.account()} do not exist yet, please join the game first!`)
                    this.setState({gameState: GameState.NeedPay})
                }
            })
            // JaJanken.getOpponent(coliseum, Lina.account()).then(opponent => {
            //     console.log("[test] me: ", opponent)
            // })
            // JaJanken.getMatch(coliseum, Lina.account()!).then(match => {
            //     console.log("[test] match: ", match)
            //     JaJanken.getOpponent(coliseum, match!.p2).then(opponent => {
            //         console.log("[test] opponent: ", opponent)
            //     })
            // })
        } else {
            this.setState({gameState: GameState.NotValid})
        }
    }

    handleStartMatch = (event: any) => {
        const data = event.returnValues
        this.setState({
            gameState: GameState.InMatch,
            currentMatch: {p1: data.p1, p2: data.p2, matchId: data.matchId}
        })
    }

    handlePlayerJoinGame = (event: any) => {
        const data = event.returnValues
        if (data.p === Lina.account()) {
            JaJanken.getMyProfile(this.state.jajankenColiseum).then(profile => {
                    if (profile) {
                        this.setState({player: profile})
                    }
                }
            )
            this.setState({gameState: GameState.Lobby})
        }
        JaJanken.getGameStats(this.state.jajankenColiseum).then(game => {
                this.setState({game: game})
            }
        )
    }

    async subscribeToGameEvents() {
        await this.state.jajankenColiseum

        if (this.state.jajankenColiseum) {
            this.state.jajankenColiseum.events.PlayerJoin()
                .on('data', this.handlePlayerJoinGame)
            this.state.jajankenColiseum.events.MatchStart({p1: Lina.account()})
                .on('data', this.handleStartMatch)
            this.state.jajankenColiseum.events.MatchStart({p2: Lina.account()})
                .on('data', this.handleStartMatch)
        }
    }

    joinColiseum = async () => {
        await JaJanken.joinColiseum(this.state.jajankenColiseum)
    }

    joinMatch = async () => {
        await JaJanken.joinMatchQueue(this.state.jajankenColiseum).then(data => {
            this.setState({gameState: GameState.LookingMatch})
        }).catch(error => console.log("failed join Match:", error))
    }

    backToLobby = () => {
        JaJanken.getMyProfile(this.state.jajankenColiseum).then(profile => {
                if (profile) {
                    this.setState({player: profile})
                }
            }
        )
        this.setState({gameState: GameState.Lobby})
        JaJanken.getGameStats(this.state.jajankenColiseum).then(game => {
                this.setState({game: game})
            }
        )
    }

    render() {
        let content
        if (this.state.gameState === GameState.Loading) {
            content = <p id="loader" className="text-center">Loading...</p>
        } else if (this.state.gameState === GameState.NeedPay) {
            content = <div>
                Welcome to the Coliseum {Lina.account()} !
                <div className="row">
                    <button className={"btn-light"} onClick={this.joinColiseum}>Join Coliseum</button>
                </div>
            </div>
        } else if (this.state.gameState === GameState.Lobby) {
            content = <div>
                Have fun in the Coliseum ! You got {this.state.player.nen} nen
                <div className="row">
                    <button className={"btn-light"} onClick={this.joinMatch}>Join Match!</button>
                </div>
            </div>
        } else if (this.state.gameState === GameState.LookingMatch) {
            content = <div>
                Looking for an opponent
            </div>
        } else if (this.state.gameState === GameState.InMatch) {
            if (this.state.currentMatch != null) {
                content = <div>
                    <ColiseumMatch jajankenColiseum={this.state.jajankenColiseum} backToLobby={this.backToLobby}
                                   currentMatch={this.state.currentMatch}/>
                </div>
            } else {
                content = <div className="row">
                    <button className={"btn-light"} onClick={this.backToLobby}>Back to Lobby!</button>
                </div>
            }
        } else if (this.state.gameState === GameState.NotValid) {
            content = <div>JaJanken Coliseum is not deployed on your selected network.</div>
        } else {
            content = <div>How did you get there?</div>
        }
        return <div>
            <div className="row">
                <div className="col-md-4">
                    Game state:
                    <ul>
                        <li>Players in-game: {this.state.game.alivePlayers}</li>
                        <li>total Guu: {this.state.game.totalGuu} <img src={TechniqueImg.guu} width={20} alt="guu"/></li>
                        <li>total Paa: {this.state.game.totalPaa} <img src={TechniqueImg.paa} width={20} alt="paa"/></li>
                        <li>Total Chi: {this.state.game.totalChi} <img src={TechniqueImg.chi} width={20} alt="chi"/></li>
                    </ul>
                </div>
                <div className="col-md-4">
                    Your Hand :
                    <ul>
                        <li>Life point: {this.state.player.nen}</li>
                        <li>total Guu: {this.state.player.guu} <img src={TechniqueImg.guu} width={20} alt="guu"/></li>
                        <li>total Paa: {this.state.player.paa} <img src={TechniqueImg.paa} width={20} alt="paa"/></li>
                        <li>total Chi: {this.state.player.chi} <img src={TechniqueImg.chi} width={20} alt="chi"/></li>
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    {content}
                </div>
            </div>
        </div>
    }
}

export default withRouter(JaJankenColiseum)