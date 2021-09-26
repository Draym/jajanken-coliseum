import React, {Component} from "react";
import NumberUtils from "../../../utils/NumberUtils";
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
        const coliseum = await ContractLoader.instantiateColiseum()
        this.setState({jajankenColiseum: coliseum, account: accounts[0]})

        const profile = await Game.getMyProfile(coliseum)
        console.log("profile", profile)
        if (profile) {
            let nen = NumberUtils.from(profile.nen)
            if (nen === 0) {
                window.alert(`Account ${this.state.account} has previously lost all his nen, please re-join the game first!`)
                this.setState({gameState: GameState.NeedPay})
            } else {
                this.setState({
                    player: profile,
                    gameState: GameState.Lobby
                })
            }
        } else {
            window.alert(`Account ${this.state.account} do not exist yet, please join the game first!`)
            this.setState({gameState: GameState.NeedPay})
        }
        Game.getGameStat(this.state.jajankenColiseum).then(game => {
                this.setState({
                    game: game
                })
            }
        )
    }

    handleStartMatch = (event: any) => {
        this.setState({
            gameState: GameState.InMatch,
            currentMatch: {p1: event.p1, p2: event.p2, matchId: event.matchId}
        })
    }

    handlePlayerJoinGame = (event: any) => {
        if (event.p == this.state.account) {
            Game.getMyProfile(this.state.jajankenColiseum).then(profile => {
                    if (profile) {
                        this.setState({
                            player: profile
                        })
                    }
                }
            )
        }
        Game.getGameStat(this.state.jajankenColiseum).then(game => {
                this.setState({
                    game: game
                })
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
        await Game.joinColiseum(this.state.jajankenColiseum, this.state.account)
    }

    joinMatch = async () => {
        await Game.joinMatchQueue(this.state.jajankenColiseum, this.state.account)
    }


    backToLobby = () => {
        this.setState({gameState: GameState.Lobby})
    }

    render() {
        if (this.state.gameState === GameState.Loading) {
            return <p id="loader" className="text-center">Loading...</p>
        } else if (this.state.gameState === GameState.NeedPay) {
            return <div>
                Welcome to the Coliseum !
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