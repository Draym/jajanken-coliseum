import React, {Component} from "react";
import {RouteComponentProps, withRouter} from "react-router-dom";
import Game from "../../../game/Game";
import NumberUtils from "../../../utils/NumberUtils";
import {TechniqueImg} from "../../../resources/images";
import {CurrentMatch} from "../../../game/data/CurrentMatch";


enum MatchState {
    Loading,
    PickPlay,
    Commit,
    Reveal,
    Result
}

interface ColiseumMatchProperties extends RouteComponentProps {
    account: String,
    jajankenColiseum: any,
    currentMatch: CurrentMatch,
    backToLobby: () => void
}

interface ColiseumMatchState {
    nenBalance: number,
    availableGuu: number,
    availablePaa: number,
    availableChi: number,
    matchState: MatchState
}

class ColiseumMatch extends Component<ColiseumMatchProperties, ColiseumMatchState> {

    constructor(props: ColiseumMatchProperties) {
        super(props)
        this.state = {
            nenBalance: 0,
            availableGuu: 0,
            availablePaa: 0,
            availableChi: 0,
            matchState: MatchState.Loading
        }
    }

    async componentDidMount() {
        await this.loadColiseumData()
    }

    async loadColiseumData() {
        let coliseum = await this.props.jajankenColiseum
        let profile = await Game.getMyProfile(coliseum)
        if (profile) {
            let nen = NumberUtils.from(profile.nen)
            if (nen === 0) {
                this.setState({matchState: MatchState.Result})
                window.alert(`Account ${this.props.account} has previously lost all his nen, please re-join the game first!`)
            }
            this.setState({
                nenBalance: nen,
                availableGuu: NumberUtils.from(profile.guu),
                availablePaa: NumberUtils.from(profile.paa),
                availableChi: NumberUtils.from(profile.chi),
                matchState: MatchState.PickPlay
            })
        } else {
            this.setState({matchState: MatchState.Result})
            window.alert(`Account ${this.props.account} do not exist yet, please join the game first!`)
        }
    }

    render() {
        return <div>
            <img src={TechniqueImg.guu} width={300} alt="error with messenger QR code."/>
        </div>
    }
}

export default withRouter(ColiseumMatch);