import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import ContractLoader from "../../../blockchain/ContractLoader";
import Web3Utils from "../../../blockchain/Web3Utils";
import Game from "../../../game/Game";
import ColiseumMatch from "./ColiseumMatch";
import {CurrentMatch} from "../../../game/data/CurrentMatch";
import {PlayerStats} from "../../../game/data/PlayerStats";
import {GameStats} from "../../../game/data/GameStats";

enum GameState {
    Loading,
    NeedPay,
    Lobby,
    LookingMatch,
    InMatch
}

interface JaJankenColiseumProperties extends RouteComponentProps {
    account: string,
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
            jajankenColiseum: {},
            player: {
                inQueue: false,
                inMatch: false,
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

    async loadColiseumData() {
        const accounts = await Web3Utils.getAccounts()
        const defaultAccount = accounts[0]
        const coliseum = await ContractLoader.instantiateColiseum()

        Web3Utils.setDefaultAccount(defaultAccount)

        this.setState({jajankenColiseum: coliseum, account: defaultAccount})

        Game.getGameStat(this.state.jajankenColiseum).then(game => {
                console.log("[init] game", game)
                this.setState({
                    game: game
                })
            }
        )

        Game.getMyProfile(coliseum).then(profile => {
            console.log("[init] profile", profile)
            if (profile) {
                if (profile.nen === 0) {
                    window.alert(`Account ${this.state.account} has previously lost all his nen, please re-join the game first!`)
                    this.setState({gameState: GameState.NeedPay})
                } else if (profile.inMatch) {
                    this.setState({player: profile, gameState: GameState.InMatch})
                } else if (profile.inQueue) {
                    this.setState({player: profile, gameState: GameState.LookingMatch})
                } else {
                    this.setState({player: profile, gameState: GameState.Lobby})
                }
            } else {
                window.alert(`Account ${this.state.account} do not exist yet, please join the game first!`)
                this.setState({gameState: GameState.NeedPay})
            }
        })
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
        if (data.p === this.state.account) {
            Game.getMyProfile(this.state.jajankenColiseum).then(profile => {
                    if (profile) {
                        this.setState({player: profile})
                    }
                }
            )
            this.setState({gameState: GameState.Lobby})
        }
        Game.getGameStat(this.state.jajankenColiseum).then(game => {
                this.setState({game: game})
            }
        )
    }

    async subscribeToGameEvents() {
        await this.state.jajankenColiseum

        this.state.jajankenColiseum.events.PlayerJoin()
            .on('data', this.handlePlayerJoinGame)
        this.state.jajankenColiseum.events.MatchStart({p1: this.state.account})
            .on('data', this.handleStartMatch)
        this.state.jajankenColiseum.events.MatchStart({p2: this.state.account})
            .on('data', this.handleStartMatch)
    }

    joinColiseum = async () => {
        await Game.joinColiseum(this.state.jajankenColiseum)
    }

    joinMatch = async () => {
        await Game.joinMatchQueue(this.state.jajankenColiseum).catch(error => console.log("failed join Match:", error))
    }

    backToLobby = () => {
        this.setState({gameState: GameState.Lobby})
    }

    render() {
        console.log("gamestate: ", this.state.game)
        if (this.state.gameState === GameState.Loading) {
            return <p id="loader" className="text-center">Loading...</p>
        } else if (this.state.gameState === GameState.NeedPay) {
            return <div>
                Welcome to the Coliseum {this.state.account} !
                <div className="row">
                    <button className={"btn-light"} onClick={this.joinColiseum}>Join Coliseum</button>
                </div>
            </div>
        } else if (this.state.gameState === GameState.Lobby) {
            return <div>
                Welcome to the Coliseum ! You got {this.state.player.nen} nen
                <div className="row">
                    <button className={"btn-light"} onClick={this.joinMatch}>Join Match!</button>
                </div>
            </div>
        } else if (this.state.gameState === GameState.LookingMatch) {
            return <div>
                Looking for an opponent
            </div>
        } else if (this.state.gameState === GameState.InMatch) {
            if (this.state.currentMatch != null) {
                return <div>
                    <ColiseumMatch account={this.state.account} jajankenColiseum={this.state.jajankenColiseum} backToLobby={this.backToLobby}
                                   currentMatch={this.state.currentMatch}/>
                </div>
            } else {
                <div className="row">
                    <button className={"btn-light"} onClick={this.backToLobby}>Back to Lobby!</button>
                </div>
            }
        } else {
            return <div>How did you get there?</div>
        }
    }
}

export default withRouter(JaJankenColiseum);