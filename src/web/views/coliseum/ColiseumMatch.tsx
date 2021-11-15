import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import JaJanken from "../../../game/JaJanken";
import {TechniqueImg} from "../../../resources/images";
import {CurrentMatch} from "../../../game/data/CurrentMatch";
import {JaJankenTechnique} from "../../../game/data/JaJankenTechnique";
import Lina from "../../../blockchain/Lina";
import Web3Utils from "../../../blockchain/Web3Utils";


enum MatchState {
    Loading,
    PickPlay,
    Commit,
    CommitWait,
    Reveal,
    RevealWait,
    Result,
    MatchEnded
}

enum MatchEnding {
    WINNER,
    LOOSER,
    DRAW
}


interface ColiseumMatchProperties extends RouteComponentProps {
    jajankenColiseum: any,
    currentMatch: CurrentMatch,
    backToLobby: () => void
}

interface ColiseumMatchState {
    nenBalance: number,
    availableGuu: number,
    availablePaa: number,
    availableChi: number,
    currentPick: JaJankenTechnique,
    match: CurrentMatch,
    matchState: MatchState,
    matchResult: MatchResult | null
}

interface MatchResult {
    opponent: string,
    opponentPlayed: JaJankenTechnique,
    winner: string,
    result: MatchEnding
}

class ColiseumMatch extends Component<ColiseumMatchProperties, ColiseumMatchState> {

    constructor(props: ColiseumMatchProperties) {
        super(props)

        this.state = {
            nenBalance: 0,
            availableGuu: 0,
            availablePaa: 0,
            availableChi: 0,
            currentPick: JaJanken.Player.getPlayed(),
            match: props.currentMatch,
            matchState: MatchState.Loading,
            matchResult: null
        }
    }

    async componentDidMount() {
        await this.loadColiseumData()
        await this.subscribeToGameEvents()
    }

    async loadColiseumData() {
        let coliseum = await this.props.jajankenColiseum
        JaJanken.getMyProfile(coliseum).then(profile => {
                if (profile) {
                    if (profile.nen === 0) {
                        this.setState({matchState: MatchState.Result})
                        window.alert(`Account ${Lina.account()} has previously lost all his nen, please re-join the game first!`)
                    } else if (profile.chi === 0 && profile.paa === 0 && profile.guu === 0) {
                        this.setState({matchState: MatchState.Result})
                        window.alert(`Account ${Lina.account()} has no card to play, you can withdraw you gain or re-join the game!`)
                    } else {
                        this.setState({
                            nenBalance: profile.nen,
                            availableGuu: profile.guu,
                            availablePaa: profile.paa,
                            availableChi: profile.chi,
                            matchState: MatchState.PickPlay
                        })
                    }
                } else {
                    this.setState({matchState: MatchState.Result})
                    window.alert(`Account ${Lina.account()} do not exist yet, please join the game first!`)
                }

                JaJanken.getMatch(coliseum, this.state.match.matchId).then(match => {
                    console.log("{match}[init] match: ", match)
                    if (match != null) {
                        let meHidden;
                        let opHidden;
                        let meRevealed;
                        let opRevealed;


                        if (match.p2 === Web3Utils.nullAddress()) {
                            this.setState({matchState: MatchState.MatchEnded})
                        } else {
                            if (Lina.account() === this.state.match.matchId) {
                                meHidden = match.p1Hidden
                                opHidden = match.p2Hidden
                                meRevealed = match.p1Revealed
                                opRevealed = match.p2Revealed
                            } else {
                                meHidden = match.p2Hidden
                                opHidden = match.p1Hidden
                                meRevealed = match.p2Revealed
                                opRevealed = match.p1Revealed
                            }

                            if (meRevealed !== JaJankenTechnique.None) {
                                if (opRevealed !== JaJankenTechnique.None) {
                                    this.setState({matchState: MatchState.Result})
                                } else {
                                    this.setState({matchState: MatchState.RevealWait})
                                }
                            } else {
                                if (opRevealed !== JaJankenTechnique.None) {
                                    this.setState({matchState: MatchState.Reveal})
                                } else {
                                    if (meHidden !== Web3Utils.nullBytes()) {
                                        if (opHidden !== Web3Utils.nullBytes()) {
                                            this.setState({matchState: MatchState.Reveal})
                                        } else {
                                            this.setState({matchState: MatchState.CommitWait})
                                        }
                                    } else {
                                        this.setState({
                                            currentPick: JaJanken.Player.getPlayed(),
                                            matchState: JaJanken.Player.getPlayed() !== JaJankenTechnique.None ? MatchState.Commit : MatchState.PickPlay
                                        })
                                    }
                                }
                            }
                        }
                    }
                })
            }
        )

        JaJanken.getOpponent(coliseum, this.state.match.p1 === Lina.account() ? this.state.match.p2 : this.state.match.p1).then(opponent => {
            console.log("[test] opponent: ", opponent)
        })
    }

    async subscribeToGameEvents() {
        await this.props.jajankenColiseum

        this.props.jajankenColiseum.events.MatchEnd({p1: Lina.account()})
            .on('data', this.handleMatchEnd)
        this.props.jajankenColiseum.events.MatchEnd({p2: Lina.account()})
            .on('data', this.handleMatchEnd)
        this.props.jajankenColiseum.events.MatchPlayed({matchId: this.state.match.matchId})
            .on('data', this.handleMatchPlayed)
    }

    handleMatchEnd = (event: any) => {
        JaJanken.Player.savePlay(JaJankenTechnique.None)
        const data = event.returnValues
        this.setState({
            matchState: MatchState.Result,
            matchResult: {
                result: data.winner === Web3Utils.nullAddress() ? MatchEnding.DRAW : (data.winner === Lina.account() ? MatchEnding.WINNER : MatchEnding.LOOSER),
                opponent: data.p1 === Lina.account() ? data.p2 : data.p1,
                opponentPlayed: data.p1 === Lina.account() ? parseInt(data.p2Played) : parseInt(data.p1Played),
                winner: data.winner
            }
        })
    }

    handleMatchPlayed = (_: any) => {
        this.setState({
            matchState: MatchState.Reveal
        })
    }

    backToLobby = () => {
        this.setState({currentPick: JaJankenTechnique.None})
        this.props.backToLobby()
    }

    backToPickPlay = () => {
        JaJanken.Player.savePlay(JaJankenTechnique.None)
        this.setState({currentPick: JaJankenTechnique.None, matchState: MatchState.PickPlay})
    }

    pickGuu = () => {
        JaJanken.Player.savePlay(JaJankenTechnique.Guu)
        this.setState({currentPick: JaJankenTechnique.Guu, matchState: MatchState.Commit})
    }
    pickChi = () => {
        JaJanken.Player.savePlay(JaJankenTechnique.Chi)
        this.setState({currentPick: JaJankenTechnique.Chi, matchState: MatchState.Commit})
    }
    pickPaa = () => {
        JaJanken.Player.savePlay(JaJankenTechnique.Paa)
        this.setState({currentPick: JaJankenTechnique.Paa, matchState: MatchState.Commit})
    }

    commitPlay = async () => {
        JaJanken.Player.commitPlay(this.props.jajankenColiseum, this.state.match.matchId, this.state.currentPick).then(_ => {
            this.setState({matchState: MatchState.CommitWait})
        })
    }

    revealPlay = async () => {
        await JaJanken.Player.revealPlay(this.props.jajankenColiseum, this.state.match.matchId, this.state.currentPick).then(_ => {
            this.setState({matchState: MatchState.RevealWait})
        })
    }

    render() {
        let currentPick = TechniqueImg.fromTechnique(this.state.currentPick)

        let matchState = () => {
            if (this.state.matchState === MatchState.Loading) {
                return <p id="loader" className="text-center">Loading...</p>
            } else if (this.state.matchState === MatchState.PickPlay) {
                return <div>
                    <button onClick={this.pickGuu} disabled={this.state.availableGuu === 0}><img className={this.state.availableGuu === 0 ? "img-disabled" : ""} src={TechniqueImg.guu} width={200} alt="guu"/></button>
                    <button onClick={this.pickChi} disabled={this.state.availableChi === 0}><img className={this.state.availableChi === 0 ? "img-disabled" : ""} src={TechniqueImg.chi} width={200} alt="chi"/></button>
                    <button onClick={this.pickPaa} disabled={this.state.availablePaa === 0}><img className={this.state.availablePaa === 0 ? "img-disabled" : ""} src={TechniqueImg.paa} width={200} alt="paa"/></button>
                </div>
            } else if (this.state.matchState === MatchState.Commit) {
                return <div>
                    <img src={currentPick} width={300} alt="currentPicket"/>
                    <button className={"btn-light"} onClick={this.commitPlay}>Commit play!</button>
                    <div>
                        <button className={"btn-light"} onClick={this.backToPickPlay}>Back to PickPlay</button>
                    </div>
                </div>
            } else if (this.state.matchState === MatchState.Reveal) {
                return <div>
                    <img src={currentPick} width={300} alt="currentPicket"/>
                    <button className={"btn-light"} onClick={this.revealPlay}>Fight!</button>
                </div>
            } else if (this.state.matchState === MatchState.Result) {
                let opponentPick = TechniqueImg.fromTechnique(this.state.matchResult!.opponentPlayed)
                return <div className="row">
                    <div>
                        <img src={currentPick} width={300} alt="currentPicket"/>
                        <span>...VS...</span>
                        <img src={opponentPick} width={300} alt="currentPicket"/>
                    </div>
                    <div>
                        <h2>You {this.state.matchResult!.result === MatchEnding.WINNER ? "Win!" : (this.state.matchResult!.result === MatchEnding.LOOSER ? "Loose :/" : "Equality")}</h2>
                        <button className={"btn-light"} onClick={this.backToLobby}>Back to Lobby!</button>
                    </div>
                </div>
            } else if (this.state.matchState === MatchState.CommitWait || this.state.matchState === MatchState.RevealWait) {
                return <div>
                    <img src={currentPick} width={300} alt="currentPicket"/>
                    <span className={"btn-light"}>waiting for opponent {this.state.matchState === MatchState.CommitWait ? "commit" : "reveal"}</span>
                </div>
            } else if (this.state.matchState === MatchState.MatchEnded) {
                return <div>
                    <h4>Match is already finished</h4>
                    <button className={"btn-light"} onClick={this.backToLobby}>Back to Lobby!</button>
                </div>
            } else {
                return <div>How did you get there?</div>
            }
        }

        return <div>
            <h4>Profile ({this.state.nenBalance}Nen): [{this.state.availableGuu} Guu][{this.state.availableChi} Chi][{this.state.availablePaa} Paa]</h4>
            {matchState()}
        </div>
    }
}

export default withRouter(ColiseumMatch);