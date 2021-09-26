import React, {Component} from "react";
import NumberUtils from "../../utils/NumberUtils";
import {RouteComponentProps, withRouter} from "react-router-dom";
import ContractLoader from "../../blockchain/ContractLoader";
import Web3Utils from "../../blockchain/Web3Utils";


interface JaJankenColiseumProperties extends RouteComponentProps {
    account: String,
}

interface JaJankenColiseumState {
    account: String,
    jajankenColiseum: any,
    nenBalance: number,
    availableGuu: number,
    availablePaa: number,
    availableChi: number,
    loading: Boolean
}

class JaJankenColiseumView extends Component<JaJankenColiseumProperties, JaJankenColiseumState> {

    constructor(props: JaJankenColiseumProperties) {
        super(props)
        this.state = {
            account: props.account,
            jajankenColiseum: {},
            nenBalance: 0,
            availableGuu: 0,
            availablePaa: 0,
            availableChi: 0,
            loading: true
        }
    }

    async componentDidMount() {
        await this.loadColiseumData()
    }

    async loadColiseumData() {
        await Web3Utils.loadMetamask()
        let coliseum = await ContractLoader.instantiateColiseum()
        const accounts = await Web3Utils.getAccounts()
        this.setState({jajankenColiseum: coliseum, account: accounts[0]})
        let entranceTicket = await this.state.jajankenColiseum.methods.entranceTicketFee().call()
        console.log("entranceTicket", entranceTicket)
        let profile = await this.state.jajankenColiseum.methods.getProfile().call()
        console.log("profile", profile)
        if (profile) {
            let nen = NumberUtils.from(profile.nen)
            if (nen === 0) {
                window.alert(`Account ${this.state.account} has previously lost all his nen, please re-join the game first!`)
            }
            this.setState({
                nenBalance: nen,
                availableGuu: NumberUtils.from(profile.guu),
                availablePaa: NumberUtils.from(profile.paa),
                availableChi: NumberUtils.from(profile.chi)
            })
        } else {
            console.log(2)
            window.alert(`Account ${this.state.account} do not exist yet, please join the game first!`)
        }

        this.setState({loading: false})
    }

    joinColiseum = async () => {
        let entranceTicket = await this.state.jajankenColiseum.methods.entranceTicketFee().call()
        await this.state.jajankenColiseum.methods.joinGame().send({from: this.state.account, value: entranceTicket})
    }

    render() {
        if (this.state.loading) {
            return <p id="loader" className="text-center">Loading...</p>
        } else {
            return <div>
                In the Coliseum !

                <div className="row">
                    <button className={"btn-light"} onClick={this.joinColiseum}>Enter Coliseum</button>
                </div>
            </div>
        }
    }
}

export default withRouter(JaJankenColiseumView);