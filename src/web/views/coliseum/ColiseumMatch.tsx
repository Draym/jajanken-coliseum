import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import JaJanken from "../../../game/JaJanken";
import {TechniqueImg} from "../../../resources/images";
import {CurrentMatch} from "../../../game/data/CurrentMatch";
import {JaJankenTechnique} from "../../../game/data/JaJankenTechnique";
import Lina from "../../../blockchain/Lina";


enum MatchState {
    Loading,
    PickPlay,
    Commit,
    Reveal,
    Result
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
    isVictory: boolean
}

class ColiseumMatch extends Component<ColiseumMatchProperties, ColiseumMatchState> {

    constructor(props: ColiseumMatchProperties) {
        super(props)

        this.state = {
            nenBalance: 0,
            availableGuu: 0,
            availablePaa: 0,
            availableChi: 0,
            currentPick: JaJankenTechnique.None,
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
            }
        )

        JaJanken.getOpponent(coliseum, this.state.match.p1 === Lina.account() ? this.state.match.p2 : this.state.match.p1).then(opponent => {
            console.log("[init] opponent: ", opponent)
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
        const data = event.returnValues
        this.setState({
            matchState: MatchState.Result,
            matchResult: {
                isVictory: data.winner === Lina.account(),
                opponent: data.p1 === Lina.account() ? data.p2 : data.p1,
                opponentPlayed: data.p1 === Lina.account() ? data.p2Played : data.p1Played,
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
        this.props.backToLobby()
    }

    pickGuu = () => {
        this.setState({currentPick: JaJankenTechnique.Guu, matchState: MatchState.Commit})
    }
    pickChi = () => {
        this.setState({currentPick: JaJankenTechnique.Chi, matchState: MatchState.Commit})
    }
    pickPaa = () => {
        this.setState({currentPick: JaJankenTechnique.Paa, matchState: MatchState.Commit})
    }

    commitPlay = async () => {
        await JaJanken.Player.commitPlay(this.props.jajankenColiseum, this.state.match.matchId, this.state.currentPick)
    }

    revealPlay = async () => {
        await JaJanken.Player.revealPlay(this.props.jajankenColiseum, this.state.match.matchId, this.state.currentPick)
    }

    render() {
        let currentPick = TechniqueImg.fromTechnique(this.state.currentPick)

        if (this.state.matchState === MatchState.Loading) {
            return <p id="loader" className="text-center">Loading...</p>
        } else if (this.state.matchState === MatchState.PickPlay) {
            return <div>
                <img src={TechniqueImg.guu} width={200} alt="guu" onClick={this.pickGuu}/>
                <img src={TechniqueImg.chi} width={200} alt="chi" onClick={this.pickChi}/>
                <img src={TechniqueImg.paa} width={200} alt="paa" onClick={this.pickPaa}/>
            </div>
        } else if (this.state.matchState === MatchState.Commit) {
            return <div className="row">
                <img src={currentPick} width={300} alt="currentPicket"/>
                <button className={"btn-light"} onClick={this.commitPlay}>Commit play!</button>
            </div>
        } else if (this.state.matchState === MatchState.Reveal) {
            return <div className="row">
                <img src={currentPick} width={300} alt="currentPicket"/>
                <button className={"btn-light"} onClick={this.revealPlay}>Fight!</button>
            </div>
        } else if (this.state.matchState === MatchState.Result) {
            let opponentPick = TechniqueImg.fromTechnique(this.state.matchResult!.opponentPlayed)
            return <div className="row">
                <div className="row">
                    <img src={currentPick} width={300} alt="currentPicket"/>
                    <span>...VS...</span>
                    <img src={opponentPick} width={300} alt="currentPicket"/>
                </div>
                <div className="row">
                    <h2>You {this.state.matchResult!.isVictory ? "Win!" : "Loose :/"}</h2>
                    <button className={"btn-light"} onClick={this.backToLobby}>Back to Lobby!</button>
                </div>
            </div>
        } else {
            return <div>How did you get there?</div>
        }
    }
}

export default withRouter(ColiseumMatch);